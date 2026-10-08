"use client"

import * as React from "react"
import { cn } from "../lib/cn"
import { useControlVariant, type ControlVariant, type ControlVariantProp } from "../lib/control"
import { usePrefersReducedMotion } from "../lib/use-prefers-reduced-motion"

export interface MorphingTabItem {
  id: string
  label: React.ReactNode
  disabled?: boolean
}

export interface MorphingTabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Tab items */
  items: MorphingTabItem[]
  /** Active tab id */
  activeId?: string
  /** Default active tab id */
  defaultActiveId?: string
  /** Callback when active tab changes */
  onTabChange?: (id: string) => void
  /**
   * Look. Omit to follow the ambient design style (glinr = raised pill track with a sliding key).
   * Also: solid, plain, soft, outline, ghost, underline, glass (opt-in, needs a backdrop).
   */
  variant?: ControlVariantProp
  /** Size */
  size?: "sm" | "md" | "lg"
}

const MORPHING_VARIANTS = ["glinr", "solid", "plain", "soft", "outline", "ghost", "underline", "glass"] as const satisfies readonly ControlVariant[]

const TRACK_CLASSES: Record<(typeof MORPHING_VARIANTS)[number], string> = {
  glinr:
    "gap-1 rounded-full border border-transparent p-[3px] [--face:var(--face-2,var(--surface-2))] [--ring-img:var(--ring)] [background:var(--sheen)_padding-box,linear-gradient(var(--face),var(--face))_padding-box,var(--ring-img)_border-box] [box-shadow:var(--elev-1)]",
  solid: "rounded-xl border border-[color:var(--color-border)] bg-[var(--surface-3)] p-1 [box-shadow:var(--elev-inset)]",
  plain: "rounded-lg border border-transparent bg-[var(--surface-2)] p-[3px]",
  soft: "rounded-xl border border-transparent p-1",
  outline: "rounded-xl border border-[color:color-mix(in_oklab,var(--color-foreground)_30%,transparent)] p-1",
  ghost: "rounded-xl border border-transparent p-1",
  underline: "rounded-none border-0 border-b border-[color:var(--color-border)] p-0",
  glass:
    "rounded-xl border border-[color:var(--glass-border)] [border-top-color:var(--glass-refraction-top)] bg-[var(--glass-readable)] bg-clip-padding p-1 backdrop-blur-xl backdrop-saturate-[180%]"
}

const INDICATOR_CLASSES: Record<(typeof MORPHING_VARIANTS)[number], string> = {
  glinr:
    "rounded-full [background:linear-gradient(180deg,var(--key-white-top,#ffffff),var(--key-white-bottom,#dcdce1))] shadow-[inset_0_1px_0_#ffffff,inset_0_-1px_0_rgb(0_0_0_/_0.12),0_1px_2px_rgb(0_0_0_/_0.5)]",
  solid: "rounded-lg bg-[var(--neutral-solid)] [box-shadow:var(--solid-elev-1)]",
  plain: "rounded-md bg-[var(--surface-1)] shadow-sm",
  soft: "rounded-lg bg-[color-mix(in_oklab,var(--tone-accent)_14%,var(--surface-1))]",
  outline: "rounded-lg border border-[color:var(--color-foreground)] bg-[var(--surface-1)]",
  ghost: "rounded-lg bg-[color-mix(in_oklab,var(--color-foreground)_10%,transparent)]",
  underline: "rounded-full bg-[var(--color-accent)]",
  glass:
    "rounded-lg border border-[color:var(--glass-border)] [border-top-color:var(--glass-refraction-top)] bg-[color-mix(in_oklab,var(--color-foreground)_12%,transparent)] [box-shadow:var(--elev-1)]"
}

const ACTIVE_TEXT: Record<(typeof MORPHING_VARIANTS)[number], string> = {
  glinr: "text-[color:var(--key-ink,#000)]",
  solid: "text-[color:var(--neutral-solid-fg)]",
  plain: "text-[color:var(--color-foreground)]",
  soft: "text-[color:var(--tone-accent-text)]",
  outline: "text-[color:var(--color-foreground)]",
  ghost: "text-[color:var(--color-foreground)]",
  underline: "text-[color:var(--color-foreground)]",
  glass: "text-[color:var(--color-foreground)]"
}

export const MorphingTabs = React.forwardRef<HTMLDivElement, MorphingTabsProps>(
  (
    {
      className,
      items,
      activeId: controlledActiveId,
      defaultActiveId,
      onTabChange,
      variant: variantProp,
      size = "md",
      ...props
    },
    ref
  ) => {
    const variant = useControlVariant(variantProp, MORPHING_VARIANTS)
    const prefersReducedMotion = usePrefersReducedMotion()
    const [internalActive, setInternalActive] = React.useState(defaultActiveId ?? items[0]?.id ?? "")
    const activeId = controlledActiveId ?? internalActive
    const tabRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map())
    const containerRef = React.useRef<HTMLDivElement | null>(null)
    const [indicatorStyle, setIndicatorStyle] = React.useState<React.CSSProperties>({})

    const updateIndicator = React.useCallback(() => {
      const activeTab = tabRefs.current.get(activeId)
      const container = containerRef.current
      if (!activeTab || !container) return
      const containerRect = container.getBoundingClientRect()
      const tabRect = activeTab.getBoundingClientRect()
      const x = tabRect.left - containerRect.left - container.clientLeft
      const top = tabRect.top - containerRect.top - container.clientTop
      const height = variant === "underline" ? 2 : tabRect.height
      const y = variant === "underline" ? top + tabRect.height - height : top
      setIndicatorStyle({
        transform: `translate(${x}px, ${y}px)`,
        width: tabRect.width,
        height,
      })
    }, [activeId, variant])

    React.useEffect(() => {
      updateIndicator()
    }, [updateIndicator])

    React.useEffect(() => {
      const container = containerRef.current
      if (!container) return
      const observer = new ResizeObserver(() => updateIndicator())
      observer.observe(container)
      return () => observer.disconnect()
    }, [updateIndicator])

    const handleTabClick = (id: string) => {
      if (!controlledActiveId) setInternalActive(id)
      onTabChange?.(id)
    }

    const sizeClasses = {
      sm: "text-xs px-2.5 py-1",
      md: "text-sm px-3.5 py-1.5",
      lg: "text-base px-5 py-2",
    }

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node
        if (typeof ref === "function") { ref(node); return }
        if (ref) ref.current = node
      },
      [ref]
    )

    return (
      <div
        ref={setRefs}
        role="tablist"
        data-variant={variant}
        className={cn("relative inline-flex items-center gap-0.5", TRACK_CLASSES[variant], className)}
        {...props}
      >
        <div
          aria-hidden="true"
          className={cn(
            "absolute left-0 top-0 transition-transform ease-out",
            prefersReducedMotion ? "duration-0" : "duration-300",
            INDICATOR_CLASSES[variant]
          )}
          style={indicatorStyle}
        />
        {items.map((item) => (
          <button
            key={item.id}
            ref={(el) => { if (el) tabRefs.current.set(item.id, el); else tabRefs.current.delete(item.id) }}
            role="tab"
            type="button"
            aria-selected={activeId === item.id}
            disabled={item.disabled}
            className={cn(
              "relative z-[1] whitespace-nowrap font-medium transition-colors duration-200",
              sizeClasses[size],
              "rounded-[inherit] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--surface-0)]",
              activeId === item.id
                ? ACTIVE_TEXT[variant]
                : "text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]",
              item.disabled && "pointer-events-none opacity-40"
            )}
            onClick={() => handleTabClick(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    )
  }
)

MorphingTabs.displayName = "MorphingTabs"
