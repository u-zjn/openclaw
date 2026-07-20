export interface SkillResult<T> {
  success: boolean
  data: T | null
  error?: string
  timestamp: string
}

export interface PublishInput {
  contentPath: string
  coverPath: string
  tags: string[]
  schedule?: string          // ISO 8601
  platform?: 'bilibili' | 'xiaohongshu'
}

export interface PublishOutput {
  noteId: string
  editUrl: string
  publishedAt: string
  scheduledFor?: string
  retries: number
  previewLink: string
}

export interface TokenInfo {
  accessToken: string
  refreshToken: string
  expiresAt: number
  platform: string
}

export const MAX_RETRIES = 3
export const RETRY_INTERVAL_MS = 30000
