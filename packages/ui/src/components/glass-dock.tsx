"use client"

import * as React from "react"
import { cn } from "../lib/cn"
import { panelSurface, resolvePanelVariant, type PanelVariantProp } from "../lib/panel"
import type { SurfaceVariant } from "../lib/surface"
import { usePrefersReducedMotion } from "../lib/use-prefers-reduced-motion"

export interface GlassDockItem {
  id: string
  icon: React.ReactNode
  label: string
  onClick?: () => void
}

export interface GlassDockProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Dock items */
  items: GlassDockItem[]
  /** Base icon size in px */
  iconSize?: number
  /** Maximum magnification scale */
  magnification?: number
  /** Distance in px at which magnification starts */
  distance?: number
  /** Position */
  position?: "bottom" | "top" | "left" | "right"
  /**
   * Surface look. Glass by default (its identity, with a readable opacity floor). Pass `glinr`, `plain`, `solid`,
   * `soft`, `outline`, `ghost` or `gradient` for a crisp dock.
   */
  variant?: PanelVariantProp
}

/** Tile look per surface variant: raised key for glinr, flat for plain, tonal wash for glass. */
const TILE: Record<SurfaceVariant, string> = {
  glinr:
    "border border-transparent [--face:var(--face-3,var(--surface-3))] [background:var(--sheen)_padding-box,linear-gradient(var(--face),var(--face))_padding-box,var(--ring-hot,var(--ring))_border-box] [box-shadow:var(--elev-1)]",
  gradient:
    "border border-transparent [--face:var(--face-3,var(--surface-3))] [background:var(--sheen)_padding-box,linear-gradient(var(--face),var(--face))_padding-box,var(--ring-hot,var(--ring))_border-box] [box-shadow:var(--elev-1)]",
  plain: "border border-[color:var(--color-border)] bg-[var(--surface-2)]",
  solid: "bg-[var(--surface-3)] [box-shadow:var(--elev-1)]",
  soft: "bg-[var(--surface-3)] [box-shadow:var(--elev-1)]",
  outline: "border border-[color:var(--color-border)] bg-transparent",
  ghost: "bg-[color-mix(in_oklab,var(--color-foreground)_7%,transparent)]",
  glass: "border border-[color:var(--glass-border)] bg-[color-mix(in_oklab,var(--color-foreground)_10%,transparent)]"
}

export const GlassDock = React.forwardRef<HTMLDivElement, GlassDockProps>(
  (
    {
      className,
      items,
      iconSize = 48,
      magnification = 1.6,
      distance = 120,
      position = "bottom",
      variant,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = usePrefersReducedMotion()
    const dockRef = React.useRef<HTMLDivElement | null>(null)
    const [mouseX, setMouseX] = React.useState<number | null>(null)

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        dockRef.current = node
        if (typeof ref === "function") { ref(node); return }
        if (ref) ref.current = node
      },
      [ref]
    )

    const handleMouseMove = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (prefersReducedMotion) return
        const rect = dockRef.current?.getBoundingClientRect()
        if (!rect) return
        const isHorizontal = position === "bottom" || position === "top"
        setMouseX(isHorizontal ? event.clientX - rect.left : event.clientY - rect.top)
      },
      [prefersReducedMotion, position]
    )

    const handleMouseLeave = React.useCallback(() => {
      setMouseX(null)
    }, [])

    const resolved = resolvePanelVariant(variant, "glass")

    const positionClasses = {
      bottom: "flex-row",
      top: "flex-row",
      left: "flex-col",
      right: "flex-col",
    }

    return (
      <div
        ref={setRefs}
        role="toolbar"
        aria-label="Dock"
        data-variant={resolved}
        className={cn(
          panelSurface({ variant: resolved, shape: "dialog" }),
          "inline-flex items-end gap-1.5 p-2 [box-shadow:var(--elev-2)]",
          resolved === "plain" && "shadow-md",
          positionClasses[position],
          position === "left" || position === "right" ? "items-center" : "items-end",
          className
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {items.map((item, index) => {
          let scale = 1
          if (mouseX !== null && !prefersReducedMotion) {
            const itemCenter = index * (iconSize + 6) + iconSize / 2 + 8
            const dist = Math.abs(mouseX - itemCenter)
            if (dist < distance) {
              scale = 1 + (magnification - 1) * (1 - dist / distance)
            }
          }

          const currentSize = iconSize * scale

          return (
            <button
              key={item.id}
              type="button"
              aria-label={item.label}
              title={item.label}
              className="group relative flex flex-col items-center rounded-xl outline-none transition-transform duration-200 ease-out focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] motion-reduce:transition-none"
              style={{
                width: currentSize,
                height: currentSize,
              }}
              onClick={item.onClick}
            >
              <div
                className={cn("flex h-full w-full items-center justify-center rounded-xl text-foreground transition-shadow duration-200 hover:shadow-md motion-reduce:transition-none", TILE[resolved])}
                style={{ fontSize: currentSize * 0.5 }}
              >
                {item.icon}
              </div>
              <span className="absolute -bottom-5 scale-0 whitespace-nowrap rounded-md bg-[var(--neutral-solid)] px-2 py-0.5 text-[10px] text-[color:var(--neutral-solid-fg)] opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    )
  }
)

GlassDock.displayName = "GlassDock"
