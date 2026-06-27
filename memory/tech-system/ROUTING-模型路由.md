# 子 Agent 模型路由

> Freshness review: 2026-06-27 — 这页记录的是 2026-03 的早期单模型路由框架。整体思想仍可参考，但当前真实路由规则应以 `openclaw.json` 运行态和 `AGENTS.md` 最新内容为准。

## 决策信息
- **原始决策日期**：2026-03-25
- **本次校正日期**：2026-06-27
- **说明**：这页保留作历史经验，但其中 MiniMax 相关内容已不再代表当前默认运行态。

## 当前真实状态
- `openclaw.json` 当前默认模型：`agents.defaults.model.primary = gpt/gpt-5.4`
- fallback：`gpt/gpt-5.5`
- heartbeat 模型：`gpt/gpt-5.4`
- 当前并非继续默认使用 `minimax/MiniMax-M2.7`

## 当前路由逻辑
- 简单任务（web_search、summarize、format、extract）→ 用默认模型 `gpt/gpt-5.4`
- 高复杂度任务（code、debug、analyze、plan、reason）→ 先用默认模型推进；若明确卡在抽象判断、边界纠缠或质量不足，再升级到 `gpt/gpt-5.5`

## 历史说明
- `minimax/MiniMax-M2.7` 属于旧阶段路由记录
- 它仍可能作为历史 provider 存在于配置里，但不是当前默认主路由模型

## 保留价值
- 这页仍然保留一个有用结论：
  - **先做 context / 路径优化，再谈模型切换**
- 这个结论现在依然成立，只是模型名和默认路由策略已经更新
