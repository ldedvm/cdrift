---
title: "19-FastAPI进阶-ORM-在路由中使用ORM"
description: "在路由函数中接入数据库会话"
pubDate: '2026-08-26'
tags: ["FastAPI","Python"]
---

## 学习目标
- 在路由函数中接入数据库会话
- 理解请求处理与 ORM 会话之间的关系
- 学会使用依赖注入组织数据库代码

## 核心概念
- ORM 模型定义好之后，还需要把数据库会话交给路由函数使用。
- 最常见的做法是写一个 `get_db()` 依赖，让每个请求都拿到自己的数据库会话。
- 请求结束后，自动关闭会话，避免资源泄漏。

## 代码示例
```python
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel, ConfigDict
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

app = FastAPI()
engine = create_engine("sqlite:///./fastapi_course.db", echo=False)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    age: int
    email: str
    department: str
    is_active: bool


DbSession = Annotated[Session, Depends(get_db)]


@app.get("/users/{user_id}")
def get_user(user_id: int, db: DbSession):
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="用户不存在")
    return UserOut.model_validate(user)
```

## 案例理解
- `get_db()` 就是“数据库会话依赖”。
- 路由函数不再自己创建和关闭数据库连接，而是交给 FastAPI 自动注入。
- `db.get(User, user_id)` 用主键查询用户，是最直接的 ORM 查询方式之一。

## 易错点
- 不要把数据库会话定义成全局共享对象给所有请求一起用。
- `Depends(get_db)` 才是正确写法，不要写成 `Depends(get_db())`。
- 返回 ORM 对象时，建议通过 Pydantic 模型输出，结构会更稳定。

## 我的补充
- 这一节是 FastAPI 和数据库真正接上电的时刻。
- 一旦 `get_db()` 理顺了，后面增删改查都只是“换不同的数据库操作语句”。
- 你可以把它理解成：依赖注入负责给你工具，路由负责完成业务。

