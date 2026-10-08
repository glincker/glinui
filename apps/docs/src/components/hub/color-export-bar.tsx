"use client"

import { Check, FileCss, Sparkle, Wind } from "@phosphor-icons/react"

import { useCopy } from "@/components/docs/preview-frame"
import { allColorTokens } from "@/components/hub/color-tokens"
import { declarationBlock, type ThemeSheets, type TokenMap } from "@/components/hub/use-theme-tokens"

const names = allColorTokens.map((t) => t.name)

function buildThemeCss(sheets: ThemeSheets | null, live: TokenMap, base: string): string {
  const light = sheets && Object.keys(sheets.light).length > 0 ? sheets.light : live
  const dark = sheets?.dark ?? {}
  const note = base === "obsidian" ? "" : `/* Base color: ${base}. Scope it with data-glin-base=\"${base}\" (bases.css) or paste these values. */\n`
  return `${note}${declarationBlock(":root", light, names)}\n\n${declarationBlock(".dark", dark, names)}\n`
}

function buildTailwindConfig(): string {
  const entries = allColorTokens
    .map((t) => `        "${t.name.replace(/^--(color-)?/, "")}": "var(${t.name})"`)
    .join(",\n")
  return `// tailwind.config.ts\nexport default {\n  theme: {\n    extend: {\n      colors: {\n${entries}\n      }\n    }\n  }\n}\n`
}

function buildPrompt(css: string): string {
  return [
    "Use the Glin UI color system in my project.",
    "",
    "Add these CSS variables (light on :root, dark on .dark):",
    "```css",
    css.trim(),
    "```",
    "",
    "Rules:",
    "- Reference colors only through variables, for example bg-[var(--surface-1)] or text-[var(--color-foreground)].",
    "- Use the surface scale (0 to 3, plus well) for stacking, accent for actions and focus rings.",
    "- Keep text at 4.5:1 contrast or better (WCAG AA) in both themes.",
    "- No inline style attributes. Tailwind classes only."
  ].join("\n")
}

function ExportButton({ label, text, icon: Icon }: { label: string; text: string; icon: typeof Check }) {
  const { copied, copy } = useCopy(text)
  const Shown = copied ? Check : Icon
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--surface-1)] px-3 text-[13px] font-medium text-foreground [box-shadow:var(--elev-1)] ring-1 ring-[var(--line-soft)] transition-[transform,opacity] duration-150 ease-[var(--ease-out)] hover:[box-shadow:var(--elev-2)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] motion-reduce:transition-none motion-reduce:active:scale-100"
    >
      <Shown className="size-4 text-[var(--color-accent)]" aria-hidden="true" />
      {copied ? "Copied" : label}
    </button>
  )
}

export function ColorExportBar({ sheets, live, base = "obsidian" }: { sheets: ThemeSheets | null; live: TokenMap; base?: string }) {
  const css = buildThemeCss(sheets, live, base)
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Export theme">
      <ExportButton label="Copy theme as CSS" text={css} icon={FileCss} />
      <ExportButton label="Copy as Tailwind config" text={buildTailwindConfig()} icon={Wind} />
      <ExportButton label="Copy as AI prompt" text={buildPrompt(css)} icon={Sparkle} />
    </div>
  )
}
