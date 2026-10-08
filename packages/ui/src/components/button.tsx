"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "../lib/cn"
import {
  interactiveSurface,
  resolveSurfaceVariant,
  resolveVariant,
  surfaceVariants,
  type SurfaceTone,
  type SurfaceVariant
} from "../lib/surface"
import { ButtonGroupContext } from "./button-group"
import { useGlinStyle } from "./glin-provider"
import { Spinner } from "./spinner"

/** Vocabulary variants (docs-local/variant-system.md). */
export type ButtonSurfaceVariant = SurfaceVariant
/** Legacy names kept working: aliases of the vocabulary plus component-specific looks. */
export type ButtonLegacyVariant =
  | "default"
  | "primary"
  | "secondary"
  | "destructive"
  | "frosted"
  | "raised"
  | "liquid"
  | "matte"
  | "glow"
  | "key"
  | "key-white"
export type ButtonVariant = ButtonSurfaceVariant | ButtonLegacyVariant
export type ButtonTone = SurfaceTone
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "icon"

const KEY_BASE = "gap-2 font-medium tracking-[-0.005em] active:translate-y-px"
const KEY_BG = "[background:linear-gradient(180deg,var(--k-top),var(--k-bot))_border-box]"

/** Focus ring for the component-specific looks (surface variants bring their own through `interactiveSurface`). */
const LOOK_BASE =
  "transition-[transform,background-color,box-shadow,color,border-color,opacity] duration-fast ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--surface-0)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:scale-100"

/** Looks that are not part of the shared vocabulary. Token driven, no `dark:` utilities. */
const LOOKS = {
  liquid:
    "relative isolate overflow-hidden border-[color:var(--glass-border)] [border-top-color:var(--glass-refraction-top)] bg-[var(--glass-readable)] bg-clip-padding text-[color:var(--color-foreground)] backdrop-blur-xl backdrop-saturate-[180%] [box-shadow:var(--glass-2-shadow)] before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_16%_12%,color-mix(in_oklab,var(--color-foreground)_10%,transparent),transparent_46%)] after:pointer-events-none after:absolute after:-inset-y-16 after:-left-20 after:w-24 after:rotate-12 after:bg-[linear-gradient(100deg,transparent_20%,color-mix(in_oklab,var(--color-foreground)_22%,transparent)_50%,transparent_80%)] after:blur-sm after:transition-transform after:duration-slow after:ease-standard hover:-translate-y-px hover:after:translate-x-28 motion-reduce:after:transition-none",
  matte:
    "relative isolate border-[color:var(--line-soft)] bg-[linear-gradient(180deg,var(--surface-1),var(--surface-2))] text-[color:var(--color-foreground)] [box-shadow:var(--elev-1)] hover:-translate-y-px hover:bg-[linear-gradient(180deg,var(--surface-2),var(--surface-3))] hover:[box-shadow:var(--elev-2)] active:translate-y-0",
  glow: "border-[color:var(--color-accent)] bg-[var(--color-accent)] text-[color:var(--color-accent-foreground)] shadow-[0_0_22px_color-mix(in_oklab,var(--color-accent)_45%,transparent),inset_0_1px_0_rgb(255_255_255_/_0.25)] hover:-translate-y-px hover:shadow-[0_0_36px_color-mix(in_oklab,var(--color-accent)_65%,transparent),inset_0_1px_0_rgb(255_255_255_/_0.3)] active:translate-y-0",
  key: `${KEY_BASE} rounded-full ${KEY_BG} [--k-top:var(--key-top,var(--color-signal-live))] [--k-bot:var(--key-bottom,color-mix(in_oklch,var(--color-signal-live)_88%,black))] text-[color:var(--key-ink,#000)] shadow-[inset_0_1px_0_rgb(255_255_255_/_0.55),inset_0_-2px_0_rgb(0_0_0_/_0.14),0_0_0_1px_rgb(0_0_0_/_0.35),0_2px_4px_rgb(0_0_0_/_0.4),0_8px_20px_-8px_color-mix(in_oklch,var(--k-bot)_35%,transparent)] hover:[--k-top:var(--key-top-hover,color-mix(in_oklch,var(--key-top,var(--color-signal-live))_72%,white))] hover:[--k-bot:var(--key-bottom-hover,color-mix(in_oklch,var(--key-bottom,var(--color-signal-live))_80%,white))] focus-visible:[--k-top:var(--key-top-hover,color-mix(in_oklch,var(--key-top,var(--color-signal-live))_72%,white))] active:shadow-[inset_0_2px_4px_rgb(0_0_0_/_0.24),inset_0_-1px_0_rgb(255_255_255_/_0.3),0_0_0_1px_rgb(0_0_0_/_0.4),0_1px_1px_rgb(0_0_0_/_0.35)]`,
  "key-white": `${KEY_BASE} rounded-full ${KEY_BG} [--k-top:var(--key-white-top,#ffffff)] [--k-bot:var(--key-white-bottom,#e2e2e7)] text-[color:var(--key-ink,#000)] [box-shadow:inset_0_1px_0_rgb(255_255_255_/_0.9),inset_0_-2px_0_rgb(0_0_0_/_0.1),0_0_0_1px_rgb(0_0_0_/_0.4),var(--drop-1,0_1px_2px_rgb(0_0_0_/_0.4))] hover:[--k-top:var(--key-white-top-hover,#f2f2f5)] hover:[--k-bot:var(--key-white-bottom-hover,#cfcfd5)] focus-visible:[--k-top:var(--key-white-top-hover,#f2f2f5)] active:shadow-[inset_0_2px_4px_rgb(0_0_0_/_0.22),inset_0_-1px_0_rgb(255_255_255_/_0.5),0_0_0_1px_rgb(0_0_0_/_0.4),0_1px_1px_rgb(0_0_0_/_0.35)]`
} as const

type LookName = keyof typeof LOOKS

function isLook(name: string | undefined): name is LookName {
  return name !== undefined && Object.prototype.hasOwnProperty.call(LOOKS, name)
}

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-transparent font-medium [&_svg]:pointer-events-none [&_svg]:shrink-0 disabled:cursor-not-allowed"

/** Applied after the surface classes so a size always wins over a variant's own text size. */
export const buttonSizeVariants = cva("", {
    variants: {
      iconNudge: {
        true: "[&_svg]:transition-transform [&_svg]:duration-fast [&_svg]:ease-standard [&:hover_svg]:translate-x-[2px] [&:focus-visible_svg]:translate-x-[3px] motion-reduce:[&_svg]:transition-none motion-reduce:[&:hover_svg]:translate-x-0 motion-reduce:[&:focus-visible_svg]:translate-x-0 [[data-glin-motion=none]_&_svg]:transition-none [[data-glin-motion=none]_&:hover_svg]:translate-x-0",
        false: ""
      },
      size: {
        xs: "h-7 gap-1.5 px-2.5 text-xs [&_svg]:size-3.5",
        sm: "h-8 px-3 text-xs [&_svg]:size-3.5",
        md: "h-9 px-4 text-sm [&_svg]:size-4",
        lg: "h-10 px-6 text-sm [&_svg]:size-4",
        icon: "size-9 p-0 text-sm [&_svg]:size-4"
      }
    },
    defaultVariants: { size: "md", iconNudge: false }
})

export type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> & {
  /**
   * Look. Omit for the ambient default (`glinr`, or `plain` / `glass` under `style="minimal"` / `"glass"`).
   * Legacy names (`default`, `primary`, `secondary`, `destructive`, `frosted`, `raised`) resolve to the vocabulary.
   */
  variant?: ButtonVariant
  /** Colour axis for the vocabulary variants. */
  tone?: ButtonTone
  size?: ButtonSize
  iconNudge?: boolean
  asChild?: boolean
  /** Icon before the label (decorative). */
  leadingIcon?: React.ReactNode
  /** Icon after the label (decorative). */
  trailingIcon?: React.ReactNode
  /** Show a spinner, set `aria-busy` and block interaction. */
  loading?: boolean
}

function Decor({ children }: { children: React.ReactNode }) {
  return (
    <span aria-hidden="true" data-slot="icon" className="inline-flex shrink-0 items-center">
      {children}
    </span>
  )
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      size,
      variant,
      tone,
      iconNudge,
      asChild = false,
      leadingIcon,
      trailingIcon,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const style = useGlinStyle()
    const group = React.useContext(ButtonGroupContext)
    const requested = variant ?? group?.variant
    const look = isLook(requested) ? requested : null

    let surface: SurfaceVariant = "glinr"
    let resolvedTone: SurfaceTone | undefined = tone ?? group?.tone
    if (!look) {
      surface = resolveVariant(requested, style, "control")
      if (requested && requested !== "default") {
        resolvedTone = tone ?? group?.tone ?? resolveSurfaceVariant(requested).tone
      }
    }

    const resolvedSize = size ?? group?.size
    const inactive = Boolean(disabled) || loading
    const Comp = asChild ? Slot : "button"

    const decorate = (label: React.ReactNode) => (
      <>
        {loading ? (
          <Spinner variant="current" size="sm" label="Loading" className="size-[1.1em]" />
        ) : leadingIcon ? (
          <Decor>{leadingIcon}</Decor>
        ) : null}
        {label}
        {trailingIcon ? <Decor>{trailingIcon}</Decor> : null}
      </>
    )

    const needsDecor = loading || Boolean(leadingIcon) || Boolean(trailingIcon)
    let content: React.ReactNode = children
    if (needsDecor) {
      content =
        asChild && React.isValidElement<{ children?: React.ReactNode }>(children)
          ? React.cloneElement(children, undefined, decorate(children.props.children))
          : decorate(children)
    }

    return (
      <Comp
        ref={ref}
        data-variant={look ?? surface}
        data-loading={loading ? "true" : undefined}
        aria-busy={loading || undefined}
        aria-disabled={inactive || undefined}
        disabled={inactive || undefined}
        className={cn(
          BUTTON_BASE,
          look
            ? cn(LOOK_BASE, LOOKS[look])
            : cn(
                surfaceVariants({ variant: surface, tone: resolvedTone ?? "neutral" }),
                interactiveSurface({ variant: surface })
              ),
          buttonSizeVariants({ size: resolvedSize, iconNudge }),
          className
        )}
        {...props}
      >
        {content}
      </Comp>
    )
  }
)

Button.displayName = "Button"
