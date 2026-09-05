---
title: "28-FastAPI进阶-ORM操作数据-删除数据"
description: "学会使用 ORM 删除数据"
pubDate: '2026-09-04'
tags: ["FastAPI","Python"]
---

## 学习目标
- 学会使用 ORM 删除数据
- 理解删除前查询与存在性校验的必要性
- 建立安全删除的基本意识

## 核心概念
- 删除操作最常见的流程是：
  1. 先查对象
  2. 判断对象是否存在
  3. `db.delete(obj)`
  4. `db.commit()`
- 从业务角度看，删除分两种：
  - 硬删除：真正从数据库移除
  - 软删除：只修改状态，例如 `is_deleted=True`

## 代码示例
```python
@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: DbSession):
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="用户不存在")

    db.delete(user)
    db.commit()
    return {
        "code": 200,
        "message": "删除成功",
        "data": {"id": user_id},
    }
```

## 案例理解
- 管理员点击删除用户时，后端先确认这个用户是否存在。
- 如果存在，就执行删除；如果不存在，就返回 404。
- 这是最基础的删除接口模式。

## 易错点
- 删之前不校验存在性，前端会很难区分“删除成功”还是“本来就没有”。
- 一些重要业务数据不适合直接硬删除，可能需要改成软删除。
- 删除后如果还涉及其他关联数据，后面还要考虑级联关系。

## 我的补充
- 删除操作写起来最短，但业务风险通常最大。
- 真实项目里，很多删除接口都会加权限校验、操作日志和二次确认。
- 你可以把这一节当成“数据库操作的最后一环”，但也要记住它往往最敏感。

