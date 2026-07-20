# analyst — 选题分析 Skill

## 功能
接收 Researcher 热点简报 → 爆款拆解 → 热度分层（S/A/B/C）→ 选题建议 → 输出给 Writer

## 输入
- hotTopics: array — Researcher 提供的热搜列表
- keywordPlan?: object — 关键词挖掘结果（可选）

## 输出
- commend-notes.md — 爆款拆解报告（标题模式、封面风格、正文结构、标签组合）
- topic-suggest.md — 选题建议（含热度评级 S/A/B/C）
- optimization.md — 内容优化方向（开头钩子、段落结构、标签策略）

## 协作流程
```
Researcher → Analyst → Writer
   (热点数据)   (选题策略)   (内容创作)
```

## 验收标准
- AC-R2：热点分析 → 输出 commend-notes.md
