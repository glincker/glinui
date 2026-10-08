import { act, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, vi } from "vitest"

import { MessageScroller } from "../components/message-scroller"

function mockMetrics(el: HTMLElement, m: { scrollHeight: number; clientHeight: number; scrollTop: number }) {
  Object.defineProperty(el, "scrollHeight", { value: m.scrollHeight, configurable: true })
  Object.defineProperty(el, "clientHeight", { value: m.clientHeight, configurable: true })
  Object.defineProperty(el, "scrollTop", { value: m.scrollTop, configurable: true, writable: true })
}

const originalMatchMedia = window.matchMedia

describe("MessageScroller", () => {
  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it("is a polite live log region and keyboard focusable", () => {
    render(<MessageScroller label="Chat"><p>one</p></MessageScroller>)
    const log = screen.getByRole("log", { name: "Chat" })
    expect(log).toHaveAttribute("aria-live", "polite")
    expect(log).toHaveAttribute("tabindex", "0")
  })

  it("hides the jump pill while at the bottom", () => {
    render(<MessageScroller><p>one</p></MessageScroller>)
    expect(screen.queryByRole("button", { name: "Jump to latest" })).toBeNull()
  })

  it("shows the pill after scrolling up and reports the change", () => {
    const onAtBottomChange = vi.fn()
    render(<MessageScroller onAtBottomChange={onAtBottomChange}><p>one</p></MessageScroller>)
    const log = screen.getByRole("log")
    mockMetrics(log, { scrollHeight: 1000, clientHeight: 300, scrollTop: 100 })
    fireEvent.scroll(log)
    expect(screen.getByRole("button", { name: "Jump to latest" })).toBeInTheDocument()
    expect(onAtBottomChange).toHaveBeenLastCalledWith(false)
  })

  it("jumps to the bottom and hides the pill again", () => {
    const { rerender } = render(<MessageScroller><p>one</p></MessageScroller>)
    const log = screen.getByRole("log")
    const scrollTo = vi.fn()
    ;(log as HTMLElement).scrollTo = scrollTo as unknown as typeof log.scrollTo
    mockMetrics(log, { scrollHeight: 1000, clientHeight: 300, scrollTop: 100 })
    fireEvent.scroll(log)
    fireEvent.click(screen.getByRole("button", { name: "Jump to latest" }))
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 1000 }))
    expect(screen.queryByRole("button", { name: "Jump to latest" })).toBeNull()
    rerender(<MessageScroller><p>one</p><p>two</p></MessageScroller>)
  })

  it("autoscrolls on new children only while pinned to the bottom", () => {
    const { rerender } = render(<MessageScroller><p>one</p></MessageScroller>)
    const log = screen.getByRole("log")
    const scrollTo = vi.fn()
    ;(log as HTMLElement).scrollTo = scrollTo as unknown as typeof log.scrollTo
    mockMetrics(log, { scrollHeight: 500, clientHeight: 300, scrollTop: 200 })
    act(() => {
      rerender(<MessageScroller><p>one</p><p>two</p></MessageScroller>)
    })
    expect(scrollTo).toHaveBeenCalledTimes(1)

    mockMetrics(log, { scrollHeight: 900, clientHeight: 300, scrollTop: 0 })
    fireEvent.scroll(log)
    scrollTo.mockClear()
    act(() => {
      rerender(<MessageScroller><p>one</p><p>two</p><p>three</p></MessageScroller>)
    })
    expect(scrollTo).not.toHaveBeenCalled()
  })

  it("uses instant behavior under reduced motion", () => {
    window.matchMedia = vi.fn().mockImplementation((q: string) => ({
      matches: true, media: q, addEventListener: vi.fn(), removeEventListener: vi.fn(), addListener: vi.fn(), removeListener: vi.fn()
    })) as unknown as typeof window.matchMedia
    render(<MessageScroller><p>one</p></MessageScroller>)
    const log = screen.getByRole("log")
    const scrollTo = vi.fn()
    ;(log as HTMLElement).scrollTo = scrollTo as unknown as typeof log.scrollTo
    mockMetrics(log, { scrollHeight: 1000, clientHeight: 300, scrollTop: 0 })
    fireEvent.scroll(log)
    fireEvent.click(screen.getByRole("button", { name: "Jump to latest" }))
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: "auto" }))
  })
})
