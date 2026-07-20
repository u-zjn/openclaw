## 子Agent协作规则
- 上游：Writer + Designer（接收 note-content.md + cover.png）
- 下游：无（最终输出 publish-log.md）
- 协作方式：文件接力
- 触发条件：Writer + Designer 输出均就绪

## 消息路由定义
- 入站：collab/writer/outbox/ + collab/designer/outbox/ → Publisher
- 出站：Publisher → collab/publisher/outbox/（发布日志）

## 冲突解决策略
- 文案含敏感词 → 拦截并报错，不发布
- 封面比例不符 → 要求 Designer 重新生成
- API 失败 → 自动重试 3 次，仍失败则降级为草稿

## 协作标准
- 发布前 Gate3 审查：字数、封面比例、标签数量、敏感词
- 发布后输出 publish-log.md
- 遵守 AC-P 系列验收标准
