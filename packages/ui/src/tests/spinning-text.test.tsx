import { act, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { MotionEngineProvider } from "../components/motion-engine"
import { SpinningText } from "../components/spinning-text"
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

afterEach(() => {
  HTMLElement.prototype.animate = original
  vi.unstubAllGlobals()
  MockIntersectionObserver.reset()
})

describe("SpinningText", () => {
  it("exposes the real string as the accessible name and hides the glyphs", () => {
    render(<SpinningText>glin ui</SpinningText>)
    const root = screen.getByRole("img", { name: "glin ui" })
    const ring = root.querySelector("[data-slot=spinning-text-ring]")
    expect(ring).toHaveAttribute("aria-hidden", "true")
    expect(ring?.children).toHaveLength(7)
  })

  it("places glyphs with per-glyph variables and applies props", () => {
    render(
      <SpinningText fontSize={2} radius={7} className="custom-x">
        abc
      </SpinningText>
    )
    const root = screen.getByRole("img")
    expect(root).toHaveClass("custom-x")
    expect(root.style.getPropertyValue("--st-fs")).toBe("2")
    expect(root.style.getPropertyValue("--st-r")).toBe("7")
    const glyphs = root.querySelectorAll("[data-slot=spinning-text-ring] > span")
    expect((glyphs[2] as HTMLElement).style.getPropertyValue("--st-i")).toBe("2")
    expect(root.querySelector("[data-slot=spinning-text-ring]")).toHaveAttribute("data-ready", "true")
  })

  it("rotates the ring at level full and cancels on unmount", () => {
    stubAnimate()
    const { unmount } = render(
      <MotionEngineProvider motion="full">
        <SpinningText duration={4}>abc</SpinningText>
      </MotionEngineProvider>
    )
    expect(created).toHaveLength(1)
    expect(created[0].options.duration).toBe(4000)
    expect(created[0].keyframes[1].transform).toBe("rotate(360deg)")
    unmount()
    expect(created[0].anim.cancel).toHaveBeenCalled()
  })

  it("reverses direction", () => {
    stubAnimate()
    render(
      <MotionEngineProvider motion="full">
        <SpinningText reverse>abc</SpinningText>
      </MotionEngineProvider>
    )
    expect(created[0].keyframes[1].transform).toBe("rotate(-360deg)")
  })

  it("renders a static ring at none and subtle", () => {
    stubAnimate()
    const { unmount } = render(
      <MotionEngineProvider motion="none">
        <SpinningText>abc</SpinningText>
      </MotionEngineProvider>
    )
    expect(created).toHaveLength(0)
    expect(screen.getByRole("img")).toHaveAttribute("data-animated", "false")
    unmount()
    render(
      <MotionEngineProvider motion="subtle">
        <SpinningText>abc</SpinningText>
      </MotionEngineProvider>
    )
    expect(created).toHaveLength(0)
  })

  it("pauses on hover when pauseOnHover is set", () => {
    stubAnimate()
    render(
      <MotionEngineProvider motion="full">
        <SpinningText pauseOnHover>abc</SpinningText>
      </MotionEngineProvider>
    )
    const root = screen.getByRole("img")
    fireEvent.pointerEnter(root)
    expect(created[0].anim.pause).toHaveBeenCalled()
  })

  it("pauses offscreen and when the tab is hidden", () => {
    stubAnimate()
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver)
    render(
      <MotionEngineProvider motion="full">
        <SpinningText>abc</SpinningText>
      </MotionEngineProvider>
    )
    act(() => MockIntersectionObserver.instances[0].trigger(false))
    expect(created[0].anim.pause).toHaveBeenCalled()
    act(() => MockIntersectionObserver.instances[0].trigger(true))
    expect(created[0].anim.play).toHaveBeenCalled()
  })
})
