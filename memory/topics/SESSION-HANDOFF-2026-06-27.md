# 会话交接提示词（2026-06-27）

## 当前任务状态
- 已完成 OpenCode Go 接入与模型路由配置。
- 当前 OpenClaw 主会话默认模型已改为 `opencode-go/kimi-k2.7-code`。
- fallback 链：`gpt/gpt-5.5` → `lumina/gpt-5.5` → `wintoken/deepseek-v4-pro` → `opencode-go/minimax-m3`。
- `gpt/gpt-5.4` 已退出核心位。
- heartbeat 模型已改为 `opencode-go/deepseek-v4-flash`。

## 必须遵守的模型调度规则
- 主会话理解/调度/合并：使用 `opencode-go/kimi-k2.7-code`。
- 多文件编码/重任务子 agent：使用 `opencode-go/minimax-m3`。
- 大搜索/仓库盘点/读多写少：使用 `opencode-go/deepseek-v4-flash`。
- 长上下文综合/大规模重构方案：使用 `opencode-go/glm-5.2` 或 `opencode-go/qwen3.7-max`。
- 复杂抽象判断/架构选型/最终结论：使用 `gpt/gpt-5.5`。
- 轻问答/快速格式化/预算敏感任务：使用中转站 `lumina/gpt-5.5` 或 `wintoken/deepseek-v4-pro`。
- 子 agent 并发上限：最多 2 个活跃重型子 agent。
- heartbeat 会话不再承接正式工作流。

## 待处理或待验证事项
1. 验证 heartbeat 改为 `opencode-go/deepseek-v4-flash` 后是否还有高频 k2.7 调用。
2. 如果仍有，排查 webchat/dashboard 层轮询/保活机制，尝试将轮询路由到便宜模型或延长间隔。
3. 继续原计划：基于新路由表执行 OpenClaw 系统整理、记忆整理、wiki 整理。

## 关键文件
- 模型分工表：`memory/topics/OPENCODE-GO-最终模型分工表-2026-06-27.md`
- AGENTS.md 已更新路由策略，作为指令级上下文加载。
- 当前交接文件：`memory/topics/SESSION-HANDOFF-2026-06-27.md`
