"use client"

import * as React from "react"

import { cn } from "@glinui/ui"

/** Tonal surface with a top-lit hairline ring and layered elevation. */
export function Surface({
  className,
  elevation = 2,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { elevation?: 1 | 2 | 3 }) {
  const shadow =
    elevation === 1 ? "[box-shadow:var(--elev-1)]" : elevation === 3 ? "[box-shadow:var(--elev-3)]" : "[box-shadow:var(--elev-2)]"
  return (
    <div
      className={cn("relative rounded-[var(--radius-xl)] bg-[var(--surface-1)] ring-1 ring-inset ring-[var(--line-soft)]", shadow, className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "type-eyebrow inline-flex items-center gap-2",
        className
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-[var(--color-accent)]" />
      {children}
    </p>
  )
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  className
}: {
  id?: string
  eyebrow: string
  title: string
  lead?: string
  className?: string
}) {
  return (
    <div className={cn("max-w-2xl space-y-4", className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="type-h2 text-[var(--color-foreground)]">
        {title}
      </h2>
      {lead ? <p className="type-lead">{lead}</p> : null}
    </div>
  )
}

/** Mounts children once the placeholder nears the viewport. Reserves height to avoid layout shift. */
export function LazyMount({
  children,
  className,
  rootMargin = "240px"
}: {
  children: React.ReactNode
  className?: string
  rootMargin?: string
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const node = ref.current
    if (!node || visible) return
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [visible, rootMargin])

  return (
    <div ref={ref} className={className}>
      {visible ? children : null}
    </div>
  )
}

export const SECTION_CLASS = "mx-auto w-full max-w-[1200px] py-[clamp(48px,7vw,88px)]"
