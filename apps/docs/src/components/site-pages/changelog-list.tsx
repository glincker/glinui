"use client"

import { useState } from "react"

import type { ChangelogEntry } from "@/lib/changelog"

const chip =
  "inline-flex min-h-11 items-center rounded-full border px-4 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"

function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/g).map((part, index) =>
        part.startsWith("`") && part.endsWith("`") ? (
          <code key={index} className="type-code rounded-sm bg-surface-2 px-1">{part.slice(1, -1)}</code>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  )
}

export function ChangelogList({ entries, packages }: { entries: ChangelogEntry[]; packages: { id: string; name: string }[] }) {
  const [active, setActive] = useState("all")
  const shown = active === "all" ? entries : entries.filter((entry) => entry.packageId === active)
  const options = [{ id: "all", name: "All packages" }, ...packages]

  return (
    <div className="space-y-8">
      <div role="group" aria-label="Filter by package" className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={active === option.id}
            onClick={() => setActive(option.id)}
            className={`${chip} ${active === option.id ? "border-[var(--color-foreground)] bg-[var(--color-foreground)] text-[var(--color-background)]" : "border-line-soft hover:bg-surface-2"}`}
          >
            {option.name}
          </button>
        ))}
      </div>
      {shown.length === 0 ? <p className="type-body text-muted">No entries for this package yet.</p> : null}
      <ol className="space-y-8">
        {shown.map((entry) => (
          <li key={entry.anchor} id={entry.anchor} className="scroll-mt-24 space-y-3 border-t border-line-soft pt-6">
            <h2 className="type-h3">
              <a href={`#${entry.anchor}`} className="rounded-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]">
                {entry.packageName} <span className="text-muted">v{entry.version}</span>
              </a>
            </h2>
            {entry.groups.map((group) => (
              <div key={group.title} className="space-y-2">
                <p className="type-eyebrow">{group.title}</p>
                <ul className="list-disc space-y-1 pl-5 type-body">
                  {group.items.map((item) => (
                    <li key={item}><Inline text={item} /></li>
                  ))}
                </ul>
              </div>
            ))}
          </li>
        ))}
      </ol>
    </div>
  )
}
