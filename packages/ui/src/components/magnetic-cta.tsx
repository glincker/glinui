"use client"

import * as React from "react"

import { cn } from "../lib/cn"
import { Button, type ButtonProps } from "./button"
import { useMotionEngine } from "./motion-engine"

export type MagneticCTAProps = ButtonProps & {
  containerClassName?: string
  maxOffset?: number
  magnetRadius?: number
}

export const MagneticCTA = React.forwardRef<HTMLButtonElement, MagneticCTAProps>(
  ({ className, containerClassName, maxOffset = 8, magnetRadius = 140, ...props }, ref) => {
    const { effectiveLevel } = useMotionEngine()
    const prefersReducedMotion = effectiveLevel === "none"
    const wrapperRef = React.useRef<HTMLDivElement | null>(null)
    const buttonRef = React.useRef<HTMLButtonElement | null>(null)

    React.useImperativeHandle(ref, () => buttonRef.current as HTMLButtonElement)

    const setButtonOffset = React.useCallback((x: number, y: number) => {
      if (!buttonRef.current) {
        return
      }

      buttonRef.current.style.setProperty("--magnetic-x", `${x.toFixed(2)}px`)
      buttonRef.current.style.setProperty("--magnetic-y", `${y.toFixed(2)}px`)
    }, [])

    const resetOffset = React.useCallback(() => {
      setButtonOffset(0, 0)
    }, [setButtonOffset])

    const handleMouseMove = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (prefersReducedMotion || !wrapperRef.current) {
          resetOffset()
          return
        }

        const rect = wrapperRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const deltaX = event.clientX - centerX
        const deltaY = event.clientY - centerY

        const distance = Math.hypot(deltaX, deltaY)

        if (distance === 0 || distance > magnetRadius) {
          resetOffset()
          return
        }

        const normalizedX = deltaX / distance
        const normalizedY = deltaY / distance
        const strength = 1 - distance / magnetRadius

        const translateX = normalizedX * maxOffset * strength
        const translateY = normalizedY * maxOffset * strength

        setButtonOffset(translateX, translateY)
      },
      [magnetRadius, maxOffset, prefersReducedMotion, resetOffset, setButtonOffset]
    )

    return (
      <div
        ref={wrapperRef}
        data-slot="magnetic-cta-wrapper"
        className={cn("inline-flex", containerClassName)}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetOffset}
      >
        <Button
          ref={buttonRef}
          className={cn(
            "[transform:translate3d(var(--magnetic-x,0px),var(--magnetic-y,0px),0)] transition-[transform,box-shadow,background-color,color,border-color] duration-fast ease-standard motion-reduce:transition-none",
            className
          )}
          {...props}
        />
      </div>
    )
  }
)

MagneticCTA.displayName = "MagneticCTA"
