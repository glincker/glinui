"use client"

import Link from "next/link"

import { cn } from "@glinui/ui"
import { type DocsImplementation } from "@/lib/docs-route"
import { type PrimitiveComponentId } from "@/lib/primitives"

export function ImplementationToggle({
  componentId,
  implementation
}: {
  componentId: PrimitiveComponentId
  implementation: DocsImplementation
}) {
  return (
    <div className="inline-flex rounded-full border border-black/[0.08] [border-top-color:rgb(255_255_255_/_0.55)] bg-[linear-gradient(180deg,rgb(255_255_255_/_0.72),rgb(244_244_245_/_0.56))] p-1 shadow-[0_0_0_1px_rgb(255_255_255_/_0.5)_inset,0_10px_24px_-20px_rgb(15_23_42_/_0.32)] dark:border-white/[0.12] dark:[border-top-color:rgb(255_255_255_/_0.2)] dark:bg-[linear-gradient(180deg,rgb(255_255_255_/_0.08),rgb(255_255_255_/_0.03))] dark:shadow-[0_0_0_1px_rgb(255_255_255_/_0.08)_inset,0_10px_24px_-18px_rgb(0_0_0_/_0.55)]">
      <ImplementationPill
        href={`/docs/components/radix/${componentId}`}
        active={implementation === "radix"}
        label="Radix UI"
      />
      <ImplementationPill
        href={`/docs/components/base/${componentId}`}
        active={implementation === "base"}
        label="Base UI"
      />
    </div>
  )
}

function ImplementationPill({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium transition-[color,background-color,box-shadow,border-color]",
        active
          ? "border border-black/10 bg-[linear-gradient(180deg,rgb(255_255_255),rgb(241_241_242))] text-neutral-900 shadow-[0_1px_0_rgb(255_255_255_/_0.92)_inset,0_8px_20px_-14px_rgb(15_23_42_/_0.35)] dark:border-white/[0.18] dark:bg-[linear-gradient(180deg,rgb(255_255_255_/_0.18),rgb(255_255_255_/_0.08))] dark:text-white dark:shadow-[0_1px_0_rgb(255_255_255_/_0.16)_inset,0_10px_22px_-14px_rgb(0_0_0_/_0.55)]"
          : "border border-transparent text-neutral-500 hover:text-foreground dark:text-neutral-400 dark:hover:text-neutral-200"
      )}
    >
      {label}
    </Link>
  )
}
