---
title: "26-FastAPI进阶-ORM操作数据-新增数据"
description: "学会使用 ORM 新增数据"
pubDate: '2026-09-02'
tags: ["FastAPI","Python"]
---

## 学习目标
- 学会使用 ORM 新增数据
- 理解对象创建、提交和刷新流程
- 掌握新增接口的基本组织方式

## 核心概念
- 新增一条数据，常见流程是：
  1. 接收前端传来的请求体
  2. 校验数据是否合法
  3. 创建 ORM 对象
  4. `db.add(...)`
  5. `db.commit()`
  6. `db.refresh(...)`
- `refresh()` 的作用是把数据库生成的最新值重新同步到对象上，例如主键 `id`。

## 代码示例
```python
from pydantic import BaseModel, Field
from sqlalchemy import select


class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=20)
    age: int = Field(ge=1, le=120)
    email: str
    department: str
    is_active: bool = True


@app.post("/users")
def create_user(payload: UserCreate, db: DbSession):
    exists = db.scalar(select(User).where(User.email == payload.email))
    if exists:
        raise HTTPException(status_code=400, detail="邮箱已存在")

    user = User(**payload.model_dump())
    db.add(user)
    db.commit()
    db.refresh(user)
    return UserOut.model_validate(user)
```

## 案例理解
- 前端提交一个新用户信息到 `/users`。
- 后端先检查邮箱是否重复，再创建用户对象并写入数据库。
- 提交成功后把完整的新用户返回给前端，便于页面立即显示结果。

## 易错点
- 忘记 `commit()`，数据不会真正写进数据库。
- 忘记 `refresh()`，可能拿不到数据库生成的新主键。
- 新增接口通常要考虑重复数据，例如邮箱、用户名、手机号等唯一字段。

## 我的补充
- “新增”看起来简单，但其实是很多数据质量问题的入口。
- 如果新增前没有校验，后面更新、查询、统计都会变得麻烦。
- 这一节建议你自己动手多插几条测试数据，为后面的更新和删除做准备。

