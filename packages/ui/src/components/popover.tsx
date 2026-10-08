"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { PANEL_MOTION, panelSurface, type PanelVariantProp } from "../lib/panel"
import { useResolvedPanelVariant } from "./panel-context"

const popoverTriggerVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-surface)] text-[var(--color-foreground)] border border-[var(--color-border)]",
        glass: "backdrop-blur-xl backdrop-saturate-[180%] bg-[var(--glass-3-surface)] border border-white/20 [border-top-color:var(--glass-refraction-top)] [box-shadow:0_0_0_1px_rgb(255_255_255_/_0.1)_inset,var(--shadow-glass-sm)] dark:border-white/[0.1] dark:shadow-[0_0_0_1px_rgb(255_255_255_/_0.05)_inset,0_8px_24px_rgb(0_0_0_/_0.35)] text-[var(--color-foreground)]",
        frosted: "backdrop-blur-[40px] backdrop-saturate-[200%] bg-[var(--glass-4-surface)] border border-white/30 [border-top-color:var(--glass-refraction-top)] [box-shadow:0_0_0_1px_rgb(255_255_255_/_0.15)_inset,0_0_16px_rgb(255_255_255_/_0.1)_inset,var(--shadow-glass-md)] dark:border-white/[0.14] dark:shadow-[0_0_0_1px_rgb(255_255_255_/_0.07)_inset,0_0_16px_rgb(255_255_255_/_0.03)_inset,0_8px_24px_rgb(0_0_0_/_0.4)] text-[var(--color-foreground)]",
        outline: "bg-transparent border border-[var(--color-border)] text-[var(--color-foreground)]",
        ghost: "bg-transparent border border-transparent text-[var(--color-foreground)]"
      },
      size: {
        sm: "h-8 px-3",
        md: "h-10 px-4",
        lg: "h-11 px-5"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
)

const popoverContentVariants = cva(`z-50 p-4 outline-none ${PANEL_MOTION}`, {
  variants: {
    size: {
      sm: "w-56 text-xs",
      md: "w-72 text-sm",
      lg: "w-80 text-base"
    }
  },
  defaultVariants: {
    size: "md"
  }
})

export type PopoverProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>

export const Popover = PopoverPrimitive.Root

export type PopoverTriggerProps =
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger> &
  VariantProps<typeof popoverTriggerVariants>

export const PopoverTrigger = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Trigger>,
  PopoverTriggerProps
>(({ className, variant, size, asChild, ...props }, ref) => (
  <PopoverPrimitive.Trigger
    ref={ref}
    asChild={asChild}
    // With asChild the consumer's element owns its styling: adding button classes here would restyle it.
    className={cn(asChild ? undefined : popoverTriggerVariants({ variant, size }), className)}
    {...props}
  />
))

PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName

export type PopoverContentProps =
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> &
  VariantProps<typeof popoverContentVariants> & {
  /** Surface look. Omit for the ambient design style (glinr by default). `glass` is opt-in and needs a rich backdrop. */
  variant?: PanelVariantProp
  /** Element to portal into. Defaults to document.body. */
  container?: HTMLElement | null
  }

export const PopoverContent = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(({ className, align = "center", sideOffset = 8, variant, size, container, ...props }, ref) => {
  const resolved = useResolvedPanelVariant(variant)
  return (
    <PopoverPrimitive.Portal container={container ?? undefined}>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        data-variant={resolved}
        className={cn(panelSurface({ variant: resolved, shape: "popover" }), popoverContentVariants({ size }), className)}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
})

PopoverContent.displayName = PopoverPrimitive.Content.displayName

export const PopoverClose = PopoverPrimitive.Close
export const PopoverAnchor = PopoverPrimitive.Anchor
