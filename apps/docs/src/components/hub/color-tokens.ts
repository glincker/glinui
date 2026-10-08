export type ColorTokenSpec = {
  name: string
  label: string
  /** Literal Tailwind classes so no style prop is needed. */
  bgClass: string
  usage: string
  /** Token this color is measured against for contrast. */
  against: string
}

export type ColorGroup = { id: string; title: string; blurb: string; tokens: ColorTokenSpec[] }

function spec(name: string, label: string, bgClass: string, against = "--color-background"): ColorTokenSpec {
  return { name, label, bgClass, usage: bgClass, against }
}

export const colorGroups: ColorGroup[] = [
  {
    id: "brand",
    title: "Brand accent",
    blurb: "One violet hue carries every action, focus ring, and highlight.",
    tokens: [
      spec("--color-accent", "Accent", "bg-[var(--color-accent)]"),
      spec("--color-accent-foreground", "Accent foreground", "bg-[var(--color-accent-foreground)]", "--color-accent")
    ]
  },
  {
    id: "surfaces",
    title: "Neutral surface scale",
    blurb: "Tonal stacking: 0 is the page, 3 is the highest raised layer. The well sits below the page.",
    tokens: [
      spec("--surface-0", "Surface 0", "bg-[var(--surface-0)]", "--color-foreground"),
      spec("--surface-1", "Surface 1", "bg-[var(--surface-1)]", "--color-foreground"),
      spec("--surface-2", "Surface 2", "bg-[var(--surface-2)]", "--color-foreground"),
      spec("--surface-3", "Surface 3", "bg-[var(--surface-3)]", "--color-foreground"),
      spec("--surface-well", "Surface well", "bg-[var(--surface-well)]", "--color-foreground")
    ]
  },
  {
    id: "semantic",
    title: "Semantic colors",
    blurb: "Role based names. Use these in components, never raw values.",
    tokens: [
      spec("--color-background", "Background", "bg-[var(--color-background)]", "--color-foreground"),
      spec("--color-foreground", "Foreground", "bg-[var(--color-foreground)]"),
      spec("--color-surface", "Surface", "bg-[var(--color-surface)]", "--color-foreground"),
      spec("--color-border", "Border", "bg-[var(--color-border)]"),
      spec("--color-muted", "Muted", "bg-[var(--color-muted)]"),
      spec("--color-subtle", "Subtle", "bg-[var(--color-subtle)]")
    ]
  },
  {
    id: "signal",
    title: "Signal colors",
    blurb: "Status accents for live and healthy states. Pair with text, never color alone.",
    tokens: [
      spec("--color-signal-live", "Signal live", "bg-[var(--color-signal-live)]"),
      spec("--color-signal-ok", "Signal ok", "bg-[var(--color-signal-ok)]")
    ]
  }
]

export const allColorTokens: ColorTokenSpec[] = colorGroups.flatMap((g) => g.tokens)

export const elevationTokens = ["--elev-1", "--elev-2", "--elev-3", "--ring", "--hairline", "--line-soft"] as const
