# 重要记忆

> MEMORY.md 是索引，具体内容在 `memory/topics/` 目录下。

---

## 🖤 关于小黒
→ [[memory/topics/USER-小黒.md]]

## 🔧 常用配置
→ [[memory/topics/TOOLS-常用配置.md]]
API Keys、Mac 工具、Skills Manager

## 🤖 Claude Code 开发
→ [[memory/topics/CLAUDE-CODE-开发配置.md]]
Skill、OpenSpec、SpecKit、Runtime 选择

## 💡 核心经验教训
→ [[memory/topics/LESSONS-核心经验.md]]
10+ 条踩坑记录（Mac 自动化、GitHub、exec 权限等）

## 🧠 QMD 语义搜索
→ [[memory/topics/QMD-语义搜索.md]]
本地向量搜索、Ollama 兼容、memorySearch 参数

## 🚨 Gateway 问题
→ [[memory/topics/GATEWAY-Gateway问题.md]]
SIGTERM 根因、版本选择、日志路径

## 🐛 Telegram Webhook 重启循环（2026-04-06）
→ [[memory/topics/BUGFIX-Telegram-Webhook-重启循环.md]]
api.telegram.org 被墙拦截、无限重试导致 Gateway 崩溃，临时禁用 Telegram 频道修复，待加 bypass 规则彻底解决

## 💰 小黒秋的大金库 — 个人财务 Web App 项目
→ [[memory/projects/小黒秋的大金库/SPEC.md]]
React + Vite + Three Fiber + GSAP + pretext + Recharts + Zustand + Tailwind
ClawTeam 已启动 architect 搭建基础架构，完成后前端并行开发 Intro/Dashboard/Income 页面
视觉：Claude.ai 温暖极简 + Penderecki's Garden 点云粒子美学

## 🚫 绮梦账间项目复盘
→ [[memory/topics/复盘-绮梦账间项目失败.md]]
过度并行(8 agents)导致 API rate limit 全面崩溃，需求复杂度 vs 工程时间不匹配，设计与实现能力脱节

## ⚡ OpenClaw 重要配置
→ [[memory/topics/OPENCLAW-重要配置.md]]
thinkingDefault 降级（high→medium）、cron 任务修复（isolated→systemEvent）、delivery 机制

## 🔒 OpenClaw 安全加固
→ [[memory/topics/LESSONS-核心经验.md]] 第 1 条
→ [[OpenClaw-安全加固配置]]（Obsidian）
安全审计：5 critical → 2 critical，elevated.allowFrom、strictInlineEval、Watchdog

## 🚀 模型路由
→ [[memory/topics/ROUTING-模型路由.md]]
子 Agent 路由规则、Coding Plan 特性

## 📱 OpenHarmony 开发
→ [[memory/topics/OPENHARMONY-OpenHarmony开发经验.md]]
BMI 项目踩坑：Arc 组件不存在、Builder 接口声明、height 属性名冲突、wizard 项目结构等

## 🔧 Ollama VL 模型
→ [[memory/topics/OLLAMA-VISION-失败分析.md]]
qwen2.5vl:3b 和 7B vision 模式探索全部失败，根因是 Ollama 融合 vision GGUF 架构限制。本地 vision 暂不可行，MiniMax VL 已打通作为主力。

## 🔧 Skills 管理规范
→ [[memory/topics/SKILLS-Skills管理规范.md]]

## 🗄️ Sessions 系统设计缺陷与修复（2026-04-09）
→ [[memory/topics/OPENCLAW-Sessions-系统设计缺陷与修复.md]]
`sessions cleanup` 只清索引不删文件 → ~17MB orphaned 文件堆积 → cron 超时 → 系统崩溃
已修复：自定义清理脚本 v3、isolatedSession、删除僵尸 ACP session

## 📐 PlantUML UML 绘图
→ [[memory/topics/PLANTUML-PlantUML语法与实践.md]]
活动图、泳道图、新旧语法混用陷阱、PlantUML 1.2026.2 实战经验

## 📅 近期重要事件（精简版）

| 日期 | 事件 |
|------|------|
| 2026-04-09 | sessions 系统设计缺陷大爆发：16个 orphaned JSONL + 30个备份文件堆积，cleanup 951秒超时，cron 全灭。彻底修复：自定义清理脚本 v3、isolatedSession、删除僵尸 ACP |
| 2026-04-08 | Gateway 卡死：ClawTeam qimeng 项目残留 10 session + main 堵塞；Clash Verge TUN dns-hijack 格式修复 |
| 2026-04-06 | Telegram Webhook 崩溃：api.telegram.org 被墙导致无限重试，已临时禁用 Telegram |
| 2026-04-01 | UML 作业：饮料自动售货机类图（PlantUML），`~/Documents/trae_projects/UML作业/vending-machine/` |
| 2026-03-27 | 基本路径测试作业（Sort ex2.3-1）：Pillow 渲染字体、流程图循环回边坐标问题 |
