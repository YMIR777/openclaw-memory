---
name: claude-code
description: Integrate with Claude Code CLI for coding tasks, codebase exploration, code review, and programmatic agent execution via ACP runtime. Use when you need to spawn Claude Code sessions, run code tasks, review PRs, or leverage Claude Code's agentic capabilities from OpenClaw.
metadata: {"clawdbot":{"emoji":"🤖","requires":{"commands":["claude"]},"homepage":"https://code.claude.com/docs"}}
---

# Claude Code Integration Skill

Spawn Claude Code sessions via ACP runtime and integrate Claude Code's agentic capabilities into OpenClaw workflows.

## ⚠️ IMPORTANT: ACP Runtime Setup Required

Claude Code must be accessed via ACP runtime plugin, NOT subagents. Subagents use OpenClaw's own model.

### Setup Steps

**1. Install acpx-orchestrator (if not installed):**
```bash
clawdhub install acpx-orchestrator
```

**2. Enable ACPX plugin in `~/.openclaw/openclaw.json`:**
Add to `plugins.entries`:
```json
"plugins": {
  "entries": {
    "acpx": { "enabled": true }
  }
}
```

**3. Restart gateway:**
```bash
openclaw gateway restart
```

**4. Verify acpx is loaded:**
```bash
openclaw plugins list | grep acpx
# Should show: "ACPX Runtime │ acpx │ loaded"
```

### ClawHub Rate Limit Solution

If `clawdhub install` shows "Rate limit exceeded", use token login:
```bash
clawhub login --token <your-token>
```
Or set environment variable:
```bash
export CLAWHUB_TOKEN=clh_xxx
```
**Important:** Never hardcode tokens in scripts. Use environment variables or config files.

### Configuration File Location
- Config: `~/.openclaw/openclaw.json`

## 🚀 How to Call Claude Code

Use `sessions_spawn` with `runtime: "acp"` + `agentId: "claude"`:

```
sessions_spawn(
  task="Your task description in English",
  cwd="/path/to/project",
  agentId="claude",
  runtime="acp",
  mode="run",
  timeoutSeconds=600
)
```

**Key parameters:**
- `runtime: "acp"` - Must be "acp" not "subagent"
- `agentId: "claude"` - Specifies Claude Code harness
- `task` - Task description in **English** (Claude Code requires English)
- `cwd` - Working directory for the project
- `mode: "run"` - One-shot task (use "session" for persistent thread-bound sessions)

### ❌ Wrong Way (uses OpenClaw's model, not Claude Code)
```
sessions_spawn(
  task="...",
  runtime="subagent"  # ❌ This uses OpenClaw's own model
)
```

### ✅ Correct Way (uses Claude Code)
```
sessions_spawn(
  task="Build a login feature",
  agentId="claude",
  runtime="acp",  # ✅ ACP runtime for Claude Code
  mode="run"
)
```

## Development Workflow: OpenSpec + SpecKit

### Project Setup
```bash
cd /Users/Ymir/Documents/vibe-projects

# Initialize OpenSpec (lightweight, iterative)
openspec init --tools claude

# Or initialize SpecKit (structured, comprehensive)
cd spec-kit-setup
specify init . --ai claude --no-git
```

### OpenSpec Commands (Fast, Iterative)
```
/opsx:propose <feature-name>   # Quick start - propose + plan in one
/opsx:apply                    # Implement the plan
/opsx:archive                  # Finalize and document
/opsx:verify                   # Validate implementation
```

### SpecKit Commands (Structured, Thorough)
```
/speckit.constitution   # Create project principles
/speckit.specify       # Define requirements
/speckit.plan           # Technical architecture
/speckit.tasks          # Generate task list
/speckit.implement      # Execute implementation
```

### Example Task for Claude Code
```
Build a personal diary app with:
- Journal entries with text and photos
- Calendar view
- Mood/emoji tagging
- Search functionality
- Dark mode

Tech stack: React + Vite, LocalStorage, CSS
```

## CLI Reference

### Direct Claude Code CLI Usage
```bash
# Interactive mode
claude

# Print mode (synchronous)
claude -p "fix the bug" --allowedTools "Read,Edit,Bash"

# With output format
claude -p "summarize" --output-format json

# Continue session
claude -c -p "continue from here"

# Resume specific session
claude -r <session-id> -p "task"
```

### Tool Control
```bash
# Allow specific tools
claude -p "task" --allowedTools "Read,Edit,Bash,Grep"

# Restrict tools
claude -p "task" --disallowedTools "Write,Edit"
```

## Environment Variables
| Variable | Purpose |
|----------|---------|
| `ANTHROPIC_API_KEY` | API key for authentication |
| `ANTHROPIC_BASE_URL` | Proxy/gateway endpoint |
| `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` | Disable background subagents |

## Troubleshooting

### "ACP runtime backend is not configured"
- Enable acpx plugin: Add `"acpx": { "enabled": true }` to `~/.openclaw/openclaw.json`
- Restart gateway: `openclaw gateway restart`

### Rate limit on clawdhub install
- Use token login: `clawhub login --token <token>`
- Or set: `export CLAWHUB_TOKEN=xxx`

### Claude Code not responding to slash commands
- Slash commands (`/speckit.*`, `/opsx:*`) only work in interactive mode
- In ACP mode, describe tasks in plain English

### Session doesn't complete
- Check if Claude Code is authenticated: `claude auth status`
- Try resuming: `claude -c -p "continue"`

## Key Documentation Links
- [CLI Reference](https://code.claude.com/docs/en/cli-reference.md)
- [Hooks Guide](https://code.claude.com/docs/en/hooks-guide.md)
- [Skills](https://code.claude.com/docs/en/skills.md)
- [Subagents](https://code.claude.com/docs/en/sub-agents.md)
- [OpenSpec Docs](https://github.com/Fission-AI/OpenSpec)
- [SpecKit Docs](https://github.com/github/spec-kit)

### Claude Code `-p` mode hangs
**Symptoms:** `claude -p "task"` hangs indefinitely without output.
**Diagnosis:** Session may wait for terminal interaction that never arrives in ACP context.
**Workaround:** Use interactive mode or implement via exec directly; verify file changes after each session.
