# OpenClaw 重要配置记录

> 记录日期：2026-04-06

## thinkingDefault 降级（2026-04-03）

**问题：** `thinkingDefault: "high"` 时，session recovery 偶尔会丢弃 assistant 的回复（回复被截断但没有重新生成）

**解决：** 降级为 `thinkingDefault: "medium"`

**配置位置：** `agents.defaults.model.thinkingDefault`

**教训：** thinking 级别越高，session recovery 时越容易丢失上下文。medium 是稳定性和深度的平衡点。

---

## Cron 任务修复（2026-04-06）

**问题：** 所有 cron isolated session 任务都因 `LLM idle timeout (60s)` 失败

**根因：** MiniMax API 在 isolated session 场景下，streaming 响应超过 60s 无数据即断开

**解法：** 
- `sessionTarget: "isolated"` + `agentTurn` → `sessionTarget: "main"` + `systemEvent`
- `delivery.mode: "announce"` → `delivery.mode: "none"`（Telegram API 在中国被墙，announce 失败）

**最终架构：** cron → systemEvent 注入 main session → 我直接处理 → 结果在 webchat 显示

**涉及任务：**
- 每日会话清理（每天 03:00）
- workspace 周审计（每周一 09:00）
- 自动记忆捕获（每 2 小时，isolated 仍正常）

---

## delivery 机制说明

- `announce`：推送结果到指定 channel（Telegram/webchat），依赖外部 API
- `none`：不推送，任务执行完毕即可
- systemEvent 不经过 LLM API，故无 idle timeout 问题
