import Link from "next/link"
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr"

import { buildComponentHref, type DocsImplementation } from "@/lib/docs-route"
import type { ComponentId } from "@/lib/primitives"
import { getCategory, getEntry, getFamily, getRelated, getTitle } from "@/lib/taxonomy"

const MAX_RELATED = 6

/** Up to six siblings (same family first, then same category) as a row of link cards. */
export function RelatedComponents({
  componentId,
  implementation
}: {
  componentId: string
  implementation: DocsImplementation
}) {
  const related = getRelated(componentId).slice(0, MAX_RELATED)
  if (related.length === 0) return null
  const familyIds = new Set(getFamily(componentId))
  const category = getCategory(getEntry(componentId).category)

  return (
    <section id="related" aria-labelledby="related-heading" className="space-y-4 scroll-mt-24">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="related-heading" className="type-h3">
          Related
        </h2>
        <Link
          href={`/docs/components?category=${category.id}`}
          className="text-[13px] text-muted transition-colors hover:text-foreground dark:text-neutral-400"
        >
          All in {category.title}
        </Link>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((id) => {
          const entry = getEntry(id)
          const sibling = familyIds.has(id)
          return (
            <li key={id}>
              <Link
                href={buildComponentHref(id as ComponentId, implementation)}
                className="group flex h-full items-start justify-between gap-3 rounded-xl bg-[var(--surface-1)] p-3.5 ring-1 ring-[var(--line-soft)] transition-colors hover:bg-[var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-foreground">{getTitle(id)}</span>
                  <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
                    {sibling ? "Same family" : getCategory(entry.category).title}
                    {entry.tags.includes("animated") ? " / animated" : ""}
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="mt-0.5 size-3.5 shrink-0 text-muted transition-colors group-hover:text-[var(--color-accent)]"
                />
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
