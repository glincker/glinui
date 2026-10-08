import type { ReactNode } from "react"

export function ComponentPreview({
  title,
  description,
  children
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="space-y-4 rounded-2xl border border-border/60 bg-[var(--glass-3-surface)] p-5 backdrop-blur-2xl backdrop-saturate-[180%] [box-shadow:0_0_0_1px_rgb(255_255_255_/_0.08)_inset,var(--shadow-glass-md)]">
      <header className="space-y-1">
        <h3 className="text-base font-medium">{title}</h3>
        {description ? <p className="text-sm text-neutral-600">{description}</p> : null}
      </header>
      <div className="rounded-xl border border-border/60 bg-background/45 p-4">{children}</div>
    </section>
  )
}
