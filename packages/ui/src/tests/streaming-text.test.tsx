import { act, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, vi } from "vitest"

import { StreamingText } from "../components/streaming-text"

function visible(container: HTMLElement) {
  return container.querySelector('[aria-hidden="true"]')?.textContent ?? ""
}

const originalMatchMedia = window.matchMedia

describe("StreamingText", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
    window.matchMedia = originalMatchMedia
  })

  it("reveals progressively and fires onDone once", () => {
    const onDone = vi.fn()
    const { container } = render(<StreamingText text="abc" speed={10} onDone={onDone} />)
    expect(visible(container)).toBe("")
    act(() => {
      vi.advanceTimersByTime(10)
    })
    expect(visible(container)).toBe("a")
    expect(onDone).not.toHaveBeenCalled()
    act(() => {
      vi.advanceTimersByTime(40)
    })
    expect(visible(container)).toBe("abc")
    expect(onDone).toHaveBeenCalledTimes(1)
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(onDone).toHaveBeenCalledTimes(1)
  })

  it("exposes the full text to assistive tech immediately", () => {
    render(<StreamingText text="full sentence" speed={50} />)
    expect(screen.getByText("full sentence", { selector: ".sr-only" })).toBeInTheDocument()
  })

  it("renders instantly with the instant prop", () => {
    const onDone = vi.fn()
    const { container } = render(<StreamingText text="hello" instant onDone={onDone} />)
    expect(visible(container)).toBe("hello")
    expect(onDone).toHaveBeenCalledTimes(1)
  })

  it("renders instantly under reduced motion", () => {
    window.matchMedia = vi.fn().mockImplementation((q: string) => ({
      matches: true, media: q, addEventListener: vi.fn(), removeEventListener: vi.fn(), addListener: vi.fn(), removeListener: vi.fn()
    })) as unknown as typeof window.matchMedia
    const { container } = render(<StreamingText text="calm" />)
    expect(visible(container)).toBe("calm")
  })

  it("continues when text is extended instead of restarting", () => {
    const { container, rerender } = render(<StreamingText text="ab" speed={10} />)
    act(() => {
      vi.advanceTimersByTime(20)
    })
    expect(visible(container)).toBe("ab")
    rerender(<StreamingText text="abcd" speed={10} />)
    expect(visible(container)).toBe("ab")
    act(() => {
      vi.advanceTimersByTime(20)
    })
    expect(visible(container)).toBe("abcd")
  })

  it("hides the caret when finished or disabled", () => {
    const { container } = render(<StreamingText text="x" instant />)
    expect(container.querySelector(".animate-blink")).toBeNull()
  })
})
