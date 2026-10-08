"use client"

import Link from "next/link"
import * as React from "react"
import { ArrowUp, CaretRight, PencilSimpleLine } from "@phosphor-icons/react"

import { cn } from "@glinui/ui"

type FloatingComponentChromeProps = {
  badgeLabel: string
  title: string
  editHref: string
}

export function FloatingComponentChrome({
  badgeLabel,
  title,
  editHref
}: FloatingComponentChromeProps) {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const scrollRoot = document.querySelector<HTMLElement>("[data-docs-scroll-root]")
    let raf = 0

    const compute = () => {
      const scrollTop = scrollRoot ? scrollRoot.scrollTop : window.scrollY
      setIsVisible(scrollTop > 260)
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(compute)
    }

    compute()

    const scrollTarget: Window | HTMLElement = scrollRoot ?? window
    scrollTarget.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(raf)
      scrollTarget.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  const onBackToTop = () => {
    const scrollRoot = document.querySelector<HTMLElement>("[data-docs-scroll-root]")
    if (window.location.hash) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`)
    }

    if (scrollRoot) {
      scrollRoot.scrollTo({ top: 0, behavior: "smooth" })
    }
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-12 z-30 hidden xl:block">
        <div className="mx-auto w-full max-w-7xl px-8">
          <div
            className={cn(
              "pointer-events-auto mr-[220px] rounded-md border border-[var(--line-soft)] bg-[var(--surface-1)] px-4 py-2 transition-[transform,opacity] duration-200 ease-[var(--ease-out)] motion-reduce:transition-none",
              isVisible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                  <span>Home</span>
                  <CaretRight className="size-3 opacity-50" />
                  <span>Components</span>
                  <CaretRight className="size-3 opacity-50" />
                  <span className="truncate text-foreground">{title}</span>
                </div>
                <p className="mt-1 truncate text-xs text-neutral-500 dark:text-neutral-400">
                  {badgeLabel} • {title}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onBackToTop}
                  className="inline-flex items-center gap-1 rounded-md border border-[var(--line-soft)] px-2.5 py-1 text-[11px] text-neutral-600 transition-colors hover:bg-[var(--surface-2)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] dark:text-neutral-300"
                >
                  <ArrowUp className="size-3.5" />
                  Top
                </button>
                <Link
                  href={editHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-md border border-[var(--line-soft)] px-2.5 py-1 text-[11px] text-neutral-600 transition-colors hover:bg-[var(--surface-2)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] dark:text-neutral-300"
                >
                  <PencilSimpleLine className="size-3.5" />
                  Edit
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}
