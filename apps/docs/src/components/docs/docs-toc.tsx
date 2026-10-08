"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { ArrowUp, List, X } from "@phosphor-icons/react"

import { cn } from "@glinui/ui"
import { primitiveComponentIds, type PrimitiveComponentId } from "@/lib/primitives"
import { type DocsImplementation } from "@/lib/docs-route"
import { scrollPageToTop, scrollToHeading } from "./toc/scroll"
import { TocFooter } from "./toc/toc-footer"
import { TocNav } from "./toc/toc-nav"
import { buildSections, extractTocItems, type TocItem } from "./toc/types"
import { useScrollSpy } from "./toc/use-scroll-spy"

export function DocsToc({
  title = "On this page",
  items,
  componentId,
  implementation = "radix",
  selector = "article h2[id], article h3[id]"
}: {
  title?: string
  items?: TocItem[]
  componentId?: PrimitiveComponentId
  implementation?: DocsImplementation
  selector?: string
}) {
  const [dynamicItems, setDynamicItems] = React.useState<TocItem[]>([])
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    setDynamicItems(items && items.length > 0 ? items : extractTocItems(selector))
  }, [items, pathname, selector])

  const sections = React.useMemo(() => buildSections(dynamicItems), [dynamicItems])
  const hrefs = React.useMemo(() => dynamicItems.map((item) => item.href), [dynamicItems])
  const { activeHref, activate } = useScrollSpy(hrefs)

  const handleNavigate = React.useCallback(
    (href: string) => {
      if (scrollToHeading(href)) activate(href)
      setMobileOpen(false)
    },
    [activate]
  )

  if (dynamicItems.length === 0) return null

  const index = componentId ? primitiveComponentIds.indexOf(componentId) : -1
  const previous = componentId && index > 0 ? primitiveComponentIds[index - 1] : null
  const next =
    componentId && index >= 0 && index < primitiveComponentIds.length - 1 ? primitiveComponentIds[index + 1] : null

  const tocNav = <TocNav sections={sections} activeHref={activeHref} onNavigate={handleNavigate} />
  const footer =
    componentId && (previous || next) ? (
      <TocFooter previous={previous} next={next} implementation={implementation} onTop={scrollPageToTop} />
    ) : null

  return (
    <>
      <aside className="hidden xl:block">
        <div className="sticky top-6">
          <p className="mb-3 type-eyebrow">
            {title}
          </p>
          {tocNav}
          {footer ?? (
            <div className="mt-4 border-t border-neutral-200/50 pt-3 dark:border-white/[0.06]">
              <button
                type="button"
                onClick={scrollPageToTop}
                className="inline-flex items-center gap-1 rounded-md text-[11px] text-neutral-400 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] dark:text-neutral-500 dark:hover:text-neutral-300"
              >
                <ArrowUp className="size-3" />
                Back to top
              </button>
            </div>
          )}
        </div>
      </aside>

      <div className="xl:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label="Table of contents"
          aria-expanded={mobileOpen}
          className={cn(
            "fixed bottom-5 right-5 z-50 inline-flex size-11 items-center justify-center rounded-full border shadow-lg backdrop-blur-xl transition-all duration-normal ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
            mobileOpen
              ? "border-white/20 bg-neutral-900/80 text-white dark:border-white/15 dark:bg-neutral-800/90"
              : "border-white/25 [border-top-color:var(--glass-refraction-top)] bg-[var(--glass-4-surface)] text-foreground [box-shadow:var(--shadow-glass-md)]"
          )}
        >
          {mobileOpen ? <X className="size-4" /> : <List className="size-4" />}
        </button>

        {mobileOpen ? (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <div className="fixed bottom-20 right-5 z-50 max-h-[70vh] w-64 overflow-y-auto rounded-2xl border border-white/15 [border-top-color:var(--glass-refraction-top)] bg-[var(--glass-4-surface)] p-4 [box-shadow:var(--shadow-glass-lg)] backdrop-blur-2xl backdrop-saturate-[180%]">
              <p className="mb-2 type-eyebrow">
                {title}
              </p>
              {tocNav}
              {footer}
            </div>
          </>
        ) : null}
      </div>
    </>
  )
}

export type { TocItem }
