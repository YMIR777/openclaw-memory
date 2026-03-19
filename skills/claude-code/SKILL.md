---
name: claude-code
description: Integrate with Claude Code CLI for coding tasks, codebase exploration, code review, and programmatic agent execution. Use when you need to spawn Claude Code sessions, run code tasks, review PRs, or leverage Claude Code's agentic capabilities from OpenClaw.
metadata: {"clawdbot":{"emoji":"🤖","requires":{"commands":["claude"]},"homepage":"https://code.claude.com/docs"},"env":["ANTHROPIC_API_KEY"],"examples":["claude-code run \"Fix the login bug\"","claude-code review /path/to/code","claude-code explore \"How does auth work?\""]}
---

# Claude Code Integration Skill

Spawn Claude Code sessions, run programmatic tasks, and integrate Claude Code's agentic capabilities into OpenClaw workflows.

## Quick Reference

### CLI Invocation Patterns

```bash
# Print mode (synchronous, exits when done)
claude -p "task description"

# With specific tools allowed
claude -p "fix bug" --allowedTools "Read,Edit,Bash"

# With output format
claude -p "summarize" --output-format json

# Continue most recent session
claude -c -p "continue task"

# Resume specific session
claude -r <session-id> -p "task"

# With structured output (JSON Schema)
claude -p "extract functions" --output-format json --json-schema '{"type":"object","properties":{"functions":{"type":"array","items":{"type":"string"}}}}'
```

### Session Management

```bash
# List available sessions
claude agents

# Show auth status
claude auth status

# Update Claude Code
claude update
```

## Core Patterns

### 1. Print Mode (One-shot Tasks)

Best for: Quick tasks that complete in one go.

```bash
claude -p "Explain this function: $ARGUMENTS" --output-format text
```

### 2. Async Mode with Hooks (Background Tasks)

Best for: Long-running tasks where you don't want to poll.

Use `Stop` and `SessionEnd` hooks to get notified when Claude Code finishes:

```bash
# In settings.json, configure hooks:
{
  "hooks": {
    "Stop": [{
      "hooks": [{
        "type": "command",
        "command": "echo '{\"result\": \"complete\"}' > /tmp/claude-result.json"
      }]
    }]
  }
}
```

### 3. Session Resume (Continue Work)

```bash
# Continue most recent conversation
claude -c -p "now add tests"

# Resume specific session
claude -r session-name-or-id -p "continue from here"
```

### 4. Structured Output

```bash
# Get JSON output matching a schema
claude -p "List all exported functions" \
  --output-format json \
  --json-schema '{
    "type": "object",
    "properties": {
      "functions": {
        "type": "array",
        "items": {"type": "string"}
      }
    }
  }'
```

## Tool Control

### Allowed Tools

```bash
# Allow specific tools without prompting
claude -p "run tests" --allowedTools "Bash,Read"

# Allow specific commands with prefix matching
claude -p "check status" --allowedTools "Bash(git status *)"
```

### Restricted Tools

```bash
# Remove specific tools
claude -p "read only task" --disallowedTools "Write,Edit,Bash"
```

## Subagent Patterns

### Inline Subagents (CLI)

```bash
claude --agents '{
  "reviewer": {
    "description": "Code reviewer",
    "prompt": "Review code for bugs",
    "tools": ["Read", "Grep"],
    "model": "sonnet"
  }
}'
```

### Custom Subagents

Create in `~/.claude/agents/reviewer.md`:

```yaml
---
name: reviewer
description: Reviews code for quality
tools: Read, Grep, Glob
model: sonnet
---

You are a code reviewer. Focus on:
1. Code quality
2. Security issues
3. Performance problems
```

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `ANTHROPIC_API_KEY` | API key for authentication |
| `ANTHROPIC_BASE_URL` | Proxy/gateway endpoint |
| `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` | Disable background subagents |

## Examples

### Example 1: Fix a Bug

```bash
claude -p "Find and fix the null pointer exception in auth.py" \
  --allowedTools "Read,Edit,Bash,Grep" \
  --output-format json
```

### Example 2: Code Review

```bash
claude -p "Review the PR changes: $(gh pr diff)" \
  --append-system-prompt "You are a security-focused code reviewer" \
  --allowedTools "Read,Bash" \
  --output-format json
```

### Example 3: Explore Codebase

```bash
claude -p "Explore how the payment module works, find main entry points" \
  --allowedTools "Read,Glob,Grep"
```

### Example 4: Create Commit

```bash
claude -p "Review staged changes and create a commit" \
  --allowedTools "Bash(git diff *)Bash(git commit *)Bash(git status *)"
```

### Example 5: Session with Resume

```bash
# Start task
claude -n "auth-fix" -p "Refactor the authentication module"

# Later, continue same session
claude -r "auth-fix" -p "Now add unit tests"
```

## Common Workflows

### Workflow: Zero-Poll Claude Code from OpenClaw

1. **Start Claude Code in background** with hooks configured
2. **Write result to file** via `Stop` hook
3. **OpenClaw monitors** the result file or waits for notification

```bash
# Start task with result file
claude -p "Analyze this codebase" \
  --output-format json \
  > /tmp/claude-output.json 2>&1 &
```

### Workflow: Agent Team (Parallel Tasks)

```bash
# Run multiple Claude Code instances in parallel
claude -n "auth-review" -p "Review auth module" &
claude -n "api-review" -p "Review API module" &
claude -n "db-review" -p "Review database layer" &

# Wait for all to complete
wait

# Resume each for summaries
claude -r "auth-review" -p "summarize findings"
# ... etc
```

## Troubleshooting

### "Permission denied" on claude command

```bash
# Check if Claude Code is installed
which claude

# If not, install:
curl -fsSL https://claude.ai/install.sh | bash
```

### Authentication issues

```bash
# Check auth status
claude auth status

# Login if needed
claude auth login
```

### Hook not firing

- Verify hook is in correct settings file (`~/.claude/settings.json` for user-level)
- Check matcher pattern matches the event
- Run `/hooks` in Claude Code to verify configuration

### JSON parsing errors in hooks

If your shell profile prints text on startup, it can corrupt hook JSON output. Add to `~/.zshrc`:

```bash
if [[ $- != *i* ]]; then
  return
fi
```

## Key Documentation Links

- [CLI Reference](https://code.claude.com/docs/en/cli-reference.md)
- [Hooks Guide](https://code.claude.com/docs/en/hooks-guide.md)
- [Hooks Reference](https://code.claude.com/docs/en/hooks.md)
- [Skills](https://code.claude.com/docs/en/skills.md)
- [Subagents](https://code.claude.com/docs/en/sub-agents.md)
- [Headless/Programmatic](https://code.claude.com/docs/en/headless.md)
- [Environment Variables](https://code.claude.com/docs/en/env-vars.md)
