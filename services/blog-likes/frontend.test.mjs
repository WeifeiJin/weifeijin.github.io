import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { webcrypto } from 'node:crypto';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../../src/components/BlogLike.astro', import.meta.url), 'utf8');
const script = ts.transpileModule(source.match(/<script>([\s\S]*?)<\/script>/)[1], {
  compilerOptions: { target: ts.ScriptTarget.ES2020 },
}).outputText;
const visitorKey = 'weifei-blog-like-visitor';
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const settle = () => new Promise(resolve => setImmediate(resolve));

function browser({ fetchResponse, storage = new Map(), blockStorage = false } = {}) {
  const clickHandlers = {};
  const attributes = new Map();
  const timers = new Map();
  const calls = [];
  let nextTimer = 0;
  const button = {
    disabled: true,
    setAttribute: (key, value) => attributes.set(key, value),
    removeAttribute: key => attributes.delete(key),
    addEventListener: (key, handler) => { clickHandlers[key] = handler; },
  };
  const counter = { textContent: '—' };
  const status = { hidden: true, textContent: '' };
  const element = {
    dataset: {
      slug: 'from-research-to-researcher', language: 'zh',
      api: 'https://weifeijin-blog-likes.ninedreamwf.workers.dev',
      siteOrigin: 'https://weifeijin.github.io',
    },
    querySelector: selector => selector === 'button' ? button : selector === '[data-like-count]' ? counter : status,
  };
  let liked = false;
  runInNewContext(script, {
    document: { querySelectorAll: () => [element], addEventListener() {} },
    window: { addEventListener() {} },
    location: { href: 'https://weifeijin.github.io/blog/from-research-to-researcher/', origin: 'https://weifeijin.github.io' },
    URL, Intl, AbortController,
    // Deliberately omit AbortSignal.timeout and crypto.randomUUID, as on older browsers.
    crypto: { getRandomValues: webcrypto.getRandomValues.bind(webcrypto) },
    localStorage: {
      getItem(key) { if (blockStorage) throw new Error('Storage blocked'); return storage.get(key) ?? null; },
      setItem(key, value) { if (blockStorage) throw new Error('Storage blocked'); storage.set(key, value); },
    },
    setTimeout(handler, delay) { const id = ++nextTimer; timers.set(id, { handler, delay }); return id; },
    clearTimeout: id => timers.delete(id),
    fetch: async (url, options) => {
      const call = { url, options };
      calls.push(call);
      if (fetchResponse) return fetchResponse(call, calls.length);
      if (options.method === 'PUT') liked = JSON.parse(options.body).liked;
      return { ok: true, json: async () => ({ count: liked ? 4 : 3, liked }) };
    },
  });
  return { button, counter, status, attributes, calls, storage, timers, click: () => clickHandlers.click() };
}

test('older browsers can load, like, and unlike without AbortSignal.timeout or randomUUID', async () => {
  const ui = browser();
  await settle();
  assert.equal(ui.counter.textContent, '3');
  assert.equal(ui.status.hidden, true);
  assert.equal(ui.timers.size, 0);

  await ui.click();
  const visitor = ui.storage.get(visitorKey);
  assert.match(visitor, uuidPattern);
  assert.equal(ui.counter.textContent, '4');
  assert.equal(ui.attributes.get('aria-pressed'), 'true');
  assert.equal(JSON.parse(ui.calls[1].options.body).visitor, visitor);

  await ui.click();
  assert.equal(ui.counter.textContent, '3');
  assert.equal(ui.attributes.get('aria-pressed'), 'false');
  assert.equal(JSON.parse(ui.calls[2].options.body).visitor, visitor);
  assert.equal(ui.storage.get(visitorKey), visitor);
  assert.equal(ui.timers.size, 0);
});

test('blocked storage still permits reading the shared count and prevents an untracked vote', async () => {
  const ui = browser({ blockStorage: true });
  await settle();
  assert.equal(ui.counter.textContent, '3');
  assert.equal(ui.status.hidden, true);
  assert.equal(ui.button.disabled, false);

  await ui.click();
  assert.equal(ui.calls.length, 1);
  assert.equal(ui.status.hidden, false);
  assert.equal(ui.status.textContent, '请允许浏览器存储后再点赞');
  assert.equal(ui.counter.textContent, '3');
});

test('the timeout covers stalled response bodies, releases the button, and allows retry', async () => {
  const ui = browser({
    fetchResponse: ({ options }, callNumber) => ({
      ok: true,
      json: () => callNumber > 1
        ? Promise.resolve({ count: 3, liked: false })
        : new Promise((resolve, reject) => options.signal.addEventListener('abort', () => reject(new Error('Aborted')))),
    }),
  });
  await settle();
  assert.equal(ui.button.disabled, true);
  assert.equal(ui.timers.size, 1);
  const timeout = [...ui.timers.values()][0];
  assert.equal(timeout.delay, 8000);
  timeout.handler();
  await settle();
  assert.equal(ui.calls[0].options.signal.aborted, true);
  assert.equal(ui.timers.size, 0);
  assert.equal(ui.button.disabled, false);
  assert.equal(ui.status.textContent, '暂时无法加载点赞，点击爱心重试');

  await ui.click();
  assert.equal(ui.counter.textContent, '3');
  assert.equal(ui.status.hidden, true);
  assert.equal(ui.calls[1].options.method, 'GET');
  assert.equal(ui.timers.size, 0);
});

test('a lost response after a committed vote recovers authoritative state without another write', async () => {
  let liked = false;
  const ui = browser({
    fetchResponse: ({ options }) => {
      if (options.method === 'PUT') {
        liked = JSON.parse(options.body).liked;
        throw new Error('Connection lost after commit');
      }
      return { ok: true, json: async () => ({ count: liked ? 4 : 3, liked }) };
    },
  });
  await settle();
  await ui.click();
  assert.equal(ui.counter.textContent, '4');
  assert.equal(ui.attributes.get('aria-pressed'), 'true');
  assert.equal(ui.status.hidden, true);
  assert.equal(ui.calls.filter(call => call.options.method === 'PUT').length, 1);
  assert.equal(ui.calls.length, 3);
  assert.equal(ui.timers.size, 0);
});
