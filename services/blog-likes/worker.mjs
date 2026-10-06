const MAX_BODY_BYTES = 512;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const VISITOR_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const LEGACY_SITE_ORIGIN = 'https://weifeijin.github.io';

function exactHttpsOrigin(origin) {
  const url = new URL(origin);
  if (url.origin !== origin || url.protocol !== 'https:' || ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) {
    throw new Error('Production origins must be exact non-loopback HTTPS origins');
  }
  return origin;
}

function allowedOrigins(env) {
  const origins = new Set([exactHttpsOrigin(env.SITE_ORIGIN)]);
  if (env.TRANSITION_ORIGIN) {
    const origin = exactHttpsOrigin(env.TRANSITION_ORIGIN);
    if (origin !== LEGACY_SITE_ORIGIN) throw new Error('Only the original GitHub Pages origin may be used during transition');
    origins.add(origin);
  }
  // The Pages certificate may lag behind custom-domain DNS. Only permit the
  // HTTP counterparts of the exact approved sites while explicitly enabled.
  if (env.ALLOW_HTTP_TRANSITION === 'true') {
    for (const origin of [...origins]) origins.add(origin.replace(/^https:/, 'http:'));
  }
  if (env.ENVIRONMENT === 'development') {
    for (const value of (env.DEV_ORIGINS || '').split(',').filter(Boolean)) {
      const origin = value.trim();
      const url = new URL(origin);
      if (url.origin !== origin || url.protocol !== 'http:' || !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) {
        throw new Error('Development origins must be exact loopback HTTP origins');
      }
      origins.add(origin);
    }
  }
  return origins;
}

function headers(origin) {
  const result = new Headers({
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
    'Vary': 'Origin',
    'X-Content-Type-Options': 'nosniff',
  });
  if (origin) result.set('Access-Control-Allow-Origin', origin);
  return result;
}

function json(body, status, origin, extraHeaders = {}) {
  const responseHeaders = headers(origin);
  for (const [key, value] of Object.entries(extraHeaders)) responseHeaders.set(key, value);
  return new Response(JSON.stringify(body), { status, headers: responseHeaders });
}

async function readBody(request) {
  const declaredLength = request.headers.get('Content-Length');
  if (declaredLength !== null && (!/^\d+$/.test(declaredLength) || Number(declaredLength) > MAX_BODY_BYTES)) {
    return { error: 'Request body is too large', status: 413 };
  }
  if (!request.body) return { error: 'A JSON body is required', status: 400 };
  const reader = request.body.getReader();
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BODY_BYTES) {
        await reader.cancel();
        return { error: 'Request body is too large', status: 413 };
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return { body: JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)) };
  } catch {
    return { error: 'Invalid JSON body', status: 400 };
  } finally {
    reader.releaseLock();
  }
}

async function visitorHash(slug, visitor) {
  const bytes = new TextEncoder().encode(`blog-likes-v1:${slug}:${visitor.toLowerCase()}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

function stateStatement(db, slug, hash) {
  // Both fields come from one SQL statement and one database snapshot.
  return db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM article_likes WHERE article_slug = ?1) AS count,
      EXISTS(SELECT 1 FROM article_likes WHERE article_slug = ?1 AND visitor_hash = ?2) AS liked
  `).bind(slug, hash);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    try {
      if (!origin || !allowedOrigins(env).has(origin)) return json({ error: 'Origin is not allowed' }, 403);
    } catch {
      return json({ error: 'Likes are temporarily unavailable' }, 503);
    }

    const url = new URL(request.url);
    const match = /^\/likes\/([a-z0-9-]{1,100})$/.exec(url.pathname);
    const slug = match?.[1];
    const slugs = new Set((env.ALLOWED_SLUGS || '').split(',').map(value => value.trim()).filter(Boolean));
    if (!slug || !SLUG_PATTERN.test(slug) || !slugs.has(slug)) return json({ error: 'Article not found' }, 404, origin);

    if (request.method === 'OPTIONS') {
      const method = request.headers.get('Access-Control-Request-Method');
      const requestedHeaders = (request.headers.get('Access-Control-Request-Headers') || '').toLowerCase().split(',').map(value => value.trim()).filter(Boolean);
      if (!['GET', 'PUT'].includes(method) || requestedHeaders.some(value => value !== 'content-type')) {
        return json({ error: 'Preflight is not allowed' }, 403, origin);
      }
      const responseHeaders = headers(origin);
      responseHeaders.set('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
      responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type');
      responseHeaders.set('Access-Control-Max-Age', '3600');
      return new Response(null, { status: 204, headers: responseHeaders });
    }
    if (!['GET', 'PUT'].includes(request.method)) return json({ error: 'Method not allowed' }, 405, origin, { Allow: 'GET, PUT, OPTIONS' });

    let visitor = null;
    let liked = null;
    if (request.method === 'GET') {
      if ([...url.searchParams.keys()].some(key => key !== 'visitor') || url.searchParams.getAll('visitor').length > 1) {
        return json({ error: 'Invalid query parameters' }, 400, origin);
      }
      visitor = url.searchParams.get('visitor');
      if (visitor !== null && !VISITOR_PATTERN.test(visitor)) return json({ error: 'Invalid visitor identifier' }, 400, origin);
    } else {
      if (url.search) return json({ error: 'Query parameters are not allowed on PUT' }, 400, origin);
      const type = (request.headers.get('Content-Type') || '').split(';')[0].trim().toLowerCase();
      const encoding = request.headers.get('Content-Encoding');
      if (type !== 'application/json' || (encoding && encoding.toLowerCase() !== 'identity')) {
        return json({ error: 'Use an application/json body' }, 415, origin);
      }
      const parsed = await readBody(request);
      if (parsed.error) return json({ error: parsed.error }, parsed.status, origin);
      const body = parsed.body;
      if (!body || Array.isArray(body) || typeof body !== 'object' || Object.keys(body).sort().join(',') !== 'liked,visitor' || typeof body.visitor !== 'string' || !VISITOR_PATTERN.test(body.visitor) || typeof body.liked !== 'boolean') {
        return json({ error: 'Expected a random UUID v4 visitor and boolean liked' }, 400, origin);
      }
      ({ visitor, liked } = body);
    }

    try {
      if (!env.DB) throw new Error('Missing database binding');
      const hash = visitor ? await visitorHash(slug, visitor) : '';
      const statements = [];
      if (request.method === 'PUT') {
        statements.push(liked
          ? env.DB.prepare('INSERT OR IGNORE INTO article_likes (article_slug, visitor_hash) VALUES (?1, ?2)').bind(slug, hash)
          : env.DB.prepare('DELETE FROM article_likes WHERE article_slug = ?1 AND visitor_hash = ?2').bind(slug, hash));
      }
      statements.push(stateStatement(env.DB, slug, hash));
      // D1 batch is a transaction: write + returned state commit together.
      const results = await env.DB.batch(statements);
      if (results.some(result => result.success === false)) throw new Error('Database request failed');
      const state = results.at(-1)?.results?.[0];
      if (!state || !Number.isSafeInteger(state.count) || state.count < 0) throw new Error('Invalid database state');
      return json({ count: state.count, liked: Boolean(state.liked) }, 200, origin);
    } catch {
      return json({ error: 'Likes are temporarily unavailable' }, 503, origin);
    }
  },
};
