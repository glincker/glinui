"use client"

import * as React from "react"
import { cn } from "../lib/cn"
import { panelSurface, resolvePanelVariant, type PanelVariantProp } from "../lib/panel"

export interface GlassBreadcrumbItem {
  id: string
  label: React.ReactNode
  href?: string
  onClick?: () => void
}

export interface GlassBreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  /** Breadcrumb items */
  items: GlassBreadcrumbItem[]
  /** Separator character */
  separator?: React.ReactNode
  /** Max items to show (rest collapsed) */
  maxItems?: number
  /**
   * Surface look. Glass by default (its identity, with a readable opacity floor). Pass `glinr`, `plain`, `solid`,
   * `soft`, `outline`, `ghost` or `gradient` for a crisp trail.
   */
  variant?: PanelVariantProp
}

export const GlassBreadcrumb = React.forwardRef<HTMLElement, GlassBreadcrumbProps>(
  (
    {
      className,
      items,
      separator = "/",
      maxItems,
      variant,
      ...props
    },
    ref
  ) => {
    const visibleItems = React.useMemo(() => {
      if (!maxItems || items.length <= maxItems) return items
      const first = items[0]
      const last = items.slice(-(maxItems - 1))
      return [first, { id: "__ellipsis__", label: "..." } as GlassBreadcrumbItem, ...last]
    }, [items, maxItems])

    const resolved = resolvePanelVariant(variant, "glass")

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        data-variant={resolved}
        className={cn(
          panelSurface({ variant: resolved, shape: "popover" }),
          "inline-flex items-center gap-1 px-2 py-1 [box-shadow:var(--elev-1)]",
          resolved === "plain" && "shadow-sm",
          className
        )}
        {...props}
      >
        <ol className="flex items-center gap-1">
          {visibleItems.map((item, index) => (
            <li key={item.id} className="flex items-center gap-1">
              {index > 0 && (
                <span aria-hidden="true" className="text-xs text-[color:var(--color-muted)]">
                  {separator}
                </span>
              )}
              {item.id === "__ellipsis__" ? (
                <span className="px-1 text-sm text-[color:var(--color-muted)]">...</span>
              ) : index === visibleItems.length - 1 ? (
                <span
                  aria-current="page"
                  className="rounded-[var(--panel-item-r,0.5rem)] border border-transparent px-2 py-0.5 text-sm font-medium text-foreground [background:var(--panel-item-bg,color-mix(in_oklab,var(--color-foreground)_8%,transparent))] [box-shadow:var(--panel-item-shadow,none)]"
                >
                  {item.label}
                </span>
              ) : item.href ? (
                <a
                  href={item.href}
                  className="rounded-[var(--panel-item-r,0.5rem)] border border-transparent px-2 py-0.5 text-sm text-[color:var(--color-muted)] outline-none transition-[background-color,color] duration-200 hover:text-foreground hover:[background:var(--panel-item-bg,color-mix(in_oklab,var(--color-foreground)_8%,transparent))] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] motion-reduce:transition-none"
                  onClick={item.onClick}
                >
                  {item.label}
                </a>
              ) : (
                <button
                  type="button"
                  className="rounded-[var(--panel-item-r,0.5rem)] border border-transparent px-2 py-0.5 text-sm text-[color:var(--color-muted)] outline-none transition-[background-color,color] duration-200 hover:text-foreground hover:[background:var(--panel-item-bg,color-mix(in_oklab,var(--color-foreground)_8%,transparent))] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] motion-reduce:transition-none"
                  onClick={item.onClick}
                >
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ol>
      </nav>
    )
  }
)

GlassBreadcrumb.displayName = "GlassBreadcrumb"
