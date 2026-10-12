"use client"

import * as React from "react"
import { X, CheckCircle, Info, Megaphone, Warning, WarningOctagon } from "@phosphor-icons/react/dist/ssr"

import { cn } from "../lib/cn"
import {
  BANNER_STORAGE_KEY,
  defaultBannerStorage,
  dismissBanner,
  isBannerDismissed,
  type BannerStorage
} from "../lib/banner-dismissal"
import { surfaceVariants, type SurfaceTone } from "../lib/surface"
import { Button } from "./button"
import { Display, Eyebrow, Lede, type DisplayElement } from "./typography"

export type { BannerStorage } from "../lib/banner-dismissal"

export type BannerVariant = "info" | "success" | "warning" | "critical" | "promo"

const VARIANTS: Record<BannerVariant, { tone: SurfaceTone; Icon: React.ElementType; role: "status" | "alert" }> = {
  info: { tone: "info", Icon: Info, role: "status" },
  success: { tone: "success", Icon: CheckCircle, role: "status" },
  warning: { tone: "warning", Icon: Warning, role: "status" },
  critical: { tone: "danger", Icon: WarningOctagon, role: "alert" },
  promo: { tone: "accent", Icon: Megaphone, role: "status" }
}

export type BannerProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
  /** Meaning of the notice. `critical` is announced assertively, the rest politely. */
  variant?: BannerVariant
  title: React.ReactNode
  /** Heading level for the title. Defaults to a paragraph so the banner never skews the outline. */
  titleAs?: DisplayElement
  /** Small label above the title. */
  eyebrow?: React.ReactNode
  /** Replaces the variant icon. */
  icon?: React.ReactNode
  /** Right-aligned button or link. */
  action?: React.ReactNode
  /** Stable id. When set the banner is dismissible and stays dismissed through the storage adapter. */
  dismissId?: string
  /** Called after the banner is dismissed. Also makes the banner dismissible. */
  onDismiss?: () => void
  /** Accessible name of the dismiss button. */
  dismissLabel?: string
  /** Where dismissals persist. Defaults to localStorage, guarded for blocked storage. */
  storage?: BannerStorage | null
  /** Storage key holding the dismissed ids. */
  storageKey?: string
}

/** Banner is a flat, page level notice with five variants and optional persisted dismissal. */
export const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      variant = "info",
      title,
      titleAs = "p",
      eyebrow,
      icon,
      action,
      dismissId,
      onDismiss,
      dismissLabel = "Dismiss",
      storage,
      storageKey = BANNER_STORAGE_KEY,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const resolvedStorage = storage === undefined ? defaultBannerStorage() : storage
    const [hidden, setHidden] = React.useState(() =>
      dismissId ? isBannerDismissed(dismissId, resolvedStorage, storageKey) : false
    )
    if (hidden) return null

    const { tone, Icon, role } = VARIANTS[variant]
    const dismissible = dismissId !== undefined || onDismiss !== undefined

    return (
      <div
        ref={ref}
        role={role}
        aria-live={role === "alert" ? "assertive" : "polite"}
        data-variant={variant}
        className={cn(
          "flex items-start gap-3 rounded-lg p-4",
          surfaceVariants({ variant: "outline", tone, elevation: "none" }),
          "bg-[var(--t-soft)]",
          className
        )}
        {...props}
      >
        <span aria-hidden="true" className="mt-0.5 shrink-0 text-[color:var(--t-text)] [&_svg]:size-5">
          {icon ?? <Icon weight="duotone" />}
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <Display as={titleAs} size="lg" className="font-medium">
            {title}
          </Display>
          {children ? <Lede className="text-[color:var(--color-foreground)]">{children}</Lede> : null}
        </div>
        {action ? <div className="shrink-0 self-center">{action}</div> : null}
        {dismissible ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={dismissLabel}
            onClick={() => {
              if (dismissId) dismissBanner(dismissId, resolvedStorage, storageKey)
              setHidden(true)
              onDismiss?.()
            }}
          >
            <X aria-hidden="true" />
          </Button>
        ) : null}
      </div>
    )
  }
)

Banner.displayName = "Banner"
