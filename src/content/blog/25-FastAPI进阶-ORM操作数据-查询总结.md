---
title: "25-FastAPI进阶-ORM操作数据-查询总结"
description: "总结 ORM 查询阶段的常见写法"
pubDate: '2026-09-01'
tags: ["FastAPI","Python"]
---

## 学习目标
- 总结 ORM 查询阶段的常见写法
- 对比不同查询方式的适用场景
- 为后续增删改打好基础

## 查询知识点总表
- 查询单条：`db.get(User, user_id)`
- 查询多条：`db.scalars(select(User)).all()`
- 精确条件：`User.department == "技术部"`
- 范围条件：`User.age.between(18, 30)`
- 集合条件：`User.id.in_([1, 2, 3])`
- 模糊搜索：`User.name.contains(keyword)`
- 聚合统计：`select(func.count()).select_from(User)`
- 分页查询：`offset(...).limit(...)`

## 综合案例
```python
from typing import Annotated

from fastapi import Query
from sqlalchemy import func, select


@app.get("/users/advanced-search")
def advanced_search(
    db: DbSession,
    keyword: Annotated[str | None, Query()] = None,
    department: Annotated[str | None, Query()] = None,
    page: Annotated[int, Query(ge=1)] = 1,
    size: Annotated[int, Query(ge=1, le=20)] = 5,
):
    stmt = select(User)

    if keyword:
        stmt = stmt.where(User.name.contains(keyword))
    if department:
        stmt = stmt.where(User.department == department)

    total_stmt = select(func.count()).select_from(stmt.subquery())
    total = db.scalar(total_stmt) or 0

    stmt = stmt.order_by(User.id).offset((page - 1) * size).limit(size)
    users = db.scalars(stmt).all()

    return {
        "total": total,
        "items": [UserOut.model_validate(user) for user in users],
    }
```

## 案例理解
- 这个接口把“搜索、筛选、分页”三个动作整合到了一起。
- 现实中的管理后台列表页，大多数就是这样一步步堆出来的。
- 所以前面每一节不是孤立知识，而是为这个综合场景做准备。

## 易错点
- 动态拼条件时，代码很容易越来越乱，建议一步一步追加条件。
- `count` 查询和真正的数据列表查询通常是两条语句。
- 学习阶段先把逻辑写清楚，比一开始就追求高级封装更重要。

## 我的补充
- 到这一节为止，你应该已经能独立写出常见列表查询接口。
- 如果你还能自己扩展排序、状态筛选、日期区间，那 ORM 查询就已经很扎实了。
- 接下来进入新增、更新、删除，整套 CRUD 就完整了。

