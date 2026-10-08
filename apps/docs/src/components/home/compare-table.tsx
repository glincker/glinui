import Link from "next/link"
import { ArrowRight, Check, Minus, X } from "@phosphor-icons/react/dist/ssr"

import { SECTION_CLASS, SectionHeading, Surface } from "./surface"

type Level = "yes" | "partial" | "no"
type Cell = { text: string; level: Level }

const y = (text: string): Cell => ({ text, level: "yes" })
const p = (text: string): Cell => ({ text, level: "partial" })
const n = (text: string): Cell => ({ text, level: "no" })

const ROWS: { label: string; glin: Cell; shadcn: Cell; magic: Cell }[] = [
  { label: "Ownership", glin: y("Copy the source or install the package"), shadcn: y("Copy the source through the CLI"), magic: y("Copy the source through the CLI") },
  { label: "Surface variants", glin: y("Default, glass, liquid, matte, glow on core components"), shadcn: n("One default style, extend it yourself"), magic: n("Not the focus") },
  { label: "Animations", glin: y("Free motion components with reduced motion handling"), shadcn: n("Minimal, bring your own"), magic: y("Large animated library, a core strength") },
  { label: "Colors and tokens", glin: y("OKLCH tokens for light and dark"), shadcn: y("CSS variable theming"), magic: p("Inherits your shadcn theme") },
  { label: "AI prompts", glin: y("Copy-for-AI prompt on every component page"), shadcn: y("MCP server and v0 integration"), magic: p("Works through the shadcn registry") },
  { label: "Accessibility", glin: y("Radix primitives, AA contrast, keyboard tested"), shadcn: y("Radix primitives"), magic: p("Varies by component") }
]

const LEVEL_LABEL: Record<Level, string> = { yes: "Yes", partial: "Partly", no: "No" }

function Mark({ level }: { level: Level }) {
  const Icon = level === "yes" ? Check : level === "partial" ? Minus : X
  const tone = level === "yes" ? "text-[var(--color-signal-ok)]" : "text-[var(--color-subtle)]"
  return (
    <>
      <Icon weight="bold" aria-hidden="true" className={`mt-0.5 size-4 shrink-0 ${tone}`} />
      <span className="sr-only">{LEVEL_LABEL[level]}: </span>
    </>
  )
}

function DataCell({ cell, className }: { cell: Cell; className: string }) {
  return (
    <td className={`min-w-[13rem] px-5 py-4 align-top ${className}`}>
      <span className="flex gap-2">
        <Mark level={cell.level} />
        <span>{cell.text}</span>
      </span>
    </td>
  )
}

const COMPARES = [
  { href: "/docs/shadcn-alternative", label: "Full comparison with shadcn/ui" },
  { href: "/docs/magicui-alternative", label: "Full comparison with Magic UI" }
]

export function CompareTable() {
  return (
    <section aria-labelledby="compare-title" className={SECTION_CLASS}>
      <SectionHeading
        id="compare-title"
        eyebrow="Compared honestly"
        title="Where GLINUI fits next to the tools you already know."
        lead="shadcn/ui set the standard for owning your components, and we build on the same Radix foundation. Here is where we differ."
      />

      <Surface className="mt-12 overflow-hidden">
        <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Comparison table, scrollable">
          <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
            <caption className="sr-only">Feature comparison of GLINUI, shadcn/ui and Magic UI</caption>
            <thead>
              <tr className="text-[var(--color-muted)]">
                <th scope="col" className="sticky left-0 top-0 z-20 bg-[var(--surface-2)] px-5 py-3.5 font-medium"><span className="sr-only">Feature</span></th>
                <th scope="col" className="sticky top-0 z-10 bg-[var(--surface-2)] px-5 py-3.5 font-semibold text-[var(--color-accent)]">GLINUI</th>
                <th scope="col" className="sticky top-0 z-10 bg-[var(--surface-2)] px-5 py-3.5 font-medium">shadcn/ui</th>
                <th scope="col" className="sticky top-0 z-10 bg-[var(--surface-2)] px-5 py-3.5 font-medium">Magic UI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line-soft)]">
              {ROWS.map((row) => (
                <tr key={row.label}>
                  <th scope="row" className="sticky left-0 z-10 whitespace-nowrap bg-[var(--surface-1)] px-5 py-4 text-left align-top font-medium text-[var(--color-foreground)] shadow-[1px_0_0_var(--line-soft)]">{row.label}</th>
                  <DataCell cell={row.glin} className="bg-[color-mix(in_oklab,var(--color-accent)_6%,var(--surface-1))] text-[var(--color-foreground)]" />
                  <DataCell cell={row.shadcn} className="text-[var(--color-muted)]" />
                  <DataCell cell={row.magic} className="text-[var(--color-muted)]" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Surface>

      <div className="mt-6 flex flex-col gap-3 text-sm font-medium sm:flex-row sm:gap-8">
        {COMPARES.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex min-h-11 w-fit items-center gap-1.5 rounded-md underline decoration-[var(--line-soft)] decoration-2 underline-offset-4 hover:decoration-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            {link.label} <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  )
}
