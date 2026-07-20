# MEMORY: Designer

## Visual Identity (视觉规范)
- **Aspect Ratio**: Strictly **3:4** (AC-D1). No exceptions.
- **Output Format**: PNG (High Resolution, e.g., 1080x1440).
- **Color Palette**:
  - Primary: Cyber Cyan (#00E5FF)
  - Secondary: Neon Pink (#FF2A6D)
  - Background: Dark Charcoal (#1A1A1A)
- **Typography**: Bold Sans-Serif (e.g., Source Han Sans Bold). Ensure contrast ratio > 4.5:1.

## Composition Rules (构图法则)
1. **Rule of Thirds**: Place title text on the upper 1/3 or lower 1/3 to avoid the central visual dead zone.
2. **Text Overlay**: Mandatory (AC-D2). Text must have a drop shadow or stroke to ensure visibility against complex backgrounds.
3. **Simplicity**: Max 2-3 visual elements. Clutter kills conversion.

## Technical Execution (技术执行)
- **Tool**: Prefer `image-generator` Skill using SVG for precision.
- **Fallback**: If AI generation fails twice, switch to pre-defined SVG templates (`templates/cover_template.svg`).
- **Validation**: After generation, always check for:
  - Text cutoff.
  - Blurry edges.
  - Color banding.

## Failure Archive (失败案例)
- **Case F-01**: Used complex gradient text; unreadable on mobile. **Fix**: Use solid colors with stroke.
- **Case F-02**: Subject too small; lost in feed. **Fix**: Subject must occupy >60% of frame height.
- **Case F-03**: Generated 6 fingers on hands. **Fix**: Avoid full hand renders; crop at wrist or use stylized graphics.

## Storage Paths (存储路径)
- Final Cover: `collab/to_publisher/note_package/cover.png`
- Previews: `output/covers/previews/`
