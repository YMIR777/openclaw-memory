#!/bin/bash
# Claude Code Dispatch Script - Zero Poll with Hooks
# Usage: claude-code-dispatch.sh -p "task prompt" [-n task-name] [-w workdir] [-t timeout]
# 
# Flow:
# 1. Write task-meta.json
# 2. Launch Claude Code (PTY)
# 3. Claude Code completes → Stop Hook triggers
# 4. Hook writes latest.json + pending-wake.json
# 5. AGI reads pending-wake.json (or we poll latest.json)

set -e

# Default values
TASK_NAME="task-$(date +%Y%m%d-%H%M%S)"
WORKDIR="${HOME}/Documents/vibe-projects"
TIMEOUT=600
OUTPUT_DIR="${HOME}/.openclaw/claude-code-results"

# Parse arguments
while getopts "p:n:w:t:" opt; do
  case $opt in
    p) TASK_PROMPT="$OPTARG";;
    n) TASK_NAME="$OPTARG";;
    w) WORKDIR="$OPTARG";;
    t) TIMEOUT="$OPTARG";;
  esac
done

if [ -z "$TASK_PROMPT" ]; then
  echo "Usage: $0 -p 'task prompt' [-n task-name] [-w workdir] [-t timeout]"
  exit 1
fi

# Ensure output dir exists
mkdir -p "$OUTPUT_DIR"

# Write task metadata
TASK_META="${OUTPUT_DIR}/task-meta-${TASK_NAME}.json"
LATEST_FILE="${OUTPUT_DIR}/latest.json"
PENDING_WAKE="${OUTPUT_DIR}/pending-wake.json"

cat > "$TASK_META" << EOF
{
  "task_name": "$TASK_NAME",
  "prompt": "$TASK_PROMPT",
  "workdir": "$WORKDIR",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "status": "running"
}
EOF

echo "Task meta written to $TASK_META"

# Set environment for hook
export CLAUDE_CODE_OUTPUT_DIR="$OUTPUT_DIR"
export CLAUDE_CODE_TASK_NAME="$TASK_NAME"

# Launch Claude Code in PTY (non-interactive is handled by -p mode with hook)
cd "$WORKDIR"

echo "Starting Claude Code for task: $TASK_NAME"
echo "Workdir: $WORKDIR"
echo "Timeout: ${TIMEOUT}s"

# Run Claude Code - it will complete and trigger hook automatically
# Use print mode with timeout
claude -p "$TASK_PROMPT" \
  --dangerously-skip-permissions \
  --permission-mode "approve-all" \
  2>&1 | head -100 || true

echo "Claude Code finished for task: $TASK_NAME"
echo "Check $LATEST_FILE for results"
