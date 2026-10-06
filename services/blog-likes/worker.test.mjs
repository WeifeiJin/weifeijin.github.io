import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import worker from './worker.mjs';
import { createLocalDatabase } from './sqlite-adapter.mjs';

const ORIGIN = 'https://weifeijin.com';
const LEGACY_ORIGIN = 'https://weifeijin.github.io';
const SLUG = 'from-research-to-researcher';
const URL = `https://likes.example/likes/${SLUG}`;

function fixture(t, overrides = {}) {
  const DB = createLocalDatabase();
  t.after(() => DB.close());
  const env = { DB, SITE_ORIGIN: ORIGIN, TRANSITION_ORIGIN: LEGACY_ORIGIN, ENVIRONMENT: 'production', ALLOWED_SLUGS: SLUG, ...overrides };
  const call = async (method = 'GET', body, options = {}) => {
    const response = await worker.fetch(new Request(options.url || URL, {
      method,
      headers: { Origin: ORIGIN, ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...options.headers },
      ...(body !== undefined ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}),
    }), env);
    return { response, body: response.status === 204 ? null : await response.json() };
  };
  return { DB, call };
}

test('repeated like, unlike, and re-like are idempotent and persist server state', async t => {
  const { call } = fixture(t);
  const visitor = randomUUID();
  assert.deepEqual((await call('PUT', { visitor, liked: true })).body, { count: 1, liked: true });
  for (let retry = 0; retry < 3; retry++) {
    assert.deepEqual((await call('PUT', { visitor, liked: true })).body, { count: 1, liked: true });
  }
  assert.deepEqual((await call('GET', undefined, { url: `${URL}?visitor=${visitor}` })).body, { count: 1, liked: true });
  for (let retry = 0; retry < 2; retry++) {
    assert.deepEqual((await call('PUT', { visitor, liked: false })).body, { count: 0, liked: false });
  }
  assert.deepEqual((await call('PUT', { visitor, liked: true })).body, { count: 1, liked: true });
});

test('two visitors share one count and only remove their own like', async t => {
  const { call } = fixture(t);
  const first = randomUUID();
  const second = randomUUID();
  await call('PUT', { visitor: first, liked: true });
  assert.deepEqual((await call('PUT', { visitor: second, liked: true })).body, { count: 2, liked: true });
  assert.deepEqual((await call('PUT', { visitor: first, liked: false })).body, { count: 1, liked: false });
  assert.deepEqual((await call('GET', undefined, { url: `${URL}?visitor=${second}` })).body, { count: 1, liked: true });
});

test('the new and explicit legacy origins share existing visitor state and count', async t => {
  const { call } = fixture(t);
  const visitor = randomUUID();
  assert.deepEqual((await call('PUT', { visitor, liked: true })).body, { count: 1, liked: true });
  const legacyState = await call('GET', undefined, { url: `${URL}?visitor=${visitor}`, headers: { Origin: LEGACY_ORIGIN } });
  assert.equal(legacyState.response.headers.get('Access-Control-Allow-Origin'), LEGACY_ORIGIN);
  assert.deepEqual(legacyState.body, { count: 1, liked: true });
  assert.deepEqual((await call('PUT', { visitor, liked: true }, { headers: { Origin: LEGACY_ORIGIN } })).body, { count: 1, liked: true });
  assert.deepEqual((await call('PUT', { visitor, liked: false })).body, { count: 0, liked: false });
});

test('legacy access can be disabled without accepting another transition origin', async t => {
  const { call } = fixture(t, { TRANSITION_ORIGIN: '' });
  assert.equal((await call('GET')).response.status, 200);
  assert.equal((await call('GET', undefined, { headers: { Origin: LEGACY_ORIGIN } })).response.status, 403);
});

test('noncanonical, non-HTTPS, and foreign transition configuration fails closed', async t => {
  for (const origin of [LEGACY_ORIGIN + '/', LEGACY_ORIGIN + ':443', LEGACY_ORIGIN + '/blog/', 'http://weifeijin.github.io', 'https://evil.example', 'https://localhost', 'http://localhost:4321', LEGACY_ORIGIN + ',https://evil.example']) {
    const { call, DB } = fixture(t, { TRANSITION_ORIGIN: origin });
    assert.equal((await call('PUT', { visitor: randomUUID(), liked: true })).response.status, 503);
    assert.equal(DB.sqlite.prepare('SELECT COUNT(*) AS count FROM article_likes').get().count, 0);
  }
});

test('production site configuration must also be an exact HTTPS origin', async t => {
  for (const origin of [ORIGIN + '/', ORIGIN + '/blog/', 'http://weifeijin.com', 'https://localhost', 'https://127.0.0.1', 'https://[::1]']) {
    const { call } = fixture(t, { SITE_ORIGIN: origin });
    assert.equal((await call('GET')).response.status, 503);
  }
});

test('concurrent retries cannot inflate the count', async t => {
  const { call } = fixture(t);
  const visitor = randomUUID();
  const replies = await Promise.all(Array.from({ length: 20 }, () => call('PUT', { visitor, liked: true })));
  for (const reply of replies) assert.deepEqual(reply.body, { count: 1, liked: true });
  assert.deepEqual((await call()).body, { count: 1, liked: false });
});

test('reading never writes and UUIDs are hashed before storage', async t => {
  const { call, DB } = fixture(t);
  const visitor = randomUUID();
  assert.deepEqual((await call()).body, { count: 0, liked: false });
  assert.equal(DB.sqlite.prepare('SELECT COUNT(*) AS count FROM article_likes').get().count, 0);
  await call('PUT', { visitor, liked: true });
  const before = DB.sqlite.prepare('SELECT * FROM article_likes').all();
  assert.match(before[0].visitor_hash, /^[a-f0-9]{64}$/);
  assert.equal(before[0].article_slug, SLUG);
  assert.notEqual(before[0].visitor_hash, visitor);
  assert.deepEqual((await call('GET', undefined, { url: `${URL}?visitor=${visitor.toUpperCase()}` })).body, { count: 1, liked: true });
  assert.deepEqual(DB.sqlite.prepare('SELECT * FROM article_likes').all(), before);
});

test('production rejects foreign, missing, and localhost origins before mutation', async t => {
  const { call, DB } = fixture(t, { DEV_ORIGINS: 'http://localhost:4321' });
  for (const origin of ['https://evil.example', 'null', '', 'http://localhost:4321', 'https://localhost', 'http://weifeijin.com', 'https://www.weifeijin.com', 'https://likes.weifeijin.com', `${ORIGIN}/`, `${ORIGIN}.evil.example`, `${LEGACY_ORIGIN}.evil.example`]) {
    const result = await call('PUT', { visitor: randomUUID(), liked: true }, { headers: { Origin: origin } });
    assert.equal(result.response.status, 403);
    assert.equal(result.response.headers.has('Access-Control-Allow-Origin'), false);
  }
  assert.equal(DB.sqlite.prepare('SELECT COUNT(*) AS count FROM article_likes').get().count, 0);
});

test('loopback origins require explicit development configuration', async t => {
  const { call } = fixture(t, { ENVIRONMENT: 'development', DEV_ORIGINS: 'http://localhost:4321' });
  const accepted = await call('GET', undefined, { headers: { Origin: 'http://localhost:4321' } });
  assert.equal(accepted.response.status, 200);
  assert.equal(accepted.response.headers.get('Access-Control-Allow-Origin'), 'http://localhost:4321');
  assert.equal((await call('GET', undefined, { headers: { Origin: 'http://localhost:4322' } })).response.status, 403);
});

test('CORS preflight allows only the supported method and header', async t => {
  const { call } = fixture(t);
  for (const origin of [ORIGIN, LEGACY_ORIGIN]) {
    const allowed = await call('OPTIONS', undefined, { headers: { Origin: origin, 'Access-Control-Request-Method': 'PUT', 'Access-Control-Request-Headers': 'content-type' } });
    assert.equal(allowed.response.status, 204);
    assert.equal(allowed.response.headers.get('Access-Control-Allow-Origin'), origin);
    assert.equal(allowed.response.headers.has('Access-Control-Allow-Credentials'), false);
  }
  assert.equal((await call('OPTIONS', undefined, { headers: { Origin: 'https://evil.example', 'Access-Control-Request-Method': 'PUT' } })).response.status, 403);
  assert.equal((await call('OPTIONS', undefined, { headers: { 'Access-Control-Request-Method': 'DELETE' } })).response.status, 403);
  assert.equal((await call('OPTIONS', undefined, { headers: { 'Access-Control-Request-Method': 'PUT', 'Access-Control-Request-Headers': 'authorization' } })).response.status, 403);
});

test('unknown or malformed article paths and unsupported methods are rejected', async t => {
  const { call } = fixture(t);
  for (const path of ['/likes/unlisted', `/likes/${SLUG}/`, `/likes/${SLUG}%2f`, '/likes/../unlisted']) {
    assert.equal((await call('GET', undefined, { url: `https://likes.example${path}` })).response.status, 404);
  }
  assert.equal((await call('DELETE')).response.status, 405);
});

test('invalid inputs cannot alter the count', async t => {
  const { call, DB } = fixture(t);
  const visitor = randomUUID();
  for (const body of [{ visitor, liked: 'true' }, { visitor: 'not-a-uuid', liked: true }, { visitor: 123, liked: true }, { visitor: [visitor], liked: true }, { visitor, liked: true, extra: 1 }, [], null, '{not json']) {
    assert.equal((await call('PUT', body)).response.status, 400);
  }
  assert.equal((await call('PUT', { visitor, liked: true }, { headers: { 'Content-Type': 'text/plain' } })).response.status, 415);
  assert.equal((await call('PUT', ' '.repeat(513))).response.status, 413);
  assert.equal((await call('PUT', { visitor, liked: true }, { headers: { 'Content-Length': '1000' } })).response.status, 413);
  assert.equal((await call('GET', undefined, { url: `${URL}?visitor=invalid` })).response.status, 400);
  assert.equal((await call('GET', undefined, { url: `${URL}?visitor=${visitor}&visitor=${visitor}` })).response.status, 400);
  assert.equal((await call('GET', undefined, { url: `${URL}?article=other` })).response.status, 400);
  assert.equal((await call('PUT', { visitor, liked: true }, { url: `${URL}?visitor=${visitor}` })).response.status, 400);
  assert.equal(DB.sqlite.prepare('SELECT COUNT(*) AS count FROM article_likes').get().count, 0);
});

test('database failures return a controlled unavailable response', async t => {
  const { call } = fixture(t, { DB: { prepare() { throw new Error('private details'); } } });
  const reply = await call();
  assert.equal(reply.response.status, 503);
  assert.deepEqual(reply.body, { error: 'Likes are temporarily unavailable' });
});
