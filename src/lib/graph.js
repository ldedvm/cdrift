// 从笔记集合里提取双链网络：nodes = 笔记，links = [[双链]] 连线
export function buildGraph(posts) {
	const ids = new Set(posts.map((p) => p.id));
	const nodes = posts.map((p) => ({ id: p.id, title: p.data.title }));
	const seen = new Set();
	const links = [];
	for (const p of posts) {
		const re = /\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g;
		let m;
		while ((m = re.exec(p.body ?? '')) !== null) {
			const target = m[1].trim().toLowerCase().replace(/\s+/g, '-');
			if (target === p.id || !ids.has(target)) continue;
			const key = [p.id, target].sort().join('→');
			if (seen.has(key)) continue;
			seen.add(key);
			links.push({ source: p.id, target });
		}
	}
	return { nodes, links };
}
