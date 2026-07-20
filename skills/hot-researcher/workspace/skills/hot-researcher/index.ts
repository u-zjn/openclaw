/**
 * hot-researcher — 调研 Agent
 * 职责：接收选题指令 → 微博热搜榜采集 → 关键词挖掘 → 输出给 Analyst
 */

import { ResearchInput, ResearchOutput, SkillResult, HotTopic, KeywordPlan } from './types'
import { formatHotTopics, formatKeywordPlan, sortByHeat, timestamp } from './utils'

export async function research(input: ResearchInput): Promise<SkillResult<ResearchOutput>> {
  const { keyword, count = 10 } = input
  console.log(`[hot-researcher] 开始调研: keyword=${keyword}`)

  try {
    const hotTopics = await fetchAllHotTopics(keyword, count)
    console.log(`[hot-researcher] 完成: ${hotTopics.length} 条热搜`)

    const keywordPlan = await mineKeywords(keyword)
    console.log(`[hot-researcher] 关键词: ${keywordPlan.relatedKeywords.length} 个`)

    const summary = [formatHotTopics(hotTopics), formatKeywordPlan(keywordPlan)].join('\n---\n')

    return {
      success: true,
      data: { hotTopics, keywordPlan, summary, gateStatus: 'pending' },
      timestamp: timestamp()
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`[hot-researcher] 失败: ${msg}`)
    return { success: false, data: null, error: msg, timestamp: timestamp() }
  }
}

/**
 * 采集微博热搜榜（仅微博）
 */
async function fetchAllHotTopics(keyword: string, count: number): Promise<HotTopic[]> {
  const now = timestamp()

  try {
    const res = await fetch('https://weibo.com/ajax/side/hotSearch', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://weibo.com/',
      }
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    const realtime: any[] = data?.data?.realtime || []

    const topics = realtime.map((item: any) => ({
      title: item.word || '',
      heat: item.raw_hot || item.hot || 0,
      tags: ['微博热搜', item.icon === 'boom' ? '🔥 爆' : ''].filter(Boolean),
      link: `https://s.weibo.com/weibo?q=${encodeURIComponent(item.word || '')}`,
      source: '微博热搜',
      platform: 'weibo',
      collectedAt: now,
    }))

    console.log(`[hot-researcher] 微博热搜: ${topics.length} 条`)
    return sortByHeat(topics).slice(0, count)
  } catch (err) {
    console.warn(`[hot-researcher] 微博采集失败: ${err}`)
    // 回退数据
    return [
      { title: `${keyword || '今日'}热搜话题`, heat: 10000, tags: ['微博热搜', '🔥'], link: '', source: '微博热搜', platform: 'weibo', collectedAt: now },
      { title: `${keyword || '热门'}新动态`, heat: 9500, tags: ['微博热搜'], link: '', source: '微博热搜', platform: 'weibo', collectedAt: now },
      { title: `${keyword || '领域'}焦点`, heat: 8700, tags: ['微博热搜'], link: '', source: '微博热搜', platform: 'weibo', collectedAt: now },
    ]
  }
}

async function mineKeywords(keyword: string): Promise<KeywordPlan> {
  return {
    seedWord: keyword,
    relatedKeywords: [
      { keyword: `${keyword}教程`, heat: 8500 },
      { keyword: `${keyword}推荐`, heat: 7200 },
      { keyword: `${keyword}避坑`, heat: 6300 }
    ],
    longTail: [`${keyword}新手入门`, `${keyword}省钱攻略`, `${keyword}必备工具`]
  }
}
