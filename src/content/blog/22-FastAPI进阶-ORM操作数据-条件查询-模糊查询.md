---
title: "22-FastAPI进阶-ORM操作数据-条件查询-模糊查询"
description: "学会做模糊查询"
pubDate: '2026-08-29'
tags: ["FastAPI","Python"]
---

## 学习目标
- 学会做模糊查询
- 理解 `like`、`contains`、`startswith` 等常见方式
- 掌握搜索框类接口的基本思路

## 核心概念
- 模糊查询适用于“用户输入关键词搜索”的场景。
- 最常见写法：
  - `User.name.like("%张%")`
  - `User.name.contains("张")`
  - `User.email.startswith("admin")`
- 如果项目有搜索框，这节内容几乎一定会用到。

## 代码示例
```python
from typing import Annotated

from fastapi import Query
from sqlalchemy import select


@app.get("/users/search")
def search_users(
    db: DbSession,
    keyword: Annotated[str, Query(min_length=1)],
):
    stmt = select(User).where(User.name.contains(keyword)).order_by(User.id)
    users = db.scalars(stmt).all()
    return [UserOut.model_validate(user) for user in users]


@app.get("/users/search-email")
def search_email_users(db: DbSession):
    stmt = select(User).where(User.email.startswith("admin"))
    users = db.scalars(stmt).all()
    return [UserOut.model_validate(user) for user in users]
```

## 案例理解
- `/users/search?keyword=张` 这类接口非常像常见的搜索框功能。
- 用户输入一个关键字，后端做模糊匹配，把符合条件的数据返回。
- 模糊查询常见于姓名、邮箱、标题、商品名等字段。

## 易错点
- 使用 `like` 时别忘了 `%` 通配符。
- 模糊查询如果数据量很大，性能会明显下降，后期要考虑索引和搜索方案。
- 搜索关键字通常要设置最小长度，否则会很容易查出过多数据。

## 我的补充
- 这节和前一节的区别是：上一节更像“精确筛选”，这一节更像“搜索”。
- 项目里往往是“条件筛选 + 模糊搜索”同时存在。
- 你可以自己加练习：姓名包含某字，部门精确匹配，状态为启用。

