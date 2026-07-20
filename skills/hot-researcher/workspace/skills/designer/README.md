# B站封面设计 Skill — designer

## 功能
生成 3:4 竖版封面图（适配B站图文/小红书），支持文字叠加。

## 输入
- title: string — 标题文字（封面主文案）
- subtitle?: string — 副标题（可选）
- style: string — 视觉风格（极简/高对比/渐变/手绘/科技）

## 输出
- cover.png — 3:4 竖版封面图（宽 900 x 高 1200 px）

## 依赖
- image-generator skill — SVG/PNG 生成
- DeepSeek LLM — 配色方案 / 字体推荐
