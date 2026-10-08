"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowSquareOut, CaretDown, GithubLogo, List, MagnifyingGlass } from "@phosphor-icons/react"

import { DirectionSegmentedControl, ThemeSegmentedControl } from "@/components/layout/docs-topbar"
import { LandingMobileMenu } from "@/components/layout/landing-nav-mobile"
import type { NavGroup, NavLinkItem } from "@/components/layout/landing-nav-types"

type LandingNavProps = {
  links: NavLinkItem[]
  groups: NavGroup[]
  onOpenSearch: () => void
}

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
const linkClass = `rounded-md px-2.5 py-1.5 text-sm font-medium tracking-[-0.005em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)] ${ring}`
const iconButton = `inline-flex size-8 items-center justify-center rounded-md text-[var(--color-muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--color-foreground)] ${ring}`

function ResourceMenu({ group }: { group: NavGroup }) {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    setOpen(false)
  }, [pathname])

  React.useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerdown", onPointerDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [open])

  const active = group.items.some((item) => pathname === item.href)

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false)
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((prev) => !prev)}
        className={`${linkClass} inline-flex items-center gap-1 ${active ? "text-[var(--color-foreground)]" : ""}`}
      >
        {group.label}
        <CaretDown className={`size-3 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <ul className="absolute left-0 top-full z-50 mt-1 min-w-52 rounded-lg border border-[var(--line-soft)] bg-[var(--surface-1)] p-1 shadow-lg">
          {group.items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`block rounded-md px-3 py-2 text-sm font-medium tracking-[-0.005em] text-[var(--color-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--color-foreground)] aria-[current=page]:text-[var(--color-foreground)] ${ring}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export function LandingNav({ links, groups, onOpenSearch }: LandingNavProps) {
  const pathname = usePathname()
  const sentinelRef = React.useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = React.useState(false)
  const [menuOpen, setMenuOpen] = React.useState(false)
  const closeMenu = React.useCallback(() => setMenuOpen(false), [])

  React.useEffect(() => {
    const node = sentinelRef.current
    if (!node || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting))
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px" />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-md focus:bg-[var(--color-accent)] focus:px-3 focus:py-2 focus:text-sm focus:text-[var(--color-accent-foreground)]"
      >
        Skip to main content
      </a>
      <header
        className={`sticky top-0 z-40 border-b bg-surface-0/85 backdrop-blur-sm transition-colors motion-reduce:transition-none ${
          scrolled ? "border-[var(--line-soft)]" : "border-transparent"
        }`}
      >
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Link href="/" className={`flex items-center gap-2 rounded-md ${ring}`}>
            <Image src="/glincker-logo.png" alt="" width={24} height={24} unoptimized className="rounded-md dark:hidden" />
            <Image src="/glincker-logo.png" alt="" width={24} height={24} unoptimized className="hidden rounded-md invert dark:block" />
            <span className="text-sm font-semibold tracking-[-0.02em]">Glin UI</span>
          </Link>
          <Link
            href="https://glincker.com"
            target="_blank"
            rel="noreferrer"
            className={`hidden items-center gap-1 rounded-sm font-mono text-[11px] text-[var(--color-muted)] hover:text-[var(--color-foreground)] xl:inline-flex ${ring}`}
          >
            by GLINR
            <ArrowSquareOut className="size-2.5" />
          </Link>

          <nav aria-label="Primary" className="ml-4 hidden items-center gap-0.5 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={linkClass}
              >
                {link.label}
              </Link>
            ))}
            {groups.map((group) => (
              <ResourceMenu key={group.label} group={group} />
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Open command palette"
              className={`inline-flex h-8 items-center gap-2 rounded-md border border-[var(--line-soft)] bg-[var(--surface-1)] px-2.5 text-[13px] text-[var(--color-muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--color-foreground)] ${ring} xl:min-w-40`}
            >
              <MagnifyingGlass className="size-3.5" />
              <span className="hidden flex-1 text-left xl:inline">Search</span>
              <kbd className="hidden rounded border border-[var(--line-soft)] px-1 font-mono text-[11px] xl:inline">⌘K</kbd>
            </button>
            <ThemeSegmentedControl />
            <span className="hidden sm:inline-flex">
              <DirectionSegmentedControl />
            </span>
            <Link
              href="https://github.com/GLINCKER/glinui"
              target="_blank"
              rel="noreferrer"
              aria-label="Open GitHub"
              className={`${iconButton} hidden sm:inline-flex`}
            >
              <GithubLogo className="size-4" />
            </Link>
            <Link
              href="/docs/getting-started"
              className={`ml-1 hidden h-8 items-center rounded-md bg-[var(--color-accent)] px-3.5 text-sm font-medium tracking-[-0.005em] text-[var(--color-accent-foreground)] transition-opacity hover:opacity-90 sm:inline-flex ${ring} focus-visible:ring-offset-2`}
            >
              Open Docs
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className={`${iconButton} lg:hidden`}
            >
              <List className="size-5" />
            </button>
          </div>
        </div>
      </header>
      <LandingMobileMenu
        open={menuOpen}
        onClose={closeMenu}
        onOpenSearch={() => {
          setMenuOpen(false)
          onOpenSearch()
        }}
        links={links}
        groups={groups}
        pathname={pathname}
      />
    </>
  )
}
