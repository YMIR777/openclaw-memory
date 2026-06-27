# TCC 权限管理规范

> 记录日期：2026-04-10

## 核心规则

**以后需要新 TCC 授权时，必须提前告知用户，不能擅自写入。**

表达方式：「需要加一条 TCC 授权，我来执行命令，授权内容是：XXX」

---

## 已写入的 TCC 权限

### 2026-04-10 写入
- osascript (`/usr/bin/osascript`) → AppleEvents Automation 全局授权
- System Events → 可控制任何已授权的 App

**写入原因：** OpenClaw cron 定时任务（暂停网易云音乐等）需要 osascript 无声执行，不能每次弹窗审批。

**后续新增权限的流程：**
1. 我告知用户需要什么权限
2. 用户确认
3. 我执行 sqlite3 命令写入 TCC.db
4. 完成

---

## macOS TCC 权限类型说明

| 权限类型 | 说明 | 常见触发 |
|---------|------|---------|
| kTCCServiceAppleEvents | 控制其他 App（发送 AppleScript） | osascript 控制网易云等 |
| kTCCServiceAccessibility | 控制电脑本身（键鼠等） | UI 自动化 |
| kTCCServiceScreenCapture | 截屏/录屏 | 截图功能 |
| kTCCServiceMicrophone | 麦克风 | 语音输入 |
| kTCCServiceCamera | 摄像头 | 视频相关 |

---

## TCC.db 路径
- 用户级：`~/Library/Application Support/com.apple.TCC/TCC.db`
- 系统级：`/Library/Application Support/com.apple.TCC/TCC.db`（需要 root）

## 批量授权触发脚本
路径：`~/.openclaw/scripts/tcc-batch-auth.sh`

下次新 Terminal 安装后，运行此脚本一次性触发所有常用 App 的 Automation 授权对话框。

## 常用 App 权限清单（已验证）
| App | 权限 |
|-----|------|
| NeteaseMusic | ✅ Automation 已授权 |
| Finder | ✅ Automation 已授权 |
| Chrome/Edge | ✅ Automation 已授权 |
| WeChat/QQ/Telegram | ✅ Automation 已授权 |
| Safari | ✅ Automation 已授权 |
| Obsidian | ✅ Automation 已授权 |

## 写入 TCC 需要的条件
1. Terminal.app 需要「完全磁盘访问权限」
2. 执行 sqlite3 命令（当前用户级，无需 sudo）
