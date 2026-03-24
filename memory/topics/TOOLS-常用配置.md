# 常用配置

## API Keys
- Exa Search: 8534dd8b-d68a-4736-b92c-0afdf1832715
- GitHub Token: [GITHUB_TOKEN_REDACTED] (full repo scope)

## ClawHub 安装
- 使用 `CLAWDHUB_REGISTRY=https://clawdhub.com clawdhub install <skill>`

## Mac 屏幕控制工具
- 位置：`~/.openclaw/workspace/tools/mac_control.sh`
- 用法：
  - `screenshot` - 截图
  - `click x y` - 点击
  - `type "文字"` - 输入

## 自动化依赖
```bash
pip3 install pyautogui pyperclip  # Mac 自动化
pip3 install PyUserInput           # 鼠标键盘控制
brew install cliclick              # 命令行鼠标控制
brew install blueutil              # 蓝牙控制
brew install switchaudio-osx      # 音频设备切换
```

## Skills Manager
- 路径：`~/.openclaw/skills/skills-manager/SKILL.md`
- 内容：社区 skills 安装、审查、更新、验证规范
- 使用：描述需求 → 安全审查 → clawdhub install → 验证

## StarUML 扩展
- staruml-controller: `~/Library/Application Support/StarUML/extensions/user/staruml-controller`
