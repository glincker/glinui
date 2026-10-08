"use client"

import { buildAiPrompt } from "@/lib/ai-prompt"
import { AiCopyMenu } from "./ai-copy-menu"
import { useMarkdownUrl } from "./use-markdown-url"

const SAMPLE = {
  id: "button",
  title: "Button",
  importPath: "@glinui/ui",
  exampleCode: 'import { Button } from "@glinui/ui"\n\nexport function Demo() {\n  return <Button variant="glass">Save</Button>\n}'
}

/** Live demo of AiCopyMenu for the docs, using Button as the sample component. */
export function AiMenuPreview({ markdownUrl, bare = false }: { markdownUrl?: string; bare?: boolean }) {
  const { markdownUrl: localUrl } = useMarkdownUrl(SAMPLE.id)
  const url = markdownUrl ?? localUrl
  const getFullPrompt = () =>
    buildAiPrompt({
      title: SAMPLE.title,
      id: SAMPLE.id,
      registryCommand: `pnpm dlx @glinui/cli@latest add ${SAMPLE.id}`,
      packageCommand: "npm install @glinui/ui @glinui/tokens",
      importPath: SAMPLE.importPath,
      exampleCode: SAMPLE.exampleCode,
      markdownUrl: url
    })
  const menu = <AiCopyMenu componentId={SAMPLE.id} title={SAMPLE.title} getFullPrompt={getFullPrompt} markdownUrl={url} />
  if (bare) return menu
  return <div className="flex min-h-[7.5rem] items-start rounded-card border border-line-soft bg-surface-1 p-6">{menu}</div>
}
