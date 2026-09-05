---
title: "03-FastAPI基础入门-第一个FastAPI程序"
description: "创建第一个 FastAPI 项目"
pubDate: '2026-08-10'
tags: ["FastAPI","Python"]
---

## 学习目标
- 创建第一个 FastAPI 项目
- 学会启动开发服务器
- 认识自动生成的接口文档页面

## 核心概念

第一个 FastAPI 程序的目标不是“把功能写复杂”，而是先跑通最小闭环：

1. 安装依赖
2. 写出 `app = FastAPI()`
3. 定义一个路由
4. 用 `uvicorn` 启动
5. 打开 `/docs`

常用安装命令：

```bash
pip install fastapi uvicorn
```

启动命令：

```bash
uvicorn main:app --reload
```

其中：

- `main` 是文件名
- `app` 是 FastAPI 实例名
- `--reload` 表示开发模式自动重载

## 代码示例

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "Hello FastAPI"}


@app.get("/ping")
def ping():
    return {"status": "ok"}
```

## 运行结果

启动后通常访问：

- `http://127.0.0.1:8000/`
- `http://127.0.0.1:8000/ping`
- `http://127.0.0.1:8000/docs`

其中 `/docs` 是学习 FastAPI 时非常重要的页面，因为它不仅能看接口说明，还能直接在线测试。

## 易错点

- `uvicorn main:app --reload` 中的 `main` 和 `app` 写错
- 文件名不是 `main.py`，却还用 `main:app`
- 启动成功了，却打不开 `/docs`，通常是端口不对或服务没真正起来

## 我的补充

第一次学 FastAPI，一定要把 `/docs` 养成习惯。后面很多参数校验和请求体结构，看文档页比只看代码更直观。

