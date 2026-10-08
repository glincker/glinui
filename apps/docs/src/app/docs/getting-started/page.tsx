import type { Metadata } from "next"
import Link from "next/link"
import { CaretDown } from "@phosphor-icons/react/dist/ssr"

import { CodeBlock } from "@/components/docs/code-block"
import { InstallTabs } from "@/components/docs/install-tabs"
import { FrameworkSetup } from "@/components/docs-pages/framework-setup"
import { registryOwnershipSnippet, troubleshooting } from "@/components/docs-pages/getting-started-data"
import { DocSection, PageHeader } from "@/components/docs-pages/page-header"
import { StackRow } from "@/components/docs-pages/stack-row"
import { createDocsMetadata } from "@/lib/docs-metadata"

export const metadata: Metadata = createDocsMetadata({
  title: "Getting Started",
  description:
    "Install Glin UI in Next.js, Vite, Remix, Astro, or TanStack Start, import theme tokens, add the Tailwind preset, and ship your first component.",
  path: "/docs/getting-started",
  keywords: ["Glin UI install", "Next.js UI setup", "React UI setup", "Tailwind preset", "design tokens install"]
})

const comparison = [
  { label: "How you get code", pkg: "Import from @glinui/ui", registry: "CLI copies source into your repo" },
  { label: "Updates", pkg: "Bump the package version", registry: "Re-run the CLI and merge the diff" },
  { label: "Customization", pkg: "Props, variants, and Tailwind classes", registry: "Edit the files directly" },
  { label: "Best for", pkg: "Fast start, shared look across apps", registry: "Heavy customization, full ownership" }
] as const

const relatedLinks = [
  { href: "/docs/components", label: "Browse Components" },
  { href: "/docs/tokens", label: "Read Token Guide" },
  { href: "/docs/forms-accessibility", label: "Forms Accessibility" },
  { href: "/docs/accessibility", label: "Accessibility Hub" },
  { href: "/docs/forms-recipes", label: "Form Recipes" },
  { href: "/docs/screen-reader-testing", label: "Screen Reader Testing" },
  { href: "/docs/focus-management", label: "Focus Management" },
  { href: "/docs/color-contrast", label: "Color Contrast" },
  { href: "/docs/api-metadata", label: "API Metadata" }
] as const

export default function GettingStartedPage() {
  return (
    <main className="space-y-12">
      <PageHeader
        eyebrow="Setup in five steps"
        title="Getting Started"
        lead="Install the package, import the tokens, add the Tailwind preset, and render your first component. Commands follow the package manager you pick."
      />

      <StackRow />

      <DocSection
        id="framework-setup"
        title="Framework Setup"
        description="Choose your framework. The steps below update to match."
      >
        <FrameworkSetup />
      </DocSection>

      <DocSection
        id="registry-workflow"
        title="Registry Workflow"
        description="Prefer owning the source instead of importing a package? Use the CLI registry to copy a component into your app and edit it directly."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="min-w-0 space-y-3">
            <h3 className="type-h3">Add from Registry</h3>
            <InstallTabs command="pnpm dlx @glinui/cli@latest add button" />
            <InstallTabs command="pnpm dlx @glinui/cli@latest add data-table" />
          </div>
          <div className="min-w-0 space-y-3">
            <h3 className="type-h3">Ownership pattern</h3>
            <CodeBlock language="bash" code={registryOwnershipSnippet} />
          </div>
        </div>

        <h3 className="type-h3 pt-4">Registry vs package</h3>
        <div className="overflow-x-auto rounded-card border border-line-soft bg-surface-1">
          <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
            <caption className="sr-only">Comparison of the package and registry install paths</caption>
            <thead className="bg-surface-2">
              <tr>
                <th scope="col" className="type-eyebrow px-4 py-2.5" />
                <th scope="col" className="type-eyebrow px-4 py-2.5">
                  Package
                </th>
                <th scope="col" className="type-eyebrow px-4 py-2.5">
                  Registry
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.label} className="border-t border-line-soft align-top">
                  <th scope="row" className="px-4 py-3 font-medium">
                    {row.label}
                  </th>
                  <td className="px-4 py-3 text-muted">{row.pkg}</td>
                  <td className="px-4 py-3 text-muted">{row.registry}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection id="troubleshooting" title="Troubleshooting">
        <div className="max-w-[68ch] divide-y divide-[var(--line-soft)] rounded-card border border-line-soft bg-surface-1">
          {troubleshooting.map((item) => (
            <details key={item.q} className="group px-4 py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand [&::-webkit-details-marker]:hidden">
                {item.q}
                <CaretDown
                  className="size-4 shrink-0 text-muted transition-transform group-open:rotate-180 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </summary>
              <p className="type-body mt-2 text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </DocSection>

      <DocSection id="next" title="Keep going">
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {relatedLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex h-full items-center rounded-input border border-line-soft bg-surface-1 px-3.5 py-2.5 text-sm font-medium transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand motion-reduce:transition-none"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </DocSection>
    </main>
  )
}
