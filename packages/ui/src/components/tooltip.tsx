"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { type PanelVariantProp } from "../lib/panel"
import { useResolvedPanelVariant } from "./panel-context"

export const TooltipProvider = TooltipPrimitive.Provider
export type TooltipProps = Omit<
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>,
  "onOpenChange"
> & {
  /** Controlled open state. */
  open?: boolean
  /** Initial open state for uncontrolled usage. */
  defaultOpen?: boolean
  /** Callback when open state changes. */
  onOpenChange?: (open: boolean) => void
  /** Delay in ms before showing tooltip content. */
  delayDuration?: number
}

export const Tooltip = ({ delayDuration, ...props }: TooltipProps) => (
  <TooltipPrimitive.Root delayDuration={delayDuration} {...props} />
)

export const TooltipTrigger = TooltipPrimitive.Trigger

const tooltipContentVariants = cva(
  "z-50 max-w-xs px-3 py-1.5 text-xs font-medium leading-4 [--tw-duration:var(--motion-micro)] ease-[var(--ease-out)] data-[state=delayed-open]:animate-in data-[state=instant-open]:animate-in data-[state=closed]:animate-out data-[state=delayed-open]:fade-in-0 data-[state=instant-open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=delayed-open]:zoom-in-95 data-[state=instant-open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-100 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 motion-reduce:animate-none",
  {
    variants: {
      variant: {
        glinr:
          "rounded-xl border border-transparent text-[color:var(--neutral-solid-fg)] [--face:var(--neutral-solid)] [background:linear-gradient(180deg,rgb(255_255_255_/_0.12),transparent)_padding-box,linear-gradient(var(--face),var(--face))_padding-box,var(--ring-solid)_border-box] [box-shadow:var(--solid-elev-2)]",
        solid:
          "rounded-xl bg-[var(--neutral-solid)] text-[color:var(--neutral-solid-fg)] [box-shadow:var(--solid-elev-1)]",
        plain: "rounded-md bg-[var(--neutral-solid)] text-[color:var(--neutral-solid-fg)]",
        soft:
          "rounded-xl border border-transparent text-[var(--color-foreground)] [--face:var(--surface-2)] [background:linear-gradient(180deg,rgb(255_255_255_/_0.08),transparent)_padding-box,linear-gradient(var(--face),var(--face))_padding-box,var(--ring)_border-box] [box-shadow:var(--elev-2)]",
        outline:
          "rounded-xl border border-[color:color-mix(in_oklab,var(--color-foreground)_22%,transparent)] bg-[var(--surface-1)] text-[var(--color-foreground)]",
        ghost: "rounded-xl bg-[var(--surface-1)] text-[var(--color-foreground)] [box-shadow:var(--elev-2)]",
        gradient:
          "rounded-xl border border-transparent text-white [background:linear-gradient(180deg,rgb(255_255_255_/_0.16),transparent)_padding-box,linear-gradient(135deg,var(--gradient-from),var(--gradient-to))_padding-box,var(--ring-solid)_border-box] [box-shadow:var(--solid-elev-2)]",
        glass:
          "rounded-xl border border-[color:var(--glass-border)] [border-top-color:var(--glass-refraction-top)] bg-[color-mix(in_oklab,var(--surface-1)_88%,transparent)] bg-clip-padding text-[var(--color-foreground)] backdrop-blur-xl backdrop-saturate-[180%] [box-shadow:var(--elev-2)] [@media(prefers-reduced-transparency:reduce)]:bg-[var(--surface-1)] [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none"
      }
    },
    defaultVariants: {
      variant: "glinr"
    }
  }
)

export type TooltipContentProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> &
  {
    /**
     * Surface look. Omit for the ambient design style: a compact high-contrast pill that inverts per theme scope
     * (dark pill in light, light pill in dark). `glass` is opt-in and needs a rich backdrop.
     */
    variant?: PanelVariantProp
    /** Preferred side for tooltip content. */
    side?: "top" | "right" | "bottom" | "left"
    /** Gap in px between trigger and content. */
    sideOffset?: number
    /** Element to portal into. Defaults to document.body. */
    container?: HTMLElement | null
  }

export const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, variant, sideOffset = 6, container, ...props }, ref) => {
  const resolved = useResolvedPanelVariant(variant)
  return (
    <TooltipPrimitive.Portal container={container ?? undefined}>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        data-variant={resolved}
        className={cn(tooltipContentVariants({ variant: resolved }), className)}
        {...props}
      />
    </TooltipPrimitive.Portal>
  )
})

TooltipContent.displayName = "TooltipContent"
