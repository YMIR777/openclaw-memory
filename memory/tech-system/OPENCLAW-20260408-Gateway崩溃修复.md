# OpenClaw Gateway 崩溃修复（2026-04-08 下午）

> 记录日期：2026-04-08

## 事件概述

下午小黒反馈对话无响应，Clash 日志出现大量 `100.100.100.100:80 timeout`。

## 根因分析

1. **Gateway 进程卡死** — cron sendMessage 全部失败，Gateway 进程半崩溃
2. **Cron 超时** — 两个 cron 都跑在 `main` session，main 太忙（23k tokens + 用户在说话）导致 cron 961 秒超时
3. **节点探测失败** — `gateway/skills-remote` 每 5 分钟探测 macOS 节点，但节点没有 LaunchAgent，探测反复超时拖垮连接池
4. **ClawTeam 残留** — 10 个旧 session（38-42 小时前）带 system flag，cleanup 跳过不删

## 修复措施

| 修复项 | 操作 |
|--------|------|
| Gateway 重启 | `openclaw gateway restart` |
| cron 隔离模式 | `openclaw cron update 1af1bcd6 --sessionType isolated` |
| cron 隔离模式 | `openclaw cron update 6f6e9d43 --sessionType isolated` |
| 清理残留 session | 直接编辑 `sessions.json` 删除 10 个旧 clawteam/cron session |
| 节点 LaunchAgent | `openclaw node install --host 127.0.0.1 --port 18789` |

## 修复后状态

- Sessions：18 → 9 ✅
- `ai.openclaw.node` LaunchAgent 运行中（pid 8551）
- Gateway reachable ✅
- 每日会话清理：isolated，下一次凌晨 3 点
- workspace 周审计：isolated，下周一 9 点

## Clash 日志解释

`100.100.100.100:80 dial DIRECT timeout` — 不是 Clash 问题，是 Gateway 探测 macOS 节点时走到错误路径。节点 LaunchAgent 装好后不再出现。

## 待清理项

- 4 个 xiaohel ClawTeam session（仍残留，未处理）
