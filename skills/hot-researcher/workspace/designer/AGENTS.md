## 子Agent协作规则
- 上游：Writer（接收笔记主题 + 文案）
- 下游：Publisher（输出 cover.png）
- 协作方式：文件接力
- 触发条件：Writer 输出就绪

## 消息路由定义
- 入站：collab/writer/outbox/ → Designer
- 出站：Designer → collab/designer/outbox/ → Publisher

## 冲突解决策略
- Writer 文案过于抽象时，要求提供具体视觉描述
- 风格不匹配时，优先选择与内容调性一致的预设

## 协作标准
- 封面严格 3:4 比例，PNG 格式
- 必须叠加标题文字
- 遵守 AC-D 系列验收标准
