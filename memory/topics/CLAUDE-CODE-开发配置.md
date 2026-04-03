# Claude Code 开发配置

## Claude Code Skill
- 位置：`~/.openclaw/workspace/skills/claude-code/`
- 功能：集成 Claude Code CLI，支持编程任务、代码审查、异步执行
- 脚本：
  - `scripts/claude-code-launch.sh` - 启动器
  - `scripts/claude-code-dispatch.sh` - 零轮询 dispatch
  - `scripts/claude-code-stop-hook.sh` - Stop 钩子

## 项目目录
- 位置：`/Users/Ymir/Documents/vibe-projects`
- OpenHarmony 项目：`/Users/Ymir/Documents/trae_projects/`
- DevEco Studio 项目：`/Users/Ymir/DevEcoStudioProjects/`

## ⚠️ 终极 Claude Code 工作流（2026-04-02 验证）

### 只用 ACP Sessions，禁用 exec 直接调用

**正确方式：**
```typescript
sessions_spawn(
  task="英文任务描述",
  runtime: "acp",
  agentId: "claude",
  mode: "run",
  streamTo: "parent",
  timeoutSeconds: 600
)
```

**禁止方式：**
- `exec` 直接调用 `claude -p` ❌（无 TTY 会 hang）
- Hook-based dispatch ❌（底层也用 `claude -p`）

### 已知行为
- ACP session 发起后，**必有约 60 秒初始化等待**
- 等待期间输出 `claude has produced no output for 60s. It may be waiting for interactive input`
- 这是 Claude Code CLI 在 ACP 非交互模式下的固定行为，不是错误
- 60 秒后开始输出，之后正常完成

### 工作流步骤
1. `sessions_spawn` 发起任务
2. 等待 60 秒（`stall` → `resumed`）
3. 持续轮询 `streamLogPath` 的 JSONL 文件直到 `phase:end`
4. 检查文件是否已写入目标位置
5. 如需修改：重新发起 session，不自己动手替代

### PTY 是否需要
- **不需要**。ACP sessions 本身是异步非 TTY 方案
- `exec` + `pty: true` 可以运行交互式 Claude Code，但需要额外的自动化脚本处理交互，不值得

## OpenClaw Runtime 选择（重要！）
- `runtime=subagent` = OpenClaw 自己的模型（MiniMax-M2.7）
- `runtime=acp` + `agentId=claude` = 真正调用 Claude Code
- **教训**：创建 skill 不等于工具能用，必须用 ACP sessions 方式调用

## ⚠️ Write 工具权限

Claude Code CLI 的 Write 工具默认被禁止，必须加 `--allowed-tools Write`：
- ACP sessions 由 acpx 插件处理权限，不需要此参数
- exec 直接调用必须加此参数

## 已安装工具

### OpenSpec
- 安装：`npm install -g @fission-ai/openspec@latest` (v1.2.0)
- 命令：`/opsx:propose`、`/opsx:apply`、`/opsx:archive`

### SpecKit
- 安装：`uv tool install specify-cli --from git+https://github.com/github/spec-kit.git` (v0.3.1)
- 命令：`/speckit.specify`、`/speckit.plan`、`/speckit.tasks`、`/speckit.implement`

## 开发工作流
1. OpenSpec 快速路径：`/opsx:propose` → `/opsx:apply` → `/opsx:archive`
2. SpecKit 完整路径：`/speckit.constitution` → `/speckit.specify` → `/speckit.plan` → `/speckit.tasks` → `/speckit.implement`
3. **与 Claude Code 对话必须用英文**

## OpenHarmony 项目已配置
- 项目目录已添加到 `projects`
- `hasTrustDialogAccepted` 已设为 `true`
- `settings.json` 的 `additionalDirectories` 已添加
