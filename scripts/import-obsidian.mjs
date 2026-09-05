// 把 Obsidian 笔记库导入博客：node scripts/import-obsidian.mjs
// - 标题取笔记第一个 H1；摘要取第一段正文；发布日期按文件名顺序从今天往回排
// - 已存在同名笔记会跳过，可重复运行
import fs from 'node:fs';
import path from 'node:path';

const vaults = [
	{ dir: 'D:/obsidian/vault/FastAPI', tags: ['FastAPI', 'Python'] },
	{ dir: 'D:/obsidian/vault/电子元器件', tags: ['电子元器件', '硬件基础'] },
];
const outDir = path.join(process.cwd(), 'src', 'content', 'blog');
const today = new Date();

let imported = 0;
let skipped = 0;

for (const vault of vaults) {
	const seriesName = path.basename(vault.dir);
	const files = fs
		.readdirSync(vault.dir)
		.filter((f) => f.endsWith('.md'))
		.sort((a, b) => {
			// 「课程目录」排最前，日期最早
			const da = a.includes('目录') ? 0 : 1;
			const db = b.includes('目录') ? 0 : 1;
			return da - db || a.localeCompare(b, 'zh');
		});
	const n = files.length;

	files.forEach((f, i) => {
		const target = path.join(outDir, f);
		if (fs.existsSync(target)) {
			skipped++;
			return;
		}
		const raw = fs.readFileSync(path.join(vault.dir, f), 'utf8');
		const lines = raw.split(/\r?\n/);

		let title = f.replace(/\.md$/, '');
		let bodyStart = 0;
		const h1 = lines.findIndex((l) => /^#\s+/.test(l));
		if (h1 !== -1) {
			title = lines[h1].replace(/^#\s+/, '').trim();
			bodyStart = h1 + 1;
		}

		const bodyLines = lines
			.slice(bodyStart)
			.filter((l) => !/^\s*-\s*$/.test(l)); // 去掉空的"- "列表项

		let description = '';
		for (const l of bodyLines) {
			const t = l.trim();
			if (!t || /^#{1,6}\s/.test(t)) continue;
			description = t
				.replace(/^[-*]\s*/, '')
				.replace(/^>\s*/, '') // 引用标记
				.replace(/\*\*/g, '') // 加粗标记
				.replace(/`/g, '')
				.trim();
			break;
		}
		if (description.length > 64) description = description.slice(0, 64) + '…';

		const d = new Date(today);
		d.setDate(d.getDate() - (n - 1 - i));
		const pubDate = d.toISOString().slice(0, 10);

		const front = [
			'---',
			`title: ${JSON.stringify(title)}`,
			`description: ${JSON.stringify(description)}`,
			`pubDate: '${pubDate}'`,
			`tags: ${JSON.stringify(vault.tags)}`,
			'---',
		].join('\n');

		const body = bodyLines.join('\n').replace(/^\s+/, '');
		fs.writeFileSync(target, `${front}\n\n${body}\n`, 'utf8');
		imported++;
	});
	console.log(`${seriesName}: ${files.length} 篇处理完毕`);
}

console.log(`\n完成：新导入 ${imported} 篇，跳过已存在 ${skipped} 篇`);
