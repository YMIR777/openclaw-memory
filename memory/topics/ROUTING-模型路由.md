# 子 Agent 模型路由

## 决策信息
- **决策日期**：2026-03-25
- **原因**：Coding plan 按文本生成量计费，优化 context 使用比选便宜模型更有意义

## 当前状态
- openclaw.json: `agents.defaults.subagents.model: minimax/MiniMax-M2.7`
- AGENTS.md: 已添加 Sub-Agent Model Routing 章节
- 只有单一模型（MiniMax-M2.7），路由框架已预留

## 路由逻辑
- 简单任务（web_search、summarize、format、extract）→ 省略 model 参数
- 复杂任务（code、debug、analyze、plan、reason）→ 显式传 model
- 未来添加第二个模型后自动按规则路由

## 当前可用模型
- `minimax/MiniMax-M2.7` — reasoning: true, input: $0.001/1K, output: $0.004/1K

## Coding Plan 特性
按文本生成量计费，thinking 消耗不影响费用：
- `thinkingDefault: "high"` 不额外收费
- context 长度优化才是重点
