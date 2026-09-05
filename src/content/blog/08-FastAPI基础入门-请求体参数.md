---
title: "08-FastAPI基础入门-请求体参数"
description: "理解请求体参数的使用场景"
pubDate: '2026-08-15'
tags: ["FastAPI","Python"]
---

## 学习目标
- 理解请求体参数的使用场景
- 学会接收 JSON 请求数据
- 认识 Pydantic 模型在请求体中的作用

## 核心概念

请求体参数最常见于：

- 新增数据
- 更新数据
- 提交表单式 JSON 数据

在 FastAPI 中，最典型的做法是用 `Pydantic` 模型接收请求体。

好处：

- 字段更清晰
- 自动校验
- 自动生成文档

## 代码示例

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class ItemCreate(BaseModel):
    name: str
    price: float
    in_stock: bool = True


@app.post("/items")
def create_item(item: ItemCreate):
    return {
        "message": "create success",
        "item": item.model_dump(),
    }
```

请求示例：

```json
{
  "name": "Mechanical Keyboard",
  "price": 199.0,
  "in_stock": true
}
```

## 为什么不用一堆零散参数

如果你把请求体拆成多个独立参数，维护会越来越乱。  
用模型接收会有三个好处：

1. 字段统一管理
2. 校验逻辑集中
3. 接口文档更完整

## 易错点

- 忘记继承 `BaseModel`
- 以为 POST 参数默认都来自请求体，其实只有模型参数最明确
- 更新接口和新增接口共用一个模型，导致字段规则不合适

## 我的补充

后续 ORM 部分也建议你保留这个习惯：

- `CreateSchema` 负责新增
- `UpdateSchema` 负责更新
- `ReadSchema` 负责返回给前端

