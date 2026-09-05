---
title: "11-FastAPI基础入门-响应类型-HTML格式"
description: "学会返回 HTML 响应"
pubDate: '2026-08-18'
tags: ["FastAPI","Python"]
---

## 学习目标
- 学会返回 HTML 响应
- 理解什么时候接口应该返回页面而不是 JSON
- 认识 `HTMLResponse` 的基本写法

## 核心概念
- FastAPI 默认更适合写接口，所以最常见的返回值是 `dict`、`list`、Pydantic 模型，它们最终都会被转成 JSON。
- 如果我们希望浏览器直接展示一个网页片段，就可以使用 `HTMLResponse`。
- `HTMLResponse` 适合做简单演示页、健康检查页、下载说明页、开发调试页。
- 真正做大型前后端页面时，通常会配合模板引擎，例如 Jinja2；本节先掌握最基础的直接返回 HTML 字符串。

## 代码示例
```python
from fastapi import FastAPI
from fastapi.responses import HTMLResponse

app = FastAPI()


@app.get("/", response_class=HTMLResponse)
def home():
    html = """
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <title>FastAPI 首页</title>
        <style>
            body { font-family: Arial; margin: 40px; background: #f7f9fc; }
            .card { max-width: 600px; padding: 24px; border-radius: 12px; background: white; }
            h1 { color: #0f4c81; }
        </style>
    </head>
    <body>
        <div class="card">
            <h1>欢迎来到 FastAPI 课程案例</h1>
            <p>这个页面由 FastAPI 直接返回 HTML。</p>
            <p>后续我们会继续把接口、数据库和前端页面串起来。</p>
        </div>
    </body>
    </html>
    """
    return html
```

## 案例理解
- 场景：我们做一个小型后台系统，希望访问 `/` 时先看到一个简单首页。
- 做法：路由函数里返回一段 HTML 字符串，并把 `response_class` 指定为 `HTMLResponse`。
- 效果：浏览器访问接口地址时，不再看到 JSON，而是直接看到页面。

## 易错点
- 只返回字符串但没有设置 `response_class=HTMLResponse` 时，FastAPI 可能把它当普通文本处理。
- HTML 内容较长时，不建议全部写在一个函数里，后续可以拆到模板文件中。
- 不要把复杂业务逻辑和大量 HTML 拼接混在一个函数里，否则代码会很难维护。

## 我的补充
- 学习阶段可以把 `HTMLResponse` 当成“接口也能直接返回页面”的入门工具。
- 实际项目中，前后端分离更常见，但很多管理后台、内部工具、说明页依然会用到这种方式。
- 如果你后面学到模板引擎，可以把这一节看成模板渲染的前置知识。

