/**
 * Token reference data. Values mirror packages/tokens/theme.css.
 * Class strings are written out in full so Tailwind can see them.
 */
export type TokenRowData = {
  name: string
  light: string
  dark?: string
  note?: string
  /** Full class string for the 36px specimen box. */
  box: string
}

const chip = "size-9 rounded-md ring-1 ring-line-soft"

export const brandTokens: TokenRowData[] = [
  { name: "--color-accent", light: "oklch(0.55 0.2 289)", dark: "oklch(0.782 0.118 289.4)", note: "Violet accent for links, focus rings, and primary emphasis.", box: `${chip} bg-[var(--color-accent)]` },
  { name: "--color-accent-foreground", light: "oklch(0.99 0.003 290)", dark: "oklch(0.168 0.004 264.4)", note: "Text on top of the accent.", box: `${chip} bg-[var(--color-accent-foreground)]` },
  { name: "--color-brand", light: "var(--color-accent)", note: "Alias of the accent. Tailwind: bg-brand.", box: `${chip} bg-[var(--color-brand)]` },
  { name: "--color-brand-foreground", light: "var(--color-accent-foreground)", note: "Tailwind: text-brand-foreground.", box: `${chip} bg-[var(--color-brand-foreground)]` }
]

export const surfaceTokens: TokenRowData[] = [
  { name: "--surface-0", light: "var(--color-background)", note: "Page canvas. Tailwind: bg-surface-0.", box: `${chip} bg-[var(--surface-0)]` },
  { name: "--surface-1", light: "var(--color-surface)", note: "Cards and panels, one step above the page.", box: `${chip} bg-[var(--surface-1)]` },
  { name: "--surface-2", light: "oklch(0.97 0.003 245)", dark: "oklch(0.242 0.007 248.1)", note: "Hover states and raised rows.", box: `${chip} bg-[var(--surface-2)]` },
  { name: "--surface-3", light: "oklch(0.94 0.005 246)", dark: "oklch(0.263 0.045 281)", note: "Highest tonal step, popovers and selected items.", box: `${chip} bg-[var(--surface-3)]` },
  { name: "--surface-well", light: "oklch(0.955 0.004 246)", dark: "oklch(0.139 0.003 246.3)", note: "Recessed areas such as code blocks and previews.", box: `${chip} bg-[var(--surface-well)]` }
]

export const semanticTokens: TokenRowData[] = [
  { name: "--color-background", light: "oklch(0.985 0.002 240)", dark: "oklch(0.168 0.004 264.4)", note: "Tailwind: bg-background.", box: `${chip} bg-[var(--color-background)]` },
  { name: "--color-foreground", light: "oklch(0.23 0.01 248)", dark: "oklch(0.95 0.01 247)", note: "Primary text. Tailwind: text-foreground.", box: `${chip} bg-[var(--color-foreground)]` },
  { name: "--color-border", light: "oklch(0.89 0.01 246)", dark: "oklch(0.323 0.009 248.1)", note: "Strong dividers. Tailwind: border-border.", box: `${chip} bg-[var(--color-border)]` },
  { name: "--color-muted", light: "oklch(0.52 0.014 270)", dark: "oklch(0.646 0.013 286)", note: "Secondary text. Tailwind: text-muted.", box: `${chip} bg-[var(--color-muted)]` },
  { name: "--color-subtle", light: "oklch(0.65 0.013 280)", dark: "oklch(0.498 0.014 281)", note: "Tertiary text and placeholders. Tailwind: text-subtle.", box: `${chip} bg-[var(--color-subtle)]` },
  { name: "--color-signal-live", light: "oklch(0.62 0.17 111)", dark: "oklch(0.933 0.167 111.1)", note: "Live and active status.", box: `${chip} bg-[var(--color-signal-live)]` },
  { name: "--color-signal-ok", light: "oklch(0.6 0.14 175)", dark: "oklch(0.752 0.141 175.3)", note: "Success and healthy status.", box: `${chip} bg-[var(--color-signal-ok)]` }
]

const tile = "size-9 rounded-md bg-surface-1"

export const elevationTokens: TokenRowData[] = [
  { name: "--elev-1", light: "var(--highlight), var(--drop-1)", note: "Resting cards. Tailwind: shadow-elev-1.", box: `${tile} shadow-elev-1` },
  { name: "--elev-2", light: "var(--highlight), var(--drop-2)", note: "Raised panels and hovered cards.", box: `${tile} shadow-elev-2` },
  { name: "--elev-3", light: "var(--highlight), var(--drop-3)", note: "Popovers, menus, and dialogs.", box: `${tile} shadow-elev-3` },
  { name: "--elev-inset", light: "inset 0 2px 4px rgb(0 0 0 / 0.08), inset 0 0 0 1px rgb(0 0 0 / 0.04)", note: "Recessed wells and inputs.", box: "size-9 rounded-md bg-surface-well shadow-elev-inset" },
  { name: "--drop-1", light: "0 1px 1px rgb(0 0 0 / 0.06), 0 3px 6px -2px rgb(0 0 0 / 0.08)", note: "Drop shadow only, without the top highlight. Tailwind: shadow-drop-1.", box: `${tile} shadow-drop-1` },
  { name: "--ring", light: "linear-gradient(180deg, edge / 0.14, edge / 0.05 40%, edge / 0.07)", note: "Gradient edge, strongest at the top. Use as a 1px padded wrapper background.", box: "size-9 rounded-md bg-[image:var(--ring)] p-px [&>span]:block [&>span]:size-full [&>span]:rounded-[5px] [&>span]:bg-surface-1" },
  { name: "--hairline", light: "linear-gradient(90deg, transparent, edge / 0.12, transparent)", note: "Fading 1px divider, for section tops.", box: "h-px w-9 self-center bg-[image:var(--hairline)]" },
  { name: "--line-soft", light: "rgb(0 0 0 / 0.07)", dark: "rgb(255 255 255 / 0.07)", note: "Soft border. Tailwind: border-line-soft.", box: "size-9 rounded-md border border-line-soft" }
]

export const radiusTokens: TokenRowData[] = [
  { name: "--radius-card", light: "0.75rem", note: "Cards and panels. Tailwind: rounded-card.", box: "size-9 rounded-card border border-line-soft bg-surface-2" },
  { name: "--radius-input", light: "0.5rem", note: "Inputs and buttons. Tailwind: rounded-input.", box: "size-9 rounded-input border border-line-soft bg-surface-2" },
  { name: "--radius-pill", light: "9999px", note: "Chips and badges. Tailwind: rounded-pill.", box: "h-9 w-12 rounded-pill border border-line-soft bg-surface-2" },
  { name: "--radius-sm", light: "0.5rem", note: "Legacy scale, still used by older components.", box: "size-9 rounded-[var(--radius-sm)] border border-line-soft bg-surface-2" },
  { name: "--radius-md", light: "0.75rem", box: "size-9 rounded-[var(--radius-md)] border border-line-soft bg-surface-2" },
  { name: "--radius-lg", light: "1rem", box: "size-9 rounded-[var(--radius-lg)] border border-line-soft bg-surface-2" },
  { name: "--radius-xl", light: "1.25rem", box: "size-9 rounded-[var(--radius-xl)] border border-line-soft bg-surface-2" },
  { name: "--radius-2xl", light: "1.75rem", box: "size-9 rounded-[var(--radius-2xl)] border border-line-soft bg-surface-2" }
]

const bar = "h-3 rounded-sm bg-brand/70"

export const layoutTokens: TokenRowData[] = [
  { name: "--layout-max", light: "1200px", note: "Content max width. Tailwind: max-w-layout.", box: "h-3 w-12 rounded-sm bg-brand/70" },
  { name: "--layout-gutter", light: "clamp(16px, 4vw, 32px)", note: "Page side padding. Tailwind: px-gutter.", box: "h-3 w-4 rounded-sm bg-brand/70" },
  { name: "--layout-section", light: "clamp(64px, 9vw, 120px)", note: "Vertical section rhythm. Tailwind: py-section.", box: "h-3 w-8 rounded-sm bg-brand/70" },
  { name: "--layout-nav-h", light: "64px", note: "Top bar height. Tailwind: h-nav.", box: "h-3 w-6 rounded-sm bg-brand/70" },
  { name: "--space-xs", light: "0.25rem", box: `${bar} w-[var(--space-xs)]` },
  { name: "--space-sm", light: "0.5rem", box: `${bar} w-[var(--space-sm)]` },
  { name: "--space-md", light: "0.75rem", box: `${bar} w-[var(--space-md)]` },
  { name: "--space-lg", light: "1rem", box: `${bar} w-[var(--space-lg)]` },
  { name: "--space-xl", light: "1.5rem", box: `${bar} w-[var(--space-xl)]` },
  { name: "--space-2xl", light: "2rem", box: `${bar} w-[var(--space-2xl)]` }
]

export const motionTokenRows: TokenRowData[] = [
  { name: "--motion-fast", light: "150ms", note: "Hover and press feedback.", box: "h-3 w-3 rounded-sm bg-brand/70" },
  { name: "--motion-normal", light: "250ms", note: "Menus, tooltips, small reveals.", box: "h-3 w-5 rounded-sm bg-brand/70" },
  { name: "--motion-slow", light: "400ms", note: "Large surfaces and page level shifts.", box: "h-3 w-8 rounded-sm bg-brand/70" },
  { name: "--motion-spring", light: "500ms", note: "Settle time for spring-like overshoot.", box: "h-3 w-10 rounded-sm bg-brand/70" },
  { name: "--ease-out", light: "cubic-bezier(0.23, 1, 0.32, 1)", note: "Entrances and hovers. Tailwind: ease-out.", box: "size-9 rounded-md border border-line-soft bg-surface-2" },
  { name: "--ease-in-out", light: "cubic-bezier(0.77, 0, 0.175, 1)", note: "On-screen movement and morphs.", box: "size-9 rounded-md border border-line-soft bg-surface-2" },
  { name: "--ease-drawer", light: "cubic-bezier(0.32, 0.72, 0, 1)", note: "Sheets and docked panels.", box: "size-9 rounded-md border border-line-soft bg-surface-2" }
]

export const typeScale = [
  { name: "--text-caption", value: "0.75rem", cls: "text-caption" },
  { name: "--text-sm", value: "0.875rem", cls: "text-sm" },
  { name: "--text-body", value: "1rem", cls: "text-body" },
  { name: "--text-lead", value: "1.1875rem", cls: "text-lead" },
  { name: "--text-sub", value: "1.25rem", cls: "text-sub" },
  { name: "--text-h3", value: "2rem", cls: "text-h3" },
  { name: "--text-h2", value: "clamp(2rem, 4.2vw, 3rem)", cls: "text-h2" },
  { name: "--text-display", value: "clamp(2.75rem, 6.4vw, 4.25rem)", cls: "text-display" }
] as const

export const glassCoreTokens: TokenRowData[] = [
  { name: "--glass-blur-sm", light: "8px", box: "h-3 w-2 rounded-sm bg-brand/70" },
  { name: "--glass-blur-md", light: "16px", box: "h-3 w-4 rounded-sm bg-brand/70" },
  { name: "--glass-blur-lg", light: "24px", box: "h-3 w-6 rounded-sm bg-brand/70" },
  { name: "--glass-blur-xl", light: "40px", box: "h-3 w-10 rounded-sm bg-brand/70" },
  { name: "--glass-saturate-base", light: "180%", note: "Always paired with blur in backdrop-filter.", box: "size-9 rounded-md bg-gradient-to-br from-brand to-signal-ok" },
  { name: "--glass-border", light: "rgb(255 255 255 / 0.20)", dark: "rgb(255 255 255 / 0.10)", note: "Hairline border on glass.", box: "size-9 rounded-md border-2 border-[var(--glass-border)] bg-neutral-500" },
  { name: "--glass-refraction-top", light: "rgb(255 255 255 / 0.40)", dark: "rgb(255 255 255 / 0.15)", note: "Brighter top edge that simulates light refraction.", box: "size-9 rounded-md border-2 border-neutral-500 [border-top-color:var(--glass-refraction-top)] bg-neutral-500" },
  { name: "--shadow-glass-md", light: "0 8px 24px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)", box: "size-9 rounded-md bg-surface-1 [box-shadow:var(--shadow-glass-md)]" }
]

export const glassLevels = [
  { id: "glass-1", blur: "8px", opacity: "0.08 light, 0.20 dark" },
  { id: "glass-2", blur: "12px", opacity: "0.12 light, 0.30 dark" },
  { id: "glass-3", blur: "16px", opacity: "0.18 light, 0.40 dark" },
  { id: "glass-4", blur: "24px", opacity: "0.25 light, 0.55 dark" },
  { id: "glass-5", blur: "40px", opacity: "0.35 light, 0.70 dark" }
] as const
