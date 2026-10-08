"use client"

import type { ReactNode } from "react"
import { particleStill, signaturePreviewsA } from "./signature-previews-a"
import { signaturePreviewsB, signatureStills as stillsB } from "./signature-previews-b"

export const signatureStills: Record<string, ReactNode> = {
  ...stillsB,
  "particle-field": particleStill
}

function Fallback({ id, title }: { id: string; title: string }) {
  return (
    <div
      data-fallback={id}
      className="flex size-full items-center justify-center bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface-1)] p-4"
    >
      <div className="rounded-xl bg-accent/10 px-4 py-2 text-sm font-semibold text-[var(--color-accent)] ring-1 ring-[var(--line-soft)]">
        {title}
      </div>
    </div>
  )
}

const live: Record<string, ReactNode> = { ...signaturePreviewsA, ...signaturePreviewsB }

/** Ids that need a hand-made static fallback (no tile-sized live demo). */
export function getSignaturePreview(id: string, title: string): ReactNode {
  return live[id] ?? <Fallback id={id} title={title} />
}

export function hasRealSignaturePreview(id: string): boolean {
  return id in live
}
