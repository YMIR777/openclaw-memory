# Pretext 文字排版引擎 — 知识资产

> 2026-05-26 | I MISS U 项目 6 次迭代总结

## 基础信息
- 包：`@chenglou/pretext@0.0.3`
- CDN：`https://cdn.jsdelivr.net/npm/@chenglou/pretext@0.0.3/dist/layout.js`
- 导出：`{ prepare, layout }`
- 仓库：https://github.com/chenglou/pretext

## 核心 API

```js
import { prepare, layout } from '@chenglou/pretext/dist/layout.js';

// prepare(text, font) — 预排版文字，返回准备好的字符串（带换行等）
const prepared = prepare('语语 I MISS U', '18px "Songti SC",serif');

// layout(text, layoutOpts) — 将文字布局到 Canvas
// 返回: { width, height, lines }
const result = await layout(prepared, {
  width: 400,
  height: 600,
  fontSize: 14,
  lineHeight: 1.5,
  // ... 更多选项
});
```

## 适用场景

| 场景 | 适用 | 说明 |
|------|------|------|
| 文字网格肖像 | ⚠️ 有限 | 文字太小看不清，纯网格效果差 |
| 文字排版引擎 | ✅ 原生用途 | 单行/多行布局，换行计算 |
| 文字测量 | ✅ 好使 | `prepare()` 后 `ctx.measureText()` 取宽度 |
| Canvas 文字贴图 | ✅ | 配合 `globalCompositeOperation` 做混合效果 |
| 字体回退检测 | ✅ | `prepare()` 不抛异常 = 字体可用 |

## 踩过的坑

### 1. ⚠️ 文字当像素 vs 文字当信息
**核心矛盾**：文字做成像素（text-as-pixel）需要足够小才能形成图像 → 太小则不可读 → 太大则遮脸。
**结论**：不要在纯文字肖像上花时间，这条路走不通。

### 2. ✅ 控制台消除翻译层
用户直接拖动滑块调参 > 我转述"把 threshold 从 0.65 调到 0.78"。
每条预设参数都应用 `Ctrl+T` / 齿轮按钮打开控制台。

### 3. ✅ Ghost Photo + Fog 是最佳组合
照片始终可见（自然色彩，不过度滤镜），文字层是可交互的"雾"而非"覆盖物"。
`globalCompositeOperation: 'overlay'` 做氛围叠加，不破坏照片。

### 4. ⚠️ 字体加载时机
- Google Fonts 的 `@import` 在 `<style>` 内可能失败
- `document.fonts.ready.then()` 等待字体加载后再做文字测量
- 设置 3 秒 fallback：`setTimeout(() => { if (!ready) buildMetrics(); }, 3000)`

### 5. ⚠️ 不要过度滤镜照片
`saturate(0.25) brightness(0.9)` → 遗照效果。照片应保持自然色彩，氛围通过 overlay 叠加实现。

## 控制台模板代码（可复用片段）

```html
<!-- 固定位置面板 + 齿轮按钮 -->
<div class="control-panel" id="controlPanel">
  <div class="param-group">
    <div class="param-label"><span>参数名</span><span class="param-value" id="valX">0.50</span></div>
    <input type="range" id="sliderX" min="10" max="100" value="50" step="1">
  </div>
  <button id="btnReset">Reset</button>
  <button id="btnExport">Copy params</button>
</div>
```

```js
// 滑块绑定 + 导出 JSON
sliders.forEach(s => {
  document.getElementById(s.id).addEventListener('input', () => {
    params[s.param] = parseInt(el.value) / 100;
    ve.textContent = params[s.param].toFixed(2);
  });
});
document.getElementById('btnExport').addEventListener('click', () => {
  navigator.clipboard.writeText(JSON.stringify(params, null, 2));
});
```

## 最佳实践

1. **先建控制台，再调参** — 省掉来回传话的时间
2. **照片保持自然色** — 滤镜叠加在 overlay 模式，不直接改照片
3. **文字可见靠 shadowBlur** — 白色柔光描边让字在任何背景下可读
4. **交互 > 静态** — "拨开"比"覆盖"有情感温度
5. **参数 JSON 存档** — `/saved-params.json` 随时可复现
