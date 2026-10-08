/**
 * Glin UI Browser Frame (browser-frame). Adapted from Safari in Magic UI
 * (https://github.com/magicuidesign/magicui, apps/www/registry/magicui/safari.tsx),
 * commit cdb348cb4c72a9b54b554d8617801e479fbc8714.
 * Original copyright (c) Magic UI. Licensed under MIT.
 * Modified for Glin UI: generic CSS chrome instead of a monolithic SVG, children slot, tokens, glass, RTL, real address text, no bundled media.
 * See THIRD_PARTY_NOTICES.md#browser-frame.
 */

"use client"

import * as React from "react"
import { Lock } from "@phosphor-icons/react/dist/ssr"

import { cn } from "../lib/cn"
import type { SurfaceTone, SurfaceVariant } from "../lib/surface"
import { containerSurface, resolveSurfaceProps } from "../lib/surface-resolve"
import { useGlinStyle } from "./glin-provider"

const BROWSER_FRAME_BASE = "relative flex w-full flex-col"

/** Class string for the frame shell. Kept as an export for consumers composing their own frame. */
const browserFrameVariants = (opts: { variant: SurfaceVariant; tone?: SurfaceTone }): string =>
  cn(BROWSER_FRAME_BASE, containerSurface(opts.variant, { radius: "xl", elevation: "2", tone: opts.tone }))

type MediaProps =
  | { /** Image shown in the viewport when no children are given. */ src: string; alt: string }
  | { src?: undefined; alt?: undefined }

export type BrowserFrameProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title"> &
  MediaProps & {
    /** Visual variant. Omit for the ambient design style (glinr: lift shell with a raised chrome strip; plain: flat bordered window). */
    variant?: SurfaceVariant | "default" | "raised" | "frosted"
    tone?: SurfaceTone
    /** Text in the address bar. */
    url?: string
    /** `default` shows an address bar, `simple` a centered window title only. */
    mode?: "default" | "simple"
    /** Window title for `simple` mode. */
    title?: string
    /** Accessible name for the frame region. */
    frameLabel?: string
    /** Extra classes for the viewport (content) area. */
    viewportClassName?: string
  }

/**
 * Generic browser window chrome drawn with CSS and tokens. The chrome is decorative;
 * the address text is a real element and the viewport accepts any content.
 */
export const BrowserFrame = React.forwardRef<HTMLDivElement, BrowserFrameProps>(
  (
    {
      className,
      variant,
      tone,
      url = "glinui.com",
      mode = "default",
      title,
      frameLabel,
      src,
      alt,
      viewportClassName,
      children,
      ...props
    },
    ref
  ) => {
    const ambient = useGlinStyle()
    const { variant: resolved, tone: aliasTone } = resolveSurfaceProps(variant, ambient, "container")
    const heading = mode === "simple" ? (title ?? url) : url
    return (
      <div
        ref={ref}
        role="group"
        aria-label={frameLabel ?? `Browser window: ${heading}`}
        data-mode={mode}
        data-variant={resolved}
        className={cn(browserFrameVariants({ variant: resolved, tone: tone ?? aliasTone }), "overflow-hidden", className)}
        {...props}
      >
        <div
          data-slot="chrome"
          className={cn(
            "flex items-center gap-3 border-b px-3 py-2.5",
            resolved === "glinr" || resolved === "gradient"
              ? "relative z-[1] border-[color:var(--line-soft)] [background:var(--sheen),var(--face-0,var(--surface-2))] shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06),0_8px_12px_-8px_rgb(0_0_0_/_0.35)]"
              : "border-[color:var(--color-border)] bg-[color-mix(in_oklab,var(--color-foreground)_4%,var(--surface-2))]"
          )}
          dir="ltr"
        >
          <span aria-hidden="true" className="flex shrink-0 items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[color-mix(in_oklch,var(--color-muted)_45%,transparent)]" />
            <span className="size-2.5 rounded-full bg-[color-mix(in_oklch,var(--color-muted)_45%,transparent)]" />
            <span className="size-2.5 rounded-full bg-[color-mix(in_oklch,var(--color-muted)_45%,transparent)]" />
          </span>
          {mode === "default" ? (
            <div className="mx-auto flex min-w-0 max-w-md flex-1 items-center justify-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-1 text-xs text-[var(--color-muted)]">
              <Lock aria-hidden="true" weight="bold" className="size-3 shrink-0" />
              <span data-slot="address" className="truncate" dir="ltr">
                {url}
              </span>
            </div>
          ) : (
            <span data-slot="title" className="mx-auto min-w-0 truncate pe-10 text-xs font-medium text-[var(--color-muted)]">
              {heading}
            </span>
          )}
        </div>
        <div data-slot="viewport" className={cn("relative min-h-0 flex-1 bg-[var(--color-background)]", viewportClassName)}>
          {children ??
            (src ? (
              <img src={src} alt={alt} loading="lazy" className="block h-auto w-full" />
            ) : null)}
        </div>
      </div>
    )
  }
)

BrowserFrame.displayName = "BrowserFrame"

export { browserFrameVariants }
