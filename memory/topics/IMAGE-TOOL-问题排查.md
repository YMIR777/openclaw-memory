# image 工具问题排查（2026-03-26）

## 最终状态：✅ 已解决

MiniMax VL 正常工作，image 工具已配置完成。

## 解决过程

### 问题 1：image 工具路由到 ollama 而非 minimax
- **现象**：报错 "No media-understanding provider registered for ollama"
- **根因**：
  - `OPENAI_API_KEY=ollama-local` → image 工具默认 fallback 到 ollama
  - `imageModel` 配置是 dict 格式时 patch 解析异常
  - `models.providers.ollama` 存在导致 fallback 链到达 ollama

### 解决方案
1. `config.patch` 添加 `MINIMAX_API_KEY` 环境变量（Coding Plan key）
2. `config.patch` 设置 `agents.defaults.imageModel.primary = "minimax/MiniMax-VL-01"`（字符串格式）
3. **删掉 `models.providers.ollama`** → 关键！让 fallback 链无法到达 ollama
4. Gateway 重启后生效

### 配置内容（最终）
```json
{
  "env": {
    "vars": {
      "MINIMAX_API_KEY": "sk-cp-uYnOWm63FbNSp7AJbq5NbZUOBFSIcV94xwt0DAa_4JbUiqI1Tvk2wdseajM9pFSiGZZcanCO-FTXI4CaQyGeOOwFOSu-Da9ZoPbkyjUw8VWOHvpStrp0NIM"
    }
  },
  "agents": {
    "defaults": {
      "imageModel": "minimax/MiniMax-VL-01"
    }
  }
}
```

## 相关代码路径
- `resolveImageFallbackCandidates` → `resolveImageModelConfigForTool` → `hasToolModelConfig`
- `isMinimaxVlmProvider("minimax")` → MiniMax VL `/v1/coding_plan/vlm` 端点
- `models/providers/ollama` 存在时，即使 imageModel 配置正确，fallback 链也会先尝试 ollama

## 关键教训
- 工具连续失败时必须停下来，不能猜测内容继续做
- 排查问题要看根因，不能只看表面错误信息
- OpenClaw 配置要保持简洁，多余的 provider 可能干扰工具行为
