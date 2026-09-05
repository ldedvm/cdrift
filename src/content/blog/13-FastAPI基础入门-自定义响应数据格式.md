---
title: "13-FastAPI基础入门-自定义响应数据格式"
description: "统一接口返回结构"
pubDate: '2026-08-20'
tags: ["FastAPI","Python"]
---

## 学习目标
- 统一接口返回结构
- 理解 HTTP 状态码与业务状态码的区别
- 为后续项目开发准备统一响应格式

## 核心概念
- 很多项目不会直接返回裸数据，而是统一成类似下面的结构：
```json
{
  "code": 200,
  "message": "success",
  "data": {...}
}
```
- 这样做的好处是前端处理更统一，也方便后续增加错误提示、分页信息、调试信息。
- 这里要区分两个概念：
  - HTTP 状态码：例如 200、404、500，表示请求层面的结果。
  - 业务状态码：例如 `1000` 代表登录失效，`2000` 代表库存不足，由项目自己定义。

## 代码示例
```python
from fastapi import FastAPI

app = FastAPI()


def success(data=None, message="success"):
    return {
        "code": 200,
        "message": message,
        "data": data,
    }


def fail(message="error", code=400):
    return {
        "code": code,
        "message": message,
        "data": None,
    }


@app.get("/books")
def get_books():
    books = [
        {"id": 1, "title": "Python 入门"},
        {"id": 2, "title": "FastAPI 实战"},
    ]
    return success(data=books)


@app.get("/books/{book_id}")
def get_book(book_id: int):
    if book_id != 1:
        return fail(message="图书不存在", code=40401)
    return success(data={"id": 1, "title": "Python 入门"})
```

## 案例理解
- `/books` 返回图书列表时，前端拿到的永远是统一格式。
- `/books/{book_id}` 查询失败时，前端不用猜测字段名，只看 `code` 和 `message` 即可。
- 这套思路在公司项目里非常常见。

## 易错点
- 不要把所有错误都返回 HTTP 200，这会让接口语义变差，日志排查也更困难。
- 自定义返回格式要尽量稳定，不要今天叫 `msg`，明天又改成 `message`。
- 统一格式是为了解决“协作成本”，不是为了增加字段数量。

## 我的补充
- 学习阶段可以先用函数封装统一返回结构。
- 项目变大以后，可以进一步用 Pydantic 响应模型统一约束字段。
- 这一节看起来简单，但对前后端联调体验影响很大。

