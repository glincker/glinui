"use client"

import * as React from "react"
import { Slot, Slottable } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "../lib/cn"
import { resolveSurfaceProps } from "../lib/surface-resolve"
import {
  interactiveSurface,
  surfaceVariants,
  type SurfaceTone,
  type SurfaceVariant
} from "../lib/surface"
import { useGlinStyle } from "./glin-provider"

const badgeBase =
  "inline-flex items-center whitespace-nowrap font-semibold transition-[transform,background-color,box-shadow,color,border-color,opacity] duration-fast ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-0)] motion-reduce:transition-none"

/** Component-specific looks that stay on top of the shared surface vocabulary. */
const EXTRA_VARIANTS = {
  liquid:
    "relative isolate overflow-hidden rounded-full border border-[color:var(--glass-border)] [border-top-color:var(--glass-refraction-top)] bg-[radial-gradient(circle_at_18%_16%,color-mix(in_oklab,var(--color-foreground)_10%,transparent),transparent_40%),var(--glass-readable)] text-[color:var(--color-foreground)] backdrop-blur-xl backdrop-saturate-[180%] [box-shadow:var(--glass-2-shadow)]",
  matte:
    "relative isolate overflow-hidden rounded-full border border-[color:var(--line-soft)] bg-[var(--surface-3)] text-[color:var(--color-foreground)] [box-shadow:var(--elev-1)]",
  glow:
    "rounded-full border border-[color:var(--ring-solid)] bg-[var(--neutral-solid)] text-[color:var(--neutral-solid-fg)] shadow-[0_0_16px_color-mix(in_oklab,var(--neutral-solid)_35%,transparent)]"
} as const

type ExtraVariant = keyof typeof EXTRA_VARIANTS
const EXTRA_NAMES = Object.keys(EXTRA_VARIANTS) as ExtraVariant[]

/** Soft tinted face for glinr when a tone is set: the raised pill carries the tone through color-mix. */
const GLINR_TONE_FACE = "[--face:var(--t-soft)]"

const badgeShape = cva("", {
  variants: {
    shape: {
      pill: "rounded-full",
      plain: "rounded-md font-semibold"
    },
    size: {
      sm: "h-5 px-2 text-[10px] tracking-wide",
      md: "h-6 px-2.5 text-xs",
      lg: "h-7 px-3 text-sm"
    }
  },
  defaultVariants: { shape: "pill", size: "md" }
})

const badgeVariants = (opts: {
  variant: SurfaceVariant | ExtraVariant
  tone?: SurfaceTone | null
  size?: "sm" | "md" | "lg" | null
  interactive?: boolean
}): string => {
  const { variant, tone, size, interactive } = opts
  if (variant in EXTRA_VARIANTS) {
    return cn(badgeBase, badgeShape({ shape: "pill", size }), EXTRA_VARIANTS[variant as ExtraVariant])
  }
  const v = variant as SurfaceVariant
  return cn(
    badgeBase,
    surfaceVariants({
      variant: v,
      tone: tone ?? "neutral",
      elevation: v === "glinr" || v === "solid" ? "auto" : "none"
    }),
    v === "glinr" && tone && tone !== "neutral" ? GLINR_TONE_FACE : "",
    badgeShape({ shape: v === "plain" ? "plain" : "pill", size }),
    interactive ? interactiveSurface({ variant: v }) : ""
  )
}

const dotTones = {
  accent: "bg-[var(--color-accent)] shadow-[0_0_8px_var(--color-accent)]",
  live: "bg-[var(--color-signal-live)] shadow-[0_0_8px_var(--color-signal-live)]",
  ok: "bg-[var(--color-signal-ok)] shadow-[0_0_8px_var(--color-signal-ok)]",
  violet: "bg-[var(--color-violet,var(--color-brand))] shadow-[0_0_8px_var(--color-violet,var(--color-brand))]"
} as const

export type BadgeDotTone = keyof typeof dotTones

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  {
    /**
     * Visual variant. Omit for the ambient design style (glinr by default).
     * Vocabulary: glinr, solid, plain, soft, outline, ghost, gradient, glass. Legacy names
     * (default, primary, secondary, destructive, success, warning, info, raised, frosted) still work;
     * liquid, matte and glow stay badge-specific.
     */
    variant?: SurfaceVariant | ExtraVariant | "default" | "primary" | "secondary" | "destructive" | "success" | "warning" | "info" | "raised" | "frosted"
    /** Colour tone for the vocabulary variants. */
    tone?: SurfaceTone
    size?: "sm" | "md" | "lg"
    /** Render the child element (for example an anchor) with badge styling. */
    asChild?: boolean
    /** Show a glowing status dot before the content. */
    dot?: boolean
    /** Dot color. */
    dotTone?: BadgeDotTone
  }

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, tone, size, asChild = false, dot = false, dotTone = "ok", children, ...props }, ref) => {
    const ambient = useGlinStyle()
    const { variant: surface, tone: aliasTone, extra } = resolveSurfaceProps(
      variant,
      ambient,
      "control",
      EXTRA_NAMES,
      { raised: "glinr" }
    )
    const resolved: SurfaceVariant | ExtraVariant = extra ?? surface
    const Comp = asChild ? Slot : "span"
    const dotNode = dot ? (
      <span
        aria-hidden="true"
        data-slot="badge-dot"
        className={cn("mr-1.5 size-1.5 shrink-0 rounded-full", dotTones[dotTone])}
      />
    ) : null

    return (
      <Comp ref={ref} data-variant={resolved}
        className={cn(badgeVariants({ variant: resolved, tone: tone ?? aliasTone, size, interactive: asChild }), className)}
        {...props}
      >
        {dotNode}
        {asChild ? <Slottable>{children}</Slottable> : children}
      </Comp>
    )
  }
)

Badge.displayName = "Badge"
