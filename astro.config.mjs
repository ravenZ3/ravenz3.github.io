import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://ravenz3.github.io',
  output: 'static',
  integrations: [sitemap()],
  markdown: {
    // GitHub-flavored footnotes ([^1]) are supported by default in Astro >= 3
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});

