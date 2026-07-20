/** hot-researcher — 测试 */
import { research } from '../index'

describe('正常场景', () => {
  it('应返回热搜和关键词', async () => {
    const r = await research({ keyword: '穿搭', count: 5 })
    expect(r.success).toBe(true)
    expect(r.data!.hotTopics.length).toBe(5)
    expect(r.data!.keywordPlan).toBeDefined()
  })

  it('默认参数返回10条', async () => {
    const r = await research({ keyword: 'AI' })
    expect(r.data!.hotTopics.length).toBe(10)
  })
})

describe('异常场景', () => {
  it('空关键词处理', async () => {
    const r = await research({ keyword: '', count: 3 })
    expect(r.success).toBe(true)
  })

  it('count=0返回空', async () => {
    const r = await research({ keyword: '测试', count: 0 })
    expect(r.success).toBe(true)
  })
})

describe('边界场景', () => {
  it('超长关键词', async () => {
    const r = await research({ keyword: 'A'.repeat(500), count: 1 })
    expect(r.success).toBe(true)
  })

  it('大量请求', async () => {
    const r = await research({ keyword: '设计', count: 50 })
    expect(r.data!.hotTopics.length).toBe(50)
  })
})
