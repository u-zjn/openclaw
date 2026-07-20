import { StylePreset } from './types'

export function sanitizeTitle(title: string): string {
  return title.replace(/[<>:"/\\|?*]/g, '').slice(0, 50)
}

export function generateFileName(prefix: string = 'cover'): string {
  return `${prefix}-${Date.now()}.png`
}

/* 生成 SVG 封面源码 */
export function generateSVG(
  title: string,
  subtitle: string | undefined,
  preset: StylePreset,
  width: number,
  height: number
): string {
  const [g1, g2] = preset.bgGradient
  const titleLines = wrapText(sanitizeTitle(title), 8)

  const titleElements = titleLines
    .map((line, i) => {
      const y = 420 + i * (preset.fontSize + 16)
      return `<text x="${width / 2}" y="${y}" font-size="${preset.fontSize}"
        fill="${preset.fontColor}" font-family="${preset.fontFamily}"
        text-anchor="middle" font-weight="bold">${escapeXml(line)}</text>`
    })
    .join('\n    ')

  const subtitleElement = subtitle
    ? `<text x="${width / 2}" y="${height - 200}" font-size="${preset.subtitleSize}"
        fill="${preset.fontColor}" font-family="${preset.fontFamily}"
        text-anchor="middle" opacity="0.8">${escapeXml(subtitle)}</text>`
    : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${g1}" />
      <stop offset="100%" style="stop-color:${g2}" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)" />
  <!-- 装饰元素 -->
  <circle cx="${width - 80}" cy="80" r="120" fill="rgba(255,255,255,0.05)" />
  <circle cx="100" cy="${height - 120}" r="80" fill="rgba(255,255,255,0.08)" />
  <!-- 标题 -->
  ${titleElements}
  <!-- 副标题 -->
  ${subtitleElement}
  <!-- 底部装饰线 -->
  <line x1="${width * 0.2}" y1="${height - 280}" x2="${width * 0.8}" y2="${height - 280}"
    stroke="${preset.fontColor}" stroke-width="2" opacity="0.3" />
</svg>`
}

function wrapText(text: string, maxChars: number): string[] {
  const lines: string[] = []
  for (let i = 0; i < text.length; i += maxChars) {
    lines.push(text.slice(i, i + maxChars))
  }
  return lines.slice(0, 3) // max 3 lines
}

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
