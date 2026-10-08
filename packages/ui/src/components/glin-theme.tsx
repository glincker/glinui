import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "../lib/cn"

export type ThemeScopeTheme = "light" | "dark" | "inherit"
export type ThemeScopeLuminance = "bright" | "dim" | "neutral"
export type ThemeScopeBase = "obsidian" | "neutral" | "zinc" | "slate" | "stone" | "gray"
export type ThemeScopeSurface = "solid" | "glass"

export interface ThemeScopeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Force a theme for this subtree. `inherit` adds no theme attribute. */
  theme?: ThemeScopeTheme
  /** Default surface look for descendants that read `--glin-surface`. */
  surface?: ThemeScopeSurface
  /** Backdrop brightness hint for glass: tunes opacity floors and borders. */
  luminance?: ThemeScopeLuminance
  /** Base color (neutral scale) for this subtree. Omit to inherit. */
  base?: ThemeScopeBase
  /** Paint the scope's page background so it reads as a section. */
  fill?: boolean
  /** Render onto the child element instead of a div. */
  asChild?: boolean
}

/**
 * Forces a light or dark token set on a subtree, independent of the page theme.
 * Adds no semantics (no role, no aria). SSR safe: attributes only, no effects.
 */
export const ThemeScope = React.forwardRef<HTMLDivElement, ThemeScopeProps>(function ThemeScope(
  { theme = "inherit", surface, luminance, base, fill = false, asChild = false, className, children, ...props },
  ref
) {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp
      ref={ref}
      data-glin-theme={theme === "inherit" ? undefined : theme}
      data-glin-surface={surface}
      data-glin-base={base}
      data-glass-luminance={luminance}
      data-glin-fill={fill ? "" : undefined}
      className={cn(theme === "dark" && "dark", className)}
      {...props}
    >
      {children}
    </Comp>
  )
})
