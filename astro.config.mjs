import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ravenz3.github.io',
  output: 'static',
  integrations: [sitemap()],
  markdown: {
    // GitHub-flavored footnotes ([^1]) are supported by default in Astro >= 3
    remarkPlugins: [],
    rehypePlugins: [],
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});

