"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { textControlVariants, useControlVariant, type ControlVariantProp } from "../lib/control"

const textareaSizeVariants = cva("", {
  variants: {
    size: {
      sm: "px-3 py-1.5 text-xs",
      md: "px-3.5 py-2 text-sm",
      lg: "px-4 py-2.5 text-base"
    },
    underline: { true: "px-0", false: "" }
  },
  defaultVariants: { size: "md", underline: false }
})

export type TextareaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> &
  Pick<VariantProps<typeof textareaSizeVariants>, "size"> & {
    /** Surface look. Omit to follow the ambient design style. Same vocabulary as Input. */
    variant?: ControlVariantProp
  }

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, rows = 4, variant, size, ...props }, ref) => {
    const resolved = useControlVariant(variant)
    return (
      <textarea
        ref={ref}
        rows={rows}
        data-variant={resolved}
        className={cn(
          textControlVariants({ variant: resolved }),
          textareaSizeVariants({ size, underline: resolved === "underline" }),
          className
        )}
        {...props}
      />
    )
  }
)

Textarea.displayName = "Textarea"
