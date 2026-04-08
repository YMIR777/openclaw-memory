# Gateway 崩溃修复（2026-04-06 深夜）

> 记录日期：2026-04-06 23:08

## 问题现象
- Webchat 频繁断连："Gateway 断开连接"
- 输入框内容丢失（用户吐槽"吐血了"）
- 约每 5 分钟崩溃一次

## 根因
- **Telegram deleteWebhook 失败**：api.telegram.org 在墙内不通
- 进入**指数退避重试循环**：2s → 4s → 6s → 13s → 24s → 30s... 无限重试
- 重试风暴耗尽 Gateway 资源 → code=1012 service restart → 重启后继续死循环
- 日志关键：`telegram deleteWebhook failed: Network request for 'deleteWebhook' failed!`

## 修复方案
- 临时禁用 Telegram 频道：`channels.telegram.enabled: false`
- Gateway 立即稳定，不再崩溃

## 后续恢复 Telegram
1. 在 Clash Verge 的 bypass 规则添加：`DOMAIN-SUFFIX,telegram.org,DIRECT`
2. 重启 Gateway 后将 `channels.telegram.enabled` 改回 `true`
3. webhook 清理重试会成功，循环终止

## 教训
- Telegram channel 的 webhook 清理重试没有被限流，导致级联故障
- 未来遇到"无线重试 + restart"的组合要优先检查是否有外部网络依赖

## 关联记忆
- `memory/topics/GATEWAY-Gateway问题.md`
- 2026-04-06 的 Clash TUN 排查已发现 telegram.org 被代理拦截
