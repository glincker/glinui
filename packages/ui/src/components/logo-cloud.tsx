"use client"

import * as React from "react"

import { cn } from "../lib/cn"
import { Marquee } from "./marquee"
import { useMotionEngine } from "./motion-engine"
import { Text } from "./text"

export interface LogoCloudItem {
  /** Accessible name of the logo. */
  name: string
  /** Any node: inline SVG, a wordmark, an image. Never ships real brand marks in the docs. */
  logo: React.ReactNode
  href?: string
}

export type LogoCloudEntry = LogoCloudItem | React.ReactNode

export interface LogoCloudProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  items: LogoCloudEntry[]
  /** `grid` is a static responsive list. `marquee` scrolls (static grid under reduced motion). */
  layout?: "grid" | "marquee"
  /** Optional line above the logos. */
  title?: React.ReactNode
  /** Mask the start and end of the marquee. Default true. */
  fadeEdges?: boolean
  /** Seconds for one marquee loop. */
  speed?: number
  /** Grayscale until hover or focus. Default true. */
  grayscale?: boolean
  /** Accessible label of the list. Defaults to "Trusted by". */
  listLabel?: string
}

function isItem(entry: LogoCloudEntry): entry is LogoCloudItem {
  return typeof entry === "object" && entry !== null && !React.isValidElement(entry) && "logo" in entry && "name" in entry
}

const TILE =
  "inline-flex h-10 items-center justify-center px-5 text-[var(--color-muted)] transition-[filter,opacity,color] duration-base ease-standard motion-reduce:transition-none [&_svg]:h-6 [&_svg]:w-auto"
const GRAY =
  "[filter:grayscale(1)] opacity-75 hover:[filter:grayscale(0)] hover:opacity-100 hover:text-[var(--color-foreground)] focus-visible:[filter:grayscale(0)] focus-visible:opacity-100 focus-within:[filter:grayscale(0)] focus-within:opacity-100"
const LINK_FOCUS =
  "rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--surface-0)]"

function Tile({ entry, grayscale, asListItem, linked }: { entry: LogoCloudEntry; grayscale: boolean; asListItem: boolean; linked: boolean }) {
  const item = isItem(entry) ? entry : null
  const tone = cn(TILE, grayscale && GRAY)
  const inner = item ? (
    item.href && linked ? (
      <a href={item.href} aria-label={item.name} className={cn(tone, LINK_FOCUS)}>
        {item.logo}
      </a>
    ) : (
      <span role="img" aria-label={item.name} className={tone}>
        {item.logo}
      </span>
    )
  ) : (
    <span className={tone}>{entry as React.ReactNode}</span>
  )
  return asListItem ? <li data-slot="logo-cloud-item" className="flex justify-center">{inner}</li> : <div data-slot="logo-cloud-item">{inner}</div>
}

const FADE = "[mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]"

/**
 * Social proof strip. Accepts ReactNode logos (or `{ name, logo, href }`), grayscale to color on hover and focus,
 * and an optional marquee (items are not linked there, the looped copy is aria-hidden). The marquee pauses on hover and focus and falls back to a static grid when motion is reduced.
 */
export const LogoCloud = React.forwardRef<HTMLElement, LogoCloudProps>(
  (
    { className, items, layout = "grid", title, fadeEdges = true, speed = 40, grayscale = true, listLabel = "Trusted by", ...props },
    ref
  ) => {
    const { effectiveLevel } = useMotionEngine()
    const scrolling = layout === "marquee" && effectiveLevel === "full"

    return (
      <section ref={ref} data-slot="logo-cloud" data-layout={scrolling ? "marquee" : "grid"} className={cn("w-full min-w-0 max-w-full", className)} {...props}>
        {title ? (
          <Text variant="muted" size="sm" className="mb-6 text-center">
            {title}
          </Text>
        ) : null}
        {scrolling ? (
          <Marquee
            role="group"
            aria-label={listLabel}
            speed={speed}
            gap={24}
            pauseOnHover
            className={cn("[&:has(:focus-visible)>div]:[animation-play-state:paused]", fadeEdges && FADE)}
          >
            {items.map((entry, i) => (
              <Tile key={isItem(entry) ? entry.name : i} entry={entry} grayscale={grayscale} asListItem={false} linked={false} />
            ))}
          </Marquee>
        ) : (
          <ul
            aria-label={listLabel}
            className="mx-auto grid max-w-5xl grid-cols-2 items-center gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-6"
          >
            {items.map((entry, i) => (
              <Tile key={isItem(entry) ? entry.name : i} entry={entry} grayscale={grayscale} asListItem linked />
            ))}
          </ul>
        )}
      </section>
    )
  }
)

LogoCloud.displayName = "LogoCloud"

/** Generated wordmark placeholder for demos and tests. Text only, no real brand marks. */
export function LogoWordmark({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("whitespace-nowrap text-lg font-semibold tracking-tight", className)}>{children}</span>
}
