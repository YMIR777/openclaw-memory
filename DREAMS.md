# Dream Diary

<!-- openclaw:dreaming:diary:start -->
---

*March 18, 2026*

<!-- openclaw:dreaming:backfill-entry day=2026-03-18 source=memory/2026-03-18.md -->

What Happened
1. ClawShell 安装问题: 问题：clawdhub install claw-shell 报错 "Rate limit exceeded"; 解决：使用环境变量 CLAWDHUBREGISTRY=https://clawdhub.com 覆盖配置中的旧地址; and 配置已更新到 /Library/Application Support/clawdhub/config.json [memory/2026-03-18.md:6, memory/2026-03-18.md:7, memory/2026-03-18.md:8]
2. API Keys 配置: 从 Claude Code 配置中找到可用的 API key：; Exa Search: 8534dd8b-d68a-4736-b92c-0afdf1832715 (可用); and GitHub Token: githubpat11BMRRYKI0dj5x8Smry0dZ... (可用) [memory/2026-03-18.md:11, memory/2026-03-18.md:12, memory/2026-03-18.md:13]
3. 工具安装: brew install cliclick - 命令行鼠标控制; brew install blueutil - 蓝牙控制; and brew install switchaudio-osx - 音频设备切换 [memory/2026-03-18.md:19, memory/2026-03-18.md:20, memory/2026-03-18.md:21]
4. 安装过程: 克隆项目：git clone https://github.com/baryhuang/mcp-remote-macos-use.git; 安装 uv：brew install uv; and 创建虚拟环境并安装依赖 [memory/2026-03-18.md:28, memory/2026-03-18.md:29, memory/2026-03-18.md:30]

Reflections
1. No grounded reflections emerged from this note yet.

---

*March 19, 2026*

<!-- openclaw:dreaming:backfill-entry day=2026-03-19 source=memory/2026-03-19.md -->

What Happened
1. 参考资料: CSDN文章：OpenClaw 调用 Claude Code 和 Codex（关于 Codex MCP，不是 ACP）; 主要讲 codex-mcp pip 包，是 Claude Code 的工具调用协议适配层; and 非 OpenClaw ACP 集成文章 [memory/2026-03-19.md:179, memory/2026-03-19.md:180, memory/2026-03-19.md:181]
2. Session Memory 配置（2026-03-20）: 已在 openclaw.json 开启： [memory/2026-03-19.md:243]
3. 根本原因: 1. 我创建的 Claude Code skill 是"参考手册"而非"集成工具"; SKILL.md 里的内容告诉我怎么用 Claude Code; and 错误信息：ACP runtime backend is not configured [memory/2026-03-19.md:10, memory/2026-03-19.md:11, memory/2026-03-19.md:16]
4. 正确做法: 方案 A：ACP Runtime（已验证可用）; 安装 acpx-orchestrator：clawdhub install acpx-orchestrator; and cd /Users/Ymir/Documents/vibe-projects/spec-kit-setup [memory/2026-03-19.md:31, memory/2026-03-19.md:32, memory/2026-03-19.md:39]

Reflections
1. The strongest pattern here is a preference for converting messy inbound information into routed workflows with different downstream actions, instead of handling each case manually. [memory/2026-03-19.md:179, memory/2026-03-19.md:180, memory/2026-03-19.md:181]
2. The day leaned toward building operator infrastructure, which suggests the interaction is often used to reshape the system around recurring needs rather than just complete isolated tasks. [memory/2026-03-19.md:10, memory/2026-03-19.md:11, memory/2026-03-19.md:16]

---

*March 24, 2026*

<!-- openclaw:dreaming:backfill-entry day=2026-03-24 source=memory/2026-03-24.md -->

What Happened
1. 完成事项: Bun 安装：brew install oven-sh/bun/bun（但最终用 npm 安装 qmd）; Collection 创建：qmd collection add /.openclaw/workspace --name openclaw-memory --mask '/.md'（213 files）; and openclaw.json memory.backend 已写入 qmd，searchMode=query [memory/2026-03-24.md:52, memory/2026-03-24.md:56, memory/2026-03-24.md:57]
2. 经验总结（已写入 MEMORY.md）: openclaw-cn 是独立分支，不能与 openclaw 混用; 所有路径、配置都要明确是哪个版本; and OpenClaw 有内置 health-monitor，不需要外部 watchdog [memory/2026-03-24.md:45, memory/2026-03-24.md:46, memory/2026-03-24.md:47]
3. QMD 配置详细经验（已沉淀 Obsidian）: 新建笔记：VibeCoding/05-QMD配置笔记.md; 核心问题：Node.js fetch 不走代理，qmd hftransfer 也不走代理; and 解决：patch getRemoteEtag 函数用 curl 替代 Node.js fetch，走代理下载模型 [memory/2026-03-24.md:67, memory/2026-03-24.md:68, memory/2026-03-24.md:69]
4. Obsidian 知识库更新: 已更新 01-OpenClaw配置笔记.md（QMD 章节）; 新建 05-QMD配置笔记.md（完整流程 + 踩坑记录）; and 索引笔记 00-索引.md 更新双向链接 [memory/2026-03-24.md:77, memory/2026-03-24.md:78, memory/2026-03-24.md:79]

Reflections
1. Important context tends to get externalized quickly into notes, trackers, or memory surfaces, which suggests a preference for explicit systems over holding context informally. [memory/2026-03-24.md:52, memory/2026-03-24.md:56, memory/2026-03-24.md:57]

---

*March 25, 2026*

<!-- openclaw:dreaming:backfill-entry day=2026-03-25 source=memory/2026-03-25.md -->

What Happened
1. No grounded facts were extracted.

Reflections
1. This day reads mostly as monitoring and operational state, not as durable memory. It should be treated as current-state exhaust unless a clearer rule or preference appears. [memory/2026-03-25.md:3-157]

---

*March 26, 2026*

<!-- openclaw:dreaming:backfill-entry day=2026-03-26 source=memory/2026-03-26.md -->

What Happened
1. 📅 今日事件: GitHub token 更新认证完成; skills-manager 推送 GitHub; and MEMORY.md 拆分为 topics/ 目录 [memory/2026-03-26.md:85, memory/2026-03-26.md:86, memory/2026-03-26.md:89]
2. 今日完成: 创建了完整的 OpenHarmony 开发 skill：/.openclaw/workspace/skills/openharmony-dev/SKILL.md; 深度研究了 DevEco Studio 和 OpenHarmony 构建系统; and 基于 bmicalculator 项目的成功经验，建立了完整的项目创建规范 [memory/2026-03-26.md:9, memory/2026-03-26.md:10, memory/2026-03-26.md:11]
3. 关键经验（已沉淀到 skill）: hvigor 缓存路径问题是 ENOENT 错误的根因; hvigor daemon 在 /.hvigor/projectcaches/<hash/workspace/nodemodules/@ohos/ 下创建 symlink; and 项目路径变化后 symlink 指向不存在的旧路径 [memory/2026-03-26.md:14, memory/2026-03-26.md:15, memory/2026-03-26.md:16]
4. 项目状态: 项目结构已创建完毕（CC 写源码 + 我处理工具链）; DevEco Studio 打开后 symlink 路径问题导致 hvigor 构建报错; and 已修正 symlink，等待验证 [memory/2026-03-26.md:28, memory/2026-03-26.md:29, memory/2026-03-26.md:30]

Reflections
1. No grounded reflections emerged from this note yet.

---

*March 27, 2026*

<!-- openclaw:dreaming:backfill-entry day=2026-03-27 source=memory/2026-03-27.md -->

What Happened
1. 作业内容: Sort 函数基本路径测试法练习; 学号：202404020218，姓名：罗翔夫; and 输出：Word 文档 + Excel 测试用例 [memory/2026-03-27.md:5, memory/2026-03-27.md:6, memory/2026-03-27.md:7]
2. 1. matplotlib 中文字体问题: 问题：/System/Library/Fonts/STHeiti Medium.ttc 字体路径在 FontProperties(fname=...) 中可用，但 matplotlib 字体管理器找不到; 根因：Python 3.14 的 matplotlib 字体注册机制变化，FontProperties 实例方法和 fontManager.addfont 不兼容; and 最终方案：换用 Pillow (PIL) 渲染图片，ImageFont.truetype() 对 TTC 字体支持更好 [memory/2026-03-27.md:15, memory/2026-03-27.md:16, memory/2026-03-27.md:17]
3. 成功方案总结: 图片生成最佳实践（Mac Python 3.14）：; Pillow 对 Mac TTC 中文字体支持好; and ImageDraw.Draw 可直接画箭头、多边形、圆角矩形 [memory/2026-03-27.md:34, memory/2026-03-27.md:40, memory/2026-03-27.md:41]
4. 2. Pillow roundedrectangle width 参数类型: 问题：width=1.5（float）报错 TypeError: 'float' object cannot be interpreted as an integer and 解决：所有 width 必须是整数，改 width=1.5 → width=2 [memory/2026-03-27.md:21, memory/2026-03-27.md:22]

Reflections
1. No grounded reflections emerged from this note yet.

---

*March 30, 2026*

<!-- openclaw:dreaming:backfill-entry day=2026-03-30 source=memory/2026-03-30.md -->

What Happened
1. 系统状态: cron 定时任务正常触发; auto-capture 脚本运行：存储 +4 条记忆; and 记忆库总量：2356 条，平均激活度 58.9%，无风险条目 [memory/2026-03-30.md:6, memory/2026-03-30.md:7, memory/2026-03-30.md:8]
2. 近期上下文（来自 2026-03-29）: 小黒最近在完成"基本路径测试"作业（Sort 函数 ex2.3-1）; 作业目录：/Users/Ymir/Documents/troeprojects/ex2-3-1/; and 已掌握的坑：matplotlib 字体问题 → 改用 Pillow；Pillow width 需整数；循环回边坐标；break 标签冗余 [memory/2026-03-30.md:12, memory/2026-03-30.md:13, memory/2026-03-30.md:14]
3. 待跟进: 小黒是否在继续做新的作业？; 本周是否有新的截止日期？; and 自动捕获于 16:07 — 黑色 AI 🐱 [memory/2026-03-30.md:18, memory/2026-03-30.md:19, memory/2026-03-30.md:22]

Reflections
1. No grounded reflections emerged from this note yet.

---

*April 1, 2026*

<!-- openclaw:dreaming:backfill-entry day=2026-04-01 source=memory/2026-04-01.md -->

What Happened
1. 完成内容: PlantUML 类图 × 2 版本; ShapeInheritanceClassDiagram.png — 简洁版，推荐交作业用; and Shape Inheritance UML.png — 详细注释版 [memory/2026-04-01.md:9, memory/2026-04-01.md:10, memory/2026-04-01.md:11]
2. 经验沉淀: PlantUML 类图语法（简洁版，无报错的写法）：; 不要在类定义后面直接加 note right of Shape::method（1.2026.2 有时会报错）; and 关系标签用 : 标签 (英文) 而非纯中文，避免编码问题 [memory/2026-04-01.md:26, memory/2026-04-01.md:59, memory/2026-04-01.md:60]
3. 作业文件: 路径：/Documents/traeprojects/UML作业/shape-inheritance/ [memory/2026-04-01.md:6]

Reflections
1. No grounded reflections emerged from this note yet.

---

*April 6, 2026*

<!-- openclaw:dreaming:backfill-entry day=2026-04-06 source=memory/2026-04-06.md -->

What Happened
1. Clash TUN timeout 问题排查（重要发现）: 根因：TUN 代理拦截了 api.minimaxi.com 和 api.telegram.org; telegram.org 规则被路由到代理组（BV用户后台!），链路不稳导致 polling stall; and 记忆已更新：memory/topics/OPENHARMONY-OpenHarmony开发经验.md [memory/2026-04-06.md:10, memory/2026-04-06.md:11, memory/2026-04-06.md:18]
2. 二维码生成器完成: 项目：/Users/Ymir/DevEcoStudioProjects/lxf202404020218erweima; 技术：ArkUI 内置 QRCode 组件 + 自定义按钮组; and 状态：代码完成，等待录效果视频提交 [memory/2026-04-06.md:5, memory/2026-04-06.md:6, memory/2026-04-06.md:7]

Reflections
1. No grounded reflections emerged from this note yet.

---

*April 7, 2026*

<!-- openclaw:dreaming:backfill-entry day=2026-04-07 source=memory/2026-04-07.md -->

What Happened
1. OpenClaw 4.5 升级完成: 新功能：Control UI 多语言（12种，含简繁体中文）、Dreaming 记忆系统大改; 冲突解决：自动记忆捕获 cron 已禁用（与 Dreaming 重复）; and workspace-weekly-audit delivery 改为 none（避免 Telegram sendMessage 失败） [memory/2026-04-07.md:6, memory/2026-04-07.md:7, memory/2026-04-07.md:8]
2. 绮梦帐间 PRD 讨论（新项目启动）: 用户发送了完整 PRD 文档：; 来源：RTF 文件「绮梦帐间」; and 内容：完整的视觉设计方案（点云粒子、决策点、灵种系统、粒子实验室、Pretext 文字特效等） [memory/2026-04-07.md:16, memory/2026-04-07.md:17, memory/2026-04-07.md:18]
3. HOTMEMORY 更新: 当前重要事件：绮梦帐间项目启动 and 需求文档：RTF 文件已保存参考 [memory/2026-04-07.md:40, memory/2026-04-07.md:41]

Reflections
1. No grounded reflections emerged from this note yet.
<!-- openclaw:dreaming:diary:end -->
