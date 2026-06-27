# Claude Code 开发配置 (2026-06-23 已废弃)

## ⛔ ACP Claude Code 调度 — 2026-06-23 正式废除

**原因：** 每次 ACP 调用重建上下文导致未缓存输入 token 暴增（甚至超过缓存输入），性价比为负。

**替代方案：**
- 小活（<3 文件，<80 行）→ 自己干（read/edit/write）
- 大活 → `sessions_spawn` + 子 Agent（isolated，不给上下文 fork）

**已移植到 OpenClaw 的 Skills：**
| Claude Code Skill | OpenClaw 对应 |
|---|---|
| andrej-karpathy-coding | ✅ `skills/andrej-karpathy-coding/` |
| design-taste-frontend | ✅ `skills/taste-skill/skills/design-taste-frontend/` |
| humanizer-zh | ✅ `skills/humanizer-zh/` |
| huashu-nuwa (女娲) | ✅ `skills/huashu-nuwa/`（2026-06-23 移植） |
| PUA | ✅ `skills/pua/`（2026-06-23 移植） |

**Claude Code 本地安装保留**，用户可以手动直接使用，但我不再通过 ACP 调度它。

---

## 历史记录（2026-06-12 ~ 2026-06-23）

<details>
<summary>展开查看旧配置</summary>

### 核心决策变更

| 旧决策 (2026-04) | 新决策 (2026-06) |
|-----------------|-----------------|
| 用户直接用 Claude Code，不用我转接 | **"小活我干，大活 Claude Code 干"** — 我判断并自主调度 |
| 传话损耗太大 | acpx v2026.5.18 大幅改善，CodeGraph 进一步减少探索 token |
| ClawTeam 是开发首选 | Claude Code ACP 是首选，ClawTeam 是备选 |

### 当前技术栈（已废弃）

#### ACP 通路
- 插件：`@openclaw/acpx` v2026.5.18（Gateway 内置）
- 调用方式：
```js
sessions_spawn({
  runtime: "acp",
  agentId: "claude",
  mode: "run",
  cwd: "/path/to/project",
  task: "清晰的任务描述（英文）",
  taskName: "short-task-name"
})
```

### Claude Code 已装 Skills（已移植）
- `design-taste-frontend` — 设计品味
- `andrej-karpathy-coding` — 编码四原则
- `frontend-design` — 官方前端设计插件
- `superpowers` — 开发方法论插件

### CodeGraph 项目索引
| 项目 | 文件 | 节点 | 边 |
|------|------|------|-----|
| 绮梦帐间 | 81 | 700 | 1,264 |
| Dr. Sharp App | 18 | 103 | 139 |

</details>
