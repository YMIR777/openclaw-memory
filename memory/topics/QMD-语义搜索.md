# 本地语义搜索系统（QMD）

## 当前方案（QMD，2026-03-24 完成）
- **backend**: qmd（openclaw.json memory.backend）
- **searchMode**: query
- **索引**: 620 向量，213 文件，~/.cache/qmd/index.sqlite
- **模型**: embeddinggemma + Qwen3-Reranker + qmd-query-expansion（2.1GB 全在 ~/.cache/qmd/models/）
- **GPU**: Apple M1 Metal，11.8GB VRAM
- **状态**: ✅ 已完成

## 目标
不依赖任何远程 API key，实现记忆的语义搜索能力。

## OpenClaw memorySearch 配置
```json
"agents": {
  "defaults": {
    "memorySearch": {
      "enabled": true,
      "provider": "openai",
      "model": "nomic-embed-text",
      "fallback": "none",
      "remote": {
        "baseUrl": "http://localhost:11434/v1"
      },
      "sources": ["memory", "sessions"]
    }
  }
}
```

## ⚠️ openclaw-cn 不支持 provider: "ollama"
- openclaw-cn 的 config 验证层拒绝 `provider: "ollama"`（报错 Invalid input）
- **正确绕过**：用 `provider: "openai"` + `remote.baseUrl` 指向 Ollama 的 OpenAI 兼容端点
- Ollama 的 `/v1/embeddings` 接口完全兼容 OpenAI embedding API

## env.vars 需要占位 API key
```json
"env": {
  "vars": {
    "OPENAI_API_KEY": "ollama-local"
  }
}
```
OpenClaw 要求 embedding provider 必须有 apiKey，即使 Ollama 不验证。

## 验证命令
```bash
openclaw memory status --deep     # 查看 provider/索引状态
openclaw memory index --force     # 强制重建索引
openclaw memory search "查询内容"  # 测试语义搜索
```

## 已知限制
- batch 批量上传 API Ollama 不支持（报 404），会自动回退到非批量模式
- 向量维度：768（nomic-embed-text 固定）

## 🚨 严重故障（2026-03-25 03:03 发现）

**问题**：QMD 完全失效，`openclaw memory search` 返回空结果

**症状**：
```
[memory] qmd collection add failed: 
Module not found "/Users/Ymir/.bun/install/global/node_modules/@tobilu/qmd/dist/cli/qmd.js"
Indexed: 0/14 files · 0 chunks
```

**根因**：qmd 从源码安装，缺少编译后的 `dist/cli/qmd.js`
- `bin/qmd` 脚本检查 bun.lock 后执行 `dist/cli/qmd.js`
- 但 dist/ 目录不存在

**修复方案**：待处理

## 索引状态
- 56/56 文件，94 chunks，Dirty: no（历史记录）
- **当前状态**：0/14 files · 0 chunks（2026-03-25 故障后）

## 2026-03-25 优化参数
- `memorySearch.query.maxResults`: 8
- `memorySearch.query.minScore`: 0.3
- `memorySearch.sync.deltaBytes`: 10000
- `memorySearch.sync.deltaMessages`: 10
- `memoryFlush.softThresholdTokens`: 2000
- `memorySearch.experimental.sessionMemory`: true
