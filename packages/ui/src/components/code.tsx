"use client"

import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "../lib/cn"
import { liftWell } from "../lib/lift"
import { surfaceVariants, type SurfaceTone, type SurfaceVariant } from "../lib/surface"
import { resolveSurfaceProps } from "../lib/surface-resolve"
import { useGlinStyle } from "./glin-provider"

const codeShape = cva(
  "inline-flex items-center rounded-md px-1.5 py-0.5 font-mono transition-colors duration-fast ease-standard motion-reduce:transition-none",
  {
    variants: {
      size: { sm: "text-[10px]", md: "text-xs", lg: "text-sm" }
    },
    defaultVariants: { size: "md" }
  }
)

export type CodeProps = React.HTMLAttributes<HTMLElement> & {
  /**
   * Visual variant. Omit for the ambient design style (glinr by default).
   * `block` renders a full width code well: inset well under glinr, flat bordered block under plain.
   */
  variant?: SurfaceVariant | "block" | "default" | "primary" | "secondary" | "destructive" | "success" | "warning" | "info" | "raised" | "frosted"
  tone?: SurfaceTone
  size?: "sm" | "md" | "lg"
}

const BLOCK_BASE = "flex w-full overflow-x-auto whitespace-pre leading-relaxed text-[color:var(--color-foreground)]"

export const Code = React.forwardRef<HTMLElement, CodeProps>(
  ({ className, variant, tone, size, ...props }, ref) => {
    const ambient = useGlinStyle()
    const { variant: resolved, tone: aliasTone, extra } = resolveSurfaceProps(variant, ambient, "container", ["block"] as const)

    if (extra === "block") {
      const flat = resolved === "plain"
      return (
        <code
          ref={ref}
          data-variant={flat ? "plain" : "block"}
          className={cn(
            codeShape({ size }),
            BLOCK_BASE,
            flat
              ? "rounded-lg border border-[color:var(--color-border)] bg-[var(--surface-1)] px-4 py-3 shadow-sm"
              : cn(liftWell({ pad: "md", mono: false }), "m-0 rounded-xl border border-[color:var(--line-soft)] px-4 py-3"),
            className
          )}
          {...props}
        />
      )
    }

    return (
      <code
        ref={ref}
        data-variant={resolved}
        className={cn(
          surfaceVariants({ variant: resolved, tone: tone ?? aliasTone ?? "neutral", elevation: "none" }),
          codeShape({ size }),
          resolved === "plain" &&
            "border-transparent bg-[var(--surface-2)] font-normal text-[color:var(--color-foreground)]",
          className
        )}
        {...props}
      />
    )
  }
)

Code.displayName = "Code"
