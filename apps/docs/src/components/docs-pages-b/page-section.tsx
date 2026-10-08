import * as React from "react"

type PageSectionProps = {
  id?: string
  title: string
  description?: React.ReactNode
  children: React.ReactNode
}

/** Section with an h2 and optional short description. */
export function PageSection({ id, title, description, children }: PageSectionProps) {
  return (
    <section aria-labelledby={id ? `${id}-title` : undefined} className="space-y-4">
      <div className="space-y-2">
        <h2 id={id ? `${id}-title` : undefined} className="type-section">
          {title}
        </h2>
        {description ? <p className="type-body max-w-[68ch] text-muted">{description}</p> : null}
      </div>
      {children}
    </section>
  )
}
