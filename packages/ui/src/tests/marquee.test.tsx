import { act, render } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { Marquee } from "../components/marquee"

type Observed = { callback: ResizeObserverCallback }

let observers: Observed[] = []

function defineSize(proto: object, prop: string, resolver: (el: HTMLElement) => number) {
  Object.defineProperty(proto, prop, { configurable: true, get() { return resolver(this as HTMLElement) } })
}

describe("Marquee", () => {
  beforeEach(() => {
    observers = []
    vi.stubGlobal(
      "ResizeObserver",
      class {
        callback: ResizeObserverCallback
        constructor(callback: ResizeObserverCallback) {
          this.callback = callback
          observers.push({ callback })
        }
        observe() {}
        disconnect() {}
        unobserve() {}
      }
    )
    // Root is 800px wide, one content track is 200px wide.
    defineSize(HTMLElement.prototype, "clientWidth", (el) => (el.className.includes("group") ? 800 : 0))
    defineSize(HTMLElement.prototype, "clientHeight", (el) => (el.className.includes("group") ? 300 : 0))
    defineSize(HTMLElement.prototype, "offsetWidth", (el) => (el.className.includes("shrink-0") ? 200 : 0))
    defineSize(HTMLElement.prototype, "offsetHeight", (el) => (el.className.includes("shrink-0") ? 100 : 0))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    delete (HTMLElement.prototype as unknown as Record<string, unknown>).clientWidth
    delete (HTMLElement.prototype as unknown as Record<string, unknown>).clientHeight
    delete (HTMLElement.prototype as unknown as Record<string, unknown>).offsetWidth
    delete (HTMLElement.prototype as unknown as Record<string, unknown>).offsetHeight
  })

  it("renders enough copies to fill a container wider than two copies", async () => {
    const { container } = render(<Marquee gap={16}><span>a</span></Marquee>)
    await act(async () => {})
    // ceil(800 / (200 + 16)) + 1 = 5 copies
    const tracks = container.querySelectorAll("[class*=animate-marquee-x]")
    expect(tracks.length).toBe(5)
  })

  it("marks every copy after the first as aria-hidden", async () => {
    const { container } = render(<Marquee><span>a</span></Marquee>)
    await act(async () => {})
    const tracks = [...container.querySelectorAll("[class*=animate-marquee-x]")]
    expect(tracks[0]?.getAttribute("aria-hidden")).toBeNull()
    expect(tracks.slice(1).every((track) => track.getAttribute("aria-hidden") === "true")).toBe(true)
  })

  it("uses a fixed number of copies when repeat is set", async () => {
    const { container } = render(<Marquee repeat={3}><span>a</span></Marquee>)
    await act(async () => {})
    expect(container.querySelectorAll("[class*=animate-marquee-x]").length).toBe(3)
  })

  it("does not grow a content-sized vertical marquee (no feedback loop)", async () => {
    // Root height follows its content: copies * 100px + gaps, like a vertical marquee with no explicit height.
    defineSize(HTMLElement.prototype, "clientHeight", (el) =>
      el.className.includes("group") ? el.children.length * 100 + (el.children.length - 1) * 0 : 0
    )
    const { container } = render(<Marquee direction="up" gap={0}><span>a</span></Marquee>)
    await act(async () => {})
    await act(async () => {})
    expect(container.querySelectorAll("[class*=animate-marquee-y]").length).toBe(4)
  })

  it("measures the vertical axis for up and down", async () => {
    const { container } = render(<Marquee direction="up" gap={0}><span>a</span></Marquee>)
    await act(async () => {})
    // ceil(300 / 100) + 1 = 4 copies
    expect(container.querySelectorAll("[class*=animate-marquee-y]").length).toBe(4)
  })

  it("uses one spacing source: container gap, no track padding", () => {
    const { container } = render(<Marquee gap={24}><span>a</span></Marquee>)
    const root = container.firstElementChild as HTMLElement
    expect(root.className).toContain("gap-[var(--marquee-gap)]")
    expect(root.style.getPropertyValue("--marquee-gap")).toBe("24px")
    expect(container.innerHTML).not.toContain("pr-[var(--marquee-gap)]")
  })

  it("pauses on hover through the group only when requested", () => {
    const { container, rerender } = render(<Marquee><span>a</span></Marquee>)
    expect(container.innerHTML).not.toContain("group-hover:[animation-play-state:paused]")
    rerender(<Marquee pauseOnHover><span>a</span></Marquee>)
    expect(container.innerHTML).toContain("group-hover:[animation-play-state:paused]")
  })
})
