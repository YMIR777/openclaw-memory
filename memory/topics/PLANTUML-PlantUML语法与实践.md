# PlantUML 语法与实践

> 创建时间：2026-03-25
> 更新：2026-03-25
> 标签：#工具 #UML #PlantUML #作业

---

## 安装状态

- 安装路径：`/opt/homebrew/bin/plantuml`
- 版本：`PlantUML version 1.2026.2`
- 依赖：Graphviz（`brew install graphviz`）
- 使用方式：终端直接运行 `plantuml xxx.puml` 生成图片

---

## 核心语法规则（活动图）

### ⚠️ 关键发现：版本差异导致大量失败

- 系统安装的是 **PlantUML 1.2026.2**（很新）
- 新语法（`start/stop` + `while` + `detach`）与旧语法（`partition` + `|泳道|`）**不能混用**
- `while ... endwhile` 在 1.2026 新语法中有兼容性问题
- **最安全写法**：用 `start/stop` 新语法，但**避免混用泳道切换 `|xxx|`**

### 活动图新语法（Beta，推荐）

| 功能 | 语法 | 示例 |
|------|------|------|
| 活动 | `:内容;` | `:输入商品标识;` |
| 开始/结束 | `start` / `stop` | `start ... stop` |
| 条件分支 | `if (...) then (...) ... endif` | `if (现金？) then (是) ... endif` |
| 多条件 | `elseif`（水平排列） | `if (A?) then ... elseif (B?) then ... endif` |
| 循环 | `while ... endwhile` | `while (还有商品？) ... endwhile (否)` |
| 重复循环 | `repeat ... repeat while` | `repeat :读数据; ... repeat while (还有？)` |
| 停止/跳转 | `stop` / `detach` | `if (错?) then :错误; stop endif` |
| 分支颜色 | `<<#颜色>>` | `:action; <<#palegreen>>` |
| 泳道（分区） | `partition "名称" { }` | `partition "收银员" { ... }` |
| 泳道内切换 | **不建议混用** | 与 `|泳道|` 切换有兼容问题 |

### 泳道图（旧语法，稳定）

```plantuml
partition "顾客" #FFCCCC {
  :携带商品到达;
  :付款;
}
partition "收银员" #CCCCFF {
  :开始销售;
  :输入商品;
}
partition "系统" #CCFFCC {
  :记录商品;
  :打印收据;
}
```

### 旧语法活动图（稳定，推荐泳道图用这个）

```plantuml
(*) --> "第一步"
if "条件？" then
  --> [是] "第二步"
else
  --> [否] "第三步"
endif
"第三步" --> (*)
```

### 常用 skinparam

```plantuml
skinparam activity {
  BackgroundColor #FFF8F0
  BorderColor #555555
  ArrowColor #333333
  DiamondBackgroundColor #FFDDCC
}
```

---

## 踩坑记录（2026-03-25）

### 1. `|泳道|` 切换 + `while` 混用导致错误
- **现象**：`while (条件？) is (是) not (否) ... endwhile` 在泳道内报错
- **解决**：泳道图不用 `while`，用文字描述循环（如"重复输入直到所有商品输入"）

### 2. `start/stop` 新语法 + `partition` 混用报错
- **现象**：`start ... partition "xxx" { ... } stop` 报语法错误
- **解决**：泳道用旧语法 `partition`，不用 `start/stop`

### 3. `detach` 在 if 内报错
- **现象**：`if ... then ... detach ... endif` 报 line 错误
- **解决**：用 `stop` 代替，或去掉 detach

### 4. `elseif` 垂直排列问题
- **现象**：多个 elseif 默认水平排列，图很宽
- **解决**：`!pragma useVerticalIf on` 可改为垂直排列

### 5. 输出格式
- 默认输出 PNG，可加 `-f svg` 生成 SVG
- PlantUML 默认在同目录生成同名图片

---

## 使用工作流

```
写 .puml 文件 → plantuml xxx.puml → 检查报错 → 调整语法 → 重新生成
```

**调试技巧**：
- 先写最简版本测试单个语法点
- 确认无错后再逐步增加复杂度
- 泳道图用旧语法，活动图用新语法

---

## 官方文档

- 旧语法：https://plantuml.com/activity-diagram-legacy
- 新语法：https://plantuml.com/activity-diagram-beta
- 本地文档：`~/Documents/个人知识体系/Ai工作流/VibeCoding/reference/PlantUML/`

---

## 本次作业文件

- `~/Documents/trae_projects/UML作业/` — UML 作业存放目录
- `uml-activity-diagram.puml/png` — 收银用例活动图
- `uml-swimlane-diagram.puml/png` — 收银用例泳道图
