# 开发规范沉淀 — 2026-05-10

## 🎨 Taste Skill 强制使用规则

### 适用范围
所有前端/UI 开发任务**必须**使用 taste-skill（design-taste-frontend）。

### 注入方式
在子 Agent 任务描述中，开头必须附加：

```
【设计规范 - 强制执行】
- DESIGN_VARIANCE: 8 (1-10，布局不对称性)
- MOTION_INTENSITY: 6 (1-10，动画深度)
- VISUAL_DENSITY: 4 (1-10，信息密度)
- 无 3 列等宽卡片（Anti-Card Overuse）
- 使用 Geist/Satoshi/Cabinet Grotesk 字体（非 Inter）
- 所有数字用 font-mono
- 弹簧动画：cubic-bezier(0.34, 1.56, 0.64, 1)
- 禁止 Emoji（用 Phosphor/Radix 图标）
- 禁止纯黑 #000000
- 禁止霓虹/外发光
- 卡片内边距：p-8 或 p-10
- 圆角：rounded-[2.5rem] 用于大容器
- 使用 Liquid Glass（backdrop-blur + 1px 内边框 + 内阴影）
- 磁吸微物理（MOTION_INTENSITY > 5 时）
- 布局过渡使用 Framer Motion layout/layoutId
- 瀑布式交错动画（staggerChildren）
```

### 关键原则
- **Anti-Slop**: 主动对抗 LLM 的统计偏见（居中卡片、Inter 字体、紫色渐变）
- **Hardware Acceleration**: 只动画 transform 和 opacity
- **Z-Index 克制**: 不滥用 z-50

---

## 🤖 模型路由规则（2026-05-10 更新）

### 主会话
- 当前：kimi/kimi-for-coding（已通过 session_status 确认）

### 子 Agent 模型选择
由于 `agents.defaults.subagents.model` 受保护无法修改，**在每次 sessions_spawn 时显式指定 model**：

| 任务类型 | 模型 | 说明 |
|---------|------|------|
| **代码开发** | `kimi/kimi-for-coding` | 代码能力强，TDD 可靠 |
| **测试/调试** | `kimi/kimi-for-coding` | 需要精确推理 |
| **简单查询** | 省略 model（默认 minimax）| web_search, summarize 等 |
| **非代码任务** | 省略 model | 节省成本 |

### 使用方式
```typescript
sessions_spawn({
  model: "kimi/kimi-for-coding", // 代码任务必加
  task: "...",
  // ...
})
```

---

## 📋 Superpowers 开发流程

### 三技能必须同时使用
1. **superpowers** — Spec-first, TDD, Subagent 驱动
2. **andrej-karpathy-coding** — Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven
3. **taste-skill** — Anti-Slop 前端设计

### 执行模式
- **串行执行**（用户限制：最多 1 个并发 Agent）
- 每个 Task 完成后才 spawn 下一个

### 质量检查清单
- [ ] 先写测试，后写代码（TDD）
- [ ] 每个 Task 有独立 commit
- [ ] 构建通过（npm run build）
- [ ] 全量测试通过（npx vitest run）
- [ ] 代码符合 taste-skill 视觉规范
- [ ] 没有过度工程（YAGNI）

---

## 🧠 本次开发经验

### Reports 扩展（2026-05-10）
- **7 个 Task**，约 30 分钟完成
- 新增：财务摘要、净资产曲线、财富自由进度、应急资金、Tooltip 智慧系统
- **问题**：Task 5 超时（9m59s）→ 原因是 TypeScript `erasableSyntaxOnly` 与 enum 不兼容
- **解决**：改为 `as const` + type 模式

### 技术债务
- `parseInput.test.ts` 已有测试失败（与本次更改无关）
- 需要后续修复

---

## 💡 产品理念进化（2026-05-10 — 重要）

### 核心结论：记账是记录存在，不是批判消费

**用户现实：**
- 每月生活费 1000，存款几百
- 陪玩时薪 15-20 元
- 钱用来升级设备、提升生活质量
- 几乎没有结余

**关键洞察：**
- 强迫生存阶段的人存钱 = 自虐
- 时薪转化对时薪 20 元的人是**羞辱而非激励**
- 纳瓦尔/富爸爸的理论前提是"已有基本生活保障"
- **用户原话**："如果现在让我分出一部分钱只用来存着，那我的生活会过的很难受"

### 调整后的产品理念

**❌ 暂时不做（不符合当前人生阶段）：**
- 金鹅账户 — 没有投资场景，预估年产蛋虚假
- 时薪转化 — 会变成压力源
- 储蓄率压力 — 没有余量
- 财富自由进度 — 为时过早

**✅ 现在做（贴合真实需求）：**
- 本月总收入 — 确认劳动有价值
- 支出类型记录 — 确认"我为生活质量投资了"
- 许愿瓶进度 — 视觉化攒钱买想要的东西
- 客户回头客比例 — 信心来源

**🔄 以后加回（收入稳定后）：**
- 月收入 3000+ 有余量时：时薪转化、金鹅账户
- 有投资打算时：财富自由进度

### 反思
产品设计必须贴合用户真实生活阶段，不能照搬书本理论。**财务软件应该是镜子，不是鞭子。**

---

## 📝 后续计划

1. **后悔率整合** — Reflection 页面时间胶囊功能
2. **数据可视化升级** — 用 taste-skill 提升图表动效质感（现有功能）
3. **其他页面扩展** — Dashboard、Workbench 加入适合的洞察系统

---

*创建时间：2026-05-10*
*关联项目：绮梦帐间（vault-app）*
