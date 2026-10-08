"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { warnIfUnlabeled } from "../lib/warn-unlabeled"
import type { ControlVariantProp } from "../lib/control"
import { toggleVariants, useToggleVariant } from "./toggle"

type ToggleGroupSpacing = 0 | 1 | 2 | 3

type ToggleGroupContextValue = Pick<VariantProps<typeof toggleVariants>, "size"> & {
  variant?: ControlVariantProp
  spacing: ToggleGroupSpacing
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({
  variant: undefined,
  size: "md",
  spacing: 0
})

const spacingClass: Record<ToggleGroupSpacing, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3"
}

export type ToggleGroupProps = React.ComponentPropsWithoutRef<
  typeof ToggleGroupPrimitive.Root
> &
  Pick<VariantProps<typeof toggleVariants>, "size"> & {
    /** Surface look for every item. Omit to follow the ambient design style. Same vocabulary as Toggle. */
    variant?: ControlVariantProp
    /** Gap between items. 0 merges items into one segmented control. */
    spacing?: ToggleGroupSpacing
  }

export const ToggleGroup = React.forwardRef<
  React.ComponentRef<typeof ToggleGroupPrimitive.Root>,
  ToggleGroupProps
>(({ className, variant, size, spacing = 0, children, ...props }, ref) => {
  const value = React.useMemo(
    () => ({ variant, size: size ?? "md", spacing }),
    [variant, size, spacing]
  )

  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      data-slot="toggle-group"
      className={cn("inline-flex items-center", spacingClass[spacing], className)}
      {...props}
    >
      <ToggleGroupContext.Provider value={value}>{children}</ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
})

ToggleGroup.displayName = "ToggleGroup"

export type ToggleGroupItemProps = React.ComponentPropsWithoutRef<
  typeof ToggleGroupPrimitive.Item
> &
  Pick<VariantProps<typeof toggleVariants>, "size"> & {
    variant?: ControlVariantProp
  }

export const ToggleGroupItem = React.forwardRef<
  React.ComponentRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(({ className, variant, size, ...props }, ref) => {
  const ctx = React.useContext(ToggleGroupContext)
  warnIfUnlabeled("ToggleGroupItem", props)
  const resolved = useToggleVariant(variant ?? ctx.variant)

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      data-slot="toggle-group-item"
      data-variant={resolved}
      className={cn(
        toggleVariants({ variant: resolved, size: size ?? ctx.size }),
        ctx.spacing === 0 &&
          "relative rounded-none first:rounded-s-xl last:rounded-e-xl [&:not(:first-child)]:-ms-px focus-visible:z-10 data-[state=on]:z-[1]",
        className
      )}
      {...props}
    />
  )
})

ToggleGroupItem.displayName = "ToggleGroupItem"
