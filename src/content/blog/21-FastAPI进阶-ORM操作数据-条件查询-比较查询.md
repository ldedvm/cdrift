---
title: "21-FastAPI进阶-ORM操作数据-条件查询-比较查询"
description: "学会使用比较条件做 ORM 查询"
pubDate: '2026-08-28'
tags: ["FastAPI","Python"]
---

## 学习目标
- 学会使用比较条件做 ORM 查询
- 理解等于、大于、小于、范围和集合查询
- 掌握多条件组合的基本写法

## 核心概念
- 比较查询就是在查询时加上条件，例如：
  - 年龄大于 18
  - 部门等于“技术部”
  - 编号在某个列表中
- SQLAlchemy 中常见比较方式包括：
  - `==`
  - `>=`
  - `<=`
  - `.between(a, b)`
  - `.in_([...])`

## 代码示例
```python
from sqlalchemy import and_, select


@app.get("/users/filter")
def filter_users(db: DbSession):
    stmt = select(User).where(
        and_(
            User.age >= 18,
            User.age <= 30,
            User.department == "技术部",
        )
    )
    users = db.scalars(stmt).all()
    return [UserOut.model_validate(user) for user in users]


@app.get("/users/by-ids")
def get_users_by_ids(db: DbSession):
    stmt = select(User).where(User.id.in_([1, 2, 3]))
    users = db.scalars(stmt).all()
    return [UserOut.model_validate(user) for user in users]
```

## 案例理解
- 第一个接口查询“18 到 30 岁之间，且属于技术部”的用户。
- 第二个接口演示按一组编号批量查询用户。
- 这类条件查询非常适合后台筛选功能。

## 易错点
- 多条件组合时，不要直接用 Python 的 `and`、`or` 去拼数据库条件。
- 条件特别多时，建议先把条件拆成变量，代码更清晰。
- 范围查询和前端筛选场景结合非常多，建议反复练熟。

## 我的补充
- 真正的后台系统，列表页很少是“无条件查询”，大多数都是条件查询。
- 所以这一节开始，你已经进入更接近真实开发的部分了。
- 如果你能自己写出年龄、部门、状态的组合筛选，说明 ORM 查询已经入门。

