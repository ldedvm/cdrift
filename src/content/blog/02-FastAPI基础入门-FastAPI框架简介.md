---
title: "02-FastAPI基础入门-FastAPI框架简介"
description: "了解 FastAPI 的定位与特点"
pubDate: '2026-08-09'
tags: ["FastAPI","Python"]
---

## 学习目标
- 了解 FastAPI 的定位与特点
- 理解它和 Flask、Django 的区别
- 知道 FastAPI 为什么适合做接口开发

## 核心概念

FastAPI 是一个专门做 Web API 的 Python 框架，它最核心的几个特点是：

- `类型提示驱动`
  你写的 Python 类型注解会直接参与参数校验和文档生成。
- `自动文档`
  默认生成 Swagger UI（`/docs`）和 ReDoc（`/redoc`）。
- `性能高`
  底层基于 Starlette 和 Pydantic，适合接口开发。
- `开发体验好`
  参数、返回值、校验规则都能写得比较清晰。

FastAPI 很适合做：

- 前后端分离项目的后端接口
- 管理系统 API
- AI / 数据服务接口
- 微服务和内部工具接口

## 它和其他框架的区别

- `Flask`
  更轻，但很多校验、文档要自己补。
- `Django`
  功能大而全，但如果只做 API，会显得偏重。
- `FastAPI`
  对“接口开发”这件事非常直接，写得快，也更容易规范化。

## 案例

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "Hello FastAPI"}
```

这段代码已经体现了 FastAPI 的风格：

- 用装饰器定义路由
- 用函数返回 JSON
- 不需要额外手写接口文档

## 易错点

- 以为 FastAPI “神奇”的地方都靠框架魔法，其实很多能力来自 `类型注解 + Pydantic`
- 只关注运行，不关注 `/docs` 自动文档的价值
- 把 FastAPI 和 Django/Flask 的使用方式完全混在一起

## 我的补充

你可以把 FastAPI 理解成：

`一个对类型提示非常友好的 API 框架`

这句话几乎能概括它的大部分设计思路。

