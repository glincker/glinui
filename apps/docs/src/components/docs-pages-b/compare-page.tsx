import * as React from "react"
import Link from "next/link"
import { ArrowRight, Check, Minus } from "@phosphor-icons/react/dist/ssr"

import { CompareTable, type CompareRow } from "./compare-table"
import { FaqBreadcrumbJsonLd, FaqList, type FaqEntry } from "./json-ld"
import { PageHeader } from "./page-header"
import { PageSection } from "./page-section"
import { RelatedLinks, type RelatedLink } from "./related-links"

type ComparePageProps = {
  eyebrow: string
  title: string
  lead: React.ReactNode
  path: string
  breadcrumbName: string
  otherName: string
  summary: React.ReactNode
  rows: CompareRow[]
  chooseGlin: string[]
  chooseOther: string[]
  faqs: FaqEntry[]
  related: RelatedLink[]
  /** Optional extra sections rendered between the table and the verdict. */
  extra?: React.ReactNode
  /** Optional logo lockup rendered above the page header. */
  lockup?: React.ReactNode
}

function ChoiceList({ title, items, positive }: { title: string; items: string[]; positive: boolean }) {
  const Icon = positive ? Check : Minus
  return (
    <section className="space-y-3 rounded-card border border-line-soft bg-surface-1 p-4">
      <h3 className="type-h3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="type-body flex max-w-[68ch] items-start gap-2.5">
            <Icon className="mt-1 size-4 shrink-0 text-accent" weight="bold" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Shared flat layout for the vs and alternative SEO pages. */
export function ComparePage(props: ComparePageProps) {
  const { otherName, rows, faqs } = props
  return (
    <main className="space-y-12">
      <FaqBreadcrumbJsonLd name={props.breadcrumbName} path={props.path} faqs={faqs} />
      {props.lockup}
      <PageHeader
        eyebrow={props.eyebrow}
        title={props.title}
        lead={props.lead}
        actions={
          <>
            <Link
              href="/docs/getting-started"
              className="inline-flex h-10 items-center gap-2 rounded-input bg-accent px-4 text-sm font-medium text-accent-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Get started
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/docs/components"
              className="inline-flex h-10 items-center rounded-input border border-line-soft px-4 text-sm font-medium hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              Browse components
            </Link>
          </>
        }
      />

      <PageSection id="summary" title="The short version">
        <div className="type-body max-w-[68ch] space-y-3 text-muted">{props.summary}</div>
      </PageSection>

      <PageSection
        id="comparison"
        title="Feature comparison"
        description={`The Ahead column says who does each row better. ${otherName} wins several of them.`}
      >
        <CompareTable otherName={otherName} rows={rows} />
      </PageSection>

      {props.extra}

      <PageSection id="choose" title="Which one should you pick">
        <div className="grid gap-4 md:grid-cols-2">
          <ChoiceList title="Pick Glin UI if" items={props.chooseGlin} positive />
          <ChoiceList title={`Pick ${otherName} if`} items={props.chooseOther} positive={false} />
        </div>
      </PageSection>

      <PageSection id="faq" title="Frequently asked questions">
        <FaqList faqs={faqs} />
      </PageSection>

      <RelatedLinks links={props.related} heading="Keep reading" />
    </main>
  )
}
