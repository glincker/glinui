import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { Button, type ButtonProps } from "./button"

/**
 * Liquid fill: an accent blob rises through the surface on hover and focus.
 * The fill colour is an accent mix (overridable with `--liquid-fill`), so it reads on light and dark scopes.
 */
const liquidButtonVariants = cva(
  "relative isolate transform-gpu overflow-hidden transition-[transform,box-shadow,filter] duration-normal ease-standard before:pointer-events-none before:absolute before:left-1/2 before:top-full before:-z-10 before:h-[220%] before:w-[140%] before:-translate-x-1/2 before:rounded-[42%] before:bg-[color:var(--liquid-fill,color-mix(in_oklab,var(--color-accent)_34%,transparent))] before:transition-transform before:duration-slow before:ease-standard before:content-[''] hover:scale-[1.03] hover:[box-shadow:var(--elev-3)] hover:before:-translate-y-[62%] hover:before:rotate-[24deg] focus-visible:before:-translate-y-[62%] focus-visible:before:rotate-[24deg] active:scale-y-[0.97] motion-reduce:transition-none motion-reduce:before:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-y-100 [[data-glin-motion=none]_&]:transition-none [[data-glin-motion=none]_&]:before:transition-none [[data-glin-motion=none]_&]:hover:scale-100",
  {
    variants: {
      intensity: {
        soft: "hover:brightness-[1.03]",
        strong:
          "hover:brightness-[1.06] [--liquid-fill:color-mix(in_oklab,var(--color-accent)_52%,transparent)]"
      }
    },
    defaultVariants: {
      intensity: "soft"
    }
  }
)

export type LiquidButtonProps = ButtonProps & VariantProps<typeof liquidButtonVariants>

export const LiquidButton = React.forwardRef<HTMLButtonElement, LiquidButtonProps>(
  ({ className, intensity, ...props }, ref) => (
    <Button ref={ref} className={cn(liquidButtonVariants({ intensity }), className)} {...props} />
  )
)

LiquidButton.displayName = "LiquidButton"
