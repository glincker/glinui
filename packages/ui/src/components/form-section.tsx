"use client"

import * as React from "react"

import { cn } from "../lib/cn"
import { Button } from "./button"
import { Display, Lede, type DisplayElement } from "./typography"

export type FormSectionProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  title: React.ReactNode
  /** Heading level for the title. */
  titleAs?: DisplayElement
  description?: React.ReactNode
  /** Small element beside the title, such as a status badge. */
  badge?: React.ReactNode
  /** Secondary note or link under the description. */
  hint?: React.ReactNode
  /** Section level validation or server error. Announced with role alert. */
  error?: React.ReactNode
}

/** FormSection puts the description left and the fields right from lg up, and stacks them below. */
export const FormSection = React.forwardRef<HTMLElement, FormSectionProps>(
  ({ title, titleAs = "h2", description, badge, hint, error, className, children, ...props }, ref) => {
    const titleId = React.useId()
    return (
      <section
        ref={ref}
        aria-labelledby={titleId}
        className={cn(
          "grid gap-x-10 gap-y-4 border-t border-[color:var(--color-border)] py-6 first:border-t-0 first:pt-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]",
          className
        )}
        {...props}
      >
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Display as={titleAs} id={titleId} size="lg">
              {title}
            </Display>
            {badge}
          </div>
          {description ? <Lede>{description}</Lede> : null}
          {hint ? <div className="text-sm text-[color:var(--color-muted)]">{hint}</div> : null}
        </div>
        <div className="min-w-0 space-y-4">
          {children}
          {error ? (
            <p role="alert" className="text-sm text-[color:var(--tone-danger-text)]">
              {error}
            </p>
          ) : null}
        </div>
      </section>
    )
  }
)

FormSection.displayName = "FormSection"

export type StickySaveBarProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onReset"> & {
  /** The form has unsaved changes. The bar renders only while dirty or saving. */
  dirty: boolean
  saving?: boolean
  onSave: () => void
  /** Adds a discard button when provided. */
  onReset?: () => void
  /** Slot for a secondary action such as Test connection. Stays enabled while dirty. */
  testSlot?: React.ReactNode
  /** Short status text. Defaults to `unsavedMessage`. */
  message?: React.ReactNode
  saveLabel?: string
  discardLabel?: string
  savingLabel?: string
  unsavedMessage?: string
  /** Accessible name of the region. */
  label?: string
}

/** StickySaveBar pins to the bottom of the form once it has unsaved changes. */
export const StickySaveBar = React.forwardRef<HTMLDivElement, StickySaveBarProps>(
  (
    {
      dirty,
      saving = false,
      onSave,
      onReset,
      testSlot,
      message,
      saveLabel = "Save changes",
      discardLabel = "Discard",
      savingLabel = "Saving...",
      unsavedMessage = "You have unsaved changes.",
      label = "Unsaved changes",
      className,
      ...props
    },
    ref
  ) => {
    if (!dirty && !saving) return null
    return (
      <div
        ref={ref}
        role="region"
        aria-label={label}
        className={cn(
          "sticky bottom-4 z-20 flex flex-wrap items-center gap-3 rounded-xl border border-[color:var(--color-border)] bg-[var(--surface-1)] px-4 py-3",
          className
        )}
        {...props}
      >
        <p aria-live="polite" className="min-w-0 flex-1 basis-40 text-sm text-[color:var(--color-muted)]">
          {message ?? unsavedMessage}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {testSlot}
          {onReset ? (
            <Button type="button" variant="ghost" size="sm" disabled={saving} onClick={onReset}>
              {discardLabel}
            </Button>
          ) : null}
          <Button type="button" size="sm" disabled={saving} onClick={onSave}>
            {saving ? savingLabel : saveLabel}
          </Button>
        </div>
      </div>
    )
  }
)

StickySaveBar.displayName = "StickySaveBar"
