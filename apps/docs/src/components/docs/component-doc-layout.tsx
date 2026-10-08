"use client"

import * as React from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CaretRight } from "@phosphor-icons/react"
import { PencilSimple } from "@phosphor-icons/react"

import { FloatingComponentChrome } from "@/components/docs/floating-component-chrome"
import { GeneratedApiReference } from "@/components/docs/generated-api-reference"
import { RelatedComponents } from "@/components/docs/related-components"
import { ComponentPager } from "@/components/docs/component-pager"
import { AiCopyMenu } from "@/components/ai/ai-copy-menu"
import { useMarkdownUrl } from "@/components/ai/use-markdown-url"
import { AdaptedBadge } from "@/components/docs/adapted-badge"
import { ComponentDocContext, useComponentDocState } from "@/components/docs/component-doc-context"
import { DocsToc } from "@/components/docs/docs-toc"
import { ImplementationToggle } from "@/components/docs/implementation-toggle"
import { buildAiPrompt, buildComponentMarkdown, buildMarkdownUrl } from "@/lib/ai-prompt"
import { SITE_URL } from "@/lib/seo"
import { getRegistryItem } from "@glinui/registry"
import { getImplementationFromPath, type DocsImplementation } from "@/lib/docs-route"
import { getComponentStructuredData } from "@/lib/structured-data"
import { getCategory, getEntry } from "@/lib/taxonomy"
import { primitiveComponentIds, primitiveMaturity, type ComponentId, type PrimitiveComponentId } from "@/lib/primitives"

export function ComponentDocLayout({
  badgeLabel,
  title,
  componentId,
  implementation = "radix",
  description,
  showGeneratedApi = true,
  promptText,
  markdownText,
  children
}: {
  badgeLabel: string
  title: string
  componentId: ComponentId
  implementation?: DocsImplementation
  description: string
  showGeneratedApi?: boolean
  promptText?: string
  markdownText?: string
  children: ReactNode
}) {
  const editHref = `https://github.com/GLINCKER/glinui/edit/main/apps/docs/src/app/docs/components/${componentId}/page.mdx`
  const pathname = usePathname()
  const resolvedImplementation = getImplementationFromPath(pathname) ?? implementation
  const isPrimitiveComponent = primitiveComponentIds.includes(componentId as PrimitiveComponentId)
  const maturity = (primitiveMaturity as Record<string, string>)[componentId] ?? "stable"
  const category = getCategory(getEntry(componentId).category)
  const provenance = getRegistryItem(componentId)?.provenance ?? null
  const docState = useComponentDocState()
  const { heroCode } = docState
  const generated = React.useMemo(() => {
    if (promptText || markdownText || heroCode === null) return null
    const item = getRegistryItem(componentId)
    const input = {
      title,
      id: componentId,
      registryCommand: item?.install.registry ?? `pnpm dlx @glinui/cli@latest add ${componentId}`,
      packageCommand: item?.install.package ?? "pnpm add @glinui/ui @glinui/tokens",
      importPath: item?.importPath ?? "@glinui/ui",
      exampleCode: heroCode,
      markdownUrl: buildMarkdownUrl(componentId, SITE_URL)
    }
    return { prompt: buildAiPrompt(input), markdown: buildComponentMarkdown({ ...input, description }) }
  }, [promptText, markdownText, heroCode, componentId, title, description])
  const effectivePrompt = promptText ?? generated?.prompt
  const effectiveMarkdown = markdownText ?? generated?.markdown
  const { markdownUrl, localize } = useMarkdownUrl(componentId)
  const getFullPrompt = React.useCallback(() => localize(effectivePrompt ?? ""), [effectivePrompt, localize])
  const getMarkdown = React.useCallback(() => localize(effectiveMarkdown ?? ""), [effectiveMarkdown, localize])
  const structuredData = React.useMemo(
    () =>
      getComponentStructuredData({
        componentId,
        title,
        description
      }),
    [componentId, description, title]
  )

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_200px] xl:gap-12">
      <FloatingComponentChrome
        badgeLabel={badgeLabel}
        title={title}
        editHref={editHref}
      />
      <article className="group min-w-0 space-y-10">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* Page header, open, no card wrapper */}
        <section id="overview" className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <nav aria-label="Breadcrumb" className="text-[13px] text-neutral-500 dark:text-neutral-400">
              <ol className="flex flex-wrap items-center gap-1">
                <li>
                  <Link
                    href="/"
                    className="transition-colors hover:text-foreground"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">
                  <CaretRight className="size-3 opacity-40" />
                </li>
                <li>
                  <Link
                    href="/docs/components"
                    className="transition-colors hover:text-foreground"
                  >
                    Components
                  </Link>
                </li>
                <li aria-hidden="true">
                  <CaretRight className="size-3 opacity-40" />
                </li>
                <li>
                  <Link
                    href={`/docs/components?category=${category.id}`}
                    className="transition-colors hover:text-foreground"
                  >
                    {category.title}
                  </Link>
                </li>
                <li aria-hidden="true">
                  <CaretRight className="size-3 opacity-40" />
                </li>
                <li aria-current="page" className="text-foreground">
                  {title}
                </li>
              </ol>
            </nav>
            {isPrimitiveComponent ? (
              <ImplementationToggle componentId={componentId as PrimitiveComponentId} implementation={resolvedImplementation} />
            ) : null}
          </div>

          {/* Title block */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="type-eyebrow inline-block">
                {badgeLabel}
              </span>
              {provenance ? <AdaptedBadge provenance={provenance} /> : null}
              {maturity === "beta" ? (
                <span className="inline-flex items-center rounded-full border border-amber-300/50 bg-amber-100/60 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-amber-700 dark:border-amber-400/35 dark:bg-amber-400/15 dark:text-amber-300">
                  beta
                </span>
              ) : null}
            </div>
            <h1 className="type-h1 mt-3 text-foreground">{title}</h1>
            <p className="type-lead mt-3">{description}</p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {effectivePrompt ? (
                <AiCopyMenu
                  componentId={componentId}
                  title={title}
                  getFullPrompt={getFullPrompt}
                  getMarkdown={effectiveMarkdown ? getMarkdown : undefined}
                  markdownUrl={markdownUrl}
                />
              ) : (
                <span aria-hidden="true" className="inline-flex h-8 w-[9.5rem] rounded-lg border border-border/60 bg-[var(--surface-1)] opacity-60" />
              )}
              <Link
                href={editHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border/60 bg-[var(--surface-1)] px-2.5 text-[12px] font-medium text-neutral-600 transition-[transform,opacity] duration-150 ease-[var(--ease-out)] hover:text-foreground active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 dark:text-neutral-300"
              >
                <PencilSimple className="size-3.5" aria-hidden="true" />
                Edit on GitHub
              </Link>
            </div>
          </div>

          {/* Separator */}
          <div className="h-px bg-[var(--line-soft)]" />
        </section>
        <ComponentDocContext.Provider value={docState}>{children}</ComponentDocContext.Provider>
        {showGeneratedApi ? <GeneratedApiReference componentId={componentId} /> : null}
        <RelatedComponents componentId={componentId} implementation={resolvedImplementation} />
        {isPrimitiveComponent ? (
          <ComponentPager component={componentId as PrimitiveComponentId} implementation={resolvedImplementation} />
        ) : null}
      </article>
      <DocsToc
        componentId={isPrimitiveComponent ? (componentId as PrimitiveComponentId) : undefined}
        implementation={resolvedImplementation}
      />
    </div>
  )
}
