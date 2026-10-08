"use client"

import * as React from "react"
import { CaretRight } from "@phosphor-icons/react"

import { cn } from "../lib/cn"

export interface ThinkingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** True while the model is working. False renders the finished label. */
  active?: boolean
  /** Indicator style while active. */
  indicator?: "dots" | "shimmer"
  label?: string
  /** Label once finished, e.g. "Thought for 4 seconds". */
  doneLabel?: string
  /** Reasoning details. When provided the header becomes a disclosure button. */
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

function Dots() {
  return (
    <span className="inline-flex items-center gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            "size-1.5 rounded-full bg-[var(--color-accent)] motion-safe:animate-pulse motion-reduce:opacity-70",
            i === 1 && "[animation-delay:200ms]",
            i === 2 && "[animation-delay:400ms]"
          )}
        />
      ))}
    </span>
  )
}

export const Thinking = React.forwardRef<HTMLDivElement, ThinkingProps>(
  (
    {
      className,
      active = true,
      indicator = "dots",
      label = "Thinking",
      doneLabel = "Thought process",
      children,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      ...props
    },
    ref
  ) => {
    const [internal, setInternal] = React.useState(defaultOpen)
    const open = openProp ?? internal
    const panelId = React.useId()
    const hasDetails = children !== undefined && children !== null && children !== false

    const toggle = () => {
      const next = !open
      if (openProp === undefined) setInternal(next)
      onOpenChange?.(next)
    }

    const text = active ? label : doneLabel
    const header = (
      <>
        {active && indicator === "dots" ? <Dots /> : null}
        <span
          className={cn(
            "font-medium",
            active && indicator === "shimmer" && "motion-safe:animate-pulse"
          )}
        >
          {text}
          {active && indicator === "dots" ? <span className="sr-only">...</span> : null}
        </span>
        {hasDetails ? (
          <CaretRight
            weight="bold"
            aria-hidden="true"
            className={cn(
              "size-3.5 transition-transform duration-normal motion-reduce:transition-none rtl:-scale-x-100",
              open && "rotate-90 rtl:rotate-90"
            )}
          />
        ) : null}
      </>
    )

    return (
      <div
        ref={ref}
        data-state={active ? "active" : "done"}
        className={cn("inline-flex max-w-full flex-col items-start gap-1.5 text-sm text-[var(--color-muted)]", className)}
        {...props}
      >
        {hasDetails ? (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={toggle}
            className="inline-flex items-center gap-2 rounded-lg px-1 py-0.5 hover:text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            {header}
          </button>
        ) : (
          <span role={active ? "status" : undefined} className="inline-flex items-center gap-2 px-1 py-0.5">
            {header}
          </span>
        )}
        {hasDetails ? (
          <div
            id={panelId}
            hidden={!open}
            className="ms-1 border-s-2 border-[var(--line-soft)] ps-3 text-sm leading-relaxed text-[var(--color-muted)]"
          >
            {children}
          </div>
        ) : null}
      </div>
    )
  }
)
Thinking.displayName = "Thinking"
