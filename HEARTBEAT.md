# HEARTBEAT.md

## 心跳配置
- 检查间隔：30 分钟
- 每次检查只做最小必要操作
- 深夜（23:00-08:00）保持安静

## 要检查的项目

### 每次心跳（轻量）
- 检查是否有紧急未读消息
- 如果有重要会话，回复用户

### 每天 1-2 次（轻量检查）
- 回顾最近的 memory/YYYY-MM-DD.md
- 如果有值得升级到 MEMORY.md 的内容，进行推广
- 运行 `node ~/.openclaw/workspace/skills/memory-pro/scripts/memory-stats.mjs` 查看记忆健康状态

### 每周一次（维护）
- 运行 memory-tiering 整理 HOT/WARM/COLD 分层
- 回顾 .learnings/ 目录，将重要内容推广到 AGENTS.md

## 不做的事
- 不主动打扰用户
- 不跑重操作
- 不发散探索
