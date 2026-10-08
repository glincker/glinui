"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { CONTROL_SIZE_CLASSES, textControlVariants, useControlVariant, type ControlVariantProp } from "../lib/control"

const inputSizeVariants = cva("", {
  variants: {
    size: CONTROL_SIZE_CLASSES,
    underline: { true: "px-0", false: "" }
  },
  defaultVariants: { size: "md", underline: false }
})

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> &
  Pick<VariantProps<typeof inputSizeVariants>, "size"> & {
    /**
     * Surface look. Omit to follow the ambient design style (glinr = inset well, minimal = plain).
     * Also: solid, plain, soft, outline, ghost, glass (opt-in, needs a backdrop), plus the legacy liquid, matte, frosted, underline, filled.
     */
    variant?: ControlVariantProp
  }

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type = "text", ...props }, ref) => {
    const resolved = useControlVariant(variant)
    return (
      <input
        ref={ref}
        type={type}
        data-variant={resolved}
        className={cn(
          textControlVariants({ variant: resolved }),
          inputSizeVariants({ size, underline: resolved === "underline" }),
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"
