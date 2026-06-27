# 重要记忆

> MEMORY.md 是索引，具体内容在 `memory/topics/` 目录下。

---

## 📐 Pretext 文字排版引擎
→ `memory/topics/PRETEXT-文字排版引擎经验.md`
→ 项目：`~/Documents/troe_projects/miss-you/` I MISS U（6迭代完成）
Canvas 文字雾 + 指尖拨开交互 + 控制台调参

## 🖤 关于小黒
→ `memory/topics/USER-小黒.md`

## 🔧 常用配置
→ `memory/topics/TOOLS-常用配置.md`
API Keys、Mac 工具、Skills Manager

## 🚀 模型路由（2026-06-27 已生效）
→ `memory/topics/OPENCODE-GO-最终模型分工表-2026-06-27.md`
主会话默认 `opencode-go/kimi-k2.7-code`，fallback 链含 `gpt-5.5` / `lumina` / `wintoken` / `opencode-go/minimax-m3`
裁决层保留 `gpt/gpt-5.5`，`gpt-5.4` 已退出核心位

## 🤖 Claude Code 开发
→ `memory/topics/CLAUDE-CODE-开发配置.md`
Skill、OpenSpec、SpecKit、Runtime 选择

## 💡 核心经验教训
→ `memory/topics/LESSONS-核心经验.md`
10+ 条踩坑记录（Mac 自动化、GitHub、exec 权限等）

## 🧠 小黒的五大核心需求（2026-05-28 完整版）

这五条是最高优先级的协作准则，每次开发/学习对话必须遵循：

### 1. 翻译层
→ 小黒原话："文字的表达和理解会有歧义和偏差，但我知道具体需要什么库才有确认感"
→ 不只是说"装这个包"。每个新技术/概念必须解释：
  - 它是什么（一句话定义）
  - 它解决什么问题（为什么有人造了它）
  - 它跑在哪里（GPU？CPU？浏览器？）
  - 它什么时候用（适用场景）
→ 小黒不需要成为专家，但需要知道自己工具箱里有什么

### 2. 认知扩展
→ 小黒原话："vibe coding 让我像井底之蛙困在狭小的认知里"
→ 每个开发步骤告诉他："这个世界上存在 XYZ，它能做 ABC"
→ 困境：他不知道怎么搜索/发现优秀库和案例
→ 解法：follow 作者 > 搜技术。每个新技术告诉他"谁做的"和"在哪看更多"
→ 哲学：他知道技术会过时，但保持学习就一直在最前沿

### 3. 亲手参与
→ 不是 spawn 8 个 sub-agent 并行跑。你和我一步一步走。
→ 你做决策（颜色、参数、效果方向），我提供选项和建议
→ 控制台调参模式（I MISS U 验证过）：你直接拖动参数，比转述快 10 倍
→ Karpathy 四原则：Think → Simplify → Surgical → Goal-Driven

### 4. 确认感
→ 你不需要"代码能跑"。你需要"知道为什么这个方案比另一个好"。
→ 每次技术选型都要告诉小黒："为什么选 X 而不是 Y？X 的边界在哪？"
→ 小黒原话："如果我自己不清楚怎么实现，就很难精细调整想要的效果"

### 5. Obsidian 自动知识沉淀（2026-05-28 新增）
→ 每次通过翻译层介绍新概念/技术后，自动创建/更新 Obsidian 笔记
→ 笔记格式（已有模板）：
  - 路径：`Ai工作流/认知扩展/[技术名].md`
  - 内容：是什么 / 能干什么 / 核心概念 / 我第一次遇到 / 关键词 / 相关链接
→ Obsidian 是小黒的知识地图——告诉他"我都知道什么"
→ 目标：每次开发会话结束后，小黒的 Obsidian 知识地图自动扩展 1-3 篇

---

### 关联文件
→ `memory/projects/DrSharp-app/SPEC.md` 产品设计文档
→ `memory/projects/DrSharp-app/BRAIN.md` 完整项目背景
→ Obsidian 认知扩展目录：`个人知识体系/Ai工作流/认知扩展/`（已存在 R3F / preText / Shader 三篇）
→ Obsidian 开发方法论目录：`个人知识体系/Ai工作流/开发方法论/`（已存在 Karpathy 四原则 / design-taste-frontend）

## 🧠 QMD 语义搜索
→ `memory/topics/QMD-语义搜索.md`
本地向量搜索、Ollama 兼容、memorySearch 参数

## 🚨 Gateway 问题
→ `memory/topics/GATEWAY-Gateway问题.md`
SIGTERM 根因、版本选择、日志路径

## 🐛 Telegram Webhook 重启循环（2026-04-06）
→ `memory/topics/BUGFIX-Telegram-Webhook-重启循环.md`
api.telegram.org 被墙拦截、无限重试导致 Gateway 崩溃，临时禁用 Telegram 频道修复，待加 bypass 规则彻底解决

## 💰 小黒秋的大金库 — 个人财务 Web App 项目
→ `projects/小黒秋的大金库/SPEC.md`
React + Vite + Three Fiber + GSAP + pretext + Recharts + Zustand + Tailwind
ClawTeam 已启动 architect 搭建基础架构，完成后前端并行开发 Intro/Dashboard/Income 页面
视觉：Claude.ai 温暖极简 + Penderecki's Garden 点云粒子美学

## 🧠 Dr. Sharp 心理分析
→ `skills/dr-sharp/references/dr-sharp-history.md` 进化型档案
→ `skills/dr-sharp/references/analyses/` 完整分析存档（#001-#013）
→ 最新：#015（2026-06-22）Niko夺冠·眼泪·死亡幻想·网赚2000元·京京聊天记录全分析
→ #014（2026-06-18）aim崩溃元模式——完形崩坏·安全阀断裂·父亲凝视·对空的恐惧
→ #013（2026-06-11）京京复合策略、语语与京京正确区分、文字压强vs时间维度
→ `memory/2026-06-22.md` #015全记录
→ `memory/2026-06-18.md` #014全记录

## 🚨 潜江朝圣（2026-06-06/08）
→ 跨越几百公里找语语——炸鸡店、学校、支付宝转账——见到真人 → 照骗、冷淡、十几分钟被打发走
→ 核心教训：**文字压强不能证明感情。** "打字没成本的"——武汉朋友亲身示范
→ 你亲手推倒了一座用半个月聊天记录建的教堂

## ❤️ 京京回归（2026-06-10/11）
→ `memory/topics/京京-前女友完整档案.md` 已更新
→ 分开四个月后京京解除拉黑。告诉闺蜜：会答应复合。仍然喜欢小黒。
→ 小黒决定：等她下周回来发第一条消息后，说"我们重新开始好不好。"（已于6月13日说出）
→ 她回应："想"、"我也是"、"我好想你"、"真可爱"、"我只对你坏呀"——但未直接说"好"（"不知道"=高三少女面对承诺的真实反应）
→ 两种情感表达方式：他需要"被回应"才能安全；她不需要回应也能感受连接
→ 新策略：降低压强、保持存在——不追问、不等回复、让每次出现轻松
→ 不再用痛苦证明爱。默默升级。不急了。

## ❤️ 京京微信聊天分析（#015，2026-06-22）
→ 完整读取6月9-20日微信聊天记录后的核心结论：京京没有不在乎
→ 她说过"想"、"我也是"、"我好想你"、"真可爱"、主动打过几次电话
→ "冷淡"=高三住校物理限制 + 他没给主动的缺口（消息堆满） + 面对"重新开始"无法给承诺
→ "发消息"对他=安全感检查，对她=只是聊天——两种不同的情感表达方式，他没有在忍，她也没有在忍
→ 报备=开启追踪：她不报备是因为知道报备会触发追问
→ 行动：轻量出现（"刚试了你上次说的坏话"）、不等回复、让她呼吸

## 🚫 绮梦账间项目复盘
→ `memory/topics/复盘-绮梦账间项目失败.md`
过度并行(8 agents)导致 API rate limit 全面崩溃，需求复杂度 vs 工程时间不匹配，设计与实现能力脱节

## ⚡ OpenClaw 重要配置
→ `memory/topics/OPENCLAW-重要配置.md`
thinkingDefault 降级（high→medium）、cron 任务修复（isolated→systemEvent）、delivery 机制

## 🔒 OpenClaw 安全加固
→ `memory/topics/LESSONS-核心经验.md` 第 1 条
→ `OpenClaw-安全加固配置`（Obsidian）（Obsidian）
安全审计：5 critical → 2 critical，elevated.allowFrom、strictInlineEval、Watchdog

## 🧹 Workspace 整理总规
→ `docs/openclaw-workspace-organization.md`
→ `checklists/workspace-cleanup.md`
总原则：boot files 保持小，memory 是索引不是流水账，项目资产归项目，临时文件先入 inbox/tmp/temp，清理先审计后移动，`gpt/gpt-5.5` 只做高质量决策层，重复盘点交给并行小任务

## 🚀 模型路由
→ `memory/topics/ROUTING-模型路由.md`
子 Agent 路由规则、Coding Plan 特性

## 📱 OpenHarmony 开发
→ `memory/topics/OPENHARMONY-OpenHarmony开发经验.md`
BMI 项目踩坑：Arc 组件不存在、Builder 接口声明、height 属性名冲突、wizard 项目结构等

## 🔧 Ollama VL 模型
→ `memory/topics/OLLAMA-VISION-失败分析.md`
qwen2.5vl:3b 和 7B vision 模式探索全部失败，根因是 Ollama 融合 vision GGUF 架构限制。本地 vision 暂不可行，MiniMax VL 已打通作为主力。

## 🔧 Skills 管理规范
→ `memory/topics/SKILLS-Skills管理规范.md`

## 🗄️ Sessions 系统设计缺陷与修复（2026-04-09）
→ `memory/topics/OPENCLAW-Sessions-系统设计缺陷与修复.md`
`sessions cleanup` 只清索引不删文件 → ~17MB orphaned 文件堆积 → cron 超时 → 系统崩溃
已修复：自定义清理脚本 v3、isolatedSession、删除僵尸 ACP session

## 🚨 Daily Logs 污染问题（2026-04-14 起）
→ `memory/topics/OPENCLAW-Dreaming污染DailyLogs.md`
从 4/14 开始，Dreaming 输出覆盖 daily logs，正常对话记录丢失。4/17 除外。需调查 dreaming.storage.mode 配置。
→ `memory/topics/PLANTUML-PlantUML语法与实践.md`
活动图、泳道图、新旧语法混用陷阱、PlantUML 1.2026.2 实战经验

## 📅 近期重要事件（精简版）

| 日期 | 事件 |
|------|------|
| 2026-06-22 | Dr. Sharp #015：Niko夺冠眼泪决堤、死亡幻想、网赚2000元（高三自己写的信）、京京聊天记录全分析——她在、两种情感表达方式。行动：提现买旧心愿、本周看房。|
| 2026-06-18 | Dr. Sharp #014 + 三层补充：aim崩溃元模式——完形崩坏·减速滑行·父亲凝视·安全阀断裂·Gemini 17轮对话即#001模式复现·终极问题"怕的不是失控是空"。|
| 2026-06-11 | Dr. Sharp #011-#013：潜江朝圣归来、语语幻想破灭、京京回归、复合计划。七字决定。| 
| 2026-06-03 | Dr. Sharp #010 后续：决定去潜江。Gemini 协助制定全部战术。| 
| 2026-05-25 | Dr. Sharp #010：外部锚点转移、垂钓者模式、潜江女生、Dr. Sharp 应用构想。生物钟改善。|
| 2026-05-16 | Dr. Sharp #009：创造力觉醒日——荣格、引擎空转、"我是个创作者"。aim训练=消耗非创作。|
| 2026-05-09 | 健身计划 DrSharp v1.0 启动（3天/周），Dr. Sharp #007 完整分析 |
| 2026-04-22 | Memory Tiering 审计：会话消失原因确认（7天清理策略），HOT/WARM/COLD 三层重新拆分，daily logs 被 Dreaming 污染发现 |
| 2026-04-09 | sessions 系统设计缺陷大爆发：16个 orphaned JSONL + 30个备份文件堆积，cleanup 951秒超时，cron 全灭。彻底修复：自定义清理脚本 v3、isolatedSession、删除僵尸 ACP |
| 2026-04-08 | Gateway 卡死：ClawTeam qimeng 项目残留 10 session + main 堵塞；Clash Verge TUN dns-hijack 格式修复 |
| 2026-04-06 | Telegram Webhook 崩溃：api.telegram.org 被墙导致无限重试，已临时禁用 Telegram |
| 2026-04-01 | UML 作业：饮料自动售货机类图（PlantUML），`~/Documents/trae_projects/UML作业/vending-machine/` |
| 2026-03-27 | 基本路径测试作业（Sort ex2.3-1）：Pillow 渲染字体、流程图循环回边坐标问题 |

## 📱 OpenHarmony 学生抽奖系统
> Promotion 日期：2026-04-25（手动）

### ArkTS 抽奖系统
- **路径**: `/Users/Ymir/DevEcoStudioProjects/lxf202404020218choujiang`
- **功能**: 抽奖动画 + 学生管理 + 中奖历史
- **技术点**: ArkTS 状态管理 (@State)

### 踩坑记录
- ✅ setInterval 实现滚动抽奖效果
- ✅ AppStorage 跨页面数据共享
- ✅ router 页面跳转
- ❌ `GradientDirection.LeftToRight` 不存在，改用 `angle: 90` 实现水平渐变

## 💰 Token 浪费教训（2026-06-12）

- `gateway config.get` 一次拉 50k+ 字符，今天用了两次 → ~¥1+ 白烧
- web_fetch 大页面无限制 → 每次几千 token
- ACP 失败盲目重试 4 次 → 每次重建上下文
- 规则已写入 AGENTS.md "Token Budget" 章节
- 今天未命中缓存 29%（正常 5%），因为排查问题不断改上下文

## Promoted From Short-Term Memory (2026-06-27)

<!-- openclaw-memory-promotion:memory:memory/2026-06-23.md:10:13 -->
- 废除 Claude Code ACP 调度 + Skills 移植: **已移植 Skills：** | Skill | 来源 | 路径 | |-------|------|------| | huashu-nuwa (女娲·Skill造人术) | ~/.claude/skills/ | `skills/huashu-nuwa/SKILL.md` | [score=0.859 recalls=0 avg=0.620 source=memory/2026-06-23.md:10-13]
<!-- openclaw-memory-promotion:memory:memory/2026-06-23.md:16:16 -->
- 废除 Claude Code ACP 调度 + Skills 移植: **已标记废弃：** [score=0.859 recalls=0 avg=0.620 source=memory/2026-06-23.md:16-16]
<!-- openclaw-memory-promotion:memory:memory/2026-06-23.md:20:20 -->
- 废除 Claude Code ACP 调度 + Skills 移植: **已修改：** [score=0.859 recalls=0 avg=0.620 source=memory/2026-06-23.md:20-20]
<!-- openclaw-memory-promotion:memory:memory/2026-06-22.md:34:36 -->
- 行动方案: 明天提现，买那个购物车里放了三年的旧心愿——还高三自己的账; 本周内去看一个房子——不是搬，是先看。18岁的发誓，20岁开始; 京京：降低压强，保持存在。不追问、不等回复、让每次出现都轻松 [score=0.833 recalls=0 avg=0.620 source=memory/2026-06-22.md:34-36]
<!-- openclaw-memory-promotion:memory:memory/2026-06-22.md:38:39 -->
- 行动方案: **一件不要做的事：** 不要再用死亡幻想测试"我是否被爱"——这个测试是假的。你需要的是她因为你活着而选择靠近你，不是因为你死了而崩溃。 [score=0.833 recalls=0 avg=0.620 source=memory/2026-06-22.md:38-39]
<!-- openclaw-memory-promotion:memory:memory/2026-06-22.md:43:46 -->
- 存档: `analyses/2026-06-22-015-full-session.md` — 全量会话记录（昨晚经历）; `analyses/2026-06-22-015-jingjing.md` — 京京专项分析（含完整聊天分析）; `dr-sharp-history.md` — 进化摘要已更新; `memory/2026-06-22.md` — 本文件 [score=0.833 recalls=0 avg=0.620 source=memory/2026-06-22.md:43-46]
<!-- openclaw-memory-promotion:memory:memory/2026-06-23.md:14:14 -->
- 废除 Claude Code ACP 调度 + Skills 移植: | PUA (大厂PUA引擎) | ~/.claude/plugins/pua-skills/ | `skills/pua/SKILL.md` + references | [score=0.828 recalls=0 avg=0.620 source=memory/2026-06-23.md:14-14]
<!-- openclaw-memory-promotion:memory:memory/2026-06-23.md:17:18 -->
- 废除 Claude Code ACP 调度 + Skills 移植: `skills/claude-code/SKILL.md` — 加 ⛔ DEPRECATED 标记; `memory/topics/CLAUDE-CODE-开发配置.md` — 更新为废弃状态 [score=0.828 recalls=0 avg=0.620 source=memory/2026-06-23.md:17-18]
<!-- openclaw-memory-promotion:memory:memory/2026-06-23.md:21:22 -->
- 废除 Claude Code ACP 调度 + Skills 移植: `AGENTS.md` — "Claude Code Dispatch" 章节替换为 "Development Workflow — 自己干 + 子 Agent 分治"; huashu-nuwa 加入 Mandatory Skill Triggers 表（"造skill" / "蒸馏XX" / "女娲"） [score=0.828 recalls=0 avg=0.620 source=memory/2026-06-23.md:21-22]
<!-- openclaw-memory-promotion:memory:memory/2026-06-23.md:24:24 -->
- 废除 Claude Code ACP 调度 + Skills 移植: **跳过的 Skills（OpenClaw 已有等价）：** [score=0.828 recalls=0 avg=0.620 source=memory/2026-06-23.md:24-24]
