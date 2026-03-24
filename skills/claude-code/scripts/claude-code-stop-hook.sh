#!/bin/bash
# Claude Code Stop Hook - Zero Poll Implementation
# Features:
# - Deduplication (30s lock)
# - Standardized result JSON (latest.json)
# - Pending wake file for AGI integration
# - Telegram notification support

INPUT=$(cat)
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "unknown"')
STOP_HOOK_ACTIVE=$(echo "$INPUT" | jq -r '.stop_hook_active // false')
OUTPUT_DIR="${CLAUDE_CODE_OUTPUT_DIR:-${HOME}/.openclaw/claude-code-results}"
TASK_NAME="${CLAUDE_CODE_TASK_NAME:-task}"

# Prevent infinite loops
if [ "$STOP_HOOK_ACTIVE" = "true" ]; then
  exit 0
fi

# Deduplication lock (30s)
LOCK_FILE="/tmp/.claude-hook-lock"
if [ -f "$LOCK_FILE" ]; then
  LOCK_AGE=$(($(date +%s) - $(stat -f %m "$LOCK_FILE" 2>/dev/null || stat -c %Y "$LOCK_FILE" 2>/dev/null)))
  if [ "$LOCK_AGE" -lt 30 ]; then
    echo "Hook triggered within 30s, skipping (dedup)"
    exit 0
  fi
fi
touch "$LOCK_FILE"

# Ensure output directory exists
mkdir -p "$OUTPUT_DIR"

# Determine output files
TASK_META="${OUTPUT_DIR}/task-meta-${TASK_NAME}.json"
LATEST_FILE="${OUTPUT_DIR}/latest.json"
PENDING_WAKE="${OUTPUT_DIR}/pending-wake.json"
RESULT_FILE="${OUTPUT_DIR}/task-result-${SESSION_ID}.json"

# Parse task metadata if exists
if [ -f "$TASK_META" ]; then
  WORKDIR=$(jq -r '.workdir // empty' "$TASK_META" 2>/dev/null || echo "")
  TIMESTAMP=$(jq -r '.timestamp // empty' "$TASK_META" 2>/dev/null || echo "")
else
  WORKDIR=""
  TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)
fi

# Extract output from INPUT (task result)
OUTPUT=$(echo "$INPUT" | jq -r '.output // empty' 2>/dev/null | head -c 10000 || echo "")

# Calculate duration if available
DURATION_MS=$(echo "$INPUT" | jq -r '.duration_ms // 0' 2>/dev/null)

# Determine status
STATUS="done"
if echo "$INPUT" | jq -r '.error // empty' 2>/dev/null | grep -q "."; then
  STATUS="error"
fi

# Write standardized result JSON
jq -n \
  --arg session_id "$SESSION_ID" \
  --arg timestamp "$TIMESTAMP" \
  --arg task_name "$TASK_NAME" \
  --arg workdir "$WORKDIR" \
  --arg output "$OUTPUT" \
  --arg status "$STATUS" \
  --argjson duration_ms "$DURATION_MS" \
  '{
    session_id: $session_id,
    timestamp: $timestamp,
    task_name: $task_name,
    workdir: $workdir,
    output: $output,
    status: $status,
    duration_ms: $duration_ms
  }' > "$RESULT_FILE"

# Also write to latest.json for easy polling
cp "$RESULT_FILE" "$LATEST_FILE"

# Write pending-wake.json for AGI heartbeat integration
jq -n \
  --arg session_id "$SESSION_ID" \
  --arg task_name "$TASK_NAME" \
  --arg status "$STATUS" \
  --arg timestamp "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  '{
    event: "claude_task_complete",
    session_id: $session_id,
    task_name: $task_name,
    status: $status,
    timestamp: $timestamp,
    ready: true
  }' > "$PENDING_WAKE"

# Optional: Send Telegram notification
# Uncomment if you want notifications:
# TG_BOT_TOKEN="YOUR_BOT_TOKEN"
# TG_CHAT_ID="YOUR_CHAT_ID"
# if [ -n "$TG_BOT_TOKEN" ] && [ -n "$TG_CHAT_ID" ]; then
#   MESSAGE="Claude Code completed: ${TASK_NAME} (${STATUS})"
#   curl -s -X POST "https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage" \
#     -d "chat_id=${TG_CHAT_ID}" \
#     -d "text=${MESSAGE}" > /dev/null 2>&1 || true
# fi

echo "Hook completed. Result: $RESULT_FILE"
exit 0
