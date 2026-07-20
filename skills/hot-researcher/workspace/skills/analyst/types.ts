export interface SkillResult<T> {
  success: boolean
  data: T | null
  error?: string
  timestamp: string
}

export function timestamp(): string {
  return new Date().toISOString()
}
