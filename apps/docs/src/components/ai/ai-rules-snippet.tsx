"use client"

import { Check, Copy } from "@phosphor-icons/react"
import { Button } from "@glinui/ui"

import { useCopyToClipboard } from "./use-copy-to-clipboard"

export const AI_PROJECT_RULES = `# GLINUI conventions

This project uses GLINUI (https://glinui.com). When you add or change UI:

## Components
- Prefer an existing GLINUI component over writing a new one. Index: https://glinui.com/llms.txt
- Per component docs: https://glinui.com/md/<id>.md (for example /md/button.md).
- Install with: npx shadcn@latest add https://glinui.com/r/<id>.json
- Ask before editing files you did not create.

## Styling
- Use tokens from @glinui/tokens (var(--color-border), var(--color-accent), var(--surface-1)). Never hardcode colors.
- Tailwind utility classes only. No inline style attributes.
- Variant vocabulary: solid, soft, outline, ghost, gradient, glass. Do not invent new names.

## Icons
- Phosphor only (@phosphor-icons/react). No other icon sets.

## Motion
- Animate transform and opacity only.
- Honor prefers-reduced-motion: provide a static fallback.

## Accessibility
- Every control is keyboard operable with a visible focus ring.
- Icon-only buttons get an aria-label. Inputs get a visible or sr-only label.
- Keep text contrast at WCAG AA or better, including on glass surfaces.
`

export function AiRulesSnippet() {
  const { copied, copy } = useCopyToClipboard()
  return (
    <div className="overflow-hidden rounded-card border border-line-soft bg-surface-1">
      <div className="flex items-center justify-between gap-3 border-b border-line-soft px-4 py-2">
        <p className="font-mono text-xs text-muted">AGENTS.md, CLAUDE.md or .cursor/rules/glinui.mdc</p>
        <Button type="button" size="sm" variant="secondary" onClick={() => void copy(AI_PROJECT_RULES)}>
          {copied ? <Check className="size-4" weight="bold" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
          {copied ? "Copied" : "Copy rules"}
        </Button>
      </div>
      <pre tabIndex={0} aria-label="Project rules snippet" className="max-h-96 overflow-auto p-4 font-mono text-xs leading-relaxed text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]">
        <code>{AI_PROJECT_RULES}</code>
      </pre>
    </div>
  )
}
