import * as React from "react"
import { cn } from "../lib/cn"

export interface DotPatternProps extends React.SVGAttributes<SVGSVGElement> {
  dotSize?: number
  gap?: number
  dotColor?: string
  dotOpacity?: number
  cr?: number
}

export const DotPattern = React.forwardRef<SVGSVGElement, DotPatternProps>(
  (
    {
      className,
      dotSize = 1.5,
      gap = 20,
      dotColor = "currentColor",
      dotOpacity = 0.2,
      cr,
      ...props
    },
    ref
  ) => {
    const id = React.useId()
    const patternId = `dot-pattern-${id}`
    const radius = cr ?? dotSize

    return (
      <svg
        ref={ref}
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full text-[color:var(--color-foreground)]",
          className
        )}
        {...props}
      >
        <defs>
          <pattern
            id={patternId}
            x={0}
            y={0}
            width={gap}
            height={gap}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={dotSize}
              cy={dotSize}
              r={radius}
              fill={dotColor}
              fillOpacity={dotOpacity}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    )
  }
)

DotPattern.displayName = "DotPattern"
