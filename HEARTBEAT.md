# HEARTBEAT.md

## 心跳配置
- OpenClaw 调度频率以 `~/.openclaw/openclaw.json -> agents.defaults.heartbeat.every` 为准。
- 当前目标：日常 60 分钟一次；深夜 23:00-08:00 保持低成本静默。
- 注意：本文件只指导心跳触发后的行为，不决定调度频率。

---

## 低成本心跳规则

收到普通 `[OpenClaw heartbeat poll]` 时：

1. **不要默认读取文件。**
2. **不要默认调用工具。**
3. 如果消息里没有明确的 reminder / wake / completed background task / 用户交代的待办检查，直接回复：`HEARTBEAT_OK`
4. 深夜（23:00-08:00）除非有明确紧急事项，否则只回复 `HEARTBEAT_OK`。

---

## 什么时候才需要检查

只有出现以下情况时，才读取相关文件或调用工具：

| 触发条件 | 执行操作 |
|----------|----------|
| 用户说“记住...” | 立即写入对应 topics/ 文件 |
| 完成了作业/项目 | 写复盘文档到 topics/ |
| 用户明确纠正了你 | 写入 corrections 到 topics/LESSONS |
| 学了新的技术/工具 | 写入对应 topics/ 文件 |
| 用户明确提到偏好 | 更新 HOT_MEMORY 的“活跃偏好” |
| 有明确待处理任务状态变化 | 更新 HOT_MEMORY 的“待处理”列表 |
| heartbeat 消息包含 reminder/wake/task-complete | 处理该具体事件 |

---

## Memory 维护

不要每次心跳都读 `memory/hot/HOT_MEMORY.md`。

每几天一次，或当 heartbeat 明确要求 memory maintenance 时，再执行：

1. 读取 `memory/hot/HOT_MEMORY.md`
2. 检查“当前事件”是否超过 3 天没更新
3. 必要时移动到 WARM
4. 更新 `heartbeat-state.json`

---

## Capture 优先级

**立即写（不等心跳）：** 用户说“记住这个” / 完成作业 / 纠正错误 / 明确偏好

**心跳时写：** 只有当心跳消息明确要求检查，或存在具体 reminder/wake/task-complete

**不写：** 普通心跳 poll / 深夜无事 poll / 没有新信息的 poll
