"use client"

import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "../lib/cn"
import { surfaceVariants, type SurfaceTone, type SurfaceVariant } from "../lib/surface"
import { resolveSurfaceProps } from "../lib/surface-resolve"
import { useGlinStyle } from "./glin-provider"

const bubbleVariants = cva(
  "relative inline-block max-w-full break-words px-4 py-2.5 text-sm leading-relaxed [overflow-wrap:anywhere]",
  {
    variants: {
      align: {
        start: "",
        end: ""
      },
      tail: {
        true: "",
        false: ""
      },
      grouped: {
        true: "",
        false: ""
      }
    },
    compoundVariants: [
      { align: "start", tail: true, className: "rounded-es-sm" },
      { align: "end", tail: true, className: "rounded-ee-sm" },
      { align: "start", grouped: true, className: "rounded-s-md" },
      { align: "end", grouped: true, className: "rounded-e-md" }
    ],
    defaultVariants: {
      align: "start",
      tail: false,
      grouped: false
    }
  }
)

export type BubbleVariant = SurfaceVariant | "accent" | "muted" | "default" | "raised" | "frosted"

export interface BubbleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "align"> {
  /**
   * Visual variant. Omit for the ambient design style (glinr: raised ringed bubble; plain: flat bordered bubble).
   * Vocabulary: glinr, solid, plain, soft, outline, ghost, gradient, glass. `accent` is solid + accent tone, `muted` is soft.
   */
  variant?: BubbleVariant
  tone?: SurfaceTone
  align?: "start" | "end"
  /** Squares the corner nearest the avatar to point at the sender. */
  tail?: boolean
  /** Tightens the aligned edge so stacked bubbles read as one group. */
  grouped?: boolean
}

/** Chat surface. Pure presentation: pair with `Message` for roles and layout. */
export const Bubble = React.forwardRef<HTMLDivElement, BubbleProps>(
  ({ className, variant, tone, align, tail = false, grouped = false, ...props }, ref) => {
    const ambient = useGlinStyle()
    const { variant: resolved, tone: aliasTone } = resolveSurfaceProps(variant, ambient, "container", [], {
      accent: "solid",
      muted: "soft"
    })
    const finalTone: SurfaceTone = tone ?? (variant === "accent" ? "accent" : aliasTone) ?? "neutral"
    const flatNeutral = resolved === "plain" && finalTone === "neutral"
    return (
      <div
        ref={ref}
        data-variant={variant === "accent" || variant === "muted" ? variant : resolved}
        className={cn(
          "rounded-2xl",
          flatNeutral
            ? "border border-[color:var(--color-border)] bg-[var(--surface-1)] text-[color:var(--color-foreground)]"
            : surfaceVariants({
                variant: resolved,
                tone: finalTone,
                elevation: resolved === "glinr" || resolved === "solid" ? "auto" : "none"
              }),
          resolved === "plain" && !flatNeutral && "text-sm font-normal",
          bubbleVariants({ align, tail, grouped }),
          className
        )}
        {...props}
      />
    )
  }
)
Bubble.displayName = "Bubble"

export { bubbleVariants }
