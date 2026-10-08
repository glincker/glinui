"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react"

import { DEFAULT_DOCS_IMPLEMENTATION } from "@/lib/docs-config"
import { buildComponentHref } from "@/lib/docs-route"

import { GALLERY } from "./gallery-previews"
import { LazyMount, SectionHeading, Surface } from "./surface"

const NAV_BTN =
  "inline-flex size-11 items-center justify-center rounded-full bg-[var(--surface-1)] text-[var(--color-foreground)] [box-shadow:var(--elev-1)] ring-1 ring-inset ring-[var(--line-soft)] transition-[transform,background-color] duration-150 hover:bg-[var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] active:scale-95 motion-reduce:transition-none"

export function GalleryTeaser() {
  const rail = React.useRef<HTMLUListElement>(null)
  const [edges, setEdges] = React.useState({ start: false, end: true })

  const syncEdges = React.useCallback(() => {
    const node = rail.current
    if (!node) return
    setEdges({ start: node.scrollLeft > 4, end: node.scrollLeft + node.clientWidth < node.scrollWidth - 4 })
  }, [])

  React.useEffect(() => {
    syncEdges()
    window.addEventListener("resize", syncEdges)
    return () => window.removeEventListener("resize", syncEdges)
  }, [syncEdges])

  const scrollRail = React.useCallback((dir: 1 | -1) => {
    const node = rail.current
    if (!node) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    node.scrollBy({ left: dir * Math.max(280, node.clientWidth * 0.8), behavior: reduce ? "auto" : "smooth" })
  }, [])

  const onKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (event.target !== event.currentTarget) return
    if (event.key === "ArrowRight") {
      event.preventDefault()
      scrollRail(1)
    } else if (event.key === "ArrowLeft") {
      event.preventDefault()
      scrollRail(-1)
    }
  }

  return (
    <section aria-labelledby="gallery-title" className="mx-auto w-full max-w-[1200px] pb-[clamp(48px,7vw,88px)]">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          id="gallery-title"
          eyebrow="Live previews"
          title="Not screenshots. These are the components."
        />
        <div className="flex shrink-0 items-center gap-4">
        <div className="hidden gap-2 md:flex">
          <button type="button" onClick={() => scrollRail(-1)} aria-label="Previous previews" className={NAV_BTN}>
            <ArrowLeft className="size-4" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => scrollRail(1)} aria-label="Next previews" className={NAV_BTN}>
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
        <Link
          href="/docs/components"
          className="inline-flex min-h-11 w-fit shrink-0 items-center gap-1.5 rounded-md text-sm font-medium text-[var(--color-foreground)] underline decoration-[var(--line-soft)] decoration-2 underline-offset-4 hover:decoration-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          All components <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
        </div>
      </div>

      <div className="relative mt-10">
      <div aria-hidden="true" className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-10 transition-opacity duration-200 ${edges.start ? "opacity-100" : "opacity-0"} bg-gradient-to-r from-[var(--color-background)] to-transparent`} />
      <div aria-hidden="true" className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-10 transition-opacity duration-200 ${edges.end ? "opacity-100" : "opacity-0"} bg-gradient-to-l from-[var(--color-background)] to-transparent`} />
      <ul
        ref={rail}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onScroll={syncEdges}
        aria-label="Component previews, use left and right arrow keys to scroll"
        className="flex rounded-[var(--radius-xl)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] snap-x snap-mandatory gap-4 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {GALLERY.map(({ id, title, note, className, Preview }) => (
          <li key={id} className={`max-w-[85vw] shrink-0 snap-start ${className}`}>
            <Link
              href={buildComponentHref(id, DEFAULT_DOCS_IMPLEMENTATION)}
              className="group block rounded-[var(--radius-xl)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              <Surface className="overflow-hidden transition-transform duration-200 ease-[var(--ease-out)] group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                <LazyMount className="flex h-44 items-center justify-center bg-[var(--surface-2)] p-5">
                  <Preview />
                </LazyMount>
                <div className="flex items-center justify-between gap-3 px-4 py-3.5">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-foreground)]">{title}</p>
                    <p className="truncate text-xs text-[var(--color-muted)]">{note}</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-[var(--color-muted)] group-hover:text-[var(--color-foreground)]">
                  View
                  <ArrowRight
                    className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                  </span>
                </div>
              </Surface>
            </Link>
          </li>
        ))}
      </ul>
      </div>
    </section>
  )
}
