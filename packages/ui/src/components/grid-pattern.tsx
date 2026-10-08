"use client"

/**
 * Glin UI Grid Pattern (grid-pattern). Adapted from GridPattern, InteractiveGridPattern and StripedPattern in Magic UI
 * (https://github.com/magicuidesign/magicui, apps/www/registry/magicui/grid-pattern.tsx,
 * apps/www/registry/magicui/interactive-grid-pattern.tsx, apps/www/registry/magicui/striped-pattern.tsx),
 * commit cdb348cb4c72a9b54b554d8617801e479fbc8714.
 * Original copyright (c) Magic UI. Licensed under MIT.
 * Modified for Glin UI: tokens, useId safe ids, stripes variant, CSS only hover cells, edge fade masks, motion levels.
 * See THIRD_PARTY_NOTICES.md#grid-pattern.
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { mergeRefs, useMotionEngine } from "./motion-engine"

const MAX_INTERACTIVE_CELLS = 1600

const gridPatternVariants = cva(
  "absolute inset-0 size-full text-[color:var(--line-soft,var(--color-border))]",
  {
    variants: {
      variant: { grid: "", stripes: "" },
      fade: {
        none: "",
        radial:
          "[-webkit-mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]",
        top: "[-webkit-mask-image:linear-gradient(to_bottom,#000_20%,transparent)] [mask-image:linear-gradient(to_bottom,#000_20%,transparent)]",
        bottom:
          "[-webkit-mask-image:linear-gradient(to_top,#000_20%,transparent)] [mask-image:linear-gradient(to_top,#000_20%,transparent)]"
      }
    },
    defaultVariants: { variant: "grid", fade: "none" }
  }
)

export type GridPatternSquare = [x: number, y: number]

export interface GridPatternProps
  extends Omit<React.SVGProps<SVGSVGElement>, "width" | "height" | "x" | "y">,
    VariantProps<typeof gridPatternVariants> {
  /** Cell width in px. */
  width?: number
  /** Cell height in px. */
  height?: number
  x?: number
  y?: number
  strokeDasharray?: string
  /** Highlighted cells as [column, row] pairs. */
  squares?: GridPatternSquare[]
  /** Fill of highlighted and hovered cells. Defaults to the accent token. */
  squareColor?: string
  /** Cells light up on hover (CSS only). Content above the pattern will block pointer events. */
  interactive?: boolean
}

export const GridPattern = React.forwardRef<SVGSVGElement, GridPatternProps>(
  (
    {
      className,
      variant,
      fade,
      width = 40,
      height = 40,
      x = -1,
      y = -1,
      strokeDasharray = "0",
      squares,
      squareColor = "var(--color-accent)",
      interactive = false,
      ...props
    },
    ref
  ) => {
    const rawId = React.useId()
    const id = `glin-grid-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`
    const svgRef = React.useRef<SVGSVGElement>(null)
    const { effectiveLevel } = useMotionEngine()
    const animated = effectiveLevel === "full"
    const [size, setSize] = React.useState({ cols: 0, rows: 0 })

    React.useEffect(() => {
      const svg = svgRef.current
      if (!interactive || !svg || typeof ResizeObserver === "undefined") return
      let raf = 0
      const measure = () => {
        const rect = svg.getBoundingClientRect()
        let cols = Math.ceil(rect.width / width)
        let rows = Math.ceil(rect.height / height)
        if (cols * rows > MAX_INTERACTIVE_CELLS) {
          const scale = Math.sqrt(MAX_INTERACTIVE_CELLS / (cols * rows))
          cols = Math.floor(cols * scale)
          rows = Math.floor(rows * scale)
        }
        setSize((prev) => (prev.cols === cols && prev.rows === rows ? prev : { cols, rows }))
      }
      const observer = new ResizeObserver(() => {
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(measure)
      })
      observer.observe(svg)
      measure()
      return () => {
        cancelAnimationFrame(raf)
        observer.disconnect()
      }
    }, [interactive, width, height])

    React.useEffect(() => {
      svgRef.current?.style.setProperty("--glin-grid-square", squareColor)
    }, [squareColor])

    const isStripes = variant === "stripes"
    const cells = React.useMemo(() => {
      if (!interactive) return []
      const out: Array<[number, number]> = []
      for (let c = 0; c < size.cols; c++) for (let r = 0; r < size.rows; r++) out.push([c, r])
      return out
    }, [interactive, size])

    return (
      <svg
        ref={mergeRefs(ref, svgRef)}
        aria-hidden="true"
        focusable="false"
        data-slot="grid-pattern"
        data-variant={variant ?? "grid"}
        className={cn(
          gridPatternVariants({ variant, fade }),
          "pointer-events-none",
          className
        )}
        {...props}
      >
        <defs>
          <pattern
            id={id}
            width={width}
            height={height}
            patternUnits="userSpaceOnUse"
            patternTransform={isStripes ? "rotate(45)" : undefined}
            x={x}
            y={y}
          >
            {isStripes ? (
              <path
                d={`M0 .5H${width}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={1}
                strokeDasharray={strokeDasharray}
              />
            ) : (
              <path
                d={`M.5 ${height}V.5H${width}`}
                fill="none"
                stroke="currentColor"
                strokeDasharray={strokeDasharray}
              />
            )}
          </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
        {interactive && cells.length > 0 ? (
          <g data-slot="grid-pattern-cells" fill="transparent" stroke="none">
            {cells.map(([c, r]) => (
              <rect
                key={`${c}-${r}`}
                data-cell=""
                width={width - 1}
                height={height - 1}
                x={c * width + 1 + x + 1}
                y={r * height + 1 + y + 1}
                className="pointer-events-auto transition-[fill] duration-500 hover:fill-[color-mix(in_srgb,var(--glin-grid-square,var(--color-accent))_14%,transparent)] hover:duration-0 motion-reduce:transition-none"
              />
            ))}
          </g>
        ) : null}
        {squares ? (
          <svg x={x} y={y} className="overflow-visible" fill={squareColor} fillOpacity={0.14} stroke="none">
            {squares.map(([sx, sy], i) => (
              <rect
                key={`${sx}-${sy}`}
                data-square=""
                strokeWidth="0"
                width={width - 1}
                height={height - 1}
                x={sx * width + 1}
                y={sy * height + 1}
              >
                {animated ? (
                  <animate
                    attributeName="opacity"
                    values="0.35;1;0.35"
                    dur="4s"
                    begin={`${(i % 6) * 0.5}s`}
                    repeatCount="indefinite"
                  />
                ) : null}
              </rect>
            ))}
          </svg>
        ) : null}
      </svg>
    )
  }
)

GridPattern.displayName = "GridPattern"
