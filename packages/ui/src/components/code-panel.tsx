"use client"

import * as React from "react"

import { cn } from "../lib/cn"
import type { SurfaceTone, SurfaceVariant } from "../lib/surface"
import { containerSurface, resolveSurfaceProps } from "../lib/surface-resolve"
import { useGlinStyle } from "./glin-provider"
import { LIFT_SURFACE } from "./card"
import { CopyButton } from "./copy-button"

export type CodeTokenKind = "k" | "s" | "c" | "f"

/** A token for the `tokens` helper: plain string or a [kind, text] pair. */
export type CodeToken = string | readonly [CodeTokenKind, string]

const TOKEN_CLASS: Record<CodeTokenKind, string> = {
  k: "tok-k",
  s: "tok-s",
  c: "tok-c",
  f: "tok-f"
}

/**
 * Build highlighted children without a highlighter dependency.
 * `tokens(["k", "const "], "x = ", ["s", '"hi"'])` renders keyword / plain / string spans.
 */
export function tokens(...parts: CodeToken[]): React.ReactNode {
  return parts.map((part, index) =>
    typeof part === "string" ? (
      <React.Fragment key={index}>{part}</React.Fragment>
    ) : (
      <span key={index} className={TOKEN_CLASS[part[0]]}>
        {part[1]}
      </span>
    )
  )
}

/**
 * Token color classes. Authors can also write `<span className="tok-k">` directly; the
 * selectors below on the pre map those four class names to theme colors.
 */
const TOKEN_THEME =
  "[&_.tok-k]:text-[var(--color-violet,var(--color-brand))] [&_.tok-s]:text-[var(--color-signal-live)] [&_.tok-c]:text-[var(--color-muted)] [&_.tok-f]:text-[var(--color-signal-ok)]"

export type CodePanelProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
  /**
   * Visual variant. Omit for the ambient design style: glinr is the canonical raised panel (header strip + inset well),
   * plain is a flat bordered code block, glass is opt-in and needs a backdrop.
   */
  variant?: SurfaceVariant | "default" | "raised" | "frosted"
  tone?: SurfaceTone
  /** Header title (usually a file name). */
  title?: React.ReactNode
  /** Header slot after the title, for example a tab group. */
  tabs?: React.ReactNode
  /** Header slot on the right. When `copyValue` is set a CopyButton is appended. */
  actions?: React.ReactNode
  /** Adds a CopyButton to the header copying this text. */
  copyValue?: string
  /** Called when the built-in CopyButton succeeds. */
  onCopy?: (value: string) => void
  /** Hide the header bar entirely. */
  hideHeader?: boolean
  /** Classes for the `pre` element. */
  preClassName?: string
  /** Accessible label for the scrollable code region. */
  codeLabel?: string
}

/** Raised panel with a header strip and a recessed code well. No highlighter dependency. */
export const CodePanel = React.forwardRef<HTMLDivElement, CodePanelProps>(
  (
    {
      variant,
      tone,
      title,
      tabs,
      actions,
      copyValue,
      onCopy,
      hideHeader = false,
      preClassName,
      codeLabel = "Code",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const ambient = useGlinStyle()
    const { variant: resolved, tone: aliasTone } = resolveSurfaceProps(variant, ambient, "container")
    const flat = resolved === "plain" || resolved === "outline" || resolved === "ghost"
    const hasHeader = !hideHeader && (title || tabs || actions || copyValue)

    return (
      <div
        ref={ref}
        data-slot="code-panel"
        data-variant={resolved}
        className={cn(
          "overflow-hidden text-[var(--color-foreground)]",
          resolved === "glinr"
            ? cn("rounded-xl", LIFT_SURFACE, "[--face:var(--face-1,var(--surface-1))]")
            : containerSurface(resolved, { radius: "xl", elevation: "2", tone: tone ?? aliasTone }),
          className
        )}
        {...props}
      >
        {hasHeader ? (
          <div
            data-slot="code-panel-bar"
            className={cn(
              "relative z-[1] flex items-center justify-between gap-3 border-b px-4 py-2.5",
              flat
                ? "border-[color:var(--color-border)] bg-[var(--surface-2)]"
                : resolved === "glass"
                  ? "border-[color:var(--glass-border)] bg-[color-mix(in_oklab,var(--color-foreground)_5%,transparent)]"
                  : "border-[var(--line-soft)] [background:var(--sheen),var(--face-0,var(--surface-2))] shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06),0_8px_12px_-8px_rgb(0_0_0_/_0.35)]"
            )}
          >
            <div className="flex min-w-0 items-center gap-3">
              {title ? (
                <span className="truncate font-mono text-xs text-[var(--color-muted)]">{title}</span>
              ) : null}
              {tabs}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {actions}
              {copyValue ? <CopyButton value={copyValue} onCopy={onCopy} /> : null}
            </div>
          </div>
        ) : null}
        <pre
          tabIndex={0}
          aria-label={codeLabel}
          className={cn(
            "overflow-x-auto px-4 py-3.5 font-mono text-[0.8125rem] leading-[1.7] text-foreground/85 [tab-size:2]",
            flat
              ? "m-0 bg-transparent"
              : "m-2 rounded-lg bg-[var(--well,var(--surface-well))] [box-shadow:var(--elev-inset)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
            TOKEN_THEME,
            preClassName
          )}
        >
          <code>{children}</code>
        </pre>
      </div>
    )
  }
)

CodePanel.displayName = "CodePanel"
