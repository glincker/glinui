"use client"

import * as React from "react"

import { cn } from "../lib/cn"
import { Button, type ButtonProps, type ButtonVariant } from "./button"
import { useMotionEngine } from "./motion-engine"

export type RippleButtonProps = Omit<ButtonProps, "variant"> & {
  /** Ripple colour. Defaults to the button's own text colour at 30 percent, so it shows on light and dark surfaces. */
  rippleColor?: string
  /** Vocabulary or legacy variant. Omit for the ambient default. */
  variant?: ButtonVariant
}

interface RippleItem {
  id: number
  x: number
  y: number
}

const SIZE: Record<NonNullable<ButtonProps["size"]>, string> = {
  xs: "",
  sm: "",
  md: "h-10 px-4",
  lg: "h-12 px-6 text-base",
  icon: ""
}

/**
 * Crisp default surface that spawns a ripple from the pointer position on press.
 * No ripple under reduced motion or `data-glin-motion="none"`.
 */
export const RippleButton = React.forwardRef<HTMLButtonElement, RippleButtonProps>(
  ({ className, children, rippleColor, variant, size = "md", onClick, type = "button", ...props }, ref) => {
    const { effectiveLevel } = useMotionEngine()
    const [ripples, setRipples] = React.useState<RippleItem[]>([])
    const idRef = React.useRef(0)
    const timers = React.useRef<Array<ReturnType<typeof setTimeout>>>([])

    React.useEffect(
      () => () => {
        timers.current.forEach(clearTimeout)
      },
      []
    )

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (effectiveLevel === "full") {
          const rect = event.currentTarget.getBoundingClientRect()
          const id = ++idRef.current
          setRipples((prev) => [...prev, { id, x: event.clientX - rect.left, y: event.clientY - rect.top }])
          timers.current.push(
            setTimeout(() => {
              setRipples((prev) => prev.filter((r) => r.id !== id))
            }, 600)
          )
        }
        onClick?.(event)
      },
      [onClick, effectiveLevel]
    )

    const colorVar = rippleColor ? ({ "--ripple-color": rippleColor } as React.CSSProperties) : undefined

    return (
      <Button
        ref={ref}
        type={type}
        variant={variant}
        size={size}
        className={cn("relative isolate overflow-hidden", SIZE[size], className)}
        onClick={handleClick}
        {...props}
      >
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            aria-hidden="true"
            data-slot="ripple"
            style={{ left: ripple.x, top: ripple.y, ...colorVar }}
            className="pointer-events-none absolute -z-10 h-full w-full animate-ripple-press bg-[radial-gradient(circle,var(--ripple-color,color-mix(in_oklab,currentColor_30%,transparent))_10%,transparent_70%)] motion-reduce:hidden"
          />
        ))}
        {children}
      </Button>
    )
  }
)

RippleButton.displayName = "RippleButton"
