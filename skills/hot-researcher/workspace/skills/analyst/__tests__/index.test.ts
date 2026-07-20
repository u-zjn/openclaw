/** analyst — 测试 */
import { analyze } from '../index'

describe('正常场景', () => {
  it('应返回爆款拆解和选题建议', async () => {
    const r = await analyze({ hotTopics: [{ title: '热门话题', heat: 10000 }] })
    expect(r.success).toBe(true)
    expect(r.data!.commendNotes).toContain('爆款拆解')
    expect(r.data!.topicSuggest).toContain('选题')
    expect(r.data!.optimization).toContain('优化')
  })
})

describe('异常场景', () => {
  it('空热点列表', async () => {
    const r = await analyze({ hotTopics: [] })
    expect(r.success).toBe(true)
  })
})
