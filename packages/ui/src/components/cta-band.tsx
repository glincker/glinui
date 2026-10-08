"use client"

import * as React from "react"

import { cn } from "../lib/cn"
import { resolveBlockVariant, type BlockVariant } from "./block-shell"
import { Button } from "./button"
import { useGlinStyle } from "./glin-provider"
import { Heading } from "./heading"
import { Input } from "./input"
import { Text } from "./text"

export type CtaAction = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & {
  label: React.ReactNode
}

export type CtaEmailCapture = {
  /** Visible to assistive tech only. */
  label?: string
  placeholder?: string
  buttonLabel?: React.ReactNode
  name?: string
  onSubmit?: (email: string) => void
}

export type CtaBandLayout = "centered" | "split" | "boxed-gradient"

export type CtaBandProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  layout?: CtaBandLayout
  /** Shell look. Omit to follow the ambient style. */
  variant?: BlockVariant
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  primary?: CtaAction
  secondary?: CtaAction
  /** Built-in email capture form (the split layout shows it in place of the actions). */
  emailCapture?: CtaEmailCapture
  /** Free slot under the actions, for a custom form or fine print. */
  footnote?: React.ReactNode
  /** Soft token glow behind the content. On by default for `boxed-gradient`. */
  glow?: boolean
  /** Decorative background slot such as a gradient mesh. Rendered aria-hidden behind the content. */
  background?: React.ReactNode
}

const SHELL: Record<BlockVariant, string> = {
  glinr:
    "rounded-[var(--lift-r-outer)] border border-transparent [background:var(--sheen)_padding-box,linear-gradient(var(--face-1,var(--surface-1)),var(--face-1,var(--surface-1)))_padding-box,var(--ring)_border-box] [box-shadow:var(--elev-2)]",
  plain: "rounded-lg border border-[var(--color-border)] bg-[var(--surface-1)] shadow-sm",
  glass:
    "rounded-2xl border border-[color:var(--glass-border)] [border-top-color:var(--glass-refraction-top)] bg-[var(--glass-readable)] bg-clip-padding [box-shadow:var(--glass-2-shadow)] backdrop-blur-xl backdrop-saturate-[180%]"
}

const GLOW =
  "pointer-events-none absolute inset-0 -z-0 [background:radial-gradient(60%_80%_at_20%_0%,var(--glow-a),transparent_70%),radial-gradient(50%_70%_at_85%_100%,var(--glow-b),transparent_70%)] opacity-70 forced-colors:hidden"

function EmailForm({ config, align }: { config: CtaEmailCapture; align: "center" | "start" }) {
  const inputId = React.useId()
  const [value, setValue] = React.useState("")
  return (
    <form
      className={cn("flex w-full max-w-md flex-col gap-2 sm:flex-row", align === "center" && "mx-auto")}
      onSubmit={(event) => {
        event.preventDefault()
        config.onSubmit?.(value)
      }}
    >
      <label htmlFor={inputId} className="sr-only">
        {config.label ?? "Email address"}
      </label>
      <Input
        id={inputId}
        type="email"
        name={config.name ?? "email"}
        required
        autoComplete="email"
        placeholder={config.placeholder ?? "you@example.com"}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="flex-1"
      />
      <Button type="submit">{config.buttonLabel ?? "Subscribe"}</Button>
    </form>
  )
}

function Actions({ primary, secondary, center }: { primary?: CtaAction; secondary?: CtaAction; center: boolean }) {
  if (!primary && !secondary) return null
  const { label: pl, ...pa } = primary ?? { label: null }
  const { label: sl, ...sa } = secondary ?? { label: null }
  return (
    <div className={cn("flex flex-wrap gap-3", center && "justify-center")}>
      {primary ? (
        <Button asChild size="lg">
          <a {...pa}>{pl}</a>
        </Button>
      ) : null}
      {secondary ? (
        <Button asChild size="lg" variant="outline">
          <a {...sa}>{sl}</a>
        </Button>
      ) : null}
    </div>
  )
}

/** Closing call to action. Layouts: `centered`, `split` (copy left, form or actions right), `boxed-gradient` (shell with token glow). */
export const CtaBand = React.forwardRef<HTMLElement, CtaBandProps>(
  (
    { layout = "centered", variant, eyebrow, title, description, primary, secondary, emailCapture, footnote, glow, background, className, ...props },
    ref
  ) => {
    const id = React.useId()
    const headingId = `${id}-title`
    const look = resolveBlockVariant(variant, useGlinStyle())
    const boxed = layout === "boxed-gradient"
    const showGlow = glow ?? boxed
    const split = layout === "split"
    const center = !split

    const copy = (
      <div className={cn("flex flex-col gap-3", center ? "items-center text-center" : "items-start")}>
        {eyebrow ? <Text variant="eyebrow">{eyebrow}</Text> : null}
        <Heading id={headingId} level={2} size="h2" className={center ? "max-w-2xl" : undefined}>
          {title}
        </Heading>
        {description ? <Text lead>{description}</Text> : null}
      </div>
    )

    const actions = (
      <div className={cn("flex flex-col gap-4", center && "items-center")}>
        {emailCapture ? <EmailForm config={emailCapture} align={center ? "center" : "start"} /> : null}
        {!emailCapture || center ? <Actions primary={primary} secondary={secondary} center={center} /> : null}
        {footnote ? <div className="text-xs text-[var(--color-muted)]">{footnote}</div> : null}
      </div>
    )

    const inner = (
      <>
        {showGlow ? <div aria-hidden="true" data-slot="glow" className={GLOW} /> : null}
        {background ? (
          <div aria-hidden="true" data-slot="background" className="pointer-events-none absolute inset-0 overflow-hidden">
            {background}
          </div>
        ) : null}
        <div
          className={cn(
            "relative z-10",
            split ? "grid items-center gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-12" : "flex flex-col items-center gap-8"
          )}
        >
          {copy}
          {actions}
        </div>
      </>
    )

    return (
      <section
        ref={ref}
        aria-labelledby={headingId}
        data-layout={layout}
        data-variant={look}
        className={cn("w-full px-4 py-12 sm:px-6 sm:py-16", className)}
        {...props}
      >
        <div
          className={cn(
            "relative mx-auto max-w-6xl overflow-hidden px-6 py-12 sm:px-12 sm:py-16",
            boxed || split ? SHELL[look] : undefined
          )}
        >
          {inner}
        </div>
      </section>
    )
  }
)

CtaBand.displayName = "CtaBand"
