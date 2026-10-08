"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { blockShellVariants, resolveBlockLook, type BlockLook } from "../lib/block-shell"
import { Badge } from "./badge"
import { Button, type ButtonProps } from "./button"
import { useGlinStyle } from "./glin-provider"
import { Heading } from "./heading"
import { Reveal } from "./reveal"
import { Text } from "./text"

export interface HeroAction {
  label: React.ReactNode
  /** Renders an anchor when set, otherwise a button. */
  href?: string
  onClick?: React.MouseEventHandler<HTMLElement>
  icon?: React.ReactNode
  variant?: ButtonProps["variant"]
}

export type HeroLayout = "centered" | "split" | "stacked-media"

const contentVariants = cva("relative mx-auto flex w-full max-w-6xl px-4 sm:px-6 lg:px-8", {
  variants: {
    layout: {
      centered: "flex-col items-center py-20 text-center sm:py-28",
      split: "flex-col items-start gap-12 py-16 sm:py-24 lg:flex-row lg:items-center lg:gap-16",
      "stacked-media": "flex-col items-center gap-14 py-16 text-center sm:py-24"
    }
  },
  defaultVariants: { layout: "centered" }
})

export type HeroSectionProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> &
  VariantProps<typeof contentVariants> & {
    /** Block shell. Omit for the ambient style: glinr (open canvas), plain, or glass panel. */
    variant?: BlockLook | "default" | null
    /** Headline, rendered as the page level heading. */
    title: React.ReactNode
    /** Heading level of the headline. Default 1. */
    headingLevel?: 1 | 2
    /** Lede paragraph under the headline. */
    description?: React.ReactNode
    /** Small pill above the headline. A string gets a dot, a node is rendered as given. */
    announcement?: React.ReactNode
    /** Link target for the announcement pill. */
    announcementHref?: string
    primaryAction?: HeroAction
    secondaryAction?: HeroAction
    /** Media slot: end column for `split`, below the copy for `stacked-media`. */
    media?: React.ReactNode
    /** Optional strip under the actions (a LogoCloud, avatars, a rating line). */
    logos?: React.ReactNode
    /** Decorative layer behind the content (AuroraBackground, GridPattern, a gradient). Hidden from assistive tech. */
    background?: React.ReactNode
    /** Entrance reveal of the copy. Follows the motion level; none at level none. Default true. */
    entrance?: boolean
  }

function ActionButton({ action, primary }: { action: HeroAction; primary?: boolean }) {
  const common = {
    size: "lg" as const,
    variant: action.variant ?? (primary ? ("solid" as const) : ("outline" as const)),
    tone: primary ? ("accent" as const) : undefined
  }
  if (action.href) {
    return (
      <Button asChild {...common} leadingIcon={action.icon}>
        <a href={action.href} onClick={action.onClick}>
          {action.label}
        </a>
      </Button>
    )
  }
  return (
    <Button type="button" {...common} leadingIcon={action.icon} onClick={action.onClick}>
      {action.label}
    </Button>
  )
}

/**
 * Landing hero. Props driven: announcement pill, headline, lede, two actions, a media slot and a logo strip.
 * Layouts: `centered`, `split` (copy at the start, media at the end, mirrored in RTL) and `stacked-media`.
 */
export const HeroSection = React.forwardRef<HTMLElement, HeroSectionProps>(
  (
    {
      className,
      variant,
      layout = "centered",
      title,
      headingLevel = 1,
      description,
      announcement,
      announcementHref,
      primaryAction,
      secondaryAction,
      media,
      logos,
      background,
      entrance = true,
      "aria-labelledby": labelledBy,
      ...props
    },
    ref
  ) => {
    const ambient = useGlinStyle()
    const look = resolveBlockLook(variant, ambient)
    const reactId = React.useId()
    const titleId = labelledBy ?? `hero-${reactId}`
    const centered = layout !== "split"

    const pill =
      announcement == null ? null : typeof announcement === "string" ? (
        <Badge variant="outline" dot dotTone="accent" size="lg">
          {announcement}
        </Badge>
      ) : (
        announcement
      )

    const copy = (
      <div
        data-slot="hero-copy"
        className={cn("flex min-w-0 flex-col gap-6", centered ? "items-center" : "items-start lg:max-w-xl lg:flex-1")}
      >
        {pill ? (
          announcementHref ? (
            <a
              href={announcementHref}
              className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--surface-0)]"
            >
              {pill}
            </a>
          ) : (
            pill
          )
        ) : null}
        <Heading id={titleId} level={headingLevel} size="display" className="text-balance">
          {title}
        </Heading>
        {description ? (
          <Text lead className={cn("text-pretty", centered && "mx-auto")}>
            {description}
          </Text>
        ) : null}
        {primaryAction || secondaryAction ? (
          <div className={cn("flex flex-wrap gap-3", centered && "justify-center")}>
            {primaryAction ? <ActionButton action={primaryAction} primary /> : null}
            {secondaryAction ? <ActionButton action={secondaryAction} /> : null}
          </div>
        ) : null}
      </div>
    )

    return (
      <section
        ref={ref}
        data-slot="hero-section"
        data-layout={layout}
        data-look={look}
        aria-labelledby={titleId}
        className={cn(blockShellVariants({ look }), className)}
        {...props}
      >
        {background ? (
          <div aria-hidden="true" data-slot="hero-background" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            {background}
          </div>
        ) : null}
        <div className={contentVariants({ layout })}>
          {entrance ? (
            <Reveal variant="blur-slide" immediate className={cn(centered ? "w-full" : "lg:flex-1")}>
              {copy}
            </Reveal>
          ) : (
            copy
          )}
          {media ? (
            <div
              data-slot="hero-media"
              className={cn("w-full min-w-0", layout === "split" ? "lg:flex-1" : "max-w-5xl")}
            >
              {media}
            </div>
          ) : null}
        </div>
        {logos ? (
          <div data-slot="hero-logos" className="relative mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
            {logos}
          </div>
        ) : null}
      </section>
    )
  }
)

HeroSection.displayName = "HeroSection"
