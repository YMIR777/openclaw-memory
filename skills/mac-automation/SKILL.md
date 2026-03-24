# Mac Automation Skill

## 概述
这个 skill 提供 macOS 自动化控制能力，包括鼠标操作、键盘输入、应用控制等。

## 工具位置
- 主工具: `~/.openclaw/workspace/tools/macctl`
- Python版本: `~/.openclaw/workspace/tools/macauto.py`

## 功能

### 1. 鼠标操作
```bash
# 点击坐标 (x, y)
~/.openclaw/workspace/tools/macctl click x y

# 双击坐标
~/.openclaw/workspace/tools/macctl double_click x y

# 移动鼠标
~/.openclaw/workspace/tools/macctl move x y
```

### 2. 键盘操作
```bash
# 输入文字 (支持中文)
~/.openclaw/workspace/tools/macctl type "你好世界"

# 按键 (使用 keycode)
~/.openclaw/workspace/tools/macctl key 36  # 36 = Return
```

### 3. 应用控制
```bash
# 激活应用 (通过 AppleScript)
osascript -e 'activate application "WeChat"'
```

### 4. 微信自动化
```bash
~/.openclaw/workspace/tools/macauto.py wechat "联系人" "消息内容"
```

## 使用示例

**场景：让 OpenClaw 帮你操作微信**

1. 先截屏确认界面
2. 激活微信
3. 搜索联系人
4. 发送消息

**注意事项：**
- 需要在系统偏好设置中开启"辅助功能"权限
- 微信需要开启"允许 AppleScript"权限
- Retina 屏幕坐标需要除以 2

## 优势
- ✅ 事件驱动，CPU 占用极低 (0%)
- ✅ 支持中文输入 (通过剪贴板)
- ✅ 持久连接 VNC，一次连接多次使用
