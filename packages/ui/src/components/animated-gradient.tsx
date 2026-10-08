import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/cn"

const gradientVariants = cva(
  "motion-safe:animate-[gradient-shift_var(--gradient-duration,6s)_ease_infinite] [background-size:200%_200%]",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(135deg,var(--surface-1),color-mix(in_oklab,var(--color-accent)_40%,var(--surface-1)),var(--color-accent),var(--surface-1))]",
        glass:
          "border border-[color:var(--glass-border)] [border-top-color:var(--glass-refraction-top)] backdrop-blur-xl bg-[linear-gradient(135deg,color-mix(in_oklab,var(--color-foreground)_4%,transparent),color-mix(in_oklab,var(--color-foreground)_12%,transparent),color-mix(in_oklab,var(--color-foreground)_4%,transparent))]",
        warm:
          "bg-[linear-gradient(135deg,color-mix(in_oklab,var(--tone-warning)_35%,var(--surface-1)),var(--tone-warning),color-mix(in_oklab,var(--tone-warning)_55%,var(--tone-danger)),color-mix(in_oklab,var(--tone-warning)_60%,var(--surface-1)),color-mix(in_oklab,var(--tone-warning)_35%,var(--surface-1)))]",
        cool:
          "bg-[linear-gradient(135deg,color-mix(in_oklab,var(--tone-info)_35%,var(--surface-1)),var(--tone-info),color-mix(in_oklab,var(--tone-info)_55%,var(--gradient-to)),color-mix(in_oklab,var(--tone-info)_60%,var(--surface-1)),color-mix(in_oklab,var(--tone-info)_35%,var(--surface-1)))]",
        aurora:
          "bg-[linear-gradient(135deg,color-mix(in_oklab,var(--color-accent)_55%,var(--surface-1)),var(--color-accent),color-mix(in_oklab,var(--color-accent)_55%,var(--tone-info)),var(--gradient-to),color-mix(in_oklab,var(--color-accent)_55%,var(--surface-1)))]"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

export interface AnimatedGradientProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gradientVariants> {
  duration?: number
}

export const AnimatedGradient = React.forwardRef<HTMLDivElement, AnimatedGradientProps>(
  ({ className, variant, duration = 6, children, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        gradientVariants({ variant }),
        "motion-reduce:animate-none",
        className
      )}
      style={
        {
          "--gradient-duration": `${duration}s`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  )
)

AnimatedGradient.displayName = "AnimatedGradient"
