import * as React from "react"
import { cn } from "../lib/cn"

export interface OrbitingCirclesProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Orbit radius in px */
  radius?: number
  /** Full orbit duration in seconds */
  duration?: number
  /** Animation delay in seconds */
  delay?: number
  /** Reverse orbit direction */
  reverse?: boolean
  /** Show orbit path ring */
  path?: boolean
  /** Starting angle in degrees */
  startAngle?: number
  /** Visual variant */
  variant?: "default" | "glass" | "3d"
  /** Size of the orbiting container in px */
  iconSize?: number
}

const variantClasses = {
  default: "",
  glass: cn(
    "rounded-full",
    "border border-[color:var(--glass-border)] [border-top-color:var(--glass-refraction-top)]",
    "bg-[var(--glass-readable)] backdrop-blur-xl backdrop-saturate-[180%]",
    "[box-shadow:var(--glass-2-shadow)]"
  ),
  "3d": cn(
    "rounded-full",
    "border border-[color:var(--glass-border-strong)] [border-top-color:var(--glass-refraction-top)]",
    "bg-[var(--glass-readable)] backdrop-blur-xl backdrop-saturate-[200%]",
    "[box-shadow:var(--glass-3-shadow)]"
  ),
}

export const OrbitingCircles = React.forwardRef<HTMLDivElement, OrbitingCirclesProps>(
  (
    {
      className,
      children,
      radius = 100,
      duration = 20,
      delay = 0,
      reverse = false,
      path = false,
      startAngle = 0,
      variant = "default",
      iconSize = 32,
      style,
      ...props
    },
    ref
  ) => {
    const half = iconSize / 2

    return (
      <>
        {path && (
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 size-full"
          >
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.1}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          </svg>
        )}
        <div
          ref={ref}
          className={cn(
            "absolute left-1/2 top-1/2 flex items-center justify-center animate-orbit motion-reduce:[animation:none]",
            variantClasses[variant],
            className
          )}
          style={{
            width: iconSize,
            height: iconSize,
            marginLeft: -half,
            marginTop: -half,
            "--orbit-radius": radius,
            "--orbit-start": startAngle,
            "--orbit-duration": `${duration}s`,
            animationDelay: `${-delay}s`,
            animationDirection: reverse ? "reverse" : "normal",
            ...style,
          } as React.CSSProperties}
          {...props}
        >
          {children}
        </div>
      </>
    )
  }
)

OrbitingCircles.displayName = "OrbitingCircles"
