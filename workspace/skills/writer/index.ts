/**
 * writer — 创作 Agent
 * 职责：接收 Analyst 选题建议 → 正文(≤1000字) → 标题3-5 → 标签3-5
 */

import { SkillResult } from './types'
import { validateContent } from './utils'

export interface WriteInput {
  topic: string
  style: string
  analystBrief?: string
}

export interface WriteOutput {
  content: string
  titles: string[]
  hashtags: string[]
  wordCount: number
}

export async function write(input: WriteInput): Promise<SkillResult<WriteOutput>> {
  const { topic, style, analystBrief } = input
  console.log(`[writer] 开始创作: ${topic}, style=${style}`)

  try {
    const content = await generateContent(topic, style)
    const titles = generateTitles(topic, style)
    const hashtags = generateHashtags(topic, style)

    console.log(`[writer] 正文: ${content.replace(/\s/g, '').length} 字`)
    const validation = validateContent(content)
    if (!validation.valid) console.warn(`[writer] 校验: ${validation.errors.join('; ')}`)

    return {
      success: true,
      data: { content, titles, hashtags, wordCount: validation.wordCount },
      timestamp: new Date().toISOString()
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return { success: false, data: null, error: msg, timestamp: new Date().toISOString() }
  }
}

function generateContent(topic: string, style: string): string {
  return [
    `# ${topic}`,
    '',
    style === '教程' ? `手把手教你搞定「${topic}」👇` :
    style === '种草' ? `被问爆了！关于「${topic}」这些你必须知道` :
    `干货来了！关于「${topic}」今天说清楚 👇`,
    '',
    `很多人认为「${topic}」很复杂，其实只要掌握核心思路就很简单了。`,
    '',
    `第一步：先搞清楚基本原理。`,
    `打好基础才能事半功倍。`,
    '',
    `第二步：掌握实操技巧。`,
    `按照这个思路做，效果立竿见影。`,
    '',
    `第三步：避坑指南。`,
    `以下这些误区千万别踩！`,
    '',
    `你还有什么问题？评论区聊聊～`,
  ].join('\n')
}

function generateTitles(topic: string, style: string): string[] {
  return [
    `${topic}的3个绝招，学会立马见效`,
    `关于${topic}，90%的人都不知道的事`,
    `为什么${topic}这么火？一文看懂`,
    `做了${topic} vs 没做，差距有多大`,
    `建议所有${topic}新手都看看这篇`,
  ]
}

function generateHashtags(topic: string, style: string): string[] {
  return [
    `#${topic.replace(/\s/g, '')}`,
    `#${style}分享`,
    '#每日干货',
    '#新手必看',
    '#实用攻略'
  ]
}
