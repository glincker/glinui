"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { CaretRight, DotsThree } from "@phosphor-icons/react/dist/ssr"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { liftPill } from "../lib/lift"
import { panelSurface, type PanelVariantProp } from "../lib/panel"
import type { SurfaceVariant } from "../lib/surface"
import { PanelVariantProvider, usePanelVariant, useResolvedPanelVariant } from "./panel-context"

const breadcrumbVariants = cva("text-sm text-[var(--color-muted)]")

/** Looks that wrap the trail in a pill. The others (glinr, plain, ghost) keep a bare trail on the page surface. */
const PILL_VARIANTS: readonly SurfaceVariant[] = ["solid", "soft", "outline", "gradient", "glass"]

export type BreadcrumbProps = React.ComponentPropsWithoutRef<"nav"> & {
  /**
   * Surface look. Omit for the ambient design style (glinr by default): a bare trail whose current page is a
   * raised pill. `solid`, `soft`, `outline`, `gradient` and `glass` wrap the trail in a pill; `glass` is opt-in
   * and needs a rich backdrop.
   */
  variant?: PanelVariantProp
}

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, variant, ...props }, ref) => {
    const resolved = useResolvedPanelVariant(variant)
    const pill = PILL_VARIANTS.includes(resolved)
    return (
      <PanelVariantProvider value={resolved}>
        <nav
          ref={ref}
          aria-label="breadcrumb"
          data-variant={resolved}
          className={cn(
            breadcrumbVariants(),
            pill && [panelSurface({ variant: resolved, shape: "popover" }), "inline-flex rounded-full px-3 py-1.5 [box-shadow:var(--elev-1)]"],
            resolved === "gradient" && "text-white",
            className
          )}
          {...props}
        />
      </PanelVariantProvider>
    )
  }
)
Breadcrumb.displayName = "Breadcrumb"

export const BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<"ol">>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn("flex flex-wrap items-center gap-1.5 break-words sm:gap-2", className)}
      {...props}
    />
  )
)
BreadcrumbList.displayName = "BreadcrumbList"

export const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"li">>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("inline-flex items-center gap-1.5", className)} {...props} />
  )
)
BreadcrumbItem.displayName = "BreadcrumbItem"

export type BreadcrumbLinkProps = React.ComponentPropsWithoutRef<"a"> & { asChild?: boolean }

export const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "a"
    return (
      <Comp
        ref={ref}
        className={cn(
          "rounded-sm outline-none transition-colors duration-100 hover:text-[var(--color-foreground)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 motion-reduce:transition-none",
          className
        )}
        {...props}
      />
    )
  }
)
BreadcrumbLink.displayName = "BreadcrumbLink"

export const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
  ({ className, ...props }, ref) => {
    const variant = usePanelVariant()
    return (
      <span
        ref={ref}
        role="link"
        aria-disabled="true"
        aria-current="page"
        className={cn(
          "font-medium text-[var(--color-foreground)]",
          variant === "glinr" && cn(liftPill({ kind: "key", size: "sm" }), "text-sm active:translate-y-0 active:[box-shadow:var(--elev-1)]"),
          variant === "gradient" && "text-white",
          className
        )}
        {...props}
      />
    )
  }
)
BreadcrumbPage.displayName = "BreadcrumbPage"

export const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("text-[var(--color-muted)] opacity-70 [&>svg]:size-3.5 rtl:[&>svg]:-scale-x-100", className)}
    {...props}
  >
    {children ?? <CaretRight />}
  </li>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

export const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex size-6 items-center justify-center", className)}
    {...props}
  >
    <DotsThree className="size-4" weight="bold" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis"

export { breadcrumbVariants }
