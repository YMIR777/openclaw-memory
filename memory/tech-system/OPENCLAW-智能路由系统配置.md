# OpenClaw 智能路由系统配置

> 记录日期：2026-04-25

## 一、需求背景

小黒希望 OpenClaw 能像 Claude Code 智能路由中间件一样，根据意图自动选择模型：
- CODE/WRITING 意图 → Kimi (kimi-for-coding)
- GENERAL 意图 → MiniMax (MiniMax-M2.7)

## 二、架构设计

```
OpenClaw → http://127.0.0.1:3000 → Claude Smart Router
                                       ↓
                              MiniMax M2.7 意图分析
                                       ↓
                              CODE/WRITING (≥0.6) → Kimi
                              GENERAL (其他) → MiniMax
```

## 三、路由器信息

| 项目 | 值 |
|------|-----|
| 路由器代码 | ~/claude-smart-router/index.js |
| 启动脚本 | ~/claude-smart-router/start-router.sh |
| 配置文件 | ~/claude-smart-router/.env |
| 端点 | http://127.0.0.1:3000/v1/messages |
| 状态检查 | curl http://127.0.0.1:3000/health |
| 意图分析 | curl -X POST http://127.0.0.1:3000/analyze |

## 四、OpenClaw 配置

文件：`~/.openclaw/openclaw.json`

```json
"env": {
  "vars": {
    "ANTHROPIC_BASE_URL": "http://127.0.0.1:3000",
    "ANTHROPIC_AUTH_TOKEN": "smart-router"
  }
}
```

**关键验证：**
- 路由器运行状态：`uptime: 1485s`, `status: ok`
- OpenClaw 配置确认：`ANTHROPIC_BASE_URL` 已指向 localhost:3000

## 五、意图分析测试

```bash
# 测试请求
curl -X POST http://127.0.0.1:3000/analyze \
  -H "Content-Type: application/json" \
  -d '{"message": "写一个Python快速排序函数"}'

# 返回结果
{
  "category": "CODE",
  "confidence": 0.95,
  "reason": "用户明确请求编写一个Python快速排序函数，属于代码编写任务",
  "target": "kimi"
}
```

## 六、完整链路验证

1. **意图分析** ✅ — category=CODE, confidence=0.95, target=kimi
2. **API 代理** ✅ — POST http://127.0.0.1:3000/v1/messages → Kimi
3. **实际响应** ✅ — 收到 Kimi 返回的 Python 代码

## 七、Claude Code vs OpenClaw 对比

| 系统 | 配置文件 | 路由器 |
|------|----------|--------|
| Claude Code | ~/.claude/settings.json | 独立智能路由中间件 |
| OpenClaw | ~/.openclaw/openclaw.json | 共用同一路由器 |

## 八、关键发现

1. **方案 C 最简单** — OpenClaw 跑在本机（mode: local），直接改 ANTHROPIC_BASE_URL 指向 localhost:3000 即可
2. **不需要改 Claude settings.json** — Claude Code 有自己独立的路由逻辑
3. **路由器必须先跑起来** — OpenClaw 的请求才会被正确路由

## 九、运维命令

```bash
# 路由器状态
curl http://127.0.0.1:3000/health
curl http://127.0.0.1:3000/status

# 重启 OpenClaw（让配置生效）
openclaw gateway restart

# 路由器手动启停（需 source 环境）
cd ~/claude-smart-router && npm start
```

## 十、后续优化建议

1. 缓存意图分析结果，减少 API 调用
2. 模型熔断机制：Kimi 连续失败时临时禁用
3. 可视化监控面板

---

**验证日期：** 2026-04-25
**验证结果：** ✅ 路由成功，CODE 意图正确路由到 Kimi
