# 核心经验教训

## 1. ClawHub Rate Limit 解决方案
```bash
clawhub login --token <token>
export CLAWHUB_TOKEN=clh_xxx
```
不要明文在命令里输入 token，有安全风险。

## 2. Mac 自动化坐标系统（Retina 屏幕）
| 工具 | 分辨率 |
|------|--------|
| VNC (屏幕共享) | 2880 x 1800 (2x) |
| pyautogui / PyUserInput | 1440 x 900 (1x) |
- 坐标转换：VNC → pyautogui 除以 2

## 3. Mac 自动化中文输入方案
```python
import pyperclip
pyperclip.copy("中文")
pyautogui.hotkey('command', 'v')
```

## 4. StarUML 自动化
- 安装 staruml-controller 扩展（端口 12345）
- API 路径：`POST /api/usecase/diagrams` 等
- 可程序化生成 UML 图

## 5. Claude Code print 模式挂起修复
```bash
# 备份配置
cp ~/.claude/settings.json ~/settings-backup.json
# 重装
curl -fsSL https://claude.ai/install.sh | bash
# 恢复
cp ~/settings-backup.json ~/.claude/settings.json
```

## 6. Claude Code Hooks 零轮询方案
- Stop Hook + SessionEnd Hook 触发后写文件
- 结果输出到 `~/.openclaw/claude-code-results/latest.json`
- 通过 Wake Event 通知 OpenClaw

## 7. Session Memory 配置
```json
"memorySearch": {
  "experimental": { "sessionMemory": true },
  "sources": ["memory", "sessions"]
}
```

## 8. ACP + Claude Code 集成配置
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

## 9. openclaw.json 配置兼容性问题（openclaw-cn）
以下配置项是 openclaw 主版特有，openclaw-cn 不支持，混用时会报错：
- `commands.ownerDisplay`
- `channels.telegram.streaming`
- `gateway.controlUi.allowedOrigins`
- `acp` 配置块
- `plugins.entries.acpx`

如遇 WebSocket 1008 错误，先检查是否有上述不兼容配置。

## 10. GitHub 永久认证方案
- gh 存 keychain，git 读 env GITHUB_TOKEN
- `git config --global credential.helper "env"`
- GITHUB_TOKEN 写入 `~/.zshrc` 持久化
- 新 token：`[GITHUB_TOKEN_REDACTED]`

## 11. exec 工具权限
- `tools.exec.allowFrom` 需正确配置，否则报 "allowlist miss"
- 重启 gateway 可解除临时锁定
