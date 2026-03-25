---
name: memory-pro
description: 整合的记忆增强系统 — ACT-R 衰减、智能分类、Weibull 近似、Bayesian 置信度、六分类体系。\
  当用户说"记忆"、"记得"、"搜索记忆"、"我之前说过"时触发。\
  用于组织记忆、提取重要内容、维护长期知识库。
metadata:
  openclaw:
    emoji: "🧠"
    requires:
      bins: [node]
---

# 🧠 Memory-Pro Skill

整合的记忆增强系统，基于 ACT-R 认知科学理论。

## 核心算法

### ACT-R Base-Level Activation（已实现）
每次访问重置衰减时钟，对数平滑（前几次访问收益最大）：

```
B(M) = ln(n + 1) - 0.5 × ln(ageDays / (n + 1))
activation = 1 / (1 + exp(-clamp(B, -10, 10)))
```

**和 Weibull 的区别：** ACT-R 天然平衡了访问次数和访问间隔，不需要手动调形状参数。

### 六分类 × 衰减系数（已实现）

| Category | 衰减率 | 说明 | 典型半衰期 |
|----------|--------|------|-----------|
| profile | 0.01 | 身份/角色，几乎不变 | ~70天 |
| preference | 0.03 | 偏好/习惯，稳定 | ~23天 |
| case | 0.05 | 踩坑教训，记住 | ~14天 |
| entity | 0.08 | 项目/工具，项目结束即遗忘 | ~9天 |
| pattern | 0.10 | 模式/规律，可能过时 | ~7天 |
| event | 0.15 | 事件，一次性的 | ~4.6天 |

### Bayesian 置信度更新（已实现）

新记忆与旧记忆矛盾时，自动降低旧记忆置信度：

```
posterior = (p × s) / (p × s + (1-p) × (1-s))
```

**检测逻辑：** 关键词反转检测（"不/是"、"不要/要"等信号对）

### 召回评分公式（已实现）

```
finalScore = BM25 × 0.25 + ACT-R激活 × 0.35 × tierMult + 分类权重 × 0.25 + 置信度 × 0.15
```

三层 Tier 倍率：core=1.5, working=1.0, peripheral=0.6

---

## 文件结构

```
memory-pro/
├── SKILL.md                        # 本文档
├── scripts/
│   ├── memory-store.mjs           # 存储记忆（ACT-R + Bayesian）
│   ├── memory-recall.mjs          # 召回记忆（混合评分）
│   ├── memory-stats.mjs           # 统计面板
│   └── auto-capture.mjs          # 自动捕获（正则提取）
└── memory/
    └── memory-db.json             # 记忆主库
```

---

## 工具脚本

### 存储记忆
```bash
node ~/.openclaw/workspace/skills/memory-pro/scripts/memory-store.mjs \
  <category> "<内容>" [tier]
```

### 召回记忆
```bash
node ~/.openclaw/workspace/skills/memory-pro/scripts/memory-recall.mjs \
  "<查询词>" [category] [limit]
```

### 统计面板
```bash
node ~/.openclaw/workspace/skills/memory-pro/scripts/memory-stats.mjs
```

### 自动捕获（由 CRON 调用）
```bash
node ~/.openclaw/workspace/skills/memory-pro/scripts/auto-capture.mjs
```

---

## 未来特性（记着要做）

### Hebbian 联想学习（未来）
"同时激活的记忆会关联在一起" — 神经元理论。

**实现方案：** 每次召回命中的记忆两两之间 +1 到共现计数。下次搜索时额外加权。

**暂不实现原因：** 需要关联图谱数据结构，工作量大，收益不明显。

### 多记忆关联图谱（未来）
基于 Hebbian 规则，自动建立跨记忆的关联网络。

**暂不实现原因：** 同上。

---

## 与其他组件的关系

- **QMD 向量搜索**：负责语义相似搜索（`memory_search` 工具）
- **memory-tiering**：负责三层分层整理（compaction 时触发）
- **elite-longterm-memory**：提供 WAL 写入协议
- **openclaw-self-improvement**：负责错误/教训的持久化
- **memory-pro（本技能）**：以上整合 + auto-capture + ACT-R 衰减引擎
