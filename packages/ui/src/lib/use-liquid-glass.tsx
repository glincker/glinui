"use client"

import type { CSSProperties, ReactNode } from "react"
import { useEffect, useId, useRef, useState } from "react"

/**
 * Liquid Glass, SVG displacement-map refraction for `backdrop-filter`.
 *
 * Uses `feDisplacementMap` to create real optical refraction through a
 * curved "squircle" surface. The SVG filter handles ONLY the displacement;
 * blur + saturation are chained as separate CSS `backdrop-filter` functions
 * so Chrome processes them correctly.
 *
 * `backdrop-filter: url(#svgFilter) blur(Xpx) saturate(Y)`
 *
 * Browser support (2026):
 *   - Chromium (Chrome, Edge, Brave, Arc, Opera), full refraction
 *   - Safari / Firefox, graceful fallback to CSS blur + saturate
 *
 * When Safari / Firefox add `backdrop-filter: url()` support, the
 * effect will automatically upgrade without code changes.
 *
 * Technique credit: https://kube.io/blog/liquid-glass-css-svg
 */

type LiquidGlassOptions = {
  /** Max pixel displacement for refraction (default: 40) */
  displacement?: number
  /** Gaussian blur standard-deviation in px (default: 12) */
  blur?: number
  /** Saturation multiplier, 1.8 = Apple's 180% (default: 1.8) */
  saturate?: number
  /** Surface profile shape (default: "squircle") */
  profile?: "squircle" | "convex"
  /** Disable the effect entirely (default: false) */
  disabled?: boolean
}

// ---------------------------------------------------------------------------
// Browser detection
// ---------------------------------------------------------------------------

/** Only Chromium exposes SVG filters as `backdrop-filter`. */
function supportsBackdropSvgFilter(): boolean {
  if (typeof navigator === "undefined") return false
  return /Chrome|Chromium/.test(navigator.userAgent)
}

// ---------------------------------------------------------------------------
// Displacement map generator
// ---------------------------------------------------------------------------

/**
 * Builds a PNG data-URL encoding a displacement map.
 *
 * Red channel  → horizontal displacement
 * Green channel → vertical displacement
 * 128 = neutral (no shift), ±127 = max shift.
 *
 * Generated at half resolution for performance, the SVG filter stretches
 * it to the element size via `preserveAspectRatio="none"`.
 */
function buildDisplacementMap(
  w: number,
  h: number,
  profile: "squircle" | "convex"
): string {
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")!
  const img = ctx.createImageData(w, h)
  const px = img.data

  const mx = w / 2
  const my = h / 2

  for (let row = 0; row < h; row++) {
    for (let col = 0; col < w; col++) {
      const i = (row * w + col) * 4

      // Normalized coords [-1, 1]
      const nx = (col - mx) / mx
      const ny = (row - my) / my

      // Distance from centre (squircle or circle)
      const dist =
        profile === "squircle"
          ? (Math.abs(nx) ** 4 + Math.abs(ny) ** 4) ** 0.25
          : Math.hypot(nx, ny)

      // Outside shape or dead-centre → no displacement
      if (dist >= 1 || dist < 0.002) {
        px[i] = 128
        px[i + 1] = 128
        px[i + 2] = 128
        px[i + 3] = 255
        continue
      }

      // Surface gradient magnitude (derivative of height function)
      let grad: number
      if (profile === "squircle") {
        // h = (1 - d^4)^0.25  →  |∇h| ∝ d^3 / (1 - d^4)^0.75
        grad = dist ** 3 / Math.max(1 - dist ** 4, 1e-4) ** 0.75
      } else {
        // h = √(1 - d²)  →  |∇h| = d / √(1 - d²)
        grad = dist / Math.max(1 - dist * dist, 1e-4) ** 0.5
      }

      // Smooth falloff near rim so edges don't clip hard
      grad *= (1 - dist) ** 0.5
      grad = Math.min(grad, 1)

      // Direction: radially outward from centre
      const angle = Math.atan2(ny, nx)
      const dx = Math.cos(angle) * grad
      const dy = Math.sin(angle) * grad

      // Encode in R/G channels, FULL range ±127 for maximum refraction
      px[i] = Math.round(Math.max(0, Math.min(255, 128 + dx * 127)))
      px[i + 1] = Math.round(Math.max(0, Math.min(255, 128 + dy * 127)))
      px[i + 2] = 128
      px[i + 3] = 255
    }
  }

  ctx.putImageData(img, 0, 0)
  return canvas.toDataURL("image/png")
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useLiquidGlass(opts: LiquidGlassOptions = {}) {
  const {
    displacement = 40,
    blur = 12,
    saturate = 1.8,
    profile = "squircle",
    disabled = false,
  } = opts

  const uid = useId().replace(/:/g, "")
  const filterId = `lg-${uid}`
  const ref = useRef<HTMLDivElement>(null)

  const [supported, setSupported] = useState(false)
  const [dim, setDim] = useState({ w: 0, h: 0 })
  const [mapUrl, setMapUrl] = useState<string | null>(null)

  // Detect Chromium on mount
  useEffect(() => {
    if (!disabled) setSupported(supportsBackdropSvgFilter())
  }, [disabled])

  // Observe element dimensions
  useEffect(() => {
    if (!supported || !ref.current) return

    const el = ref.current
    const ro = new ResizeObserver(([entry]) => {
      if (!entry) return
      const { width, height } = entry.contentRect
      setDim({ w: Math.round(width), h: Math.round(height) })
    })

    ro.observe(el)
    return () => ro.disconnect()
  }, [supported])

  // Generate displacement map at half resolution (better quality than 1/4)
  useEffect(() => {
    if (!supported || dim.w < 16 || dim.h < 16) return

    const scale = 0.5
    const url = buildDisplacementMap(
      Math.round(dim.w * scale),
      Math.round(dim.h * scale),
      profile
    )
    setMapUrl(url)
  }, [supported, dim.w, dim.h, profile])

  const ready = supported && !!mapUrl && dim.w > 0

  // SVG filter, ONLY displacement, no blur or saturate.
  // Blur + saturate are chained as CSS functions in `backdropFilter`.
  // This is critical: Chrome processes `url()` + CSS functions correctly
  // only when the SVG filter is simple (displacement only).
  const svgFilter = ready ? (
    <svg
      width="0"
      height="0"
      style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none" }}
      aria-hidden
    >
      <defs>
        <filter
          id={filterId}
          x="0"
          y="0"
          width={dim.w}
          height={dim.h}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          {/* 1. Load the displacement map image */}
          <feImage
            href={mapUrl!}
            x="0"
            y="0"
            width={dim.w}
            height={dim.h}
            result="dispMap"
            preserveAspectRatio="none"
          />
          {/* 2. Apply displacement refraction to backdrop */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="dispMap"
            scale={String(displacement)}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  ) : null

  // Style: chain SVG displacement with CSS blur + saturate
  // Chrome processes: url(#filter) → blur → saturate as a pipeline
  const style: CSSProperties = ready
    ? {
        backdropFilter: `url(#${filterId}) blur(${blur}px) saturate(${saturate})`,
        WebkitBackdropFilter: `url(#${filterId}) blur(${blur}px) saturate(${saturate})`,
      }
    : {}

  return {
    /** Attach to the glass element */
    ref,
    /** Render this anywhere in the DOM (hidden SVG filter defs) */
    svgFilter: svgFilter as ReactNode,
    /** Apply to the glass element's `style` prop */
    style,
    /** Filter ID (for manual usage) */
    filterId,
    /** True when SVG refraction is active (Chrome only) */
    isSupported: ready,
  }
}
