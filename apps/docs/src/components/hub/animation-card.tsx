"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUpRight, Check, Terminal } from "@phosphor-icons/react"

import { usePackageManager } from "@/components/docs/code-surface-frame"
import { AiCopyButton } from "@/components/ai/ai-copy-button"
import { useMarkdownUrl } from "@/components/ai/use-markdown-url"
import { useCopy } from "@/components/docs/preview-frame"
import { getPlaybackMeta } from "@/lib/playback-meta"
import { useReplayWhileActive } from "@/components/playback"
import { getSignaturePreview, signatureStills } from "@/components/gallery/signature-previews"
import { buildAiPrompt, buildMarkdownUrl } from "@/lib/ai-prompt"
import { buildComponentHref } from "@/lib/docs-route"
import { generatedRegistryByName } from "@/lib/generated-registry-metadata"
import { toPascalCase, type HubAnimation } from "@/lib/hub-animations"
import { buildCommandTabs } from "@/lib/npm-commands"
import { SITE_URL } from "@/lib/seo"
import { componentTitles, signatureDescriptions } from "@/lib/primitives"

const actionClass =
  "inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[var(--surface-2)] px-2.5 text-[12px] font-medium text-neutral-600 ring-1 ring-[var(--line-soft)] transition-[transform,opacity] duration-150 ease-[var(--ease-out)] hover:text-foreground active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] motion-reduce:transition-none motion-reduce:active:scale-100 dark:text-neutral-300"

function useNearViewport<T extends Element>(): [React.RefObject<T | null>, boolean] {
  const ref = React.useRef<T>(null)
  const [near, setNear] = React.useState(false)
  React.useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === "undefined") {
      setNear(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const last = entries[entries.length - 1]
        if (last) setNear(last.isIntersecting)
      },
      { rootMargin: "160px" }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return [ref, near]
}

export function AnimationCard({ item }: { item: HubAnimation }) {
  const { id } = item
  const title = componentTitles[id]
  const registry = generatedRegistryByName[id as keyof typeof generatedRegistryByName]
  const [pm] = usePackageManager()
  const [active, setActive] = React.useState(false)
  const [ref, near] = useNearViewport<HTMLDivElement>()

  const registryCommand = registry?.install.registry ?? `pnpm dlx @glinui/cli@latest add ${id}`
  const installCommand = buildCommandTabs(registryCommand)?.[pm] ?? registryCommand
  const { markdownUrl, localize } = useMarkdownUrl(id)
  const prompt = buildAiPrompt({
    title,
    id,
    registryCommand,
    packageCommand: registry?.install.package ?? "pnpm add @glinui/ui @glinui/tokens",
    importPath: registry?.importPath ?? "@glinui/ui",
    exampleCode: `import { ${toPascalCase(id)} } from "${registry?.importPath ?? "@glinui/ui"}"\n\n<${toPascalCase(id)} />`,
    markdownUrl: buildMarkdownUrl(id, SITE_URL)
  })
  const getFullPrompt = React.useCallback(() => localize(prompt), [localize, prompt])
  const installCopy = useCopy(installCommand)

  const replayKey = useReplayWhileActive(active && getPlaybackMeta(id)?.oneShot === true, 4000)
  const node = !active ? (signatureStills[id] ?? getSignaturePreview(id, title)) : getSignaturePreview(id, title)

  return (
    <li
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setActive(false)
      }}
      className="group flex flex-col gap-3 rounded-2xl bg-[var(--surface-1)] p-2 [box-shadow:var(--elev-1)] ring-1 ring-[var(--line-soft)] transition-shadow duration-200 hover:[box-shadow:var(--elev-2)] motion-reduce:transition-none"
    >
      <div
        ref={ref}
        aria-hidden="true"
        className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[var(--surface-well)]"
      >
        {near ? (
          <div
            inert
            className={`pointer-events-none absolute inset-0 motion-reduce:[&_*]:[animation-play-state:paused] ${
              active ? "" : "[&_*]:[animation-play-state:paused]"
            }`}
          >
            <React.Fragment key={replayKey}>{node}</React.Fragment>
          </div>
        ) : null}
      </div>
      <div className="flex items-start justify-between gap-2 px-1.5">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-medium text-foreground">{title}</h3>
          <p className="mt-0.5 line-clamp-2 text-[13px] leading-5 text-neutral-600 dark:text-neutral-400">
            {signatureDescriptions[id]}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
        <AiCopyButton componentId={id} title={title} getFullPrompt={getFullPrompt} markdownUrl={markdownUrl} />
        <Link
          href={buildComponentHref(id, "radix")}
          aria-label={`Open ${title} docs`}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
        </div>
      </div>
      <div className="flex gap-2 px-1.5 pb-1.5">
        <button type="button" onClick={installCopy.copy} className={actionClass} aria-label={`Copy install command for ${title}`}>
          {installCopy.copied ? <Check className="size-3.5" aria-hidden="true" /> : <Terminal className="size-3.5" aria-hidden="true" />}
          {installCopy.copied ? "Copied" : "Install"}
        </button>
      </div>
    </li>
  )
}
