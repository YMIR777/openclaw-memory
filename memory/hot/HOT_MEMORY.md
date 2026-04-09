# 🔥 HOT MEMORY（当前会话活跃上下文）

> 最后更新：2026-04-09 19:30

## 今日重大修复（2026-04-09）

### sessions 系统设计缺陷大爆发（2026-04-09 全天）
**背景：** 用户多次发消息后我无响应，完全理解错误以为正常。

**根因链条：**
1. `sessions cleanup` 只清理 sessions.json 索引，不删 .jsonl transcript 文件 → orphaned JSONL 堆积
2. 16 个 orphaned JSONL + 30 个 .deleted.*/.reset.*/.bak.* 文件积累 ~17MB
3. cleanup 从 20 秒拖到 951 秒超时 → cron 任务全失败
4. 4月3日的 ACP QR 项目卡死 5 天（3个 running 子任务）
5. Heartbeat 在 main session 里跑 → 消息处理时被 inject 打断
6. session 积累到 1.5m tokens → 触发 compaction → 冻结 session → 消息丢失

**已修复：**
- ✅ 删除了 16 个 orphaned JSONL（1.9MB）
- ✅ 备份清理了 30 个 .deleted.*/.reset.*/.bak.* 文件（~15MB）
- ✅ 写了 `~/.openclaw/scripts/session-cleanup.sh`（v3，自动清理备份文件）
- ✅ 更新了每日 cron 任务，改用自定义脚本
- ✅ Heartbeat 改为 `isolatedSession: true`（不再阻塞主会话）
- ✅ 删除了卡死 5 天的 ACP session
- ✅ 删除/禁用了 `自动记忆捕获` cron（memory-pro 遗留，已被 Dreaming 取代）

**教训：**
- `sessions cleanup` 是设计缺陷，必须配合脚本清理文件
- ACP task 不用时要主动清理
- isolatedSession 对 heartbeat 和 cron 都必须开启

### 深度研究结论

**`Queue: collect (depth 0)` 是正常状态**
- 不是 bug，是消息 batch 收集模式
- depth 0 = 队列空，等待新消息
- 配置项：`messages.queue.mode: collect`，`debounceMs: 1000`

**Compaction 会冻结 session**
- token 积累到一定程度自动压缩历史
- 压缩期间 session 无响应，用户消息可能被跳过
- 修复后 context 回到 62k，暂时不会触发

### Clash Verge TUN 修复（2026-04-08 遗留）
- `dns-hijack: ['false']` 格式错误 → 改为 `dns-hijack: [8.8.8.8:53]`
- `mb0l3PoBhkh7.yaml` 第 6-7 行缩进错误 → 已修复
- `route-exclude-address` 在 Merge profile 不生效 → 100.100.100.100 仍被 TUN 拦截（无害，日志垃圾）
- 解决方案：在 mb0l3PoBhkh7.yaml 的 prepend 规则加 `IP-CIDR,100.100.100.100/32,DIRECT`（未完成）

### 深度研究结果
- Tavily 找到线索："stale lock files" 导致 session deadlock
- `100.100.100.100` 是 Gateway 自己的健康检查地址，Clash TUN 把它放入 VPN 隧道导致超时
- Mac 合盖 → Gateway 睡眠 → cron/Dreaming 全部错过（硬件层面，无法配置解决）

## 当前重要配置状态

| 配置项 | 值 | 说明 |
|--------|----|------|
| `agents.defaults.heartbeat.isolatedSession` | true | ✅ 已修复 |
| `agents.defaults.heartbeat.lightContext` | true | 已开启 |
| `session.maintenance.mode` | enforce | 严格清理 |
| `cron 每日会话清理` | isolated + 自定义脚本 | ✅ 已修复 |

## 待处理
- [ ] 在 mb0l3PoBhkh7.yaml 的 prepend 规则加 `IP-CIDR,100.100.100.100/32,DIRECT` 彻底解决 Clash 日志垃圾
- [ ] Mac 防止合盖睡眠（如果需要 Dreaming 凌晨3点触发）

## 活跃偏好
- 用户：小黒秋，母语中文，软件技术课程学生，vibe coding 自学
- 沟通风格：温暖且有力量，不谄媚
- 作业目录：/Users/Ymir/Documents/troe_projects
