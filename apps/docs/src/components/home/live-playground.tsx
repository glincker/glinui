"use client"

import * as React from "react"

import { Badge, Button, Card, Input, Switch, ThemeScope } from "@glinui/ui"
import type { CardVariant, ThemeScopeBase } from "@glinui/ui"

import { SECTION_CLASS, SectionHeading } from "./surface"

const VARIANTS = ["glinr", "plain", "soft", "outline", "glass"] as const
const BASES: ThemeScopeBase[] = ["obsidian", "neutral", "zinc", "slate", "stone", "gray"]

const CHIP =
  "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg px-4 text-sm font-medium capitalize text-[var(--color-muted)] ring-1 ring-inset ring-[var(--line-soft)] transition-colors duration-150 hover:text-[var(--color-foreground)] peer-checked:bg-[var(--color-foreground)] peer-checked:text-[var(--color-background)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-accent)] motion-reduce:transition-none"

function Choice<T extends string>({
  legend,
  name,
  options,
  value,
  onChange
}: {
  legend: string
  name: string
  options: readonly T[]
  value: T
  onChange: (next: T) => void
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="type-eyebrow mb-3">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option} className="relative">
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="peer sr-only"
            />
            <span className={CHIP}>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

/** Try it: real components, two controls. Nothing here animates, so reduced motion needs no special case. */
export function LivePlayground() {
  const [variant, setVariant] = React.useState<(typeof VARIANTS)[number]>("glinr")
  const [base, setBase] = React.useState<ThemeScopeBase>("obsidian")

  return (
    <section aria-labelledby="try-title" className={SECTION_CLASS}>
      <SectionHeading
        id="try-title"
        eyebrow="Try it"
        title="Change the variant and the base color. The components follow."
        lead="Same components, same markup. Only the variant prop and the base token set change."
      />
      <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-8">
        <div className="space-y-8">
          <Choice legend="Variant" name="try-variant" options={VARIANTS} value={variant} onChange={setVariant} />
          <Choice legend="Base color" name="try-base" options={BASES} value={base} onChange={setBase} />
          <p className="type-caption" aria-live="polite">
            <code className="type-code">{`<Card variant="${variant}" />`}</code> with base <code className="type-code">{base}</code>
          </p>
        </div>
        <ThemeScope base={base} className="rounded-[var(--radius-xl)] bg-[var(--color-background)] p-4 sm:p-8">
          <Card variant={variant as CardVariant} className="space-y-5 p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[var(--color-foreground)]">Invite your team</p>
              <Badge variant="success" size="sm">Free</Badge>
            </div>
            <Input aria-label="Email address" placeholder="name@company.com" type="email" />
            <div className="flex items-center justify-between gap-3 text-sm text-[var(--color-muted)]">
              <span id="try-switch-label">Send a welcome note</span>
              <Switch aria-labelledby="try-switch-label" defaultChecked />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant={variant}>Send invite</Button>
              <Button variant="ghost">Cancel</Button>
            </div>
          </Card>
        </ThemeScope>
      </div>
    </section>
  )
}
