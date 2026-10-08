"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Cube, Check, Copy, Diamond, MagnifyingGlass } from "@phosphor-icons/react"

import { cn } from "@glinui/ui"
import type { GeneratedRegistryEntry } from "@/lib/generated-registry-metadata"

type Category = "all" | "primitive" | "signature"

const categories: { value: Category; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "all", label: "All", icon: Cube },
  { value: "primitive", label: "Primitives", icon: Cube },
  { value: "signature", label: "Signature", icon: Diamond }
]

export function DirectoryList({ items }: { items: readonly GeneratedRegistryEntry[] }) {
  const [query, setQuery] = React.useState("")
  const [category, setCategory] = React.useState<Category>("all")

  const filtered = React.useMemo(() => {
    let result = items

    if (category !== "all") {
      result = result.filter((item) => item.type === category)
    }

    const q = query.trim().toLowerCase()
    if (q) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      )
    }

    return result
  }, [items, query, category])

  return (
    <div className="space-y-6">
      {/* Search + Filters */}
      <div className="space-y-3">
        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search components..."
            className={cn(
              "w-full rounded-xl border border-white/15 bg-[var(--glass-2-surface)] py-2.5 pl-10 pr-4 text-sm text-foreground outline-none backdrop-blur-xl",
              "placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
              "[box-shadow:0_0_0_1px_rgb(255_255_255_/_0.06)_inset,var(--shadow-soft)]",
              "focus:border-white/25 focus:[box-shadow:0_0_0_1px_rgb(255_255_255_/_0.1)_inset,var(--shadow-glass-sm)]",
              "transition-shadow duration-fast ease-standard",
              "dark:border-white/[0.08] dark:bg-white/[0.04]"
            )}
          />
        </div>

        <div className="flex items-center gap-2">
          {categories.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setCategory(value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-fast ease-standard",
                category === value
                  ? "border border-white/15 [border-top-color:var(--glass-refraction-top)] bg-[var(--glass-4-surface)] text-foreground [box-shadow:0_0_0_1px_rgb(255_255_255_/_0.08)_inset,var(--shadow-soft)] dark:border-white/[0.1] dark:bg-white/[0.08]"
                  : "border border-transparent text-neutral-500 hover:text-foreground hover:bg-white/[0.06] dark:text-neutral-400 dark:hover:bg-white/[0.04]"
              )}
            >
              <Icon className="size-3" />
              {label}
            </button>
          ))}
          <span className="ml-auto text-xs tabular-nums text-neutral-400 dark:text-neutral-500">
            {filtered.length} component{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Results Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[var(--glass-1-surface)] py-16 dark:border-white/[0.06]">
          <MagnifyingGlass className="size-8 text-neutral-300 dark:text-neutral-600" />
          <p className="mt-3 text-sm text-neutral-500">No components match &ldquo;{query}&rdquo;</p>
          <button
            type="button"
            onClick={() => {
              setQuery("")
              setCategory("all")
            }}
            className="mt-2 text-xs text-accent hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <DirectoryCard key={item.name} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

function DirectoryCard({ item }: { item: GeneratedRegistryEntry }) {
  const [copied, setCopied] = React.useState(false)

  const copyInstall = React.useCallback(() => {
    navigator.clipboard.writeText(item.install.registry).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [item.install.registry])

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl border border-white/[0.12] bg-[var(--glass-2-surface)] p-4 backdrop-blur-xl",
        "[box-shadow:0_0_0_1px_rgb(255_255_255_/_0.06)_inset,var(--shadow-soft)]",
        "transition-all duration-fast ease-standard hover:-translate-y-0.5 hover:border-white/[0.18] hover:bg-[var(--glass-3-surface)] hover:[box-shadow:0_0_0_1px_rgb(255_255_255_/_0.08)_inset,var(--shadow-glass-sm)]",
        "dark:border-white/[0.08] dark:hover:border-white/[0.12]"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">{item.title}</h3>
          <span
            className={cn(
              "inline-flex rounded-full px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em]",
              item.type === "signature"
                ? "border border-violet-300/50 bg-violet-100/60 text-violet-700 dark:border-violet-400/35 dark:bg-violet-400/15 dark:text-violet-300"
                : "border border-sky-300/50 bg-sky-100/60 text-sky-700 dark:border-sky-400/35 dark:bg-sky-400/15 dark:text-sky-300"
            )}
          >
            {item.type === "signature" ? "Signature" : "Primitive"}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="mt-2 flex-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
        {item.description}
      </p>

      {/* Install command */}
      <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/[0.04] px-2.5 py-1.5 dark:border-white/[0.06] dark:bg-black/20">
        <code className="flex-1 truncate text-[11px] text-neutral-500 dark:text-neutral-400">
          {item.install.registry}
        </code>
        <button
          type="button"
          onClick={copyInstall}
          className="shrink-0 rounded-md p-1 text-neutral-400 transition-colors hover:bg-white/10 hover:text-foreground dark:text-neutral-500 dark:hover:text-neutral-300"
          aria-label={`Copy install command for ${item.title}`}
        >
          {copied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
        </button>
      </div>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-2">
        <Link
          href={item.docsPath}
          className={cn(
            "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-fast ease-standard",
            "border border-white/15 [border-top-color:var(--glass-refraction-top)] bg-[var(--glass-3-surface)] text-foreground",
            "[box-shadow:0_0_0_1px_rgb(255_255_255_/_0.06)_inset,var(--shadow-soft)]",
            "hover:bg-[var(--glass-4-surface)] hover:[box-shadow:0_0_0_1px_rgb(255_255_255_/_0.08)_inset,var(--shadow-glass-sm)]",
            "dark:border-white/[0.1]"
          )}
        >
          View Docs
          <ArrowRight className="size-3" />
        </Link>
        <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
          {item.importPath}
        </span>
      </div>
    </div>
  )
}
