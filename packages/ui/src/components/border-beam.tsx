import * as React from "react"
import { cn } from "../lib/cn"

export interface BorderBeamProps extends React.HTMLAttributes<HTMLDivElement> {
  duration?: number
  delay?: number
  size?: number
  colorFrom?: string
  colorTo?: string
  borderRadius?: string
}

export const BorderBeam = React.forwardRef<HTMLDivElement, BorderBeamProps>(
  (
    {
      className,
      duration = 6,
      delay = 0,
      size = 100,
      colorFrom = "var(--color-accent)",
      colorTo = "transparent",
      borderRadius,
      style,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] motion-reduce:hidden",
        "[mask-clip:padding-box,border-box] [mask-composite:intersect]",
        "border border-transparent",
        "[mask-image:linear-gradient(transparent,transparent),linear-gradient(#fff,#fff)]",
        className
      )}
      style={
        {
          "--border-beam-duration": `${duration}s`,
          borderRadius: borderRadius,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <div
        className="absolute aspect-square [offset-path:rect(0_auto_auto_0)] motion-safe:animate-[border-beam_var(--border-beam-duration,6s)_linear_infinite]"
        style={
          {
            width: size,
            animationDelay: `${delay}s`,
            background: `linear-gradient(to left, ${colorFrom}, ${colorTo})`,
          } as React.CSSProperties
        }
      />
    </div>
  )
)

BorderBeam.displayName = "BorderBeam"
