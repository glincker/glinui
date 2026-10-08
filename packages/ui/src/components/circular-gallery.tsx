"use client"

import * as React from "react"

import { cn } from "../lib/cn"
import { resolveVariant, type SurfaceVariant } from "../lib/surface"
import { containerSurface } from "../lib/surface-resolve"
import { useGlinStyle } from "./glin-provider"
import { mergeRefs, useMotionEngine } from "./motion-engine"

export interface CircularGalleryItem {
  id: string
  /** Tile content. Any ReactNode, no images required. */
  content: React.ReactNode
  /** Accessible name and caption of the tile. */
  label: string
}

export interface CircularGalleryProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  items: CircularGalleryItem[]
  /** Controlled front item index. */
  value?: number
  defaultValue?: number
  onValueChange?: (index: number) => void
  /** Ring radius in pixels. Defaults to a size that fits the tiles. */
  radius?: number
  /** Camera tilt in degrees. Positive looks down on the ring. */
  tilt?: number
  tileWidth?: number
  tileHeight?: number
  /** Rotate on a timer. Needs motion level full. Pauses on hover, focus and drag. */
  autoRotate?: boolean
  /** Milliseconds between automatic steps. */
  autoRotateInterval?: number
  /** Let the wheel or trackpad rotate the ring. Off by default so page scroll is never captured. */
  wheel?: boolean
  /** Show the caption of the front tile under the ring. */
  showCaption?: boolean
  variant?: SurfaceVariant | "default"
  /** Accessible name of the gallery. */
  label?: string
}

const mod = (n: number, m: number) => ((n % m) + m) % m
const DRAG_SLOP = 6

/**
 * Tiles on a ring seen from the front. The front tile is large and sharp, the others shrink, dim and blur toward the back.
 * Drag, arrows, Home and End, a click on any tile, an opt-in wheel or a timer rotate the ring, which eases to the nearest tile.
 * Each tile position is computed in JS (sine and cosine of its angle) and written as CSS variables, so there are no React renders per frame.
 */
export const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  (
    {
      items,
      value,
      defaultValue = 0,
      onValueChange,
      radius,
      tilt = 8,
      tileWidth = 150,
      tileHeight = 190,
      autoRotate = false,
      autoRotateInterval = 3200,
      wheel = false,
      showCaption = true,
      variant,
      label = "Gallery",
      className,
      ...props
    },
    ref
  ) => {
    const total = items.length
    const ambient = useGlinStyle()
    const surface = resolveVariant(variant, ambient, "container")
    const { effectiveLevel } = useMotionEngine()
    const animated = effectiveLevel === "full"
    const rootRef = React.useRef<HTMLDivElement | null>(null)
    const tileRefs = React.useRef<Array<HTMLDivElement | null>>([])
    const ringRadius = radius ?? Math.round(Math.min(420, Math.max(120, ((total * tileWidth) / (2 * Math.PI)) * 1.7)))

    const controlled = value !== undefined
    const [innerIndex, setInnerIndex] = React.useState(() => mod(defaultValue, Math.max(total, 1)))
    const index = total > 0 ? mod(controlled ? value : innerIndex, total) : 0

    // `target` is an unbounded step so rotation takes the short way. `pos` is the animated float position.
    const target = React.useRef(index)
    const pos = React.useRef(index)
    const velocity = React.useRef(0)
    const raf = React.useRef<number | null>(null)
    const lastTime = React.useRef(0)
    const dragging = React.useRef(false)

    const layout = React.useCallback(
      (p: number) => {
        const n = tileRefs.current.length
        for (let i = 0; i < n; i += 1) {
          const el = tileRefs.current[i]
          if (!el) continue
          const theta = ((i - p) / total) * Math.PI * 2
          const depth = (Math.cos(theta) + 1) / 2
          const front = Math.cos(theta)
          el.style.setProperty("--g-x", `${(Math.sin(theta) * ringRadius).toFixed(2)}px`)
          el.style.setProperty("--g-z", `${((front - 1) * ringRadius).toFixed(2)}px`)
          el.style.setProperty("--g-s", (0.62 + 0.38 * depth).toFixed(3))
          el.style.setProperty("--g-o", (0.35 + 0.65 * depth).toFixed(3))
          el.style.setProperty("--g-b", `${((1 - depth) * 3).toFixed(2)}px`)
          el.style.setProperty("--g-i", String(Math.round(depth * 100)))
        }
        rootRef.current?.style.setProperty("--g-ready", "1")
      },
      [total, ringRadius]
    )

    const stop = () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current)
      raf.current = null
    }

    const tick = React.useCallback(
      (now: number) => {
        const dt = Math.min(0.05, (now - lastTime.current) / 1000)
        lastTime.current = now
        const diff = target.current - pos.current
        if (Math.abs(diff) < 0.001) {
          pos.current = target.current
          layout(pos.current)
          raf.current = null
          return
        }
        pos.current += diff * (1 - Math.exp(-dt * 9))
        layout(pos.current)
        raf.current = requestAnimationFrame(tick)
      },
      [layout]
    )

    const settle = React.useCallback(() => {
      if (!animated) {
        stop()
        pos.current = target.current
        layout(pos.current)
        return
      }
      if (raf.current === null) {
        lastTime.current = performance.now()
        raf.current = requestAnimationFrame(tick)
      }
    }, [animated, layout, tick])

    const report = React.useCallback(
      (step: number) => {
        const next = mod(step, total)
        if (!controlled) setInnerIndex(next)
        onValueChange?.(next)
      },
      [controlled, onValueChange, total]
    )

    const goTo = React.useCallback(
      (nextIndex: number) => {
        if (total === 0) return
        const current = mod(target.current, total)
        const delta = mod(nextIndex - current, total)
        if (delta === 0) return
        target.current += delta > total / 2 ? delta - total : delta
        report(target.current)
        settle()
      },
      [report, settle, total]
    )

    const step = React.useCallback(
      (delta: number) => {
        if (total === 0) return
        target.current = Math.round(target.current) + delta
        report(target.current)
        settle()
      },
      [report, settle, total]
    )

    // Controlled value sync.
    React.useEffect(() => {
      if (!controlled || total === 0) return
      const current = mod(target.current, total)
      const delta = mod(value - current, total)
      if (delta === 0) return
      target.current += delta > total / 2 ? delta - total : delta
      settle()
    }, [controlled, value, total, settle])

    React.useLayoutEffect(() => {
      const el = rootRef.current
      if (!el) return
      el.style.setProperty("--g-w", `${tileWidth}px`)
      el.style.setProperty("--g-h", `${tileHeight}px`)
      el.style.setProperty("--g-tilt", `${tilt}deg`)
      layout(pos.current)
    }, [tileWidth, tileHeight, tilt, layout])

    React.useEffect(() => () => stop(), [])

    // Auto rotate, paused on hover, focus and drag.
    const [paused, setPaused] = React.useState(false)
    const running = autoRotate && animated && !paused && total > 1
    React.useEffect(() => {
      if (!running) return
      const id = window.setInterval(() => {
        if (!dragging.current) step(1)
      }, Math.max(autoRotateInterval, 800))
      return () => window.clearInterval(id)
    }, [running, autoRotateInterval, step])

    // Wheel is opt in and attached non passive so the page only scrolls when the ring does not take the gesture.
    React.useEffect(() => {
      const el = rootRef.current
      if (!el || !wheel) return
      let acc = 0
      const onWheel = (event: WheelEvent) => {
        const d = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
        acc += d
        event.preventDefault()
        if (Math.abs(acc) >= 60) {
          step(acc > 0 ? 1 : -1)
          acc = 0
        }
      }
      el.addEventListener("wheel", onWheel, { passive: false })
      return () => el.removeEventListener("wheel", onWheel)
    }, [wheel, step])

    // Drag with inertia, then snap to the nearest tile.
    const drag = React.useRef<{ x: number; start: number; moved: boolean; lastX: number; lastT: number } | null>(null)
    const perTile = (2 * Math.PI * ringRadius) / Math.max(total, 1)
    const rtl = () => (rootRef.current ? getComputedStyle(rootRef.current).direction === "rtl" : false)

    const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) return
      stop()
      drag.current = { x: event.clientX, start: pos.current, moved: false, lastX: event.clientX, lastT: performance.now() }
      velocity.current = 0
    }
    const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
      const d = drag.current
      if (!d) return
      const dx = event.clientX - d.x
      if (!d.moved && Math.abs(dx) > DRAG_SLOP) {
        d.moved = true
        dragging.current = true
        if (typeof event.currentTarget.setPointerCapture === "function") {
          try {
            event.currentTarget.setPointerCapture(event.pointerId)
          } catch {
            // Pointer already released.
          }
        }
      }
      if (!d.moved) return
      const dir = rtl() ? 1 : -1
      pos.current = d.start + (dx / perTile) * dir
      const now = performance.now()
      const dtMs = Math.max(1, now - d.lastT)
      velocity.current = (((event.clientX - d.lastX) / perTile) * dir) / dtMs
      d.lastX = event.clientX
      d.lastT = now
      layout(pos.current)
    }
    const endDrag = () => {
      const d = drag.current
      drag.current = null
      if (!d) return
      if (d.moved) {
        const projected = Math.round(pos.current + velocity.current * 220)
        target.current = projected
        report(projected)
        // Clear on the next tick so the trailing click on the dragged tile is ignored.
        window.setTimeout(() => {
          dragging.current = false
        }, 0)
        settle()
      }
    }

    const focusTile = (i: number) => tileRefs.current[i]?.focus({ preventScroll: true })

    const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (total === 0) return
      const flip = rtl() ? -1 : 1
      let next: number | null = null
      if (event.key === "ArrowRight") next = mod(index + flip, total)
      else if (event.key === "ArrowLeft") next = mod(index - flip, total)
      else if (event.key === "Home") next = 0
      else if (event.key === "End") next = total - 1
      if (next === null) return
      event.preventDefault()
      goTo(next)
      focusTile(next)
    }

    return (
      <div
        ref={mergeRefs(ref, rootRef)}
        data-slot="circular-gallery"
        data-motion={animated ? "full" : "reduced"}
        className={cn("relative flex w-full flex-col items-center gap-3 overflow-hidden", className)}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false)
        }}
        {...props}
      >
        <div
          role="listbox"
          aria-label={label}
          aria-orientation="horizontal"
          data-slot="circular-gallery-stage"
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="relative h-[calc(var(--g-h,190px)+7rem)] w-full touch-pan-y select-none [perspective:var(--perspective-gallery,1100px)]"
        >
          <div
            className="absolute inset-0 grid place-items-center [transform-style:preserve-3d] [transform:rotateX(var(--g-tilt,0deg))]"
            data-slot="circular-gallery-ring"
          >
            {items.map((item, i) => {
              const front = i === index
              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    tileRefs.current[i] = el
                  }}
                  role="option"
                  aria-selected={front}
                  aria-current={front ? "true" : undefined}
                  aria-label={item.label}
                  aria-posinset={i + 1}
                  aria-setsize={total}
                  tabIndex={front ? 0 : -1}
                  data-slot="circular-gallery-tile"
                  data-front={front ? "true" : "false"}
                  onClick={() => {
                    if (!dragging.current) goTo(i)
                  }}
                  onFocus={() => goTo(i)}
                  className={cn(
                    "[grid-area:1/1] h-[var(--g-h,190px)] w-[var(--g-w,150px)] cursor-pointer overflow-hidden outline-none",
                    "[transform:translate3d(var(--g-x,0px),0,var(--g-z,0px))_scale(var(--g-s,1))] [opacity:var(--g-o,0)] [filter:blur(var(--g-b,0px))] [z-index:var(--g-i,0)]",
                    "focus-visible:[outline:2px_solid_var(--color-accent)] focus-visible:[outline-offset:3px]",
                    containerSurface(surface, { radius: "xl" })
                  )}
                >
                  {item.content}
                </div>
              )
            })}
          </div>
        </div>
        {showCaption && total > 0 ? (
          <p data-slot="circular-gallery-caption" className="text-sm font-medium text-[color:var(--color-foreground)]">
            {items[index]?.label}
          </p>
        ) : null}
      </div>
    )
  }
)

CircularGallery.displayName = "CircularGallery"
