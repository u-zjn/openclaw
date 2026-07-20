import { HotTopic, CompetitorNote, KeywordPlan } from './types'

export function formatHotTopics(topics: HotTopic[]): string {
  const lines = ['# 📊 热点简报\n']
  topics.forEach((t, i) => {
    lines.push(
      `### ${i + 1}. ${t.title}`,
      `- 热度指数: **${t.heat}**`,
      `- 平台: ${t.platform} | 来源: ${t.source}`,
      `- 采集时间: ${t.collectedAt}`,
      t.tags.length ? `- 相关标签: ${t.tags.join(', ')}` : '',
      ''
    )
  })
  return lines.join('\n')
}

export function formatCompetitorAnalysis(notes: CompetitorNote[]): string {
  const lines = ['# 🔍 爆款笔记拆解\n']
  notes.forEach((n, i) => {
    lines.push(
      `## 案例 ${i + 1}: ${n.title}`,
      `- 封面风格: ${n.coverStyle}`,
      `- 正文结构: ${n.contentStructure}`,
      `- 高频标签: ${n.highFreqTags.join(', ')}`,
      n.highlights.length ? `- 亮点分析: ${n.highlights.join('; ')}` : '',
      ''
    )
  })
  return lines.join('\n')
}

export function formatKeywordPlan(plan: KeywordPlan): string {
  const lines = [
    '# 🎯 关键词挖掘报告\n',
    `种子词: **${plan.seedWord}**\n`,
    '### 关联热词',
    ...plan.relatedKeywords.map(k => `- ${k.keyword}（热度: ${k.heat}）`),
    '',
    '### 长尾关键词',
    ...plan.longTail.map(k => `- ${k}`),
  ]
  return lines.join('\n')
}

export function sortByHeat(topics: HotTopic[]): HotTopic[] {
  return [...topics].sort((a, b) => b.heat - a.heat)
}

export function timestamp(): string {
  return new Date().toISOString()
}
