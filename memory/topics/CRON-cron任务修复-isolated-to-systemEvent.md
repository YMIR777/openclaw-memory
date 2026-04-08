# Cron 任务 isolated session timeout 问题修复

> 记录日期：2026-04-06

## 根因
- MiniMax API 在 isolated session 场景下有 60s idle timeout
- cron 的 isolated session 在工具执行完成后、模型生成回复时卡住
- 错误信息：`LLM idle timeout (60s): no response from model`
- 正常聊天 session 无此问题

## 受影响任务
- 每日会话清理（cron id: 1af1bcd6）
- workspace 周审计（cron id: 6f6e9d43）

## 解决方案
**改用 systemEvent + main session，不再走 isolated LLM 调用**

原配置：
```json
{
  "sessionTarget": "isolated",
  "payload": { "kind": "agentTurn", ... }
}
```

新配置：
```json
{
  "sessionTarget": "main",
  "wakeMode": "now",
  "payload": { "kind": "systemEvent", "text": "任务描述..." }
}
```

## 验证结果
| 任务 | 旧（isolated） | 新（systemEvent） |
|------|--------------|------------------|
| 每日会话清理 | timeout 927s ❌ | 20s ✅ |
| workspace-audit | timeout 977s ❌ | 53s ✅ |

## 教训
- isolated session 和正常聊天 session 的 API 行为不一致
- 对于简单 CLI 任务，优先用 systemEvent 注入 main session 心跳队列
- 不需要 LLM 推理的任务不要走 agentTurn
