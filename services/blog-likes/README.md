# Blog likes API

An anonymous like is stored once per article and random browser UUID. Clicking again removes it; clicking once more restores it. D1's primary key prevents duplicate likes, and a transaction returns the count and browser state together. The database stores only article slugs and SHA-256 hashes of browser identifiers, with no raw UUIDs, IP addresses, email addresses, or login credentials.

## API

- `GET /likes/from-research-to-researcher` returns `{ "count": 0, "liked": false }` without changing anything.
- `GET /likes/from-research-to-researcher?visitor=<random-UUID-v4>` also returns that browser's state.
- `PUT /likes/from-research-to-researcher`, `Content-Type: application/json`, body `{ "visitor": "<random-UUID-v4>", "liked": true }` sets the state. Send `false` to unlike. Retrying either request is safe.

Send `Origin: https://weifeijin.github.io`. Production accepts only that exact origin and configured slugs. The browser sends requests with `credentials: 'omit'` and an abort-controller timeout. It generates a UUID once with `crypto.randomUUID()` or a cryptographically random fallback and persists it in localStorage. Chinese and English versions use the same slug. Origin checks restrict browsers, but cannot stop a determined script from forging requests or generating many new UUIDs; this is a lightweight blog reaction count, not verified identity.

## Tests and local preview

Use Node 24 or later. Backend tests need no dependencies; frontend compatibility tests use the project's installed TypeScript dependency (`npm ci` at the repository root).

```powershell
node --test services/blog-likes/worker.test.mjs services/blog-likes/frontend.test.mjs
node services/blog-likes/dev-server.mjs
```

The preview API binds only to `127.0.0.1:8787`, stores test data in the OS temporary directory, and additionally accepts localhost/127.0.0.1 Astro previews on ports 4321 and 4322. Set the Astro preview's `PUBLIC_BLOG_LIKES_API` to `http://127.0.0.1:8787`. Override `BLOG_LIKES_DB` to use a different test database or `:memory:`. Production configuration contains no localhost origins.

## Cloudflare setup

The deployed Worker is `https://weifeijin-blog-likes.ninedreamwf.workers.dev`, bound to the database in `wrangler.toml`. To update it, log in with the required deployment scopes and use Wrangler 4 from this directory:

```powershell
npx wrangler@4 login --scopes account:read user:read workers_scripts:write d1:write --use-keyring
npx wrangler@4 deploy
```

For a separate account or a fresh installation, first create a database, copy its returned ID into `wrangler.toml`, and initialize it:

```powershell
npx wrangler@4 d1 create weifeijin-blog-likes
npx wrangler@4 d1 execute weifeijin-blog-likes --remote --file=schema.sql
```

Set `blogLikes.apiUrl` in `src/data/blog-interactions.ts` to the HTTPS Worker origin and rebuild the site. `PUBLIC_BLOG_LIKES_API` overrides it for local QA. The deployed API has passed read, like, duplicate like, unlike, and re-like checks, with the test vote removed afterwards. Add future article slugs to `ALLOWED_SLUGS` before deployment. Do not put a Cloudflare API token in the website source. Worker invocation logging is disabled in this configuration.

The local SQLite tests verify request validation and actual database behavior, but do not replace a final check against Cloudflare D1. [D1 batch transactions](https://developers.cloudflare.com/d1/worker-api/d1-database/#batch) and [Wrangler D1 commands](https://developers.cloudflare.com/d1/wrangler-commands/) are documented by Cloudflare.

## Network reachability

A successful API check from one network does not prove that readers on other networks can reach the `workers.dev` hostname. Browser compatibility fixes and retries cannot repair a blocked hostname. If readers cannot reach this hostname, attach an owned hostname such as `likes.example.com` to the **existing** Worker, then update `blogLikes.apiUrl` and rebuild the site. Keep the same D1 binding to preserve counts and visitor state. A [Worker custom domain](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/) requires an active Cloudflare zone that the site owner controls; the GitHub Pages `github.io` hostname cannot be used for this purpose. Verify the new address from an affected reader's network before treating the issue as resolved.
