# 重要记忆

## 🖤 关于小黒
- 用户名：小黒秋
- 软件技术课程学生（Python, Java, JavaScript, SpringBoot, MySQL）
- 作业目录：/Users/Ymir/Documents/trae_projects
- 不喜欢过于谄媚的回答，喜欢温暖且有力量的回答
- 母语中文，但与 Claude Code 对话必须用英文

## 🔧 常用配置

### ClawShell 安装
- 使用 `CLAWDHUB_REGISTRY=https://clawdhub.com clawdhub install <skill>`

### 可用 API Keys
- Exa Search: 8534dd8b-d68a-4736-b92c-0afdf1832715
- GitHub Token: github_pat_11BMRRYKI0dj5x8Smry0dZ...

### Claude Code Skill
- 位置：~/.openclaw/workspace/skills/claude-code/
- 功能：集成 Claude Code CLI，支持编程任务、代码审查、异步执行
- 脚本：
  - scripts/claude-code-launch.sh - 启动器（print/background/continue/resume 模式）
  - scripts/claude-code-stop-hook.sh - Stop 钩子，用于零轮询集成

### Mac 屏幕控制工具
- 位置：~/.openclaw/workspace/tools/mac_control.sh
- 用法：
  - screenshot - 截图
  - click x y - 点击
  - type "文字" - 输入

## 🤖 Claude Code 开发配置

### 项目目录
- 位置：/Users/Ymir/Documents/vibe-projects
- OpenSpec 初始化：已配置 Claude Code
- SpecKit 初始化：已配置 Claude Code（spec-kit-setup 子目录）

### 已安装工具
- **OpenSpec**：`npm install -g @fission-ai/openspec@latest` (v1.2.0)
  - 命令：`/opsx:propose`、`/opsx:apply`、`/opsx:archive`
  - 轻量迭代开发首选
- **SpecKit**：`uv tool install specify-cli --from git+https://github.com/github/spec-kit.git` (v0.3.1)
  - 命令：`/speckit.specify`、`/speckit.plan`、`/speckit.tasks`、`/speckit.implement`
  - 严谨项目开发首选

### 开发工作流
1. OpenSpec 快速路径：`/opsx:propose` → `/opsx:apply` → `/opsx:archive`
2. SpecKit 完整路径：`/speckit.constitution` → `/speckit.specify` → `/speckit.plan` → `/speckit.tasks` → `/speckit.implement`
3. 与 Claude Code 对话必须用英文

## 📅 2026-03-18 重要事件
- 成功配置 macOS-use 通过 VNC 控制 Mac
- 成功远程打开微信并发送消息给联系人"2R（彭可忻）"
- 学习 Claude Code Hooks 零轮询方案
