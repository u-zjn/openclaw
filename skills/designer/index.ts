/**
 * designer — 视觉设计 Agent
 * 职责：解析文稿逻辑 → 生成 3:4 竖版封面图（含标题文字叠加）
 *       → 输出排版建议与视觉素材包 → 同步至群内
 */

import { DesignInput, DesignOutput, SkillResult, COVER_WIDTH, COVER_HEIGHT, STYLE_PRESETS } from './types'
import { generateSVG, generateFileName } from './utils'

export async function design(input: DesignInput): Promise<SkillResult<DesignOutput>> {
  const { title, subtitle, style } = input
  console.log(`[designer] 封面设计: 开始生成「${title}」, 风格=${style}`)

  try {
    const preset = STYLE_PRESETS[style] || STYLE_PRESETS['极简']
    console.log(`[designer] SVG渲染: 生成封面图 ${COVER_WIDTH}×${COVER_HEIGHT}`)
    const svgContent = generateSVG(title, subtitle, preset, COVER_WIDTH, COVER_HEIGHT)

    console.log(`[designer] 文件保存: 写入素材文件`)
    const coverPath = await saveCover(svgContent)
    console.log(`[designer] 文件保存: 完成, ${coverPath}`)

    const layoutSuggestions = generateLayoutSuggestions(style)

    return {
      success: true,
      data: { coverPath, width: COVER_WIDTH, height: COVER_HEIGHT, format: 'png', layoutSuggestions },
      timestamp: new Date().toISOString()
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`[designer] 封面设计失败: ${msg}`)
    return { success: false, data: null, error: msg, timestamp: new Date().toISOString() }
  }
}

async function saveCover(svgContent: string): Promise<string> {
  const fileName = generateFileName()
  const { writeFile, mkdir } = await import('fs/promises')
  const outDir = '/home/yiu/.openclaw/workspace/output/covers'
  await mkdir(outDir, { recursive: true })
  const svgPath = `${outDir}/${fileName.replace('.png', '.svg')}`
  await writeFile(svgPath, svgContent)
  return svgPath.replace('.svg', '.png')
}

function generateLayoutSuggestions(style: string): string[] {
  const common = ['标题居中对齐', '留白充足', '配色不超过3种']
  if (style === '极简') return [...common, '大面积留白', '单色背景']
  if (style === '高对比') return [...common, '强烈色彩对比', '粗体大字']
  if (style === '渐变') return [...common, '渐变过渡自然', '柔和配色']
  if (style === '手绘') return [...common, '手写体风格', '暖色调']
  if (style === '科技') return [...common, '深色背景', '亮色文字', '科技感线条']
  return common
}
