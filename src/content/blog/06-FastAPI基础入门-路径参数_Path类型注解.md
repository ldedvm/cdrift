---
title: "06-FastAPI基础入门-路径参数_Path类型注解"
description: "理解 Path 的作用"
pubDate: '2026-08-13'
tags: ["FastAPI","Python"]
---

## 学习目标
- 理解 `Path` 的作用
- 学会给路径参数添加描述、限制和校验
- 认识类型注解对接口文档的帮助

## 核心概念

`Path` 用来给路径参数添加额外信息和校验规则，例如：

- 标题
- 描述
- 最小值
- 最大值
- 示例值

这种写法的好处是：

- 代码更清楚
- 参数校验更严格
- `/docs` 文档页更完整

## 代码示例

推荐写法是 `Annotated`：

```python
from typing import Annotated

from fastapi import FastAPI, Path

app = FastAPI()


@app.get("/users/{user_id}")
def get_user(
    user_id: Annotated[int, Path(title="用户ID", description="必须是正整数", ge=1)]
):
    return {"user_id": user_id}
```

含义：

- `int`：参数类型是整数
- `title`：文档里显示标题
- `description`：参数说明
- `ge=1`：值必须大于等于 1

## 使用场景

当路径参数有明确业务规则时，最好直接约束：

- 用户 id 必须是正整数
- 年份不能小于 2000
- 排名不能超过某个范围

## 易错点

- 把 `Path` 用到查询参数上，这种情况应该用 `Query`
- 忘记类型注解，只写 `Path(...)`
- 校验规则写了，但没有理解 `gt/ge/lt/le` 的区别

常见含义：

- `gt`：大于
- `ge`：大于等于
- `lt`：小于
- `le`：小于等于

## 我的补充

如果你希望接口“更像规范化产品”，要尽量多利用 `Path` 和 `Query` 提供的文档与校验能力，而不是只写一个裸参数。

