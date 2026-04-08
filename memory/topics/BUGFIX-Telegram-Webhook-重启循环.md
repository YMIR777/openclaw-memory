# Telegram Webhook 重启循环 Bug

> 发现日期：2026-04-06
> 状态：临时修复（禁用了 Telegram 频道），待彻底解决

## 问题描述

Gateway 每 ~5 分钟崩溃重启一次，Webchat 连接断开，用户输入内容丢失。

## 根因

Telegram Bot 尝试删除 webhook（`deleteWebhook`），但 `api.telegram.org` 在用户网络下不通（被 Clash 代理拦截，返回 Network request failed）。

删除失败后进入**指数退避重试循环**：
- 重试间隔：2s → 4s → 6s → 13s → 24s → 30s...无限叠加
- 重试风暴耗尽 Gateway 资源 → 触发 `code=1012 service restart`
- 重启后继续重试 → 死循环

## 临时修复

禁用 Telegram 频道：
```
channels.telegram.enabled = false
```

Gateway 重启后稳定。

## 待彻底解决

1. 在 Clash Verge 的 bypass 规则里添加：
   - `DOMAIN-SUFFIX,telegram.org,DIRECT`
   - `DOMAIN-SUFFIX,api.telegram.org,DIRECT`
2. 重新启用 Telegram 频道：`channels.telegram.enabled = true`

## 教训

- Telegram channel 的 webhook 清理失败没有被妥善处理，进入了无限重试
- 早期症状：日志里 `telegram deleteWebhook failed` 开始出现时就应该警惕
- 崩溃前 Gateway 进程 PID 固定（17230），重启后不变（SIGUSR1 热重载）
