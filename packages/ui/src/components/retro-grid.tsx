import * as React from "react"
import { cn } from "../lib/cn"

export interface RetroGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Perspective angle in degrees */
  angle?: number
  /** Grid line color */
  lineColor?: string
  /** Grid line opacity (0-1) */
  lineOpacity?: number
  /** Grid cell size in px */
  cellSize?: number
}

export const RetroGrid = React.forwardRef<HTMLDivElement, RetroGridProps>(
  (
    {
      className,
      angle = 65,
      lineColor,
      lineOpacity = 0.3,
      cellSize = 60,
      style,
      ...props
    },
    ref
  ) => {
    const gridColor = lineColor ?? "currentColor"

    return (
      <div
        ref={ref}
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 overflow-hidden [--retro-grid-duration:10s] [perspective:200px]",
          className
        )}
        style={{
          "--retro-grid-cell": `${cellSize}px`,
          ...style,
        } as React.CSSProperties}
        {...props}
      >
        <div
          className="absolute inset-0 animate-retro-grid-scroll motion-reduce:[animation:none]"
          style={{
            transform: `rotateX(${angle}deg)`,
            backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 0), linear-gradient(to bottom, ${gridColor} 1px, transparent 0)`,
            backgroundSize: `${cellSize}px ${cellSize}px`,
            opacity: lineOpacity,
          }}
        />
      </div>
    )
  }
)

RetroGrid.displayName = "RetroGrid"
