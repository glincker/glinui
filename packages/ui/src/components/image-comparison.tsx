"use client"

/**
 * Glin UI Image Comparison (image-comparison). Adapted from ImageComparison in Motion Primitives
 * (https://github.com/ibelick/motion-primitives, components/core/image-comparison.tsx),
 * commit 120f64f6ca60348e251f929e9c81f11ccbe45eda.
 * Original copyright (c) 2024 ibelick. Licensed under MIT.
 * Modified for Glin UI: motion/react removed (CSS clip-path driven by a custom property), pointer capture drag,
 * slider role with keyboard support, ReactNode layers instead of images, vertical orientation, RTL, token surfaces.
 * See THIRD_PARTY_NOTICES.md#image-comparison.
 */

import * as React from "react"
import { CaretLeft, CaretRight, CaretUp, CaretDown } from "@phosphor-icons/react/dist/ssr"

import { cn } from "../lib/cn"
import { resolveVariant, type SurfaceVariant } from "../lib/surface"
import { containerSurface } from "../lib/surface-resolve"
import { useGlinStyle } from "./glin-provider"
import { mergeRefs, useMotionEngine } from "./motion-engine"

const clamp = (n: number) => Math.min(100, Math.max(0, n))

export interface ImageComparisonProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue" | "children"> {
  /** Layer shown from the start edge up to the handle. Any ReactNode. */
  before: React.ReactNode
  /** Layer shown behind, revealed past the handle. Any ReactNode. */
  after: React.ReactNode
  beforeLabel?: string
  afterLabel?: string
  /** Show the visible Before and After chips. */
  showLabels?: boolean
  /** Handle position, 0 to 100 (percent of the before layer shown). */
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  orientation?: "horizontal" | "vertical"
  /** Arrow key step in percent. Shift or Page keys move 5 steps. */
  step?: number
  /** Follow a fine pointer without pressing. Touch still drags. */
  hover?: boolean
  /** Accessible name of the slider handle. */
  label?: string
  variant?: SurfaceVariant | "default"
}

/**
 * Before and after layers separated by a draggable handle. The handle is a native-feeling slider
 * (role slider, arrows, Home, End, Page keys) and the whole frame accepts pointer and touch drags.
 * The split is a CSS clip-path read from one custom property, so a drag costs no layer re-renders.
 */
export const ImageComparison = React.forwardRef<HTMLDivElement, ImageComparisonProps>(
  (
    {
      before,
      after,
      beforeLabel = "Before",
      afterLabel = "After",
      showLabels = true,
      value,
      defaultValue = 50,
      onValueChange,
      orientation = "horizontal",
      step = 2,
      hover = false,
      label = "Comparison position",
      variant,
      className,
      ...props
    },
    ref
  ) => {
    const vertical = orientation === "vertical"
    const ambient = useGlinStyle()
    const surface = resolveVariant(variant, ambient, "container")
    const { effectiveLevel } = useMotionEngine()
    const rootRef = React.useRef<HTMLDivElement | null>(null)
    const handleRef = React.useRef<HTMLDivElement | null>(null)
    const controlled = value !== undefined
    const [inner, setInner] = React.useState(() => clamp(defaultValue))
    const position = clamp(controlled ? value : inner)
    const dragging = React.useRef(false)
    const [isDragging, setIsDragging] = React.useState(false)
    const frame = React.useRef<number | null>(null)
    const pending = React.useRef<number | null>(null)

    React.useLayoutEffect(() => {
      rootRef.current?.style.setProperty("--ic-pos", `${position}%`)
    }, [position])

    const commit = React.useCallback(
      (next: number) => {
        const v = clamp(next)
        if (!controlled) setInner(v)
        onValueChange?.(v)
      },
      [controlled, onValueChange]
    )

    React.useEffect(
      () => () => {
        if (frame.current !== null) cancelAnimationFrame(frame.current)
      },
      []
    )

    const fromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
      const el = rootRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      let pct: number
      if (vertical) pct = ((event.clientY - rect.top) / rect.height) * 100
      else {
        const rtl = getComputedStyle(el).direction === "rtl"
        pct = (rtl ? (rect.right - event.clientX) / rect.width : (event.clientX - rect.left) / rect.width) * 100
      }
      pending.current = pct
      if (frame.current !== null) return
      frame.current = requestAnimationFrame(() => {
        frame.current = null
        if (pending.current !== null) commit(pending.current)
        pending.current = null
      })
    }

    const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) return
      dragging.current = true
      setIsDragging(true)
      if (typeof event.currentTarget.setPointerCapture === "function") {
        try {
          event.currentTarget.setPointerCapture(event.pointerId)
        } catch {
          // Pointer already released, nothing to capture.
        }
      }
      fromPointer(event)
      handleRef.current?.focus({ preventScroll: true })
    }
    const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
      if (dragging.current || (hover && event.pointerType === "mouse")) fromPointer(event)
    }
    const endDrag = () => {
      dragging.current = false
      setIsDragging(false)
    }

    const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const rtl = rootRef.current ? getComputedStyle(rootRef.current).direction === "rtl" : false
      const big = event.shiftKey ? 5 : 1
      let next: number | null = null
      switch (event.key) {
        case "ArrowRight":
          next = position + (vertical ? 0 : (rtl ? -1 : 1) * step * big)
          break
        case "ArrowLeft":
          next = position + (vertical ? 0 : (rtl ? 1 : -1) * step * big)
          break
        case "ArrowDown":
          next = position + step * big
          break
        case "ArrowUp":
          next = position - step * big
          break
        case "PageDown":
          next = position + step * 5
          break
        case "PageUp":
          next = position - step * 5
          break
        case "Home":
          next = 0
          break
        case "End":
          next = 100
          break
        default:
          return
      }
      event.preventDefault()
      if (next !== position) commit(next)
    }

    const Start = vertical ? CaretUp : CaretLeft
    const End = vertical ? CaretDown : CaretRight

    return (
      <div
        ref={mergeRefs(ref, rootRef)}
        data-slot="image-comparison"
        data-orientation={orientation}
        data-dragging={isDragging ? "true" : "false"}
        data-motion={effectiveLevel === "full" ? "full" : "reduced"}
        className={cn(
          "group/ic relative isolate aspect-[16/10] w-full select-none overflow-hidden",
          vertical ? "touch-pan-x" : "touch-pan-y",
          hover ? (vertical ? "cursor-ns-resize" : "cursor-ew-resize") : "cursor-grab active:cursor-grabbing",
          containerSurface(surface, { radius: "xl" }),
          className
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        {...props}
      >
        <div role="group" aria-label={afterLabel} data-slot="image-comparison-after" className="absolute inset-0">
          {after}
        </div>
        <div
          role="group"
          aria-label={beforeLabel}
          data-slot="image-comparison-before"
          className={cn(
            "absolute inset-0",
            vertical
              ? "[clip-path:inset(0_0_calc(100%-var(--ic-pos,50%))_0)]"
              : "[clip-path:inset(0_calc(100%-var(--ic-pos,50%))_0_0)] rtl:[clip-path:inset(0_0_0_calc(100%-var(--ic-pos,50%)))]",
            "group-data-[motion=full]/ic:transition-[clip-path] group-data-[motion=full]/ic:duration-fast group-data-[dragging=true]/ic:!transition-none"
          )}
        >
          {before}
        </div>

        {showLabels ? (
          <>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute start-3 top-3 rounded-full bg-[var(--surface-1)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--color-foreground)] [box-shadow:var(--elev-1)]"
            >
              {beforeLabel}
            </span>
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute rounded-full bg-[var(--surface-1)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--color-foreground)] [box-shadow:var(--elev-1)]",
                vertical ? "bottom-3 start-3" : "end-3 top-3"
              )}
            >
              {afterLabel}
            </span>
          </>
        ) : null}

        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute bg-[color:var(--color-foreground)] [box-shadow:0_0_0_1px_var(--surface-1)]",
            vertical
              ? "inset-x-0 top-[var(--ic-pos,50%)] h-0.5 -translate-y-1/2"
              : "inset-y-0 start-[var(--ic-pos,50%)] w-0.5 -translate-x-1/2 rtl:translate-x-1/2",
            "group-data-[motion=full]/ic:transition-[inset-inline-start,top] group-data-[motion=full]/ic:duration-fast group-data-[dragging=true]/ic:!transition-none"
          )}
        />
        <div
          ref={handleRef}
          role="slider"
          tabIndex={0}
          aria-label={label}
          aria-orientation={orientation}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          aria-valuetext={`${beforeLabel} ${Math.round(position)} percent, ${afterLabel} ${100 - Math.round(position)} percent`}
          data-slot="image-comparison-handle"
          onKeyDown={onKeyDown}
          className={cn(
            "absolute grid size-10 place-items-center rounded-full border border-[color:var(--line-soft)] bg-[var(--surface-1)] text-[color:var(--color-foreground)] outline-none [box-shadow:var(--elev-2)]",
            "focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--surface-0)]",
            vertical
              ? "start-1/2 top-[var(--ic-pos,50%)] -translate-y-1/2 -translate-x-1/2 rtl:translate-x-1/2"
              : "top-1/2 start-[var(--ic-pos,50%)] -translate-y-1/2 -translate-x-1/2 rtl:translate-x-1/2",
            "group-data-[motion=full]/ic:transition-[inset-inline-start,top] group-data-[motion=full]/ic:duration-fast group-data-[dragging=true]/ic:!transition-none"
          )}
        >
          <span aria-hidden="true" className={cn("flex items-center gap-0.5", vertical && "flex-col", !vertical && "rtl:flex-row-reverse")}>
            <Start className="size-3.5" />
            <End className="size-3.5" />
          </span>
        </div>
      </div>
    )
  }
)

ImageComparison.displayName = "ImageComparison"
