# 核心经验教训

## 1. OpenClaw Exec 安全策略（2026-03-25 新增）
→ [[OpenClaw-Exec安全策略配置]]（Obsidian 完整文档）
→ [[OpenClaw-安全加固配置]]（Obsidian 安全加固文档）

**核心要点：**
- exec 有 `deny/allowlist/full` 三级安全模式，`deny` 拦所有命令
- `safeBins` 只在 `allowlist` 模式下生效
- 修改配置后必须 `launchctl bootout/bootstrap` 完整重启，SIGUSR1 不够
- 子 agent 能 exec 主 agent 不能 = 进程配置快照不同

**2026-03-25 安全加固：**
- 文件权限：`chmod 600 openclaw.json`，`chmod 700 ~/.openclaw`
- elevated.allowFrom：从 `*` 改为明确指定 Telegram ID `6837836571`
- strictInlineEval：已开启
- Watchdog：已安装（300 秒间隔，避免旧版 30 秒导致的 SIGTERM 循环）
- security=full：保留（单用户可接受，待未来降级）

## 2. ClawHub Rate Limit 解决方案
```bash
clawhub login --token <token>
export CLAWHUB_TOKEN=clh_xxx
```
不要明文在命令里输入 token，有安全风险。

## 3. Mac 自动化坐标系统（Retina 屏幕）
| 工具 | 分辨率 |
|------|--------|
| VNC (屏幕共享) | 2880 x 1800 (2x) |
| pyautogui / PyUserInput | 1440 x 900 (1x) |
- 坐标转换：VNC → pyautogui 除以 2

## 4. Mac 自动化中文输入方案
```python
import pyperclip
pyperclip.copy("中文")
pyautogui.hotkey('command', 'v')
```

## 5. StarUML 自动化
- 安装 staruml-controller 扩展（端口 12345）
- API 路径：`POST /api/usecase/diagrams` 等
- 可程序化生成 UML 图

## 6. Claude Code print 模式挂起修复
```bash
# 备份配置
cp ~/.claude/settings.json ~/settings-backup.json
# 重装
curl -fsSL https://claude.ai/install.sh | bash
# 恢复
cp ~/settings-backup.json ~/.claude/settings.json
```

## 7. Claude Code Hooks 零轮询方案
- Stop Hook + SessionEnd Hook 触发后写文件
- 结果输出到 `~/.openclaw/claude-code-results/latest.json`
- 通过 Wake Event 通知 OpenClaw

## 8. Session Memory 配置
```json
"memorySearch": {
  "experimental": { "sessionMemory": true },
  "sources": ["memory", "sessions"]
}
```

## 9. ACP + Claude Code 集成配置
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

## 10. openclaw.json 配置兼容性问题（openclaw-cn）
以下配置项是 openclaw 主版特有，openclaw-cn 不支持，混用时会报错：
- `commands.ownerDisplay`
- `channels.telegram.streaming`
- `gateway.controlUi.allowedOrigins`
- `acp` 配置块
- `plugins.entries.acpx`

如遇 WebSocket 1008 错误，先检查是否有上述不兼容配置。

## 11. GitHub 永久认证方案
- gh 存 keychain，git 读 env GITHUB_TOKEN
- `git config --global credential.helper "env"`
- GITHUB_TOKEN 写入 `~/.zshrc` 持久化
- 新 token：`[GITHUB_TOKEN_REDACTED]`

## 12. exec 工具权限
- `tools.exec.allowFrom` 需正确配置，否则报 "allowlist miss"
- 重启 gateway 可解除临时锁定

## 13. GitHub API vs gh CLI（重要！）
- **必须用 `gh` CLI 做所有 GitHub 操作**，不要调 GitHub REST API
- `gh` 走 keychain 认证，不需要传 token
- 直接 curl 调用 REST API 时：
  - git 的 `credential.helper=env` 不生效（不经过 git credential）
  - **必须**传 Bearer token，且 PAT 必须有对应 scope
  - Fine-grained PAT 默认缺 `repo` scope，会 403
- 子 agent 做 GitHub 操作时不要硬编码 PAT，要用 `$GITHUB_TOKEN` 或让 gh 自动处理
- 正确示范：`gh repo create <name> --public --source <dir> --push`
- 错误示范：`curl -H "Authorization: token <PAT>" https://api.github.com/...`
