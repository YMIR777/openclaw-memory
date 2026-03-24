# Claude Code 提示词：StarUML Controller API 绘制"记录预约"活动图

## 前提条件

1. StarUML 已安装并打开
2. 已安装 staruml-controller 扩展（`~/Library/Application Support/StarUML/extensions/user/staruml-controller`）
3. StarUML 中已新建或打开一个项目
4. 在 StarUML 中点击 `Tools > StarUML Controller > Start Server...`，使用默认端口 `12345`

## API 基础 URL

```
http://localhost:12345
```

## 任务目标

通过 StarUML Controller REST API 绘制**带泳道的活动图**：
- 主题：餐馆订餐系统 - "记录预约"用例
- 3 个泳道：Customer / Restaurant / System
- 包含：动作节点、初始节点、结束节点、判断节点（菱形）、控制流箭头

---

## 执行步骤

### 第 1 步：创建活动图

```bash
curl -X POST "http://localhost:12345/api/activity/diagrams" \
  -H "Content-Type: application/json" \
  -d '{"name": "记录预约活动图"}'
```

从返回的 JSON 中提取 `data._id` 作为 `DIAGRAM_ID`，后续步骤需要用到。

### 第 2 步：获取 StarUML 项目根节点 ID（parentId）

```bash
curl -s "http://localhost:12345/api/elements/$(python3 -c "import urllib.parse; print(urllib.parse.quote('$DIAGRAM_ID',''))")" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['_parentId'])"
```

**或者**：先获取 status 找到 project root：

```bash
curl -s "http://localhost:12345/api/status" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('data',{}).get('projectRootId',''))"
```

记为 `PARENT_ID`。

### 第 3 步：创建泳道（3 个 partitions）

**Customer 泳道：**
```bash
curl -X POST "http://localhost:12345/api/activity/partitions" \
  -H "Content-Type: application/json" \
  -d '{"name": "Customer", "parentId": "'$PARENT_ID'", "diagramId": "'$DIAGRAM_ID'"}'
```

**Restaurant 泳道：**
```bash
curl -X POST "http://localhost:12345/api/activity/partitions" \
  -H "Content-Type: application/json" \
  -d '{"name": "Restaurant", "parentId": "'$PARENT_ID'", "diagramId": "'$DIAGRAM_ID'"}'
```

**System 泳道：**
```bash
curl -X POST "http://localhost:12345/api/activity/partitions" \
  -H "Content-Type: application/json" \
  -d '{"name": "System", "parentId": "'$PARENT_ID'", "diagramId": "'$DIAGRAM_ID'"}'
```

从每次返回中提取 `_id`，分别记为 `CUSTOMER_ID`, `RESTAURANT_ID`, `SYSTEM_ID`。

### 第 4 步：创建动作节点

**在 Customer 泳道下创建（使用 partition 的 parentId）：**

```bash
# 开始预约（初始动作）
curl -X POST "http://localhost:12345/api/activity/actions" \
  -H "Content-Type: application/json" \
  -d '{"name": "输入预约信息（姓名、电话、人数、日期、时间）", "parentId": "'$CUSTOMER_ID'", "diagramId": "'$DIAGRAM_ID'", "x1": 50, "y1": 100}'

# 提交预约请求
curl -X POST "http://localhost:12345/api/activity/actions" \
  -H "Content-Type: application/json" \
  -d '{"name": "提交预约请求", "parentId": "'$CUSTOMER_ID'", "diagramId": "'$DIAGRAM_ID'", "x1": 50, "y1": 200}'

# 返回修改请求（验证失败分支）
curl -X POST "http://localhost:12345/api/activity/actions" \
  -H "Content-Type: application/json" \
  -d '{"name": "返回修改请求", "parentId": "'$CUSTOMER_ID'", "diagramId": "'$DIAGRAM_ID'", "x1": 50, "y1": 400}'

# 提示无可用桌位
curl -X POST "http://localhost:12345/api/activity/actions" \
  -H "Content-Type: application/json" \
  -d '{"name": "提示无可用桌位", "parentId": "'$CUSTOMER_ID'", "diagramId": "'$DIAGRAM_ID'", "x1": 50, "y1": 550}'
```

**在 System 泳道下创建：**

```bash
# 接收预约请求
curl -X POST "http://localhost:12345/api/activity/actions" \
  -H "Content-Type: application/json" \
  -d '{"name": "接收预约请求", "parentId": "'$SYSTEM_ID'", "diagramId": "'$DIAGRAM_ID'", "x1": 300, "y1": 100}'

# 验证预约信息
curl -X POST "http://localhost:12345/api/activity/actions" \
  -H "Content-Type: application/json" \
  -d '{"name": "验证预约信息", "parentId": "'$SYSTEM_ID'", "diagramId": "'$DIAGRAM_ID'", "x1": 300, "y1": 200}'

# 检查餐桌可用性
curl -X POST "http://localhost:12345/api/activity/actions" \
  -H "Content-Type: application/json" \
  -d '{"name": "检查餐桌可用性", "parentId": "'$SYSTEM_ID'", "diagramId": "'$DIAGRAM_ID'", "x1": 300, "y1": 350}'

# 创建预约记录
curl -X POST "http://localhost:12345/api/activity/actions" \
  -H "Content-Type: application/json" \
  -d '{"name": "创建预约记录", "parentId": "'$SYSTEM_ID'", "diagramId": "'$DIAGRAM_ID'", "x1": 300, "y1": 450}'

# 发送预约确认通知
curl -X POST "http://localhost:12345/api/activity/actions" \
  -H "Content-Type: application/json" \
  -d '{"name": "发送预约确认通知", "parentId": "'$SYSTEM_ID'", "diagramId": "'$DIAGRAM_ID'", "x1": 300, "y1": 550}'
```

**在 Restaurant 泳道下创建：**

```bash
# 处理预约确认
curl -X POST "http://localhost:12345/api/activity/actions" \
  -H "Content-Type: application/json" \
  -d '{"name": "处理预约确认", "parentId": "'$RESTAURANT_ID'", "diagramId": "'$DIAGRAM_ID'", "x1": 550, "y1": 550}'

# 完成预约登记（粗边框活动节点）
curl -X POST "http://localhost:12345/api/activity/actions" \
  -H "Content-Type: application/json" \
  -d '{"name": "完成预约登记", "parentId": "'$RESTAURANT_ID'", "diagramId": "'$DIAGRAM_ID'", "x1": 550, "y1": 650, "isAbstract": true}'
```

### 第 5 步：创建控制节点

```bash
# 初始节点（实心圆）
curl -X POST "http://localhost:12345/api/activity/control-nodes" \
  -H "Content-Type: application/json" \
  -d '{"_type": "UMLInitialNode", "name": "", "parentId": "'$SYSTEM_ID'", "diagramId": "'$DIAGRAM_ID'", "x1": 20, "y1": 50}'

# 活动结束节点（外圈实心圆）
curl -X POST "http://localhost:12345/api/activity/control-nodes" \
  -H "Content-Type: application/json" \
  -d '{"_type": "UMLActivityFinalNode", "name": "", "parentId": "'$RESTAURANT_ID'", "diagramId": "'$DIAGRAM_ID'", "x1": 700, "y1": 720}'

# 判断节点1：信息有效？
curl -X POST "http://localhost:12345/api/activity/control-nodes" \
  -H "Content-Type: application/json" \
  -d '{"_type": "UMLDecisionNode", "name": "信息有效？", "parentId": "'$SYSTEM_ID'", "diagramId": "'$DIAGRAM_ID'", "x1": 300, "y1": 280}'

# 判断节点2：有可用餐桌？
curl -X POST "http://localhost:12345/api/activity/control-nodes" \
  -H "Content-Type: application/json" \
  -d '{"_type": "UMLDecisionNode", "name": "有可用餐桌？", "parentId": "'$SYSTEM_ID'", "diagramId": "'$DIAGRAM_ID'", "x1": 300, "y1": 430}'
```

### 第 6 步：获取所有元素的 view ID，准备连线

先列出图上的所有元素视图：

```bash
curl -s "http://localhost:12345/api/diagrams/$(python3 -c "import urllib.parse; print(urllib.parse.quote('$DIAGRAM_ID',''))")/views" | python3 -c "
import sys, json
d = json.load(sys.stdin)
for v in d.get('data', []):
    print(f\"{v.get('modelId','')} | {v.get('_type','')} | {v.get('left',0)}, {v.get('top',0)}\")
"
```

根据 `left/top` 位置和元素名称，找到每个元素的 `modelId`（即元素的 `_id`），记录下来用于连线。

### 第 7 步：创建控制流（箭头）

**格式：**
```bash
curl -X POST "http://localhost:12345/api/activity/control-flows" \
  -H "Content-Type: application/json" \
  -d '{"sourceView": "元素1的_id", "targetView": "元素2的_id", "name": "箭头名称（可选）", "guard": "是/否（判断节点出口标注）"}'
```

**按以下顺序创建控制流：**

1. 初始节点 → "输入预约信息"（Customer）
2. "输入预约信息" → "提交预约请求"（Customer）
3. "提交预约请求" → "接收预约请求"（System）
4. "接收预约请求" → "验证预约信息"（System）
5. "验证预约信息" → 判断节点1（信息有效？）
6. 判断节点1（否） → "返回修改请求"（Customer），guard: "否"
7. 判断节点1（是） → "检查餐桌可用性"（System），guard: "是"
8. "返回修改请求" → "输入预约信息"（Customer），形成循环（标注最多3次）
9. "检查餐桌可用性" → 判断节点2（有可用餐桌？）
10. 判断节点2（否） → "提示无可用桌位"（Customer），guard: "否"
11. 判断节点2（是） → "创建预约记录"（System），guard: "是"
12. "提示无可用桌位" → "提交预约请求"（Customer）前（重新选择时间）
13. "创建预约记录" → "发送预约确认通知"（System）
14. "发送预约确认通知" → "处理预约确认"（Restaurant）
15. "处理预约确认" → "完成预约登记"（Restaurant，粗边框活动）
16. "完成预约登记" → 结束节点

### 第 8 步：自动布局（可选）

```bash
curl -X POST "http://localhost:12345/api/diagrams/$(python3 -c "import urllib.parse; print(urllib.parse.quote('$DIAGRAM_ID',''))")/layout" \
  -H "Content-Type: application/json" \
  -d '{"direction": "TB", "spacing": 50}'
```

### 第 9 步：保存项目

```bash
curl -X POST "http://localhost:12345/api/project/save" \
  -H "Content-Type: application/json" \
  -d '{"path": "'$HOME'/Documents/troe_projects/staruml-作业/餐馆订餐系统_记录预约_活动图.mdj"}'
```

如果目录不存在，先创建：
```bash
mkdir -p "$HOME/Documents/troe_projects/staruml-作业"
```

---

## 重要提醒

⚠️ **每完成一个步骤报告一次状态**，不要一口气全部执行完
⚠️ **如果遇到 API 返回 `success: false`**，停止并报告错误信息
⚠️ **判断节点的 guard 字段** 用来标注"是/否"出口，不要漏掉
⚠️ **连线需要用元素的 `_id`**（不是 view id），第 6 步帮你找到它们

开始执行！
