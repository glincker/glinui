import Link from "next/link"
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr"

import { primitiveComponentIds, primitiveTitles, type PrimitiveComponentId } from "@/lib/primitives"
import { type DocsImplementation } from "@/lib/docs-route"

export function ComponentPager({
  component,
  implementation = "radix"
}: {
  component: PrimitiveComponentId
  implementation?: DocsImplementation
}) {
  const index = primitiveComponentIds.indexOf(component)

  if (index === -1) {
    return null
  }

  const previous = index > 0 ? primitiveComponentIds[index - 1] : null
  const next = index < primitiveComponentIds.length - 1 ? primitiveComponentIds[index + 1] : null

  if (!previous && !next) {
    return null
  }

  return (
    <nav aria-label="Component pagination" className="grid gap-3 border-t border-border/50 pt-6 sm:grid-cols-2">
      {previous ? (
        <Link
          href={`/docs/components/${implementation}/${previous}`}
          className="group rounded-2xl border border-border/60 bg-[var(--glass-2-surface)] px-4 py-3 backdrop-blur-xl transition-colors hover:bg-[var(--glass-3-surface)]"
        >
          <p className="text-xs uppercase tracking-[0.1em] text-neutral-500">Previous</p>
          <p className="mt-1 flex items-center gap-1.5 font-medium">
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            {primitiveTitles[previous]}
          </p>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/docs/components/${implementation}/${next}`}
          className="group rounded-2xl border border-border/60 bg-[var(--glass-2-surface)] px-4 py-3 backdrop-blur-xl transition-colors hover:bg-[var(--glass-3-surface)] sm:text-right"
        >
          <p className="text-xs uppercase tracking-[0.1em] text-neutral-500">Next</p>
          <p className="mt-1 flex items-center justify-start gap-1.5 font-medium sm:justify-end">
            {primitiveTitles[next]}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </p>
        </Link>
      ) : null}
    </nav>
  )
}
