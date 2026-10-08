import * as React from "react"
import { act, cleanup, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { registerEngine, unregisterEngine, type MotionEngine } from "@glinui/motion"

import {
  BentoGrid,
  BentoCard,
  BlurFade,
  HyperText,
  NumberTicker,
  RevealText,
  Terminal,
  AnimatedSpan,
  TextReveal,
  Typewriter,
  WordRotate
} from "../index"
import { installIntersectionObserver, installWebAnimations, MockIntersectionObserver } from "./motion-test-utils"

const stop = vi.fn()
const spy: MotionEngine = {
  name: "spy",
  capabilities: { spring: false, scrollTrigger: false, timeline: false, splitText: true, runtime: "native" },
  reveal: vi.fn(() => stop),
  stagger: vi.fn(() => stop),
  countTo: vi.fn(() => stop),
  splitText: vi.fn(() => stop)
}

let restoreIO: () => void
let wa: ReturnType<typeof installWebAnimations>

beforeEach(() => {
  restoreIO = installIntersectionObserver()
  wa = installWebAnimations()
  registerEngine("spy", spy)
  document.documentElement.removeAttribute("data-glin-motion")
  document.documentElement.removeAttribute("data-glin-engine")
})

afterEach(() => {
  cleanup()
  restoreIO()
  wa.restore()
  unregisterEngine("spy")
  vi.clearAllMocks()
  vi.useRealTimers()
})

describe("NumberTicker", () => {
  it("renders the final value as static markup and hides the digits layer", () => {
    const { container } = render(<NumberTicker value={1250} />)
    expect(container.firstElementChild?.firstElementChild?.textContent).toBe("1250")
    expect(container.querySelector("[aria-hidden='true']")).not.toBeNull()
  })
  it("forwards the engine prop to countTo and cleans up on unmount", () => {
    const { unmount } = render(<NumberTicker value={40} from={10} duration={2} engine="spy" />)
    expect(spy.countTo).toHaveBeenCalledTimes(1)
    const call = vi.mocked(spy.countTo).mock.calls[0]
    expect(call[1]).toBe(10)
    expect(call[2]).toBe(40)
    expect(call[3]).toMatchObject({ duration: 2000 })
    unmount()
    expect(stop).toHaveBeenCalled()
  })
  it("motion=none shows the final value without observing", () => {
    const { container } = render(<NumberTicker value={7} motion="none" />)
    expect(container.querySelector("[aria-hidden='true']")?.textContent).toBe("7")
    expect(MockIntersectionObserver.instances).toHaveLength(0)
  })
  it("motion=subtle jumps to the final value", () => {
    const { container } = render(<NumberTicker value={9} motion="subtle" />)
    expect(container.querySelector("[aria-hidden='true']")?.textContent).toBe("9")
    expect(MockIntersectionObserver.instances).toHaveLength(0)
  })
})

describe("NumberTicker (css engine progression)", () => {
  it("resets to 0 on mount, holds until in view, then progresses to the final value", () => {
    const rafs: FrameRequestCallback[] = []
    let now = 0
    vi.spyOn(performance, "now").mockImplementation(() => now)
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => rafs.push(cb))
    vi.stubGlobal("cancelAnimationFrame", () => undefined)
    const frame = (t: number) => {
      now = t
      rafs.splice(0).forEach((cb) => cb(t))
    }
    const { container } = render(<NumberTicker value={100} duration={1} />)
    const digits = container.querySelector("[aria-hidden='true']") as HTMLElement
    expect(digits.textContent).toBe("0")
    act(() => MockIntersectionObserver.active.forEach((io) => io.trigger(true)))
    act(() => frame(1))
    act(() => frame(500))
    const mid = Number(digits.textContent)
    expect(mid).toBeGreaterThan(0)
    expect(mid).toBeLessThan(100)
    act(() => frame(1200))
    expect(digits.textContent).toBe("100")
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })
})

describe("BlurFade", () => {
  it("starts hidden with no inline blur transition and animates with blur on intersect", () => {
    render(<BlurFade data-testid="b">hi</BlurFade>)
    const el = screen.getByTestId("b")
    expect(el.style.opacity).toBe("0")
    act(() => MockIntersectionObserver.instances[0].trigger(true))
    expect(wa.calls[0].keyframes[0]).toMatchObject({ opacity: 0 })
    expect(wa.calls[0].keyframes[0]).toHaveProperty("filter")
  })
  it("forwards engine and options", () => {
    render(<BlurFade engine="spy" blur={4} yOffset={20}>x</BlurFade>)
    expect(spy.reveal).toHaveBeenCalledWith(expect.any(HTMLElement), expect.objectContaining({ blur: 4, distance: 20 }))
  })
  it("motion=none is static and subtle is opacity only", () => {
    render(<BlurFade motion="none" data-testid="n">x</BlurFade>)
    expect(screen.getByTestId("n").style.opacity).toBe("")
    expect(wa.calls).toHaveLength(0)
    cleanup()
    render(<BlurFade motion="subtle">x</BlurFade>)
    act(() => MockIntersectionObserver.instances[0].trigger(true))
    expect(wa.calls[0].keyframes[0]).not.toHaveProperty("filter")
  })
  it("releases the observer on unmount", () => {
    const { unmount } = render(<BlurFade>x</BlurFade>)
    unmount()
    expect(MockIntersectionObserver.active).toHaveLength(0)
  })
})

describe("TextReveal", () => {
  it("defaults to scroll mode and never calls the engine", () => {
    render(<TextReveal text="one two three" engine="spy" motion="none" />)
    expect(spy.splitText).not.toHaveBeenCalled()
  })
  it("reveal mode forwards the engine to splitText with word parts", () => {
    const { container } = render(<TextReveal mode="reveal" text="one two three" engine="spy" />)
    expect(container.querySelectorAll("[data-glin-part='words']")).toHaveLength(3)
    expect(spy.splitText).toHaveBeenCalledTimes(1)
  })
  it("reveal mode with motion=none leaves words visible", () => {
    const { container } = render(<TextReveal mode="reveal" text="a b" motion="none" />)
    expect(container.querySelector("p")?.style.opacity).toBe("")
  })
})

describe("RevealText", () => {
  it("renders the text and drives the wipe through the engine", () => {
    render(<RevealText text="Ship it" engine="spy" />)
    expect(screen.getByText("Ship it")).toBeInTheDocument()
    expect(spy.countTo).toHaveBeenCalledTimes(1)
  })
  it("writes a clip-path while running and clears it on cleanup", () => {
    const { unmount } = render(<RevealText text="Ship it" data-testid="r" engine="spy" />)
    const el = screen.getByTestId("r")
    const format = vi.mocked(spy.countTo).mock.calls[0][3]?.format as (v: number) => string
    format(0.5)
    expect(el.style.clipPath).toContain("inset")
    unmount()
    expect(stop).toHaveBeenCalled()
  })
  it("motion=none shows the text unclipped", () => {
    render(<RevealText text="Ship it" motion="none" data-testid="r" />)
    expect(screen.getByTestId("r").style.clipPath).toBe("")
  })
  it("motion=subtle fades instead of wiping", () => {
    render(<RevealText text="Ship it" motion="subtle" />)
    act(() => MockIntersectionObserver.instances[0].trigger(true))
    expect(wa.calls[0].keyframes[0]).not.toHaveProperty("transform")
  })
})

describe("WordRotate", () => {
  it("shows the first word statically and does not animate on mount", () => {
    render(<WordRotate words={["fast", "calm"]} engine="spy" />)
    expect(screen.getByText("fast")).toBeInTheDocument()
    expect(spy.reveal).not.toHaveBeenCalled()
  })
  it("enters the next word through the engine after a cycle", () => {
    vi.useFakeTimers()
    render(<WordRotate words={["fast", "calm"]} duration={1000} animationDuration={100} engine="spy" />)
    act(() => {
      vi.advanceTimersByTime(1000 + 100)
    })
    expect(screen.getByText("calm")).toBeInTheDocument()
    expect(spy.reveal).toHaveBeenCalledTimes(1)
  })
  it("motion=none does not rotate and clears timers on unmount", () => {
    vi.useFakeTimers()
    render(<WordRotate words={["a", "b"]} duration={500} motion="none" />)
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(screen.getByText("a")).toBeInTheDocument()
    cleanup()
    expect(vi.getTimerCount()).toBe(0)
  })
})

describe("Typewriter", () => {
  it("types with the css timer fallback", () => {
    vi.useFakeTimers()
    render(<Typewriter text="abc" speed={10} />)
    act(() => {
      vi.advanceTimersByTime(25)
    })
    expect(screen.getByLabelText("abc").textContent).toContain("ab")
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(screen.getByLabelText("abc").textContent).toContain("abc")
  })
  it("uses the engine clock for non-css engines", () => {
    vi.useFakeTimers()
    const { unmount } = render(<Typewriter text="abc" engine="spy" />)
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(spy.countTo).toHaveBeenCalledTimes(1)
    unmount()
    expect(stop).toHaveBeenCalled()
  })
  it("motion=none shows the first word at once", () => {
    render(<Typewriter text="done" motion="none" />)
    expect(screen.getByLabelText("done").textContent).toContain("done")
  })
  it("motion=subtle shows the first word at once", () => {
    render(<Typewriter words={["one", "two"]} motion="subtle" />)
    expect(screen.getByLabelText("one, two").textContent).toContain("one")
  })
})

describe("HyperText", () => {
  it("mount trigger forwards the engine", () => {
    const { unmount } = render(<HyperText trigger="mount" engine="spy">Hello</HyperText>)
    expect(spy.countTo).toHaveBeenCalledTimes(1)
    unmount()
    expect(stop).toHaveBeenCalled()
  })
  it("view trigger waits for the engine in-view and hover does nothing until hovered", () => {
    render(<HyperText engine="spy">Hello</HyperText>)
    expect(spy.countTo).not.toHaveBeenCalled()
  })
  it("motion=none never calls a library engine", () => {
    render(<HyperText trigger="mount" engine="spy" motion="none">Hello</HyperText>)
    expect(spy.countTo).not.toHaveBeenCalled()
  })
})

describe("Terminal", () => {
  it("renders the final text first and reveals lines through the engine", () => {
    vi.useFakeTimers()
    render(
      <Terminal engine="spy" startOnView={false} showCopy={false}>
        <AnimatedSpan>first</AnimatedSpan>
        <AnimatedSpan>second</AnimatedSpan>
      </Terminal>
    )
    act(() => {
      vi.advanceTimersByTime(50)
    })
    expect(spy.reveal).toHaveBeenCalled()
  })
  it("motion=none is plain text with no engine calls", () => {
    render(
      <Terminal engine="spy" motion="none">
        <AnimatedSpan>only</AnimatedSpan>
      </Terminal>
    )
    expect(spy.reveal).not.toHaveBeenCalled()
  })
})

describe("BentoGrid", () => {
  const cards = (
    <>
      <BentoCard name="One" description="a" />
      <BentoCard name="Two" description="b" />
    </>
  )
  it("is static by default (no entrance)", () => {
    render(<BentoGrid engine="spy">{cards}</BentoGrid>)
    expect(spy.stagger).not.toHaveBeenCalled()
  })
  it("entrance staggers the cards through the engine and cleans up", () => {
    const { unmount } = render(<BentoGrid entrance engine="spy">{cards}</BentoGrid>)
    expect(spy.stagger).toHaveBeenCalledTimes(1)
    expect(vi.mocked(spy.stagger).mock.calls[0][0]).toHaveLength(2)
    unmount()
    expect(stop).toHaveBeenCalled()
  })
  it("entrance with motion=none leaves cards visible", () => {
    const { container } = render(<BentoGrid entrance motion="none">{cards}</BentoGrid>)
    expect((container.firstElementChild as HTMLElement).style.opacity).toBe("")
  })
})
