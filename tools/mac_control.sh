#!/bin/bash
source ~/mcp-remote-macos-use/.venv/bin/activate
cd ~/mcp-remote-macos-use
export PYTHONPATH=src
python3 ~/.openclaw/workspace/tools/mac_control.py "$@"
