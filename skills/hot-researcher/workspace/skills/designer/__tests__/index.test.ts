/** designer — 测试 */
import { design } from '../index'
import { generateSVG, sanitizeTitle } from '../utils'
import { COVER_WIDTH, COVER_HEIGHT, STYLE_PRESETS } from '../types'

describe('正常场景', () => {
  it('应返回3:4封面和排版建议', async () => {
    const r = await design({ title: 'Python教程', style: '极简' })
    expect(r.success).toBe(true)
    expect(r.data!.width).toBe(COVER_WIDTH)
    expect(r.data!.height).toBe(COVER_HEIGHT)
    expect(r.data!.format).toBe('png')
    expect(r.data!.layoutSuggestions.length).toBeGreaterThan(0)
  })
})

describe('异常场景', () => {
  it('未知风格用极简', async () => {
    const r = await design({ title: '测试', style: '不存在' })
    expect(r.success).toBe(true)
  })
})

describe('SVG', () => {
  it('SVG含正确尺寸', () => {
    const s = generateSVG('标题', undefined, STYLE_PRESETS['极简'], COVER_WIDTH, COVER_HEIGHT)
    expect(s).toContain(`width="${COVER_WIDTH}"`)
    expect(s).toContain(`height="${COVER_HEIGHT}"`)
  })

  it('SVG含标题', () => {
    const s = generateSVG('Python教程', undefined, STYLE_PRESETS['极简'], COVER_WIDTH, COVER_HEIGHT)
    expect(s).toContain('Python')
    expect(s).toContain('教程')
  })

  it('SVG含副标题', () => {
    const s = generateSVG('主标题', '副标题', STYLE_PRESETS['渐变'], COVER_WIDTH, COVER_HEIGHT)
    expect(s).toContain('主标题')
    expect(s).toContain('副标题')
  })
})

describe('边界', () => {
  it('超长标题截断50字符', () => {
    expect(sanitizeTitle('A'.repeat(100)).length).toBe(50)
  })
  it('特殊字符过滤', () => {
    expect(sanitizeTitle('<>:"/\\|?*测试')).toBe('测试')
  })
})
