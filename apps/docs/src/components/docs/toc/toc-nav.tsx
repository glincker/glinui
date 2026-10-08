"use client"

import * as React from "react"
import { CaretDown } from "@phosphor-icons/react"

import { cn } from "@glinui/ui"
import { type TocItem, type TocSection } from "./types"

const MAX_SUB_ITEMS = 6

const linkBase =
  "relative block rounded-sm py-1.5 leading-snug transition-colors duration-fast ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-accent)]"

function TocLink({
  item,
  active,
  onNavigate
}: {
  item: TocItem
  active: boolean
  onNavigate: (href: string) => void
}) {
  return (
    <a
      href={item.href}
      data-toc-href={item.href}
      aria-current={active ? "location" : undefined}
      onClick={(event) => {
        event.preventDefault()
        onNavigate(item.href)
      }}
      className={cn(
        linkBase,
        item.depth === 3 ? "pl-7 text-[12px]" : "pl-4 text-[13px]",
        active
          ? "font-medium text-foreground"
          : "text-neutral-500 hover:text-foreground dark:text-neutral-400 dark:hover:text-neutral-200"
      )}
    >
      <span className={cn("block truncate", active && "text-[var(--color-accent)] dark:text-[var(--color-accent)]")}>
        {item.label}
      </span>
    </a>
  )
}

function TocSectionView({
  section,
  activeHref,
  onNavigate
}: {
  section: TocSection
  activeHref: string
  onNavigate: (href: string) => void
}) {
  const [showAll, setShowAll] = React.useState(false)
  const activeChildIndex = section.children.findIndex((child) => child.href === activeHref)
  const open = section.item.href === activeHref || activeChildIndex >= 0
  const expanded = showAll || activeChildIndex >= MAX_SUB_ITEMS
  const visible = expanded ? section.children : section.children.slice(0, MAX_SUB_ITEMS)
  const hidden = section.children.length - visible.length

  return (
    <li>
      <TocLink item={section.item} active={section.item.href === activeHref} onNavigate={onNavigate} />
      {section.children.length > 0 ? (
        <div
          className={cn(
            "grid transition-[grid-template-rows,visibility] duration-normal ease-standard motion-reduce:transition-none",
            open ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
          )}
        >
          <ul className="min-h-0 list-none overflow-hidden">
            {visible.map((child) => (
              <li key={child.href}>
                <TocLink item={child} active={child.href === activeHref} onNavigate={onNavigate} />
              </li>
            ))}
            {hidden > 0 ? (
              <li>
                <button
                  type="button"
                  onClick={() => setShowAll(true)}
                  className={cn(
                    linkBase,
                    "inline-flex w-full items-center gap-1 pl-7 text-[12px] text-neutral-400 hover:text-foreground dark:text-neutral-500"
                  )}
                >
                  <CaretDown className="size-3" aria-hidden="true" />+{hidden} more
                </button>
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}
    </li>
  )
}

export function TocNav({
  sections,
  activeHref,
  onNavigate
}: {
  sections: TocSection[]
  activeHref: string
  onNavigate: (href: string) => void
}) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const barRef = React.useRef<HTMLSpanElement | null>(null)

  React.useEffect(() => {
    const container = containerRef.current
    const bar = barRef.current
    if (!container || !bar) return

    const place = () => {
      const link = Array.from(container.querySelectorAll<HTMLElement>("[data-toc-href]")).find(
        (node) => node.dataset.tocHref === activeHref
      )
      if (!link || activeHref === "") {
        bar.dataset.ready = "false"
        return
      }
      const top = link.getBoundingClientRect().top - container.getBoundingClientRect().top
      bar.style.setProperty("--toc-y", `${top}px`)
      bar.style.setProperty("--toc-h", `${link.getBoundingClientRect().height}px`)
      bar.dataset.ready = "true"
    }

    place()
    const observer = new ResizeObserver(place)
    observer.observe(container)
    return () => observer.disconnect()
  }, [activeHref, sections])

  return (
    <nav aria-label="Table of contents" className="relative">
      <div ref={containerRef} className="relative max-h-[calc(100vh-16rem)] overflow-y-auto xl:max-h-[calc(100vh-20rem)]">
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-px bg-[var(--line-soft)]" />
        <span
          ref={barRef}
          aria-hidden="true"
          data-ready="false"
          className="pointer-events-none absolute left-0 top-0 h-[var(--toc-h,0px)] w-0.5 -translate-x-px translate-y-[var(--toc-y,0px)] rounded-full bg-[var(--color-accent)] opacity-0 transition-[transform,height,opacity] duration-normal ease-standard data-[ready=true]:opacity-100 motion-reduce:transition-none"
        />
        <ul className="list-none">
          {sections.map((section) => (
            <TocSectionView key={section.item.href} section={section} activeHref={activeHref} onNavigate={onNavigate} />
          ))}
        </ul>
      </div>
    </nav>
  )
}
