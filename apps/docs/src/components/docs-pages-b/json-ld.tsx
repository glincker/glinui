import { createAbsoluteUrl } from "@/lib/seo"

export type FaqEntry = { question: string; answer: string }

function Script({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

/** Emits FAQPage and BreadcrumbList JSON-LD for a docs page. */
export function FaqBreadcrumbJsonLd({ name, path, faqs }: { name: string; path: string; faqs: FaqEntry[] }) {
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer }
    }))
  }
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Docs", item: createAbsoluteUrl("/docs") },
      { "@type": "ListItem", position: 2, name, item: createAbsoluteUrl(path) }
    ]
  }
  return (
    <>
      <Script data={faqPage} />
      <Script data={breadcrumbList} />
    </>
  )
}

/** Visible FAQ list that mirrors the JSON-LD entries. */
export function FaqList({ faqs }: { faqs: FaqEntry[] }) {
  return (
    <div className="divide-y divide-line-soft rounded-card border border-line-soft bg-surface-1">
      {faqs.map((faq) => (
        <div key={faq.question} className="space-y-1.5 px-4 py-4">
          <h3 className="type-h3">{faq.question}</h3>
          <p className="type-body max-w-[68ch] text-muted">{faq.answer}</p>
        </div>
      ))}
    </div>
  )
}
