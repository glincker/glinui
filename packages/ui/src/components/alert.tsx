"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import {
  CheckCircle,
  Info,
  Sparkle,
  Warning,
  WarningOctagon
} from "@phosphor-icons/react/dist/ssr"

import { cn } from "../lib/cn"
import { resolveVariant, surfaceVariants, type SurfaceTone, type SurfaceVariant } from "../lib/surface"
import { useGlinStyle } from "./glin-provider"

/* Alert variants ---------------------------------------------------------- */

/**
 * Layout shared by every look. The icon is a direct `svg` child, absolutely placed at the inline start,
 * and the content shifts to make room (logical properties, so RTL mirrors).
 */
const alertBase =
  "relative w-full text-sm transition-[background-color,border-color,box-shadow,color] duration-normal ease-standard [&>svg]:absolute [&>svg]:start-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:ps-12 motion-reduce:transition-none"

/** Left accent bar in the tone color. */
const ACCENT_BAR =
  "overflow-hidden before:pointer-events-none before:absolute before:inset-y-0 before:start-0 before:w-1 before:bg-[var(--t-bg)]"

const ICON_TONE = "[&>svg]:text-[color:var(--t-text)]"

const alertSizeVariants = cva("", {
  variants: {
    size: { sm: "p-3", md: "p-4", lg: "p-5" }
  },
  defaultVariants: { size: "md" }
})

/** Looks that are not part of the shared vocabulary and stay as they were. */
const LEGACY_LOOKS = {
  liquid:
    "relative isolate overflow-hidden border-white/20 [border-top-color:var(--glass-refraction-top)] bg-[radial-gradient(circle_at_18%_16%,rgb(255_255_255_/_0.88),transparent_40%),linear-gradient(148deg,rgb(255_255_255_/_0.74),rgb(232_232_232_/_0.5))] text-[var(--color-foreground)] backdrop-blur-xl backdrop-saturate-[180%] shadow-[0_0_0_1px_rgb(255_255_255_/_0.2)_inset,0_10px_24px_-14px_rgb(2_6_23_/_0.3)] before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_80%_72%,rgb(255_255_255_/_0.34),transparent_48%)] before:opacity-80 dark:border-white/[0.12] dark:bg-[linear-gradient(145deg,rgb(255_255_255_/_0.14),rgb(255_255_255_/_0.05))] dark:shadow-[0_0_0_1px_rgb(255_255_255_/_0.1)_inset,0_10px_24px_-14px_rgb(0_0_0_/_0.45)] dark:before:opacity-55",
  matte:
    "relative isolate overflow-hidden border-black/10 bg-[linear-gradient(180deg,rgb(250_250_250),rgb(234_234_236))] text-neutral-900 shadow-[0_1px_0_rgb(255_255_255_/_0.92)_inset,0_6px_16px_-10px_rgb(15_23_42_/_0.25)] before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(180deg,rgb(255_255_255_/_0.62),transparent)] dark:border-white/[0.14] dark:bg-[linear-gradient(180deg,rgb(53_58_67_/_0.92),rgb(34_38_46_/_0.92))] dark:text-neutral-100 dark:shadow-[0_1px_0_rgb(255_255_255_/_0.12)_inset,0_6px_16px_-10px_rgb(0_0_0_/_0.5)] dark:before:bg-[linear-gradient(180deg,rgb(255_255_255_/_0.12),transparent)]",
  glow:
    "border-white/20 bg-neutral-900 text-white shadow-[0_0_0_1px_rgb(255_255_255_/_0.12)_inset,0_0_20px_rgb(255_255_255_/_0.15)] [&>svg]:text-white dark:border-white/40 dark:bg-neutral-100 dark:text-neutral-950 dark:shadow-[0_0_0_1px_rgb(255_255_255_/_0.55),0_0_20px_rgb(255_255_255_/_0.25)] dark:[&>svg]:text-neutral-950",
  note:
    "gap-1 border-transparent text-[var(--color-foreground)] [--face:var(--face-1,var(--surface-2))] [--elev:var(--elev-1)] [--ring-img:var(--ring)] [background:var(--sheen)_padding-box,linear-gradient(var(--face),var(--face))_padding-box,var(--ring-img)_border-box] [box-shadow:var(--elev)] [&>svg]:text-[var(--color-muted)]",
  flag:
    "gap-1 border-transparent text-[var(--color-foreground)] [--face:var(--face-1,var(--surface-2))] [--elev:var(--elev-1)] [--ring-img:var(--ring-violet,var(--ring-brand))] [background:var(--sheen)_padding-box,linear-gradient(var(--face),var(--face))_padding-box,var(--ring-img)_border-box] [box-shadow:var(--elev)] [&>svg]:text-[var(--color-violet,var(--color-brand))] [&_[data-slot=alert-title]]:text-[var(--color-violet,var(--color-brand))]"
} as const

export type AlertVariant =
  | SurfaceVariant
  | "default"
  | "destructive"
  | "success"
  | "warning"
  | "info"
  | keyof typeof LEGACY_LOOKS

/** Legacy tone-bearing variant names map to a soft tinted alert in that tone. */
const LEGACY_TONES: Readonly<Record<string, SurfaceTone>> = {
  destructive: "danger",
  success: "success",
  warning: "warning",
  info: "info"
}

const TONE_ICONS: Record<SurfaceTone, React.ElementType> = {
  neutral: Info,
  accent: Sparkle,
  success: CheckCircle,
  warning: Warning,
  danger: WarningOctagon,
  info: Info
}

const PLAIN_LOOK =
  "rounded-lg border bg-[var(--surface-1)] text-[color:var(--color-foreground)] shadow-none [&>svg]:text-[color:var(--t-text)]"

function alertLook(variant: SurfaceVariant, tone: SurfaceTone): string {
  if (variant === "plain") return cn("rounded-lg", surfaceVariants({ variant: "outline", tone }), PLAIN_LOOK)
  const base = cn("rounded-xl", surfaceVariants({ variant, tone }))
  if (variant === "solid" || variant === "gradient") return cn(base, "[&>svg]:text-current")
  return cn(base, "text-[color:var(--color-foreground)]", ICON_TONE, ACCENT_BAR)
}

/* Alert ------------------------------------------------------------------- */

export type AlertProps = Omit<React.HTMLAttributes<HTMLDivElement>, "color"> &
  VariantProps<typeof alertSizeVariants> & {
    /**
     * Surface look. Omitted follows the ambient style (glinr by default, plain for minimal).
     * Vocabulary: glinr, solid, plain, soft, outline, ghost, gradient, glass. Legacy names (default, destructive, success,
     * warning, info, liquid, matte, glow, note, flag) keep working.
     */
    variant?: AlertVariant | null
    /** Tone for the accent bar, tint and icon. */
    tone?: SurfaceTone
    /** `true` renders the tone icon, a node renders a custom icon, `false` hides it. Defaults to the tone icon when a non-neutral `tone` is set. */
    icon?: boolean | React.ReactNode
  }

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, tone, size, icon, children, ...props }, ref) => {
    const ambient = useGlinStyle()
    const legacy = variant && variant in LEGACY_LOOKS ? (variant as keyof typeof LEGACY_LOOKS) : null
    const legacyTone = variant ? LEGACY_TONES[variant] : undefined
    const resolvedTone: SurfaceTone = tone ?? legacyTone ?? "neutral"
    const resolved: SurfaceVariant = legacyTone ? "soft" : resolveVariant(legacy ? null : variant, ambient, "container")

    const look = legacy
      ? cn("rounded-xl border", LEGACY_LOOKS[legacy])
      : alertLook(resolved, resolvedTone)

    const showIcon = icon === undefined ? tone !== undefined && tone !== "neutral" : icon !== false
    const ToneIcon = TONE_ICONS[resolvedTone]
    const iconNode = !showIcon ? null : React.isValidElement(icon) ? icon : <ToneIcon aria-hidden weight="duotone" className="size-5" />

    return (
      <div
        ref={ref}
        role="alert"
        data-variant={legacy ?? resolved}
        data-tone={resolvedTone}
        className={cn(alertBase, alertSizeVariants({ size }), look, className)}
        {...props}
      >
        {iconNode}
        {children}
      </div>
    )
  }
)

Alert.displayName = "Alert"

/* ── AlertTitle ───────────────────────────────────────────────────────────── */

export const AlertTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} data-slot="alert-title" className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
  )
)

AlertTitle.displayName = "AlertTitle"

/* ── AlertDescription ─────────────────────────────────────────────────────── */

export const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm text-[color-mix(in_oklab,currentColor_85%,transparent)] [&_p]:leading-relaxed", className)} {...props} />
  )
)

AlertDescription.displayName = "AlertDescription"
