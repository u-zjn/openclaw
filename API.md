# API 文档

> 项目：文案内容创作与发布助手
> 版本：2.0 | 更新日期：2026-07-20

---

## 1. 外部 API

### 1.1 微博热搜 API

| 项目 | 内容 |
|:-----|:------|
| **端点** | `GET https://weibo.com/ajax/side/hotSearch` |
| **鉴权** | 无（公开接口） |
| **请求头** | `User-Agent: Mozilla/5.0 Chrome/120` |
| **频率限制** | 无明确限制，建议 ≥ 5s/次 |
| **用途** | Researcher 采集微博实时热搜榜 |

**返回格式：**
```json
{
  "data": {
    "realtime": [
      {
        "word": "热搜标题",
        "raw_hot": 980000,
        "icon": "boom"
      }
    ]
  }
}
```

**字段说明：**
| 字段 | 类型 | 说明 |
|:-----|:----:|:------|
| `word` | string | 热搜词标题 |
| `raw_hot` | number | 热度指数 |
| `icon` | string? | 标识（`"boom"` = 爆） |

**调用代码：** `skills/hot-researcher/index.ts → fetchWeiboHotSearch()`

---

### 1.2 知乎 API

| 项目 | 内容 |
|:-----|:------|
| **端点** | `POST https://www.zhihu.com/api/v4/articles` |
| **鉴权** | Cookie（需包含 `_xsrf`、`z_c0`、`SESSIONID`） |
| **请求头** | `Content-Type: application/json`、`x-xsrftoken: <_xsrf>`、`x-requested-with: XMLHttpRequest` |
| **用途** | Publisher 发布文章到知乎专栏 |

**请求体：**
```json
{
  "title": "文章标题",
  "content": "<h1>正文HTML</h1><p>...</p>",
  "tags": ["标签1", "标签2"]
}
```

**响应格式：**
```json
{
  "id": 123456789,
  "url": "https://zhuanlan.zhihu.com/p/123456789"
}
```

**错误码：**
| 状态 | 说明 | 处理 |
|:----:|:-----|:-----|
| 200 | 成功 | 返回文章 ID 和链接 |
| 401 | Cookie 过期 | 返回错误提示，需重新获取 |
| 403 | 权限不足 | 检查账号状态 |
| 5xx | 服务端错误 | 自动重试 3 次 |

**调用代码：** `skills/publisher/index.ts → publishToZhihu()`

**凭证文件：** `output/zhihu-credentials.json`
```json
{
  "zhihu": {
    "cookie": "_xsrf=...; z_c0=...; SESSIONID=..."
  }
}
```

---

### 1.3 大模型 API

#### DeepSeek V4 Flash（主力）

| 项目 | 内容 |
|:-----|:------|
| **提供商** | 深度求索 |
| **凭证** | `DEEPSEEK_API_KEY` 环境变量 |
| **用途** | 所有 Agent 的核心推理引擎 |
| **选型理由** | 中文强、1-3s 响应 |

#### Moonshot Kimi（兜底）

| 项目 | 内容 |
|:-----|:------|
| **提供商** | 月之暗面 |
| **凭证** | `MOONSHOT_API_KEY` 环境变量 |
| **用途** | DeepSeek 不可用时的备用模型 |

---

## 2. 内部 Skill API

### 2.1 通用返回格式

所有 Skill 函数统一返回格式：

```typescript
interface SkillResult<T> {
  success: boolean        // 是否成功
  data: T | null          // 业务数据
  error?: string          // 错误信息
  timestamp: string       // ISO 时间戳
}
```

---

### 2.2 hot-researcher

**文件：** `skills/hot-researcher/index.ts`

**主函数：**
```typescript
async function research(input: ResearchInput): Promise<SkillResult<ResearchOutput>>
```

**输入参数：**
| 参数 | 类型 | 必填 | 说明 |
|:-----|:----:|:----:|:------|
| `keyword` | string | ✅ | 选题关键词 |
| `count` | number | ❌ | 返回条数（默认 10） |

**输出字段（`ResearchOutput`）：**
| 字段 | 类型 | 说明 |
|:-----|:----:|:------|
| `hotTopics` | HotTopic[] | 热搜列表（title, heat, source, collectedAt） |
| `keywordPlan` | KeywordPlan | 关键词挖掘（seedWord, relatedKeywords, longTail） |
| `summary` | string | 格式化的热点简报 Markdown |
| `gateStatus` | 'pending' \| 'confirmed' \| 'rejected' | Gate1 选题确认状态 |

**内部函数：**
| 函数 | 可见性 | 说明 |
|:-----|:------:|:------|
| `fetchWeiboHotSearch()` | private | 调用微博热搜 API |
| `mineKeywords(keyword)` | private | 生成关联热词和长尾词 |

---

### 2.3 analyst

**文件：** `skills/analyst/index.ts`

**主函数：**
```typescript
async function analyze(input: AnalystInput): Promise<SkillResult<AnalystOutput>>
```

**输入参数：**
| 参数 | 类型 | 必填 | 说明 |
|:-----|:----:|:----:|:------|
| `hotTopics` | array | ✅ | Researcher 提供的热搜列表 |
| `keywordPlan` | object | ❌ | 关键词挖掘结果 |

**输出字段（`AnalystOutput`）：**
| 字段 | 类型 | 说明 |
|:-----|:----:|:------|
| `commendNotes` | string | 爆款拆解报告 Markdown（标题模式、热度分层 S/A/B/C） |
| `topicSuggest` | string | 选题建议 Markdown |
| `optimization` | string | 内容优化方向 Markdown |

---

### 2.4 writer

**文件：** `skills/writer/index.ts`

**主函数：**
```typescript
async function write(input: WriteInput): Promise<SkillResult<WriteOutput>>
```

**输入参数：**
| 参数 | 类型 | 必填 | 说明 |
|:-----|:----:|:----:|:------|
| `topic` | string | ✅ | 选题主题 |
| `style` | string | ✅ | 正文风格（教程/种草/测评/情感/干货） |
| `analystBrief` | string | ❌ | Analyst 选题建议（可选） |

**输出字段（`WriteOutput`）：**
| 字段 | 类型 | 说明 |
|:-----|:----:|:------|
| `content` | string | 正文 Markdown（≤1000字） |
| `titles` | string[] | 备选标题（3-5个不同风格） |
| `hashtags` | string[] | 话题标签（3-5个） |
| `wordCount` | number | 实际字数 |

**校验函数：**
```typescript
function validateContent(content: string): ContentValidation
```
| 返回字段 | 类型 | 说明 |
|:---------|:----:|:------|
| `valid` | boolean | 是否通过校验 |
| `wordCount` | number | 字数 |
| `errors` | string[] | 错误列表 |

**约束：**
- 正文 ≤ 1000 字
- 段落 ≤ 5 行
- 标题 3-5 个，风格不同
- 标签 3-5 个

---

### 2.5 designer

**文件：** `skills/designer/index.ts`

**主函数：**
```typescript
async function design(input: DesignInput): Promise<SkillResult<DesignOutput>>
```

**输入参数：**
| 参数 | 类型 | 必填 | 说明 |
|:-----|:----:|:----:|:------|
| `title` | string | ✅ | 封面标题 |
| `subtitle` | string | ❌ | 副标题 |
| `style` | string | ✅ | 视觉风格（极简/高对比/渐变/手绘/科技） |

**输出字段（`DesignOutput`）：**
| 字段 | 类型 | 说明 |
|:-----|:----:|:------|
| `coverPath` | string | 封面文件路径 |
| `width` | number | 宽（900px） |
| `height` | number | 高（1200px，3:4比例） |
| `format` | string | 格式（png） |
| `layoutSuggestions` | string[] | 排版建议列表 |

**预设风格：**
| 风格 | 背景 | 文字颜色 |
|:-----|:-----|:--------:|
| 极简 | `#ffffff`→`#f0f0f0` | `#333333` |
| 高对比 | `#ff4444`→`#cc0000` | `#ffffff` |
| 渐变 | `#667eea`→`#764ba2` | `#ffffff` |
| 手绘 | `#fdf6e3`→`#f5e6cc` | `#5a4a3a` |
| 科技 | `#0a0a2e`→`#1a1a4e` | `#00f5ff` |

---

### 2.6 publisher

**文件：** `skills/publisher/index.ts`

**主函数：**
```typescript
async function publish(input: PublishInput): Promise<SkillResult<PublishOutput>>
```

**输入参数：**
| 参数 | 类型 | 必填 | 说明 |
|:-----|:----:|:----:|:------|
| `contentPath` | string | ✅ | 正文文件路径 |
| `tags` | string[] | ❌ | 话题标签列表 |

**输出字段（`PublishOutput`）：**
| 字段 | 类型 | 说明 |
|:-----|:----:|:------|
| `noteId` | string | 文章 ID |
| `editUrl` | string | 编辑链接 |
| `publishedAt` | string | 发布时间 |
| `previewLink` | string | 预览链接 |
| `retries` | number | 重试次数 |

**Gate3 审查（发布前）：**
```typescript
const SENSITIVE_WORDS = ['违规', '违法', '诈骗', '政治', '色情']
```

---

## 3. 协作核心 API

**文件：** `skills/collab-core/types.ts` + `skills/collab-core/pipeline.ts`

### 3.1 消息格式

```typescript
interface CollabMessage {
  id: string              // 消息唯一标识
  from: string            // 来源 Agent
  to: string              // 目标 Agent
  type: 'request' | 'response' | 'event'
  action: string          // 业务语义
  payload: any            // 业务数据
  timestamp: number       // 时间戳
  correlationId?: string  // 关联消息 ID（请求-响应配对）
}
```

### 3.2 消息动作

| Action | 发送方 | 接收方 | 说明 |
|:-------|:------:|:------:|:-----|
| `submit.hotTopics` | Researcher | Analyst | 提交热搜数据 |
| `submit.keywords` | Researcher | Analyst | 提交关键词 |
| `submit.commendNotes` | Analyst | Writer | 提交爆款拆解 |
| `submit.topicSuggest` | Analyst | Writer | 提交选题建议 |
| `submit.content` | Writer | Designer | 提交正文 |
| `submit.content` | Writer | Publisher | 提交正文 |
| `submit.cover` | Designer | Publisher | 提交封面 |
| `response.publishLog` | Publisher | — | 发布结果 |

### 3.3 错误处理

| 函数 | 说明 | 签名 |
|:-----|:------|:------|
| `withTimeout()` | 超时控制 | `(fn, timeoutMs, context?) => T` |
| `withRetry()` | 重试机制（最多3次，退避） | `(fn, options?) => { result, retries }` |
| `CircuitBreaker` | 熔断器（3次失败→60s熔断） | `isOpen() / recordSuccess() / recordFailure()` |
| `degrade()` | 降级服务（失败时返回兜底值） | `(fn, fallback) => T` |
| `DeadLetterQueue` | 死信队列 | `push() / getAll() / count() / clear()` |
| `Transaction` | 事务回滚 | `addStep() / execute() / rollback()` |

---

## 4. 流水线

```
Researcher → Analyst → Writer → Designer → Publisher
```

**协作目录：**
```
collab/{agent}/outbox/{taskId}/
  ├── hot-topics.md        (Researcher)
  ├── keyword-plan.md      (Researcher)
  ├── commend-notes.md     (Analyst)
  ├── topic-suggest.md     (Analyst)
  ├── optimization.md      (Analyst)
  ├── note-content.md      (Writer)
  ├── titles.md            (Writer)
  ├── hashtags.md          (Writer)
  ├── cover.png            (Designer)
  └── publish-log.md       (Publisher)
```

---

## 5. 配置与环境变量

### openclaw.json
| 路径 | 说明 |
|:-----|:------|
| `channels.feishu.accounts` | 5 个飞书 Bot 凭证 |
| `channels.feishu.groupAllowFrom` | 群聊白名单 |
| `channels.feishu.streaming` | `false`（纯文本回复） |
| `agents.list` | 5 个 Agent 配置 |

### 环境变量
| 变量 | 说明 |
|:-----|:------|
| `AGENT_BROWSER_EXECUTABLE_PATH` | agent-browser Chrome 路径 |
| `DEEPSEEK_API_KEY` | DeepSeek API Key |
| `MOONSHOT_API_KEY` | Moonshot API Key |
| `TAVILY_API_KEY` | Tavily 搜索 API Key |
