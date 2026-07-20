## 子Agent协作规则
- 上游：Researcher（接收 hot-topics.md + keyword-plan.md）
- 下游：Writer（输出 commend-notes.md + topic-suggest.md + optimization.md）
- 协作方式：文件接力
- 触发条件：Researcher 输出就绪

## 消息路由定义
- 入站：collab/research/outbox/ → Analyst
- 出站：Analyst → collab/analyst/outbox/ → Writer

## 冲突解决策略
- Researcher 数据有疑问时，要求补充采集
- 选题评级冲突时，以 Analyst 的 S/A/B/C 分层为准

## 协作标准
- 爆款拆解必须含：标题模式、封面风格、正文结构、标签组合
- 选题建议必须含热度评级
- 遵守 AC-R2 验收标准
