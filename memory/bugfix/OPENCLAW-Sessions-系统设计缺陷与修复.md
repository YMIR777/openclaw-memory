# OpenClaw Sessions 系统设计缺陷与修复

> 记录日期：2026-04-09

## 核心发现

**OpenClaw 的 `sessions cleanup` 命令有设计缺陷：**
- 只清理 `sessions.json` 索引（目录）
- **不删除**对应的 `.jsonl` transcript 文件
- 导致磁盘上的对话记录文件无限堆积，系统越来越慢

## 问题链条

```
sessions.json 索引被清理
        ↓
但 .jsonl 文件残留（orphaned）
        ↓
下次 cleanup 扫描所有 .jsonl 文件（越来越多）
        ↓
cleanup 越来越慢（从20秒→900秒超时）
        ↓
cron 任务失败，产生更多历史记录
        ↓
系统崩溃
```

## 发现的堆积文件类型

| 类型 | 格式 | 来源 |
|------|------|------|
| orphaned JSONL | `*.jsonl`（非当前session） | 已删除session的残留 |
| deleted 残留 | `*.jsonl.deleted.*` | compaction 时标记删除但文件还在 |
| reset 残留 | `*.jsonl.reset.*` | compaction 备份文件 |
| bak 残留 | `*.jsonl.bak.*` | 手动备份 |
| tmp 文件 | `sessions.json.*.tmp` | 写入时的临时文件 |

## 修复方案

### 1. 自定义清理脚本 v3

路径：`~/.openclaw/scripts/session-cleanup.sh`

**功能：**
- 保留 sessions.json、当前 session 的 .jsonl、.lock 文件
- 删除所有 `.deleted.*`、`*.reset.*`、`*.bak.*` 文件
- 先跑 `openclaw sessions cleanup` 清理索引
- 被删文件备份到 `cleanup-backup-日期/` 目录

**使用方法：**
```bash
bash ~/.openclaw/scripts/session-cleanup.sh        # 执行
bash ~/.openclaw/scripts/session-cleanup.sh --dry-run  # 预览
```

**已更新 cron 任务（每日凌晨3点自动跑）：**
```json
{
  "id": "1af1bcd6-5c93-4ff8-bd95-e777a88fa1bd",
  "name": "每日会话清理",
  "payload": {
    "kind": "agentTurn",
    "message": "立即执行 bash /Users/Ymir/.openclaw/scripts/session-cleanup.sh，输出完整结果，不要多余分析。"
  }
}
```

### 2. 隔离 Heartbeat（isolatedSession）

问题：Heartbeat 在 main session 里跑，处理时用户消息被阻塞

修复：
```json
{
  "agents": {
    "defaults": {
      "heartbeat": {
        "lightContext": true,
        "isolatedSession": true
      }
    }
  }
}
```

### 3. 删除僵尸 ACP Session

问题：Claude Code QR 项目（4月3日）的 ACP session 卡死 5 天，3 个子任务占着 running 状态

修复：
```bash
# 删除 claude agent 的僵尸 ACP session
# 从 sessions.json 删掉 agent:claude:acp:c3e7f12b...
```

## 关键教训

1. **`sessions cleanup` 不够用** — 只清理索引，必须配合脚本清理文件
2. **backup 文件也要清理** — compaction/compaction 产生的 .bak/.reset/.deleted 文件积累很快
3. **ACP session 长期占用** — 不用的 ACP 项目及时清理，避免僵死
4. **isolatedSession 是关键** — Heartbeat 和 cron 都要 isolated，避免阻塞主会话
