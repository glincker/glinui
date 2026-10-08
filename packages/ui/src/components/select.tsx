"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { CONTROL_SIZE_CLASSES, textControlVariants, useControlVariant, type ControlVariantProp } from "../lib/control"

export type SelectOption = {
  label: string
  value: string
  disabled?: boolean
}

const selectSizeVariants = cva("", {
  variants: {
    size: CONTROL_SIZE_CLASSES,
    underline: { true: "px-0", false: "" }
  },
  defaultVariants: { size: "md", underline: false }
})

export type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> &
  Pick<VariantProps<typeof selectSizeVariants>, "size"> & {
    options: SelectOption[]
    placeholder?: string
    /** Surface look. Omit to follow the ambient design style. Same vocabulary as Input. */
    variant?: ControlVariantProp
  }

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder, variant, size, ...props }, ref) => {
    const resolved = useControlVariant(variant)
    return (
      <select
        ref={ref}
        data-variant={resolved}
        className={cn(
          textControlVariants({ variant: resolved }),
          selectSizeVariants({ size, underline: resolved === "underline" }),
          className
        )}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    )
  }
)

Select.displayName = "Select"
