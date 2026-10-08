"use client"

import Link from "next/link"
import { getRegistryItem } from "@glinui/registry"
import { Tree, buildFileTree } from "@glinui/ui"

import { ComponentDocLayout } from "@/components/docs/component-doc-layout"
import { ExampleBlock } from "@/components/docs/example-block"
import { InstallSourceBlock } from "@/components/docs/install-source-block"
import { InlineCopyCommand } from "@/components/docs/inline-copy-command"
import { PreviewFrame } from "@/components/docs/preview-frame"
import { PropsTable } from "@/components/docs/props-table"
import { buildAiPrompt, buildComponentMarkdown, buildMarkdownUrl } from "@/lib/ai-prompt"
import { allComponentDocs as componentDocs } from "@/lib/component-docs-all"
import type { PropsGroup } from "@/lib/component-docs"
import { getComponentDocExtra } from "@/lib/component-docs-extra"
import { SITE_URL } from "@/lib/seo"
import { type DocsImplementation } from "@/lib/docs-route"
import {
  primitiveDescriptions,
  primitiveTitles,
  type PrimitiveComponentId
} from "@/lib/primitives"

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")
}

function isPropsGroups(props: unknown): props is PropsGroup[] {
  return Array.isArray(props) && props.length > 0 && "title" in (props[0] as Record<string, unknown>)
}

export function ComponentDocPage({
  componentId,
  implementation
}: {
  componentId: PrimitiveComponentId
  implementation: DocsImplementation
}) {
  const meta = componentDocs[componentId]
  const extra = getComponentDocExtra(componentId)
  const item = getRegistryItem(componentId)
  const title = primitiveTitles[componentId]
  const description = item?.description ?? primitiveDescriptions[componentId]

  const registryCommand = item?.install.registry ?? `pnpm dlx @glinui/cli@latest add ${componentId}`
  const packageCommand = item?.install.package ?? "pnpm add @glinui/ui @glinui/tokens"
  const importPath = item?.importPath ?? "@glinui/ui"
  const [hero, ...rest] = meta.examples
  const provenance = item?.provenance ?? null
  const notes = [...(extra.notes ?? []), ...(meta.notes ?? [])].filter(
    (note, index, all) => all.indexOf(note) === index && !(provenance && /^Adapted from /.test(note))
  )
  const promptInput = {
    title,
    id: componentId,
    registryCommand,
    packageCommand,
    importPath,
    exampleCode: hero?.code ?? "",
    markdownUrl: buildMarkdownUrl(componentId, SITE_URL)
  }
  const promptText = buildAiPrompt(promptInput)
  const markdownText = buildComponentMarkdown({ ...promptInput, description })

  return (
    <ComponentDocLayout
      promptText={promptText}
      markdownText={markdownText}
      badgeLabel={meta.badge}
      componentId={componentId}
      implementation={implementation}
      title={title}
      description={description}
    >
      {/* Hero preview */}
      {hero ? (
        <section aria-label={`${title} preview`}>
          <PreviewFrame
            baseId={`${componentId}-hero`}
            code={hero.code}
            installCommand={registryCommand}
            componentId={componentId}
            badge={meta.badge}
          >
            {hero.render}
          </PreviewFrame>
        </section>
      ) : null}

      {/* Installation */}
      <section className="space-y-4">
        <h2 id="installation" className="type-section text-foreground">Installation</h2>
        <InstallSourceBlock componentId={componentId} command={registryCommand} />
        {provenance ? (
          <p className="type-body text-[var(--color-muted)]" data-testid="credits-note">
            <strong className="font-medium text-foreground">Credits.</strong> Adapted from{" "}
            <a
              href={provenance.upstreamComponentUrl ?? provenance.upstreamUrl}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              {provenance.sourceName}
            </a>{" "}
            ({provenance.license}, {provenance.copyright.replace(/^Copyright \(c\) /, "(c) ")}).{" "}
            {provenance.changes ? `${provenance.changes} ` : ""}
            <Link href="/docs/attribution" className="underline underline-offset-2 hover:text-foreground">
              Attribution details
            </Link>
            .
          </p>
        ) : null}
        <p className="type-body text-[var(--color-muted)]">
          Prefer the package? <InlineCopyCommand command={packageCommand} />
        </p>
      </section>

      {/* Usage */}
      <section className="space-y-6">
        <h2 id="usage" className="type-section text-foreground">Usage</h2>
        {notes.map((note) => (
          <p key={note} className="type-body rounded-lg border border-border/60 bg-white/30 px-4 py-3 text-[var(--color-muted)] dark:bg-white/[0.02]">
            {note}
          </p>
        ))}
        {hero && rest.length === 0 ? (
          <p className="type-body text-[var(--color-muted)]">
            {hero.description ?? `Import ${title} from ${importPath} and compose it as shown in the preview above.`}
          </p>
        ) : null}
        {rest.map((example) => (
          <div key={example.title} className="space-y-2">
            <h3 id={slugify(example.title)} className="text-base font-medium text-foreground">{example.title}</h3>
            {example.description && (
              <p className="type-body text-[var(--color-muted)]">{example.description}</p>
            )}
            <ExampleBlock code={example.code}>{example.render}</ExampleBlock>
          </div>
        ))}
        {extra.examples?.map((example) => (
          <div key={example.title} className="space-y-2">
            <h3 id={slugify(example.title)} className="text-base font-medium text-foreground">{example.title}</h3>
            {example.description && (
              <p className="type-body text-[var(--color-muted)]">{example.description}</p>
            )}
            {example.code ? (
              <pre className="overflow-x-auto rounded-lg border border-border/60 bg-white/30 px-4 py-3 text-sm dark:bg-white/[0.02]">
                <code>{example.code}</code>
              </pre>
            ) : null}
          </div>
        ))}
      </section>

      {/* ── Accessibility ────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 id="accessibility" className="type-section text-foreground">Accessibility</h2>
        <ul className="type-body list-disc space-y-1.5 pl-5 text-[var(--color-muted)]">
          {[...meta.accessibility.summary, ...(extra.accessibility ?? [])].map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>

        {meta.accessibility.keyboard && meta.accessibility.keyboard.length > 0 && (
          <div className="space-y-2">
            <h3 id="keyboard-interactions" className="text-base font-medium text-foreground">Keyboard Interactions</h3>
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="min-w-full border-collapse text-left text-[13px] leading-6 tabular-nums">
                <thead className="bg-black/5 dark:bg-white/5">
                  <tr>
                    <th scope="col" className="type-eyebrow px-3 py-2.5">Key</th>
                    <th scope="col" className="type-eyebrow px-3 py-2.5">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {meta.accessibility.keyboard.map((row) => (
                    <tr key={row.key} className="border-t border-border/60">
                      <td className="px-3 py-2">
                        <kbd className="rounded border border-border/80 bg-neutral-100 px-1.5 py-0.5 font-mono text-[11px] dark:bg-white/[0.06]">{row.key}</kbd>
                      </td>
                      <td className="px-3 py-2 text-[var(--color-muted)]">{row.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {meta.accessibility.aria && meta.accessibility.aria.length > 0 && (
          <div className="space-y-2">
            <h3 id="aria-attributes" className="text-base font-medium text-foreground">ARIA Attributes</h3>
            <ul className="type-body list-disc space-y-1.5 pl-5 text-[var(--color-muted)]">
              {meta.accessibility.aria.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* ── Reduced Motion ───────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 id="reduced-motion" className="type-section text-foreground">Reduced Motion</h2>
        <p className="type-body text-[var(--color-muted)]">{meta.reducedMotion.description}</p>
        {extra.reducedMotion ? (
          <p className="type-body text-[var(--color-muted)]">{extra.reducedMotion}</p>
        ) : null}
        {meta.reducedMotion.affected && meta.reducedMotion.affected.length > 0 && (
          <div className="space-y-1">
            <p className="type-eyebrow">Affected properties</p>
            <div className="flex flex-wrap gap-1.5">
              {meta.reducedMotion.affected.map((prop) => (
                <code key={prop} className="rounded border border-border/60 bg-neutral-100/50 px-1.5 py-0.5 text-xs dark:bg-white/[0.04]">{prop}</code>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── API Reference ────────────────────────────────────────────── */}
      <section className="space-y-5">
        <h2 id="api-reference" className="type-section text-foreground">API Reference</h2>
        {isPropsGroups(meta.props) ? (
          meta.props.map((group) => (
            <div key={group.title} className="space-y-2">
              <h3 id={slugify(group.title)} className="text-base font-medium text-foreground">
                <code>{group.title}</code>
              </h3>
              <PropsTable
                rows={group.rows}
                componentId={componentId}
                propsType={group.title}
                autoAppendGenerated
              />
            </div>
          ))
        ) : (
          <PropsTable rows={meta.props} componentId={componentId} autoAppendGenerated />
        )}
      </section>

      {/* ── Source ────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 id="source" className="type-section text-foreground">Source</h2>
        <p className="type-body text-[var(--color-muted)]">
          Import directly from the package or browse the source on GitHub. Click any file to view it.
        </p>

        <div className="space-y-3">
          <div className="space-y-1">
            <p className="type-eyebrow">Import</p>
            <pre className="rounded-lg border border-border/60 bg-white/30 px-4 py-3 text-sm dark:bg-white/[0.02]">
              <code>{`import { ${title.replace(/\s*\/\s*/g, ", ").replace(/\s+/g, "")} } from "${importPath}"`}</code>
            </pre>
          </div>

          {item?.files && item.files.length > 0 && (() => {
            const sourceFiles = item.files.filter((f) => !f.includes("test"))
            const testFiles = item.files.filter((f) => f.includes("test"))
            const treeNodes = [
              ...(sourceFiles.length > 0
                ? [{
                    label: title,
                    children: sourceFiles.map((f) => ({
                      label: f.split("/").pop() ?? f,
                      href: `https://github.com/GLINCKER/glinui/blob/main/${f}`,
                      external: true
                    }))
                  }]
                : []),
              ...(testFiles.length > 0
                ? [{
                    label: "Tests",
                    children: testFiles.map((f) => ({
                      label: f.split("/").pop() ?? f,
                      href: `https://github.com/GLINCKER/glinui/blob/main/${f}`,
                      external: true,
                      badge: "test" as const,
                      badgeVariant: "success" as const
                    }))
                  }]
                : [])
            ]
            return (
              <div className="space-y-1.5">
                <p className="type-eyebrow">Source Files</p>
                <Tree variant="outline" nodes={treeNodes} />
              </div>
            )
          })()}

          {item?.dependencies && item.dependencies.length > 0 && (
            <div className="space-y-1.5">
              <p className="type-eyebrow">Dependencies</p>
              <div className="flex flex-wrap gap-1.5">
                {item.dependencies.map((dep) => (
                  <code key={dep} className="rounded border border-border/60 bg-neutral-100/50 px-2 py-0.5 text-xs dark:bg-white/[0.04]">{dep}</code>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </ComponentDocLayout>
  )
}
