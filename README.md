# Weifei Jin's research homepage

A small, static [Astro](https://astro.build/) site for [weifeijin.com](https://weifeijin.com/). Publications and news each have one source of truth, with no client-side framework.

## Develop

Use Node.js 22.12 or newer. Run `npm ci`, then `npm run dev`. Before publishing, run `npm run check` and `npm run build`.

## Update content

- Add a publication in `src/data/publications.ts`. Give it a unique `slug`, verified title, authors, venue, and year. Add `paper` when a public link is available; the site omits the paper button until then. Each entry automatically appears on the publications page and gets a detail page at `/publication/<slug>/`. Set `selectedAt` to a `YYYY-MM` acceptance month to feature it on the homepage in newest-first order.
- Add the latest news item to the top of `src/data/news.ts`. The homepage shows the first five and keeps earlier updates in an expandable list.
- Edit the biography in `src/components/Hero.astro` and awards and service in `src/pages/index.astro`. Research and About both live on the homepage; the old `/about/` URL forwards visitors to `/#about`.
- Edit positions, dates, and collaborators in `src/data/experience.ts`. Institution logos are local files in `public/images/experience/`.
- Edit research areas and their `paperSlugs` in `src/data/research.ts`; each slug must match a publication in `src/data/publications.ts`. Memory currently lists active research directions and can gain paper links when those papers are published. Edit contact details in `src/data/profile.ts`.
- Replace `public/images/profile.webp` if the portrait changes. Keep the published image optimized and update its dimensions and alt text in `src/components/Hero.astro` if needed.

The old publication URLs are preserved as detail pages. The previous site linked to `/files/CV_WeifeiJin.pdf`, but that file was deleted in the source repository's latest pre-redesign commit. A CV link should only be added when a current, verified CV PDF is available. The unrelated personal PDF `From_Research_to_Researcher_WeifeiJin.pdf` remains at its original URL.

The Experience logos come from [Simple Icons (ByteDance)](https://simpleicons.org/?q=bytedance) and Wikimedia's file pages for [Duke](https://commons.wikimedia.org/wiki/File:Duke_University_logo.svg), [Tsinghua](https://commons.wikimedia.org/wiki/File:Tsinghua_University_Logo.svg), [NUS](https://en.wikipedia.org/wiki/File:NationalUniversityofSingapore.svg), and [CSIRO](https://en.wikipedia.org/wiki/File:CSIRO_Logo.svg). They identify the institutions only; no endorsement is implied.

## Blog interactions

Article views use [Vercount](https://www.vercount.one/). Both translations send the same counter URL to its public API, so their counts are combined. `blogViewUrls` in `src/data/blog-interactions.ts` preserves the full original URL when an article or the site's domain is renamed; public canonical URLs and links use the current domain and slug. The counter runs only on the origin configured in Astro `site`, independently of the counter URL's original domain. Old article paths redirect through `astro.config.mjs`. Local previews do not increment counts. A page view does not measure reading completion. Service failures show an unavailable state rather than a made-up count.

Comments use [giscus](https://giscus.app/) and the repository's GitHub Discussions. Install the giscus GitHub App on **only this repository** to enable the embedded comment box. `src/data/blog-interactions.ts` contains the public repository/category IDs and existing discussion numbers. Both translations use the same discussion and article reactions; future posts without a number use their shared article path and strict matching. Readers can react above the comment box after signing in with GitHub. The widget loads near the bottom of an article and follows the page language and light/dark theme.

The floating heart uses a separate anonymous Cloudflare Worker and D1 database, with no reader account required. A random browser ID in localStorage keeps one like per browser and article; clicking again removes it. Both translations share the count. Only hashed IDs and article slugs are stored in D1. Service failures offer a retry and never show a made-up count. The public API origin is `https://likes.weifeijin.com` in `blogLikes.apiUrl`; implementation, tests, and deployment instructions live in `services/blog-likes/`. Use Node 24 or later for the local SQLite tests. Local previews require a local API override and cannot write production likes. The existing D1 database preserves aggregate likes across domain changes, but browser storage and individual liked states do not transfer between origins automatically.

## Deployment

Pushing a completed build to `master` runs `.github/workflows/deploy.yml`. In GitHub repository settings, **Pages → Build and deployment → Source** must be set to **GitHub Actions**, with **Custom domain** set to `weifeijin.com`. The Astro `site` URL uses `https://weifeijin.com` without a base path. This custom Actions deployment does not require a source `CNAME` file. Configure and verify the custom domain and HTTPS in GitHub Pages separately from the code deployment.

The pre-redesign production state is retained on branch `backup-before-redesign-2026-09-26` at commit `9b77aca9c21b87f128234440cc126d68939a45e9`.
