"use client"

import Link from "next/link"
import { ArrowLeft, ArrowRight, ArrowUp } from "@phosphor-icons/react"

import { primitiveTitles, type PrimitiveComponentId } from "@/lib/primitives"
import { type DocsImplementation } from "@/lib/docs-route"

const actionClass =
  "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-neutral-400 transition-colors hover:bg-white/20 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] dark:text-neutral-500 dark:hover:bg-white/[0.04] dark:hover:text-neutral-300"

export function TocFooter({
  previous,
  next,
  implementation,
  onTop
}: {
  previous: PrimitiveComponentId | null
  next: PrimitiveComponentId | null
  implementation: DocsImplementation
  onTop: () => void
}) {
  return (
    <div className="mt-4 flex items-center justify-between border-t border-neutral-200/50 pt-3 dark:border-white/[0.06]">
      {previous ? (
        <Link href={`/docs/components/${implementation}/${previous}`} className={`group ${actionClass}`}>
          <ArrowLeft className="size-3 transition-transform group-hover:-translate-x-0.5" />
          {primitiveTitles[previous]}
        </Link>
      ) : (
        <span />
      )}
      <button type="button" onClick={onTop} className={actionClass}>
        <ArrowUp className="size-3" />
        Top
      </button>
      {next ? (
        <Link href={`/docs/components/${implementation}/${next}`} className={`group ${actionClass}`}>
          {primitiveTitles[next]}
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : (
        <span />
      )}
    </div>
  )
}
