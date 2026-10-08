"use client"

import Link from "next/link"
import { CaretRight } from "@phosphor-icons/react"

import {
  generatedApiMetadata,
  generatedApiMetadataGeneratedAt,
  type GeneratedApiComponentEntry
} from "@/lib/generated-api-metadata"
import type { ComponentId } from "@/lib/primitives"

export function GeneratedApiReference({ componentId }: { componentId: ComponentId }) {
  const apiMap = generatedApiMetadata as Record<string, GeneratedApiComponentEntry>
  const entry = apiMap[componentId]
  if (!entry) {
    return null
  }

  const hasFields = entry.propsTypes.some((propsType) => propsType.fields.length > 0)

  return (
    <section id="generated-api" className="space-y-4">
      <details className="group overflow-hidden rounded-2xl border border-border/60 bg-background/35">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <h2 className="type-h3 text-foreground">
              Generated API Snapshot
            </h2>
            <span className="inline-flex items-center rounded-full border border-amber-300/50 bg-amber-100/60 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-amber-700 dark:border-amber-400/35 dark:bg-amber-400/15 dark:text-amber-300">
              Beta
            </span>
          </div>
          <CaretRight className="size-4 text-neutral-500 transition-transform duration-fast ease-standard group-open:rotate-90" />
        </summary>

        <div className="space-y-4 border-t border-border/60 px-4 py-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Auto-extracted from TypeScript source in <code>{entry.sourceFile}</code>. This section is in beta and may
            lag behind hand-curated docs. Regenerate with <code>pnpm --filter @glinui/docs api:generate</code>.
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Generated: {generatedApiMetadataGeneratedAt} · Full index:{" "}
            <Link href="/docs/api-metadata" className="underline decoration-neutral-400/50 underline-offset-4 hover:text-foreground">
              /docs/api-metadata
            </Link>
          </p>

          <div className="rounded-xl border border-border/60 bg-background/30 p-3">
            <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Primary Props Type</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              <code>{entry.primaryPropsType ?? "-"}</code>
            </p>
          </div>

          {!hasFields ? (
            <div className="rounded-xl border border-border/60 bg-background/30 p-3 text-sm text-neutral-600 dark:text-neutral-400">
              No explicit component-only fields were extracted. This component primarily inherits native or composed
              props.
            </div>
          ) : null}

          {entry.propsTypes.map((propsType) => (
            <div key={propsType.name} className="space-y-2">
              <h3 id={`generated-${propsType.name.toLowerCase()}`} className="text-base font-medium text-foreground">
                <code>{propsType.name}</code>
              </h3>

              {propsType.fields.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-border/60">
                  <table className="min-w-full border-collapse text-left text-[13px] leading-6 tabular-nums">
                    <thead className="bg-black/5 dark:bg-white/5">
                      <tr>
                        <th scope="col" className="type-eyebrow px-3 py-2.5">Prop</th>
                        <th scope="col" className="type-eyebrow px-3 py-2.5">Type</th>
                        <th scope="col" className="type-eyebrow px-3 py-2.5">Required</th>
                        <th scope="col" className="type-eyebrow px-3 py-2.5">Default</th>
                        <th scope="col" className="type-eyebrow px-3 py-2.5">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {propsType.fields.map((field) => (
                        <tr key={`${propsType.name}-${field.name}`} className="border-t border-border/60">
                          <td className="px-3 py-2">
                            <code className="font-mono text-[13px] text-foreground">{field.name}</code>
                          </td>
                          <td className="px-3 py-2">
                            <code className="font-mono text-[12px] text-[var(--color-muted)]">{field.type}</code>
                          </td>
                          <td className="px-3 py-2">{field.optional ? "No" : "Yes"}</td>
                          <td className="px-3 py-2">
                            <code className="font-mono text-[12px] text-[var(--color-muted)]">{field.defaultValue ?? "-"}</code>
                          </td>
                          <td className="px-3 py-2">{field.description ?? "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">No explicit fields extracted for this props type.</p>
              )}
            </div>
          ))}
        </div>
      </details>
    </section>
  )
}
