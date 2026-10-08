"use client"

import { useMemo, useState } from "react"

import { CategoryIcon } from "@/components/layout/category-icons"
import { getCategory } from "@/lib/taxonomy"
import { GalleryCard } from "./gallery-card"
import { GalleryFilterBar } from "./gallery-filter-bar"
import { galleryCategoryOrder, galleryTagOptions } from "./gallery-types"
import type { GalleryCategory, GalleryItem, GallerySort, GalleryTag } from "./gallery-types"
import { useGalleryUrlState } from "./use-gallery-url-state"

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<GallerySort>("default")
  const [url, setUrl] = useGalleryUrlState()
  const { category: active, tags, family } = url

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const item of items) counts[item.category] = (counts[item.category] ?? 0) + 1
    return counts
  }, [items])

  const tagCounts = useMemo(() => {
    const counts = {} as Record<GalleryTag, number>
    for (const option of galleryTagOptions) counts[option.id] = items.filter((item) => item.tags.includes(option.id)).length
    return counts
  }, [items])

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = items.filter(
      (item) =>
        (family ? item.family === family : active === "All" || item.category === active) &&
        tags.every((tag) => item.tags.includes(tag)) &&
        (!q || item.title.toLowerCase().includes(q) || item.id.includes(q) || item.description.toLowerCase().includes(q))
    )
    const sorted = [...filtered].sort((a, b) => (sort === "az" ? a.title.localeCompare(b.title) : a.order - b.order))
    return galleryCategoryOrder
      .map((category) => ({ category, entries: sorted.filter((item) => item.category === category) }))
      .filter((section) => section.entries.length > 0)
  }, [items, query, active, tags, family, sort])

  const total = sections.reduce((sum, section) => sum + section.entries.length, 0)

  const setCategory = (next: GalleryCategory | "All") => setUrl({ ...url, category: next, family: null })
  const toggleTag = (tag: GalleryTag) =>
    setUrl({ ...url, tags: tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag] })

  return (
    <div className="space-y-10">
      <GalleryFilterBar
        query={query}
        onQuery={setQuery}
        categories={galleryCategoryOrder}
        categoryCounts={categoryCounts}
        active={active}
        onActive={setCategory}
        tags={tags}
        tagCounts={tagCounts}
        onToggleTag={toggleTag}
        family={family}
        onClearFamily={() => setUrl({ ...url, family: null })}
        sort={sort}
        onSort={setSort}
        count={total}
      />
      {sections.length === 0 ? (
        <p className="py-16 text-center text-sm text-neutral-500">No components match your filters.</p>
      ) : null}
      {sections.map((section) => {
        const meta = getCategory(section.category)
        const headingId = `gallery-${section.category}`
        return (
          <section key={section.category} aria-labelledby={headingId} className="space-y-5">
            <div className="space-y-1">
              <h2 id={headingId} className="type-h3 flex scroll-mt-28 items-center gap-2">
                <CategoryIcon name={meta.icon} className="size-5 text-[var(--color-accent)]" />
                {meta.title}
                <span className="font-mono text-xs font-normal tabular-nums text-neutral-500">{section.entries.length}</span>
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{meta.description}</p>
            </div>
            <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
              {section.entries.map((item) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  onShowFamily={item.family ? () => setUrl({ ...url, family: item.family ?? null }) : undefined}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
