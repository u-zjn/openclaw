import { PublishOutput, TokenInfo, MAX_RETRIES } from './types'

export function formatPublishLog(output: PublishOutput): string {
  const lines = [
    '# 发布记录',
    '',
    `- **笔记 ID**: ${output.noteId}`,
    `- **编辑链接**: ${output.editUrl}`,
    `- **发布时间**: ${output.publishedAt}`,
  ]

  if (output.scheduledFor) {
    lines.push(`- **计划时间**: ${output.scheduledFor}`)
  }
  if (output.retries !== undefined) {
    lines.push(`- **重试次数**: ${output.retries}`)
  }

  return lines.join('\n')
}

export function isTokenExpired(token: TokenInfo): boolean {
  return Date.now() > token.expiresAt
}

export function isRetryableError(status: number): boolean {
  return status >= 500 || status === 429
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  shouldRetry: (err: any) => boolean = () => true
): Promise<{ result: T; retries: number }> {
  let lastError: any
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await fn()
      return { result, retries: attempt }
    } catch (err) {
      lastError = err
      if (attempt < MAX_RETRIES && shouldRetry(err)) {
        console.log(`[publisher] 重试 ${attempt + 1}/${MAX_RETRIES}, 等待 ${30}s...`)
        await sleep(30000)
      }
    }
  }
  throw lastError
}
