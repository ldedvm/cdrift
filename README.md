# cdrift

CD 的个人知识库，基于 [Astro](https://astro.build/) 搭建：Markdown 笔记 + Obsidian 式双链 + 知识图谱。

## 常用命令

在项目根目录的终端里运行：

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动本地预览，浏览器打开 http://localhost:4321 |
| `npm run build` | 把整站构建成静态文件，输出到 `dist/` 文件夹 |
| `npm run preview` | 本地预览 `dist/` 里的构建结果 |
| `node scripts/import-obsidian.mjs` | 从 Obsidian 笔记库批量导入笔记（改脚本开头的 `vaults` 路径即可换库） |

## 怎么写一篇笔记

1. 复制根目录的 `NOTE_TEMPLATE.md` 到 `src/content/blog/`，改成一个**英文文件名**（它就是网址，例如 `my-note.md`）；
2. 填好标题、摘要、日期、标签，写正文；
3. 保存后本地预览自动刷新；满意后 `git add` + `git commit` + `git push` 推到 GitHub，网站自动更新。

批量导入 Obsidian 库：把笔记放进一个文件夹，改 `scripts/import-obsidian.mjs` 开头的 `vaults` 路径，运行 `node scripts/import-obsidian.mjs`（已存在的同名笔记会跳过，可重复运行）。

## 怎么删除一篇笔记

直接删掉 `src/content/blog/` 里对应的 `.md` 文件即可，列表、图谱、搜索会自动更新。

- 指向它的双链会变成灰色虚线（Obsidian 的"未创建"状态），不影响其他页面；
- 网站上线后，删除还要 `git commit` + `git push` 才会从线上消失。

## 这套系统的约定

- **双链**：正文里写 `[[文件名]]`（或 `[[文件名|别名]]`）会自动连到对应笔记；目标不存在时显示灰色虚线。注意目标是**文件名**，不是标题。
- **反向链接**：笔记底部自动列出所有引用它的笔记。
- **知识图谱**：`/graph` 页面把所有笔记和双链画成网络图，可拖动、点击进入。
- **标签**：frontmatter 里的 `tags` 会显示在笔记页和列表页。

## 项目结构速查

- `src/content/blog/` — 所有笔记（写作只碰这里）
- `NOTE_TEMPLATE.md` — 新笔记模板
- `src/consts.ts` — 站点标题和描述
- `src/pages/` — 各页面（首页、笔记列表、图谱、关于页）
- `src/layouts/BlogPost.astro` — 笔记页版式
- `src/plugins/remark-wikilinks.mjs` — 双链语法插件
- `src/styles/global.css` — 全局样式（配色、动画）
- `public/` — 网站图标等静态文件
