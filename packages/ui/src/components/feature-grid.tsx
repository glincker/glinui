"use client"

import * as React from "react"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"

import { cn } from "../lib/cn"
import { blockShellVariants, resolveBlockLook, type BlockLook } from "../lib/block-shell"
import { BentoGrid } from "./bento-grid"
import { Card } from "./card"
import { useGlinStyle } from "./glin-provider"
import { Heading } from "./heading"
import { IconFrame } from "./icon-frame"
import { Text } from "./text"

export interface FeatureItem {
  /** Phosphor icon element or any node. Decorative. */
  icon?: React.ReactNode
  title: React.ReactNode
  description: React.ReactNode
  href?: string
  /** Link label. Defaults to "Learn more". */
  linkLabel?: string
  /** Media for `alternating-rows`. Falls back to a token gradient panel. */
  media?: React.ReactNode
  /** Column span in `bento` (1 or 2). Default follows a repeating pattern. */
  span?: 1 | 2
}

export type FeatureGridLayout = "three-up" | "alternating-rows" | "bento" | "icon-list"

export interface FeatureGridProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  features: FeatureItem[]
  layout?: FeatureGridLayout
  /** Block shell: glinr (open), plain, glass panel. Omit for the ambient style. */
  variant?: BlockLook | "default" | null
  eyebrow?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  /** Level of the section heading. Cards use the next level. Default 2. */
  headingLevel?: 2 | 3
}

const FOCUS =
  "rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--surface-0)]"

function FeatureLink({ item }: { item: FeatureItem }) {
  if (!item.href) return null
  return (
    <a href={item.href} className={cn("mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent)] hover:underline", FOCUS)}>
      {item.linkLabel ?? "Learn more"}
      <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
    </a>
  )
}

function Copy({ item, level, size = "sm" }: { item: FeatureItem; level: 3 | 4; size?: "sm" | "md" }) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-1.5">
      <Heading level={level} size={size}>
        {item.title}
      </Heading>
      <Text variant="muted">{item.description}</Text>
      <FeatureLink item={item} />
    </div>
  )
}

const BENTO_SPAN = ["lg:col-span-2", "", "", "lg:col-span-2"]

/**
 * Feature section. Layouts: `three-up` cards, `alternating-rows`, `bento` (composes BentoGrid) and `icon-list`.
 * Every feature gets an IconFrame; hover lift comes from the Card tokens.
 */
export const FeatureGrid = React.forwardRef<HTMLElement, FeatureGridProps>(
  (
    { className, features, layout = "three-up", variant, eyebrow, title, description, headingLevel = 2, "aria-labelledby": labelledBy, ...props },
    ref
  ) => {
    const look = resolveBlockLook(variant, useGlinStyle())
    const reactId = React.useId()
    const titleId = labelledBy ?? (title ? `features-${reactId}` : undefined)
    const itemLevel = (headingLevel + 1) as 3 | 4

    const icon = (item: FeatureItem) =>
      item.icon ? (
        <IconFrame size="lg" tone="accent" aria-hidden="true">
          {item.icon}
        </IconFrame>
      ) : null

    let body: React.ReactNode
    if (layout === "alternating-rows") {
      body = (
        <ol className="flex flex-col gap-16 sm:gap-24">
          {features.map((item, i) => (
            <li key={i} data-slot="feature" className={cn("flex flex-col items-center gap-8 lg:gap-16", i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row")}>
              <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
                {icon(item)}
                <Copy item={item} level={itemLevel} size="md" />
              </div>
              <div className="w-full min-w-0 flex-1">
                {item.media ?? (
                  <div
                    aria-hidden="true"
                    className="aspect-[4/3] w-full rounded-2xl border border-[var(--color-border)] [background:radial-gradient(120%_120%_at_20%_10%,color-mix(in_oklab,var(--color-accent)_22%,var(--surface-1)),var(--surface-2))]"
                  />
                )}
              </div>
            </li>
          ))}
        </ol>
      )
    } else if (layout === "icon-list") {
      body = (
        <ul className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {features.map((item, i) => (
            <li key={i} data-slot="feature" className="flex items-start gap-4">
              {icon(item)}
              <Copy item={item} level={itemLevel} />
            </li>
          ))}
        </ul>
      )
    } else {
      const bento = layout === "bento"
      const cards = features.map((item, i) => {
        const span = item.span === 2 ? "lg:col-span-2" : item.span === 1 ? "" : bento ? BENTO_SPAN[i % BENTO_SPAN.length] : ""
        return (
          <Card
            key={i}
            data-slot="feature"
            interactive={Boolean(item.href)}
            className={cn("flex flex-col items-start gap-4", span)}
          >
            {icon(item)}
            <Copy item={item} level={itemLevel} />
          </Card>
        )
      })
      body = bento ? (
        <BentoGrid className="auto-rows-fr gap-4">{cards}</BentoGrid>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{cards}</div>
      )
    }

    return (
      <section
        ref={ref}
        data-slot="feature-grid"
        data-layout={layout}
        data-look={look}
        aria-labelledby={titleId}
        className={cn(blockShellVariants({ look }), className)}
        {...props}
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          {title || eyebrow || description ? (
            <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-3 text-center sm:mb-16">
              {eyebrow ? <Text variant="eyebrow">{eyebrow}</Text> : null}
              {title ? (
                <Heading id={titleId} level={headingLevel} size="lg" className="text-balance">
                  {title}
                </Heading>
              ) : null}
              {description ? <Text variant="muted" size="lg" className="text-pretty">{description}</Text> : null}
            </div>
          ) : null}
          {body}
        </div>
      </section>
    )
  }
)

FeatureGrid.displayName = "FeatureGrid"
