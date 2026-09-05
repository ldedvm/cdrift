---
title: "18-FastAPI进阶-ORM-建表"
description: "使用 ORM 定义数据模型"
pubDate: '2026-08-25'
tags: ["FastAPI","Python"]
---

## 学习目标
- 使用 ORM 定义数据模型
- 学会根据模型创建数据表
- 理解字段类型、主键、唯一约束和默认值

## 核心概念
- 在 SQLAlchemy 中，一个模型类通常对应数据库里的一张表。
- 类中的属性通常对应表中的字段。
- `mapped_column()` 用来定义字段的类型和约束。
- `Base.metadata.create_all()` 可以根据模型创建尚未存在的数据表。

## 代码示例
```python
from sqlalchemy import Boolean, Integer, String, create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    age: Mapped[int] = mapped_column(Integer, nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    department: Mapped[str] = mapped_column(String(50), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


engine = create_engine("sqlite:///./fastapi_course.db", echo=False)
Base.metadata.create_all(bind=engine)
```

## 字段解释
- `id`：主键，唯一标识一条记录。
- `name`：用户名，不能为空。
- `age`：年龄，用整数存储。
- `email`：邮箱，设置了唯一约束，不能重复。
- `department`：所属部门，例如“技术部”“运营部”。
- `is_active`：是否启用，默认值为 `True`。

## 案例理解
- 上面的代码运行后，如果数据库里还没有 `users` 表，就会自动创建。
- 这一步相当于把“数据库结构”先搭出来，后面的查询和 CRUD 才有对象可以操作。

## 易错点
- `create_all()` 只能创建不存在的表，不会自动修改已经存在的表结构。
- 如果字段改了，数据库里的旧表不会自动同步更新，正式项目通常用 Alembic 做迁移。
- `String(50)` 里的长度是数据库字段长度，不是 Python 字符串长度校验。

## 我的补充
- 学 ORM 时一定要形成“模型类就是表”的意识。
- 这节是数据库案例的起点，后面所有接口都会围绕 `User` 模型展开。
- 如果你能自己默写出 `User` 模型，后面 CRUD 会轻松很多。

