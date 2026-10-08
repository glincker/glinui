"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { ArrowDown, ArrowUp, ArrowElbowDownLeft, MagnifyingGlass } from "@phosphor-icons/react"

import { cn } from "@glinui/ui"
import { getCategories, getComponentsByCategory, getEntry, getTitle } from "@/lib/taxonomy"
import type { ComponentId } from "@/lib/primitives"
import { buildComponentHref, getImplementationFromPath } from "@/lib/docs-route"

type CommandPaletteProps = {
  open: boolean
  onClose: () => void
}

type PaletteGroup = string

type PaletteCommand = {
  id: string
  label: string
  href: string
  keywords: string[]
  group: PaletteGroup
}

/** Pages first, then one group per taxonomy category (titles come from the taxonomy). */
const GROUPS: { key: PaletteGroup; label: string }[] = [
  { key: "pages", label: "Getting started" },
  ...getCategories().map((category) => ({ key: category.id, label: category.title }))
]

const EXIT_MS = 150

const KBD_CLASS =
  "inline-flex h-5 min-w-5 items-center justify-center rounded border border-[var(--line-soft)] bg-[var(--surface-2)] px-1 font-mono text-[11px] leading-none text-[var(--color-muted,currentColor)]"

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim().toLowerCase()
  const at = q ? text.toLowerCase().indexOf(q) : -1
  if (at < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, at)}
      <span className="font-semibold text-[var(--color-accent)]">{text.slice(at, at + q.length)}</span>
      {text.slice(at + q.length)}
    </>
  )
}

const FOCUSABLE = "a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex='-1'])"

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [query, setQuery] = React.useState("")
  const [selected, setSelected] = React.useState(0)
  const [mounted, setMounted] = React.useState(open)
  const [visible, setVisible] = React.useState(false)
  const listRef = React.useRef<HTMLDivElement>(null)
  const dialogRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const returnFocusRef = React.useRef<HTMLElement | null>(null)
  const implementation = getImplementationFromPath(pathname)

  const commands = React.useMemo<PaletteCommand[]>(() => {
    const pageCommands: PaletteCommand[] = [
      { id: "docs-home", label: "Documentation Overview", href: "/docs", keywords: ["docs", "home", "overview"], group: "pages" },
      { id: "getting-started", label: "Getting Started", href: "/docs/getting-started", keywords: ["start", "install", "setup"], group: "pages" },
      { id: "accessibility", label: "Accessibility Hub", href: "/docs/accessibility", keywords: ["accessibility", "a11y", "wcag", "screen reader", "focus"], group: "pages" },
      { id: "forms-accessibility", label: "Forms Accessibility", href: "/docs/forms-accessibility", keywords: ["forms", "accessibility", "a11y", "labels"], group: "pages" },
      { id: "forms-recipes", label: "Form Recipes", href: "/docs/forms-recipes", keywords: ["forms", "recipes", "auth", "checkout", "settings"], group: "pages" },
      { id: "screen-reader-testing", label: "Screen Reader Testing", href: "/docs/screen-reader-testing", keywords: ["screen", "reader", "voiceover", "nvda", "a11y", "testing"], group: "pages" },
      { id: "focus-management", label: "Focus Management", href: "/docs/focus-management", keywords: ["focus", "keyboard", "dialog", "trap"], group: "pages" },
      { id: "color-contrast", label: "Color Contrast", href: "/docs/color-contrast", keywords: ["contrast", "wcag", "colors", "readability"], group: "pages" },
      { id: "ai-ready-docs", label: "AI-ready docs", href: "/docs/ai", keywords: ["ai", "llm", "claude", "chatgpt", "cursor", "prompt", "markdown", "llms.txt", "copy for ai"], group: "pages" },
      { id: "variants", label: "Variants", href: "/docs/variants", keywords: ["variants", "solid", "soft", "outline", "ghost", "gradient", "glass", "vocabulary"], group: "pages" },
      { id: "attribution", label: "Attribution", href: "/docs/attribution", keywords: ["credits", "licenses", "third party", "adapted", "upstream", "mit"], group: "pages" },
      { id: "free-forever", label: "Free forever pledge", href: "/docs/free-forever", keywords: ["free", "pledge", "license", "mit", "takedown", "removal", "open source"], group: "pages" },
      { id: "components", label: "Components", href: "/docs/components", keywords: ["components", "catalog"], group: "pages" },
      { id: "shadcn-alternative", label: "Glin UI vs shadcn/ui", href: "/docs/shadcn-alternative", keywords: ["shadcn", "alternative", "comparison", "vs"], group: "pages" },
      { id: "magicui-alternative", label: "Glin UI vs Magic UI", href: "/docs/magicui-alternative", keywords: ["magic ui", "alternative", "comparison", "vs"], group: "pages" },
      { id: "radix-ui-components", label: "Radix UI Components", href: "/docs/radix-ui-components", keywords: ["radix", "ui", "components", "accessible"], group: "pages" },
      { id: "glassmorphism-react-components", label: "Glassmorphism React Components", href: "/docs/glassmorphism-react-components", keywords: ["glassmorphism", "react", "components", "glass"], group: "pages" },
      { id: "directory", label: "Directory", href: "/docs/directory", keywords: ["directory", "browse", "install", "registry", "search"], group: "pages" },
      { id: "api-metadata", label: "API Metadata", href: "/docs/api-metadata", keywords: ["api", "props", "metadata", "automation"], group: "pages" },
      { id: "animations", label: "Animations", href: "/docs/animations", keywords: ["animations", "motion", "free", "effects", "easing"], group: "pages" },
      { id: "colors", label: "Colors", href: "/docs/colors", keywords: ["colors", "palette", "oklch", "theme", "contrast", "accent"], group: "pages" },
      { id: "tokens", label: "Design Tokens", href: "/docs/tokens", keywords: ["tokens", "theme", "colors"], group: "pages" },
      { id: "glass-physics", label: "Glass Physics", href: "/docs/glass-physics", keywords: ["glass", "physics", "elevation"], group: "pages" },
      { id: "motion", label: "Motion", href: "/docs/motion", keywords: ["motion", "animation"], group: "pages" },
      { id: "engines", label: "Animation engines", href: "/docs/engines", keywords: ["animation", "engine", "gsap", "motion", "css", "reveal", "register"], group: "pages" }
    ]

    const componentCommands: PaletteCommand[] = getCategories().flatMap((category) =>
      getComponentsByCategory(category.id).map((id): PaletteCommand => {
        const title = getTitle(id)
        const entry = getEntry(id)
        return {
          id: `component-${id}`,
          label: title,
          href: buildComponentHref(id as ComponentId, implementation),
          keywords: [id, title.toLowerCase(), "component", category.title.toLowerCase(), ...entry.tags, ...(entry.tags.includes("ai") ? ["chat", "llm"] : [])],
          group: category.id
        }
      })
    )

    return [...pageCommands, ...componentCommands]
  }, [implementation])


  const filtered = React.useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) {
      return commands
    }

    return commands.filter((item) => {
      return item.label.toLowerCase().includes(normalized) || item.keywords.some((word) => word.includes(normalized))
    })
  }, [commands, query])

  const groups = React.useMemo(
    () => GROUPS.map((g) => ({ ...g, items: filtered.filter((c) => c.group === g.key) })).filter((g) => g.items.length > 0),
    [filtered]
  )

  // Flat list for keyboard navigation index
  const flatList = React.useMemo(() => groups.flatMap((g) => g.items), [groups])

  // Mount/unmount with a short exit transition; remember and restore focus.
  React.useEffect(() => {
    if (open) {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      setMounted(true)
      const raf = window.requestAnimationFrame(() => setVisible(true))
      return () => window.cancelAnimationFrame(raf)
    }
    setVisible(false)
    const timer = window.setTimeout(() => {
      setMounted(false)
      returnFocusRef.current?.focus()
      returnFocusRef.current = null
    }, EXIT_MS)
    return () => window.clearTimeout(timer)
  }, [open])

  // Body scroll lock
  React.useEffect(() => {
    if (!mounted) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [mounted])

  React.useEffect(() => {
    if (!open) return
    setQuery("")
    setSelected(0)
    inputRef.current?.focus()
  }, [open, pathname])

  React.useEffect(() => {
    if (!open) return
    if (selected > flatList.length - 1) setSelected(0)
  }, [flatList.length, open, selected])

  // Scroll selected item into view
  React.useEffect(() => {
    if (!open || !listRef.current) return
    const el = listRef.current.querySelector("[data-selected='true']")
    if (el) el.scrollIntoView({ block: "nearest" })
  }, [open, selected])

  React.useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key === "Tab") {
        const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE)
        if (!nodes || nodes.length === 0) return
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        const active = document.activeElement
        if (event.shiftKey && active === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && active === last) {
          event.preventDefault()
          first.focus()
        } else if (!dialogRef.current?.contains(active)) {
          event.preventDefault()
          first.focus()
        }
        return
      }

      if (event.key === "ArrowDown") {
        event.preventDefault()
        setSelected((prev) => (flatList.length === 0 ? 0 : (prev + 1) % flatList.length))
      }

      if (event.key === "ArrowUp") {
        event.preventDefault()
        setSelected((prev) => (flatList.length === 0 ? 0 : (prev - 1 + flatList.length) % flatList.length))
      }

      if (event.key === "Enter") {
        event.preventDefault()
        const command = flatList[selected]
        if (!command) return
        router.push(command.href)
        onClose()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [flatList, onClose, open, router, selected])

  if (!mounted) {
    return null
  }

  const optionId = (index: number) => `command-option-${index}`
  const activeId = flatList[selected] ? optionId(selected) : undefined

  const renderItem = (item: PaletteCommand, globalIndex: number) => {
    const active = selected === globalIndex
    return (
      <div
        key={item.id}
        id={optionId(globalIndex)}
        role="option"
        aria-selected={active}
        data-selected={active}
        onClick={() => {
          router.push(item.href)
          onClose()
        }}
        onMouseMove={() => {
          if (!active) setSelected(globalIndex)
        }}
        className={cn(
          "relative flex h-9 cursor-pointer items-center rounded-md px-3 text-sm font-normal",
          active
            ? "bg-[color-mix(in_srgb,var(--color-accent)_9%,transparent)] text-foreground before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:rounded-full before:bg-[var(--color-accent)]"
            : "text-foreground/75"
        )}
      >
        <span className="truncate">
          <Highlight text={item.label} query={query} />
        </span>
      </div>
    )
  }

  let runningIndex = 0

  return (
    <>
      {/* Overlay: click outside to close */}
      <div
        className={cn(
          "fixed inset-0 z-[90] bg-black/30 transition-opacity duration-150 ease-[var(--ease-out)] motion-reduce:transition-none",
          visible ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
        aria-hidden
      />

      <div className="pointer-events-none fixed inset-0 z-[91] flex items-start justify-center p-4 pt-[12vh]">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          className={cn(
            "pointer-events-auto w-full max-w-xl overflow-hidden rounded-xl bg-[var(--surface-1)] [box-shadow:var(--elev-3)] ring-1 ring-[var(--line-soft)]",
            "transition-[opacity,transform] duration-150 ease-[var(--ease-out)] motion-reduce:transition-none",
            visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-1 scale-[0.99] opacity-0"
          )}
        >
          <div className="flex h-12 items-center gap-3 border-b border-[var(--line-soft)] px-4">
            <MagnifyingGlass aria-hidden className="size-4 shrink-0 text-foreground/50" />
            <input
              ref={inputRef}
              autoFocus
              role="combobox"
              aria-expanded="true"
              aria-controls="command-listbox"
              aria-autocomplete="list"
              aria-activedescendant={activeId}
              aria-label="Search components and docs"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search components and docs..."
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/40"
            />
            <kbd className={KBD_CLASS}>Esc</kbd>
          </div>

          <div ref={listRef} id="command-listbox" role="listbox" aria-label="Results" className="max-h-[380px] overflow-y-auto p-2">
            {flatList.length === 0 ? (
              <div className="px-3 py-8 text-center">
                <p className="text-sm text-foreground/60">No results for &ldquo;{query}&rdquo;</p>
                <p className="mt-1 text-xs text-foreground/40">Try a different search term</p>
              </div>
            ) : (
              groups.map((group) => (
                <div key={group.key} role="group" aria-labelledby={`command-group-${group.key}`} className="[&:not(:first-child)]:mt-2">
                  <p
                    id={`command-group-${group.key}`}
                    className="type-eyebrow px-3 pb-1 pt-2"
                  >
                    {group.label}
                  </p>
                  {group.items.map((item) => renderItem(item, runningIndex++))}
                </div>
              ))
            )}
          </div>

          <div className="flex h-9 items-center justify-between border-t border-[var(--line-soft)] px-4 font-mono text-[11px] text-foreground/50">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <kbd className={KBD_CLASS}><ArrowUp aria-hidden className="size-2.5" /></kbd>
                <kbd className={KBD_CLASS}><ArrowDown aria-hidden className="size-2.5" /></kbd>
                navigate
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className={KBD_CLASS}><ArrowElbowDownLeft aria-hidden className="size-2.5" /></kbd>
                open
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className={KBD_CLASS}>Esc</kbd>
                close
              </span>
            </div>
            <span aria-live="polite">{flatList.length} results</span>
          </div>
        </div>
      </div>
    </>
  )
}
