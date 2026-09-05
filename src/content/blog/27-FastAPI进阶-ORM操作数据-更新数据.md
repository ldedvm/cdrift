---
title: "27-FastAPI进阶-ORM操作数据-更新数据"
description: "学会使用 ORM 更新数据"
pubDate: '2026-09-03'
tags: ["FastAPI","Python"]
---

## 学习目标
- 学会使用 ORM 更新数据
- 理解部分更新和整体更新的区别
- 掌握更新接口中的常见安全检查

## 核心概念
- 更新数据的一般流程是：
  1. 先查到要更新的对象
  2. 判断对象是否存在
  3. 修改对象属性
  4. 提交事务
  5. 刷新对象
- 在接口设计中，`PUT` 通常偏向整体替换，`PATCH` 更适合部分更新。

## 代码示例
```python
from pydantic import BaseModel, Field


class UserUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=20)
    age: int | None = Field(default=None, ge=1, le=120)
    email: str | None = None
    department: str | None = None
    is_active: bool | None = None


@app.patch("/users/{user_id}")
def update_user(user_id: int, payload: UserUpdate, db: DbSession):
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="用户不存在")

    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return UserOut.model_validate(user)
```

## 案例理解
- 当前端只想改用户部门或状态时，不必把整条用户数据都重传一遍。
- `exclude_unset=True` 可以只提取前端真正传来的字段，非常适合部分更新。
- 这类接口在后台编辑功能中非常常见。

## 易错点
- 如果不使用 `exclude_unset=True`，未传字段可能被错误覆盖成 `None`。
- 更新前一定要先判断数据是否存在。
- 涉及唯一字段更新时，也要做重复值检查。

## 我的补充
- 更新接口最考验你对“数据变化范围”的控制能力。
- 一个好的更新接口，应该既灵活，又不会误改其他字段。
- 建议你自己练习：只修改 `department`、只修改 `age`、同时修改多个字段。

