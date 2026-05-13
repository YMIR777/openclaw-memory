# GitHub API 连接问题修复

> 记录日期：2026-04-25

## 问题描述

web_fetch 工具无法访问 GitHub 网页（需要登录），但 GitHub API 可以正常访问。

## 根因分析

### GitHub 认证状态
- `gh auth status`: ✅ 已登录（keyring 存储）
- `gh auth token`: ✅ Token 正常（ghp_9jhsq4j7YGy...）
- `GITHUB_TOKEN` 环境变量: ❌ 为空（长度 0）

### Git Credential 配置
```
~/.zshrc 里已有: export GITHUB_TOKEN=ghp_9jhsq4j7YGy...
但 exec 工具启动的新 shell 不会自动 source ~/.zshrc
```

### GitHub Issues 网页 vs API
| 访问方式 | 结果 |
|----------|------|
| `github.com/.../issues` (网页) | ❌ 需要登录 |
| `api.github.com/repos/...` (API) | ✅ 正常访问 |

## 解决方案

**用 GitHub API 代替网页搜索**

```bash
# 搜索 issues
curl -s "https://api.github.com/search/issues?q=repo:openclaw/openclaw+memory+dreaming"

# 获取单个 issue
curl -s "https://api.github.com/repos/openclaw/openclaw/issues/71030"

# 获取仓库信息
curl -s "https://api.github.com/repos/openclaw/openclaw"
```

## 验证

GitHub API 测试结果：
- ✅ Issues 搜索正常
- ✅ 仓库信息获取正常
- ✅ Git credential git-credential 工具工作正常

## 关键发现

OpenClaw workspace 里配置的 `GITHUB_TOKEN` 是 `github_pat_...` 格式，而 gh 命令使用的是 `ghp_...` 格式。两者都是 Personal Access Token，只是前缀不同。

## 相关 Issue

**Issue #71030** — Dreaming deep promotion bug（2026-04-24 提交）
- **标题**: Dreaming deep promotion: candidates ranked but never promoted due to diff-format snippets
- **根因**: short-term-recall.json 存储 diff 格式，rehydrate 匹配失败
- **状态**: open

**双重问题导致 Dreaming 0 输出：**
1. diff 格式导致 rehydrate 失败（issue #71030）
2. recallCount=0 导致 promotion 门槛无法通过

**Workaround**: 手动 promotion
```bash
openclaw memory promote --apply --limit 10 --min-score 0.8 --min-recall-count 1 --min-unique-queries 1
```
如果 recallCount=0，用手动写入 MEMORY.md 代替

## 相关配置

- gh 已配置 git credential helper: `credential.helper=!/opt/homebrew/bin/gh auth git-credential`
- ~/.zshrc 有 export GITHUB_TOKEN 但需要 source 才能生效
