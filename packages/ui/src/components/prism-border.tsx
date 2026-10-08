import * as React from "react"
import { cn } from "../lib/cn"

export interface PrismBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Animation duration in seconds */
  duration?: number
  /** Border width in px */
  borderWidth?: number
  /** Border radius */
  borderRadius?: string
  /** Custom gradient colors */
  colors?: string[]
}

export const PrismBorder = React.forwardRef<HTMLDivElement, PrismBorderProps>(
  (
    {
      className,
      children,
      duration = 3,
      borderWidth = 2,
      borderRadius = "0.75rem",
      colors = ["#f43f5e", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#6366f1", "#a855f7", "#f43f5e"],
      style,
      ...props
    },
    ref
  ) => {
    const gradient = `linear-gradient(90deg, ${colors.join(", ")})`

    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        style={{ borderRadius, ...style }}
        {...props}
      >
        {/* Animated gradient border */}
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-prism-rotate motion-reduce:[animation:none] [background-size:200%_200%] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:exclude] [-webkit-mask-composite:xor]"
          style={{
            "--prism-duration": `${duration}s`,
            backgroundImage: gradient,
            borderRadius,
            padding: borderWidth,
          } as React.CSSProperties}
        />
        {/* Content */}
        <div
          className="relative"
          style={{ borderRadius }}
        >
          {children}
        </div>
      </div>
    )
  }
)

PrismBorder.displayName = "PrismBorder"
