import { baseColors, type BaseColor, type BaseColorId, type BaseSwatch } from "./bases"

export type ThemeMode = "light" | "dark"

export const colorTokens = {
  light: {
    background: "oklch(0.985 0.002 240)",
    foreground: "oklch(0.23 0.01 248)",
    surface: "oklch(0.997 0.002 245)",
    border: "oklch(0.89 0.01 246)",
    accent: "oklch(0.55 0.2 289)",
    accentForeground: "oklch(0.99 0.003 290)"
  },
  dark: {
    background: "oklch(0.168 0.004 264.4)",
    foreground: "oklch(0.95 0.01 247)",
    surface: "oklch(0.198 0.004 229)",
    border: "oklch(0.323 0.009 248.1)",
    accent: "oklch(0.782 0.118 289.4)",
    accentForeground: "oklch(0.168 0.004 264.4)"
  }
} as const

/**
 * Glass tokens: Apple Liquid Glass spec (WWDC 2025).
 *
 * Key principles:
 * - saturate(180%) always paired with blur
 * - Higher surface opacity than old glassmorphism (Apple Beta 3+)
 * - Dark mode significantly MORE opaque than light mode
 * - Top border brighter than sides (light refraction edge)
 * - 4.5:1 contrast ratio for text on glass (WCAG AA)
 */
export const glassTokens = {
  blur: {
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "40px"
  },
  saturate: {
    default: "180%",
    subtle: "130%"
  },
  surface: {
    light: "rgba(255, 255, 255, 0.18)",
    dark: "rgba(0, 0, 0, 0.40)"
  },
  border: {
    light: "rgba(255, 255, 255, 0.20)",
    dark: "rgba(255, 255, 255, 0.10)"
  },
  borderStrong: {
    light: "rgba(255, 255, 255, 0.35)",
    dark: "rgba(255, 255, 255, 0.18)"
  },
  refractionTop: {
    light: "rgba(255, 255, 255, 0.40)",
    dark: "rgba(255, 255, 255, 0.15)"
  }
} as const

export const radiusTokens = {
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.25rem",
  "2xl": "1.75rem"
} as const

export const spacingTokens = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  "2xl": "2rem"
} as const

export const shadowTokens = {
  "glass-sm": "0 2px 8px rgba(0, 0, 0, 0.08)",
  "glass-md":
    "0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)",
  "glass-lg":
    "0 16px 48px rgba(0, 0, 0, 0.16), 0 4px 8px rgba(0, 0, 0, 0.08)",
  "glass-inset":
    "inset 0 1px 0 rgba(255, 255, 255, 0.12), inset 0 -1px 0 rgba(0, 0, 0, 0.05)"
} as const

/**
 * Composed glass elevation levels.
 * Each bundles blur + surface opacity + shadow.
 * CSS classes also apply saturate(180%) and refraction top border.
 */
export const glassLevelTokens = {
  "glass-1": {
    blur: "8px",
    opacity: { light: "0.08", dark: "0.20" },
    shadow: "glass-sm"
  },
  "glass-2": {
    blur: "12px",
    opacity: { light: "0.12", dark: "0.30" },
    shadow: "glass-sm"
  },
  "glass-3": {
    blur: "16px",
    opacity: { light: "0.18", dark: "0.40" },
    shadow: "glass-md"
  },
  "glass-4": {
    blur: "24px",
    opacity: { light: "0.25", dark: "0.55" },
    shadow: "glass-lg"
  },
  "glass-5": {
    blur: "40px",
    opacity: { light: "0.35", dark: "0.70" },
    shadow: "glass-lg"
  }
} as const

export const glassOpacityScaleTokens = {
  light: {
    1: "0.06",
    2: "0.08",
    3: "0.10",
    4: "0.12",
    5: "0.16",
    6: "0.18",
    7: "0.22",
    8: "0.25",
    9: "0.30",
    10: "0.35"
  },
  dark: {
    1: "0.16",
    2: "0.20",
    3: "0.25",
    4: "0.30",
    5: "0.35",
    6: "0.40",
    7: "0.48",
    8: "0.55",
    9: "0.62",
    10: "0.70"
  }
} as const

export const glassPerformanceTokens = {
  gpuHint: {
    transform: "translateZ(0)",
    backfaceVisibility: "hidden",
    willChange: "transform, opacity"
  },
  heavySurface: {
    transform: "translateZ(0)",
    backfaceVisibility: "hidden",
    willChange: "backdrop-filter, transform, opacity",
    contain: "paint"
  }
} as const

export const glassLuminanceTokens = {
  neutral: {
    surfaceMultiplier: 1,
    borderMultiplier: 1,
    refractionMultiplier: 1,
    saturateMultiplier: 1
  },
  bright: {
    surfaceMultiplier: 1.16,
    borderMultiplier: 1.08,
    refractionMultiplier: 1.14,
    saturateMultiplier: 1.04
  },
  dim: {
    surfaceMultiplier: 0.9,
    borderMultiplier: 1.15,
    refractionMultiplier: 1.22,
    saturateMultiplier: 0.96
  }
} as const

export const motionTokens = {
  duration: {
    fast: "150ms",
    normal: "250ms",
    slow: "400ms",
    spring: "500ms"
  },
  easing: {
    standard: "cubic-bezier(0.2, 0.0, 0.0, 1.0)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    glass: "cubic-bezier(0.4, 0.0, 0.2, 1.0)"
  }
} as const

export const brandTokens = {
  light: { signalLive: "oklch(0.62 0.17 111)", signalOk: "oklch(0.6 0.14 175)" },
  dark: { signalLive: "oklch(0.933 0.167 111.1)", signalOk: "oklch(0.752 0.141 175.3)" }
} as const

export const signalTokens = brandTokens

export const surfaceTokens = {
  light: {
    s0: "var(--color-background)",
    s1: "var(--color-surface)",
    s2: "oklch(0.97 0.003 245)",
    s3: "oklch(0.94 0.005 246)",
    well: "oklch(0.955 0.004 246)",
    muted: "oklch(0.52 0.014 270)",
    subtle: "oklch(0.65 0.013 280)"
  },
  dark: {
    s0: "var(--color-background)",
    s1: "var(--color-surface)",
    s2: "oklch(0.242 0.007 248.1)",
    s3: "oklch(0.263 0.045 281)",
    well: "oklch(0.139 0.003 246.3)",
    muted: "oklch(0.646 0.013 286)",
    subtle: "oklch(0.498 0.014 281)"
  }
} as const

export const elevationTokens = {
  light: {
    highlight: "inset 0 1px 0 rgb(255 255 255 / 0.8)",
    lineSoft: "rgb(0 0 0 / 0.07)",
    drop1: "0 1px 1px rgb(0 0 0 / 0.06), 0 3px 6px -2px rgb(0 0 0 / 0.08)",
    drop2: "0 1px 1px rgb(0 0 0 / 0.06), 0 8px 16px -4px rgb(0 0 0 / 0.1), 0 24px 48px -12px rgb(0 0 0 / 0.12)",
    drop3: "0 2px 2px rgb(0 0 0 / 0.06), 0 12px 24px -6px rgb(0 0 0 / 0.12), 0 36px 72px -18px rgb(0 0 0 / 0.16)",
    inset: "inset 0 2px 4px rgb(0 0 0 / 0.08), inset 0 0 0 1px rgb(0 0 0 / 0.04)"
  },
  dark: {
    highlight: "inset 0 1px 0 rgb(255 255 255 / 0.07)",
    lineSoft: "rgb(255 255 255 / 0.07)",
    drop1: "0 1px 1px rgb(0 0 0 / 0.5), 0 3px 6px -2px rgb(0 0 0 / 0.5)",
    drop2: "0 1px 1px rgb(0 0 0 / 0.5), 0 8px 16px -4px rgb(0 0 0 / 0.55), 0 24px 48px -12px rgb(0 0 0 / 0.65)",
    drop3: "0 2px 2px rgb(0 0 0 / 0.5), 0 12px 24px -6px rgb(0 0 0 / 0.6), 0 36px 72px -18px rgb(0 0 0 / 0.75)",
    inset: "inset 0 2px 4px rgb(0 0 0 / 0.55), inset 0 0 0 1px rgb(255 255 255 / 0.035), 0 1px 0 rgb(255 255 255 / 0.05)"
  }
} as const

export const ringTokens = {
  light: { edgeRgb: "0 0 0", top: 0.14, mid: 0.05, bottom: 0.07 },
  dark: { edgeRgb: "255 255 255", top: 0.18, mid: 0.04, bottom: 0.06 }
} as const

export const typeTokens = {
  fontSans: '"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  fontMono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  scale: {
    caption: "0.75rem",
    sm: "0.875rem",
    body: "1rem",
    lead: "1.1875rem",
    sub: "1.25rem",
    h3: "2rem",
    h2: "clamp(2rem, 4.2vw, 3rem)",
    display: "clamp(2.75rem, 6.4vw, 4.25rem)"
  }
} as const

export const layoutTokens = {
  max: "1200px",
  gutter: "clamp(16px, 4vw, 32px)",
  section: "clamp(64px, 9vw, 120px)",
  navHeight: "64px",
  radiusCard: "0.75rem",
  radiusInput: "0.5rem",
  radiusPill: "9999px"
} as const

export const easingTokens = {
  out: "cubic-bezier(0.23, 1, 0.32, 1)",
  inOut: "cubic-bezier(0.77, 0, 0.175, 1)",
  drawer: "cubic-bezier(0.32, 0.72, 0, 1)"
} as const

export const floorTokens = {
  light: { floor1: "oklch(0.955 0.003 245)", floor2: "oklch(0.97 0.003 245)" },
  dark: { floor1: "#050506", floor2: "#08090b" }
} as const

export const faceTokens = { face0: "var(--surface-0)", face1: "var(--surface-1)", face2: "var(--surface-2)" } as const

export const hotRingTokens = {
  light: {
    hot: "linear-gradient(180deg, rgb(0 0 0 / 0.26), rgb(0 0 0 / 0.09) 45%, rgb(0 0 0 / 0.12))",
    violet: "linear-gradient(180deg, oklch(0.55 0.2 289 / 0.6), oklch(0.55 0.2 289 / 0.16) 42%, oklch(0.55 0.2 289 / 0.24))"
  },
  dark: {
    hot: "linear-gradient(180deg, rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0.09) 45%, rgba(255, 255, 255, 0.12))",
    violet: "linear-gradient(180deg, rgba(182, 171, 255, 0.55), rgba(182, 171, 255, 0.14) 42%, rgba(182, 171, 255, 0.2))"
  }
} as const

export const hoverShadowTokens = {
  light: "0 2px 2px rgb(0 0 0 / 0.06), 0 14px 28px -8px rgb(0 0 0 / 0.14), 0 32px 56px -16px rgb(0 0 0 / 0.18)",
  dark: "0 2px 2px rgba(0, 0, 0, 0.5), 0 14px 28px -8px rgba(0, 0, 0, 0.65), 0 32px 56px -16px rgba(0, 0, 0, 0.75)"
} as const

export const hairlineInsetTokens = {
  dark: {
    hl: "inset 0 0 0 0.5px rgba(255, 255, 255, 0.1)",
    hlTop: "inset 0 2.5px 0 -2px rgba(255, 255, 255, 0.1)",
    hlStrong: "inset 0 2.5px 0 -2px rgba(255, 255, 255, 0.15), inset 0 0 0 0.5px rgba(255, 255, 255, 0.15)"
  },
  light: {
    hl: "inset 0 0 0 0.5px rgb(0 0 0 / 0.08)",
    hlTop: "inset 0 2.5px 0 -2px rgb(255 255 255 / 0.9)",
    hlStrong: "inset 0 2.5px 0 -2px rgb(255 255 255 / 0.95), inset 0 0 0 0.5px rgb(0 0 0 / 0.12)"
  }
} as const

export const keyTokens = {
  light: {
    top: "oklch(0.93 0.16 111)",
    bottom: "oklch(0.87 0.17 111)",
    whiteTop: "#ffffff",
    whiteBottom: "#e8e8ee",
    foreground: "oklch(0.18 0.01 248)"
  },
  dark: {
    top: "#f8fc8c",
    bottom: "#eef35f",
    whiteTop: "#ffffff",
    whiteBottom: "#e2e2e7",
    foreground: "#000000"
  }
} as const

export const glowTokens = {
  light: { a: "oklch(0.55 0.2 289 / 0.34)", b: "oklch(0.6 0.14 175 / 0.3)", c: "oklch(0.62 0.17 111 / 0.3)" },
  dark: { a: "rgba(182, 171, 255, 0.5)", b: "rgba(0, 203, 170, 0.42)", c: "rgba(238, 243, 95, 0.34)" }
} as const

export const spaceScaleTokens = {
  "s-1": "4px",
  "s-2": "8px",
  "s-3": "12px",
  "s-4": "16px",
  "s-5": "20px",
  "s-6": "24px",
  "s-8": "32px",
  "s-10": "40px",
  "s-12": "48px",
  "s-16": "64px",
  "s-20": "80px",
  "s-30": "120px"
} as const

/** theauth palette names mapped to the semantic CSS variables they alias. */
export const paletteAliasTokens = {
  void: "var(--floor-1)",
  obsidian: "var(--face-0)",
  carbon: "var(--face-1)",
  graphite: "var(--face-2)",
  slate: "var(--surface-3)",
  ash: "var(--color-border)",
  steel: "color-mix(in oklab, var(--color-border) 82%, var(--color-foreground))",
  fog: "var(--color-subtle)",
  smoke: "var(--color-muted)",
  cloud: "color-mix(in oklab, var(--color-muted) 75%, var(--color-foreground))",
  silver: "color-mix(in oklab, var(--color-foreground) 85%, var(--color-background))",
  white: "var(--color-foreground)",
  violet: "var(--color-accent)",
  live: "var(--color-signal-live)",
  teal: "var(--color-signal-ok)"
} as const

export type PaletteAliasName = keyof typeof paletteAliasTokens

/** Neutral solid fill (default `solid` variant). Overridden per base color via `data-glin-base`. */
export const solidTokens = {
  light: {
    fill: "oklch(0.168 0.004 264)",
    foreground: "oklch(0.99 0.002 240)",
    hover: "oklch(0.26 0.006 264)",
    active: "oklch(0.12 0.004 264)",
    ring: "linear-gradient(180deg, rgb(255 255 255 / 0.3), rgb(255 255 255 / 0.05) 45%, rgb(0 0 0 / 0.35))",
    highlight: "inset 0 1px 0 rgb(255 255 255 / 0.2)"
  },
  dark: {
    fill: "oklch(0.96 0.004 247)",
    foreground: "oklch(0.168 0.004 264)",
    hover: "oklch(1 0 0)",
    active: "oklch(0.86 0.006 247)",
    ring: "linear-gradient(180deg, rgb(255 255 255 / 0.9), rgb(0 0 0 / 0.05) 45%, rgb(0 0 0 / 0.3))",
    highlight: "inset 0 1px 0 rgb(255 255 255 / 0.9)"
  }
} as const

/** Status tones: `fill` carries `foreground` text, `text` is for soft, outline and ghost variants. */
export const toneTokens = {
  light: {
    success: { fill: "oklch(0.52 0.13 160)", foreground: "oklch(0.99 0.01 160)", text: "oklch(0.42 0.11 160)" },
    warning: { fill: "oklch(0.8 0.16 78)", foreground: "oklch(0.2 0.04 70)", text: "oklch(0.45 0.1 65)" },
    danger: { fill: "oklch(0.55 0.2 25)", foreground: "oklch(0.99 0.01 25)", text: "oklch(0.47 0.18 25)" },
    info: { fill: "oklch(0.54 0.16 250)", foreground: "oklch(0.99 0.01 250)", text: "oklch(0.44 0.14 255)" }
  },
  dark: {
    success: { fill: "oklch(0.74 0.15 160)", foreground: "oklch(0.18 0.04 160)", text: "oklch(0.84 0.13 160)" },
    warning: { fill: "oklch(0.84 0.15 82)", foreground: "oklch(0.2 0.04 70)", text: "oklch(0.88 0.13 85)" },
    danger: { fill: "oklch(0.7 0.18 25)", foreground: "oklch(0.17 0.04 25)", text: "oklch(0.82 0.12 20)" },
    info: { fill: "oklch(0.74 0.12 250)", foreground: "oklch(0.17 0.03 250)", text: "oklch(0.83 0.09 250)" }
  }
} as const

/** Hover and active states of the key buttons, plus glow and edge. */
export const keyStateTokens = {
  light: {
    topHover: "oklch(0.96 0.13 111)",
    bottomHover: "oklch(0.9 0.16 111)",
    topActive: "oklch(0.84 0.17 111)",
    bottomActive: "oklch(0.88 0.17 111)",
    whiteTopHover: "#f6f6f9",
    whiteBottomHover: "#dcdce3",
    whiteTopActive: "#dcdce3",
    whiteBottomActive: "#e6e6ec",
    glow: "oklch(0.62 0.17 111 / 0.35)",
    edge: "rgb(0 0 0 / 0.18)"
  },
  dark: {
    topHover: "#fbfdb4",
    bottomHover: "#f3f77a",
    topActive: "#e6eb4c",
    bottomActive: "#ecf159",
    whiteTopHover: "#f2f2f5",
    whiteBottomHover: "#cfcfd5",
    whiteTopActive: "#d2d2d7",
    whiteBottomActive: "#e2e2e6",
    glow: "rgba(238, 243, 95, 0.35)",
    edge: "rgba(0, 0, 0, 0.4)"
  }
} as const

/** Extra motion tokens: short and overlay durations and the exit curve. */
export const motionExtraTokens = {
  micro: "140ms",
  overlayIn: "200ms",
  overlayOut: "140ms",
  drawer: "320ms",
  easeExit: "cubic-bezier(0.4, 0, 1, 1)"
} as const

export const tokenContract = {
  solidTokens,
  toneTokens,
  keyStateTokens,
  motionExtraTokens,
  baseColors,
  floorTokens,
  faceTokens,
  hotRingTokens,
  hoverShadowTokens,
  hairlineInsetTokens,
  keyTokens,
  glowTokens,
  spaceScaleTokens,
  paletteAliasTokens,
  colorTokens,
  glassTokens,
  glassLevelTokens,
  glassOpacityScaleTokens,
  glassPerformanceTokens,
  glassLuminanceTokens,
  radiusTokens,
  spacingTokens,
  shadowTokens,
  motionTokens,
  surfaceTokens,
  elevationTokens,
  ringTokens,
  signalTokens,
  typeTokens,
  layoutTokens,
  easingTokens
} as const

export { baseColors }
export type { BaseColor, BaseColorId, BaseSwatch }
