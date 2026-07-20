/**
 * analyst — 分析 Agent
 * 职责：接收 Researcher 热点简报 → 爆款拆解 → 选题建议 → 输出给 Writer
 */

import { SkillResult, timestamp } from './types'

export interface AnalystInput {
  hotTopics: any[]
  keywordPlan?: any
}

export interface AnalystOutput {
  commendNotes: string    // commend-notes.md
  topicSuggest: string    // topic-suggest.md
  optimization: string    // optimization.md
}

export async function analyze(input: AnalystInput): Promise<SkillResult<AnalystOutput>> {
  console.log(`[analyst] 开始分析: ${input.hotTopics?.length || 0} 条热点`)

  try {
    const commendNotes = generateCommendNotes(input)
    const topicSuggest = generateTopicSuggest(input)
    const optimization = generateOptimization(input)

    return {
      success: true,
      data: { commendNotes, topicSuggest, optimization },
      timestamp: timestamp()
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`[analyst] 分析失败: ${msg}`)
    return { success: false, data: null, error: msg, timestamp: timestamp() }
  }
}

function generateCommendNotes(input: AnalystInput): string {
  return `# 爆款拆解报告

## 标题模式分析
- 数字型：含具体数字，如"3个方法""7天入门"
- 悬念型：制造好奇心缺口
- 痛点型：直击用户焦虑

## 热度分层
${(input.hotTopics || []).slice(0, 5).map((t, i) => {
  const tier = i < 1 ? 'S' : i < 3 ? 'A' : 'B'
  return `- [${tier}] ${t.title || '热门话题'}（热度: ${t.heat || '—'}）`
}).join('\n')}

## 建议
优先选择 S/A 级选题，结合本账号调性二次加工`
}

function generateTopicSuggest(input: AnalystInput): string {
  return `# 选题建议

## S级选题
- ${input.hotTopics?.[0]?.title || '热门话题'}（热度高，竞品少）
- ${input.hotTopics?.[1]?.title || '上升话题'}（趋势上升）

## A级选题
- ${input.hotTopics?.[2]?.title || '领域热词'}（有2-3篇参考爆款）

## 长尾建议
${(input.keywordPlan?.longTail || ['相关长尾词']).slice(0, 3).map((k: string) => `- ${k}`).join('\n')}`
}

function generateOptimization(input: AnalystInput): string {
  return `# 内容优化建议

## 正文结构
1. 开头钩子：前3行抓眼球
2. 解决方案：分段清晰，每段≤5行
3. 互动引导：结尾提问引导评论

## 标签策略
- 领域标签 + 流量标签 + 场景标签
- 3-5个精准标签，避免泛标签`
}
