# Skills 管理规范

> 最后更新：2026-03-25
> Freshness review: 2026-06-27 — 核心原则“workspace skills 为主”仍然有效，但清单中的具体技能与路径可能已变化，应以当前磁盘实际状态和 OpenClaw 扫描结果为准。

---

## 目录结构

| 路径 | 用途 | OpenClaw 扫描 | Git 追踪 |
|------|------|--------------|---------|
| `~/.openclaw/workspace/skills/` | **所有 Skills 统一存放目录** | ✅ 是 | ✅ 是 |
| `~/.openclaw/skills/` | OpenClaw 内置系统 Skills | ✅ 是 | ❌ 否 |
| `~/.claw/skills/` | clawdhub 默认安装路径 | ❌ 否 | ❌ 否 |

---

## ⚠️ 核心规则

### 1. 所有 Skills 必须放在 `~/.openclaw/workspace/skills/`

OpenClaw 只扫描以下路径：
- `~/.openclaw/skills/` — 系统内置
- `~/.openclaw/workspace/skills/` — 用户管理 ← **所有 Skill 必须在这里**
- `~/.claw/skills/` — **不会自动扫描，不要用**

### 2. clawdhub 安装时必须指定完整路径

```bash
# ✅ 正确：安装到 workspace skills
clawdhub install ~/.openclaw/workspace/skills/my-skill

# ❌ 错误：安装到 ~/.claw/skills/（OpenClaw 找不到）
clawdhub install my-skill
```

clawdhub 的行为是 `<dir>/<slug>`，所以给出完整路径。

### 3. 新建 Skill 也放在 workspace skills

用 OpenClaw 直接创建 Skill 时，目标路径：
```
~/.openclaw/workspace/skills/<skill-name>/
```

### 4. clawdhub 安装后发现问题

如果发现 Skill 安装后 OpenClaw 找不到，先检查是否装错目录：
```bash
ls ~/.claw/skills/          # 如果在这里
ls ~/.openclaw/workspace/skills/  # 应该在这里
```

**解决：如果装错目录了，立即符号链接：**
```bash
ln -sf ~/.claw/skills/<skill-name> ~/.openclaw/workspace/skills/<skill-name>
```

---

## 已完成修复（2026-03-25）

- `deep-research` — 从 `~/.claw/skills/` 符号链接到 workspace ✅
- `codex-deep-search` — 从 `~/.claw/skills/` 符号链接到 workspace ✅

---

## Skills 完整清单（2026-03-25 审计）

### workspace skills（`~/.openclaw/workspace/skills/`）

| Skill | 状态 | 来源 |
|-------|------|------|
| acpx-orchestrator | ✅ | 自建 |
| agent-browser | ✅ 链接 | `~/.openclaw/skills/` 同步 |
| agent-browser-clawdbot | ✅ | 自建 |
| agent-swarm-workflow | ✅ | 自建 |
| api-gateway | ✅ | 自建 |
| capability-evolver | ✅ 链接 | `~/.openclaw/skills/` 同步 |
| claude-code | ✅ | 自建 |
| claw-shell | ✅ | clawdhub |
| clawdhub | ✅ | clawdhub |
| codex-deep-search | ✅ 新链接 | `~/.claw/skills/` |
| deep-research | ✅ 新链接 | `~/.claw/skills/` |
| elite-longterm-memory | ✅ | 自建 |
| elevenlabs-voices | ✅ | 自建 |
| github | ✅ | 自建 |
| mac-automation | ✅ | 自建 |
| memory-pro | ✅ | 自建 |
| memory-tiering | ✅ | 自建 |
| multi-search-engine | ✅ | 自建 |
| n8n | ✅ 链接 | `~/.openclaw/skills/` 同步 |
| obsidian | ✅ 链接 | `~/.openclaw/skills/` 同步 |
| ontology | ✅ | 自建 |
| openclaw-acp | ✅ | 自建 |
| openclaw-self-improvement | ✅ | 自建 |
| self-improving | ✅ | 自建 |
| skills | ✅ | 存疑 |
| smart-search | ✅ | 自建 |
| summarize | ✅ | 自建 |
| tavily | ✅ | 自建 |
| web-search-exa | ✅ | 自建 |
| web-search-plus | ✅ | 自建 |

### 系统 skills（`~/.openclaw/skills/`）

| Skill | 状态 |
|-------|------|
| cli-anything | ✅ |
| qveris-official | ✅ |
| self-improving-agent | ✅ |
| skills-manager | ✅ |

---

## 新 Skill 上线检查清单

- [ ] 安装/创建到 `~/.openclaw/workspace/skills/<name>/`
- [ ] 包含 `SKILL.md`
- [ ] 符号链接到 workspace（如果最初装错位置）
- [ ] 测试 OpenClaw 能否识别（说触发词测试）
- [ ] 更新本清单

---

## 工具命令速查

```bash
# 安装 skill（clawdhub）
clawdhub install ~/.openclaw/workspace/skills/<name>

# 查看 OpenClaw 识别了哪些 skills
ls ~/.openclaw/workspace/skills/

# 查看 clawdhub 安装到哪了
ls ~/.claw/skills/

# 手动链接（如果装错位置）
ln -sf ~/.claw/skills/<name> ~/.openclaw/workspace/skills/<name>

# 查看技能是否可用（说触发词）
```
