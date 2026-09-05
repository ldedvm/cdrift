// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import remarkWikilinks from './src/plugins/remark-wikilinks.mjs';

// 部署目标：自定义域名 https://cdrift.cn（GitHub Pages 托管）
const SITE = 'https://cdrift.cn';
const BASE = '/';

// https://astro.build/config
export default defineConfig({
	site: SITE,
	base: BASE,
	integrations: [mdx(), sitemap()],
	markdown: {
		remarkPlugins: [remarkWikilinks({ base: BASE })],
	},
});
