---
title: "10-FastAPI基础入门-响应类型-JSON格式"
description: "理解 FastAPI 默认的 JSON 响应方式"
pubDate: '2026-08-17'
tags: ["FastAPI","Python"]
---

## 学习目标
- 理解 FastAPI 默认的 JSON 响应方式
- 学会返回字典、列表和模型数据
- 认识响应序列化的基本流程

## 核心概念

FastAPI 默认最常见的响应格式就是 JSON。  
当你返回：

- `dict`
- `list`
- `Pydantic` 模型数据

FastAPI 通常都会自动转成 JSON 响应。

## 代码示例

最简单的写法：

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/ping")
def ping():
    return {"message": "pong"}
```

如果你需要更明确控制状态码或返回体，可以用 `JSONResponse`：

```python
from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()


@app.post("/login")
def login():
    return JSONResponse(
        status_code=200,
        content={"code": 0, "message": "login success", "data": {"token": "abc123"}},
    )
```

## 什么时候用默认返回，什么时候用 `JSONResponse`

- 只是普通返回数据：直接返回 `dict`
- 需要控制状态码、响应头、格式：用 `JSONResponse`

## 易错点

- 以为所有对象都能直接返回，实际上复杂对象有时需要先转成可 JSON 化的数据
- 返回结构前后不统一，导致前端很难处理
- 成功和失败接口格式差异太大

## 我的补充

项目里最好统一一个 JSON 响应风格，例如：

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

这样后面你做异常处理和接口封装会轻松很多。

