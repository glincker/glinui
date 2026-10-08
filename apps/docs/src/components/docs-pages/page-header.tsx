import type { ReactNode } from "react"

type PageHeaderProps = {
  eyebrow: string
  title: string
  lead: ReactNode
  children?: ReactNode
}

/** Flat page header: mono eyebrow, H1, lead. No cards, no washes. */
export function PageHeader({ eyebrow, title, lead, children }: PageHeaderProps) {
  return (
    <header className="space-y-3">
      <p className="type-eyebrow text-[var(--color-accent)]">{eyebrow}</p>
      <h1 className="type-h1">{title}</h1>
      <p className="type-lead">{lead}</p>
      {children ? <div className="flex flex-wrap items-center gap-3 pt-2">{children}</div> : null}
    </header>
  )
}

type SectionProps = {
  id: string
  title: string
  description?: ReactNode
  children: ReactNode
}

/** Section with a hairline top rule, H2 and optional prose-width description. */
export function DocSection({ id, title, description, children }: SectionProps) {
  return (
    <section aria-labelledby={`${id}-heading`} className="space-y-4 border-t border-line-soft pt-8">
      <div className="space-y-2">
        <h2 id={`${id}-heading`} className="type-section">
          {title}
        </h2>
        {description ? <div className="type-body max-w-[68ch] text-muted">{description}</div> : null}
      </div>
      {children}
    </section>
  )
}
