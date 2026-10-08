"use client"
/**
 * Glin UI Gradient Text (gradient-text). Adapted from AnimatedGradientText and AnimatedShinyText in Magic UI
 * (https://github.com/magicuidesign/magicui, apps/www/registry/magicui/animated-gradient-text.tsx,
 * apps/www/registry/magicui/animated-shiny-text.tsx), commit cdb348cb4c72a9b54b554d8617801e479fbc8714.
 * Original copyright (c) Magic UI. Licensed under MIT.
 * Modified for Glin UI: WAAPI sweep, tokens, badge with glass surface, forced colors, motion levels.
 * See THIRD_PARTY_NOTICES.md#gradient-text.
 */
import * as React from "react"
import { cn } from "../lib/cn"
import { surfaceVariants, type SurfaceVariant } from "../lib/surface"
import { resolveSurfaceProps } from "../lib/surface-resolve"
import { useGlinStyle } from "./glin-provider"
import { useMotionEngine } from "./motion-engine"

const BADGE_BASE = "inline-flex max-w-full items-center rounded-full px-3 py-1 text-sm font-medium"

const FLOW =
  "[--gt-from:var(--color-accent)] [--gt-to:var(--color-signal-ok)] bg-[linear-gradient(90deg,var(--gt-from),var(--gt-to),var(--gt-from))] [background-size:200%_100%] [background-repeat:repeat-x]"
const SHINE =
  "[--gt-base:var(--color-muted)] [--gt-glint:var(--color-foreground)] bg-[linear-gradient(110deg,transparent_35%,var(--gt-glint)_50%,transparent_65%),linear-gradient(var(--gt-base),var(--gt-base))] [background-size:250%_100%,100%_100%] [background-repeat:no-repeat] [background-position:0%_0,0_0]"

export interface GradientTextProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    Record<never, never> {
  /** Badge surface (with `badge`). Omit for the ambient design style (glinr by default). Vocabulary: glinr, solid, plain, soft, outline, ghost, gradient, glass. */
  variant?: SurfaceVariant | "default"
  /** `flow` slides a looping two color gradient, `shine` sweeps a glint over muted text. */
  effect?: "flow" | "shine"
  /** Wrap the text in a pill badge. `variant` styles the pill surface. */
  badge?: boolean
  /** Gradient start color (flow) or text color (shine). Any CSS color, defaults to Glin tokens. */
  from?: string
  /** Gradient end color (flow) or glint color (shine). */
  to?: string
  /** Animation speed multiplier. 1 is a 6 second loop for flow, 3 seconds for shine. */
  speed?: number
}

export const GradientText = React.forwardRef<HTMLSpanElement, GradientTextProps>(
  ({ className, children, effect = "flow", badge = false, variant, from, to, speed = 1, ...props }, ref) => {
    const { effectiveLevel } = useMotionEngine()
    const ambient = useGlinStyle()
    const { variant: resolvedBadge } = resolveSurfaceProps(variant, ambient, "control")
    const textRef = React.useRef<HTMLSpanElement | null>(null)
    const animated = effectiveLevel === "full" && speed > 0

    React.useLayoutEffect(() => {
      const el = textRef.current
      if (!el) return
      const a = effect === "flow" ? "--gt-from" : "--gt-base"
      const b = effect === "flow" ? "--gt-to" : "--gt-glint"
      if (from) el.style.setProperty(a, from)
      else el.style.removeProperty(a)
      if (to) el.style.setProperty(b, to)
      else el.style.removeProperty(b)
    }, [from, to, effect])

    React.useEffect(() => {
      const el = textRef.current
      if (!el || !animated || typeof el.animate !== "function") return
      const animation =
        effect === "flow"
          ? el.animate([{ backgroundPositionX: "0%" }, { backgroundPositionX: "200%" }], {
              duration: 6000 / speed,
              iterations: Infinity,
              easing: "linear"
            })
          : el.animate(
              [
                { backgroundPosition: "0% 0, 0 0" },
                { backgroundPosition: "100% 0, 0 0" }
              ],
              { duration: 3000 / speed, iterations: Infinity, easing: "linear", endDelay: 600 / speed }
            )
      return () => animation.cancel()
    }, [animated, effect, speed])

    const text = (
      <span
        ref={badge ? textRef : (node) => {
          textRef.current = node
          if (typeof ref === "function") ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLSpanElement | null>).current = node
        }}
        data-effect={effect}
        className={cn(
          "inline bg-clip-text text-transparent [-webkit-text-fill-color:transparent] forced-colors:bg-none forced-colors:text-[CanvasText] forced-colors:[-webkit-text-fill-color:CanvasText]",
          effect === "flow" ? FLOW : SHINE,
          !badge && className
        )}
        {...(badge ? {} : props)}
      >
        {children}
      </span>
    )

    if (!badge) return text
    return (
      <span
        ref={ref}
        data-variant={resolvedBadge}
        className={cn(
          BADGE_BASE,
          surfaceVariants({ variant: resolvedBadge, elevation: resolvedBadge === "glinr" ? "auto" : "none" }),
          resolvedBadge === "plain" && "rounded-md border-[color:var(--color-border)] bg-[var(--surface-1)] text-[color:var(--color-foreground)]",
          className
        )}
        {...props}
      >
        {text}
      </span>
    )
  }
)
GradientText.displayName = "GradientText"
