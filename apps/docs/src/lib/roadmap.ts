/**
 * Typed roadmap data for /roadmap. Statuses only, no dates are promised.
 * Facts here come from the repo: package versions, open pull requests and the taxonomy.
 */
export type RoadmapStatus = "now" | "next" | "later"

export type RoadmapItem = {
  id: string
  title: string
  summary: string
  status: RoadmapStatus
  /** Optional public link for the item (pull request, docs page). */
  href?: string
}

export const roadmapStatuses: ReadonlyArray<{ id: RoadmapStatus; label: string; description: string }> = [
  { id: "now", label: "Now", description: "In progress or in review." },
  { id: "next", label: "Next", description: "Planned once the current work lands." },
  { id: "later", label: "Later", description: "Wanted, not scheduled. May change or drop." }
]

export const roadmapItems: readonly RoadmapItem[] = [
  {
    id: "v2-release",
    title: "Version 2 release",
    summary: "Design hub repositioning, token-first styling, the glinr variant system and the new docs site.",
    status: "now"
  },
  {
    id: "tailwind4-entry",
    title: "Tailwind 4 entry and precompiled CSS",
    summary: "A namespaced Tailwind 4 theme for tokens plus a precompiled styles.css for consumers without Tailwind.",
    status: "now",
    href: "https://github.com/GLINCKER/glinui/pull/12"
  },
  {
    id: "blog",
    title: "Blog and release notes",
    summary: "Long-form posts, an RSS feed and a changelog page rendered from each package.",
    status: "now",
    href: "/blog"
  },
  {
    id: "base-ui-question",
    title: "Base UI or Radix adapter question",
    summary: "Decide whether consumers that avoid Radix, such as icon-library sites, need a thinner adapter layer.",
    status: "next"
  },
  {
    id: "drawer",
    title: "Drawer and bottom sheet",
    summary: "A touch-first sheet with drag to dismiss, focus management and reduced motion support.",
    status: "next"
  },
  {
    id: "chart-kit",
    title: "Chart kit",
    summary: "Token-driven charts that follow the base color and variant system.",
    status: "next"
  },
  {
    id: "app-shell-blocks",
    title: "App shell blocks",
    summary: "Sidebar, topbar and settings layouts next to the existing marketing blocks.",
    status: "next",
    href: "/docs/blocks"
  },
  {
    id: "visual-regression",
    title: "Visual regression checks",
    summary: "Automated screenshots per variant, theme and base color so style drift is caught in review.",
    status: "next"
  },
  {
    id: "tailwind4-docs",
    title: "Tailwind 4 for the docs app",
    summary: "Move this site itself to Tailwind 4 once the consumer entry has settled.",
    status: "later"
  },
  {
    id: "more-ports",
    title: "More adapted ports",
    summary: "Additional components from MIT, Apache-2.0, BSD or ISC sources only, each with attribution and provenance.",
    status: "later",
    href: "/docs/attribution"
  }
]

export function itemsByStatus(status: RoadmapStatus): RoadmapItem[] {
  return roadmapItems.filter((item) => item.status === status)
}
