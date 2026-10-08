"use client"

import * as React from "react"

import { getScrollRoot } from "./scroll"

const ACTIVATION_LINE = 140
const LOCK_MS = 800

export function useScrollSpy(hrefs: string[]) {
  const [activeHref, setActiveHref] = React.useState("")
  const lockUntil = React.useRef(0)
  const computeRef = React.useRef<() => void>(() => {})
  const key = hrefs.join("|")

  React.useEffect(() => {
    const list = key ? key.split("|") : []
    const targets = list
      .map((href) => {
        const node = document.getElementById(href.slice(1))
        return node ? { href, node } : null
      })
      .filter((value): value is { href: string; node: HTMLElement } => value !== null)

    if (targets.length === 0) {
      setActiveHref("")
      return
    }

    const root = getScrollRoot()

    const compute = () => {
      if (performance.now() < lockUntil.current) return
      const rootTop = root ? root.getBoundingClientRect().top : 0
      const scrollHeight = root ? root.scrollHeight : document.documentElement.scrollHeight
      const viewHeight = root ? root.clientHeight : window.innerHeight
      const scrollTop = root ? root.scrollTop : window.scrollY
      const scrollable = scrollHeight - viewHeight > 8
      const atBottom = scrollable && scrollTop + viewHeight >= scrollHeight - 24

      let current = targets[0].href
      if (atBottom) {
        current = targets[targets.length - 1].href
      } else {
        for (const target of targets) {
          if (target.node.getBoundingClientRect().top - rootTop <= ACTIVATION_LINE) current = target.href
          else break
        }
      }
      setActiveHref((prev) => (prev === current ? prev : current))
    }
    computeRef.current = compute

    const hash = window.location.hash
    if (hash && targets.some((target) => target.href === hash)) {
      setActiveHref(hash)
      lockUntil.current = performance.now() + 600
      window.setTimeout(compute, 650)
    } else {
      compute()
    }

    let raf = 0
    const schedule = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(compute)
    }

    const observer = new IntersectionObserver(schedule, {
      root: root ?? null,
      rootMargin: "0px 0px -60% 0px",
      threshold: [0, 1]
    })
    targets.forEach((target) => observer.observe(target.node))

    const scrollTarget: Window | HTMLElement = root ?? window
    // Scroll listener covers bottom-of-page detection, which IntersectionObserver cannot signal.
    scrollTarget.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      scrollTarget.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [key])

  const activate = React.useCallback((href: string) => {
    setActiveHref(href)
    lockUntil.current = performance.now() + LOCK_MS
    window.setTimeout(() => computeRef.current(), LOCK_MS + 50)
  }, [])

  return { activeHref, activate }
}
