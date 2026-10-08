import type { Metadata } from "next"
import Link from "next/link"

import { CodeBlock } from "@/components/docs/code-block"
import { Callout } from "@/components/docs-pages-b/callout"
import { Checklist, ChecklistItem } from "@/components/docs-pages-b/checklist-item"
import { ContrastTable } from "@/components/docs-pages-b/contrast-table"
import { PageHeader } from "@/components/docs-pages-b/page-header"
import { PageSection } from "@/components/docs-pages-b/page-section"
import { RelatedLinks } from "@/components/docs-pages-b/related-links"
import { createDocsMetadata } from "@/lib/docs-metadata"

const contrastExampleSnippet = `<div className="rounded-xl border border-border/60 bg-[var(--glass-3-surface)] p-4">
  <p className="text-sm text-neutral-700 dark:text-neutral-200">
    Secondary copy keeps AA contrast on glass surfaces.
  </p>
  <a
    href="#"
    className="mt-2 inline-flex text-sm font-medium text-[var(--color-foreground)] underline underline-offset-4"
  >
    Read the full accessibility spec
  </a>
</div>`

const auditSnippet = `# Suggested release audit workflow
pnpm --filter @glinui/docs build

# Then validate key routes with browser accessibility tooling:
# - /docs/getting-started
# - /docs/components/radix/button
# - /docs/components/radix/table
# - /docs/forms-accessibility`

const targets = [
  { what: "Body text", aa: "4.5:1", aaa: "7:1" },
  { what: "Large text (24px, or 19px bold)", aa: "3:1", aaa: "4.5:1" },
  { what: "UI components and focus rings", aa: "3:1", aaa: "No AAA target" }
]

export const metadata: Metadata = createDocsMetadata({
  title: "Color Contrast Validation",
  description:
    "WCAG AA and AAA contrast targets, computed ratios for Glin UI token pairs in light and dark, and how to test text on glass surfaces.",
  path: "/docs/color-contrast",
  keywords: ["color contrast", "WCAG AA", "visual accessibility", "dark mode readability"]
})

export default function ColorContrastPage() {
  return (
    <main className="space-y-12">
      <PageHeader
        eyebrow="Visual accessibility"
        title="Color Contrast Validation"
        lead="Check contrast in both themes so depth, blur, and color never cost readability."
        actions={
          <Link
            href="/docs/colors"
            className="inline-flex h-10 items-center rounded-input border border-line-soft px-4 text-sm font-medium hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            Open the color explorer
          </Link>
        }
      />

      <PageSection
        id="targets"
        title="WCAG targets"
        description="WCAG 2.x contrast ratios. AA is the common release bar. AAA is a stricter goal."
      >
        <div className="overflow-x-auto rounded-card border border-line-soft bg-surface-1">
          <table className="w-full min-w-[420px] border-collapse text-left text-sm">
            <caption className="sr-only">WCAG contrast targets by content type</caption>
            <thead>
              <tr className="border-b border-line-soft">
                <th scope="col" className="type-eyebrow px-4 py-3 font-medium">Content</th>
                <th scope="col" className="type-eyebrow px-4 py-3 font-medium">AA</th>
                <th scope="col" className="type-eyebrow px-4 py-3 font-medium">AAA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {targets.map((row) => (
                <tr key={row.what}>
                  <th scope="row" className="px-4 py-3 font-normal">{row.what}</th>
                  <td className="px-4 py-3 font-mono">{row.aa}</td>
                  <td className="px-4 py-3 font-mono">{row.aaa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageSection>

      <PageSection
        id="token-pairs"
        title="Token pairs"
        description="Ratios computed from the OKLCH values in the tokens package. The color explorer shows the same AA and AAA badges live for any color you pick."
      >
        <ContrastTable />
        <Callout variant="note" title="Muted text">
          Muted text is the pair most likely to fall short. Use it for secondary copy only, and check it on every
          surface it sits on.
        </Callout>
      </PageSection>

      <PageSection id="checklist" title="Contrast Checklist" description="Run this pass for every major visual update.">
        <Checklist>
          <ChecklistItem>Body text meets WCAG AA (4.5:1) on every surface, including glass.</ChecklistItem>
          <ChecklistItem>Muted labels stay readable in both light and dark themes.</ChecklistItem>
          <ChecklistItem>Focus rings and selected states reach 3:1 against their neighbors.</ChecklistItem>
          <ChecklistItem>Success, warning, and error states include text or an icon, not color alone.</ChecklistItem>
          <ChecklistItem>Disabled controls are still legible enough to be understood.</ChecklistItem>
        </Checklist>
      </PageSection>

      <PageSection id="glass" title="Testing text on glass">
        <p className="type-body max-w-[68ch] text-muted">
          A translucent surface has no single background color. Sample the busiest part of the backdrop behind the
          text and measure against that, in both themes.
        </p>
        <CodeBlock language="tsx" code={contrastExampleSnippet} />
        <CodeBlock language="bash" code={auditSnippet} />
      </PageSection>

      <RelatedLinks
        links={[
          { href: "/docs/colors", label: "Colors", description: "Live contrast badges and tonal ramps." },
          { href: "/docs/forms-accessibility", label: "Forms Accessibility" },
          { href: "/docs/focus-management", label: "Focus Management" },
          { href: "/docs/screen-reader-testing", label: "Screen Reader Testing" }
        ]}
      />
    </main>
  )
}
