import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"

const labelVariants = cva(
  "inline-flex items-center gap-1.5 font-medium text-[color:var(--color-foreground)] transition-colors duration-fast ease-standard peer-disabled:cursor-not-allowed peer-disabled:opacity-50 motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default: "",
        glinr: "",
        plain: "",
        solid: "rounded-md bg-[var(--neutral-solid)] px-2 py-1 text-[color:var(--neutral-solid-fg)]",
        soft: "rounded-md bg-[var(--surface-2)] px-2 py-1 shadow-[inset_0_0_0_1px_var(--line-soft)]",
        outline: "rounded-md border border-[color:color-mix(in_oklab,var(--color-foreground)_30%,transparent)] px-2 py-1",
        ghost: "rounded-md px-2 py-1 text-[color:var(--color-muted)]",
        glass:
          "rounded-md border border-[color:var(--glass-border)] [border-top-color:var(--glass-refraction-top)] bg-[var(--glass-readable)] bg-clip-padding px-2 py-1 backdrop-blur-xl backdrop-saturate-[180%]"
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
)

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> &
  Pick<VariantProps<typeof labelVariants>, "size"> & {
    /**
     * Chip treatment. Omit (or glinr, plain, default) for a plain text label that adapts to any ambient style.
     * Also: solid, soft, outline, ghost, glass (opt-in).
     */
    variant?: "default" | "glinr" | "plain" | "solid" | "soft" | "outline" | "ghost" | "glass" | "gradient" | "frosted"
  }

type LabelLook = NonNullable<VariantProps<typeof labelVariants>["variant"]>

const LABEL_ALIASES: Record<string, LabelLook> = { gradient: "solid", frosted: "glass" }

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, variant, size, ...props }, ref) => {
    const look = (variant && LABEL_ALIASES[variant]) || variant || "default"
    return <label ref={ref} className={cn(labelVariants({ variant: look as LabelLook, size }), className)} {...props} />
  }
)

Label.displayName = "Label"
