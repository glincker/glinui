"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { surfaceVariants, type SurfaceTone, type SurfaceVariant } from "../lib/surface"
import { resolveSurfaceProps } from "../lib/surface-resolve"
import { useGlinStyle } from "./glin-provider"

/* ── Avatar Variants ──────────────────────────────────────────────────────── */

const avatarBase =
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden transition-[box-shadow,transform,border-color,background-color,opacity] duration-fast ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-0)] motion-reduce:transition-none"

/** Component-specific looks kept on top of the shared surface vocabulary (all token based). */
const EXTRA_VARIANTS = {
  liquid:
    "isolate rounded-full border border-[color:var(--glass-border)] [border-top-color:var(--glass-refraction-top)] bg-[radial-gradient(circle_at_18%_16%,color-mix(in_oklab,var(--color-foreground)_10%,transparent),transparent_40%),var(--glass-readable)] text-[color:var(--color-foreground)] backdrop-blur-xl backdrop-saturate-[180%] [box-shadow:var(--glass-2-shadow)]",
  matte:
    "isolate border border-[color:var(--line-soft)] bg-[var(--surface-3)] text-[color:var(--color-foreground)] [box-shadow:var(--elev-1)]",
  glow:
    "border border-[color:var(--ring-solid)] bg-[var(--neutral-solid)] text-[color:var(--neutral-solid-fg)] shadow-[0_0_16px_color-mix(in_oklab,var(--neutral-solid)_35%,transparent)]"
} as const

type ExtraVariant = keyof typeof EXTRA_VARIANTS
const EXTRA_NAMES = Object.keys(EXTRA_VARIANTS) as ExtraVariant[]

const avatarShape = cva("", {
  variants: {
    size: {
      xs: "h-6 w-6 text-[10px]",
      sm: "h-8 w-8 text-xs",
      md: "h-10 w-10 text-sm",
      lg: "h-12 w-12 text-base",
      xl: "h-14 w-14 text-lg",
      "2xl": "h-20 w-20 text-2xl"
    },
    radius: {
      full: "rounded-full",
      lg: "rounded-lg",
      md: "rounded-md",
      square: "rounded-none"
    }
  },
  defaultVariants: { size: "md", radius: "full" }
})

type AvatarSize = NonNullable<VariantProps<typeof avatarShape>["size"]>
type AvatarRadius = NonNullable<VariantProps<typeof avatarShape>["radius"]>

/* ── Status Ring ──────────────────────────────────────────────────────────── */

const statusColors = {
  online: "bg-[var(--tone-success)] shadow-[0_0_0_2px_var(--color-background)]",
  offline: "bg-[var(--color-muted)] shadow-[0_0_0_2px_var(--color-background)]",
  busy: "bg-[var(--tone-danger)] shadow-[0_0_0_2px_var(--color-background)]",
  away: "bg-[var(--tone-warning)] shadow-[0_0_0_2px_var(--color-background)]"
} as const

const statusSizes = {
  xs: "h-1.5 w-1.5",
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
  xl: "h-3.5 w-3.5",
  "2xl": "h-4 w-4"
} as const

export type AvatarStatus = keyof typeof statusColors

/* ── Avatar Component ─────────────────────────────────────────────────────── */

export type AvatarProps = React.HTMLAttributes<HTMLSpanElement> &
  {
    /**
     * Visual variant. Omit for the ambient design style (glinr: ringed, raised face).
     * Vocabulary: glinr, solid, plain, soft, outline, ghost, gradient, glass. liquid, matte and glow are avatar-specific.
     */
    variant?: SurfaceVariant | ExtraVariant | "default" | "primary" | "secondary" | "destructive" | "success" | "warning" | "info" | "raised" | "frosted"
    /** Colour tone for the vocabulary variants. */
    tone?: SurfaceTone
    size?: AvatarSize
    radius?: AvatarRadius
    src?: string
    alt?: string
    fallback?: string
    imgClassName?: string
    fallbackClassName?: string
    /** Online/offline status indicator */
    status?: AvatarStatus
    /** Ring color for grouped avatars or emphasis */
    ring?: boolean
  }

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  (
    {
      className,
      variant,
      tone,
      size,
      radius,
      src,
      alt = "",
      fallback,
      imgClassName,
      fallbackClassName,
      status,
      ring,
      children,
      ...props
    },
    ref
  ) => {
    const [imgError, setImgError] = React.useState(false)
    const ambient = useGlinStyle()
    const { variant: surface, tone: aliasTone, extra } = resolveSurfaceProps(variant, ambient, "container", EXTRA_NAMES)
    const resolved: SurfaceVariant | ExtraVariant = extra ?? surface
    const face = extra
      ? EXTRA_VARIANTS[extra]
      : surfaceVariants({
          variant: surface,
          tone: tone ?? aliasTone ?? "neutral",
          elevation: surface === "glinr" || surface === "solid" ? "auto" : "none"
        })

    React.useEffect(() => {
      setImgError(false)
    }, [src])

    const showImage = src && !imgError
    const resolvedSize = size ?? "md"

    return (
      <span
        ref={ref}
        data-variant={resolved}
        className={cn(
          avatarBase,
          face,
          avatarShape({ size, radius }),
          ring && "ring-2 ring-[var(--color-background)] ring-offset-2 ring-offset-[var(--color-background)]",
          className
        )}
        {...props}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt}
            className={cn("h-full w-full object-cover animate-in fade-in-0 [--tw-duration:var(--motion-fast)] ease-[var(--ease-out)]", imgClassName)}
            onError={() => setImgError(true)}
          />
        ) : (
          <span className={cn("inline-flex h-full w-full items-center justify-center font-semibold uppercase select-none", fallbackClassName)}>
            {fallback ?? children ?? alt?.charAt(0)?.toUpperCase() ?? "?"}
          </span>
        )}

        {status && (
          <span
            className={cn(
              "absolute bottom-0 right-0 rounded-full",
              statusColors[status],
              statusSizes[resolvedSize]
            )}
            aria-label={status}
          />
        )}
      </span>
    )
  }
)

Avatar.displayName = "Avatar"

/* ── AvatarGroup ──────────────────────────────────────────────────────────── */

export type AvatarGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Max avatars to show before +N overflow */
  max?: number
  /** Overlap spacing */
  spacing?: "tight" | "normal" | "loose"
}

const spacingMap = {
  tight: "-space-x-3",
  normal: "-space-x-2",
  loose: "-space-x-1"
} as const

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, max, spacing = "normal", children, ...props }, ref) => {
    const childArray = React.Children.toArray(children)
    const visible = max ? childArray.slice(0, max) : childArray
    const overflow = max ? childArray.length - max : 0

    return (
      <div
        ref={ref}
        className={cn("flex items-center", spacingMap[spacing], className)}
        {...props}
      >
        {visible.map((child, i) => (
          <span key={i} className="relative ring-2 ring-[var(--color-background)] rounded-full">
            {child}
          </span>
        ))}
        {overflow > 0 && (
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-semibold text-[var(--color-foreground)] ring-2 ring-[var(--color-background)]">
            +{overflow}
          </span>
        )}
      </div>
    )
  }
)

AvatarGroup.displayName = "AvatarGroup"
