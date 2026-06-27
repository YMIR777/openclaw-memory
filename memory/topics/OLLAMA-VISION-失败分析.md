# Ollama Vision 模型探索失败分析（2026-03-26）

> Freshness review: 2026-06-27 — 这页记录的是 2026-03 的失败路径与架构判断。结论“当时本地 Ollama vision 不可行”在历史上成立，但是否仍成立，应以当前 Ollama 版本和对应 issue 状态重新验证。

## 结论：Ollama 本地 Vision 暂时不可行

### 尝试过的方案

#### 方案 1：Ollama 官方 pull（失败）
- **qwen2.5vl:7b**（6GB）：下载完成后测试，vision 模式报 500 错误 "model runner unexpectedly stopped"
- 根因：16GB RAM 跑 7B vision 不够用，OOM 崩溃
- 下载时间：约 30 分钟（CDN 速度不稳定，5KB/s - 10MB/s）

#### 方案 2：ModelScope safetensors 导入 Ollama（失败）
- 下载 Qwen2.5-VL-3B-Instruct（2 个 safetensors 文件，共 7GB）
- 用 `ollama create` + Modelfile 导入
- **问题 1**：Ollama 导入外部 GGUF/safetensors 时，把融合 vision 的文件错误识别为纯 projector，manifest 不包含正确的 vision layer
- **问题 2**：Ollama 0.18.2 存在已知 bug（#10719）：vision 融合模型导入时 projector 层处理错误
- 结果：文本功能正常，vision 报 500 "model runner unexpectedly stopped"

#### 方案 3：下载 mmproj 文件 + Modelfile 配置（失败）
- 从 HuggingFace 下载 mmproj-fp16.gguf（1.2GB）
- 在 Modelfile 中使用 `mmproj /path/to/file` 参数
- **问题**：Ollama Modelfile 不支持 `mmproj` 命令（支持的只有 FROM/LICENSE/TEMPLATE/SYSTEM/ADAPTER/RENDERER/PARSER/PARAMETER/MESSAGE/REQUIREDS）
- 结果：Modelfile 解析失败

#### 方案 4：llama.cpp 转换（未实施）
- HimariO 的 qwen2.5vl 专用 llama.cpp fork 可以把 safetensors 转成融合 GGUF
- 需要：编译 llama.cpp → 用转换脚本处理 safetensors → 生成的融合 GGUF 才能被 Ollama 使用
- 代价：复杂、耗时、可能还需要更多调试
- 结论：性价比极低，暂不实施

### 根因总结

**Ollama vision 模型的 vision tower（mmproj）必须融合在单个 GGUF 文件里**，这是 Ollama vision 架构的设计限制。

- 官方 qwen2.5vl 模型包（`ollama pull` 下载的）是预融合的，单个文件包含 text + vision
- ModelScope/HuggingFace 下载的 safetensors 是分片的（text 模型权重 + vision 权重分离），导入 Ollama 时无法正确融合
- 即使下载了独立的 mmproj GGUF 文件，Ollama 也不支持在 Modelfile 中单独指定 mmproj

### 关键链接
- Ollama vision 融合模型导入 bug：[#10719](https://github.com/ollama/ollama/issues/10719)
- Gemma3/llama3.2-vision/qwen2.5vl 都有相同问题
- HimariO qwen2.5vl 转换 fork：[github.com/HimariO/llama.cpp.qwen2.5vl](https://github.com/HimariO/llama.cpp.qwen2.5vl)
- mradermacher Qwen2.5-VL-3B-Instruct GGUF（含 mmproj）：[HF 链接](https://huggingface.co/mradermacher/Qwen2.5-VL-3B-Instruct-GGUF)

## 当前可用方案

| 方案 | 状态 | 说明 |
|------|------|------|
| MiniMax VL（Coding Plan） | ✅ 正常工作 | image 工具主力，OCR/截图识别效果好 |
| Ollama qwen2.5vl 文本 | ✅ 可用 | `ollama run qwen2.5vl:3b` 纯文本聊天 |
| Ollama 本地 vision | ❌ 暂不可行 | 需等待 Ollama 修复 #10719 |

## 清理记录（2026-03-26）
- 删除了 `qwen2.5vl:3b`（Ollama model entry）
- 删除了 `~/.ollama/models/qwen2.5vl-3b/` 目录
- 删除了 `~/.ollama/models/qwen2.5vl-3b-mmproj/` 目录
- 删除了相关 blobs（3.7GB + 3.3GB）
- 删除了 `/tmp/mmproj-fp16.gguf`
- 删除了 `/tmp/model_download/`（ModelScope 缓存）
- 删除了 `~/.ollama-venv/`（Python venv）
- 保留了 `nomic-embed-text:latest`（文本嵌入模型）

## 建议
1. **继续用 MiniMax VL**作为图片识别主力，完全够用
2. 等 Ollama CDN 恢复后（速度快的时候），直接 `ollama pull qwen2.5vl:3b`，这是最简单可靠的方案
3. 如果需要更强的本地 vision，可以考虑 llama.cpp + qwen2.5vl 融合方案，但需要额外配置
