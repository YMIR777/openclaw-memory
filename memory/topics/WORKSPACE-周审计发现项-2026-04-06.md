# Workspace 周审计发现项

> 记录日期：2026-04-06
> 来源：workspace-weekly-audit 自动任务

## Memory 审计（发现 11 条值得保留）
- 04-03 thinking 降级决策：`thinkingDefault: high → medium`，已写入配置但 MEMORY.md 未同步
- 04-06 Clash TUN 代理问题：TUN 拦截 `api.minimaxi.com` 和 `api.telegram.org`，已在 Clash Verge 添加 DIRECT 规则
- QMD 故障与恢复（03-25）：bun 安装缺 dist/，npm 覆盖修复
- MiniMax VL 配置打通（03-26）：移除 ollama provider + imageModel 字符串格式
- Ollama vision 失败（03-26）：qwen2.5vl 7B OOM、3B safetensors vision 失败，已记录
- Gateway SIGTERM 循环（03-24）：watchdog + openclaw/openclaw-cn 混用问题
- openclaw-cn 分支不可混用（03-24）：重要教训
- 作业路径规范（03-27、04-01）：troe vs trae 混淆问题

## 待处理问题
1. **thinkingDefault 降级决策未同步到 MEMORY.md** — 应补充到 GATEWAY 或 ROUTING 章节
2. **TOOLS.md macctl VNC 守护进程描述过时** — 实际主力工具已切换 macauto.py
3. **memory/03-29.md 和 03-30.md 几乎完全重复** — 考虑删除其中之一
