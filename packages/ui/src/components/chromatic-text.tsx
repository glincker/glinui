import * as React from "react"
import { cn } from "../lib/cn"

export interface ChromaticTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Offset amount in px for the chromatic split */
  offset?: number
  /** Animation duration in seconds (0 = static) */
  duration?: number
  /** Colors for the channels [red, blue]. Defaults come from theme tokens; the fringes sit behind the base text so they read on any stage. */
  colors?: [string, string]
}

export const ChromaticText = React.forwardRef<HTMLSpanElement, ChromaticTextProps>(
  (
    {
      className,
      children,
      offset = 2,
      duration = 0,
      colors = ["var(--tone-danger)", "var(--tone-info)"],
      style,
      ...props
    },
    ref
  ) => {
    const isAnimated = duration > 0
    const text = typeof children === "string" ? children : undefined

    return (
      <span
        ref={ref}
        className={cn("relative inline-block", className)}
        style={style}
        {...props}
      >
        {/* Base text (visible) */}
        <span className="relative z-[1]">{children}</span>

        {text && (
          <>
            {/* Red channel */}
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-0 select-none opacity-70",
                isAnimated && "animate-chromatic-shift motion-reduce:[animation:none]"
              )}
              style={{
                color: colors[0],
                "--chromatic-offset": `${offset}px`,
                "--chromatic-duration": isAnimated ? `${duration}s` : undefined,
                transform: isAnimated ? undefined : `translate(${offset}px, ${-offset}px)`,
              } as React.CSSProperties}
            >
              {text}
            </span>

            {/* Blue channel */}
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-0 select-none opacity-70",
                isAnimated && "animate-chromatic-shift motion-reduce:[animation:none]"
              )}
              style={{
                color: colors[1],
                "--chromatic-offset": `${offset}px`,
                "--chromatic-duration": isAnimated ? `${duration}s` : undefined,
                transform: isAnimated ? undefined : `translate(${-offset}px, ${offset}px)`,
                animationDirection: isAnimated ? "reverse" : undefined,
              } as React.CSSProperties}
            >
              {text}
            </span>
          </>
        )}
      </span>
    )
  }
)

ChromaticText.displayName = "ChromaticText"
