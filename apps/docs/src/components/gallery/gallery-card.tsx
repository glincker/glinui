"use client"

import Link from "next/link"
import { useCallback, useState } from "react"
import { getRegistryItem } from "@glinui/registry"

import { AiCopyButton } from "@/components/ai/ai-copy-button"
import { useMarkdownUrl } from "@/components/ai/use-markdown-url"
import { buildAiPrompt, buildMarkdownUrl } from "@/lib/ai-prompt"
import { toPascalCase } from "@/lib/hub-animations"
import { SITE_URL } from "@/lib/seo"

import { GalleryPreview } from "./gallery-preview"
import { NEW_COMPONENT_IDS } from "./gallery-types"
import type { GalleryItem } from "./gallery-types"

export function GalleryCard({ item, onShowFamily }: { item: GalleryItem; onShowFamily?: () => void }) {
  const [hovered, setHovered] = useState(false)
  const isNew = item.isNew || NEW_COMPONENT_IDS.includes(item.id)
  const { markdownUrl, localize } = useMarkdownUrl(item.id)
  const getFullPrompt = useCallback(() => {
    const reg = getRegistryItem(item.id)
    const importPath = reg?.importPath ?? "@glinui/ui"
    const name = toPascalCase(item.id)
    return localize(
      buildAiPrompt({
        title: item.title,
        id: item.id,
        registryCommand: reg?.install.registry ?? `pnpm dlx @glinui/cli@latest add ${item.id}`,
        packageCommand: reg?.install.package ?? "pnpm add @glinui/ui @glinui/tokens",
        importPath,
        exampleCode: `import { ${name} } from "${importPath}"\n\n<${name} />`,
        markdownUrl: buildMarkdownUrl(item.id, SITE_URL)
      })
    )
  }, [item.id, item.title, localize])
  const tag = isNew ? "New" : item.maturity === "beta" ? "Beta" : null

  return (
    <div className="relative">
    <Link
      href={item.href}
      aria-label={`${item.title}${tag ? `, ${tag}` : ""}: ${item.description}`}
      className="group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <GalleryPreview item={item} hovered={hovered} />
      <div className="mt-3 flex items-center gap-2 px-1 pr-10">
        <span className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-[var(--color-accent)]">
          {item.title}
        </span>
        {item.adaptedFrom ? (
          <span
            title={`Adapted from ${item.adaptedFrom}`}
            data-testid="provenance-pill"
            className="rounded-full border border-[var(--line-soft)] px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-neutral-600 dark:text-neutral-300"
          >
            Adapted
          </span>
        ) : null}
        {tag ? (
          <span
            className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] ${
              isNew
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                : "bg-accent/10 text-[var(--color-accent)]"
            }`}
          >
            {tag}
          </span>
        ) : null}
      </div>
    </Link>
    <AiCopyButton
      componentId={item.id}
      title={item.title}
      getFullPrompt={getFullPrompt}
      markdownUrl={markdownUrl}
      className="absolute bottom-[-0.375rem] right-0 size-7"
    />
    {item.hasVariants && onShowFamily ? (
      <button
        type="button"
        onClick={onShowFamily}
        aria-label={`Show all ${item.variantCount + 1} ${item.title} family components`}
        className="absolute right-2 top-2 rounded-full bg-surface-0/90 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.06em] text-neutral-700 ring-1 ring-[var(--line-soft)] backdrop-blur transition-colors hover:text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] dark:text-neutral-200"
      >
        {item.variantCount} {item.variantCount === 1 ? "variant" : "variants"}
      </button>
    ) : null}
    </div>
  )
}
