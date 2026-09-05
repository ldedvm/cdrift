// 支持 Obsidian 风格的双链语法：[[文件名]] 或 [[文件名|显示文字]]
// 目标匹配 src/content/blog/ 里的文件名（不含扩展名，忽略大小写和空格差异）。
// 已存在的笔记渲染为普通站内链接；不存在的显示为灰色虚线（相当于 Obsidian 的"未创建"链接）。
import fs from 'node:fs';
import path from 'node:path';

const slugify = (s) => s.trim().toLowerCase().replace(/\s+/g, '-');

function findKnownSlugs() {
	try {
		const dir = path.join(process.cwd(), 'src', 'content', 'blog');
		return new Set(
			fs
				.readdirSync(dir)
				.filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
				.map((f) => slugify(f.replace(/\.(md|mdx)$/, ''))),
		);
	} catch {
		return new Set();
	}
}

function walk(node, known, base) {
	if (!node.children || !Array.isArray(node.children)) return;
	const result = [];
	for (const child of node.children) {
		if (child.type === 'inlineCode' || child.type === 'code') {
			// 代码里出现的 [[..]] 保持原样
			result.push(child);
			continue;
		}
		if (child.type === 'text' && child.value.includes('[[')) {
			const re = /\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/g;
			let lastIndex = 0;
			for (const match of child.value.matchAll(re)) {
				const before = child.value.slice(lastIndex, match.index);
				if (before) result.push({ type: 'text', value: before });

				const target = slugify(match[1]);
				const label = (match[2] ?? match[1]).trim();
				const exists = known.has(target);
				result.push({
					type: 'link',
					url: `${base}/blog/${target}/`,
					data: {
						hProperties: {
							'data-wikilink': 'true',
							...(exists ? {} : { 'data-new': 'true' }),
						},
					},
					children: [{ type: 'text', value: label }],
				});
				lastIndex = match.index + match[0].length;
			}
			const rest = child.value.slice(lastIndex);
			if (rest) result.push({ type: 'text', value: rest });
		} else {
			walk(child, known, base);
			result.push(child);
		}
	}
	node.children = result;
}

export default function remarkWikilinks(options = {}) {
	const base = (options?.base ?? '/').replace(/\/$/, '');
	// unified 在 freeze 阶段会以 (processor, options) 调用这个函数，
	// 此时返回真正的 transformer；运行阶段收到的才是 mdast 树，就地处理。
	function transformer(node, file) {
		// 挂载阶段（freeze）：无参/非 mdast 调用 → 返回真正的处理函数；
		// 运行阶段：收到 mdast 树 → 就地处理双链
		if (!(node && typeof node.type === 'string' && Array.isArray(node.children))) {
			return transformer;
		}
		walk(node, findKnownSlugs(), base);
		return node;
	}
	return transformer;
}
