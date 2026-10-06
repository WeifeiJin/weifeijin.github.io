# Weifei Jin's research homepage

A small, static [Astro](https://astro.build/) site for [weifeijin.github.io](https://weifeijin.github.io/). Publications and news each have one source of truth, with no client-side framework.

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

Article views use [Vercount](https://www.vercount.one/). Both translations send the same production article URL to its public API, so their counts are combined. `blogViewPaths` in `src/data/blog-interactions.ts` preserves a counter's original URL when an article is renamed; the public canonical URL and links still use the new slug. Old article URLs redirect through `astro.config.mjs`. Local previews do not increment counts. Counting starts when this integration goes live; a page view does not measure reading completion. Service failures show an unavailable state rather than a made-up count.

Comments use [giscus](https://giscus.app/) and the repository's GitHub Discussions. Install the giscus GitHub App on **only this repository** to enable the embedded comment box. `src/data/blog-interactions.ts` contains the public repository/category IDs and existing discussion numbers. Both translations use the same discussion and article reactions; future posts without a number use their shared article path and strict matching. Readers can like or react above the comment box after signing in with GitHub. The widget loads near the bottom of an article, follows the page language and light/dark theme, and keeps a direct GitHub discussion link available if the embed cannot load.

## Deployment

Pushing a completed build to `master` runs `.github/workflows/deploy.yml`. In GitHub repository settings, **Pages → Build and deployment → Source** must be set to **GitHub Actions**. The Astro `site` URL is configured for a user site without a base path.

The pre-redesign production state is retained on branch `backup-before-redesign-2026-09-26` at commit `9b77aca9c21b87f128234440cc126d68939a45e9`.
