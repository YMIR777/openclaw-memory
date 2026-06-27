# 🖋 方案 B：墨迹心象（Rorschach Ink Blot）— 待实现

## 隐喻
标签在暗色背景上对称展开，像罗夏墨迹测试——心理学最经典的视觉符号。

## 核心视觉
- 标签以有机、流淌的、略微对称的墨迹形态在暗色背景上呈现
- 频次越高的标签扩散越大，像墨滴入水
- 使用 CSS filter: blur() + contrast() 叠加创造墨迹边缘效果
- 暖金色/琥珀色调

## 交互
- 鼠标移过 → 墨迹微微扩散波动（SVG displacement filter）
- 点击 → 墨迹凝固成形，筛选卡片
- 双击 → 墨迹重新扩散，展示所有标签

## 技术方案
- SVG filter 链：feTurbulence → feDisplacementMap → feGaussianBlur → feColorMatrix 创造有机墨迹边缘
- 标签文字叠加在墨迹上方
- 对称布局：每个标签在中心轴左右各有一个墨滴形状，大小不同
- 动画：墨迹从中心向外扩散，像一滴墨落入水面

## 状态
已记录，后续实现
