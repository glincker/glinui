"use client"

/**
 * Glin UI Cylinder Carousel (cylinder-carousel). Adapted from CylinderCarousel in Vengeance UI
 * (https://github.com/Ashutoshx7/VengeanceUI, src/components/ui/cylinder-carousel.tsx),
 * commit 0376d8e37b4a565016cce1064d7b96905c4494ab.
 * Original copyright (c) 2025-2026 Ashutoshx7. Licensed under MIT.
 * Modified for Glin UI: ReactNode items instead of image urls, step driven rotation with keyboard, swipe and button controls,
 * carousel aria semantics, inert rear slides, autoplay with pause and reduced motion, flat scroll-snap fallback, RTL, token surfaces.
 * See THIRD_PARTY_NOTICES.md#cylinder-carousel.
 */

import * as React from "react"
import { CaretLeft, CaretRight, Pause, Play } from "@phosphor-icons/react/dist/ssr"

import { cn } from "../lib/cn"
import { resolveVariant, type SurfaceVariant } from "../lib/surface"
import { containerSurface } from "../lib/surface-resolve"
import { Button } from "./button"
import { useGlinStyle } from "./glin-provider"
import { mergeRefs, useMotionEngine } from "./motion-engine"

const SWIPE_THRESHOLD = 40
const mod = (n: number, m: number) => ((n % m) + m) % m

export interface CylinderCarouselProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** Slide content. Any ReactNode, no image urls required. */
  items: React.ReactNode[]
  /** Accessible name of the carousel region. */
  label?: string
  /** Surface of each slide frame. Omit to follow the ambient style. */
  variant?: SurfaceVariant | "default"
  /** Controlled front slide index. */
  value?: number
  /** Uncontrolled initial front slide index. */
  defaultValue?: number
  onValueChange?: (index: number) => void
  /** Slide width in pixels. */
  cardWidth?: number
  /** Slide height in pixels. */
  cardHeight?: number
  /** Gap between neighbouring slides on the ring, in pixels. */
  gap?: number
  /** Rotate on a timer. Needs motion level full. Pauses on hover and focus, with a visible pause button. */
  autoPlay?: boolean
  /** Milliseconds between automatic steps. */
  autoPlayInterval?: number
  /** Show previous and next buttons. */
  showControls?: boolean
  /** Name for the slide, receives the 0 based index. Defaults to "n of N". */
  getSlideLabel?: (index: number, total: number) => string
}

/**
 * Slides arranged on a rotating 3D ring. The front slide is interactive, the rest are inert and dimmed.
 * Rotation is step based (buttons, arrow keys, swipe, autoplay), so it is fully keyboard and touch operable.
 * Motion level none renders a flat scroll-snap list instead of the ring.
 */
export const CylinderCarousel = React.forwardRef<HTMLDivElement, CylinderCarouselProps>(
  (
    {
      items,
      label = "Carousel",
      variant,
      value,
      defaultValue = 0,
      onValueChange,
      cardWidth = 200,
      cardHeight = 280,
      gap = 24,
      autoPlay = false,
      autoPlayInterval = 3500,
      showControls = true,
      getSlideLabel,
      className,
      ...props
    },
    ref
  ) => {
    const total = items.length
    const ambient = useGlinStyle()
    const surface = resolveVariant(variant, ambient, "container")
    const { effectiveLevel, level } = useMotionEngine()
    const flat = level === "none"
    const animated = effectiveLevel === "full"
    const rootRef = React.useRef<HTMLDivElement | null>(null)
    const ringRef = React.useRef<HTMLDivElement | null>(null)
    const viewportRef = React.useRef<HTMLDivElement | null>(null)
    const slideRefs = React.useRef<Array<HTMLDivElement | null>>([])

    const controlled = value !== undefined
    const [innerStep, setInnerStep] = React.useState(() => mod(defaultValue, Math.max(total, 1)))
    // `step` is unbounded so the ring always turns the short way around.
    const [controlledStep, setControlledStep] = React.useState(() => (value ?? 0))
    const step = controlled ? controlledStep : innerStep
    const index = total > 0 ? mod(step, total) : 0
    const lastReported = React.useRef(index)

    // Sync controlled value to the nearest equivalent step.
    React.useEffect(() => {
      if (!controlled || total === 0) return
      setControlledStep((current) => {
        const delta = mod(value - current, total)
        if (delta === 0) return current
        return current + (delta > total / 2 ? delta - total : delta)
      })
    }, [controlled, value, total])

    const goToStep = React.useCallback(
      (next: number) => {
        if (total === 0) return
        if (controlled) setControlledStep(next)
        else setInnerStep(next)
      },
      [controlled, total]
    )

    React.useEffect(() => {
      if (lastReported.current !== index) {
        lastReported.current = index
        onValueChange?.(index)
      }
    }, [index, onValueChange])

    const move = React.useCallback((delta: number) => goToStep(step + delta), [goToStep, step])

    const isRtl = () => (rootRef.current ? getComputedStyle(rootRef.current).direction === "rtl" : false)

    // Geometry. Radius keeps neighbouring slides `gap` apart on the ring.
    const angle = total > 0 ? 360 / total : 0
    const radius = Math.round((cardWidth + gap) / 2 / Math.tan(Math.PI / Math.max(total, 3)))

    React.useLayoutEffect(() => {
      const el = rootRef.current
      if (!el) return
      el.style.setProperty("--cc-w", `${cardWidth}px`)
      el.style.setProperty("--cc-h", `${cardHeight}px`)
      el.style.setProperty("--cc-r", `${radius}px`)
      el.style.setProperty("--cc-ready", "1")
    }, [cardWidth, cardHeight, radius])

    React.useLayoutEffect(() => {
      ringRef.current?.style.setProperty("--cc-rot", `${(step * angle).toFixed(3)}deg`)
    }, [step, angle])

    // Flat mode: bring the front slide into view.
    React.useEffect(() => {
      if (!flat) return
      const slide = slideRefs.current[index]
      if (slide && typeof slide.scrollIntoView === "function") {
        slide.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" })
      }
    }, [flat, index])

    // Autoplay: only at motion level full, paused on hover, focus and by the user.
    const [hovered, setHovered] = React.useState(false)
    const [focused, setFocused] = React.useState(false)
    const [userPaused, setUserPaused] = React.useState(false)
    const running = autoPlay && animated && !flat && !hovered && !focused && !userPaused && total > 1
    React.useEffect(() => {
      if (!running) return
      const id = window.setInterval(() => goToStep(step + 1), Math.max(autoPlayInterval, 500))
      return () => window.clearInterval(id)
    }, [running, autoPlayInterval, goToStep, step])

    const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget || total === 0) return
      const rtl = isRtl()
      let delta = 0
      if (event.key === "ArrowRight") delta = rtl ? -1 : 1
      else if (event.key === "ArrowLeft") delta = rtl ? 1 : -1
      else if (event.key === "Home") delta = -index
      else if (event.key === "End") delta = total - 1 - index
      else return
      event.preventDefault()
      if (delta !== 0) move(delta)
    }

    // Swipe on touch and mouse. Vertical page scroll stays native through touch-action.
    const dragStart = React.useRef<number | null>(null)
    const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      if (flat || (event.pointerType === "mouse" && event.button !== 0)) return
      dragStart.current = event.clientX
    }
    const finishDrag = (event: React.PointerEvent<HTMLDivElement>) => {
      const start = dragStart.current
      dragStart.current = null
      if (start === null) return
      const dx = event.clientX - start
      if (Math.abs(dx) < SWIPE_THRESHOLD) return
      // Dragging the front face to the left reveals the next slide in LTR.
      move((dx < 0 ? 1 : -1) * (isRtl() ? -1 : 1))
    }

    const slideName = (i: number) => (getSlideLabel ? getSlideLabel(i, total) : `${i + 1} of ${total}`)
    const live = autoPlay && running ? "off" : "polite"

    return (
      <div
        ref={mergeRefs(ref, rootRef)}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        data-slot="cylinder-carousel"
        data-mode={flat ? "flat" : "ring"}
        data-motion={animated ? "full" : "reduced"}
        className={cn(
          "group/cc relative flex w-full flex-col items-center gap-4 [--cc-dir:1] rtl:[--cc-dir:-1]",
          className
        )}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false)
        }}
        {...props}
      >
        <div
          ref={viewportRef}
          tabIndex={flat ? undefined : 0}
          aria-live={live}
          data-slot="cylinder-carousel-viewport"
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerUp={finishDrag}
          onPointerCancel={() => (dragStart.current = null)}
          className={cn(
            "w-full rounded-[var(--radius-lg)] outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--surface-0)]",
            flat
              ? "flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2"
              : "grid h-[calc(var(--cc-h,280px)+3rem)] touch-pan-y select-none place-items-center overflow-hidden [perspective:var(--perspective-carousel,1200px)] [mask-image:linear-gradient(90deg,transparent,#000_14%,#000_86%,transparent)]"
          )}
        >
          <div
            ref={ringRef}
            data-slot="cylinder-carousel-ring"
            className={cn(
              flat
                ? "contents"
                : [
                    "relative grid place-items-center [transform-style:preserve-3d] [opacity:var(--cc-ready,0)]",
                    "[transform:translateZ(calc(var(--cc-r,0px)*-1))_rotateY(calc(var(--cc-rot,0deg)*-1*var(--cc-dir)))]",
                    "group-data-[motion=full]/cc:transition-transform group-data-[motion=full]/cc:duration-slow group-data-[motion=full]/cc:ease-standard"
                  ]
            )}
          >
            {items.map((item, i) => {
              const front = i === index
              return (
                <div
                  key={i}
                  ref={(el) => {
                    slideRefs.current[i] = el
                    if (el && !flat) {
                      el.style.setProperty("--cc-a", `${(i * angle).toFixed(3)}deg`)
                      if (front) el.removeAttribute("inert")
                      else el.setAttribute("inert", "")
                    } else if (el) {
                      el.removeAttribute("inert")
                    }
                  }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={slideName(i)}
                  data-slot="cylinder-carousel-slide"
                  data-front={front ? "true" : "false"}
                  className={cn(
                    "overflow-hidden",
                    containerSurface(surface, { radius: "xl" }),
                    flat
                      ? "h-[var(--cc-h,280px)] w-[var(--cc-w,200px)] shrink-0 snap-center"
                      : [
                          "[grid-area:1/1] h-[var(--cc-h,280px)] w-[var(--cc-w,200px)] [backface-visibility:hidden]",
                          "[transform:rotateY(calc(var(--cc-a,0deg)*var(--cc-dir)))_translateZ(var(--cc-r,0px))]",
                          front ? "opacity-100" : "opacity-50",
                          "group-data-[motion=full]/cc:transition-opacity group-data-[motion=full]/cc:duration-slow"
                        ]
                  )}
                >
                  {item}
                </div>
              )
            })}
          </div>
        </div>

        {showControls && total > 1 ? (
          <div className="flex items-center gap-2" data-slot="cylinder-carousel-controls">
            <Button
              type="button"
              size="icon"
              variant="outline"
              aria-label="Previous slide"
              onClick={() => move(-1)}
            >
              <CaretLeft aria-hidden="true" className="rtl:-scale-x-100" />
            </Button>
            {autoPlay && animated && !flat ? (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label={userPaused ? "Start automatic rotation" : "Pause automatic rotation"}
                aria-pressed={userPaused}
                onClick={() => setUserPaused((v) => !v)}
              >
                {userPaused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
              </Button>
            ) : null}
            <Button
              type="button"
              size="icon"
              variant="outline"
              aria-label="Next slide"
              onClick={() => move(1)}
            >
              <CaretRight aria-hidden="true" className="rtl:-scale-x-100" />
            </Button>
          </div>
        ) : null}
      </div>
    )
  }
)

CylinderCarousel.displayName = "CylinderCarousel"
