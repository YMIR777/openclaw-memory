#!/bin/bash
# Claude Code Launcher - Convenience wrapper for OpenClaw integration
# Usage: claude-code-launch.sh [mode] [task] [options]

set -e

MODE="${1:-print}"
TASK="${2:-}"
shift 2 || true

CLAUDE_CMD="${CLAUDE_CODE_CMD:-claude}"
OUTPUT_DIR="${CLAUDE_CODE_OUTPUT_DIR:-/tmp}"

show_usage() {
  cat << EOF
Claude Code Launcher - Convenience wrapper for OpenClaw

Usage: claude-code-launch.sh [mode] [task] [options]

Modes:
  print, p     Print mode (synchronous, default)
  background, b  Background mode with result file
  continue, c   Continue most recent session
  resume, r     Resume specific session

Examples:
  claude-code-launch.sh print "Fix the login bug"
  claude-code-launch.sh background "Run full test suite" --allowedTools "Bash,Read"
  claude-code-launch.sh continue "Now add documentation"
  claude-code-launch.sh resume <session-id> "Continue work"

Environment Variables:
  CLAUDE_CODE_CMD     Claude Code CLI command (default: claude)
  CLAUDE_CODE_OUTPUT_DIR  Output directory for results (default: /tmp)

EOF
}

case "$MODE" in
  print|p)
    exec $CLAUDE_CMD -p "$TASK" "$@"
    ;;
  background|b)
    SESSION_ID=$(date +%s)
    OUTPUT_FILE="${OUTPUT_DIR}/claude-result-${SESSION_ID}.json"
    (
      RESULT=$($CLAUDE_CMD -p "$TASK" "$@" --output-format json 2>&1)
      jq -n \
        --arg session_id "$SESSION_ID" \
        --arg result "$RESULT" \
        --arg timestamp "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
        '{
          session_id: $session_id,
          timestamp: $timestamp,
          status: "complete",
          result: ($result | fromjson)
        }' > "$OUTPUT_FILE"
    ) &
    echo "Background task started. Session ID: $SESSION_ID"
    echo "Result will be written to: $OUTPUT_FILE"
    ;;
  continue|c)
    exec $CLAUDE_CMD -c -p "$TASK" "$@"
    ;;
  resume|r)
    SESSION_ID="${1:-}"
    if [ -z "$SESSION_ID" ]; then
      echo "Error: Session ID required for resume mode"
      exit 1
    fi
    TASK="${2:-}"
    exec $CLAUDE_CMD -r "$SESSION_ID" -p "$TASK" "$@"
    ;;
  help|--help|-h)
    show_usage
    ;;
  *)
    echo "Unknown mode: $MODE"
    show_usage
    exit 1
    ;;
esac
