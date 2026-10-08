import type { Metadata } from "next"
import Link from "next/link"

import { AiMenuPreview } from "@/components/ai/ai-menu-preview"
import { AiRulesSnippet } from "@/components/ai/ai-rules-snippet"
import { AiTargetsGrid } from "@/components/ai/ai-targets-grid"
import { Callout } from "@/components/docs-pages-b/callout"
import { PageHeader } from "@/components/docs-pages-b/page-header"
import { PageSection } from "@/components/docs-pages-b/page-section"
import { createDocsMetadata } from "@/lib/docs-metadata"

export const metadata: Metadata = createDocsMetadata({
  title: "AI-ready docs",
  description:
    "Copy for AI, Open in menus, per-component Markdown, llms.txt and project rules so ChatGPT, Claude, Cursor, Copilot and other assistants use Glin UI correctly.",
  path: "/docs/ai",
  keywords: ["llms.txt", "AI component library", "Cursor rules", "shadcn registry MCP", "Copy for AI"]
})

const code = "rounded bg-surface-2 px-1 font-mono text-[0.85em]"
const block = "overflow-x-auto rounded-card border border-line-soft bg-surface-1 p-4 font-mono text-xs leading-relaxed"

export default function AiDocsPage() {
  return (
    <main className="space-y-12">
      <PageHeader
        eyebrow="AI"
        title="AI-ready docs"
        lead="Every component page has a Copy for AI button. It hands an assistant the install command, import, a working example and our conventions, so the code it writes matches the rest of your app."
      />

      <PageSection
        id="copy-for-ai"
        title="Copy for AI and Open in"
        description="The main button copies the full prompt. The chevron opens a menu to copy it as Markdown, read exactly what is copied, or open it in a tool. Try it here."
      >
        <AiMenuPreview />
        <Callout variant="note" title="What each target does">
          <p>
            Prefilled targets open a new tab with a short prompt that links to the component&apos;s Markdown page. Targets
            marked copies prompt have no documented prefill link, so we copy the full prompt and open the tool for you to paste.
            If a prefilled link is too long for the tool, we fall back to copying.
          </p>
        </Callout>
      </PageSection>

      <PageSection id="tools" title="Supported tools" description="Logos belong to their owners and are shown for compatibility.">
        <AiTargetsGrid />
      </PageSection>

      <PageSection
        id="markdown"
        title="Markdown for every component"
        description="Each component has a plain Markdown page with install commands, import, usage, props, accessibility and attribution."
      >
        <pre className={block}>
          <code>{"https://glinui.com/md/<id>.md\nhttps://glinui.com/md/button.md"}</code>
        </pre>
        <p className="type-body max-w-[68ch] text-muted">
          For the whole library, point an assistant at <Link className="underline" href="/llms.txt">llms.txt</Link>{" "}
          (an index of every Markdown page by category) or <Link className="underline" href="/llms-full.txt">llms-full.txt</Link>{" "}
          (every page in one file, a few hundred KB, so prefer the index for small context windows).
        </p>
      </PageSection>

      <PageSection
        id="registry"
        title="Shadcn registry and MCP"
        description="Glin UI components are served as shadcn registry items, so the shadcn CLI and its MCP server can install them."
      >
        <pre className={block}>
          <code>{"npx shadcn@latest add https://glinui.com/r/button.json"}</code>
        </pre>
        <p className="type-body max-w-[68ch] text-muted">
          To let an assistant browse and install by name, add a namespaced registry to <code className={code}>components.json</code>{" "}
          and run <code className={code}>pnpm dlx shadcn@latest mcp init --client claude</code> (see the{" "}
          <a className="underline" href="https://ui.shadcn.com/docs/mcp" rel="noopener noreferrer" target="_blank">shadcn MCP docs</a>{" "}
          for other clients).
        </p>
        <pre className={block}>
          <code>{'{\n  "registries": {\n    "@glinui": "https://glinui.com/r/{name}.json"\n  }\n}'}</code>
        </pre>
      </PageSection>

      <PageSection
        id="rules"
        title="Project rules"
        description="Paste this into AGENTS.md, CLAUDE.md or .cursor/rules so assistants follow Glin UI conventions in every request, not only when you use the button."
      >
        <AiRulesSnippet />
      </PageSection>

      <Callout variant="warning" title="Deep links change">
        <p>
          AI tools change their URLs without notice. We only mark a link verified when the vendor documents it (Cursor and GitHub
          Copilot today). Community-documented links also copy the prompt, so nothing is lost if a tool ignores the prefill.
          Deep links carry only a short prompt and a public Markdown URL, never your code or any personal data.
        </p>
      </Callout>
    </main>
  )
}
