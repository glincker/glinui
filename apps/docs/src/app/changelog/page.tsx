import type { Metadata } from "next"

import { PageHeader } from "@/components/docs-pages-b/page-header"
import { ChangelogList } from "@/components/site-pages/changelog-list"
import { CollectionJsonLd } from "@/components/site-pages/collection-json-ld"
import { changelogPackages, readChangelogs } from "@/lib/changelog"
import { createDocsMetadata } from "@/lib/docs-metadata"
import { REPO_URL } from "@/lib/site-links"

export const dynamic = "force-static"

export const metadata: Metadata = createDocsMetadata({
  title: "Changelog",
  description: "Release notes for @glinui/ui, @glinui/tokens, glinui (CLI), @glinui/registry and @glinui/motion, newest first.",
  path: "/changelog",
  keywords: ["Glin UI changelog", "release notes"]
})

export default function ChangelogPage() {
  const { entries, missing } = readChangelogs()
  return (
    <main className="mx-auto w-full max-w-4xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <CollectionJsonLd
        name="Changelog"
        description="Glin UI package release notes."
        path="/changelog"
        items={entries.map((entry) => ({ name: `${entry.packageName} ${entry.version}`, path: `/changelog#${entry.anchor}` }))}
      />
      <PageHeader eyebrow="Changelog" title="Release notes" lead="Rendered from each package CHANGELOG.md at build time, newest first." />
      {missing.length > 0 ? (
        <p className="type-body max-w-[68ch] rounded-card border border-line-soft bg-surface-1 p-4 text-muted">
          No CHANGELOG.md yet for {missing.map((pkg) => pkg.name).join(", ")}. See{" "}
          <a href={`${REPO_URL}/releases`} target="_blank" rel="noopener" className="text-[var(--color-accent)] underline underline-offset-4">
            GitHub Releases
          </a>{" "}
          for published versions.
        </p>
      ) : null}
      <ChangelogList entries={entries} packages={changelogPackages.map(({ id, name }) => ({ id, name }))} />
    </main>
  )
}
