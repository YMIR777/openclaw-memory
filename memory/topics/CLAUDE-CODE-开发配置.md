# Claude Code 开发配置

## Claude Code Skill
- 位置：`~/.openclaw/workspace/skills/claude-code/`
- 功能：集成 Claude Code CLI，支持编程任务、代码审查、异步执行
- 脚本：
  - `scripts/claude-code-launch.sh` - 启动器（print/background/continue/resume 模式）
  - `scripts/claude-code-stop-hook.sh` - Stop 钩子，用于零轮询集成

## 项目目录
- 位置：`/Users/Ymir/Documents/vibe-projects`
- OpenSpec 初始化：已配置 Claude Code
- SpecKit 初始化：已配置 Claude Code（spec-kit-setup 子目录）

## 已安装工具

### OpenSpec
- 安装：`npm install -g @fission-ai/openspec@latest` (v1.2.0)
- 命令：`/opsx:propose`、`/opsx:apply`、`/opsx:archive`
- 用途：轻量迭代开发首选

### SpecKit
- 安装：`uv tool install specify-cli --from git+https://github.com/github/spec-kit.git` (v0.3.1)
- 命令：`/speckit.specify`、`/speckit.plan`、`/speckit.tasks`、`/speckit.implement`
- 用途：严谨项目开发首选

## 开发工作流
1. OpenSpec 快速路径：`/opsx:propose` → `/opsx:apply` → `/opsx:archive`
2. SpecKit 完整路径：`/speckit.constitution` → `/speckit.specify` → `/speckit.plan` → `/speckit.tasks` → `/speckit.implement`
3. 与 Claude Code 对话必须用英文

## OpenClaw Runtime 选择（重要！）
- `runtime=subagent` = OpenClaw 自己的模型（MiniMax-M2.7）
- `runtime=acp` + `agentId=claude` = 真正调用 Claude Code
- **教训**：创建 skill ≠ 这个 skill 能被使用，必须先验证工具是否真的可用
