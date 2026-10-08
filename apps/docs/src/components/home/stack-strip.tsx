import { BrandIcon } from "@/components/brand/brand-icon"
import { BRANDS, BRAND_FOOTNOTE, type BrandName } from "@/components/brand/brands"

type Group = {
  id: string
  heading: string
  items: Array<{ name: BrandName; label?: string }>
}

const GROUPS: Group[] = [
  {
    id: "built-on",
    heading: "Built on open standards",
    items: [
      { name: "radix-ui" },
      { name: "tailwindcss" },
      { name: "react", label: "React 19" },
      { name: "nextjs" },
      { name: "typescript" },
      { name: "motion" }
    ]
  },
  {
    id: "works-with",
    heading: "Works with",
    items: [{ name: "nextjs" }, { name: "vite" }, { name: "remix" }, { name: "astro" }, { name: "tanstack" }]
  },
  {
    id: "copy-for-ai",
    heading: "Copy for AI, paste anywhere",
    items: [
      { name: "claude" },
      { name: "openai" },
      { name: "cursor" },
      { name: "v0" },
      { name: "github-copilot", label: "Copilot" },
      { name: "windsurf" }
    ]
  }
]

function BrandItem({ name, label }: { name: BrandName; label?: string }) {
  return (
    <li className="group/brand flex items-center gap-2 text-[14px] font-medium text-[var(--color-subtle)] transition-colors duration-200 hover:text-[var(--color-foreground)] motion-reduce:transition-none">
      <BrandIcon name={name} size={20} reveal />
      {label ?? BRANDS[name].label}
    </li>
  )
}

export function StackStrip() {
  return (
    <section aria-label="Stack and compatibility" className="mx-auto w-full max-w-[1200px] border-y border-[var(--line-soft)] py-8">
      <div className="space-y-6">
        {GROUPS.map((group) => (
          <div
            key={group.id}
            className="flex flex-col items-start gap-3 md:grid md:grid-cols-[13rem_minmax(0,1fr)] md:items-center md:gap-6"
          >
            <p id={`${group.id}-heading`} className="type-eyebrow">
              {group.heading}
            </p>
            <ul aria-labelledby={`${group.id}-heading`} className="flex flex-wrap items-center gap-x-6 gap-y-3 md:gap-x-8">
              {group.items.map((item) => (
                <BrandItem key={`${group.id}-${item.name}`} {...item} />
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs text-[var(--color-subtle)]">{BRAND_FOOTNOTE}</p>
    </section>
  )
}
