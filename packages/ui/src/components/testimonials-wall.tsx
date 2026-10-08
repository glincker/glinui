"use client"

import * as React from "react"
import { Star } from "@phosphor-icons/react/dist/ssr"

import { cn } from "../lib/cn"
import { Avatar } from "./avatar"
import { resolveBlockVariant, type BlockVariant } from "./block-shell"
import { Card } from "./card"
import { useGlinStyle } from "./glin-provider"
import { Heading } from "./heading"
import { useMotionEngine } from "./motion-engine"
import { Text } from "./text"

export type TestimonialItem = {
  id?: string
  quote: string
  name: string
  role?: string
  /** Star rating from 0 to 5. Omit to hide the stars. */
  rating?: number
}

export type TestimonialsWallLayout = "masonry-columns" | "marquee-columns" | "single-quote"

export type TestimonialsWallProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  items: TestimonialItem[]
  layout?: TestimonialsWallLayout
  /** Shell look of the cards. Omit to follow the ambient style. */
  variant?: BlockVariant
  eyebrow?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  /** Seconds for one marquee loop. */
  duration?: number
}

const KEY = (item: TestimonialItem, index: number) => item.id ?? `${item.name}-${index}`

/** Two initials from a name, no image needed. */
export function testimonialInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  const first = parts[0]?.[0] ?? ""
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : ""
  return (first + last).toUpperCase()
}

function Stars({ rating }: { rating: number }) {
  const value = Math.max(0, Math.min(5, Math.round(rating)))
  return (
    <span role="img" aria-label={`Rated ${value} out of 5`} className="inline-flex gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          aria-hidden="true"
          weight={i < value ? "fill" : "regular"}
          className={cn("size-4", i < value ? "text-[var(--tone-warning)]" : "text-[var(--color-muted)]")}
        />
      ))}
    </span>
  )
}

function Quote({ item, variant, featured }: { item: TestimonialItem; variant: BlockVariant; featured?: boolean }) {
  return (
    <Card variant={variant} size="md" className="break-inside-avoid">
      <figure className="flex flex-col gap-4">
        {item.rating !== undefined ? <Stars rating={item.rating} /> : null}
        <blockquote
          className={cn(
            "text-[var(--color-foreground)]",
            featured ? "text-balance text-xl leading-8 sm:text-2xl sm:leading-9" : "text-sm leading-6"
          )}
        >
          <p>{item.quote}</p>
        </blockquote>
        <figcaption className="flex items-center gap-3">
          <Avatar size={featured ? "lg" : "md"} fallback={testimonialInitials(item.name)} alt="" />
          <span className="flex min-w-0 flex-col">
            <cite className="truncate text-sm font-medium not-italic text-[var(--color-foreground)]">{item.name}</cite>
            {item.role ? <span className="truncate text-xs text-[var(--color-muted)]">{item.role}</span> : null}
          </span>
        </figcaption>
      </figure>
    </Card>
  )
}

/** One vertical auto-scrolling column. The track is duplicated and the copy is hidden from assistive tech. */
function MarqueeColumn({
  items,
  variant,
  reverse,
  duration,
  animated
}: {
  items: TestimonialItem[]
  variant: BlockVariant
  reverse: boolean
  duration: number
  animated: boolean
}) {
  const trackRef = React.useRef<HTMLDivElement | null>(null)
  const animationRef = React.useRef<Animation | null>(null)

  React.useEffect(() => {
    const el = trackRef.current
    if (!el || !animated || typeof el.animate !== "function") return
    const keyframes = reverse
      ? [{ transform: "translateY(-50%)" }, { transform: "translateY(0)" }]
      : [{ transform: "translateY(0)" }, { transform: "translateY(-50%)" }]
    const animation = el.animate(keyframes, { duration: Math.max(duration, 1) * 1000, iterations: Infinity, easing: "linear" })
    animationRef.current = animation
    return () => {
      animation.cancel()
      animationRef.current = null
    }
  }, [animated, reverse, duration])

  const pause = () => animationRef.current?.pause()
  const play = () => animationRef.current?.play()

  return (
    <div
      data-slot="marquee-column"
      className={cn(
        "relative",
        animated &&
          "h-[34rem] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_12%,#000_88%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,#000_12%,#000_88%,transparent)]"
      )}
      onMouseEnter={pause}
      onMouseLeave={play}
      onFocus={pause}
      onBlur={play}
    >
      <div ref={trackRef} className="flex flex-col gap-4 will-change-transform">
        {items.map((item, i) => (
          <Quote key={KEY(item, i)} item={item} variant={variant} />
        ))}
        {animated
          ? items.map((item, i) => (
              <div key={`dup-${KEY(item, i)}`} aria-hidden="true" inert>
                <Quote item={item} variant={variant} />
              </div>
            ))
          : null}
      </div>
    </div>
  )
}

/**
 * Social proof wall. `masonry-columns` flows quotes into CSS columns, `marquee-columns` scrolls two columns in
 * opposite directions (static when motion is reduced), `single-quote` features the first item.
 */
export const TestimonialsWall = React.forwardRef<HTMLElement, TestimonialsWallProps>(
  ({ items, layout = "masonry-columns", variant, eyebrow, title, description, duration = 40, className, ...props }, ref) => {
    const id = React.useId()
    const headingId = title ? `${id}-title` : undefined
    const look = resolveBlockVariant(variant, useGlinStyle())
    const { effectiveLevel } = useMotionEngine()
    const animated = layout === "marquee-columns" && effectiveLevel === "full"

    const halves = React.useMemo(() => {
      const a: TestimonialItem[] = []
      const b: TestimonialItem[] = []
      items.forEach((item, i) => (i % 2 === 0 ? a : b).push(item))
      return [a, b]
    }, [items])

    return (
      <section
        ref={ref}
        aria-labelledby={headingId}
        data-layout={layout}
        data-variant={look}
        data-animated={animated ? "true" : "false"}
        className={cn("w-full px-4 py-16 sm:px-6 sm:py-20", className)}
        {...props}
      >
        <div className="mx-auto max-w-6xl">
          {title || description || eyebrow ? (
            <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-3 text-center">
              {eyebrow ? <Text variant="eyebrow">{eyebrow}</Text> : null}
              {title ? (
                <Heading id={headingId} level={2} size="h2">
                  {title}
                </Heading>
              ) : null}
              {description ? <Text lead>{description}</Text> : null}
            </div>
          ) : null}

          {layout === "single-quote" ? (
            items[0] ? (
              <div className="mx-auto max-w-3xl">
                <Quote item={items[0]} variant={look} featured />
              </div>
            ) : null
          ) : layout === "marquee-columns" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <MarqueeColumn items={halves[0] ?? []} variant={look} reverse={false} duration={duration} animated={animated} />
              <MarqueeColumn items={halves[1] ?? []} variant={look} reverse duration={duration} animated={animated} />
            </div>
          ) : (
            <div className="gap-4 [column-gap:1rem] sm:columns-2 lg:columns-3">
              {items.map((item, i) => (
                <div key={KEY(item, i)} className="mb-4 break-inside-avoid">
                  <Quote item={item} variant={look} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    )
  }
)

TestimonialsWall.displayName = "TestimonialsWall"
