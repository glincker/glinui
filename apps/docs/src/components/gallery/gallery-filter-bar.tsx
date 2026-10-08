"use client"

import { MagnifyingGlass, X } from "@phosphor-icons/react"
import { useEffect, useRef, useState } from "react"

import { getCategory, getTitle } from "@/lib/taxonomy"
import { galleryTagOptions } from "./gallery-types"
import type { GalleryCategory, GallerySort, GalleryTag } from "./gallery-types"

type Props = {
  query: string
  onQuery: (value: string) => void
  categories: GalleryCategory[]
  categoryCounts: Record<string, number>
  active: GalleryCategory | "All"
  onActive: (value: GalleryCategory | "All") => void
  tags: GalleryTag[]
  tagCounts: Record<GalleryTag, number>
  onToggleTag: (tag: GalleryTag) => void
  family: string | null
  onClearFamily: () => void
  sort: GallerySort
  onSort: (value: GallerySort) => void
  count: number
}

const chip =
  "rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
const scrollRow =
  "flex min-w-0 flex-1 gap-1 overflow-x-auto [mask-image:linear-gradient(to_right,transparent,#000_12px,#000_calc(100%-16px),transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"

export function GalleryFilterBar({
  query,
  onQuery,
  categories,
  categoryCounts,
  active,
  onActive,
  tags,
  tagCounts,
  onToggleTag,
  family,
  onClearFamily,
  sort,
  onSort,
  count
}: Props) {
  const options: Array<GalleryCategory | "All"> = ["All", ...categories]
  const sentinel = useRef<HTMLDivElement>(null)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const node = sentinel.current
    if (!node || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting), { threshold: 0 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <>
    <div ref={sentinel} aria-hidden="true" className="pointer-events-none -mb-10 h-px w-full" />
    <div
      data-stuck={stuck}
      className="sticky top-0 z-20 -mx-4 border-b border-transparent bg-[var(--page-bg,var(--surface-0,transparent))] px-4 py-3 transition-colors data-[stuck=true]:border-[var(--line-soft)] data-[stuck=true]:bg-[var(--surface-0,var(--page-bg))] sm:-mx-6 sm:px-6"
    >
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-2 rounded-2xl bg-[var(--surface-1)] p-2 [box-shadow:var(--elev-2)] ring-1 ring-[var(--line-soft)]">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="relative block sm:w-56">
          <span className="sr-only">Search components</span>
          <MagnifyingGlass aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="Search components"
            className="w-full rounded-xl bg-transparent py-2 pl-9 pr-3 text-sm outline-none ring-1 ring-[var(--line-soft)] placeholder:text-neutral-500 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          />
        </label>
        <div className={scrollRow} role="group" aria-label="Filter by category">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={active === option}
              onClick={() => onActive(option)}
              className={`${chip} ${
                active === option
                  ? "bg-[var(--color-accent)] text-[var(--color-accent-foreground)]"
                  : "text-neutral-600 hover:bg-[var(--line-soft)] dark:text-neutral-300"
              }`}
            >
              {option === "All" ? "All" : getCategory(option).title}
              {option !== "All" ? (
                <span className="ml-1.5 font-mono text-[10px] tabular-nums opacity-60">{categoryCounts[option] ?? 0}</span>
              ) : null}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className={scrollRow} role="group" aria-label="Filter by tag">
          {galleryTagOptions.map((option) => {
            const pressed = tags.includes(option.id)
            const empty = (tagCounts[option.id] ?? 0) === 0 && !pressed
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={pressed}
                disabled={empty}
                onClick={() => onToggleTag(option.id)}
                className={`${chip} ring-1 disabled:cursor-not-allowed disabled:opacity-40 ${
                  pressed
                    ? "bg-[var(--color-accent)] text-[var(--color-accent-foreground)] ring-transparent"
                    : "text-neutral-600 ring-[var(--line-soft)] hover:bg-[var(--line-soft)] dark:text-neutral-300"
                }`}
              >
                {option.label}
                <span className="ml-1.5 font-mono text-[10px] tabular-nums opacity-60">{tagCounts[option.id] ?? 0}</span>
              </button>
            )
          })}
          {family ? (
            <button
              type="button"
              onClick={onClearFamily}
              className={`${chip} inline-flex items-center gap-1 bg-[var(--line-soft)] text-foreground`}
            >
              Family: {getTitle(family)}
              <X aria-hidden="true" className="size-3" />
              <span className="sr-only">Clear family filter</span>
            </button>
          ) : null}
        </div>
        <label className="flex items-center gap-2 text-xs text-muted">
          <span className="sr-only">Sort components</span>
          <select
            value={sort}
            onChange={(event) => onSort(event.target.value as GallerySort)}
            className="rounded-xl bg-transparent px-2 py-2 text-xs outline-none ring-1 ring-[var(--line-soft)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            <option value="default">Curated</option>
            <option value="az">A to Z</option>
          </select>
        </label>
        <p className="px-2 text-xs tabular-nums text-muted" aria-live="polite">
          {count} shown
        </p>
      </div>
    </div>
    </div>
    </>
  )
}
