const MAX_CHARS = 1000
const MAX_PARAGRAPH_LINES = 5

export interface ContentValidation {
  valid: boolean
  wordCount: number
  maxParagraphLines: number
  errors: string[]
}

export function validateContent(content: string): ContentValidation {
  const wordCount = content.replace(/\s/g, '').length
  const paragraphs = content.split('\n\n').filter(p => p.trim())
  const maxParagraphLines = Math.max(
    ...paragraphs.map(p => p.split('\n').filter(l => l.trim()).length),
    0
  )
  const errors: string[] = []
  if (wordCount > MAX_CHARS) errors.push(`超限: ${wordCount}/${MAX_CHARS} 字`)
  if (maxParagraphLines > MAX_PARAGRAPH_LINES) errors.push(`段落超行: ${maxParagraphLines}/${MAX_PARAGRAPH_LINES}`)
  return { valid: errors.length === 0, wordCount, maxParagraphLines, errors }
}

export function validateTitles(titles: string[]): string[] {
  return titles.filter(t => t.length > 0 && t.length <= 50)
}

export function validateHashtags(tags: string[]): string[] {
  return tags.map(t => t.startsWith('#') ? t : `#${t}`).filter(t => t.length <= 30)
}
