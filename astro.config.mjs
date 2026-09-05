// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import remarkWikilinks from './src/plugins/remark-wikilinks.mjs';

// 部署目标：
// - 现阶段：GitHub Pages 项目站 https://ldedvm.github.io/cdrift/
// - 绑定自定义域名后：把 site 改成 'https://你的域名'，base 改成 '/'，即可切换
const SITE = 'https://ldedvm.github.io';
const BASE = '/cdrift';

// https://astro.build/config
export default defineConfig({
	site: SITE,
	base: BASE,
	integrations: [mdx(), sitemap()],
	markdown: {
		remarkPlugins: [remarkWikilinks({ base: BASE })],
	},
});
