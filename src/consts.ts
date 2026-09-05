// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'cdrift';
export const SITE_DESCRIPTION = 'CD 的个人博客：笔记、踩坑记录与随想。';

// 站内链接统一走这里：自动带上部署路径前缀（GitHub Pages 项目站是 /cdrift）
export const withBase = (path: string) => {
	const base = import.meta.env.BASE_URL.replace(/\/$/, '');
	return `${base}${path}`;
};
