---
title: "04-FastAPI基础入门-路由"
description: "理解路由在 FastAPI 中的作用"
pubDate: '2026-08-11'
tags: ["FastAPI","Python"]
---

## 学习目标
- 理解路由在 FastAPI 中的作用
- 学会定义不同路径的接口
- 认识常见请求方法对应的路由写法

## 核心概念

路由决定了：

- 什么 URL 会命中这个函数
- 使用什么请求方法访问
- 返回什么内容

常见请求方法：

- `GET`：查询数据
- `POST`：新增数据
- `PUT`：整体更新
- `PATCH`：局部更新
- `DELETE`：删除数据

在 FastAPI 中，路由通常通过装饰器声明：

- `@app.get()`
- `@app.post()`
- `@app.put()`
- `@app.delete()`

## 代码示例

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/users")
def get_users():
    return [{"id": 1, "name": "Tom"}]


@app.post("/users")
def create_user():
    return {"message": "create success"}


@app.delete("/users/{user_id}")
def delete_user(user_id: int):
    return {"message": f"delete user {user_id}"}
```

## 理解方式

可以把路由看成“地址和函数之间的映射表”：

- 访问 `/users` + `GET`，执行 `get_users`
- 访问 `/users` + `POST`，执行 `create_user`
- 访问 `/users/1` + `DELETE`，执行 `delete_user`

## 易错点

- 同一路径不同方法可以共存，但同一路径同方法重复定义会冲突
- 路由顺序有时会影响匹配，尤其是动态路径和固定路径混在一起时
- 删除、更新接口最好明确资源 id，不要把所有逻辑都堆在一个路由里

## 我的补充

路由设计要尽量“像资源”而不是“像动作名”。  
例如更推荐：

- `/users`
- `/users/{user_id}`

而不是：

- `/getUser`
- `/deleteUser`

