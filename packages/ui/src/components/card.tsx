"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { resolveVariant, surfaceVariants, type SurfaceTone, type SurfaceVariant } from "../lib/surface"
import { useGlinStyle } from "./glin-provider"

/**
 * Lift technique: a sheen layer and a solid face sit on the padding box while a
 * gradient ring fills the (transparent) 1px border box. Driven by three custom
 * properties (--face, --elev, --ring-img) so variants only swap variables.
 * Every token has a fallback so it renders without the v3 token additions.
 */
export const LIFT_SURFACE =
  "border border-transparent [--face:var(--face-0,var(--surface-1))] [--elev:var(--elev-2)] [--ring-img:var(--ring)] [background:var(--sheen)_padding-box,linear-gradient(var(--face),var(--face))_padding-box,var(--ring-img)_border-box] [box-shadow:var(--elev)]"

/** Variant names Card accepts: the shared vocabulary plus legacy looks that stay supported. */
export type CardVariant =
  | SurfaceVariant
  | "default"
  | "elevated"
  | "interactive"
  | "frosted"
  | "liquid"
  | "matte"
  | "lift"

const LEGACY_LOOKS = {
  frosted: [
        "border-white/30 [border-top-color:var(--glass-refraction-top)]",
        "bg-[radial-gradient(ellipse_at_50%_0%,rgb(255_255_255_/_0.32),transparent_50%),linear-gradient(to_bottom,rgb(255_255_255_/_0.22),rgb(255_255_255_/_0.1))]",
        "backdrop-blur-[40px] backdrop-saturate-[200%]",
        "[box-shadow:0_0_0_1px_rgb(255_255_255_/_0.15)_inset,0_0_20px_rgb(255_255_255_/_0.12)_inset,var(--shadow-glass-md)]",
        "dark:border-white/[0.15] dark:[border-top-color:rgb(255_255_255_/_0.2)]",
        "dark:bg-[radial-gradient(ellipse_at_50%_0%,rgb(255_255_255_/_0.1),transparent_50%),linear-gradient(to_bottom,rgb(255_255_255_/_0.06),rgb(255_255_255_/_0.02))]",
        "dark:shadow-[0_0_0_1px_rgb(255_255_255_/_0.08)_inset,0_0_20px_rgb(255_255_255_/_0.04)_inset,0_8px_32px_rgb(0_0_0_/_0.4)]"
      ].join(" "),
  liquid: [
        "border-white/25 [border-top-color:var(--glass-refraction-top)]",
        "bg-[radial-gradient(circle_at_16%_14%,rgb(255_255_255_/_0.72),transparent_46%),linear-gradient(165deg,rgb(255_255_255_/_0.58),rgb(238_238_238_/_0.32))]",
        "backdrop-blur-xl backdrop-saturate-[180%]",
        "[box-shadow:0_0_0_1px_rgb(255_255_255_/_0.2)_inset,var(--shadow-glass-md)]",
        "dark:border-white/[0.14] dark:[border-top-color:rgb(255_255_255_/_0.32)]",
        "dark:bg-[linear-gradient(165deg,rgb(255_255_255_/_0.12),rgb(255_255_255_/_0.05))]",
        "dark:shadow-[0_0_0_1px_rgb(255_255_255_/_0.06)_inset,0_12px_36px_rgb(0_0_0_/_0.4)]"
      ].join(" "),
  matte: [
        "border-black/10",
        "bg-[linear-gradient(180deg,rgb(250_250_250),rgb(236_236_238))]",
        "shadow-[0_1px_3px_rgb(0_0_0_/_0.06),0_0_0_1px_rgb(0_0_0_/_0.04)_inset]",
        "dark:border-white/[0.14]",
        "dark:bg-[linear-gradient(180deg,rgb(55_60_70_/_0.9),rgb(37_42_50_/_0.9))]",
        "dark:shadow-[0_1px_3px_rgb(0_0_0_/_0.2),0_0_0_1px_rgb(255_255_255_/_0.04)_inset]"
      ].join(" ")
} as const

const cardBase =
  "text-[var(--color-foreground)] transition-[transform,box-shadow,border-color,background-color] duration-normal ease-standard motion-reduce:transition-none"

/**
 * Look per vocabulary variant. `glinr` is the lift shell (concentric radius, gradient hairline ring, tonal face),
 * `plain` is the flat shadcn card, `solid` is a neutral tonal face. soft, outline, ghost, gradient and glass come
 * from the shared surface builder so they follow tones and theme scopes.
 */
const LOOK: Record<"glinr" | "plain" | "solid" | "inset", string> = {
  glinr:
    "rounded-[var(--lift-r-outer)] border border-transparent [--face:var(--face-1,var(--surface-1))] [--elev:var(--elev-2)] [--ring-img:var(--ring)] [background:var(--sheen)_padding-box,linear-gradient(var(--face),var(--face))_padding-box,var(--ring-img)_border-box] [box-shadow:var(--elev)]",
  plain: "rounded-lg border border-[var(--color-border)] bg-[var(--surface-1)] shadow-sm",
  solid:
    "rounded-xl border border-[var(--color-border)] [background:linear-gradient(180deg,rgb(255_255_255_/_0.05),transparent),var(--surface-2)] [box-shadow:var(--elev-1)]",
  inset: "rounded-xl border border-transparent [background:var(--well,var(--surface-well))] [box-shadow:var(--elev-inset)]"
}

const INTERACTIVE: Record<string, string> = {
  glinr: "cursor-pointer hover:-translate-y-0.5 hover:[--ring-img:var(--ring-hot,var(--ring))] hover:[--elev:var(--elev-3,var(--elev-2))]",
  plain: "cursor-pointer hover:bg-[color-mix(in_oklab,var(--color-foreground)_4%,var(--surface-1))]",
  solid: "cursor-pointer hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--color-foreground)_28%,transparent)] hover:[box-shadow:var(--elev-2)]",
  other: "cursor-pointer hover:-translate-y-0.5"
}

const cardVariants = cva(cardBase, {
  variants: {
    elevation: {
      1: "[--elev:var(--elev-1)]",
      2: "[--elev:var(--elev-2)]",
      3: "[--elev:var(--elev-3)]"
    },
    face: {
      0: "[--face:var(--face-0,var(--surface-1))]",
      1: "[--face:var(--face-1,var(--surface-2))]",
      2: "[--face:var(--face-2,var(--surface-3))]"
    },
    ring: {
      default: "[--ring-img:var(--ring)]",
      hot: "[--ring-img:var(--ring-hot,var(--ring))]",
      brand: "[--ring-img:var(--ring-violet,var(--ring-brand))]"
    },
    size: {
      sm: "p-4",
      md: "p-6",
      lg: "p-8"
    }
  },
  defaultVariants: {
    size: "md"
  }
})

/** Card padding by size, used by CardHeader strip and CardContent inset to bleed to the edge. */
const CardContext = React.createContext<{ size: "sm" | "md" | "lg"; variant: string }>({ size: "md", variant: "glinr" })

const cardSectionVariants = cva("", {
  variants: {
    size: {
      sm: "space-y-1",
      md: "space-y-1.5",
      lg: "space-y-2"
    }
  },
  defaultVariants: {
    size: "md"
  }
})

export type CardProps = Omit<React.HTMLAttributes<HTMLDivElement>, "color"> &
  VariantProps<typeof cardVariants> & {
    /**
     * Surface look. Omitted (or `default`) follows the ambient design style: glinr, plain or glass.
     * `glinr` lift shell, `plain` flat shadcn card, `solid` neutral tonal, `soft`, `outline`, `ghost`, `gradient`, `glass` (opt-in, needs a backdrop).
     * Legacy `elevated`, `interactive`, `lift`, `frosted`, `liquid`, `matte` keep working.
     */
    variant?: CardVariant | null
    /** Tone for soft, outline, ghost, gradient and glass. */
    tone?: SurfaceTone
    /** Adds hover lift and a pointer cursor. Keyboard behavior stays with the consumer. */
    interactive?: boolean
    /** Render a recessed well instead of a raised surface. */
    inset?: boolean
  }

/**
 * Surface container. With no `variant` it renders the glinr lift look (or the ambient style).
 * `elevation`, `face` and `ring` tune the glinr and solid looks.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, tone = "neutral", size, elevation, face, ring, inset, interactive, ...props }, ref) => {
    const ambient = useGlinStyle()
    const legacy = variant === "frosted" || variant === "liquid" || variant === "matte" ? variant : null
    const named = variant === "elevated" || variant === "interactive" || variant === "lift" ? undefined : variant
    const resolved: SurfaceVariant = variant === "lift" ? "glinr" : resolveVariant(named, ambient, "container")
    const isInteractive = Boolean(interactive) || variant === "interactive"
    const effectiveElevation = elevation ?? (variant === "elevated" ? 3 : undefined)
    const lookKey = resolved === "glinr" || resolved === "plain" || resolved === "solid" ? resolved : "other"

    let look: string
    if (inset) look = LOOK.inset
    else if (legacy) look = cn("rounded-xl border", LEGACY_LOOKS[legacy])
    else if (lookKey === "other") {
      look = cn(
        "rounded-xl",
        surfaceVariants({ variant: resolved, tone }),
        "text-[color:var(--color-foreground)]",
        resolved === "gradient" && "text-white [--card-muted:rgb(255_255_255_/_0.82)]"
      )
    } else look = LOOK[lookKey]

    const sizeKey = size ?? "md"
    return (
      <CardContext.Provider value={{ size: sizeKey, variant: inset ? "inset" : legacy ?? resolved }}>
        <div
          ref={ref}
          data-variant={legacy ?? resolved}
          data-inset={inset ? "true" : undefined}
          className={cn(
            look,
            cardVariants({ size, elevation: effectiveElevation, face, ring }),
            isInteractive && !inset && INTERACTIVE[lookKey],
            className
          )}
          {...props}
        />
      </CardContext.Provider>
    )
  }
)

Card.displayName = "Card"

export type CardSectionProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardSectionVariants>

export type CardHeaderProps = CardSectionProps & {
  /** `strip` renders a raised header band that bleeds to the card edges (glinr and solid cards). */
  variant?: "default" | "strip"
}

/** Negative margins that cancel the card padding so a strip reaches the edges. */
const STRIP_BLEED = {
  sm: "-mx-4 -mt-4 mb-4 px-4 py-3",
  md: "-mx-6 -mt-6 mb-5 px-6 py-3.5",
  lg: "-mx-8 -mt-8 mb-6 px-8 py-4"
} as const

const STRIP_LOOK =
  "rounded-t-[inherit] border-b border-[color:var(--line-soft)] [background:var(--sheen),var(--face-0,var(--surface-2))] shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06),0_8px_12px_-8px_rgb(0_0_0_/_0.35)]"

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, size, variant = "default", ...props }, ref) => {
    const ctx = React.useContext(CardContext)
    const strip = variant === "strip"
    return (
      <div
        ref={ref}
        data-variant={variant}
        className={cn(
          cardSectionVariants({ size }),
          strip ? cn("relative z-[1]", STRIP_BLEED[ctx.size], STRIP_LOOK) : "[&:not(:last-child)]:pb-1",
          className
        )}
        {...props}
      />
    )
  }
)

CardHeader.displayName = "CardHeader"

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Additional class names for title text. */
  className?: string
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => <h3 ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
)

CardTitle.displayName = "CardTitle"

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Additional class names for description text. */
  className?: string
}

export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => <p ref={ref} className={cn("text-sm text-[var(--card-muted,var(--color-muted))]", className)} {...props} />
)

CardDescription.displayName = "CardDescription"

export type CardContentProps = CardSectionProps & {
  /** Recessed well with the concentric inner radius, for code, lists and inputs. */
  inset?: boolean
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, size, inset, ...props }, ref) => (
    <div
      ref={ref}
      data-inset={inset ? "true" : undefined}
      className={cn(
        cardSectionVariants({ size }),
        inset && "rounded-[var(--lift-r-inner)] bg-[var(--well,var(--surface-well))] p-4 [box-shadow:var(--elev-inset)]",
        className
      )}
      {...props}
    />
  )
)

CardContent.displayName = "CardContent"

export type CardFooterProps = CardSectionProps

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(({ className, size, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardSectionVariants({ size }), "mt-4 border-t border-[var(--line-soft)] pt-4", className)}
    {...props}
  />
))

CardFooter.displayName = "CardFooter"
