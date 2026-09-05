---
title: "14-FastAPI基础入门-异常响应处理"
description: "学会处理接口异常"
pubDate: '2026-08-21'
tags: ["FastAPI","Python"]
---

## 学习目标
- 学会处理接口异常
- 掌握 `HTTPException` 的用法
- 认识全局异常处理器的作用

## 核心概念
- 接口运行时常见问题包括：数据不存在、参数不合法、权限不足、服务器报错。
- FastAPI 中最常见的异常类是 `HTTPException`，适合主动抛出一个 HTTP 错误。
- 如果项目里希望所有错误都返回统一结构，可以注册全局异常处理器。

## 代码示例
```python
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse

app = FastAPI()

books = {
    1: {"id": 1, "title": "Python 入门"},
    2: {"id": 2, "title": "FastAPI 实战"},
}


@app.get("/books/{book_id}")
def get_book(book_id: int):
    book = books.get(book_id)
    if book is None:
        raise HTTPException(status_code=404, detail="图书不存在")
    return {"code": 200, "message": "success", "data": book}


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "code": exc.status_code,
            "message": exc.detail,
            "data": None,
        },
    )
```

## 案例理解
- 当访问一个不存在的图书编号时，直接 `raise HTTPException(...)`。
- 这样 FastAPI 会进入异常处理流程，而不是继续执行后面的代码。
- 通过全局异常处理器，可以把默认错误格式改造成统一的 JSON 结构。

## 易错点
- `HTTPException` 要用 `raise` 抛出，不是 `return HTTPException(...)`。
- 不要把所有异常都吞掉后返回“未知错误”，否则排查问题会很困难。
- 如果已经有统一异常处理器，就不要在每个接口里重复写大量 try/except。

## 我的补充
- 这一节的重点不是“报错”，而是“可控地报错”。
- 一个成熟接口的标准之一，就是成功和失败都能给前端清晰、稳定、可预期的返回。
- 后面做数据库 CRUD 时，这套异常处理思路会频繁用到。

