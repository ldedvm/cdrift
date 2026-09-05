---
title: "07-FastAPI基础入门-查询参数和Query类型注解"
description: "区分查询参数与路径参数"
pubDate: '2026-08-14'
tags: ["FastAPI","Python"]
---

## 学习目标
- 区分查询参数与路径参数
- 学会使用 `Query` 做参数声明
- 掌握默认值、必填项和校验写法

## 核心概念

查询参数写在 URL 后面的 `?` 之后，常见场景有：

- 分页：`page=1&size=10`
- 关键字搜索：`keyword=python`
- 排序：`sort_by=created_at`
- 条件筛选：`status=1`

FastAPI 中如果函数参数没有出现在路径里，且不是请求体模型，通常就会被当作查询参数。

## 代码示例

```python
from typing import Annotated

from fastapi import FastAPI, Query

app = FastAPI()


@app.get("/users")
def list_users(
    page: Annotated[int, Query(ge=1, description="页码")] = 1,
    size: Annotated[int, Query(ge=1, le=100, description="每页数量")] = 10,
    keyword: Annotated[str | None, Query(description="搜索关键词")] = None,
):
    return {"page": page, "size": size, "keyword": keyword}
```

访问示例：

```text
/users?page=2&size=20&keyword=tom
```

## `Query` 的价值

和 `Path` 一样，`Query` 的作用也不只是“接参数”，还包括：

- 参数校验
- 接口文档说明
- 默认值设置
- 别名设置

例如：

```python
keyword: Annotated[str | None, Query(alias="q")] = None
```

这样前端可以传 `?q=fastapi`。

## 易错点

- 路径参数和查询参数同名，容易造成阅读混乱
- 查询参数默认是字符串输入，虽然 FastAPI 会做转换，但你还是要明确类型
- 分页参数不做限制，会导致接口被传入非常大的页大小

## 我的补充

分页参数几乎是最适合用 `Query` 的场景。  
以后你做列表页接口时，`page`、`size`、`keyword` 这组三件套会非常常见。

