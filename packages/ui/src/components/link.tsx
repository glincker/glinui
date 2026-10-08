import * as React from "react"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"

const linkVariants = cva(
  "inline-flex items-center gap-1 rounded-md font-medium transition-[color,background-color,border-color,box-shadow] duration-fast ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-0)] motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default: "text-[var(--color-accent)] hover:text-[color-mix(in_oklch,var(--color-accent)_80%,var(--color-foreground))]",
        glass:
          "border border-[color:var(--glass-border)] [border-top-color:var(--glass-refraction-top)] bg-[var(--glass-readable)] px-2 py-1 text-[var(--color-foreground)] backdrop-blur-xl backdrop-saturate-[180%] hover:border-[color:var(--glass-border-strong)]",
        outline:
          "border border-[var(--color-border)] px-2 py-1 text-[var(--color-foreground)] hover:border-[color:var(--color-accent)]",
        ghost: "px-2 py-1 text-foreground/80 hover:bg-[color-mix(in_oklab,var(--color-foreground)_7%,transparent)]",
        arrow:
          "gap-1.5 text-[var(--color-accent)] hover:text-[color-mix(in_oklch,var(--color-accent)_75%,var(--color-foreground))] focus-visible:text-[color-mix(in_oklch,var(--color-accent)_75%,var(--color-foreground))] [&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-fast [&_svg]:ease-standard [&:hover_svg]:translate-x-[3px] [&:focus-visible_svg]:translate-x-1 motion-reduce:[&_svg]:transition-none motion-reduce:[&:hover_svg]:translate-x-0 motion-reduce:[&:focus-visible_svg]:translate-x-0"
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base"
      },
      underline: {
        true: "underline underline-offset-4 decoration-1 decoration-[color-mix(in_oklch,var(--color-accent)_45%,transparent)] hover:decoration-[var(--color-accent)]",
        false: "no-underline"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      underline: true
    }
  }
)

export type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof linkVariants> & {
    /** Arrow variant only: hide the trailing arrow icon. */
    hideArrow?: boolean
  }

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, size, underline, hideArrow = false, children, ...props }, ref) => {
    const isArrow = variant === "arrow"
    const resolvedUnderline = underline ?? (isArrow ? false : undefined)

    return (
      <a
        ref={ref}
        className={cn(linkVariants({ variant, size, underline: resolvedUnderline }), className)}
        {...props}
      >
        {children}
        {isArrow && !hideArrow ? <ArrowRight aria-hidden="true" weight="bold" /> : null}
      </a>
    )
  }
)

Link.displayName = "Link"
