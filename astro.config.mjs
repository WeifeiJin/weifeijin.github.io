import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://weifeijin.com',
  trailingSlash: 'always',
  redirects: {
    '/blog/from-doing-research-to-becoming-a-researcher/': '/blog/from-research-to-researcher/',
    '/blog/from-doing-research-to-becoming-a-researcher/en/': '/blog/from-research-to-researcher/en/',
  },
  integrations: [sitemap()],
});
