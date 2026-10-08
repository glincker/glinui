"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import type { SurfaceTone, SurfaceVariant } from "../lib/surface"
import { containerSurface, resolveSurfaceProps } from "../lib/surface-resolve"
import { useGlinStyle } from "./glin-provider"

const EMPTY_BASE =
  "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 p-8 text-center text-balance text-[color:var(--color-foreground)] md:p-12"

const EMPTY_EXTRAS = ["dashed"] as const

export type EmptyProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * Visual variant. Omit for the ambient design style (glinr: lift shell; plain: shadcn dashed block).
   * Vocabulary: glinr, solid, plain, soft, outline, ghost, gradient, glass. `dashed` is kept as an alias look.
   */
  variant?: SurfaceVariant | "dashed" | "default" | "raised" | "frosted"
  tone?: SurfaceTone
}

const EmptyVariantContext = React.createContext<SurfaceVariant | "dashed">("glinr")

export const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(({ className, variant, tone, ...props }, ref) => {
  const ambient = useGlinStyle()
  const { variant: resolved, tone: aliasTone, extra } = resolveSurfaceProps(variant, ambient, "container", EMPTY_EXTRAS)
  const look = extra === "dashed" || resolved === "plain" ? "dashed" : resolved
  return (
    <EmptyVariantContext.Provider value={extra ?? resolved}>
      <div
        ref={ref}
        data-slot="empty"
        data-variant={extra ?? resolved}
        className={cn(
          EMPTY_BASE,
          look === "dashed"
            ? "rounded-lg border border-dashed border-[color:var(--color-border)] bg-transparent"
            : containerSurface(resolved, { radius: "xl", elevation: "1", tone: tone ?? aliasTone }),
          className
        )}
        {...props}
      />
    </EmptyVariantContext.Provider>
  )
})
Empty.displayName = "Empty"

export const EmptyHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="empty-header"
      className={cn("flex max-w-sm flex-col items-center gap-2 text-center", className)}
      {...props}
    />
  )
)
EmptyHeader.displayName = "EmptyHeader"

const emptyMediaVariants = cva("mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0", {
  variants: {
    variant: {
      default: "bg-transparent",
      icon: "size-11 [&_svg:not([class*='size-'])]:size-5"
    }
  },
  defaultVariants: { variant: "default" }
})

export type EmptyMediaProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof emptyMediaVariants>

export const EmptyMedia = React.forwardRef<HTMLDivElement, EmptyMediaProps>(
  ({ className, variant, ...props }, ref) => {
    const parent = React.useContext(EmptyVariantContext)
    const flat = parent === "plain" || parent === "dashed"
    return (
      <div
        ref={ref}
        data-slot="empty-icon"
        data-variant={variant ?? "default"}
        className={cn(
          emptyMediaVariants({ variant }),
          variant === "icon" &&
            (flat
              ? "rounded-lg border border-[color:var(--color-border)] bg-[var(--surface-2)] text-[color:var(--color-foreground)]"
              : "rounded-xl [--face:var(--face-2,var(--surface-2))] border border-transparent [background:var(--sheen)_padding-box,linear-gradient(var(--face),var(--face))_padding-box,var(--ring)_border-box] text-[color:var(--color-foreground)] [box-shadow:var(--elev-1)]"),
          className
        )}
        {...props}
      />
    )
  }
)
EmptyMedia.displayName = "EmptyMedia"

export const EmptyTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="empty-title" className={cn("text-lg font-semibold tracking-tight", className)} {...props} />
  )
)
EmptyTitle.displayName = "EmptyTitle"

export const EmptyDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      data-slot="empty-description"
      className={cn(
        "text-sm leading-relaxed text-[var(--color-muted)] [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-[var(--color-foreground)]",
        className
      )}
      {...props}
    />
  )
)
EmptyDescription.displayName = "EmptyDescription"

export const EmptyContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="empty-content"
      className={cn("flex w-full min-w-0 max-w-sm flex-col items-center gap-3 text-sm text-balance", className)}
      {...props}
    />
  )
)
EmptyContent.displayName = "EmptyContent"
