export interface SkillResult<T> {
  success: boolean
  data: T | null
  error?: string
  timestamp: string
}

export interface DesignInput {
  title: string
  subtitle?: string
  style: string
  platform?: 'bilibili' | 'xiaohongshu'
}

export interface DesignOutput {
  coverPath: string
  width: number
  height: number
  format: string
  layoutSuggestions: string[]
}

/* 3:4 竖版 */
export const COVER_WIDTH = 900
export const COVER_HEIGHT = 1200

export interface StylePreset {
  bgGradient: string[]
  fontColor: string
  fontSize: number
  subtitleSize: number
  fontFamily: string
}

export const STYLE_PRESETS: Record<string, StylePreset> = {
  极简: { bgGradient: ['#ffffff', '#f0f0f0'], fontColor: '#333333', fontSize: 48, subtitleSize: 28, fontFamily: 'sans-serif' },
  高对比: { bgGradient: ['#ff4444', '#cc0000'], fontColor: '#ffffff', fontSize: 56, subtitleSize: 32, fontFamily: 'sans-serif' },
  渐变: { bgGradient: ['#667eea', '#764ba2'], fontColor: '#ffffff', fontSize: 52, subtitleSize: 30, fontFamily: 'sans-serif' },
  手绘: { bgGradient: ['#fdf6e3', '#f5e6cc'], fontColor: '#5a4a3a', fontSize: 50, subtitleSize: 28, fontFamily: 'serif' },
  科技: { bgGradient: ['#0a0a2e', '#1a1a4e'], fontColor: '#00f5ff', fontSize: 48, subtitleSize: 26, fontFamily: 'monospace' },
}
