export const SCROLL_OFFSET = 100

export function getScrollRoot(): HTMLElement | null {
  return document.querySelector<HTMLElement>("[data-docs-scroll-root]")
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function scrollToHeading(href: string): boolean {
  const node = document.getElementById(href.slice(1))
  if (!node) return false
  const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth"
  const root = getScrollRoot()
  if (root) {
    const top = node.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop - SCROLL_OFFSET
    root.scrollTo({ top: Math.max(0, top), behavior })
  } else {
    const top = node.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET
    window.scrollTo({ top: Math.max(0, top), behavior })
  }
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${href}`)
  return true
}

export function scrollPageToTop(): void {
  const root = getScrollRoot()
  if (window.location.hash) {
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`)
  }
  const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth"
  if (root) root.scrollTo({ top: 0, behavior })
  window.scrollTo({ top: 0, behavior })
}
