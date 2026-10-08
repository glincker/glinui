"use client"

import * as React from "react"

import { cn } from "../lib/cn"
import { resolveBlockVariant, type BlockVariant } from "./block-shell"
import { Button } from "./button"
import { useGlinStyle } from "./glin-provider"
import { Input } from "./input"
import { Separator } from "./separator"

export type FooterLink = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & {
  label: React.ReactNode
}

export type FooterLinkGroup = {
  title: string
  links: FooterLink[]
}

export type FooterSocial = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "aria-label"> & {
  /** Accessible name, since the link shows an icon only. */
  label: string
  icon: React.ReactNode
}

export type FooterNewsletter = {
  title?: string
  description?: string
  placeholder?: string
  buttonLabel?: React.ReactNode
  onSubmit?: (email: string) => void
}

export type FooterBlockLayout = "columns" | "minimal" | "big-wordmark"

export type FooterBlockProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  layout?: FooterBlockLayout
  /** Surface look. Omit to follow the ambient style. `glass` is opt-in and needs a backdrop. */
  variant?: BlockVariant
  /** Logo, name and tagline. */
  brand?: React.ReactNode
  groups?: FooterLinkGroup[]
  newsletter?: FooterNewsletter
  social?: FooterSocial[]
  /** Copyright line. */
  copyright?: React.ReactNode
  /** Legal links such as Privacy and Terms. */
  legal?: FooterLink[]
  /** Slot for a theme toggle. */
  themeToggle?: React.ReactNode
  /** Oversized text for the `big-wordmark` layout. */
  wordmark?: string
}

const SURFACE: Record<BlockVariant, string> = {
  glinr: "border-t border-[var(--line-soft)] bg-[var(--surface-1)]",
  plain: "border-t border-[var(--color-border)] bg-[var(--color-background)]",
  glass:
    "border-t border-[color:var(--glass-border)] [border-top-color:var(--glass-refraction-top)] bg-[var(--glass-readable)] backdrop-blur-xl backdrop-saturate-[180%]"
}

const LINK_CLASS =
  "rounded-sm text-sm text-[var(--color-muted)] transition-colors duration-fast ease-standard hover:text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] motion-reduce:transition-none"

/** External links get a safe rel by default. */
function linkProps({ label: _label, rel, target, ...rest }: FooterLink): React.AnchorHTMLAttributes<HTMLAnchorElement> {
  const safeRel = target === "_blank" ? Array.from(new Set(`${rel ?? ""} noopener noreferrer`.trim().split(/\s+/))).join(" ") : rel
  return { ...rest, target, rel: safeRel }
}

function Newsletter({ config }: { config: FooterNewsletter }) {
  const id = React.useId()
  const [value, setValue] = React.useState("")
  return (
    <form
      aria-labelledby={`${id}-title`}
      className="flex w-full max-w-sm flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        config.onSubmit?.(value)
      }}
    >
      <div className="flex flex-col gap-1">
        <h2 id={`${id}-title`} className="text-sm font-medium text-[var(--color-foreground)]">
          {config.title ?? "Newsletter"}
        </h2>
        {config.description ? <p className="text-sm text-[var(--color-muted)]">{config.description}</p> : null}
      </div>
      <div className="flex gap-2">
        <label htmlFor={`${id}-email`} className="sr-only">
          Email address
        </label>
        <Input
          id={`${id}-email`}
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder={config.placeholder ?? "you@example.com"}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="min-w-0 flex-1"
        />
        <Button type="submit">{config.buttonLabel ?? "Subscribe"}</Button>
      </div>
    </form>
  )
}

function LegalRow({ copyright, legal, social, themeToggle }: Pick<FooterBlockProps, "copyright" | "legal" | "social" | "themeToggle">) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
        {copyright ? <p className="text-xs text-[var(--color-muted)]">{copyright}</p> : null}
        {legal && legal.length > 0 ? (
          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {legal.map((link, i) => (
                <li key={i}>
                  <a {...linkProps(link)} className={cn(LINK_CLASS, "text-xs", link.className)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
      <div className="flex items-center gap-3">
        {social && social.length > 0 ? (
          <ul className="flex items-center gap-1" aria-label="Social links">
            {social.map(({ label, icon, ...rest }, i) => (
              <li key={i}>
                <a
                  {...rest}
                  aria-label={label}
                  rel={rest.target === "_blank" ? "noopener noreferrer" : rest.rel}
                  className={cn(
                    "inline-flex size-9 items-center justify-center rounded-md text-[var(--color-muted)] transition-colors duration-fast ease-standard hover:text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] motion-reduce:transition-none [&_svg]:size-5",
                    rest.className
                  )}
                >
                  <span aria-hidden="true" className="inline-flex">
                    {icon}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : null}
        {themeToggle ? <div data-slot="theme-toggle">{themeToggle}</div> : null}
      </div>
    </div>
  )
}

/**
 * Site footer. Layouts: `columns` (brand and newsletter beside link groups), `minimal` (one row),
 * `big-wordmark` (columns plus an oversized faded wordmark). Each link group is its own labelled `nav`.
 */
export const FooterBlock = React.forwardRef<HTMLElement, FooterBlockProps>(
  ({ layout = "columns", variant, brand, groups = [], newsletter, social, copyright, legal, themeToggle, wordmark, className, ...props }, ref) => {
    const id = React.useId()
    const look = resolveBlockVariant(variant, useGlinStyle())
    const legalRow = <LegalRow copyright={copyright} legal={legal} social={social} themeToggle={themeToggle} />

    return (
      <footer ref={ref} data-layout={layout} data-variant={look} className={cn("w-full overflow-hidden", SURFACE[look], className)} {...props}>
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          {layout === "minimal" ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                {brand ? <div>{brand}</div> : null}
                {groups.length > 0 ? (
                  <nav aria-label="Footer">
                    <ul className="flex flex-wrap gap-x-6 gap-y-2">
                      {groups.flatMap((g) => g.links).map((link, i) => (
                        <li key={i}>
                          <a {...linkProps(link)} className={cn(LINK_CLASS, link.className)}>
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                ) : null}
              </div>
              <Separator />
              {legalRow}
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
                <div className="flex flex-col gap-6">
                  {brand ? <div>{brand}</div> : null}
                  {newsletter ? <Newsletter config={newsletter} /> : null}
                </div>
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
                  {groups.map((group, gi) => (
                    <nav key={group.title} aria-labelledby={`${id}-g${gi}`} className="flex flex-col gap-3">
                      <h2 id={`${id}-g${gi}`} className="text-sm font-medium text-[var(--color-foreground)]">
                        {group.title}
                      </h2>
                      <ul className="flex flex-col gap-2">
                        {group.links.map((link, i) => (
                          <li key={i}>
                            <a {...linkProps(link)} className={cn(LINK_CLASS, link.className)}>
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  ))}
                </div>
              </div>
              <Separator />
              {legalRow}
            </div>
          )}
        </div>
        {layout === "big-wordmark" && wordmark ? (
          <div
            aria-hidden="true"
            data-slot="wordmark"
            className="pointer-events-none select-none px-4 pb-4 text-center text-[clamp(4rem,18vw,14rem)] font-semibold leading-none tracking-[-0.04em] text-[var(--color-foreground)] [mask-image:linear-gradient(to_bottom,#000_10%,transparent_95%)] [-webkit-mask-image:linear-gradient(to_bottom,#000_10%,transparent_95%)] opacity-15"
          >
            {wordmark}
          </div>
        ) : null}
      </footer>
    )
  }
)

FooterBlock.displayName = "FooterBlock"
