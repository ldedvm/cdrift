---
title: "15-FastAPI进阶-中间件"
description: "理解中间件的执行位置"
pubDate: '2026-08-22'
tags: ["FastAPI","Python"]
---

## 学习目标
- 理解中间件的执行位置
- 学会在请求前后做统一处理
- 认识日志、耗时统计、请求标识等常见场景

## 核心概念
- 中间件可以理解成“所有请求都会经过的一层公共逻辑”。
- 请求进入路由前先经过中间件，请求处理完成返回响应时也会再次经过中间件。
- 常见用途：
  - 记录访问日志
  - 统计接口耗时
  - 添加统一响应头
  - 处理跨域
  - 做简单鉴权

## 代码示例
```python
import time
import uuid

from fastapi import FastAPI, Request

app = FastAPI()


@app.middleware("http")
async def add_request_info(request: Request, call_next):
    request_id = str(uuid.uuid4())
    start_time = time.perf_counter()

    response = await call_next(request)

    process_time = time.perf_counter() - start_time
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Process-Time"] = f"{process_time:.4f}"
    return response


@app.get("/ping")
def ping():
    return {"message": "pong"}
```

## 案例理解
- 访问任意接口时，中间件都会先生成一个请求编号。
- 路由执行完成后，再计算耗时并写入响应头。
- 这样前端和后端排查问题时，就能通过 `X-Request-ID` 快速定位某一次请求。

## 易错点
- 中间件里必须调用 `await call_next(request)`，否则请求到不了真正的路由函数。
- 如果你在中间件中读取请求体，要注意后续代码还能不能继续读取。
- 中间件适合做“全局通用逻辑”，不适合塞入某个业务接口的细节规则。

## 我的补充
- 中间件是“横切逻辑”的最佳放置点。
- 如果你发现很多接口都在重复写同一段代码，就要想想这段逻辑是不是应该提到中间件里。
- 学完这节后，你的接口已经更接近实际项目的组织方式了。

