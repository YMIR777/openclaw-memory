# OpenCode Go 接入后的最终模型分工表（2026-06-27）

> 当前实际运行态：`~/.openclaw/openclaw.json` 已配置
> - 主会话默认：`opencode-go/kimi-k2.7-code`
> - fallback 链：`gpt/gpt-5.5` → `lumina/gpt-5.5` → `wintoken/deepseek-v4-pro` → `opencode-go/minimax-m3`

## 总体原则

四层结构：

1. 主会话协调层：理解目标、拆任务、调度、合并
2. 主执行层：代码、扫描、整理、重构
3. 裁决/复核层：架构判断、最终拍板、高风险决策
4. 保底/降级层：轻问答、临时 fallback、预算敏感任务

目标：
- OpenCode Go 的稳定 token 承担主产出
- 中转站不再做生命线
- `gpt/gpt-5.5` 保留为高信任裁决层

---

## 一、最终角色分工

| 层级 | 职责 | 首选模型 | 备注 |
|---|---|---|---|
| 主会话协调层 | 理解、拆解、调度、合并 | `opencode-go/kimi-k2.7-code` | 已切到 OpenCode Go |
| 主执行层 | 代码实现、多文件修改、仓库扫描、长上下文整理 | `opencode-go/minimax-m3` / `opencode-go/kimi-k2.7-code` | Go 价值释放主战场 |
| 裁决/复核层 | 架构评审、路线选择、冲突仲裁、最终结论 | `gpt/gpt-5.5` | 高信任锚点 |
| 保底/降级层 | 轻问答、快速草稿、故障切换、低优先级任务 | `gpt/gpt-5.5`、`lumina/gpt-5.5`、`wintoken/deepseek-v4-pro` | 便宜，但不承担生命线 |

---

## 二、任务到模型的最终映射

### 主执行层：默认交给 OpenCode Go

- `sessions_spawn` 的正式编码任务
- 4 个文件以上的修改
- repo 级搜索和理解
- 长文档/多文档整理
- 大规模重构
- OpenClaw 系统整理、记忆整理、wiki 整理
- 测试修复循环
- 需要较大上下文的持续工作

### 裁决层：保留给 `gpt/gpt-5.5`

- 两个方案都要做，但要决定长期方向
- 架构级 tradeoff
- 修改 OpenClaw 配置、路由、session/heartbeat 机制
- 子 agent 结果冲突
- 怀疑执行模型“写得很像对的，但方向错了”
- 要给最终方案定稿
- 对外输出“这就是最终建议”

### 保底层：现有中转站的角色

- 轻量问答
- 快速格式化
- 临时草稿
- 简单总结
- OpenCode Go 短时异常时的 fallback
- 预算敏感时的低优先级任务

不再承担：
- 正式系统整理主线
- 长上下文主执行
- 大规模编码任务主线
- 高风险配置改动判断

---

## 三、按任务类型的精细分工

| 任务类型 | 默认模型 | 是否触发 `gpt/gpt-5.5` 复核 | 说明 |
|---|---|---|---|
| 小问答 / 简单解释 | `lumina/gpt-5.5` 或 `wintoken/deepseek-v4-pro` | 否 | 便宜优先 |
| 单文件小修 | `opencode-go/kimi-k2.7-code` | 否 | 主会话默认即可 |
| 多文件编码 | `opencode-go/minimax-m3` | 视复杂度 | 默认走 Go |
| 大仓库阅读 | `opencode-go/deepseek-v4-flash` | 否 | Go 的价值区 |
| 大规模重构 | `opencode-go/minimax-m3` | 是 | 执行归 Go，定稿归 5.5 |
| 长上下文综合 | `opencode-go/glm-5.2` | 是 | 大方案后再复核 |
| 配置改动 | `opencode-go/kimi-k2.7-code` 调研 | 是 | 最终改动前必须复核 |
| 路由/模型策略调整 | `opencode-go/kimi-k2.7-code` 收集信息 | 是 | 裁决层工作 |
| 复杂 bug 定位 | `opencode-go/minimax-m3` 先跑 | 是 | 防止“解释得像对” |
| 数学/推理/深度分析 | `opencode-go/qwen3.7-max` | 是 | 复杂结论需复核 |
| 架构选型 | `gpt/gpt-5.5` | 是，本身就是它 | 直接拍板 |
| 最终 PR / 最终结论 | `gpt/gpt-5.5` | 是 | reviewer 位 |

---

## 四、运行纪律

1. **heartbeat 会话不再承接正式工作流**
2. 子 agent 并发上限：**最多 2 个活跃重型子 agent**
3. 遇到 429/503：**先降并发，再降级模型，不盲目重试**
4. **不确定时：重任务走 OpenCode Go，裁决任务走 `gpt/gpt-5.5`**
5. **`gpt/gpt-5.4` 已退出核心位**，不再作为默认或主力

---

## 五、已配置的 OpenCode Go 模型别名

| 模型引用 | 别名 |
|---|---|
| `opencode-go/kimi-k2.7-code` | OpenCode Go K2.7 |
| `opencode-go/minimax-m3` | OpenCode Go MiniMax |
| `opencode-go/qwen3.7-max` | OpenCode Go Qwen Max |
| `opencode-go/glm-5.2` | OpenCode Go GLM |
| `opencode-go/deepseek-v4-flash` | OpenCode Go DS Flash |

---

## 六、最终结论

接入 OpenCode Go 后，系统采用**双轨主力 + 中转保底 + GPT 裁决**结构：

- **主会话默认：** `opencode-go/kimi-k2.7-code`
- **强执行主力：** `opencode-go/minimax-m3`
- **大搜索/盘点：** `opencode-go/deepseek-v4-flash`
- **长上下文综合：** `opencode-go/glm-5.2`
- **数学/深度分析：** `opencode-go/qwen3.7-max`
- **最终裁决/复核：** `gpt/gpt-5.5`
- **保底/轻活：** `lumina/gpt-5.5`、`wintoken/deepseek-v4-pro`
