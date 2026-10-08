import { act, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { GooeyTextReveal } from "../components/gooey-text-reveal"
import { MotionEngineProvider } from "../components/motion-engine"
import { MockIntersectionObserver } from "./motion-test-utils"

type FakeAnimation = {
  pause: ReturnType<typeof vi.fn>
  play: ReturnType<typeof vi.fn>
  cancel: ReturnType<typeof vi.fn>
  onfinish: null | (() => void)
}
const created: Array<{ el: Element; keyframes: Keyframe[]; options: KeyframeAnimationOptions; anim: FakeAnimation }> = []
const original = HTMLElement.prototype.animate

function stubAnimate() {
  created.length = 0
  HTMLElement.prototype.animate = function (this: HTMLElement, keyframes: Keyframe[], options: KeyframeAnimationOptions) {
    const anim: FakeAnimation = { pause: vi.fn(), play: vi.fn(), cancel: vi.fn(), onfinish: null }
    created.push({ el: this, keyframes, options, anim })
    return anim as unknown as Animation
  } as unknown as typeof HTMLElement.prototype.animate
}

afterEach(() => {
  HTMLElement.prototype.animate = original
  vi.unstubAllGlobals()
  vi.useRealTimers()
  MockIntersectionObserver.reset()
})

describe("GooeyTextReveal", () => {
  it("keeps the real string as the accessible name and hides the animated words", () => {
    render(<GooeyTextReveal text="Melt into focus" />)
    const heading = screen.getByRole("heading", { level: 2, name: "Melt into focus" })
    expect(heading.querySelector("[data-slot=gooey-text-stage]")).toHaveAttribute("aria-hidden", "true")
    expect(heading.querySelector("svg")).toHaveAttribute("aria-hidden", "true")
  })

  it("renders the requested element", () => {
    render(<GooeyTextReveal as="h1" text="Hello" />)
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument()
  })

  it("gives each instance a unique filter id and references it while animating", () => {
    stubAnimate()
    render(
      <MotionEngineProvider motion="full">
        <GooeyTextReveal text="One two" trigger="mount" data-testid="a" />
        <GooeyTextReveal text="Three four" trigger="mount" data-testid="b" />
      </MotionEngineProvider>
    )
    const ids = Array.from(document.querySelectorAll("filter")).map((f) => f.id)
    expect(new Set(ids).size).toBe(2)
    expect(ids[0]).not.toContain(":")
    const stage = screen.getByTestId("a").querySelector("[data-slot=gooey-text-stage]") as HTMLElement
    expect(stage.style.getPropertyValue("--gtr-filter")).toBe(`url(#${ids[0]})`)
  })

  it("staggers words on mount and removes the filter when the last word finishes", () => {
    stubAnimate()
    render(
      <MotionEngineProvider motion="full">
        <GooeyTextReveal text="a b c" trigger="mount" stagger={100} duration={500} data-testid="g" />
      </MotionEngineProvider>
    )
    expect(created).toHaveLength(3)
    expect(created.map((c) => c.options.delay)).toEqual([0, 100, 200])
    const stage = screen.getByTestId("g").querySelector("[data-slot=gooey-text-stage]") as HTMLElement
    expect(stage.style.getPropertyValue("--gtr-filter")).not.toBe("")
    act(() => created[2].anim.onfinish?.())
    expect(stage.style.getPropertyValue("--gtr-filter")).toBe("")
  })

  it("waits for the viewport with trigger view, then reveals once", () => {
    stubAnimate()
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver)
    render(
      <MotionEngineProvider motion="full">
        <GooeyTextReveal text="a b" data-testid="g" />
      </MotionEngineProvider>
    )
    expect(created).toHaveLength(0)
    const words = screen.getByTestId("g").querySelectorAll("[data-revealed]")
    expect(words[0]).toHaveAttribute("data-revealed", "false")
    act(() => MockIntersectionObserver.instances.at(-1)!.trigger(true))
    expect(created).toHaveLength(2)
    expect(screen.getByTestId("g").querySelector("[data-revealed]")).toHaveAttribute("data-revealed", "true")
  })

  it("subtle is an opacity-only fade without the goo filter", () => {
    stubAnimate()
    render(
      <MotionEngineProvider motion="subtle">
        <GooeyTextReveal text="a b" trigger="mount" data-testid="g" />
      </MotionEngineProvider>
    )
    expect(created).toHaveLength(2)
    expect(Object.keys(created[0].keyframes[0])).toEqual(["opacity"])
    const stage = screen.getByTestId("g").querySelector("[data-slot=gooey-text-stage]") as HTMLElement
    expect(stage.style.getPropertyValue("--gtr-filter")).toBe("")
  })

  it("none renders the final text without animation", () => {
    stubAnimate()
    render(
      <MotionEngineProvider motion="none">
        <GooeyTextReveal text="a b" trigger="mount" data-testid="g" />
      </MotionEngineProvider>
    )
    expect(created).toHaveLength(0)
    expect(screen.getByTestId("g")).toHaveAttribute("data-animated", "false")
    expect(screen.getByTestId("g").querySelector("[data-revealed]")).toHaveAttribute("data-revealed", "true")
  })

  it("morphs between phrases and labels them all", () => {
    vi.useFakeTimers()
    stubAnimate()
    render(
      <MotionEngineProvider motion="full">
        <GooeyTextReveal text={["Design", "Build", "Ship"]} hold={1000} duration={400} data-testid="m" />
      </MotionEngineProvider>
    )
    const root = screen.getByTestId("m")
    expect(root).toHaveAttribute("aria-label", "Design, Build, Ship")
    expect(root).toHaveAttribute("data-mode", "morph")
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(created).toHaveLength(2)
    act(() => created[0].anim.onfinish?.())
    const current = root.querySelector("[data-current=true]")
    expect(current?.textContent).toBe("Build")
  })

  it("cancels running animations on unmount", () => {
    stubAnimate()
    const { unmount } = render(
      <MotionEngineProvider motion="full">
        <GooeyTextReveal text="a b" trigger="mount" />
      </MotionEngineProvider>
    )
    unmount()
    expect(created.every((c) => c.anim.cancel.mock.calls.length > 0)).toBe(true)
  })
})
