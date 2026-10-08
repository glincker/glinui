import { ImageResponse } from "next/og"

export const OG_SIZE = { width: 1200, height: 630 } as const
export const OG_TAGLINE = "Free, open-source design hub for the modern web"

type OgOptions = {
  /** Small mono label above the title, e.g. "Blog". */
  eyebrow?: string
  /** Large headline. Defaults to the wordmark tagline. */
  title?: string
  /** Optional line under the headline. */
  subtitle?: string
}

/**
 * Social card in the glinr look: dark tonal shell, gradient hairline ring, violet accent.
 * ImageResponse renders with Satori, which only supports inline styles and hex/rgba colors, so the
 * token values from packages/tokens/theme.css (dark scope) are mirrored here as constants.
 */
const C = {
  bg: "#07080d",
  shell: "#10121a",
  well: "#0b0d14",
  text: "#f4f5fa",
  muted: "#a3a8ba",
  accent: "#b6abff",
  accentSoft: "rgba(182,171,255,0.16)",
  line: "rgba(255,255,255,0.10)"
} as const

export function renderOgImage({ eyebrow, title = OG_TAGLINE, subtitle }: OgOptions = {}) {
  const long = title.length > 60
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 40,
          background: `radial-gradient(900px 500px at 80% 0%, ${C.accentSoft}, ${C.bg} 70%)`,
          color: C.text
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: 56,
            borderRadius: 36,
            background: C.shell,
            border: `2px solid ${C.line}`,
            boxShadow: "inset 0 1px 0 rgba(182,171,255,0.35)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: C.accent,
                  color: C.bg,
                  fontSize: 34,
                  fontWeight: 800
                }}
              >
                G
              </div>
              <div style={{ display: "flex", marginLeft: 18, fontSize: 36, fontWeight: 700 }}>Glin UI</div>
            </div>
            {eyebrow ? (
              <div
                style={{
                  display: "flex",
                  padding: "8px 20px",
                  borderRadius: 999,
                  background: C.well,
                  border: `2px solid ${C.line}`,
                  color: C.accent,
                  fontSize: 24,
                  letterSpacing: 2,
                  textTransform: "uppercase"
                }}
              >
                {eyebrow}
              </div>
            ) : null}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: long ? 56 : 72, fontWeight: 800, lineHeight: 1.1, letterSpacing: -2 }}>
              {title}
            </div>
            {subtitle ? (
              <div style={{ display: "flex", marginTop: 24, fontSize: 30, lineHeight: 1.35, color: C.muted }}>{subtitle}</div>
            ) : null}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", fontSize: 26, color: C.muted }}>glinui.com</div>
            <div style={{ display: "flex", padding: "10px 22px", borderRadius: 14, background: C.well, border: `2px solid ${C.line}`, fontSize: 24, color: C.text }}>
              npx glinui add button
            </div>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  )
}
