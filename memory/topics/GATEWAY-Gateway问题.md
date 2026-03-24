# Gateway 问题与配置

## 2026-03-24 Gateway SIGTERM 问题

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

## ✅ 当前正确配置（已切换到主版 v2026.3.23）

| 项目 | 路径/值 |
|------|---------|
| CLI 版本 | **openclaw v2026.3.23**（已切换） |
| Gateway 版本 | **openclaw v2026.3.23** |
| CLI 入口 | `~/.npm-global/bin/openclaw` → `~/.openclaw/lib/node_modules/openclaw/openclaw.mjs` |
| Gateway 入口 | `~/.openclaw/lib/node_modules/openclaw/dist/entry.js` |
| npm 主版包 | `~/.openclaw/lib/node_modules/openclaw/` |
| npm cn 版包（备用） | `~/.npm-global/lib/node_modules/openclaw-cn/` |
| Gateway 端口 | 18789 |
| Health 端点 | http://127.0.0.1:18789/health |
| Gateway Token | 02b70de1f6284ebd5dc38c3f7821ef8ad9f162509759d29dc041897712314dd0 |
| Launchd 服务 | ai.openclaw.gateway.plist |
| 配置文件 | ~/.openclaw/openclaw.json（两版本共用） |

## ⚠️ 版本选择原则（重要！）
- **只用主版 openclaw v2026.3.23**（launchd 实际跑的就是这个）
- CLI 切换：`ln -s ~/.openclaw/lib/node_modules/openclaw/openclaw.mjs ~/.npm-global/bin/openclaw`
- `openclaw-cn` CLI 仍有备份在 `~/.npm-global/bin/openclaw-cn`，不建议删除
- `meta.lastTouchedVersion` 字段不影响功能，仅做参考

## ❌ 不要做的事
1. **不要**在 gateway 重启过程中频繁健康检查（startup-grace 期 60 秒）
2. **不要**混用 openclaw 和 openclaw-cn（路径、配置不兼容）
3. **不要**以为 openclaw npm 包包含 control-ui（它不包含）
4. **不要**在生产环境使用简陋的 watchdog（OpenClaw 已有内置 health-monitor）

## 📝 Watchdog 设计原则（警戒）
- 检查失败后应等待一段时间再重试，不要立即重启
- 连续 N 次检查失败才触发重启（避免瞬时故障误判）
- 重启后应等待足够长时间再开始检查
- SIGTERM 间隔规律是定位外部干扰的关键线索

## 日志路径
- Gateway 日志：`/tmp/openclaw/openclaw-YYYY-MM-DD.log`
- Watchdog 日志：`/Users/Ymir/.openclaw/logs/watchdog.log`
