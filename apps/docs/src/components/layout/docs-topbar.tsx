"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import { ArrowsLeftRight, GithubLogo, Laptop, Moon, Sun } from "@phosphor-icons/react"
import { List, MagnifyingGlass } from "@phosphor-icons/react"

import { cn } from "@glinui/ui"
import { AnimationsToggle } from "@/components/customize/animations-toggle"
import { CustomizeTrigger } from "@/components/customize/customize-trigger"
import { useDocsDirection } from "@/lib/docs-direction"
import { useTheme } from "next-themes"

type DocsTopbarProps = {
  onOpenCommandPalette: () => void
  onOpenNav: () => void
  navOpen: boolean
}

type ToggleControlProps = {
  compact?: boolean
}

const topNav: Array<{ href: string; label: string; match: (pathname: string) => boolean }> = [
  { href: "/docs", label: "Docs", match: (p) => p === "/docs" || /^\/docs\/(getting-started|directory|accessibility|forms-|screen-reader|focus-|color-contrast|attribution|free-forever)/.test(p) },
  { href: "/docs/components", label: "Components", match: (p) => p.startsWith("/docs/components") },
  { href: "/docs/animations", label: "Animations", match: (p) => p === "/docs/animations" || p === "/docs/motion" },
  { href: "/docs/tokens", label: "Tokens", match: (p) => p === "/docs/tokens" },
  { href: "/docs/colors", label: "Colors", match: (p) => p === "/docs/colors" },
  { href: "/blog", label: "Blog", match: (p) => p.startsWith("/blog") }
]

const iconButton =
  "inline-flex size-8 items-center justify-center rounded-md text-neutral-600 transition-colors hover:bg-[var(--surface-2)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] dark:text-neutral-300"

export function DocsTopbar({ onOpenCommandPalette, onOpenNav, navOpen }: DocsTopbarProps) {
  const pathname = usePathname()

  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-[var(--line-soft)] bg-[var(--surface-0)] px-3 sm:px-4">
      <button
        type="button"
        onClick={onOpenNav}
        aria-label="Open navigation"
        aria-expanded={navOpen}
        className={cn(iconButton, "lg:hidden")}
      >
        <List className="size-4" />
      </button>

      <Link href="/" className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]">
        <Image src="/glincker-logo.png" alt="" width={24} height={24} unoptimized className="rounded-md dark:hidden" />
        <Image src="/glincker-logo.png" alt="" width={24} height={24} unoptimized className="hidden rounded-md invert dark:block" />
        <span className="text-sm font-semibold tracking-[-0.02em]">Glin UI</span>
      </Link>

      <nav aria-label="Primary" className="ml-2 hidden items-center gap-0.5 md:flex">
        {topNav.map((item) => {
          const active = item.match(pathname)
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-sm font-medium tracking-[-0.005em] transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
                active ? "text-foreground" : "text-neutral-600 dark:text-neutral-400"
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="inline-flex h-8 items-center gap-2 rounded-md border border-[var(--line-soft)] bg-[var(--surface-1)] px-2.5 text-xs text-neutral-600 transition-colors hover:bg-[var(--surface-2)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] dark:text-neutral-300 md:min-w-44"
          aria-label="Open command palette"
        >
          <MagnifyingGlass className="size-3.5" />
          <span className="hidden flex-1 text-left md:inline">Search</span>
          <kbd className="hidden rounded border border-[var(--line-soft)] px-1 font-mono text-[11px] md:inline">⌘K</kbd>
        </button>

        <ThemeSegmentedControl />
        <DirectionSegmentedControl />
        <AnimationsToggle className={iconButton} />
        <CustomizeTrigger className={iconButton} />

        <Link
          href="https://github.com/GLINCKER/glinui"
          target="_blank"
          rel="noreferrer"
          className={iconButton}
          aria-label="Open GitHub"
        >
          <GithubLogo className="size-4" />
        </Link>
      </div>
    </header>
  )
}

export function DirectionSegmentedControl() {
  return <DirectionToggle compact />
}

export function DirectionToggle({ compact = false }: ToggleControlProps) {
  const { direction, setDirection } = useDocsDirection()
  const isRtl = direction === "rtl"

  return (
    <button
      type="button"
      onClick={() => setDirection(isRtl ? "ltr" : "rtl")}
      className={
        compact
          ? "inline-flex size-8 items-center justify-center rounded-md text-neutral-600 transition-colors hover:bg-[var(--surface-2)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] dark:text-neutral-300"
          : "inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs text-neutral-600 transition-colors hover:bg-[var(--surface-2)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] dark:text-neutral-300"
      }
      aria-label={`Switch direction to ${isRtl ? "LTR" : "RTL"}`}
      title={`Direction: ${isRtl ? "RTL" : "LTR"}`}
    >
      <ArrowsLeftRight className="size-3.5" />
      {!compact ? <span className="font-medium">{isRtl ? "RTL" : "LTR"}</span> : null}
    </button>
  )
}

export function ThemeSegmentedControl() {
  return <ThemeToggle compact />
}

export function ThemeToggle({ compact = false }: ToggleControlProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const activeTheme = (mounted ? theme : "system") as "light" | "system" | "dark"
  const order: Array<"light" | "system" | "dark"> = ["light", "system", "dark"]
  const nextTheme = order[(order.indexOf(activeTheme) + 1) % order.length]
  const iconByTheme = {
    light: Sun,
    system: Laptop,
    dark: Moon
  } as const
  const labelByTheme = {
    light: "Light",
    system: "System",
    dark: "Dark"
  } as const
  const Icon = iconByTheme[activeTheme]

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      className={
        compact
          ? "inline-flex size-8 items-center justify-center rounded-md text-neutral-600 transition-colors hover:bg-[var(--surface-2)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] dark:text-neutral-300"
          : "inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs text-neutral-600 transition-colors hover:bg-[var(--surface-2)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] dark:text-neutral-300"
      }
      aria-label={`Current theme ${labelByTheme[activeTheme]}. Switch to ${labelByTheme[nextTheme]}`}
      title={`Theme: ${labelByTheme[activeTheme]}`}
    >
      <Icon className="size-3.5" />
      {!compact ? <span className="font-medium">{labelByTheme[activeTheme]}</span> : null}
    </button>
  )
}

