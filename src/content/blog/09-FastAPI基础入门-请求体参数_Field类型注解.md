---
title: "09-FastAPI基础入门-请求体参数_Field类型注解"
description: "理解 Field 的作用"
pubDate: '2026-08-16'
tags: ["FastAPI","Python"]
---

## 学习目标
- 理解 `Field` 的作用
- 学会给请求体字段添加说明、默认值和校验规则
- 提高接口文档的可读性

## 核心概念

`Field` 是给请求体模型中的字段增加元信息和校验规则的工具，和 `Path`、`Query` 的思路很像。

它适合做这些事：

- 指定默认值
- 添加字段说明
- 设置最小长度、最大长度
- 设置数值范围
- 给文档页添加示例

## 代码示例

```python
from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI()


class ItemCreate(BaseModel):
    name: str = Field(min_length=2, max_length=30, description="商品名称")
    price: float = Field(gt=0, description="商品价格，必须大于 0")
    stock: int = Field(default=0, ge=0, description="库存数量")


@app.post("/items")
def create_item(item: ItemCreate):
    return item.model_dump()
```

## 规则示例

- `min_length=2`：字符串最短 2 位
- `max_length=30`：字符串最长 30 位
- `gt=0`：数值必须大于 0
- `ge=0`：数值必须大于等于 0

## 实际意义

如果你不写这些规则，很多错误会拖到数据库层或业务层才暴露。  
如果你在 `Field` 就写清楚，错误会更早、也更容易发现。

## 易错点

- 把 `Field` 当成类型本身，它只是字段配置
- 请求体字段校验写得太宽松，导致脏数据进入系统
- 默认值和必填项逻辑冲突

例如：

```python
stock: int = Field(...)
```

这里 `...` 表示必填。

## 我的补充

`Field` 的价值不仅是“防错”，还在于让接口文档更像正式产品文档。  
后端给前端的合作体验，很多时候就体现在这些细节上。

