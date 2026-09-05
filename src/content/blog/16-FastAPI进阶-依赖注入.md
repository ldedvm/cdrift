---
title: "16-FastAPI进阶-依赖注入"
description: "理解依赖注入在 FastAPI 中的意义"
pubDate: '2026-08-23'
tags: ["FastAPI","Python"]
---

## 学习目标
- 理解依赖注入在 FastAPI 中的意义
- 学会抽离公共逻辑
- 掌握 `Depends` 的典型使用方式

## 核心概念
- 依赖注入的核心思想是：把“路由函数要依赖的能力”交给 FastAPI 自动提供。
- 这样可以减少重复代码，让接口更清晰。
- 常见依赖包括：
  - 数据库会话
  - 登录用户信息
  - 公共参数校验
  - 分页参数解析

## 代码示例
```python
from typing import Annotated

from fastapi import Depends, FastAPI, Header, HTTPException, Query

app = FastAPI()


def verify_token(x_token: Annotated[str, Header()]):
    if x_token != "fastapi-course":
        raise HTTPException(status_code=401, detail="令牌无效")
    return x_token


def get_pagination(
    page: Annotated[int, Query(ge=1)] = 1,
    size: Annotated[int, Query(ge=1, le=50)] = 10,
):
    return {
        "page": page,
        "size": size,
        "offset": (page - 1) * size,
    }


@app.get("/articles")
def get_articles(
    _: Annotated[str, Depends(verify_token)],
    pagination: Annotated[dict, Depends(get_pagination)],
):
    return {
        "message": "获取文章成功",
        "pagination": pagination,
    }
```

## 案例理解
- `verify_token` 用来做统一鉴权。
- `get_pagination` 用来做统一分页参数处理。
- 路由函数本身只关心“业务结果是什么”，不再重复写鉴权和分页解析代码。

## 易错点
- `Depends` 里传的是函数本身，不要写成 `Depends(verify_token())`。
- 依赖函数如果要抛出错误，直接 `raise HTTPException` 即可。
- 依赖注入不是为了炫技，而是为了拆分公共逻辑、降低重复。

## 我的补充
- 学会 `Depends` 之后，你会发现 FastAPI 的代码组织能力开始明显增强。
- 后面的数据库会话 `get_db()` 就是最经典的依赖注入案例。
- 这一节是从“会写接口”走向“会组织项目”的关键一步。

