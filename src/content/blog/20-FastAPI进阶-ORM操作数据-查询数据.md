---
title: "20-FastAPI进阶-ORM操作数据-查询数据"
description: "学会使用 ORM 查询数据"
pubDate: '2026-08-27'
tags: ["FastAPI","Python"]
---

## 学习目标
- 学会使用 ORM 查询数据
- 理解查询单条和查询多条的差别
- 认识 `select()`、`scalars()`、`get()` 的常见用法

## 核心概念
- 查询单条数据时，常见方法有：
  - `db.get(User, id)`：按主键查询
  - `db.scalar(select(...))`：取一条标量结果
- 查询多条数据时，常见方法是：
  - `db.scalars(select(User)).all()`
- `select()` 是 SQLAlchemy 2.0 风格中非常核心的查询入口。

## 代码示例
```python
from sqlalchemy import select


@app.get("/users")
def list_users(db: DbSession):
    stmt = select(User).order_by(User.id)
    users = db.scalars(stmt).all()
    return [UserOut.model_validate(user) for user in users]


@app.get("/users/{user_id}")
def get_user(user_id: int, db: DbSession):
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="用户不存在")
    return UserOut.model_validate(user)
```

## 案例理解
- `/users` 查询所有用户，并按 `id` 升序返回。
- `/users/{user_id}` 查询单个用户，更适合详情页或编辑页场景。
- 列表接口和详情接口，是后台项目最常见的两类查询接口。

## 易错点
- `db.execute(select(User))` 和 `db.scalars(select(User))` 返回结果形式不同，初学时很容易混淆。
- `db.get()` 只适合按主键查。
- 列表查询如果不写 `order_by`，分页时结果顺序可能不稳定。

## 我的补充
- 你可以把 `select(User)` 理解成“查 users 表”。
- 以后无论条件再复杂，本质上都是在 `select(User)` 的基础上不断追加条件、排序、分页。
- 这一节先把“查询骨架”记牢，后面的比较查询、模糊查询都会更自然。

