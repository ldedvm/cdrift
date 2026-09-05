---
title: "24-FastAPI进阶-ORM操作数据-分页查询"
description: "学会做分页查询"
pubDate: '2026-08-31'
tags: ["FastAPI","Python"]
---

## 学习目标
- 学会做分页查询
- 理解 `limit` 和 `offset` 的作用
- 认识分页接口的常见返回结构

## 核心概念
- 当数据很多时，不可能一次性全查出来给前端。
- 分页的核心思想是“每次只取一部分数据”。
- 常见公式：
  - `size`：每页条数
  - `page`：当前页码
  - `offset = (page - 1) * size`
- SQLAlchemy 中常见写法是：`offset(...).limit(...)`

## 代码示例
```python
from typing import Annotated

from fastapi import Query
from sqlalchemy import func, select


@app.get("/users/page")
def page_users(
    db: DbSession,
    page: Annotated[int, Query(ge=1)] = 1,
    size: Annotated[int, Query(ge=1, le=20)] = 5,
):
    total = db.scalar(select(func.count()).select_from(User)) or 0
    stmt = (
        select(User)
        .order_by(User.id)
        .offset((page - 1) * size)
        .limit(size)
    )
    users = db.scalars(stmt).all()
    return {
        "total": total,
        "page": page,
        "size": size,
        "items": [UserOut.model_validate(user) for user in users],
    }
```

## 案例理解
- 比如当前有 100 条用户数据，前端每页只展示 10 条。
- 第 1 页查第 1 到第 10 条，第 2 页查第 11 到第 20 条。
- 这就是后台列表页、商品列表页、文章列表页最常见的接口结构。

## 易错点
- 分页查询最好加上稳定排序，例如 `order_by(User.id)`，否则页码切换时结果可能乱序。
- 只返回当前页数据还不够，通常还要返回总数 `total`，前端才能算出总页数。
- `page` 和 `size` 最好设置合理范围，避免一次查太多数据。

## 我的补充
- 分页查询几乎是所有后台系统的标配。
- 如果你把“总数统计 + offset + limit + items 返回结构”这套写熟，列表接口就不难了。
- 后面可以继续加“条件筛选 + 分页”，那就更像真实项目。

