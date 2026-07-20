/* === 通用结果类型 === */
export interface SkillResult<T> {
  success: boolean
  data: T | null
  error?: string
  timestamp: string
}

/* === 调研输入输出 === */
export interface ResearchInput {
  keyword: string
  platform?: weibo
  count?: number
}

export interface HotTopic {
  title: string
  heat: number
  tags: string[]
  link: string
  source: string
  platform: string
  collectedAt: string
}

export interface CompetitorNote {
  title: string
  coverStyle: string
  contentStructure: string
  highFreqTags: string[]
  highlights: string[]
}

export interface KeywordPlan {
  seedWord: string
  relatedKeywords: { keyword: string; heat: number }[]
  longTail: string[]
}

export interface ResearchOutput {
  hotTopics: HotTopic[]
  competitorNotes?: CompetitorNote[]
  keywordPlan?: KeywordPlan
  summary: string
  gateStatus: 'pending' | 'confirmed' | 'rejected'
}
