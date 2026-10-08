"use client"

/**
 * Glin UI Flickering Grid (flickering-grid). Adapted from FlickeringGrid in Magic UI
 * (https://github.com/magicuidesign/magicui, apps/www/registry/magicui/flickering-grid.tsx),
 * commit cdb348cb4c72a9b54b554d8617801e479fbc8714.
 * Original copyright (c) Magic UI. Licensed under MIT.
 * Modified for Glin UI: token colors resolved at runtime, DPR transform, fps cap, pause offscreen and hidden, static frame for reduced motion.
 * See THIRD_PARTY_NOTICES.md#flickering-grid.
 */

import * as React from "react"

import { cn } from "../lib/cn"
import { usePlaybackActive } from "../lib/use-playback-active"
import { mergeRefs, useMotionEngine } from "./motion-engine"

const FALLBACK_RGB = "128, 128, 128"
const SENTINEL = "#010203"

export interface FlickeringGridProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  /** Square edge in px. */
  squareSize?: number
  /** Gap between squares in px. */
  gridGap?: number
  /** Chance per second that a square re-rolls its opacity. */
  flickerChance?: number
  /** Any CSS color, including var(), oklch() and color-mix(). Defaults to the foreground token. */
  color?: string
  /** Highest opacity a square can reach. Keep at or below 0.3 behind text. */
  maxOpacity?: number
  /** Frame cap for the flicker loop. */
  maxFps?: number
  /** Seed for the deterministic starting pattern. */
  seed?: number
  variant?: "square" | "round"
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Convert any CSS color the browser understands to an "r, g, b" string. */
export function toRgbTriplet(color: string): string {
  if (typeof document === "undefined") return FALLBACK_RGB
  try {
    const probe = document.createElement("canvas")
    probe.width = probe.height = 1
    const ctx = probe.getContext("2d", { willReadFrequently: true })
    if (!ctx) return FALLBACK_RGB
    ctx.fillStyle = SENTINEL
    ctx.fillStyle = color
    if (ctx.fillStyle === SENTINEL && color.trim().toLowerCase() !== SENTINEL) return FALLBACK_RGB
    ctx.clearRect(0, 0, 1, 1)
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data)
    return `${r}, ${g}, ${b}`
  } catch {
    return FALLBACK_RGB
  }
}

export const FlickeringGrid = React.forwardRef<HTMLDivElement, FlickeringGridProps>(
  (
    {
      className,
      squareSize = 4,
      gridGap = 6,
      flickerChance = 0.3,
      color = "var(--color-foreground)",
      maxOpacity = 0.3,
      maxFps = 30,
      seed = 7,
      variant = "square",
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const { effectiveLevel } = useMotionEngine()
    const active = usePlaybackActive(containerRef)
    const animated = effectiveLevel === "full"
    const loopOn = animated && active

    React.useEffect(() => {
      const container = containerRef.current
      const canvas = canvasRef.current
      if (!container || !canvas || typeof window === "undefined") return
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const rand = mulberry32(seed)
      let rgb = FALLBACK_RGB
      let cols = 0
      let rows = 0
      let squares = new Float32Array(0)
      let dpr = 1
      let raf = 0
      let resizeRaf = 0
      let last = 0
      const frameGap = 1000 / Math.max(1, maxFps)
      const pitch = squareSize + gridGap

      const resolveColor = () => {
        container.style.setProperty("--glin-flicker-color", color)
        rgb = toRgbTriplet(getComputedStyle(canvas).color)
      }

      const draw = () => {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            ctx.fillStyle = `rgba(${rgb}, ${squares[i * rows + j]})`
            if (variant === "round") {
              ctx.beginPath()
              ctx.arc(i * pitch + squareSize / 2, j * pitch + squareSize / 2, squareSize / 2, 0, Math.PI * 2)
              ctx.fill()
            } else {
              ctx.fillRect(i * pitch, j * pitch, squareSize, squareSize)
            }
          }
        }
      }

      const setup = () => {
        const w = container.clientWidth
        const h = container.clientHeight
        dpr = window.devicePixelRatio || 1
        canvas.width = Math.max(1, Math.floor(w * dpr))
        canvas.height = Math.max(1, Math.floor(h * dpr))
        cols = Math.ceil(w / pitch)
        rows = Math.ceil(h / pitch)
        squares = new Float32Array(cols * rows)
        for (let i = 0; i < squares.length; i++) squares[i] = rand() * maxOpacity
        draw()
      }

      const tick = (time: number) => {
        raf = requestAnimationFrame(tick)
        if (time - last < frameGap) return
        const dt = last ? (time - last) / 1000 : 0
        last = time
        for (let i = 0; i < squares.length; i++) {
          if (Math.random() < flickerChance * dt) squares[i] = Math.random() * maxOpacity
        }
        draw()
      }

      resolveColor()
      setup()
      if (loopOn) raf = requestAnimationFrame(tick)

      const resizeObserver =
        typeof ResizeObserver === "undefined"
          ? null
          : new ResizeObserver(() => {
              cancelAnimationFrame(resizeRaf)
              resizeRaf = requestAnimationFrame(setup)
            })
      resizeObserver?.observe(container)

      const themeObserver =
        typeof MutationObserver === "undefined"
          ? null
          : new MutationObserver(() => {
              resolveColor()
              draw()
            })
      themeObserver?.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class", "data-theme", "style"]
      })

      return () => {
        cancelAnimationFrame(raf)
        cancelAnimationFrame(resizeRaf)
        resizeObserver?.disconnect()
        themeObserver?.disconnect()
      }
    }, [color, flickerChance, gridGap, loopOn, maxFps, maxOpacity, seed, squareSize, variant])

    return (
      <div
        ref={mergeRefs(ref, containerRef)}
        aria-hidden="true"
        data-slot="flickering-grid"
        data-animated={loopOn ? "true" : "false"}
        className={cn("pointer-events-none relative size-full select-none", className)}
        {...props}
      >
        <canvas
          ref={canvasRef}
          width={1}
          height={1}
          className="absolute inset-0 size-full [color:var(--glin-flicker-color,var(--color-foreground))]"
        />
      </div>
    )
  }
)

FlickeringGrid.displayName = "FlickeringGrid"
