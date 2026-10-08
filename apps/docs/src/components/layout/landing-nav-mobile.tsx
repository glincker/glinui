"use client"

import * as React from "react"
import Link from "next/link"
import { GithubLogo, MagnifyingGlass, X } from "@phosphor-icons/react"

import { DirectionSegmentedControl, ThemeSegmentedControl } from "@/components/layout/docs-topbar"
import type { NavGroup, NavLinkItem } from "@/components/layout/landing-nav-types"

type LandingMobileMenuProps = {
  open: boolean
  onClose: () => void
  onOpenSearch: () => void
  links: NavLinkItem[]
  groups: NavGroup[]
  pathname: string
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

const itemClass =
  "block rounded-md px-3 py-2.5 text-base text-[var(--color-foreground)] hover:bg-[var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"

export function LandingMobileMenu({ open, onClose, onOpenSearch, links, groups, pathname }: LandingMobileMenuProps) {
  const panelRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== "Tab" || !panelRef.current) return
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = prevOverflow
      previous?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-[var(--surface-0)] lg:hidden"
    >
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--line-soft)] px-4">
        <span className="text-sm font-semibold tracking-[-0.01em]">Menu</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="inline-flex size-9 items-center justify-center rounded-md text-[var(--color-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          <X className="size-5" />
        </button>
      </div>

      <nav aria-label="Mobile primary" className="flex-1 space-y-6 px-4 py-5">
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex h-11 w-full items-center gap-2 rounded-md border border-[var(--line-soft)] bg-[var(--surface-1)] px-3 text-sm text-[var(--color-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          <MagnifyingGlass className="size-4" />
          Search docs
        </button>

        <ul className="space-y-0.5">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                aria-current={pathname === link.href ? "page" : undefined}
                className={itemClass}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {groups.map((group) => (
          <div key={group.label}>
            <p className="type-eyebrow px-3 pb-1">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={itemClass}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="flex shrink-0 items-center gap-2 border-t border-[var(--line-soft)] px-4 py-3">
        <ThemeSegmentedControl />
        <DirectionSegmentedControl />
        <Link
          href="https://github.com/GLINCKER/glinui"
          target="_blank"
          rel="noreferrer"
          aria-label="Open GitHub"
          className="inline-flex size-8 items-center justify-center rounded-md text-[var(--color-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          <GithubLogo className="size-4" />
        </Link>
        <Link
          href="/docs/getting-started"
          onClick={onClose}
          className="ml-auto inline-flex h-9 items-center rounded-md bg-[var(--color-accent)] px-4 text-sm font-medium text-[var(--color-accent-foreground)] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
        >
          Open Docs
        </Link>
      </div>
    </div>
  )
}
