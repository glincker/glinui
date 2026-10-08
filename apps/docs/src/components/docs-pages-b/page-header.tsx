import * as React from "react"

type PageHeaderProps = {
  eyebrow: string
  title: string
  lead: React.ReactNode
  /** Optional row of buttons or links rendered under the lead. */
  actions?: React.ReactNode
}

/** Flat page header: mono eyebrow, h1, lead paragraph, optional actions. */
export function PageHeader({ eyebrow, title, lead, actions }: PageHeaderProps) {
  return (
    <header className="space-y-4 border-b border-line-soft pb-8">
      <p className="type-eyebrow">{eyebrow}</p>
      <h1 className="type-h1">{title}</h1>
      <p className="type-lead">{lead}</p>
      {actions ? <div className="flex flex-wrap items-center gap-3 pt-2">{actions}</div> : null}
    </header>
  )
}
