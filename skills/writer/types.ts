export interface SkillResult<T> {
  success: boolean
  data: T | null
  error?: string
  timestamp: string
}

export interface WriteInput {
  topic: string
  style: string
  refLinks?: string[]
  hotBrief?: string
  targetPlatform?: string
}

export interface WriteOutput {
  content: string        // note-content.md
  titles: string[]       // titles.md
  hashtags: string[]     // hashtags.md
  wordCount: number
}

export interface TitleSuggestion {
  title: string
  type: '数字型' | '悬念型' | '反问型' | '对比型' | '指令型'
  score: number
}

export interface ContentValidation {
  valid: boolean
  wordCount: number
  maxParagraphLines: number
  hasEmoji: boolean
  errors: string[]
}
