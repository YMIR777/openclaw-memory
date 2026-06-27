---
name: Exam Autopilot
slug: exam-autopilot
version: 1.1.0
description: "通用在线考试自动答题工作流。自动抓题、自动作答、自动交卷，适用于单选题/多选题/判断题。需要考试页面已在浏览器中打开。"
changelog: |
  - v1.1.0: 新增知识域分析、弱项优先级策略、多选题语义判断框架
  - v1.0.0: 初始版本
metadata: {"clawd":{"emoji":"📝","requires":{"bins":[]},"os":["darwin","linux","win32"]}}
---

# Exam Autopilot — 在线考试自动答题

## 何时使用

用户说"帮我做考试"、"自动答题"、"完成这个测验"、"帮我做这个试卷"，或类似表述。

## 前提条件

1. **考试页面必须在 Edge/Chrome 中打开**（浏览器自动化仅支持这两个浏览器）
2. 用户需已登录账号
3. 页面当前显示考试题目（不是登录页）

## 已知考试类型

### HarmonyOS 应用开发者基础认证（OFCA）

- 及格分：80分
- 题型结构：判断题10道 + 单选题35道 + 多选题5道
- 题库固定，答案相对稳定
- **本 skill 针对此类考试有专项优化**

---

## 工作流程

### Phase 1 — 页面诊断

```json
browser(action="status")
browser(action="tabs")
```

找到考试标签页，用 `label` 指定（如 `exam`）。

### Phase 2 — 打开考试页面（如需要）

```json
browser(action="open", url="<考试链接>", label="exam")
```

### Phase 3 — 获取完整试卷内容

考试页面通常在 iframe 内渲染，标准 snapshot 只会获取可见区域。

**获取全部内容的正确方法：**

```json
browser(action="act", targetId="exam", request={
  "kind": "evaluate",
  "fn": "document.querySelector('iframe').contentDocument.body.innerText"
})
```

这会返回完整试卷文本，包含所有题目编号、分值、题型分类、选项内容。

**⚠️ 如果 innerText 为空**，说明 iframe 有跨域限制，改用：

```json
browser(action="snapshot", targetId="exam", refs="aria", compact=true)
```

### Phase 4 — 解析题目结构

从完整文本中识别：

| 题型 | 特征 | 元素类型 |
|------|------|----------|
| 单选题 | 选项 A/B/C/D | `radio` |
| 多选题 | 选项 A/B/C/D | `checkbox` |
| 判断题 | "正确" / "错误" | `radio` |

题型分界线通过识别文本中的关键词：
- "单选题 共X题"
- "多选题 共X题"
- "判断题 共X题"

### Phase 5 — 批量获取所有 Refs

**⚠️ 核心教训：ref 在每次快照后会变化！**

正确流程：
1. **只做一次快照**（compact=true），获取全部题目 refs
2. **快速批量点击**，不重复快照
3. 点击后等待 100-200ms 再下一题

```json
browser(action="snapshot", targetId="exam", refs="aria", compact=true)
```

### Phase 6 — 批量答题（核心策略）

#### 判断题（约 80% 选"正确"）

**错误特征（遇到这些优先怀疑"错误"）：**
- 绝对化词汇：「只能」「必须」「一定」「同一时刻同时」「唯一」
- 技术概念混淆：半双工 vs 全双工、静态 vs 动态、单实例 vs 多实例
- 明显错误的数字或描述

**正确特征（遇到这些优先怀疑"正确"）：**
- 「适配了多个」「支持X和Y」「包括」「可以同时」

#### 单选题

根据 HarmonyOS 知识判断，重点关注：
- UIAbility 生命周期回调（onCreate/onBackground/onForeground/onDestroy）
- Stage 模型概念（AbilityStage、WindowStage）
- ArkTS 语法（enum、interface、type）
- 布局组件（Stack/Flex/Grid/Row/Column）
- 权限配置（module.json5）

#### 多选题（重点改进区域）

**⚠️ 上一版最大失误：机械全选导致低分**

**正确策略：根据题目语义判断，不轻易全选**

| 题目类型 | 策略 | 示例 |
|----------|------|------|
| 内核/系统级支持 | 全选概率高 | 权限、网络能力 |
| 组件/回调/方法 | 全选概率高 | 生命周期回调、WindowStage相关 |
| 功能/特性描述 | 语义分析 | 去明显错误的 |
| 场景/设计模式 | 常识判断 | 架构设计最优解 |
| 语言语法/写法 | 有明确规范 | ArkTS枚举写法 |
| 开发条件/必要条件 | 去掉非必需的 | 签名、开发者选项是必要的 |

**多选题答案特征规律（基于本次考试）：**
- WindowStage 相关回调 → 选 C+D（onWindowStageDestroy + onWindowStageCreate）
- 地理围栏 → 选 C+D（权限定义 + 地理围栏概念）
- 枚举类型写法 → 联合类型（B）是 ArkTS 正确写法
- 开发者条件 → A+B（开发者选项 + 签名）而非 C+D（USB连接、充电）
- 用户首选项 → A+B+C（配置信息、速度快、不适合大数据）

**⚠️ 不要选 D（设备充满电）这种明显非必要条件**

#### 重点知识域（根据本次报告的弱项排序）

根据考试分析报告，以下知识域错题最多，答题时优先保证这些题目正确：

1. **程序框架开发（75%正确率）** — 最高优先级
   - Stage 模型开发概述
   - UIAbility 组件生命周期
   - AbilityStage 组件管理器
   - 应用程序包基础知识

2. **应用服务开发（0%正确率）** — 极弱
   - 位置服务开发（geofence）
   - 相关权限：ohos.permission.APPROXIMATELY_LOCATION

3. **UX设计（50%正确率）**
   - 应用 UX 设计规范

4. **应用数据管理（50%正确率）**
   - 方舟数据管理
   - 用户首选项（Preferences）

5. **应用网络通信（50%正确率）**
   - 从网络获取数据
   - 访问网络

6. **ArkTS语言应用（85%正确率）** — 最强，稍注意即可

### Phase 7 — 交卷

从 innerText 中搜索按钮关键词：
- "交卷"
- "提交"
- "确认"

点击后会弹出确认对话框，点击"确认"即可。

### Phase 8 — 报告成绩

读取结果页中的得分，格式化为：

```
✅ 考试完成！

| 题型 | 得分 | 答对 | 答错 |
| 单选题 | X分 | X道 | X道 |
| 多选题 | X分 | X道 | X道 |
| 判断题 | X分 | X道 | X道 |
| 总分 | X/100 | | |
```

---

## 经验教训（踩坑记录）

### 1. Ref 变化问题
- **问题：** 每次 snapshot 后，iframe 内的 ref 会变化
- **教训：** 先快照获取所有 ref，再批量点击；不要边点边快照
- **代码：** 批量点击时每 3-5 题等待 100ms

### 2. iframe 内滚动
- **问题：** 父页面滚动不影响 iframe 内部
- **教训：** 用 evaluate 执行 contentDocument.documentElement.scrollTop
- **代码：** scrollTop = 99999 可跳到 iframe 底部

### 3. 多选题不要机械全选（最大教训）
- **问题：** 全选导致低分（本次多选只得 18/30）
- **教训：** 先理解题目语义，再根据选项合理性判断
- **常见陷阱：**
  - "以下哪些是必要条件" → 去掉"设备充满电"这种非必要选项
  - 语法类题目 → 有唯一正确答案
  - 地理围栏 → 「需要在室外开阔区域使用」是错的（GPS在任何地方都能用）

### 4. 判断题有规律
- **规律：** 约 80% 选"正确"
- **错误特征：**
  - 绝对化词汇（只能、必须、同一时刻同时）
  - 混淆技术概念（半双工/全双工、静态/动态）
  - 明显错误的数字或描述

### 5. 交卷按钮位置
- **位置：** 通常在页面底部或答题卡区域
- **关键词：** "交卷"、"提交"、"确认"
- **确认框：** 交卷后会弹出确认，点击"确认"才是真正交卷

### 6. 答题状态识别
- **已选：** [checked] 在快照中标注
- **未选：** 无 [checked] 标注
- **存疑：** 页面会有"存疑"按钮标记不确定的题

### 7. 多选题答案规律（专项总结）
- WindowStage 相关 → C+D（Create/Destroy）
- 地理围栏 → C+D（权限+定义）
- 枚举类型 → B（联合类型是 ArkTS 标准写法）
- 开发者必要条件 → A+B（开发者选项+签名）不是 USB/充电
- 用户首选项 → A+B+C（配置信息+速度快+不适合大数据）不是 D

### 8. 知识域优先级
根据本次考试分析，复习/答题优先级：
1. 程序框架开发（UIAbility、Stage模型、AbilityStage）
2. 应用服务开发（位置服务）
3. UX设计、应用数据管理、应用网络通信

---

## 快速命令参考

```json
// 打开考试页面
browser(action="open", url="<考试链接>", label="exam")

// 获取 iframe 完整内容
browser(action="act", targetId="exam", request={
  "kind": "evaluate",
  "fn": "document.querySelector('iframe').contentDocument.body.innerText"
})

// iframe 内滚动到底部
browser(action="act", targetId="exam", request={
  "kind": "evaluate",
  "fn": "document.querySelector('iframe').contentDocument.documentElement.scrollTop = 99999"
})

// 批量快照获取所有 refs
browser(action="snapshot", targetId="exam", refs="aria", compact=true)

// 在 iframe 内按键
browser(action="act", targetId="exam", request={"kind": "press", "key": "End"})
```

---

## 限制

- 只能处理客观题（单选/多选/判断）
- 不能处理主观题/填空题
- 多选题需要知识判断，不能纯靠模式
- iframe 跨域限制会导致 innerText 为空
- 如果页面不是 iframe 结构，需要调整抓取策略

## 通用答题策略速查

**多选题策略：**
- 内核/系统支持类 → 通常全选
- 模块/组件类 → 通常全选
- 工具/功能类 → 去掉明显不对的
- 场景描述类 → 根据常识判断
- **绝对不要选：「设备充满电」「必须在室外」这种非必要条件**

**判断题策略：**
- 看到"只能/必须/一定/同一时刻同时" → 很可能错误
- 看到"适配了多个/支持X和Y/包括" → 很可能正确
- 技术概念混淆（I2C半双工、Entry只能一个） → 错误