# 🌡️ WARM MEMORY（稳定系统配置）

> 最后更新：2026-04-03 08:39

## 系统配置（稳定）
- Gateway：openclaw v2026.3.23
- 模型：MiniMax-M2.7（默认），子 agent 也用 MiniMax-M2.7
- exec：security=allowlist，safeBins 包含 70+ 命令
- 向量搜索：QMD backend，620 向量，embeddinggemma + Qwen3-Reranker
- VNC 分辨率：1440x900（pyautogui），VNC 2880x1800

## 用户稳定偏好
- 作业目录：/Users/Ymir/Documents/trae_projects
- Vibe 项目：/Users/Ymir/Documents/vibe-projects
- Obsidian vault：/Users/Ymir/Documents/个人知识体系
- 项目命名规范：姓名-学号-作业内容

## 核心 Skill（已安装）
- claaude-code：Claude Code CLI 集成
- acpx-orchestrator：并行执行 + 健康检查
- elite-longterm-memory：五层记忆架构
- openclaw-self-improvement：自提升工作流
- memory-pro：整合的记忆增强系统（ACT-R 衰减）
- CLAUDE-CODE 开发配置：文档见 `memory/topics/CLAUDE-CODE-开发配置.md`

## 已知工具路径
- openclaw：/opt/homebrew/bin/openclaw
- node：/usr/local/bin/node
- python3：/usr/bin/python3
- git：/usr/bin/git
- macauto.py：`~/.openclaw/workspace/tools/macauto.py`

## 已验证的技术方案
- 中文输入：pyperclip + Cmd+V
- VNC 坐标转 pyautogui：除以 2
- GitHub 操作：必须用 gh CLI，不要直接调 REST API
