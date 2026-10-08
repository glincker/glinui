"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import { CaretRight, MagnifyingGlass, X } from "@phosphor-icons/react"

import { cn } from "@glinui/ui"
import { newComponentIds, primitiveMaturity, type ComponentId } from "@/lib/primitives"
import { getCategories, getComponentsByCategory, getEntry, getTitle } from "@/lib/taxonomy"
import { buildComponentHref, getImplementationFromPath } from "@/lib/docs-route"

type DocsSidebarProps = {
  /** Mobile drawer open state. Ignored at lg and above, where the sidebar is static. */
  open: boolean
  onClose: () => void
  onOpenSearch: () => void
}

type NavTag = "beta" | "new"
type NavItem = { href: string; label: string; tag?: NavTag; member?: boolean }
type NavGroup = { id: string; title: string; items: NavItem[]; count?: number }

const gettingStartedItems: NavItem[] = [
  { href: "/docs", label: "Docs Overview" },
  { href: "/docs/getting-started", label: "Introduction" },
  { href: "/docs/directory", label: "Directory" },
  { href: "/docs/ai", label: "AI-ready docs", tag: "new" }
]

const accessibilityItems: NavItem[] = [
  { href: "/docs/accessibility", label: "Accessibility Hub" },
  { href: "/docs/forms-accessibility", label: "Forms Accessibility" },
  { href: "/docs/forms-recipes", label: "Form Recipes" },
  { href: "/docs/screen-reader-testing", label: "Screen Reader Testing" },
  { href: "/docs/focus-management", label: "Focus Management" },
  { href: "/docs/color-contrast", label: "Color Contrast" }
]

const designSystemItems: NavItem[] = [
  { href: "/docs/tokens", label: "Tokens" },
  { href: "/docs/variants", label: "Variants", tag: "new" },
  { href: "/docs/colors", label: "Colors", tag: "new" },
  { href: "/docs/animations", label: "Animations", tag: "new" },
  { href: "/docs/engines", label: "Animation engines", tag: "new" },
  { href: "/docs/glass-physics", label: "Glass Physics" },
  { href: "/docs/motion", label: "Motion" },
  { href: "/docs/api-metadata", label: "API Metadata" }
]

const aboutItems: NavItem[] = [
  { href: "/docs/attribution", label: "Attribution" },
  { href: "/docs/free-forever", label: "Free forever pledge" }
]

const compareItems: NavItem[] = [
  { href: "/docs/shadcn-alternative", label: "vs shadcn/ui" },
  { href: "/docs/magicui-alternative", label: "vs Magic UI" },
  { href: "/docs/radix-ui-components", label: "Radix UI Components" },
  { href: "/docs/glassmorphism-react-components", label: "Glassmorphism React" }
]

const newSet: ReadonlySet<string> = new Set(newComponentIds)

function componentItem(id: string, implementation: ReturnType<typeof getImplementationFromPath>): NavItem {
  const maturity = (primitiveMaturity as Record<string, string>)[id]
  const tag: NavTag | undefined = newSet.has(id) ? "new" : maturity === "beta" ? "beta" : undefined
  const entry = getEntry(id)
  return {
    href: buildComponentHref(id as ComponentId, implementation),
    label: getTitle(id),
    tag,
    member: Boolean(entry.family && !entry.base)
  }
}

function categoryGroups(implementation: ReturnType<typeof getImplementationFromPath>): NavGroup[] {
  return getCategories().map((category) => {
    const ids = getComponentsByCategory(category.id)
    return {
      id: `cat-${category.id}`,
      title: category.title,
      count: ids.length,
      items: ids.map((id) => componentItem(id, implementation))
    }
  })
}

const GROUPS_STORAGE_KEY = "glinui-sidebar-groups"

export function DocsSidebar({ open, onClose, onOpenSearch }: DocsSidebarProps) {
  const pathname = usePathname()
  const normalizedPathname = normalizePath(pathname)
  const implementation = getImplementationFromPath(pathname)
  const navRef = React.useRef<HTMLElement>(null)

  const groups = React.useMemo<NavGroup[]>(
    () => [
      { id: "getting-started", title: "Getting Started", items: gettingStartedItems },
      { id: "accessibility", title: "Accessibility", items: accessibilityItems },
      ...categoryGroups(implementation),
      { id: "design-system", title: "Design System", items: designSystemItems },
      { id: "compare", title: "Compare", items: compareItems },
      { id: "about", title: "About", items: aboutItems }
    ],
    [implementation]
  )

  const activeGroupId = groups.find((g) => g.items.some((i) => isPathActive(normalizedPathname, i.href)))?.id

  const [overrides, setOverrides] = React.useState<Record<string, boolean>>({})

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(GROUPS_STORAGE_KEY)
      if (raw) setOverrides(parseOverrides(raw))
    } catch {
      // storage unavailable
    }
  }, [])

  // Current group auto-opens when navigation lands in it.
  React.useEffect(() => {
    if (!activeGroupId) return
    setOverrides((prev) => (prev[activeGroupId] === true ? prev : { ...prev, [activeGroupId]: true }))
  }, [activeGroupId])

  const toggleGroup = React.useCallback((id: string, next: boolean) => {
    setOverrides((prev) => {
      const updated = { ...prev, [id]: next }
      try {
        localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(updated))
      } catch {
        // storage unavailable
      }
      return updated
    })
  }, [])

  // Keep the active row visible after navigation or group expansion.
  React.useEffect(() => {
    const raf = requestAnimationFrame(() => {
      navRef.current
        ?.querySelector<HTMLElement>('[data-active="true"]')
        ?.scrollIntoView({ block: "nearest" })
    })
    return () => cancelAnimationFrame(raf)
  }, [normalizedPathname, overrides])

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      ) : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-[var(--line-soft)] bg-[var(--surface-0)]",
          "transition-transform duration-200 ease-[var(--ease-out)] motion-reduce:transition-none",
          "lg:static lg:z-auto lg:w-64 lg:max-w-none lg:shrink-0 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-2 border-b border-[var(--line-soft)] p-3">
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-md border border-[var(--line-soft)] bg-[var(--surface-1)] px-2.5 text-[13px] text-neutral-500 transition-colors hover:bg-[var(--surface-2)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] dark:text-neutral-400"
          >
            <MagnifyingGlass className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="flex-1 truncate text-left">Search docs</span>
            <kbd className="rounded border border-[var(--line-soft)] px-1 font-mono text-[11px] font-normal">⌘K</kbd>
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-neutral-500 hover:bg-[var(--surface-2)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] lg:hidden"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <nav
          ref={navRef}
          aria-label="Documentation"
          className="flex-1 space-y-1 overflow-y-auto overscroll-contain px-2 py-3"
        >
          {groups.map((group) => (
            <SidebarGroup
              key={group.id}
              group={group}
              open={overrides[group.id] ?? group.id === activeGroupId}
              onToggle={(next) => toggleGroup(group.id, next)}
              pathname={normalizedPathname}
            />
          ))}
        </nav>
      </aside>
    </>
  )
}

function SidebarGroup({
  group,
  open,
  onToggle,
  pathname
}: {
  group: NavGroup
  open: boolean
  onToggle: (next: boolean) => void
  pathname: string
}) {
  const panelId = `sidebar-group-${group.id}`
  return (
    <section>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onToggle(!open)}
        className="group flex w-full items-center justify-between rounded-md px-2 py-1.5 type-eyebrow transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
      >
        <span>{group.title}</span>
        <span className="flex items-center gap-1.5">
          {group.count ? <span className="font-mono text-[10px] font-normal tabular-nums opacity-60">{group.count}</span> : null}
          <CaretRight
            className={cn(
              "size-3 transition-transform duration-150 ease-[var(--ease-out)] motion-reduce:transition-none",
              open && "rotate-90"
            )}
            aria-hidden="true"
          />
        </span>
      </button>
      <ul id={panelId} hidden={!open} className="mb-2 mt-0.5 space-y-px">
        {group.items.map((item) => (
          <li key={item.href} className={item.member ? "ml-3 border-l border-[var(--line-soft)]" : undefined}>
            <NavLink item={item} active={isPathActive(pathname, item.href)} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      data-active={active ? "true" : undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex w-full items-center gap-2 rounded-md py-1.5 pr-2 text-[13px] font-normal leading-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
        item.member ? "pl-2.5" : "pl-3",
        active
          ? "bg-[var(--surface-2)] font-medium text-foreground before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:rounded-full before:bg-[var(--color-accent)]"
          : "text-neutral-600 hover:bg-[var(--surface-1)] hover:text-foreground dark:text-neutral-400"
      )}
    >
      <span className="truncate">{item.label}</span>
      {item.tag ? (
        <span
          className={cn(
            "ml-auto shrink-0 font-mono text-[10px] font-medium uppercase tracking-[0.06em]",
            item.tag === "beta"
              ? "text-amber-700 dark:text-amber-300"
              : "text-[var(--color-accent)]"
          )}
        >
          {item.tag}
        </span>
      ) : null}
    </Link>
  )
}

// Helpers

function parseOverrides(raw: string): Record<string, boolean> {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== "object") return {}
    const out: Record<string, boolean> = {}
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "boolean") out[key] = value
    }
    return out
  } catch {
    return {}
  }
}

function normalizePath(path: string) {
  const normalized = path.replace(/\/+$/g, "")
  return normalized.length > 0 ? normalized : "/"
}

function isPathActive(pathname: string, href: string) {
  const target = normalizePath(href)
  if (pathname === target) return true
  if (target === "/docs") return false
  return pathname.startsWith(`${target}/`)
}
