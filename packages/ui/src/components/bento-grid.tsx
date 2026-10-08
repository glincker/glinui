"use client"

/**
 * Glin UI Bento Grid (bento-grid). Adapted from BentoGrid and BentoCard in Magic UI
 * (https://github.com/magicuidesign/magicui, apps/www/registry/magicui/bento-grid.tsx),
 * commit cdb348cb4c72a9b54b554d8617801e479fbc8714.
 * Original copyright (c) Magic UI. Licensed under MIT.
 * Modified for Glin UI: responsive 1/2/3 columns, whole card anchor, keyboard reachable CTA, lift and glass surfaces, Phosphor arrow.
 * See THIRD_PARTY_NOTICES.md#bento-grid.
 */

import * as React from "react"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { cva } from "class-variance-authority"

import { cn } from "../lib/cn"
import { resolveVariant, type SurfaceVariant } from "../lib/surface"
import { useGlinStyle } from "./glin-provider"
import type { EngineRevealOptions, StaggerDirection } from "@glinui/motion"
import type { EngineControlProps } from "./reveal"
import { mergeRefs, useEngineRun, useMotionEngine } from "./motion-engine"

export type BentoGridProps = React.HTMLAttributes<HTMLDivElement> &
  EngineControlProps & {
    /** Reveal the cards in sequence when the grid enters the viewport. Off by default. */
    entrance?: boolean
    /** Delay between cards in ms. Default 70. */
    step?: number
    /** Order the cards appear in. Default `forward`. */
    order?: StaggerDirection
    /** Per-card duration in ms. */
    duration?: number
    /** Play on mount instead of waiting for the viewport. */
    immediate?: boolean
    /** Visible fraction required to trigger. Default 0.15. */
    threshold?: number
  }

const BENTO_ENTRANCE: EngineRevealOptions = { direction: "up", distance: 18, blur: 6 }

/**
 * Responsive grid: 1 column on phones, 2 from `sm`, 3 from `lg`. Spans are set with classes on cards.
 * With `entrance`, cards stagger in through the active motion engine (`engine` prop, provider, or `data-glin-engine`).
 */
export const BentoGrid = React.forwardRef<HTMLDivElement, BentoGridProps>(
  ({ className, entrance = false, step = 70, order = "forward", duration, immediate = false, threshold, engine, motion, children, ...props }, ref) => {
    const innerRef = React.useRef<HTMLDivElement | null>(null)
    const childCount = React.Children.count(children)

    useEngineRun(
      { engine, motion, hideRef: entrance ? innerRef : undefined },
      (instance) => {
        const el = innerRef.current
        if (!entrance || !el) return
        const items = Array.from(el.children).filter((c): c is HTMLElement => c instanceof HTMLElement)
        if (items.length === 0) return
        return instance.stagger(items, { ...BENTO_ENTRANCE, step, order, duration, immediate, threshold, trigger: el })
      },
      [entrance, step, order, duration, immediate, threshold, childCount]
    )

    return (
      <div
        ref={mergeRefs<HTMLDivElement>(innerRef, ref)}
        data-slot="bento-grid"
        data-glin-bento={entrance ? "entrance" : undefined}
        className={cn("grid w-full auto-rows-[minmax(16rem,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
BentoGrid.displayName = "BentoGrid"

const bentoCardVariants = cva(
  "group relative isolate flex min-h-[inherit] flex-col justify-between overflow-hidden text-[var(--color-foreground)] outline-none transition-[transform,box-shadow] duration-normal ease-standard focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] motion-reduce:transition-none",
  {
    variants: {
      variant: {
        glinr:
          "rounded-[var(--lift-r-outer)] border border-transparent [--face:var(--face-1,var(--surface-1))] [--elev:var(--elev-2)] [--ring-img:var(--ring)] [background:var(--sheen)_padding-box,linear-gradient(var(--face),var(--face))_padding-box,var(--ring-img)_border-box] [box-shadow:var(--elev)] hover:[--ring-img:var(--ring-hot,var(--ring))]",
        solid:
          "rounded-xl border border-[var(--color-border)] [background:linear-gradient(180deg,rgb(255_255_255_/_0.05),transparent),var(--surface-2)] [box-shadow:var(--elev-1)]",
        plain: "rounded-lg border border-[var(--color-border)] bg-[var(--surface-1)] shadow-sm",
        soft: "rounded-xl border border-[var(--line-soft)] bg-[var(--surface-2)] [box-shadow:var(--elev-1)]",
        outline: "rounded-xl border border-[var(--color-border)] bg-transparent",
        ghost: "rounded-xl border border-transparent bg-transparent hover:bg-[color-mix(in_oklab,var(--color-foreground)_5%,transparent)]",
        gradient:
          "rounded-xl border border-transparent text-white [--card-muted:rgb(255_255_255_/_0.82)] [background:linear-gradient(135deg,var(--gradient-from),var(--gradient-to))] [box-shadow:var(--solid-elev-1)]",
        glass:
          "rounded-xl border border-[color:var(--glass-border)] [border-top-color:var(--glass-refraction-top)] bg-[var(--glass-readable)] bg-clip-padding backdrop-blur-xl backdrop-saturate-[180%] [box-shadow:var(--glass-2-shadow)]"
      },
      interactive: {
        true: "hover:[--elev:var(--elev-3,var(--elev-2))] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5 motion-reduce:hover:translate-y-0",
        false: ""
      }
    },
    defaultVariants: { variant: "glinr", interactive: false }
  }
)

export interface BentoCardProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /** Surface look. Omitted follows the ambient style (glinr by default). `glass` is opt-in and needs a backdrop. */
  variant?: SurfaceVariant | "default" | null
  /** Card title, rendered as a heading. */
  name: string
  description: string
  /** Icon component (Phosphor icons work). Rendered decoratively. */
  Icon?: React.ElementType<{ className?: string; "aria-hidden"?: boolean }>
  /** When set the whole card is a single anchor. */
  href?: string
  /** Call to action label, shown with an arrow when `href` is set. */
  cta?: string
  target?: React.HTMLAttributeAnchorTarget
  rel?: string
  /** Decorative background layer (pattern, gradient, illustration). Hidden from assistive tech. */
  background?: React.ReactNode
  /** Heading level for the card name. */
  headingLevel?: 2 | 3 | 4
}

/**
 * Bento tile. With `href` the whole tile is one real anchor, so keyboard and screen reader users
 * reach the CTA, which fades in on hover and focus on fine pointers and is always visible elsewhere.
 */
export const BentoCard = React.forwardRef<HTMLElement, BentoCardProps>(
  ({ name, description, Icon, href, cta, target, rel, background, headingLevel = 3, variant, className, ...props }, ref) => {
    const resolved = resolveVariant(variant, useGlinStyle(), "container")
    const { effectiveLevel } = useMotionEngine()
    const motionOn = effectiveLevel === "full"
    const Heading = `h${headingLevel}` as "h2" | "h3" | "h4"
    const classes = cn(bentoCardVariants({ variant: resolved, interactive: Boolean(href) && motionOn }), className)

    const body = (
      <>
        {background ? (
          <div aria-hidden="true" data-slot="bento-background" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            {background}
          </div>
        ) : null}
        <div className="flex-1" />
        <div className="relative flex flex-col gap-1 p-5">
          {Icon ? (
            <Icon
              aria-hidden
              className="mb-2 size-10 origin-[left_center] text-[var(--color-foreground)] opacity-80 transition-transform duration-normal ease-standard rtl:origin-right group-hover:motion-safe:[@media(hover:hover)_and_(pointer:fine)]:scale-90"
            />
          ) : null}
          <Heading className="text-xl font-semibold tracking-tight text-[var(--color-foreground)]">{name}</Heading>
          <p className="max-w-lg text-sm text-[var(--card-muted,var(--color-muted))]">{description}</p>
          {href && cta ? (
            <span
              data-slot="bento-cta"
              className={cn(
                "mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent)]",
                motionOn &&
                  "[@media(hover:hover)_and_(pointer:fine)]:translate-y-1 [@media(hover:hover)_and_(pointer:fine)]:opacity-0 [@media(hover:hover)_and_(pointer:fine)]:transition-[opacity,transform] [@media(hover:hover)_and_(pointer:fine)]:duration-normal group-hover:[@media(hover:hover)_and_(pointer:fine)]:translate-y-0 group-hover:[@media(hover:hover)_and_(pointer:fine)]:opacity-100 group-focus-visible:[@media(hover:hover)_and_(pointer:fine)]:translate-y-0 group-focus-visible:[@media(hover:hover)_and_(pointer:fine)]:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none"
              )}
            >
              {cta}
              <ArrowRight aria-hidden className="size-4 rtl:rotate-180" weight="bold" />
            </span>
          ) : null}
        </div>
      </>
    )

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
          data-slot="bento-card"
          data-variant={resolved}
          className={classes}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {body}
        </a>
      )
    }

    return (
      <div ref={ref as React.Ref<HTMLDivElement>} data-slot="bento-card" data-variant={resolved} className={classes} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
        {body}
      </div>
    )
  }
)
BentoCard.displayName = "BentoCard"
