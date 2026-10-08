import type { Metadata } from "next"

import { DirectoryList } from "@/components/docs/directory-list"
import { LinkPill } from "@/components/docs-pages/link-pill"
import { PageHeader } from "@/components/docs-pages/page-header"
import { generatedRegistryItems } from "@/lib/generated-registry-metadata"
import { createDocsMetadata } from "@/lib/docs-metadata"

export const metadata: Metadata = createDocsMetadata({
  title: "Component Directory",
  description:
    "Browse, search, and install all Glin UI components. Primitives, signature animated surfaces, and more, with one-click install commands.",
  path: "/docs/directory",
  keywords: [
    "component directory",
    "UI component catalog",
    "React component library",
    "component registry",
    "install components"
  ]
})

export default function DirectoryPage() {
  const primitiveCount = generatedRegistryItems.filter((i) => i.type === "primitive").length
  const signatureCount = generatedRegistryItems.filter((i) => i.type === "signature").length

  return (
    <main className="space-y-8">
      <PageHeader
        eyebrow={`${generatedRegistryItems.length} components`}
        title="Directory"
        lead={`Browse and install all ${generatedRegistryItems.length} Glin UI components. Search by name, filter by category, and copy install commands instantly.`}
      >
        <LinkPill href="/docs/getting-started" primary>
          Getting Started
        </LinkPill>
        <LinkPill href="/docs/components">Components Overview</LinkPill>
      </PageHeader>

      <dl className="grid max-w-xl grid-cols-3 divide-x divide-[var(--line-soft)] rounded-card border border-line-soft bg-surface-1">
        <Stat label="Total" value={generatedRegistryItems.length} />
        <Stat label="Primitives" value={primitiveCount} />
        <Stat label="Signature" value={signatureCount} />
      </dl>

      <DirectoryList items={generatedRegistryItems} />
    </main>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="px-4 py-3">
      <dt className="type-eyebrow">{label}</dt>
      <dd className="mt-1 text-xl font-medium tabular-nums">{value}</dd>
    </div>
  )
}
