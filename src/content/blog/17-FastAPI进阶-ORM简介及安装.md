---
title: "17-FastAPI进阶-ORM简介及安装"
description: "理解 ORM 的基本作用"
pubDate: '2026-08-24'
tags: ["FastAPI","Python"]
---

## 学习目标
- 理解 ORM 的基本作用
- 明白为什么 FastAPI 项目经常会配合 ORM 使用
- 完成 SQLAlchemy 环境准备

## 核心概念
- ORM 全称是 Object Relational Mapping，对象关系映射。
- 它的作用是把“数据库中的表和字段”映射成“Python 中的类和属性”。
- 不用 ORM 时，我们经常直接写 SQL；用了 ORM 之后，可以更多地通过 Python 对象操作数据。
- 对初学者来说，ORM 最大的价值有三个：
  - 代码更接近 Python 思维
  - 查询、插入、更新、删除更容易组织
  - 和 FastAPI 的依赖注入、Pydantic 模型更容易协作

## 安装命令
```bash
pip install fastapi uvicorn sqlalchemy pydantic
```

## 本课程中的技术选择
- Web 框架：FastAPI
- ORM：SQLAlchemy 2.0 风格
- 数据库：SQLite
- 运行方式：`uvicorn main:app --reload`

## 代码示例
```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./fastapi_course.db"

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
```

## 案例理解
- 这里的 `engine` 可以理解成“Python 连接数据库的入口”。
- `SessionLocal` 可以理解成“每次操作数据库时要创建的一次会话工厂”。
- 后面所有增删改查，都会围绕这两个对象展开。

## 易错点
- 新版 SQLAlchemy 已经更推荐 2.0 风格写法，学习时尽量别混用太多旧语法。
- SQLite 适合学习和小项目，真正生产环境经常会换成 MySQL 或 PostgreSQL。
- ORM 不是“完全不用懂 SQL”，而是先降低使用门槛，再慢慢理解底层原理。

## 我的补充
- 如果你是零基础，先把 ORM 理解成“用 Python 代码操作数据库表”的桥梁就够了。
- 先学会常见 CRUD，后面再补事务、迁移、索引、性能优化，会更顺。
- 本课程后面所有 ORM 示例，都沿用同一个用户表案例，便于连续学习。

