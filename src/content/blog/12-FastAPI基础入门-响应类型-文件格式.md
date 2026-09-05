---
title: "12-FastAPI基础入门-响应类型-文件格式"
description: "学会返回文件响应"
pubDate: '2026-08-19'
tags: ["FastAPI","Python"]
---

## 学习目标
- 学会返回文件响应
- 理解文件预览与文件下载的区别
- 掌握 `FileResponse` 的常见写法

## 核心概念
- 当接口需要返回图片、PDF、压缩包、文档时，可以使用 `FileResponse`。
- `FileResponse` 会把磁盘上的文件内容返回给客户端，适合做下载接口。
- 如果指定了 `filename`，浏览器下载时通常会显示这个文件名。
- 如果指定了合适的 `media_type`，浏览器可能会直接预览，而不是下载。

## 代码示例
```python
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse

app = FastAPI()
BASE_DIR = Path(__file__).resolve().parent


@app.get("/download-guide")
def download_guide():
    file_path = BASE_DIR / "files" / "fastapi_guide.pdf"
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="文件不存在")
    return FileResponse(
        path=file_path,
        filename="fastapi_guide.pdf",
        media_type="application/pdf",
    )
```

## 案例理解
- 场景：课程网站提供一份 PDF 学习资料。
- 访问 `/download-guide` 后，后端检查文件是否存在。
- 如果文件存在，就把文件作为响应返回；如果不存在，就返回 404 错误。

## 易错点
- 直接写相对路径容易因为启动目录不同而找不到文件，建议结合 `Path(__file__)` 生成绝对路径。
- 不要随便根据用户输入拼接文件路径，否则可能出现越权读取文件的风险。
- 文件特别大时要考虑服务器带宽和磁盘权限问题。

## 我的补充
- `FileResponse` 是最常见的“下载接口”写法。
- 如果你的项目要托管很多静态资源，更常见的做法是使用对象存储、Nginx 或 `StaticFiles`。
- 学会这一节后，你已经能做一个“上传资料后提供下载”的基础系统。

