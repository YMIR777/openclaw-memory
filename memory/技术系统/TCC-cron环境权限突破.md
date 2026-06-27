# TCC 权限与 cron 环境权限突破（2026-04-10）

> 记录日期：2026-04-10

## 核心发现

### osascript 在 cron 环境里可以正常工作
- 原因：TCC 权限是按 **App Bundle ID** 缓存的，不是按进程
- osascript (`/usr/bin/osascript`) 的 bundle ID 是 `com.apple.osascript`
- macOS 把 osascript 对其他 App 的控制权限缓存在 `com.apple.osascript → target app` 的映射里
- OpenClaw 的 cron 任务通过 launchd 执行，走的是同一个 osascript 路径，所以权限被继承

### 已验证 cron 里可用的权限
| 权限 | cron 环境测试结果 |
|------|------------------|
| osascript + NeteaseMusic | ✅ 成功 |
| System Events | ✅ 可用 |

## 未来新 Terminal 环境的处理流程

当 OpenClaw 在新的 Terminal/App 环境里需要 Automation 权限时：

1. 运行批量授权脚本：
   ```bash
   bash ~/.openclaw/scripts/tcc-batch-auth.sh
   ```
2. 用户在所有弹出的对话框里点"允许"
3. 完成后权限永久缓存，之后的 cron/isolated 会话都能用

## 完整已授权 App 列表
- com.apple.osascript → System Events ✅
- com.apple.osascript → NeteaseMusic (com.netease.163music) ✅
- com.apple.osascript → Finder ✅
- com.apple.osascript → Safari ✅
- com.apple.osascript → Google Chrome ✅
- com.apple.oscript → Microsoft Edge ✅
- com.apple.osascript → WeChat ✅
- com.apple.osascript → QQ ✅
- com.apple.osascript → Telegram ✅
- com.apple.osascript → Obsidian ✅

## 关键教训
1. OpenClaw exec-approvals 白名单只解决 exec 层问题，不解决 macOS TCC 问题
2. 但 osascript 在 cron 环境里的 TCC 权限是流畅的（无需额外操作）
3. sqlite3 直接写入 TCC.db 在 SIP 开启的系统上需要 root，但我们的场景不需要这样做
