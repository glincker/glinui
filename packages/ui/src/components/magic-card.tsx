"use client"

/**
 * Glin UI Magic Card (magic-card). Adapted from MagicCard in Magic UI
 * (https://github.com/magicuidesign/magicui, apps/www/registry/magicui/magic-card.tsx),
 * commit cdb348cb4c72a9b54b554d8617801e479fbc8714.
 * Original copyright (c) Magic UI. Licensed under MIT.
 * Modified for Glin UI: motion and next-themes removed, rAF written CSS variables, token colors, fine pointer gating, glass variant.
 * See THIRD_PARTY_NOTICES.md#magic-card.
 */

import * as React from "react"

import { cn } from "../lib/cn"
import { useAutoPointer } from "../lib/use-auto-pointer"
import { Card, type CardProps } from "./card"
import { mergeRefs, useMotionEngine } from "./motion-engine"

const FINE_POINTER = "(hover: hover) and (pointer: fine)"

function useFinePointer(): boolean {
  const [fine, setFine] = React.useState(false)
  React.useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return
    const query = window.matchMedia(FINE_POINTER)
    const update = () => setFine(query.matches)
    update()
    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", update)
      return () => query.removeEventListener("change", update)
    }
    query.addListener(update)
    return () => query.removeListener(update)
  }, [])
  return fine
}

export interface MagicCardProps extends CardProps {
  /** Radius in pixels of the spotlight and border highlight. */
  gradientSize?: number
  /** Spotlight fill. Defaults to a soft tint of the accent token. */
  gradientColor?: string
  /** Border highlight start color. Defaults to the accent token. */
  gradientFrom?: string
  /** Border highlight end color. Defaults to the signal token. */
  gradientTo?: string
  /**
   * Runs a slow looping synthetic pointer so the highlight is visible without hovering (demos, screenshots, touch).
   * Needs motion level full. A real pointer takes over while hovering.
   */
  autoPlay?: boolean
}

/**
 * Card whose border and surface light up under the pointer. The base surface follows the ambient style
 * (glinr by default, any Card variant works) and the accent effect layers on top. Pointer tracking only runs on
 * fine pointers at motion level full, and writes CSS variables in a rAF (no React renders).
 * Keyboard focus lights the card from its center. Compared with SpotlightCard, MagicCard also
 * lights the border and works on the solid token surface.
 */
export const MagicCard = React.forwardRef<HTMLDivElement, MagicCardProps>(
  (
    {
      className,
      children,
      variant,
      gradientSize = 280,
      gradientColor,
      gradientFrom,
      gradientTo,
      autoPlay = false,
      onPointerEnter,
      onPointerMove,
      onPointerLeave,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const rootRef = React.useRef<HTMLDivElement | null>(null)
    const frame = React.useRef<number | null>(null)
    const point = React.useRef({ x: 0, y: 0 })
    const rect = React.useRef<DOMRect | null>(null)
    const { effectiveLevel } = useMotionEngine()
    const fine = useFinePointer()
    const animated = effectiveLevel === "full"
    const pointerEnabled = animated && fine

    React.useEffect(() => {
      const el = rootRef.current
      if (!el) return
      el.style.setProperty("--mc-size", `${gradientSize}px`)
      const apply = (name: string, value?: string) =>
        value ? el.style.setProperty(name, value) : el.style.removeProperty(name)
      apply("--mc-color", gradientColor)
      apply("--mc-from", gradientFrom)
      apply("--mc-to", gradientTo)
    }, [gradientSize, gradientColor, gradientFrom, gradientTo])

    const hovering = React.useRef(false)
    useAutoPointer(rootRef, autoPlay && animated, (nx, ny) => {
      const el = rootRef.current
      if (!el || hovering.current) return
      el.style.setProperty("--mx", `${(nx * el.offsetWidth).toFixed(1)}px`)
      el.style.setProperty("--my", `${(ny * el.offsetHeight).toFixed(1)}px`)
      el.dataset.active = "true"
    })

    const setActive = React.useCallback((active: boolean) => {
      const el = rootRef.current
      if (el) el.dataset.active = active ? "true" : "false"
    }, [])

    const flush = React.useCallback(() => {
      frame.current = null
      const el = rootRef.current
      if (!el) return
      el.style.setProperty("--mx", `${point.current.x}px`)
      el.style.setProperty("--my", `${point.current.y}px`)
    }, [])

    const schedule = React.useCallback(() => {
      if (frame.current !== null) return
      frame.current = requestAnimationFrame(flush)
    }, [flush])

    React.useEffect(
      () => () => {
        if (frame.current !== null) cancelAnimationFrame(frame.current)
        frame.current = null
      },
      []
    )

    const track = (event: React.PointerEvent<HTMLDivElement>) => {
      const box = rect.current ?? event.currentTarget.getBoundingClientRect()
      rect.current = box
      point.current = { x: event.clientX - box.left, y: event.clientY - box.top }
      schedule()
    }

    return (
      <Card
        ref={mergeRefs(ref, rootRef)}
        variant={variant}
        data-slot="magic-card"
        data-active="false"
        className={cn(
          "group relative isolate overflow-hidden",
          "[--mx:-9999px] [--my:-9999px]",
          className
        )}
        onPointerEnter={(event) => {
          if (pointerEnabled && event.pointerType !== "touch") {
            hovering.current = true
            rect.current = event.currentTarget.getBoundingClientRect()
            track(event)
            setActive(true)
          }
          onPointerEnter?.(event)
        }}
        onPointerMove={(event) => {
          if (pointerEnabled && event.pointerType !== "touch") track(event)
          onPointerMove?.(event)
        }}
        onPointerLeave={(event) => {
          rect.current = null
          hovering.current = false
          if (pointerEnabled) setActive(autoPlay)
          onPointerLeave?.(event)
        }}
        onFocus={(event) => {
          if (animated && event.target.matches(":focus-visible")) {
            const box = event.currentTarget.getBoundingClientRect()
            point.current = { x: box.width / 2, y: box.height / 2 }
            flush()
            setActive(true)
          }
          onFocus?.(event)
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setActive(false)
          onBlur?.(event)
        }}
        {...props}
      >
        <span
          aria-hidden="true"
          data-slot="magic-card-border"
          className={cn(
            "pointer-events-none absolute inset-0 z-0 rounded-[inherit] p-px opacity-0 transition-opacity duration-normal ease-standard",
            "[background:radial-gradient(var(--mc-size,280px)_circle_at_var(--mx)_var(--my),var(--mc-from,var(--color-accent)),var(--mc-to,var(--color-signal-ok)),transparent_100%)]",
            "[mask-image:linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] [mask-clip:content-box,border-box] [mask-composite:exclude] [-webkit-mask-image:linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] [-webkit-mask-clip:content-box,border-box] [-webkit-mask-composite:xor]",
            "group-data-[active=true]:opacity-100 motion-reduce:hidden forced-colors:hidden"
          )}
        />
        <span
          aria-hidden="true"
          data-slot="magic-card-glow"
          className={cn(
            "pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0 transition-opacity duration-normal ease-standard",
            "[background:radial-gradient(var(--mc-size,280px)_circle_at_var(--mx)_var(--my),var(--mc-color,color-mix(in_oklab,var(--color-accent)_22%,transparent)),transparent_100%)]",
            "group-data-[active=true]:opacity-100 motion-reduce:hidden forced-colors:hidden"
          )}
        />
        <div className="relative z-10">{children}</div>
      </Card>
    )
  }
)

MagicCard.displayName = "MagicCard"
