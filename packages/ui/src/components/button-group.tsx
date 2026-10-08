"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import type { SurfaceTone } from "../lib/surface"

/** Shared look for buttons inside a ButtonGroup. A Button with its own prop wins over the group. */
export type ButtonGroupContextValue = {
  variant?: string
  tone?: SurfaceTone
  size?: "xs" | "sm" | "md" | "lg" | "icon"
}

export const ButtonGroupContext = React.createContext<ButtonGroupContextValue | null>(null)

const buttonGroupVariants = cva(
  "flex w-fit items-stretch [&>*]:relative [&>*]:!rounded-none [&>*]:hover:!translate-y-0 [&>*]:active:!scale-100 [&>*:focus-visible]:z-10 [&>input]:flex-1 has-[>[data-slot=button-group]]:gap-2",
  {
    variants: {
      orientation: {
        horizontal:
          "flex-row [&>*:first-child]:!rounded-s-xl [&>*:last-child]:!rounded-e-xl [&>*:not(:first-child)]:-ms-px",
        vertical:
          "flex-col [&>*]:w-full [&>*:first-child]:!rounded-t-xl [&>*:last-child]:!rounded-b-xl [&>*:not(:first-child)]:-mt-px"
      },
      variant: {
        default: "",
        glass: "rounded-xl backdrop-blur-md",
        glinr: "",
        solid: "",
        plain: "",
        soft: "",
        outline: "",
        ghost: "",
        gradient: ""
      }
    },
    defaultVariants: {
      orientation: "horizontal",
      variant: "default"
    }
  }
)

export type ButtonGroupProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof buttonGroupVariants> & {
    /** Tone applied to child Buttons that do not set their own. */
    tone?: SurfaceTone
    /** Size applied to child Buttons that do not set their own. */
    size?: ButtonGroupContextValue["size"]
  }

/**
 * Joins adjacent Buttons. `variant`, `tone` and `size` flow to child Buttons through context
 * (a Button's own prop wins), so `<ButtonGroup variant="outline">` styles the whole group.
 */
export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation, variant, tone, size, ...props }, ref) => {
    const shared = React.useMemo<ButtonGroupContextValue | null>(
      () => (variant && variant !== "default") || tone || size ? { variant: variant ?? undefined, tone, size } : null,
      [variant, tone, size]
    )

    return (
      <ButtonGroupContext.Provider value={shared}>
        <div
          ref={ref}
          role="group"
          data-slot="button-group"
          data-orientation={orientation ?? "horizontal"}
          className={cn(buttonGroupVariants({ orientation, variant }), className)}
          {...props}
        />
      </ButtonGroupContext.Provider>
    )
  }
)

ButtonGroup.displayName = "ButtonGroup"

export type ButtonGroupTextProps = React.HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean
}

export const ButtonGroupText = React.forwardRef<HTMLDivElement, ButtonGroupTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"

    return (
      <Comp
        ref={ref}
        data-slot="button-group-text"
        className={cn(
          "inline-flex h-9 items-center gap-2 border border-[var(--line-soft)] bg-[var(--surface-2)] px-3 text-sm font-medium text-[var(--color-foreground)] [box-shadow:var(--elev-1)] [&_svg]:pointer-events-none [&_svg]:size-4",
          className
        )}
        {...props}
      />
    )
  }
)

ButtonGroupText.displayName = "ButtonGroupText"

export const ButtonGroupSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical" }
>(({ className, orientation = "vertical", ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    aria-orientation={orientation}
    data-slot="button-group-separator"
    className={cn(
      "relative m-0 shrink-0 self-stretch bg-[var(--line-soft)]",
      orientation === "vertical" ? "w-px" : "h-px w-full",
      className
    )}
    {...props}
  />
))

ButtonGroupSeparator.displayName = "ButtonGroupSeparator"
