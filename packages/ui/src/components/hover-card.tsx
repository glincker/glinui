"use client"

import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { PANEL_MOTION, panelSurface, type PanelVariantProp } from "../lib/panel"
import { useResolvedPanelVariant } from "./panel-context"

const hoverCardContentVariants = cva(`z-50 p-4 outline-none ${PANEL_MOTION}`, {
  variants: {
    size: {
      sm: "w-56 text-xs",
      md: "w-72 text-sm",
      lg: "w-80 text-sm"
    }
  },
  defaultVariants: {
    size: "md"
  }
})

export type HoverCardProps = Omit<
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Root>,
  "openDelay" | "closeDelay"
> & {
  /** Delay in ms before opening on pointer/focus. */
  openDelay?: number
  /** Delay in ms before closing when pointer leaves. */
  closeDelay?: number
}

export const HoverCard = ({
  openDelay = 200,
  closeDelay = 100,
  ...props
}: HoverCardProps) => (
  <HoverCardPrimitive.Root
    openDelay={openDelay}
    closeDelay={closeDelay}
    {...props}
  />
)

export const HoverCardTrigger = HoverCardPrimitive.Trigger

export type HoverCardContentProps = React.ComponentPropsWithoutRef<
  typeof HoverCardPrimitive.Content
> &
  VariantProps<typeof hoverCardContentVariants> & {
    /** Surface look. Omit for the ambient design style (glinr by default). `glass` is opt-in and needs a rich backdrop. */
    variant?: PanelVariantProp
    /** Preferred side for the hover card. */
    side?: "top" | "right" | "bottom" | "left"
    /** Gap in px between trigger and content. */
    sideOffset?: number
    /** Element to portal into. Defaults to document.body. */
    container?: HTMLElement | null
  }

export const HoverCardContent = React.forwardRef<
  React.ComponentRef<typeof HoverCardPrimitive.Content>,
  HoverCardContentProps
>(
  (
    {
      className,
      align = "center",
      sideOffset = 10,
      variant,
      size,
      container,
      ...props
    },
    ref
  ) => {
    const resolved = useResolvedPanelVariant(variant)
    return (
      <HoverCardPrimitive.Portal container={container ?? undefined}>
        <HoverCardPrimitive.Content
          ref={ref}
          align={align}
          sideOffset={sideOffset}
          data-variant={resolved}
          className={cn(panelSurface({ variant: resolved, shape: "popover" }), hoverCardContentVariants({ size }), className)}
          {...props}
        />
      </HoverCardPrimitive.Portal>
    )
  }
)

HoverCardContent.displayName = HoverCardPrimitive.Content.displayName
