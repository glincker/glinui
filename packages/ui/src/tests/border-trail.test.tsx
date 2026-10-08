import { act, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { BorderTrail } from "../components/border-trail"
import { MotionEngineProvider } from "../components/motion-engine"
import { MockIntersectionObserver } from "./motion-test-utils"

type FakeAnimation = { pause: ReturnType<typeof vi.fn>; play: ReturnType<typeof vi.fn>; cancel: ReturnType<typeof vi.fn> }
const created: Array<{ keyframes: Keyframe[]; options: KeyframeAnimationOptions; anim: FakeAnimation }> = []
const original = HTMLElement.prototype.animate

function stubAnimate() {
  created.length = 0
  HTMLElement.prototype.animate = function (keyframes: Keyframe[], options: KeyframeAnimationOptions) {
    const anim: FakeAnimation = { pause: vi.fn(), play: vi.fn(), cancel: vi.fn() }
    created.push({ keyframes, options, anim })
    return anim as unknown as Animation
  } as unknown as typeof HTMLElement.prototype.animate
}

function stubSupports(value: boolean) {
  vi.stubGlobal("CSS", { supports: () => value })
}

afterEach(() => {
  HTMLElement.prototype.animate = original
  vi.unstubAllGlobals()
  MockIntersectionObserver.reset()
})

describe("BorderTrail", () => {
  it("is a decorative aria-hidden layer and merges className", () => {
    render(<BorderTrail data-testid="t" className="custom-x" />)
    const el = screen.getByTestId("t")
    expect(el).toHaveAttribute("aria-hidden", "true")
    expect(el).toHaveClass("custom-x", "pointer-events-none", "rounded-[inherit]")
  })

  it("applies size, width, color and explicit radius as variables", () => {
    render(<BorderTrail data-testid="t" size={80} borderWidth={2} color="red" radius={20} />)
    const el = screen.getByTestId("t")
    expect(el.style.getPropertyValue("--bt-size")).toBe("80px")
    expect(el.style.getPropertyValue("--bt-bw")).toBe("2px")
    expect(el.style.getPropertyValue("--bt-color")).toBe("red")
    expect(el.style.getPropertyValue("--bt-r")).toBe("20px")
  })

  it("supports plain and glass variants", () => {
    render(<BorderTrail data-testid="t" variant="glass" />)
    expect(screen.getByTestId("t").className).toContain("color-mix")
  })

  it("animates offset-distance when offset-path rect() is supported, and cancels on unmount", () => {
    stubSupports(true)
    stubAnimate()
    const { unmount } = render(
      <MotionEngineProvider motion="full">
        <BorderTrail data-testid="t" duration={3} />
      </MotionEngineProvider>
    )
    expect(screen.getByTestId("t")).toHaveAttribute("data-mode", "path")
    expect(created[0].options.duration).toBe(3000)
    expect(created[0].keyframes[1]).toMatchObject({ offsetDistance: "100%" })
    unmount()
    expect(created[0].anim.cancel).toHaveBeenCalled()
  })

  it("falls back to a rotating conic ring without offset-path rect()", () => {
    stubSupports(false)
    stubAnimate()
    render(
      <MotionEngineProvider motion="full">
        <BorderTrail data-testid="t" />
      </MotionEngineProvider>
    )
    expect(screen.getByTestId("t")).toHaveAttribute("data-mode", "conic")
    expect(String(created.at(-1)?.keyframes[1].transform)).toContain("rotate(360deg)")
  })

  it("is static at none and subtle", () => {
    stubSupports(true)
    stubAnimate()
    render(
      <MotionEngineProvider motion="none">
        <BorderTrail data-testid="t" />
      </MotionEngineProvider>
    )
    expect(created).toHaveLength(0)
    expect(screen.getByTestId("t")).toHaveAttribute("data-animated", "false")
  })

  it("pauses offscreen", () => {
    stubSupports(true)
    stubAnimate()
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver)
    render(
      <MotionEngineProvider motion="full">
        <BorderTrail />
      </MotionEngineProvider>
    )
    act(() => MockIntersectionObserver.instances[0].trigger(false))
    expect(created[0].anim.pause).toHaveBeenCalled()
  })
})
