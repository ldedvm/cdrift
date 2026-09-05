---
title: "05-FastAPI基础入门-参数简介和路径参数"
description: "了解接口参数的常见分类"
pubDate: '2026-08-12'
tags: ["FastAPI","Python"]
---

## 学习目标
- 了解接口参数的常见分类
- 理解路径参数的基本用法
- 学会在路由中接收动态参数

## 核心概念

接口参数通常分三类：

1. `路径参数`
   写在 URL 路径里，例如 `/users/1`
2. `查询参数`
   写在 `?` 后面，例如 `/users?page=1`
3. `请求体参数`
   放在请求 body 里，常见于 POST/PUT

这一节重点是路径参数。

路径参数的特点：

- 通常用于标识某一个资源
- 会直接参与路由匹配
- 往往是 id、slug、分类名等

## 代码示例

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/users/{user_id}")
def get_user(user_id: int):
    return {"user_id": user_id}


@app.get("/articles/{article_id}")
def get_article(article_id: int):
    return {"article_id": article_id}
```

上面代码里，`user_id` 和 `article_id` 都是路径参数。

如果访问：

```text
/users/100
```

那么函数里接收到的 `user_id` 就是 `100`。

## 类型注解的作用

```python
def get_user(user_id: int):
```

这里写 `int` 的好处是：

- FastAPI 会自动做类型转换
- 转换失败时自动返回校验错误
- 接口文档里也会显示这个参数是整数

## 易错点

- 函数参数名必须和路径里的名字一致
- `/users/{user_id}` 和函数里的 `uid` 不一致时会报错
- 路径参数是路由的一部分，不能随便漏写

## 我的补充

路径参数最适合用来表达“唯一标识”。  
如果一个值更像筛选条件，例如页码、排序、关键词，它通常更适合放到查询参数里。

