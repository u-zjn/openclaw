/** writer — 测试 */
import { write } from '../index'
import { validateContent } from '../utils'

describe('正常场景', () => {
  it('应返回正文标题标签', async () => {
    const r = await write({ topic: 'Python入门', style: '教程' })
    expect(r.success).toBe(true)
    expect(r.data!.content.length).toBeGreaterThan(0)
    expect(r.data!.titles.length).toBe(5)
    expect(r.data!.hashtags.length).toBe(5)
  })

  it('不同风格不同内容', async () => {
    const [r1, r2] = await Promise.all([
      write({ topic: '护肤', style: '教程' }),
      write({ topic: '护肤', style: '干货' })
    ])
    expect(r1.data!.content).not.toBe(r2.data!.content)
  })
})

describe('异常场景', () => {
  it('空主题', async () => {
    const r = await write({ topic: '', style: '教程' })
    expect(r.success).toBe(true)
  })

  it('未知风格降级', async () => {
    const r = await write({ topic: '学习', style: '未知风格' })
    expect(r.success).toBe(true)
  })
})

describe('边界场景', () => {
  it('超长主题', async () => {
    const r = await write({ topic: 'A'.repeat(300), style: '教程' })
    expect(r.success).toBe(true)
  })
})

describe('utils', () => {
  it('检测超长内容', () => {
    const v = validateContent('a'.repeat(1200))
    expect(v.valid).toBe(false)
    expect(v.wordCount).toBeGreaterThan(1000)
  })

  it('正常内容通过', () => {
    const v = validateContent('a'.repeat(500))
    expect(v.valid).toBe(true)
  })
})
