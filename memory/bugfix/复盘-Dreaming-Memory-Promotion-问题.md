# 复盘：Dreaming Memory Promotion 问题

> 日期：2026-04-25

## 问题背景

用户发现 Control UI 的 Dreaming 面板显示 0 条记录，怀疑 Dreaming 没有正常运行。

## 问题诊断过程

### 1. Dreaming 实际运行状态

```
✅ Dreaming 功能开启
✅ Cron job 每天凌晨 3 点运行
❌ 但 candidates=0, applied=0
```

日志显示连续 8 天（04-17 到 04-24）promotion 结果都是 0。

### 2. 根因分析

#### 根因 1：Issue #71030 — diff 格式 bug

| 位置 | 内容 |
|------|------|
| recall store | `@@ -3,4 @@ (2 before, 31 after) - Bob asked me to...` |
| 原始文件 | `- Bob asked me to upgrade OpenClaw on Win11-node001...` |

`rehydratePromotionCandidate()` 找不到匹配 → candidate 被静默跳过

**Issue 信息：**
- 提交时间：2026-04-24（昨天）
- 状态：open
- 影响：所有用户都遇到相同问题

#### 根因 2：recallCount=0

即使修复 diff bug，候选的 recallCount 全部是 0，导致 promotion 门槛无法通过。

#### 根因 3：阈值太高

| 阈值 | 默认值 | 你的数据 |
|------|--------|----------|
| minScore | 0.800 | 最高 0.668 |
| minRecallCount | 3 | 最高 1 |
| minUniqueQueries | 3 | 最高 1 |

三重条件同时满足几乎不可能。

## 解决方案

### 方案 1：降低阈值 promotion（官方 CLI）

```bash
openclaw memory promote --apply --limit 10 --min-score 0.8 --min-recall-count 1 --min-unique-queries 1
```

**结果**：仍失败 — recallCount=0 是硬伤

### 方案 2：手动写入 MEMORY.md（Workaround）

对于有价值的记忆，直接追加到 MEMORY.md：

```bash
cat >> ~/.openclaw/workspace/MEMORY.md << 'EOF'
## 📱 OpenHarmony 学生抽奖系统
> Promotion 日期：2026-04-25（手动）
...
EOF
```

**结果**：✅ 成功

## 关键发现

1. **GitHub API vs 网页**：web_fetch 访问 GitHub 用 API（`api.github.com`）不需要登录，网页版（`github.com`）需要
2. **recallCount=0 bug**：短期记忆库的 recallCount 字段全部为 0，导致 promotion 失败
3. **阈值硬编码**：minScore/minRecallCount/minUniqueQueries 在 memory-core 插件内部硬编码，不提供用户配置

## 经验教训

| 问题 | 教训 |
|------|------|
| Dreaming 显示 0 | 不一定是功能关闭，可能是 bug 导致无输出 |
| 官方默认值不一定合理 | minScore=0.8 对普通用户太高 |
| 手动 workaround 有效 | 当自动化失败时，直接操作文件是最可靠的 |
| GitHub Issue 是宝库 | 用 API 搜索比网页更快更可靠 |

## 相关文档

- `memory/topics/BUGFIX-GitHub-API-连接问题.md`
- `memory/topics/OPENCLAW-Dreaming污染DailyLogs.md`
- GitHub Issue #71030

## 待解决

- [ ] 等官方修复 Issue #71030
- [ ] 调查 recallCount=0 的根因
- [ ] 考虑降低 promotion 阈值到合理水平
