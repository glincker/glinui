"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { useGlinStyle } from "./glin-provider"

// ---------------------------------------------------------------------------
// Line variants, applied to the individual line element(s), not the wrapper
// ---------------------------------------------------------------------------
const lineVariants = cva("shrink-0", {
  variants: {
    variant: {
      default: "bg-[var(--color-border)]",
      glinr: "bg-[var(--line-soft)] shadow-[0_1px_0_color-mix(in_oklab,var(--color-foreground)_5%,transparent)]",
      plain: "bg-[var(--color-border)]",
      glass: [
        "bg-[var(--glass-refraction-top)]",
        "[background-image:linear-gradient(90deg,var(--glass-refraction-top),var(--glass-refraction-top))]",
        "opacity-60",
      ].join(" "),
      gradient:
        "bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent",
      dashed: "border-dashed border-[var(--color-border)] bg-transparent",
      dotted: "border-dotted border-[var(--color-border)] bg-transparent",
      outline: "border border-[var(--color-border)] bg-transparent",
      ghost: "bg-border/40",
      hairline: "[background:var(--hairline,linear-gradient(90deg,transparent,var(--color-border),transparent))]",
    },
    orientation: {
      horizontal: "w-full",
      vertical: "h-full",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  defaultVariants: {
    variant: "default",
    orientation: "horizontal",
    size: "md",
  },
  compoundVariants: [
    // horizontal thickness
    { orientation: "horizontal", size: "sm", class: "h-px" },
    { orientation: "horizontal", size: "md", class: "h-0.5" },
    { orientation: "horizontal", size: "lg", class: "h-1" },
    // vertical thickness
    { orientation: "vertical", size: "sm", class: "w-px" },
    { orientation: "vertical", size: "md", class: "w-0.5" },
    { orientation: "vertical", size: "lg", class: "w-1" },
    // dashed/dotted, use border thickness instead of background height/width
    { orientation: "horizontal", variant: "dashed", size: "sm", class: "h-0 border-t" },
    { orientation: "horizontal", variant: "dashed", size: "md", class: "h-0 border-t-2" },
    { orientation: "horizontal", variant: "dashed", size: "lg", class: "h-0 border-t-4" },
    { orientation: "vertical", variant: "dashed", size: "sm", class: "w-0 border-l" },
    { orientation: "vertical", variant: "dashed", size: "md", class: "w-0 border-l-2" },
    { orientation: "vertical", variant: "dashed", size: "lg", class: "w-0 border-l-4" },
    { orientation: "horizontal", variant: "dotted", size: "sm", class: "h-0 border-t" },
    { orientation: "horizontal", variant: "dotted", size: "md", class: "h-0 border-t-2" },
    { orientation: "horizontal", variant: "dotted", size: "lg", class: "h-0 border-t-4" },
    { orientation: "vertical", variant: "dotted", size: "sm", class: "w-0 border-l" },
    { orientation: "vertical", variant: "dotted", size: "md", class: "w-0 border-l-2" },
    { orientation: "vertical", variant: "dotted", size: "lg", class: "w-0 border-l-4" },
    // hairline: always 1px, top-lit fade along its length
    { orientation: "horizontal", variant: "hairline", class: "h-px" },
    {
      orientation: "vertical",
      variant: "hairline",
      class: "w-px [background:linear-gradient(180deg,transparent,var(--color-border),transparent)]",
    },
    // glinr and plain are crisp 1px lines (large is 2px)
    { orientation: "horizontal", variant: ["glinr", "plain"], size: ["sm", "md"], class: "h-px" },
    { orientation: "horizontal", variant: ["glinr", "plain"], size: "lg", class: "h-0.5" },
    { orientation: "vertical", variant: ["glinr", "plain"], size: ["sm", "md"], class: "w-px shadow-[1px_0_0_color-mix(in_oklab,var(--color-foreground)_5%,transparent)]" },
    { orientation: "vertical", variant: ["glinr", "plain"], size: "lg", class: "w-0.5" },
    { orientation: "vertical", variant: "plain", size: ["sm", "md"], class: "shadow-none" },
  ],
})

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type SeparatorProps = React.HTMLAttributes<HTMLDivElement> &
  Omit<VariantProps<typeof lineVariants>, "variant"> & {
    /**
     * Line style. Omitted (or `default`) follows the ambient design style: glinr (engraved hairline),
     * plain (flat 1px border color) or glass. Other names are fixed styles.
     */
    variant?: VariantProps<typeof lineVariants>["variant"]
    /** When true the element is purely visual (default). When false, role="separator" is applied. */
    decorative?: boolean
    /** Text label rendered centred on the separator line. */
    label?: string
    /** Icon node rendered centred on the separator line. Overrides label when both are provided. */
    icon?: React.ReactNode
  }

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    {
      className,
      variant: variantProp,
      orientation = "horizontal",
      size = "md",
      decorative = true,
      label,
      icon,
      ...props
    },
    ref,
  ) => {
    const ambient = useGlinStyle()
    const variant = !variantProp || variantProp === "default" ? (ambient === "minimal" ? "plain" : ambient === "glass" ? "glass" : "glinr") : variantProp
    const hasContent = icon !== undefined || label !== undefined
    const content = icon ?? label

    // Shared ARIA attributes
    const ariaProps = {
      role: decorative ? undefined : ("separator" as const),
      "aria-hidden": decorative ? (true as const) : undefined,
      "aria-orientation": decorative
        ? undefined
        : ((orientation ?? "horizontal") as "horizontal" | "vertical"),
    }

    // Simple line, no label/icon
    if (!hasContent) {
      return (
        <div
          ref={ref}
          {...ariaProps}
          className={cn(
            lineVariants({ variant, orientation, size }),
            className,
          )}
          {...props}
        />
      )
    }

    // Label / icon centred layout
    const isHorizontal = (orientation ?? "horizontal") === "horizontal"

    return (
      <div
        ref={ref}
        {...ariaProps}
        className={cn(
          "flex items-center",
          isHorizontal ? "flex-row gap-3 w-full" : "flex-col gap-3 h-full",
          className,
        )}
        {...props}
      >
        {/* Leading line */}
        <div
          className={cn(
            lineVariants({ variant, orientation, size }),
            isHorizontal ? "flex-1 w-auto" : "flex-1 h-auto",
          )}
          aria-hidden
        />

        {/* Centre content */}
        <span
          className={cn(
            "shrink-0 select-none text-xs font-medium text-[var(--color-muted)]",
            isHorizontal ? "px-1" : "py-1",
          )}
        >
          {content}
        </span>

        {/* Trailing line */}
        <div
          className={cn(
            lineVariants({ variant, orientation, size }),
            isHorizontal ? "flex-1 w-auto" : "flex-1 h-auto",
          )}
          aria-hidden
        />
      </div>
    )
  },
)

Separator.displayName = "Separator"
