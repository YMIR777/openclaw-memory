# Checklist: GitHub Workflow

> 踩坑记录：子 agent 硬编码 PAT + PAT 缺 repo scope = 403 反复出现

## ✅ 正确做法

**所有 GitHub 操作都用 `gh` CLI：**
```bash
# 创建 repo
gh repo create <name> --public --source <dir> --push

# 查看 repo
gh repo view

# git push/pull — git 自动用 GITHUB_TOKEN env（credential.helper=env）
git push  # 不需要传 token
```

**gh 认证走 keychain，不需要 token 环境变量：**
- `gh auth login` → 认证信息存 macOS keychain
- `git push` → 读取 `GITHUB_TOKEN` 环境变量（credential.helper=env）

## ❌ 禁止做法

- **禁止**在 curl 命令里硬编码 PAT：`curl -H "Authorization: token <PAT>"` → 403
- **禁止**在脚本/agent prompt 里写死 token
- **禁止**调 GitHub REST API（除非 gh CLI 明确无法完成）

## 子 Agent 传参规则

Spawn 子 agent 做 GitHub 操作时：
- 使用 `$GITHUB_TOKEN` 环境变量（父进程会传递）
- **不要**在 task 描述里写 PAT
- 让子 agent 自己 `gh auth status` 确认认证状态
