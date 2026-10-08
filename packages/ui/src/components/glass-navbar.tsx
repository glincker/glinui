"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { panelSurface, resolvePanelVariant, type PanelVariantProp } from "../lib/panel"
import { usePrefersReducedMotion } from "../lib/use-prefers-reduced-motion"

const glassNavbarVariants = cva(
  "sticky top-0 z-50 w-full transition-[backdrop-filter,background-color,box-shadow] duration-normal ease-standard motion-reduce:transition-none",
  {
    variants: {
      elevation: {
        base: "[box-shadow:var(--elev-1)]",
        scrolled: "[box-shadow:var(--elev-2)]"
      },
      size: {
        sm: "min-h-12",
        md: "min-h-14",
        lg: "min-h-16"
      }
    },
    defaultVariants: {
      elevation: "base",
      size: "md"
    }
  }
)

/** Readable opacity floors: the frosted bar never drops below 84 percent surface, 92 percent once scrolled. */
const GLASS_FLOOR = {
  base: "bg-[color-mix(in_oklab,var(--surface-1)_84%,transparent)]",
  scrolled: "bg-[color-mix(in_oklab,var(--surface-1)_92%,transparent)] backdrop-blur-2xl"
} as const

export type GlassNavbarProps = React.HTMLAttributes<HTMLElement> &
  Omit<VariantProps<typeof glassNavbarVariants>, "elevation"> & {
    scrollThreshold?: number
    disableScrollTracking?: boolean
    elevation?: VariantProps<typeof glassNavbarVariants>["elevation"]
    /**
     * Surface look. The navbar is glass by default (its identity, with readable opacity floors so it stays
     * legible on any backdrop). Pass `glinr`, `plain`, `solid`, `soft`, `outline`, `ghost` or `gradient` for a
     * crisp bar. Glass needs content scrolling underneath to look frosted.
     */
    variant?: PanelVariantProp
  }

export const GlassNavbar = React.forwardRef<HTMLElement, GlassNavbarProps>(
  (
    {
      className,
      children,
      size,
      elevation,
      variant,
      scrollThreshold = 8,
      disableScrollTracking = false,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = usePrefersReducedMotion()
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
      if (disableScrollTracking || typeof window === "undefined") {
        return
      }

      const update = () => {
        setIsScrolled(window.scrollY > scrollThreshold)
      }

      update()
      window.addEventListener("scroll", update, { passive: true })

      return () => {
        window.removeEventListener("scroll", update)
      }
    }, [disableScrollTracking, scrollThreshold])

    const resolvedElevation = elevation ?? (isScrolled ? "scrolled" : "base")
    const resolvedVariant = resolvePanelVariant(variant, "glass")

    return (
      <nav
        ref={ref}
        data-variant={resolvedVariant}
        className={cn(
          panelSurface({ variant: resolvedVariant, shape: "none" }),
          glassNavbarVariants({ elevation: resolvedElevation, size }),
          resolvedVariant === "glass" && GLASS_FLOOR[resolvedElevation],
          resolvedVariant === "plain" && "rounded-none border-x-0 border-t-0 shadow-none",
          prefersReducedMotion ? "transition-none" : null,
          className
        )}
        {...props}
      >
        {children}
      </nav>
    )
  }
)

GlassNavbar.displayName = "GlassNavbar"
