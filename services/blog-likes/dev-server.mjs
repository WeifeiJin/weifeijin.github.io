// A loopback-only preview server backed by SQLite, never a production host.
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import worker from './worker.mjs';
import { createLocalDatabase } from './sqlite-adapter.mjs';

const port = Number(process.env.BLOG_LIKES_PORT || 8787);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid BLOG_LIKES_PORT');
const env = {
  ENVIRONMENT: 'development',
  SITE_ORIGIN: 'https://weifeijin.github.io',
  DEV_ORIGINS: process.env.BLOG_LIKES_DEV_ORIGINS || 'http://127.0.0.1:4321,http://localhost:4321,http://127.0.0.1:4322,http://localhost:4322',
  ALLOWED_SLUGS: process.env.BLOG_LIKES_SLUGS || 'from-research-to-researcher',
  DB: createLocalDatabase(process.env.BLOG_LIKES_DB || join(tmpdir(), 'weifeijin-blog-likes-preview.sqlite')),
};

const server = createServer(async (incoming, outgoing) => {
  try {
    const method = incoming.method || 'GET';
    const request = new Request(`http://127.0.0.1:${port}${incoming.url}`, {
      method,
      headers: incoming.headers,
      ...(!['GET', 'HEAD'].includes(method) ? { body: incoming, duplex: 'half' } : {}),
    });
    const response = await worker.fetch(request, env);
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch {
    outgoing.writeHead(500, { 'Content-Type': 'application/json' });
    outgoing.end(JSON.stringify({ error: 'Preview request failed' }));
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Local likes API: http://127.0.0.1:${port}`));
function stop() { server.close(() => { env.DB.close(); process.exit(0); }); }
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
