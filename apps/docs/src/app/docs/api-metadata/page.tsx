import type { Metadata } from "next"
import { PageHeader } from "@/components/docs-pages/page-header"
import {
  generatedApiMetadata,
  generatedApiMetadataGeneratedAt
} from "@/lib/generated-api-metadata"
import { createDocsMetadata } from "@/lib/docs-metadata"

const entries = Object.entries(generatedApiMetadata).sort(([a], [b]) => a.localeCompare(b))
const totalPropsTypes = entries.reduce((count, [, entry]) => count + entry.propsTypes.length, 0)
const totalFields = entries.reduce(
  (count, [, entry]) => count + entry.propsTypes.reduce((inner, propsType) => inner + propsType.fields.length, 0),
  0
)

export const metadata: Metadata = createDocsMetadata({
  title: "API Metadata",
  description:
    "Generated TypeScript props metadata for Glin UI components, used to automate API tables and prevent docs drift.",
  path: "/docs/api-metadata",
  keywords: ["TypeScript API metadata", "component props reference", "docs automation"]
})

export default function ApiMetadataPage() {
  return (
    <main className="space-y-8">
      <PageHeader
        eyebrow="API automation"
        title="API Metadata Index"
        lead="Generated prop metadata from packages/ui type definitions. This is the baseline for API-table automation and drift prevention."
      >
        <p className="font-mono text-xs text-muted">Generated: {generatedApiMetadataGeneratedAt}</p>
      </PageHeader>

      <section aria-labelledby="extracted-heading" className="space-y-4">
        <div className="space-y-2">
          <h2 id="extracted-heading" className="type-section">
            Extracted Components: {entries.length}
          </h2>
          <p className="type-body max-w-[68ch] text-muted">
            Exported props are extracted from the TypeScript AST (type aliases and interfaces), including intersected
            and inherited local declarations.
          </p>
          <div className="flex flex-wrap gap-2 font-mono text-xs text-muted">
            <span className="rounded-md border border-line-soft bg-surface-1 px-2 py-1">Props types: {totalPropsTypes}</span>
            <span className="rounded-md border border-line-soft bg-surface-1 px-2 py-1">Explicit fields: {totalFields}</span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-card border border-line-soft bg-surface-1">
          <table className="min-w-full border-collapse text-left text-sm">
            <caption className="sr-only">Generated props metadata per component</caption>
            <thead className="bg-surface-2">
              <tr>
                <th scope="col" className="type-eyebrow px-3 py-2.5">Component</th>
                <th scope="col" className="type-eyebrow px-3 py-2.5">Primary Props Type</th>
                <th scope="col" className="type-eyebrow px-3 py-2.5">Props Types</th>
                <th scope="col" className="type-eyebrow px-3 py-2.5">Extracted Fields</th>
                <th scope="col" className="type-eyebrow px-3 py-2.5">Source File</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(([name, meta]) => (
                <tr key={name} className="border-t border-line-soft align-top">
                  <th scope="row" className="px-3 py-2 font-medium">{name}</th>
                  <td className="px-3 py-2">
                    <code className="type-code">{meta.primaryPropsType ?? "-"}</code>
                  </td>
                  <td className="px-3 py-2">
                    <CodeList items={meta.propsTypes.map((propsType) => propsType.name)} prefix={name} />
                  </td>
                  <td className="px-3 py-2">
                    <CodeList items={meta.explicitProps} prefix={name} />
                  </td>
                  <td className="px-3 py-2">
                    <code className="font-mono text-xs text-muted">{meta.sourceFile}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

function CodeList({ items, prefix }: { items: readonly string[]; prefix: string }) {
  if (items.length === 0) return <span className="text-muted">-</span>
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <code key={`${prefix}-${item}`} className="rounded border border-line-soft bg-surface-2 px-1.5 py-0.5 font-mono text-xs">
          {item}
        </code>
      ))}
    </div>
  )
}
