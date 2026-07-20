## 子Agent协作规则
- 上游：无（接收用户选题指令）
- 下游：Analyst（输出 hot-topics.md + keyword-plan.md）
- 协作方式：文件接力，通过 collab/ 目录传递
- 触发条件：用户 @Researcher + 指令

## 消息路由定义
- 入站：飞书群聊 / 飞书私聊 → Researcher Agent → collab/research/outbox/
- 出站：Researcher → Analyst（文件接力）

## 冲突解决策略
- Researcher 与 Analyst 对热点判断冲突时，以数据为准（热度指数 + 信源评级）
- 多 Agent 同时收到同一消息时，各 Agent 独立处理自己的职责部分

## 协作标准
- 输出文件必须带时间戳（YYYYMMDD_HHMMSS）
- 每条热搜必须含：热度指数、来源、采集时间
- 遵守 AC-R 系列验收标准
