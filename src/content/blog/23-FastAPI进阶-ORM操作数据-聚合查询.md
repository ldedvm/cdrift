---
title: "23-FastAPI进阶-ORM操作数据-聚合查询"
description: "理解聚合查询的作用"
pubDate: '2026-08-30'
tags: ["FastAPI","Python"]
---

## 学习目标
- 理解聚合查询的作用
- 学会使用计数、平均值、最大值等统计函数
- 认识 `group_by` 的基本使用场景

## 核心概念
- 聚合查询关注的不是某一条记录，而是“整体统计结果”。
- 常见统计包括：
  - `count()`：数量
  - `avg()`：平均值
  - `max()`：最大值
  - `min()`：最小值
- 如果要按部门、分类等维度分别统计，通常要用到 `group_by`。

## 代码示例
```python
from sqlalchemy import func, select


@app.get("/users/stats")
def user_stats(db: DbSession):
    total = db.scalar(select(func.count()).select_from(User)) or 0
    avg_age = db.scalar(select(func.avg(User.age))) or 0

    department_stmt = (
        select(User.department, func.count(User.id))
        .group_by(User.department)
        .order_by(User.department)
    )
    department_rows = db.execute(department_stmt).all()

    return {
        "total_users": total,
        "avg_age": round(float(avg_age), 2) if avg_age else 0,
        "department_stats": [
            {"department": department, "count": count}
            for department, count in department_rows
        ],
    }
```

## 案例理解
- 这个接口可以做后台首页的数据面板。
- 它能统计总用户数、平均年龄，以及各部门的人数分布。
- 这就是典型的“数据看板接口”思路。

## 易错点
- 聚合查询的返回结果不一定是 ORM 对象，很多时候是普通元组。
- `avg()` 的结果可能是小数，也可能在无数据时为 `None`。
- `group_by` 常和前端图表一起使用，字段含义要保持清楚。

## 我的补充
- CRUD 是业务操作，聚合查询更偏向报表和统计。
- 如果你以后做管理后台，这节的使用频率会非常高。
- 学完这节之后，你已经不只是“查记录”，而是在“分析数据”了。

