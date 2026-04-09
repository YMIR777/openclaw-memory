# TOOLS.md - Local Notes

Skills define *how* tools work. This file is for *your* specifics — environment-specific notes, device names, SSH hosts, voice preferences.

---

## 🖥️ Mac 自动化工具

### macauto.py
位置：`~/.openclaw/workspace/tools/macauto.py`

```bash
# 点击坐标 (1440x900 分辨率)
python3 ~/.openclaw/workspace/tools/macauto.py click 800 950

# 输入文字（支持中文）
python3 ~/.openclaw/workspace/tools/macauto.py type "你好"

# 激活应用
python3 ~/.openclaw/workspace/tools/macauto.py activate "WeChat"

# 发送微信消息（自动化流程）
python3 ~/.openclaw/workspace/tools/macauto.py wechat "联系人" "消息"
```

### 屏幕分辨率
- **pyautogui**: 1440 x 900 (实际分辨率)
- **VNC**: 2880 x 1800 (Retina 2x)

### 中文输入
使用 pyperclip + Cmd+V 粘贴：
```python
import pyperclip, pyautogui
pyperclip.copy("中文")
pyautogui.hotkey('command', 'v')
```

---

## 🖥️ VNC 远程控制

### macctl - VNC 守护进程（已废弃）
位置：`~/.openclaw/workspace/tools/macctl`
> ⚠️ 已废弃：主力工具已切换为 `macauto.py`，macctl 不再维护。如需 VNC 控制请用 `macauto.py`

---

## 📱 Telegram 发文件（图片/文档/音频）

### OpenClaw 安全限制
OpenClaw 的 message 工具只能发送**白名单目录**下的文件，其他路径会报错：
```
Local media path is not under an allowed directory
```

### 允许的目录
- `~/.openclaw/media/outbound/` ✅ **发文件专用**
- `~/.openclaw/media/inbound/`
- 浏览器下载目录等 OpenClaw 管理路径

### 正确发送流程
```bash
# 1. 先复制文件到 outbound 目录
cp /你的/文件/路径.png ~/.openclaw/media/outbound/

# 2. 用 message 工具发送（用绝对路径）
# message(tool) → media: "/Users/Ymir/.openclaw/media/outbound/文件名"
```

### 示例：发送 UML 类图
```bash
cp ~/Documents/trae_projects/UML作业/vending-machine/VendingMachine_Class_Diagram.png \
  ~/.openclaw/media/outbound/
# 然后用 message(media="/Users/Ymir/.openclaw/media/outbound/VendingMachine_Class_Diagram.png")
```

### 重要规则
- 所有发 Telegram 的文件必须先复制到 outbound 目录
- 绝对路径用 `/Users/Ymir/` 而不是 `~`
- 用完自动删除 outbound 内容，保持目录干净

---

## 📦 API Keys

- **Exa Search**: 8534dd8b-d68a-4736-b92c-0afdf1832715
- **GitHub Token**: `$GITHUB_TOKEN` (via gh keychain, credential.helper=env)

## 🔖 常用技能仓库

- **awesome-openclaw_skills**: https://github.com/VoltAgent/awesome-openclaw_skills
