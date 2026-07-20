/**
 * publisher — 发布 Agent
 * 职责：Gate3 审查 → agent-browser 知乎发布 → 日志
 */

import { PublishInput, PublishOutput, SkillResult } from './types'
import { formatPublishLog } from './utils'
import { execSync } from 'child_process'
import { readFileSync } from 'fs'

const CREDS_PATH = '/home/yiu/.openclaw/workspace/output/zhihu-credentials.json'

export async function publish(input: PublishInput): Promise<SkillResult<PublishOutput>> {
  console.log(`[publisher] 开始发布到知乎`)

  try {
    const auth = loadCookie()
    if (!auth) return { success: false, data: null, error: '知乎 Cookie 未配置', timestamp: new Date().toISOString() }

    const content = await readContent(input.contentPath)
    console.log(`[publisher] 素材: ${content.length} 字符`)

    const sc = filterSensitiveWords(content)
    if (sc.found) return { success: false, data: null, error: `敏感词: ${sc.words.join(', ')}`, timestamp: new Date().toISOString() }
    console.log(`[publisher] Gate3: 通过`)

    const title = content.split('\n')[0].replace(/^#\s*/, '').trim() || '未命名笔记'
    console.log(`[publisher] agent-browser: 发布到知乎「${title}」`)

    const result = await publishToZhihu(title, content, auth)
    console.log(`[publisher] 发布成功: ${result.articleUrl}`)

    const out: PublishOutput = { noteId: result.articleId, editUrl: result.articleUrl, publishedAt: result.publishTime, retries: 0, previewLink: result.articleUrl }
    await writePublishLog(out)
    return { success: true, data: out, timestamp: new Date().toISOString() }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`[publisher] 发布失败: ${msg}`)
    return { success: false, data: null, error: msg, timestamp: new Date().toISOString() }
  }
}

function loadCookie(): string | null {
  try {
    const raw = readFileSync(CREDS_PATH, 'utf-8')
    return JSON.parse(raw).zhihu?.cookie || null
  } catch { return null }
}

async function publishToZhihu(title: string, content: string, cookie: string) {
  const xsrf = cookie.match(/_xsrf=([^;]+)/)?.[1] || ''

  const res = await fetch('https://www.zhihu.com/api/v4/articles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookie,
      'User-Agent': 'Mozilla/5.0 Chrome/120',
      'x-xsrftoken': xsrf,
      'x-requested-with': 'XMLHttpRequest',
      'Referer': 'https://www.zhihu.com/',
    },
    body: JSON.stringify({ title, content, tags: [] }),
  })
  const data = await res.json()
  if (data.error) throw new Error(`知乎: ${data.error}`)
  const id = String(data?.id || data?.article_id || '')
  return {
    articleId: id,
    articleUrl: `https://zhuanlan.zhihu.com/p/${id}`,
    publishTime: new Date().toISOString(),
  }
}

async function readContent(p: string) { const { readFile } = await import('fs/promises'); return readFile(p, 'utf-8') }
function filterSensitiveWords(c: string) { const k = ['违规', '违法', '诈骗', '政治', '色情']; return { found: k.some(w => c.includes(w)), words: k.filter(w => c.includes(w)) } }
async function writePublishLog(o: PublishOutput) { const { writeFile, mkdir } = await import('fs/promises'); await mkdir('/home/yiu/.openclaw/workspace/output', { recursive: true }); await writeFile('/home/yiu/.openclaw/workspace/output/publish-log.md', formatPublishLog(o)) }
