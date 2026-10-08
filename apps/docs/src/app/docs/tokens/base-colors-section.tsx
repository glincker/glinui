"use client"

import * as React from "react"

import { Button, Input, ThemeScope, type GlinBase } from "@glinui/ui"
import { baseColors } from "@glinui/tokens"

import { CodeBlock } from "@/components/docs/code-block"
import { Segmented, type SegmentedOption } from "@/components/customize/segmented"

const options: Array<SegmentedOption<GlinBase>> = baseColors.map((b) => ({ value: b.id, label: b.label }))

const SCALE: Array<{ label: string; cls: string }> = [
  { label: "background", cls: "bg-[var(--color-background)]" },
  { label: "surface", cls: "bg-[var(--color-surface)]" },
  { label: "surface-2", cls: "bg-[var(--surface-2)]" },
  { label: "surface-3", cls: "bg-[var(--surface-3)]" },
  { label: "well", cls: "bg-[var(--surface-well)]" },
  { label: "border", cls: "bg-[var(--color-border)]" },
  { label: "muted", cls: "bg-[var(--color-muted)]" },
  { label: "subtle", cls: "bg-[var(--color-subtle)]" },
  { label: "solid", cls: "bg-[var(--neutral-solid)]" }
]

function Preview({ base, theme }: { base: GlinBase; theme: "light" | "dark" }) {
  return (
    <ThemeScope
      theme={theme}
      base={base}
      fill
      className="space-y-4 rounded-2xl border border-[color:var(--color-border)] p-4 text-[var(--color-foreground)]"
    >
      <p className="text-xs font-medium capitalize text-[var(--color-muted)]">{theme}</p>
      <ul aria-label={`${theme} neutral scale`} className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {SCALE.map((s) => (
          <li key={s.label} className="space-y-1">
            <span aria-hidden className={`block h-8 rounded-md border border-[color:var(--color-border)] ${s.cls}`} />
            <span className="block truncate font-mono text-[10px] text-[var(--color-muted)]">{s.label}</span>
          </li>
        ))}
      </ul>
      <div className="flex gap-3" aria-hidden>
        <span className="h-10 flex-1 rounded-lg bg-[var(--surface-1)] [box-shadow:var(--elev-1)]" />
        <span className="h-10 flex-1 rounded-lg bg-[var(--surface-1)] [box-shadow:var(--elev-2)]" />
        <span className="h-10 flex-1 rounded-lg bg-[var(--surface-1)] [box-shadow:var(--elev-3)]" />
      </div>
      <div className="space-y-3 rounded-xl bg-[var(--surface-1)] p-4 [box-shadow:var(--elev-2)]">
        <p className="text-sm font-medium">Sample card</p>
        <p className="text-sm text-[var(--color-muted)]">Muted copy on a raised surface.</p>
        <Input aria-label={`${theme} sample input`} placeholder="Email address" />
        <div className="flex gap-2">
          <Button size="sm" variant="solid">Primary</Button>
          <Button size="sm" variant="outline">Outline</Button>
        </div>
      </div>
    </ThemeScope>
  )
}

export function BaseColorsSection() {
  const [base, setBase] = React.useState<GlinBase>("zinc")
  const current = baseColors.find((b) => b.id === base)
  const snippet = [
    `import "@glinui/tokens/preferences.css"`,
    "",
    `// Whole app`,
    `<GlinProvider target="document" defaults={{ base: "${base}" }}>...</GlinProvider>`,
    "",
    `// One subtree`,
    `<ThemeScope base="${base}">...</ThemeScope>`,
    "",
    `<!-- Plain HTML -->`,
    `<html data-glin-base="${base}">`
  ].join("\n")
  return (
    <div className="space-y-4">
      <Segmented label="Base color" value={base} options={options} onChange={setBase} />
      <p className="text-sm text-[var(--color-muted)]" aria-live="polite">
        {current?.label}: {current?.description}
      </p>
      <div className="grid gap-4 lg:grid-cols-2">
        <Preview base={base} theme="light" />
        <Preview base={base} theme="dark" />
      </div>
      <CodeBlock code={snippet} language="tsx" />
    </div>
  )
}
