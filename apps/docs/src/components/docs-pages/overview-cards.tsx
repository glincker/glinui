import Link from "next/link"
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr"

import { Badge, Button } from "@glinui/ui"

type EntryCard = {
  href: string
  title: string
  description: string
  visual: React.ReactNode
}

const visualFrame =
  "flex h-24 items-center justify-center gap-2 rounded-input bg-surface-well px-3 shadow-elev-inset"

const entryCards: EntryCard[] = [
  {
    href: "/docs/getting-started",
    title: "Getting started",
    description: "Install the package, import tokens, add the Tailwind preset, ship a component.",
    visual: (
      <code className="rounded-md bg-surface-1 px-2.5 py-1.5 font-mono text-[12px] text-foreground shadow-elev-1">
        npm i @glinui/ui
      </code>
    )
  },
  {
    href: "/docs/components",
    title: "Components",
    description: "Primitives and signature surfaces with props tables and copy-paste source.",
    visual: (
      <>
        <Button size="sm" tabIndex={-1}>
          Button
        </Button>
        <Badge>Badge</Badge>
      </>
    )
  },
  {
    href: "/docs/animations",
    title: "Animations",
    description: "Animated backgrounds, text effects, and borders. Hover to play, copy an AI prompt.",
    visual: (
      <>
        <span className="size-3 rounded-full bg-brand motion-safe:animate-pulse" />
        <span className="size-3 rounded-full bg-brand/60 motion-safe:animate-pulse motion-safe:[animation-delay:150ms]" />
        <span className="size-3 rounded-full bg-brand/30 motion-safe:animate-pulse motion-safe:[animation-delay:300ms]" />
      </>
    )
  },
  {
    href: "/docs/colors",
    title: "Colors",
    description: "OKLCH accent, surface scale, and signal colors with contrast checks and export.",
    visual: (
      <>
        <span className="size-7 rounded-md bg-brand shadow-elev-1" />
        <span className="size-7 rounded-md bg-surface-3 shadow-elev-1" />
        <span className="size-7 rounded-md bg-surface-2 shadow-elev-1" />
        <span className="size-7 rounded-md bg-signal-live shadow-elev-1" />
        <span className="size-7 rounded-md bg-signal-ok shadow-elev-1" />
      </>
    )
  },
  {
    href: "/docs/tokens",
    title: "Tokens",
    description: "Surfaces, elevation, type, radius, layout, and motion as CSS variables.",
    visual: (
      <>
        <span className="size-10 rounded-card bg-surface-1 shadow-elev-1" />
        <span className="size-10 rounded-card bg-surface-1 shadow-elev-2" />
        <span className="size-10 rounded-card bg-surface-1 shadow-elev-3" />
      </>
    )
  },
  {
    href: "/docs/accessibility",
    title: "Accessibility",
    description: "Forms, focus, screen reader, and contrast guidance used in release checks.",
    visual: (
      <span className="rounded-input bg-surface-1 px-3 py-1.5 text-xs font-medium text-foreground shadow-elev-1 ring-2 ring-brand ring-offset-2 ring-offset-surface-well">
        Focus ring
      </span>
    )
  }
]

/** Six flat entry cards, each with a small live visual. */
export function OverviewCards() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {entryCards.map((card) => (
        <li key={card.href}>
          <Link
            href={card.href}
            className="group flex h-full flex-col gap-4 rounded-card border border-line-soft bg-surface-1 p-4 shadow-elev-1 transition-shadow hover:shadow-elev-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand motion-reduce:transition-none"
          >
            <div aria-hidden="true" className={visualFrame}>
              {card.visual}
            </div>
            <div className="space-y-1">
              <h3 className="type-h3 flex items-center gap-1.5 text-[1.0625rem]">
                {card.title}
                <ArrowUpRight
                  className="size-4 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </h3>
              <p className="text-sm leading-relaxed text-muted">{card.description}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
