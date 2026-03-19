# TOOLS.md - Local Notes

Skills define *how* tools work. This file is for *your* specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:
- Camera names and locations
- SSH hosts and aliases  
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras
- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH
- home-server → 192.168.1.100, user: admin

### TTS
- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## 🖥️ Mac 自动化工具

### macauto.py - 整合自动化工具
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

### 中文输入方案
使用 pyperclip + Cmd+V 粘贴：
```python
import pyperclip
import pyautogui
pyperclip.copy("中文")
pyautogui.hotkey('command', 'v')
```

---

## 🖥️ VNC 远程控制

### macctl - VNC 守护进程
位置：`~/.openclaw/workspace/tools/macctl`
- 需要先开启 Mac "屏幕共享"
- 用户名：Ymir，密码：1314

---

## 📦 API Keys

- **Exa Search**: 8534dd8b-d68a-4736-b92c-0afdf1832715
- **GitHub Token**: github_pat_11BMRRYKI0dj5x8Smry0dZ...

## 🔖 常用技能仓库

- **awesome-openclaw_skills**: https://github.com/VoltAgent/awesome-openclaw_skills
