import type { Metadata } from "next"
import Link from "next/link"

import { CodeBlock } from "@/components/docs/code-block"
import { Callout } from "@/components/docs-pages-b/callout"
import { Checklist, ChecklistItem } from "@/components/docs-pages-b/checklist-item"
import { DoDont } from "@/components/docs-pages-b/do-dont"
import { PageHeader } from "@/components/docs-pages-b/page-header"
import { PageSection } from "@/components/docs-pages-b/page-section"
import { DEFAULT_DOCS_IMPLEMENTATION } from "@/lib/docs-config"
import { createDocsMetadata } from "@/lib/docs-metadata"
import { buildComponentHref } from "@/lib/docs-route"

const visibleLabelSnippet = `import { Input } from "@glinui/ui"

export function EmailField() {
  return (
    <div className="space-y-2">
      <label htmlFor="email" className="text-sm font-medium">Email address</label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  )
}`

const ariaLabelSnippet = `import { Input } from "@glinui/ui"

export function SearchField() {
  return <Input aria-label="Search components" placeholder="Search..." />
}`

const groupedControlSnippet = `import { RadioGroup, RadioGroupItem } from "@glinui/ui"

export function BillingFrequency() {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium">Billing frequency</legend>
      <RadioGroup defaultValue="monthly">
        <label htmlFor="monthly" className="flex items-center gap-2 text-sm">
          <RadioGroupItem id="monthly" value="monthly" />
          Monthly
        </label>
        <label htmlFor="yearly" className="flex items-center gap-2 text-sm">
          <RadioGroupItem id="yearly" value="yearly" />
          Yearly
        </label>
      </RadioGroup>
    </fieldset>
  )
}`

const switchLabelSnippet = `import { Switch } from "@glinui/ui"

export function MarketingToggle() {
  return (
    <div className="flex items-center justify-between rounded-lg border border-line-soft p-4">
      <div className="space-y-0.5">
        <p className="text-sm font-medium">Marketing emails</p>
        <p className="text-sm text-muted">Product updates and release notes.</p>
      </div>
      <Switch aria-label="Marketing emails" />
    </div>
  )
}`

export const metadata: Metadata = createDocsMetadata({
  title: "Forms Accessibility",
  description:
    "Labeling rules and accessible form patterns for Input, Select, Textarea, Checkbox, Radio Group, and Switch, with copyable examples.",
  path: "/docs/forms-accessibility",
  keywords: ["form accessibility", "aria-label", "labeling patterns", "accessible forms"]
})

const componentLinks = [
  { label: "Input", href: buildComponentHref("input", DEFAULT_DOCS_IMPLEMENTATION) },
  { label: "Textarea", href: buildComponentHref("textarea", DEFAULT_DOCS_IMPLEMENTATION) },
  { label: "Select", href: buildComponentHref("select", DEFAULT_DOCS_IMPLEMENTATION) },
  { label: "Checkbox", href: buildComponentHref("checkbox", DEFAULT_DOCS_IMPLEMENTATION) },
  { label: "Radio Group", href: buildComponentHref("radio-group", DEFAULT_DOCS_IMPLEMENTATION) },
  { label: "Switch", href: buildComponentHref("switch", DEFAULT_DOCS_IMPLEMENTATION) }
]

export default function FormsAccessibilityPage() {
  return (
    <main className="space-y-12">
      <PageHeader
        eyebrow="Accessibility"
        title="Forms Accessibility"
        lead="Give every form control an accessible name. Placeholder text is hint content only and should never be the sole label."
      />

      <PageSection
        id="labeling-contract"
        title="Labeling Contract"
        description="Apply these rules to every field and control. Tick them off while reviewing a form."
      >
        <Checklist>
          <ChecklistItem hint="Clicking the label also focuses the control.">
            Use a visible <code className="font-mono text-[0.85em]">{`<label htmlFor="...">`}</code> whenever layout
            allows it.
          </ChecklistItem>
          <ChecklistItem>
            Use <code className="font-mono text-[0.85em]">aria-label</code> for icon-only or compact controls.
          </ChecklistItem>
          <ChecklistItem>
            Group radio and checkbox sets with <code className="font-mono text-[0.85em]">{`<fieldset>`}</code> and{" "}
            <code className="font-mono text-[0.85em]">{`<legend>`}</code>.
          </ChecklistItem>
          <ChecklistItem>Keep placeholder text as an example of the value, not the name of the field.</ChecklistItem>
          <ChecklistItem>Connect error and help text with aria-describedby.</ChecklistItem>
        </Checklist>
      </PageSection>

      <PageSection id="do-dont" title="Do and don't">
        <DoDont
          dos={[
            {
              text: "Pair the label and control by id.",
              code: `<label htmlFor="email">Email</label>\n<Input id="email" type="email" />`
            },
            { text: "Name icon-only controls.", code: `<Input aria-label="Search components" />` }
          ]}
          donts={[
            {
              text: "Use a placeholder as the only label. It disappears on input and is not a reliable name.",
              code: `<Input placeholder="Email" />`
            },
            { text: "Use color alone to mark an invalid field. Add text that says what is wrong." }
          ]}
        />
      </PageSection>

      <PageSection id="patterns" title="Patterns" description="Copy these and adjust the copy and ids.">
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="min-w-0 space-y-2">
            <h3 className="type-h3">Visible label and control</h3>
            <CodeBlock language="tsx" code={visibleLabelSnippet} />
          </article>
          <article className="min-w-0 space-y-2">
            <h3 className="type-h3">Compact control with aria-label</h3>
            <CodeBlock language="tsx" code={ariaLabelSnippet} />
          </article>
          <article className="min-w-0 space-y-2">
            <h3 className="type-h3">Grouped options</h3>
            <CodeBlock language="tsx" code={groupedControlSnippet} />
          </article>
          <article className="min-w-0 space-y-2">
            <h3 className="type-h3">Switch with descriptive text</h3>
            <CodeBlock language="tsx" code={switchLabelSnippet} />
          </article>
        </div>
        <Callout variant="note" title="Switch labels">
          The switch above uses aria-label because the visible text sits in a separate element. A real{" "}
          <code>label</code> with <code>htmlFor</code> is preferable when the layout allows it.
        </Callout>
      </PageSection>

      <PageSection id="components" title="Reference components">
        <ul className="grid gap-px overflow-hidden rounded-card border border-line-soft bg-[var(--line-soft)] sm:grid-cols-2 lg:grid-cols-3">
          {componentLinks.map((link) => (
            <li key={link.label} className="bg-surface-1">
              <Link
                href={link.href}
                className="block px-4 py-3 text-sm font-medium hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-accent)]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </PageSection>
    </main>
  )
}
