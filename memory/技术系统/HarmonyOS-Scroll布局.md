---
title: HarmonyOS 内容溢出处理
---

# Scroll 组件解决内容溢出

## 问题
内容超出屏幕高度，底部按钮和信息看不见。

## 解决
用 `Scroll()` 包裹内容：

```typescript
build() {
  Scroll() {
    Column() {
      // 所有内容
    }
    .width('100%')
  }
  .width('100%')
  .height('100%')
}
```

## 关键点
- `Scroll()` 要设置 `height('100%')`
- 内部 `Column()` 不需要 `height('100%')`
- 底部加 `.margin({ bottom: 40 })` 防止贴边

## 来源
2026-04-17 学生点名系统项目