# Dr. Sharp — 产品设计文档 v2

> 创建：2026-05-26 | 最后更新：2026-06-12
> **v2 重大变更：架构从 3D (R3F) pivot 到 2D (Framer Motion + preText)**
> 详见 BRAIN.md §Pivot 记录

---

## 一、产品定位

**一句话：** 小黒记录、回看、筛选 Dr. Sharp 分析内容的阅读体验应用。

**核心功能（按优先级）：**
1. **分析展示与阅读**（MVP）— 横向卡片浏览 + 标签筛选 + 搜索 + 沉浸式详情阅读
2. **语音助手**（V2）— 说出困扰 → Dr. Sharp 分析 → TTS 朗读
3. **创作工具**（V2）— 与 Sharp 讨论的空间，记录自己的思考

---

## 二、技术选型

| 层面 | 选择 | 原因 |
|------|------|------|
| **动画/交互** | Framer Motion | Spring 物理、拖拽手势、AnimatePresence、layoutId |
| **文本排版** | @chenglou/pretext | 精确文本测量、不触发 reflow、行数/高度预计算 |
| **卡片滚动** | CSS scroll-snap | 原生吸附、浏览器区分滚/点、零依赖 |
| **前端框架** | React + Vite | 轻量、快速 |
| **字体** | Geist (UI) + Georgia (正文) | design-taste 规则 + 中文阅读习惯 |
| **设计纪律** | design-taste-frontend | 工程规则全用，审美规则挑用 |

**不使用：** R3F、Three.js、@react-three/postprocessing、@react-spring/three（2026-06-11 pivot 决定移除）

---

## 三、主页面设计

### 布局
- **横向卡片流**：分析卡片横向排列，CSS scroll-snap 居中吸附
- **交互**：手指左右滑动 / 鼠标滚轮 / 触控板 / 键盘 ← →
- **焦点卡**：snap 到中心的卡片 1.04× 放大 + 暖金描边 + 更深阴影
- **页码指示器**：底部显示 `#编号 · 圆点 · 日期` 三列信息

### 其他元素
- **搜索框**：顶部居中，玻璃态（backdrop-blur），搜索标题/标签/编号
- **标签云**：搜索框下方，横向 pill 标签，选中高亮暖金色，点击筛选
- **空状态**：搜索/筛选无结果时显示优雅提示

### 交互细节
- 点击卡片 → spring 放大淡入详情页（Framer Motion AnimatePresence）
- 标签切换 → 卡片筛选动画（Framer Motion layoutId）
- ESC / 点击背景 → 关闭详情页

### 色彩
- **背景**：`#1a1815` 深暖色（毛毡/桌面质感），叠加微弱径向渐变光晕
- **卡片**：`#f5efe6` 暖白纸色，与背景形成温差
- **点缀**：`#bfa060` 暖金，仅用于焦点态/选中态/分割线
- **文字**：`#26211b`（正文）、`#a89880`（元信息）、`#7a6e5e`（次要）

---

## 四、笔记详情页

### 过渡动画
Framer Motion spring：卡片从小放大 + 淡入 + 背景模糊（backdrop-blur）

### 内容区
- **preText 排版**：`prepare()` + `layout()` 预计算文本行数和高度
- **DOM 渲染**：段落级 `<p>` 标签，Georgia + Noto Serif SC 字体
- **排版参数**：16px / 行高 1.8 / 段间距 0.8em / 后续段首行缩进 2em
- **段落交互**：悬停微高亮（替代水波纹——更适合安静深读）
- **底部统计**：显示行数 + "preText 排版"标注

### 待开发
- 波浪形边框（2D SVG filter /CSS clip-path 实现）
- 内联标签徽章（preText rich-inline）
- TTS 语音朗读 + 自动滚动（V2）

---

## 五、数据层

所有条目统一类型，支持未来扩展：
```
条目 { id, type: 'analysis' | 'voice_session' | 'creation',
        title, date, tags[], content, metadata: {...} }
```

当前数据源：`src/data/analyses.js`（8 篇分析，#003 ~ #010）

---

## 六、MVP 进度

### ✅ 已完成
- [x] 项目脚手架（Vite + React）
- [x] 横向卡片轮播（CSS scroll-snap + 焦点指示器）
- [x] 卡片组件（纸质感 + 3D tilt + 焦点/悬停/长按预览）
- [x] 玻璃态搜索栏
- [x] 标签云筛选
- [x] 详情页 Overlay（spring 放大淡入 + 动态波浪边框）
- [x] preText 文字排版
- [x] Geist + Georgia 字体体系
- [x] 暖白配色 + 暖光带 + SVG 噪点纹理
- [x] 空状态提示
- [x] 键盘快捷键（/ 聚焦搜索、Esc 关闭、← → 切换卡片）
- [x] 每日一句（随机 5 条金句淡入）
- [x] 全量分析导入（13 篇 56KB 自动高亮标记）

### 🔲 本轮开发
- [ ] 深色主题（CSS 变量 + 切换 + 系统跟随）
- [ ] 精炼/完整/仅高亮 三种阅读模式
- [ ] 段落交互（点击→高亮/标注/复制）
- [ ] 阅读进度 + 已读/未读标记
- [ ] 统计面板（共 X 篇 · Y 个洞察 · 跨越 Z 天）
- [ ] 导出（图片卡片 + PDF）
- [ ] 卡片排序（按日期/标签）
- [ ] 关于页

### 🔮 V2
- [ ] Dr. Sharp AI 对话（OpenClaw sessions API）
- [ ] TTS 朗读（edge-tts → Kokoro → VoxCPM 渐进）
- [ ] PWA + 移动端适配
- [ ] 时间线视图
- [ ] 文件夹监听自动导入

---

## 七、开发原则

### Karpathy 四原则
1. Think Before Coding — 本文档 + BRAIN.md
2. Simplicity First — MVP 做展示器，预留接口
3. Surgical Changes — 每次一个功能，不改无关文件
4. Goal-Driven Execution — 每步可验证

### design-taste-frontend 工程规则
- `min-h-[100dvh]` 不用 `h-screen`
- 动画只动 `transform` / `opacity`（Framer Motion 默认保证）
- 效果层 `pointer-events-none`
- 全覆盖交互状态（loading/empty/error）
- 字体：Geist（UI）/ Georgia（正文）/ 不用 Inter

### 审美豁免
- 禁纯黑 → 豁免（`#1a1815` 非纯黑，深暖色有设计意图）
- 禁外发光 → 豁免（焦点卡暖金描边是功能需要）

---

## 八、下一步

1. **视觉氛围**：背景纹理 + 暖光渐变
2. **卡片微交互**：悬停 tilt + 更强焦点态
3. **详情页增强**：preText 内联标签 + 波浪边框
