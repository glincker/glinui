import type { Metadata } from "next"

import { CodeBlock } from "@/components/docs/code-block"
import { Callout } from "@/components/docs-pages-b/callout"
import { Checklist, ChecklistItem } from "@/components/docs-pages-b/checklist-item"
import { KbdTable } from "@/components/docs-pages-b/kbd-table"
import { PageHeader } from "@/components/docs-pages-b/page-header"
import { PageSection } from "@/components/docs-pages-b/page-section"
import { RelatedLinks } from "@/components/docs-pages-b/related-links"
import { createDocsMetadata } from "@/lib/docs-metadata"

const announceSnippet = `import { useEffect, useState } from "react"
import { Input } from "@glinui/ui"

export function SearchAnnounce() {
  const [query, setQuery] = useState("")
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Replace with real search call
      setCount(query ? 12 : 0)
    }, 120)
    return () => clearTimeout(timeout)
  }, [query])

  return (
    <div className="space-y-2">
      <Input
        aria-label="Search components"
        placeholder="Search components"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <p aria-live="polite" className="text-sm text-muted">
        {count} results
      </p>
    </div>
  )
}`

const srChecklist = [
  "Every interactive control has an accessible name.",
  "Focus order follows visual order without traps.",
  "Status updates are announced via aria-live when needed.",
  "Modal and dialog open and close restore focus correctly.",
  "Tables expose headers and meaningful row context."
]

export const metadata: Metadata = createDocsMetadata({
  title: "Screen Reader Testing",
  description:
    "A release checklist and test matrix for spoken UX with VoiceOver, NVDA, and mobile screen readers, plus an aria-live pattern.",
  path: "/docs/screen-reader-testing",
  keywords: ["screen reader QA", "VoiceOver testing", "NVDA testing", "aria-live patterns"]
})

export default function ScreenReaderTestingPage() {
  return (
    <main className="space-y-12">
      <PageHeader
        eyebrow="Accessibility QA"
        title="Screen Reader Testing"
        lead="Run this pass before each release to check how forms, dialogs, and data views sound, not just how they look."
      />

      <PageSection
        id="matrix"
        title="Test matrix"
        description="Cover at least one desktop and one mobile screen reader."
      >
        <div className="overflow-x-auto rounded-card border border-line-soft bg-surface-1">
          <table className="w-full min-w-[420px] border-collapse text-left text-sm">
            <caption className="sr-only">Recommended screen reader and browser pairings</caption>
            <thead>
              <tr className="border-b border-line-soft">
                <th scope="col" className="type-eyebrow px-4 py-3 font-medium">Platform</th>
                <th scope="col" className="type-eyebrow px-4 py-3 font-medium">Screen reader</th>
                <th scope="col" className="type-eyebrow px-4 py-3 font-medium">Browser</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              <tr><th scope="row" className="px-4 py-3 font-normal">macOS</th><td className="px-4 py-3">VoiceOver</td><td className="px-4 py-3 text-muted">Safari</td></tr>
              <tr><th scope="row" className="px-4 py-3 font-normal">Windows</th><td className="px-4 py-3">NVDA</td><td className="px-4 py-3 text-muted">Chrome or Firefox</td></tr>
              <tr><th scope="row" className="px-4 py-3 font-normal">iOS</th><td className="px-4 py-3">VoiceOver</td><td className="px-4 py-3 text-muted">Safari</td></tr>
              <tr><th scope="row" className="px-4 py-3 font-normal">Android</th><td className="px-4 py-3">TalkBack</td><td className="px-4 py-3 text-muted">Chrome</td></tr>
            </tbody>
          </table>
        </div>
      </PageSection>

      <PageSection id="release-checklist" title="Release Checklist" description="Mark each item during manual QA.">
        <Checklist>
          {srChecklist.map((item) => (
            <ChecklistItem key={item}>{item}</ChecklistItem>
          ))}
        </Checklist>
      </PageSection>

      <PageSection id="shortcuts" title="Starter shortcuts" description="Enough to navigate a page by headings, landmarks, and forms.">
        <KbdTable
          caption="Screen reader navigation shortcuts"
          rows={[
            { keys: ["Ctrl", "Option", "Cmd", "H"], action: "Next heading", context: "VoiceOver (macOS)" },
            { keys: ["H"], action: "Next heading", context: "NVDA browse mode" },
            { keys: ["D"], action: "Next landmark", context: "NVDA browse mode" },
            { keys: ["F"], action: "Next form field", context: "NVDA browse mode" },
            { keys: ["Insert", "Space"], action: "Toggle browse and focus mode", context: "NVDA" }
          ]}
        />
        <Callout variant="note" title="Verify against your setup">
          Shortcuts depend on your screen reader version and settings. Treat this table as a starting point.
        </Callout>
      </PageSection>

      <PageSection
        id="announce"
        title="Announced search results pattern"
        description={
          <>
            Use <code className="font-mono text-[0.85em]">aria-live=&quot;polite&quot;</code> for async updates that
            should be spoken without interrupting what the user is doing.
          </>
        }
      >
        <CodeBlock language="tsx" code={announceSnippet} />
      </PageSection>

      <RelatedLinks
        links={[
          { href: "/docs/forms-accessibility", label: "Forms Accessibility" },
          { href: "/docs/focus-management", label: "Focus Management" },
          { href: "/docs/color-contrast", label: "Color Contrast" }
        ]}
      />
    </main>
  )
}
