import * as React from "react"
import { act, render, screen } from "@testing-library/react"
import { HyperText } from "../components/hyper-text"

function setMotion(level?: string) {
  if (level) document.documentElement.setAttribute("data-glin-motion", level)
  else document.documentElement.removeAttribute("data-glin-motion")
}

describe("HyperText", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    setMotion("full")
  })
  afterEach(() => {
    vi.useRealTimers()
    setMotion()
  })

  it("renders the real text for assistive tech and hides the glyph layer", () => {
    const { container } = render(<HyperText>Hello</HyperText>)
    expect(screen.getByText("Hello", { selector: ".sr-only" })).toBeInTheDocument()
    expect(container.querySelector('[aria-hidden="true"]')?.textContent).toBe("Hello")
  })

  it("renders the requested element and merges className", () => {
    render(<HyperText as="h2" className="custom-x" data-testid="h">Title</HyperText>)
    const el = screen.getByTestId("h")
    expect(el.tagName).toBe("H2")
    expect(el).toHaveClass("custom-x", "font-bold")
  })

  it("scrambles on hover then settles on the real text", () => {
    const raf: FrameRequestCallback[] = []
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => raf.push(cb))
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined)
    vi.spyOn(performance, "now").mockReturnValue(0)
    render(<HyperText data-testid="h" characterSet="#">abc</HyperText>)
    const el = screen.getByTestId("h")
    act(() => {
      el.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }))
    })
    act(() => {
      // React listens to mouseover for onMouseEnter
      raf.shift()?.(100)
    })
    expect(el.getAttribute("data-animating")).toBe("true")
    expect(el.querySelector('[aria-hidden="true"]')?.textContent).toContain("#")
    act(() => {
      raf.shift()?.(5000)
    })
    expect(el.getAttribute("data-animating")).toBeNull()
    expect(el.querySelector('[aria-hidden="true"]')?.textContent).toBe("abc")
    vi.restoreAllMocks()
  })

  it("stays static when motion is none", () => {
    setMotion("none")
    const spy = vi.spyOn(window, "requestAnimationFrame")
    const { container } = render(<HyperText trigger="mount">Static</HyperText>)
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(spy).not.toHaveBeenCalled()
    expect(container.querySelector('[aria-hidden="true"]')?.textContent).toBe("Static")
    spy.mockRestore()
  })

  it("makes the element focusable only on request", () => {
    const { rerender } = render(<HyperText data-testid="h">Hi</HyperText>)
    expect(screen.getByTestId("h")).not.toHaveAttribute("tabindex")
    rerender(<HyperText data-testid="h" focusable>Hi</HyperText>)
    expect(screen.getByTestId("h")).toHaveAttribute("tabindex", "0")
  })

  it("cancels pending frames and timers on unmount", () => {
    const cancel = vi.spyOn(window, "cancelAnimationFrame")
    vi.spyOn(window, "requestAnimationFrame").mockImplementation(() => 7)
    const { unmount } = render(<HyperText trigger="mount">Bye</HyperText>)
    act(() => {
      vi.advanceTimersByTime(10)
    })
    unmount()
    expect(cancel).toHaveBeenCalledWith(7)
    vi.restoreAllMocks()
  })
})
