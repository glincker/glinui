"use client"

import * as React from "react"
import { Check, Copy, Heart } from "@phosphor-icons/react"
import { useTheme } from "next-themes"

import {
  Button,
  GLIN_BASES,
  GLIN_ICON_WEIGHTS,
  useGlinConfig,
  type GlinAccent,
  type GlinBase,
  type GlinEngine,
  type GlinIconWeight,
  type GlinMotion,
  type GlinRadius,
  type GlinStyle
} from "@glinui/ui"

import { hasEngine } from "@glinui/motion"

import "@/components/engines/register-engines"
import { toAiPrompt, toCssSnippet, toReactSnippet } from "./export-config"
import { Segmented, type SegmentedOption } from "./segmented"

const ACCENT_DOTS: Record<GlinAccent, string> = {
  violet: "bg-[oklch(0.55_0.2_289)]",
  blue: "bg-[oklch(0.55_0.2_255)]",
  emerald: "bg-[oklch(0.52_0.14_160)]",
  amber: "bg-[oklch(0.7_0.16_70)]",
  rose: "bg-[oklch(0.55_0.22_15)]",
  neutral: "bg-[oklch(0.25_0_0)] dark:bg-[oklch(0.93_0_0)]"
}

const accents: Array<SegmentedOption<GlinAccent>> = (Object.keys(ACCENT_DOTS) as GlinAccent[]).map((value) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
  content: <span aria-hidden className={`size-4 rounded-full ring-1 ring-black/10 dark:ring-white/20 ${ACCENT_DOTS[value]}`} />
}))

const BASE_LABELS: Record<GlinBase, string> = {
  obsidian: "Obsidian",
  neutral: "Neutral",
  zinc: "Zinc",
  slate: "Slate",
  stone: "Stone",
  gray: "Gray"
}

/** Each swatch is scoped with its own data-glin-base, so it previews live in the current theme. */
const bases: Array<SegmentedOption<GlinBase>> = GLIN_BASES.map((value) => ({
  value,
  label: BASE_LABELS[value],
  content: (
    <span className="flex w-full flex-col items-stretch gap-1 py-0.5">
      <span
        aria-hidden
        data-glin-base={value}
        className="flex h-8 w-full items-center gap-1 rounded-md border border-[color:var(--color-border)] bg-[var(--color-background)] px-1.5"
      >
        <span className="h-4 w-4 rounded-full bg-[var(--neutral-solid)]" />
        <span className="h-3 w-3 rounded-sm bg-[var(--surface-3)]" />
        <span className="h-3 w-3 rounded-sm bg-[var(--color-muted)]" />
      </span>
      <span className="text-center text-[10px] font-medium leading-tight">{BASE_LABELS[value]}</span>
    </span>
  )
}))

const weights: Array<SegmentedOption<GlinIconWeight>> = GLIN_ICON_WEIGHTS.map((value) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
  content: <Heart aria-hidden weight={value} size={16} />
}))

const radii: Array<SegmentedOption<GlinRadius>> = [
  { value: "sharp", label: "Sharp" },
  { value: "default", label: "Default" },
  { value: "round", label: "Round" }
]
const motions: Array<SegmentedOption<GlinMotion>> = [
  { value: "full", label: "Full" },
  { value: "subtle", label: "Subtle" },
  { value: "none", label: "Off" },
  { value: "system", label: "System" }
]
const ENGINE_LABELS: Record<GlinEngine, string> = { css: "CSS", motion: "Motion", gsap: "GSAP" }

const styleThumb = "flex h-9 w-full items-center gap-1.5 px-2"
const styleBar = "h-1.5 w-6 rounded-full"

function StyleOption({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <span className="flex w-full flex-col items-stretch gap-1 py-0.5">
      {children}
      <span className="text-center text-[10px] font-medium leading-tight">{label}</span>
    </span>
  )
}

const styles: Array<SegmentedOption<GlinStyle>> = [
  {
    value: "glinr",
    label: "Glinr",
    content: (
      <StyleOption label="Glinr">
        <span aria-hidden className={`${styleThumb} rounded-[10px] border border-transparent [background:var(--sheen)_padding-box,linear-gradient(var(--face-1),var(--face-1))_padding-box,var(--ring)_border-box] [box-shadow:var(--elev-1)]`}>
        <span className="h-4 w-4 rounded-full bg-[var(--face-3,var(--surface-3))] [box-shadow:var(--elev-1)]" />
        <span className={`${styleBar} bg-[var(--surface-well)] [box-shadow:var(--elev-inset)]`} />
      </span>
      </StyleOption>
    )
  },
  {
    value: "minimal",
    label: "Minimal (plain)",
    content: (
      <StyleOption label="Minimal (plain)">
        <span aria-hidden className={`${styleThumb} rounded-md border border-[color:var(--color-border)] bg-[var(--surface-1)]`}>
        <span className="h-4 w-4 rounded-md bg-[var(--neutral-solid)]" />
        <span className={`${styleBar} bg-[var(--surface-3)]`} />
      </span>
      </StyleOption>
    )
  },
  {
    value: "glass",
    label: "Glass",
    content: (
      <StyleOption label="Glass">
        <span aria-hidden className="flex h-9 w-full items-center rounded-[10px] bg-[linear-gradient(135deg,oklch(0.7_0.15_300),oklch(0.75_0.12_200))] p-1">
        <span className={`${styleThumb} h-full rounded-lg border border-[color:var(--glass-border)] bg-[var(--glass-readable)] backdrop-blur-sm`}>
          <span className={`${styleBar} bg-[var(--surface-3)]`} />
        </span>
      </span>
      </StyleOption>
    )
  }
]
const themes: Array<SegmentedOption<"light" | "dark" | "system">> = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" }
]

type CopyKind = "react" | "css" | "ai"

export function CustomizePanel() {
  const { config, setConfig, reset } = useGlinConfig()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [copied, setCopied] = React.useState<CopyKind | null>(null)

  React.useEffect(() => setMounted(true), [])

  const engines: Array<SegmentedOption<GlinEngine>> = (Object.keys(ENGINE_LABELS) as GlinEngine[]).map((value) => {
    const missing = mounted && value !== "css" && !hasEngine(value)
    return {
      value,
      label: ENGINE_LABELS[value],
      disabled: missing,
      hint: missing ? `${ENGINE_LABELS[value]} engine is not registered. Import "@glinui/motion/register/${value}".` : undefined
    }
  })

  const copy = async (kind: CopyKind) => {
    const text = kind === "react" ? toReactSnippet(config) : kind === "css" ? toCssSnippet(config) : toAiPrompt(config)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(kind)
      window.setTimeout(() => setCopied((current) => (current === kind ? null : current)), 1600)
    } catch {
      setCopied(null)
    }
  }

  const copyButtons: Array<{ kind: CopyKind; label: string }> = [
    { kind: "react", label: "React" },
    { kind: "css", label: "CSS" },
    { kind: "ai", label: "AI prompt" }
  ]

  return (
    <div className="space-y-3.5">
      <Segmented
        label="Design style"
        value={config.style}
        options={styles}
        columns={3}
        onChange={(style) => setConfig({ style })}
      />
      <Segmented
        label="Theme"
        value={(mounted ? (theme as "light" | "dark" | "system") : "system") ?? "system"}
        options={themes}
        onChange={setTheme}
      />
      <Segmented label="Accent" value={config.accent} options={accents} onChange={(accent) => setConfig({ accent })} />
      <Segmented label="Base color" value={config.base} options={bases} columns={3} onChange={(base) => setConfig({ base })} />
      <Segmented label="Radius" value={config.radius} options={radii} onChange={(radius) => setConfig({ radius })} />
      <Segmented label="Motion" value={config.motion} options={motions} onChange={(motion) => setConfig({ motion })} />
      <Segmented
        label="Animation engine"
        value={config.engine}
        options={engines}
        onChange={(engine) => setConfig({ engine })}
      />
      <Segmented
        label="Icon weight"
        value={config.iconWeight}
        options={weights}
        onChange={(iconWeight) => setConfig({ iconWeight })}
      />

      <div className="space-y-1.5 border-t border-[var(--line-soft)] pt-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">Copy config</span>
          <button
            type="button"
            onClick={() => {
              reset()
              setTheme("system")
            }}
            className="rounded px-1.5 py-0.5 text-xs text-neutral-600 underline-offset-2 hover:text-[var(--color-foreground)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] dark:text-neutral-300"
          >
            Reset
          </button>
        </div>
        <div role="group" aria-label="Copy config" className="grid grid-cols-3 gap-1.5">
          {copyButtons.map(({ kind, label }) => (
            <Button key={kind} type="button" variant="outline" size="sm" onClick={() => copy(kind)} className="gap-1 px-2 text-xs">
              {copied === kind ? <Check aria-hidden size={14} /> : <Copy aria-hidden size={14} />}
              <span>{copied === kind ? "Copied" : label}</span>
            </Button>
          ))}
        </div>
        <p className="sr-only" role="status" aria-live="polite">
          {copied ? "Copied to clipboard" : ""}
        </p>
      </div>
    </div>
  )
}
