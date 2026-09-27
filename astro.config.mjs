import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://weifeijin.github.io',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
