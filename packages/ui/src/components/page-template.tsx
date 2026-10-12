import * as React from "react"
import { Question } from "@phosphor-icons/react/dist/ssr"

import { cn } from "../lib/cn"
import { Heading } from "./heading"
import { Text } from "./text"

export type PageTemplateWidth = "default" | "wide" | "full"

/**
 * Widths read `--glinr-content-max` and `--glinr-content-max-wide` from `@glinui/tokens` when defined
 * and fall back to 72rem and 90rem otherwise.
 */
const WIDTH: Record<PageTemplateWidth, string> = {
  default: "max-w-[var(--glinr-content-max,72rem)] 2xl:max-w-[var(--glinr-content-max-wide,90rem)]",
  wide: "max-w-[var(--glinr-content-max-wide,90rem)]",
  full: "max-w-none"
}

export type PageTemplateLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>

export type PageTemplateProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
  title: React.ReactNode
  description?: React.ReactNode
  /** Small mono label above the title. */
  eyebrow?: React.ReactNode
  /** A 48px brand tile or any node. Wins over `icon`. */
  logo?: React.ReactNode
  /** Icon rendered in a neutral 48px tile. */
  icon?: React.ReactNode
  /** Status badge or pill beside the title. */
  status?: React.ReactNode
  /** Primary actions, right-aligned from `sm` up. */
  actions?: React.ReactNode
  /** Renders a help link beside the title when set. */
  helpHref?: string
  /** Accessible name of the help link. Defaults to "Help". */
  helpLabel?: string
  /** Breadcrumb trail above the hero. */
  breadcrumb?: React.ReactNode
  /** Tab list or link navigation under the hero. */
  tabs?: React.ReactNode
  /** Page-level banners between the hero and the content. */
  banners?: React.ReactNode
  width?: PageTemplateWidth
  /** Component used for the help link, for example a router link. Defaults to `a`. */
  LinkComponent?: React.ElementType<PageTemplateLinkProps>
}

/** PageTemplate is the page shell: breadcrumb, hero with tile, title, status and actions, tabs, banners, then content. */
export const PageTemplate = React.forwardRef<HTMLDivElement, PageTemplateProps>(
  (
    {
      title,
      description,
      eyebrow,
      logo,
      icon,
      status,
      actions,
      helpHref,
      helpLabel = "Help",
      breadcrumb,
      tabs,
      banners,
      width = "default",
      LinkComponent = "a",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const tile =
      logo ??
      (icon ? (
        <span
          aria-hidden="true"
          data-slot="page-template-icon"
          className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[color:var(--color-border)] bg-[var(--surface-2)] text-[var(--color-muted)] [&_svg]:size-6"
        >
          {icon}
        </span>
      ) : null)

    return (
      <div
        ref={ref}
        data-slot="page-template"
        className={cn("mx-auto flex w-full flex-col gap-[var(--glinr-page-gap,1.5rem)]", WIDTH[width], className)}
        {...props}
      >
        <header className="space-y-4">
          {breadcrumb ? <div data-slot="page-template-breadcrumb">{breadcrumb}</div> : null}
          <div className="flex flex-wrap items-start gap-4">
            {tile}
            <div className="min-w-0 flex-1 basis-64 space-y-1.5">
              {eyebrow ? <Text variant="eyebrow">{eyebrow}</Text> : null}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <Heading level={1} size="lg" className="min-w-0 break-words">
                  {title}
                </Heading>
                {status}
                {helpHref ? (
                  <LinkComponent
                    href={helpHref}
                    aria-label={helpLabel}
                    className="inline-flex size-6 items-center justify-center rounded-full text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                  >
                    <Question aria-hidden className="size-4" />
                  </LinkComponent>
                ) : null}
              </div>
              {description ? (
                <Text variant="muted" lead>
                  {description}
                </Text>
              ) : null}
            </div>
            {actions ? <div className="flex flex-wrap items-center gap-2 sm:ml-auto">{actions}</div> : null}
          </div>
          {tabs ? <div className="border-b border-[color:var(--color-border)]">{tabs}</div> : null}
        </header>
        {banners ? <div className="space-y-3">{banners}</div> : null}
        {children}
      </div>
    )
  }
)

PageTemplate.displayName = "PageTemplate"
