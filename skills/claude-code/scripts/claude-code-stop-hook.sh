#!/bin/bash
# Claude Code Stop Hook - Writes result to JSON file for zero-poll integration
# Usage: Configure in ~/.claude/settings.json
#
# {
#   "hooks": {
#     "Stop": [{
#       "hooks": [{
#         "type": "command",
#         "command": "/path/to/claude-code-stop-hook.sh"
#       }]
#     }]
#   }
# }

INPUT=$(cat)
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "unknown"')
STOP_HOOK_ACTIVE=$(echo "$INPUT" | jq -r '.stop_hook_active // false')

# Prevent infinite loops - if hook already active, allow stop
if [ "$STOP_HOOK_ACTIVE" = "true" ]; then
  exit 0
fi

# Determine output file from environment or default
OUTPUT_DIR="${CLAUDE_CODE_OUTPUT_DIR:-/tmp}"
OUTPUT_FILE="${OUTPUT_DIR}/claude-result-${SESSION_ID}.json"

# Write result metadata
jq -n \
  --arg session_id "$SESSION_ID" \
  --arg timestamp "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  --arg event "Stop" \
  '{
    session_id: $session_id,
    timestamp: $timestamp,
    event: $event,
    status: "complete"
  }' > "$OUTPUT_FILE"

echo "Result written to $OUTPUT_FILE"
exit 0
