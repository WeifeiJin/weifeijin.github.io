# Weifei Jin's research homepage

A small, static [Astro](https://astro.build/) site for [weifeijin.github.io](https://weifeijin.github.io/). Publications and news each have one source of truth, with no client-side framework.

## Develop

Use Node.js 22.12 or newer. Run `npm ci`, then `npm run dev`. Before publishing, run `npm run check` and `npm run build`.

## Update content

- Add a publication in `src/data/publications.ts`. Give it a unique `slug`, verified title, authors, venue, and year. Add `paper` when a public link is available; the site omits the paper button until then. Each entry automatically appears on the publications page and gets a detail page at `/publication/<slug>/`. Set `selectedAt` to a `YYYY-MM` acceptance month to feature it on the homepage in newest-first order.
- Add the latest news item to the top of `src/data/news.ts`. The homepage shows the first five and keeps earlier updates in an expandable list.
- Edit the biography in `src/components/Hero.astro` and awards and service in `src/pages/index.astro`. Research and About both live on the homepage; the old `/about/` URL forwards visitors to `/#about`.
- Edit research areas and their `paperSlugs` in `src/data/research.ts`; each slug must match a publication in `src/data/publications.ts`. Memory currently lists active research directions and can gain paper links when those papers are published. Edit contact details in `src/data/profile.ts`.
- Replace `public/images/profile.webp` if the portrait changes. Keep the published image optimized and update its dimensions and alt text in `src/components/Hero.astro` if needed.

The old publication URLs are preserved as detail pages. The previous site linked to `/files/CV_WeifeiJin.pdf`, but that file was deleted in the source repository's latest pre-redesign commit. A CV link should only be added when a current, verified CV PDF is available. The unrelated personal PDF `From_Research_to_Researcher_WeifeiJin.pdf` remains at its original URL.

## Deployment

Pushing a completed build to `master` runs `.github/workflows/deploy.yml`. In GitHub repository settings, **Pages → Build and deployment → Source** must be set to **GitHub Actions**. The Astro `site` URL is configured for a user site without a base path.

The pre-redesign production state is retained on branch `backup-before-redesign-2026-09-26` at commit `9b77aca9c21b87f128234440cc126d68939a45e9`.
