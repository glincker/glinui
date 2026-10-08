"use client"

import * as React from "react"

import { cn } from "../lib/cn"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, type AccordionVariant } from "./accordion"
import { Heading } from "./heading"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"
import { Text } from "./text"

export type FaqItem = {
  id?: string
  question: string
  /** Plain string keeps the JSON-LD answer in sync. Use `answerText` when `answer` is rich content. */
  answer: React.ReactNode
  /** Plain text used for JSON-LD when `answer` is not a string. */
  answerText?: string
  /** Optional category, shows tabs when two or more categories exist and `categories` is on. */
  category?: string
}

export type FaqSectionLayout = "two-column" | "centered"

export type FaqSectionProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  items: FaqItem[]
  layout?: FaqSectionLayout
  /** Accordion look. Omit to follow the ambient style. */
  variant?: AccordionVariant
  eyebrow?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  /** Extra content under the title in the two-column layout, such as a contact card. */
  aside?: React.ReactNode
  /** Group items into category tabs (items need a `category`). */
  categories?: boolean
  /** Allow several items open at once. */
  multiple?: boolean
  /** Render a FAQPage JSON-LD script. */
  jsonLd?: boolean
}

const itemKey = (item: FaqItem, i: number) => item.id ?? `faq-${i}`

function plainAnswer(item: FaqItem): string {
  if (typeof item.answer === "string") return item.answer
  return item.answerText ?? ""
}

/** Build a schema.org FAQPage object. Items without a plain text answer are skipped. */
export function faqJsonLdObject(items: FaqItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items
      .filter((item) => plainAnswer(item).length > 0)
      .map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: plainAnswer(item) }
      }))
  }
}

/**
 * Serialized FAQPage JSON-LD, safe to inline in a script tag: `<`, `>`, `&` and the line separators are
 * unicode-escaped so content can never close the script element.
 */
export function faqJsonLd(items: FaqItem[]): string {
  return JSON.stringify(faqJsonLdObject(items))
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(new RegExp("\\u2028", "g"), "\\u2028")
    .replace(new RegExp("\\u2029", "g"), "\\u2029")
}

function FaqList({ items, variant, multiple, prefix }: { items: FaqItem[]; variant?: AccordionVariant; multiple: boolean; prefix: string }) {
  const common = { variant, className: "w-full" } as const
  const children = items.map((item, i) => (
    <AccordionItem key={itemKey(item, i)} value={`${prefix}-${itemKey(item, i)}`}>
      <AccordionTrigger>{item.question}</AccordionTrigger>
      <AccordionContent>{item.answer}</AccordionContent>
    </AccordionItem>
  ))
  return multiple ? (
    <Accordion type="multiple" {...common}>
      {children}
    </Accordion>
  ) : (
    <Accordion type="single" collapsible {...common}>
      {children}
    </Accordion>
  )
}

/** FAQ section built on our Accordion. Keyboard and ARIA come from the accordion. */
export const FaqSection = React.forwardRef<HTMLElement, FaqSectionProps>(
  (
    { items, layout = "two-column", variant, eyebrow, title, description, aside, categories = false, multiple = false, jsonLd = false, className, ...props },
    ref
  ) => {
    const id = React.useId()
    const headingId = title ? `${id}-title` : undefined
    const cats = React.useMemo(() => {
      if (!categories) return []
      const seen: string[] = []
      for (const item of items) if (item.category && !seen.includes(item.category)) seen.push(item.category)
      return seen
    }, [categories, items])
    const tabbed = cats.length >= 2
    const [active, setActive] = React.useState<string | undefined>(undefined)
    const current = active && cats.includes(active) ? active : cats[0]

    const header =
      title || description || eyebrow ? (
        <div className={cn("flex flex-col gap-3", layout === "centered" ? "mx-auto mb-10 max-w-2xl items-center text-center" : "items-start")}>
          {eyebrow ? <Text variant="eyebrow">{eyebrow}</Text> : null}
          {title ? (
            <Heading id={headingId} level={2} size="h2">
              {title}
            </Heading>
          ) : null}
          {description ? <Text lead>{description}</Text> : null}
        </div>
      ) : null

    const body = tabbed ? (
      <Tabs value={current} onValueChange={setActive} className="w-full">
        <TabsList aria-label="FAQ categories" className="mb-4 flex-wrap">
          {cats.map((c) => (
            <TabsTrigger key={c} value={c}>
              {c}
            </TabsTrigger>
          ))}
        </TabsList>
        {cats.map((c) => (
          <TabsContent key={c} value={c}>
            <FaqList items={items.filter((item) => item.category === c)} variant={variant} multiple={multiple} prefix={c} />
          </TabsContent>
        ))}
      </Tabs>
    ) : (
      <FaqList items={items} variant={variant} multiple={multiple} prefix="all" />
    )

    return (
      <section
        ref={ref}
        aria-labelledby={headingId}
        data-layout={layout}
        className={cn("w-full px-4 py-16 sm:px-6 sm:py-20", className)}
        {...props}
      >
        {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd(items) }} /> : null}
        {layout === "two-column" ? (
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
            <div className="flex flex-col gap-6">
              {header}
              {aside}
            </div>
            <div>{body}</div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl">
            {header}
            {body}
            {aside ? <div className="mt-8">{aside}</div> : null}
          </div>
        )}
      </section>
    )
  }
)

FaqSection.displayName = "FaqSection"
