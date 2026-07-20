/** publisher — 测试 */
import { formatPublishLog, isTokenExpired } from '../utils'

describe('正常场景', () => {
  it('发布日志格式完整', () => {
    const l = formatPublishLog({ noteId: 'note_123', editUrl: 'https://zhuanlan.zhihu.com/p/123', publishedAt: '2026-07-20T00:00:00Z', retries: 0, previewLink: 'https://zhuanlan.zhihu.com/p/123' })
    expect(l).toContain('note_123')
    expect(l).toContain('zhuanlan.zhihu.com')
  })

  it('定时日志含计划时间', () => {
    const l = formatPublishLog({ noteId: 'n1', editUrl: '', publishedAt: '', scheduledFor: '2026-07-21T08:00:00Z', retries: 1, previewLink: '' })
    expect(l).toContain('计划时间')
  })
})

describe('异常场景', () => {
  it('过期token检测', () => {
    expect(isTokenExpired({ accessToken: 'a', refreshToken: 'b', expiresAt: Date.now() - 10000, platform: 'zhihu' })).toBe(true)
  })

  it('有效token识别', () => {
    expect(isTokenExpired({ accessToken: 'a', refreshToken: 'b', expiresAt: Date.now() + 3600000, platform: 'zhihu' })).toBe(false)
  })
})

describe('边界', () => {
  it('空标签格式正常', () => {
    const l = formatPublishLog({ noteId: 'n2', editUrl: '', publishedAt: '', retries: 0, previewLink: '' })
    expect(l).toBeDefined()
  })
})
