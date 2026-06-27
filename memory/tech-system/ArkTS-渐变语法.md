---
title: ArkTS 渐变语法踩坑
---

# ArkTS 渐变语法踩坑记录

## 错误写法
```typescript
.linearGradient({
  direction: GradientDirection.LeftToRight,  // ❌ 报错！不存在
  colors: [['#667EEA', 0], ['#764BA2', 1]]
})
```

## 正确写法
```typescript
.linearGradient({
  angle: 90,  // ✅ 从左到右
  colors: [['#667EEA', 0], ['#764BA2', 1]]
})
```

## 角度对照
| 效果 | angle 值 |
|------|---------|
| 左→右 | 90 |
| 上→下 | 180 |
| 对角线 | 45 |
| 右→左 | 270 |

## 来源
2026-04-17 学生抽奖系统项目