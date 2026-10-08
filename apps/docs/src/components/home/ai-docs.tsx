"use client"

import Link from "next/link"
import { ArrowRight, Copy, FileText, Eye, ArrowSquareOut } from "@phosphor-icons/react"

import { AiMenuPreview } from "@/components/ai/ai-menu-preview"
import { BrandIcon } from "@/components/brand/brand-icon"
import { AI_TARGETS, aiTargetHint } from "@/lib/ai-targets"

import { SECTION_CLASS, SectionHeading, Surface } from "./surface"

const POINTS = [
  { title: "One click.", text: "Copy for AI puts a prompt on your clipboard with the install path, the import and our token rules attached." },
  { title: "Or hand it off.", text: "Open the component in your assistant of choice with a short prompt that links to its Markdown page." },
  { title: "Always current.", text: "Every component has a plain Markdown page, plus llms.txt and llms-full.txt for whole-library context." }
]

const MENU_ACTIONS = [
  { label: "Copy prompt", Icon: Copy },
  { label: "Copy as Markdown", Icon: FileText },
  { label: "View as Markdown", Icon: ArrowSquareOut },
  { label: "View prompt", Icon: Eye }
]

const TOOLS = AI_TARGETS.filter((target) => target.openUrl !== null).slice(0, 6)

/** Static illustration of the open tool menu; the live split button above it is the real component. */
function MenuIllustration() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none w-full max-w-[18rem] select-none rounded-xl border border-[var(--line-soft)] bg-[var(--surface-2)] p-1.5 [box-shadow:var(--elev-3)]"
    >
      {MENU_ACTIONS.map(({ label, Icon }) => (
        <div key={label} className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-[var(--color-foreground)]">
          <Icon className="size-4" />
          {label}
        </div>
      ))}
      <div className="my-1 h-px bg-[var(--line-soft)]" />
      <p className="px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-muted)]">Open in</p>
      {TOOLS.map((target) => (
        <div key={target.id} className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-[var(--color-foreground)]">
          {target.brandSlug ? <BrandIcon name={target.brandSlug} size={16} variant="mono" /> : <span className="size-4" />}
          {target.label}
          <span className="ml-auto pl-3 text-[11px] text-[var(--color-muted)]">{aiTargetHint(target)}</span>
        </div>
      ))}
    </div>
  )
}

export function AiDocs() {
  return (
    <section aria-labelledby="ai-title" className={SECTION_CLASS}>
      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="space-y-10">
          <SectionHeading
            id="ai-title"
            eyebrow="AI-native docs"
            title="Every page speaks to people and to your assistant."
            lead="Stop pasting half a component into a chat. Copy a prompt that already knows the install path, the import and the rules."
          />
          <ol className="space-y-5">
            {POINTS.map((point, index) => (
              <li key={point.title} className="flex gap-4">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--surface-3)] font-mono text-[11px] text-[var(--color-foreground)] [box-shadow:var(--elev-1)]">
                  {index + 1}
                </span>
                <p className="text-[15px] leading-relaxed text-[var(--color-muted)]">
                  <strong className="font-semibold text-[var(--color-foreground)]">{point.title} </strong>
                  {point.text}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <Surface elevation={3} className="min-w-0 overflow-hidden">
          <div className="bg-[var(--surface-2)] p-6 sm:p-10">
            <div className="mx-auto flex w-full max-w-[18rem] flex-col items-end gap-2">
              <AiMenuPreview bare />
              <MenuIllustration />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line-soft)] px-6 py-4">
            <p className="text-sm text-[var(--color-muted)]">Works with Claude, ChatGPT, Codex, Gemini, Grok, Cursor and more</p>
            <Link
              href="/docs/ai"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-foreground)] underline-offset-4 hover:underline"
            >
              AI-ready docs
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </Surface>
      </div>
    </section>
  )
}
