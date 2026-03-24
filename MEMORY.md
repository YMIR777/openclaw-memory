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

## 💡 核心经验教训

### 1. OpenClaw Runtime 选择（重要！）
- `runtime=subagent` = OpenClaw 自己的模型（MiniMax-M2.7）
- `runtime=acp` + `agentId=claude` = 真正调用 Claude Code
- **教训**：创建 skill ≠ 这个 skill 能被使用，必须先验证工具是否真的可用

### 2. ClawHub Rate Limit 解决方案
```bash
clawhub login --token <token>
# 或环境变量
export CLAWHUB_TOKEN=clh_xxx
```
不要明文在命令里输入 token，有安全风险。

### 3. Mac 自动化坐标系统（Retina 屏幕）
| 工具 | 分辨率 |
|------|--------|
| VNC (屏幕共享) | 2880 x 1800 (2x) |
| pyautogui / PyUserInput | 1440 x 900 (1x) |
- 坐标转换：VNC → pyautogui 除以 2

### 4. Mac 自动化中文输入方案
```python
import pyperclip
pyperclip.copy("中文")
pyautogui.hotkey('command', 'v')
```

### 5. StarUML 自动化
- 安装 staruml-controller 扩展（端口 12345）
- API 路径：`POST /api/usecase/diagrams` 等
- 可程序化生成 UML 图

### 6. Claude Code print 模式挂起修复
```bash
# 备份配置
cp ~/.claude/settings.json ~/settings-backup.json
# 重装
curl -fsSL https://claude.ai/install.sh | bash
# 恢复
cp ~/settings-backup.json ~/.claude/settings.json
```

### 7. Claude Code Hooks 零轮询方案
- Stop Hook + SessionEnd Hook 触发后写文件
- 结果输出到 `~/.openclaw/claude-code-results/latest.json`
- 通过 Wake Event 通知 OpenClaw

### 8. Session Memory 配置
```json
"memorySearch": {
  "experimental": { "sessionMemory": true },
  "sources": ["memory", "sessions"]
}
```

### 9. ACP + Claude Code 集成配置
```json
"plugins": {
  "entries": {
    "acpx": {
      "enabled": true,
      "config": {
        "permissionMode": "approve-all",
        "nonInteractivePermissions": "fail"
      }
    }
  }
},
"acp": {
  "enabled": true,
  "backend": "acpx",
  "defaultAgent": "claude",
  "allowedAgents": ["claude", "codex", "pi", "opencode", "gemini", "kimi"],
  "maxConcurrentSessions": 8
}
```

### 10. openclaw.json 配置兼容性问题（openclaw-cn）
以下配置项是 openclaw 主版特有，openclaw-cn 不支持，混用时会报错：
- `commands.ownerDisplay`
- `channels.telegram.streaming`
- `gateway.controlUi.allowedOrigins`
- `acp` 配置块
- `plugins.entries.acpx`

如遇 WebSocket 1008 错误，先检查是否有上述不兼容配置。

## 🔧 工具安装备忘

### 自动化依赖
```bash
pip3 install pyautogui pyperclip  # Mac 自动化
pip3 install PyUserInput           # 鼠标键盘控制
brew install cliclick              # 命令行鼠标控制
brew install blueutil              # 蓝牙控制
brew install switchaudio-osx      # 音频设备切换
```

### StarUML 扩展
- staruml-controller: `~/Library/Application Support/StarUML/extensions/user/staruml-controller`

## 📁 项目路径
- 作业目录：/Users/Ymir/Documents/trae_projects
- Vibe 项目：/Users/Ymir/Documents/vibe-projects
- SpecKit 项目：/Users/Ymir/Documents/vibe-projects/spec-kit-setup
- MyDiary：/Users/Ymir/Documents/vibe-projects/spec-kit-setup/mydiary

## 🚨 2026-03-24 Gateway SIGTERM 问题（重要教训）

### 问题现象
Gateway 每 20-30 秒收到 SIGTERM 重启，WebSocket 1006/1008 错误。

### 根因 1：自定义 Watchdog 服务缺陷
- 位置：`~/Library/LaunchAgents/com.ymir.gateway-watchdog.plist`
- 脚本：`/Users/Ymir/Scripts/gateway-watchdog.sh`
- 问题：每 30 秒检查一次 health 端点，失败就重启，但没考虑 gateway 重启需要时间
- 解决：已禁用 watchdog，使用原生 `ai.openclaw.gateway` launchd 服务

### 根因 2：openclaw 与 openclaw-cn 混用
- openclaw-cn（中文定制版）和 openclaw（主版）是**不同分支**，不能混用！
- openclaw npm 包**不包含** control-ui，需要从 openclaw-cn 复制
- 升级 openclaw 到 2026.3.22 后 control-ui 丢失，因为 control-ui 根本不在 npm 包里

### ✅ 当前正确配置
| 项目 | 路径/值 |
|------|---------|
| 实际使用包 | openclaw-cn |
| 版本 | 0.1.8-fix.3 |
| Gateway 入口 | `~/.npm-global/lib/node_modules/openclaw-cn/dist/entry.js` |
| Control UI | `~/.npm-global/lib/node_modules/openclaw-cn/dist/control-ui/` |
| Gateway 端口 | 18789 |
| Health 端点 | http://127.0.0.1:18789/health |
| Gateway Token | 02b70de1f6284ebd5dc38c3f7821ef8ad9f162509759d29dc041897712314dd0 |
| Launchd 服务 | ai.openclaw.gateway.plist |
| 配置文件 | ~/.openclaw/openclaw.json |

### ❌ 不要做的事
1. **不要**在 gateway 重启过程中频繁健康检查（startup-grace 期 60 秒）
2. **不要**混用 openclaw 和 openclaw-cn（路径、配置不兼容）
3. **不要**以为 openclaw npm 包包含 control-ui（它不包含）
4. **不要**在生产环境使用简陋的 watchdog（OpenClaw 已有内置 health-monitor）

### 📝 Watchdog 设计原则（警戒）
- 检查失败后应等待一段时间再重试，不要立即重启
- 连续 N 次检查失败才触发重启（避免瞬时故障误判）
- 重启后应等待足够长时间再开始检查
- SIGTERM 间隔规律是定位外部干扰的关键线索

### 日志路径
- Gateway 日志：`/tmp/openclaw/openclaw-YYYY-MM-DD.log`
- Watchdog 日志：`/Users/Ymir/.openclaw/logs/watchdog.log`
