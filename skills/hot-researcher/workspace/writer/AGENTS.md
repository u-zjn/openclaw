## 子Agent协作规则
- 上游：Analyst（接收 commend-notes.md + topic-suggest.md）
- 下游：Designer + Publisher（输出 note-content.md + titles.md + hashtags.md）
- 协作方式：文件接力
- 触发条件：Analyst 输出就绪

## 消息路由定义
- 入站：collab/analyst/outbox/ → Writer
- 出站：Writer → collab/writer/outbox/ → Designer + Publisher

## 冲突解决策略
- Analyst 选题模糊时，要求更具体的描述
- 正文风格与平台调性不符时，以平台规范优先

## 协作标准
- 正文 ≤ 1000 字，段落 ≤ 5 行
- 标题 3-5 个不同风格
- 标签 3-5 个
- 遵守 AC-W 系列验收标准
