"use client"

import * as React from "react"

import { cn } from "../lib/cn"
import { resolveVariant, type SurfaceVariant } from "../lib/surface"
import { useGlinStyle } from "./glin-provider"
import { mergeRefs, useMotionEngine } from "./motion-engine"

export interface HighlightGridCell {
  id: string
  /** Default cell content. Ignored when `cellRenderer` is given. */
  content?: React.ReactNode
  /** Accessible name when the cell has no readable text. */
  label?: string
  /** Renders the cell body as a link. */
  href?: string
}

export interface HighlightGridCellState {
  active: boolean
  index: number
}

export type HighlightGridVariant = SurfaceVariant | "default"

export interface HighlightGridProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  cells: HighlightGridCell[]
  /** Columns from the lg breakpoint up. Narrow screens use 1 or 2. */
  columns?: 1 | 2 | 3 | 4 | 5 | 6
  cellRenderer?: (cell: HighlightGridCell, state: HighlightGridCellState) => React.ReactNode
  /** Highlight panel look. `glinr` is an accent wash with a soft border, `plain` a neutral wash, `glass` a blurred sheet. */
  variant?: HighlightGridVariant
}

const COLUMN_CLASS: Record<NonNullable<HighlightGridProps["columns"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
}

const HIGHLIGHT_VARIANT = {
  glinr:
    "bg-[color-mix(in_oklab,var(--color-accent)_9%,transparent)] [box-shadow:inset_0_0_0_1px_color-mix(in_oklab,var(--color-accent)_32%,transparent)]",
  plain:
    "bg-[color-mix(in_oklab,var(--color-foreground)_6%,transparent)] [box-shadow:inset_0_0_0_1px_var(--line-soft)]",
  glass:
    "bg-[color-mix(in_oklab,var(--color-foreground)_8%,transparent)] backdrop-blur-md [box-shadow:inset_0_0_0_1px_color-mix(in_oklab,var(--color-foreground)_16%,transparent)]"
} as const

/**
 * Grid of hairline cells with one shared highlight panel. The panel glides to the hovered, tapped or focused cell and takes its size,
 * fades out when the pointer leaves, and appears already in place when entering from outside. Cells are measured against the grid
 * (physical offsets), so mirrored RTL layouts work. Arrow keys move between cells with a roving tabindex.
 */
export const HighlightGrid = React.forwardRef<HTMLDivElement, HighlightGridProps>(
  ({ cells, columns = 3, cellRenderer, variant, className, onKeyDown, ...props }, ref) => {
    const { effectiveLevel } = useMotionEngine()
    const animated = effectiveLevel === "full"
    const resolved = resolveVariant(variant, useGlinStyle(), "container")
    const look: keyof typeof HIGHLIGHT_VARIANT = resolved === "plain" || resolved === "glass" ? resolved : "glinr"
    const wrapRef = React.useRef<HTMLDivElement | null>(null)
    const highlightRef = React.useRef<HTMLDivElement | null>(null)
    const cellRefs = React.useRef<Array<HTMLLIElement | null>>([])
    const bodyRefs = React.useRef<Array<HTMLElement | null>>([])
    const [active, setActive] = React.useState(-1)
    const [focusable, setFocusable] = React.useState(0)
    const activeRef = React.useRef(-1)
    const visible = React.useRef(false)
    const pointerInside = React.useRef(false)
    const touchPinned = React.useRef(false)

    const place = React.useCallback((i: number) => {
      const hl = highlightRef.current
      const cell = cellRefs.current[i]
      if (!hl || !cell) return
      hl.style.setProperty("--hg-x", `${cell.offsetLeft}px`)
      hl.style.setProperty("--hg-y", `${cell.offsetTop}px`)
      hl.style.setProperty("--hg-w", `${cell.offsetWidth}px`)
      hl.style.setProperty("--hg-h", `${cell.offsetHeight}px`)
    }, [])

    const show = React.useCallback(
      (i: number) => {
        const hl = highlightRef.current
        if (!hl) return
        activeRef.current = i
        setActive(i)
        setFocusable(i)
        if (!visible.current) {
          // Entering from outside: snap into place without gliding, then fade in.
          hl.dataset.instant = "true"
          place(i)
          void hl.offsetWidth
          hl.dataset.visible = "true"
          visible.current = true
          requestAnimationFrame(() => {
            if (highlightRef.current) highlightRef.current.dataset.instant = "false"
          })
        } else {
          place(i)
        }
      },
      [place]
    )

    const hide = React.useCallback(() => {
      const hl = highlightRef.current
      if (hl) hl.dataset.visible = "false"
      visible.current = false
      activeRef.current = -1
      setActive(-1)
    }, [])

    // Re-measure on resize.
    React.useEffect(() => {
      const wrap = wrapRef.current
      if (!wrap || typeof ResizeObserver === "undefined") return
      const observer = new ResizeObserver(() => {
        if (activeRef.current >= 0) place(activeRef.current)
      })
      observer.observe(wrap)
      return () => observer.disconnect()
    }, [place])

    // A tap that starts outside the grid releases a touch pinned highlight.
    React.useEffect(() => {
      const onDown = (event: PointerEvent) => {
        if (!touchPinned.current) return
        if (wrapRef.current && !wrapRef.current.contains(event.target as Node | null)) {
          touchPinned.current = false
          hide()
        }
      }
      document.addEventListener("pointerdown", onDown)
      return () => document.removeEventListener("pointerdown", onDown)
    }, [hide])

    const columnCount = () => {
      const firstTop = cellRefs.current[0]?.offsetTop
      let count = 0
      for (const cell of cellRefs.current) {
        if (cell && cell.offsetTop === firstTop) count += 1
        else if (cell) break
      }
      return Math.max(count, 1)
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented || cells.length === 0) return
      const rtl = wrapRef.current ? getComputedStyle(wrapRef.current).direction === "rtl" : false
      const from = focusable
      let next = from
      if (event.key === "ArrowRight") next = from + (rtl ? -1 : 1)
      else if (event.key === "ArrowLeft") next = from + (rtl ? 1 : -1)
      else if (event.key === "ArrowDown") next = from + columnCount()
      else if (event.key === "ArrowUp") next = from - columnCount()
      else if (event.key === "Home") next = 0
      else if (event.key === "End") next = cells.length - 1
      else return
      event.preventDefault()
      next = Math.min(cells.length - 1, Math.max(0, next))
      setFocusable(next)
      bodyRefs.current[next]?.focus()
    }

    return (
      <div
        ref={mergeRefs(ref, wrapRef)}
        data-slot="highlight-grid"
        data-motion={animated ? "full" : "reduced"}
        className={cn(
          "group/hg relative isolate overflow-hidden rounded-[var(--radius-xl)] border border-[color:var(--line-soft)] bg-[var(--surface-1)]",
          className
        )}
        onKeyDown={handleKeyDown}
        onPointerLeave={(event) => {
          pointerInside.current = false
          if (event.pointerType === "touch") return
          if (!wrapRef.current?.contains(document.activeElement)) hide()
        }}
        onPointerEnter={() => {
          pointerInside.current = true
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null) && !pointerInside.current) hide()
        }}
        {...props}
      >
        <div
          ref={highlightRef}
          aria-hidden="true"
          data-slot="highlight-grid-panel"
          data-visible="false"
          data-instant="false"
          className={cn(
            "pointer-events-none absolute left-0 top-0 z-0 rounded-md opacity-0 data-[visible=true]:opacity-100",
            "h-[var(--hg-h,0px)] w-[var(--hg-w,0px)] [transform:translate(var(--hg-x,0px),var(--hg-y,0px))]",
            "group-data-[motion=full]/hg:transition-[transform,width,height,opacity] group-data-[motion=full]/hg:duration-normal group-data-[motion=full]/hg:ease-standard",
            "data-[instant=true]:!transition-none forced-colors:border forced-colors:border-[Highlight]",
            HIGHLIGHT_VARIANT[look]
          )}
        />
        <ul role="list" className={cn("-mb-px -me-px grid", COLUMN_CLASS[columns])}>
        {cells.map((cell, i) => {
          const isActive = i === active
          const body = cellRenderer ? cellRenderer(cell, { active: isActive, index: i }) : cell.content
          const bodyProps = {
            tabIndex: i === focusable ? 0 : -1,
            "aria-label": cell.label,
            className:
              "block h-full w-full rounded-[inherit] p-5 text-start outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[color:var(--color-accent)]",
            onFocus: () => show(i)
          }
          return (
            <li
              key={cell.id}
              ref={(el) => {
                cellRefs.current[i] = el
              }}
              data-slot="highlight-grid-cell"
              data-active={isActive ? "true" : "false"}
              className="relative z-[1] border-b border-e border-[color:var(--line-soft)]"
              onPointerEnter={(event) => {
                if (event.pointerType === "touch") touchPinned.current = true
                show(i)
              }}
              onPointerDown={(event) => {
                if (event.pointerType === "touch") {
                  touchPinned.current = true
                  show(i)
                }
              }}
            >
              {cell.href ? (
                <a
                  {...bodyProps}
                  data-slot="highlight-grid-cell-body"
                  href={cell.href}
                  ref={(el) => {
                    bodyRefs.current[i] = el
                  }}
                >
                  {body}
                </a>
              ) : (
                <div
                  {...bodyProps}
                  data-slot="highlight-grid-cell-body"
                  ref={(el) => {
                    bodyRefs.current[i] = el
                  }}
                >
                  {body}
                </div>
              )}
            </li>
          )
        })}
        </ul>
      </div>
    )
  }
)

HighlightGrid.displayName = "HighlightGrid"
