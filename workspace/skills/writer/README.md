# writer — 笔记创作 Skill

## 功能
基于选题建议生成完整的图文内容（正文+标题+标签），适配平台规范。

## 输入
- topic: string — 选题/主题
- style: string — 正文风格（教程/种草/测评/情感/干货）
- analystBrief?: string — Analyst 选题建议（可选）

## 输出
- note-content.md — 图文正文（≤1000字）
- titles.md — 备选标题（3-5个不同风格）
- hashtags.md — 话题标签（3-5个）

## 约束
- 正文 ≤ 1000 字，段落 ≤ 5 行
- 标题风格多样：数字型、悬念型、反问型、对比型
- 标签包含领域标签 + 流量标签 + 场景标签
