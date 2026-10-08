"use client"

import * as React from "react"
import type { ReactNode } from "react"
import { getRegistryItem } from "@glinui/registry"

import { useComponentDocContext } from "@/components/docs/component-doc-context"
import { InlineCopyCommand } from "@/components/docs/inline-copy-command"
import { InstallSourceBlock } from "@/components/docs/install-source-block"
import type { InstallTabs } from "@/components/docs/install-tabs"
import { PreviewFrame, type StageSize } from "@/components/docs/preview-frame"
import type { ComponentId } from "@/lib/primitives"

type SourceFiles = React.ComponentProps<typeof InstallTabs>["sources"]

/** Hero preview for signature MDX pages. Registers its code so the layout action row works. */
export function ComponentHero({
  componentId,
  title,
  code,
  stage,
  children
}: {
  componentId: ComponentId
  title: string
  code: string
  stage?: StageSize
  children: ReactNode
}) {
  const ctx = useComponentDocContext()
  const registerHero = ctx?.registerHero
  React.useEffect(() => {
    registerHero?.({ code })
    return () => registerHero?.(null)
  }, [code, registerHero])

  const item = getRegistryItem(componentId)
  return (
    <section aria-label={`${title} preview`}>
      <PreviewFrame
        baseId={`${componentId}-hero`}
        code={code}
        stage={stage}
        componentId={componentId}
        installCommand={item?.install.registry ?? `pnpm dlx @glinui/cli@latest add ${componentId}`}
      >
        {children}
      </PreviewFrame>
    </section>
  )
}

/** Single install block: registry InstallTabs plus inline package command. */
export function ComponentInstall({
  componentId,
  sources
}: {
  componentId: ComponentId
  sources?: SourceFiles
}) {
  const item = getRegistryItem(componentId)
  const registryCommand = item?.install.registry ?? `pnpm dlx @glinui/cli@latest add ${componentId}`
  const packageCommand = item?.install.package ?? "pnpm add @glinui/ui @glinui/tokens"
  return (
    <div className="space-y-4">
      <InstallSourceBlock componentId={componentId} command={registryCommand} sources={sources} />
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Prefer the package? <InlineCopyCommand command={packageCommand} />
      </p>
    </div>
  )
}
