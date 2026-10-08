import { act, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { MagicCard } from "../components/magic-card"
import { MotionEngineProvider } from "../components/motion-engine"
import { installPointerEvent, mockMedia } from "./a2-test-utils"

let restoreMedia: (() => void) | undefined
let restorePointer: (() => void) | undefined
beforeEach(() => {
  restorePointer = installPointerEvent()
  vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame"] })
})
afterEach(() => {
  restorePointer?.()
  restoreMedia?.()
  restoreMedia = undefined
  vi.useRealTimers()
})

function stubRect(el: HTMLElement) {
  el.getBoundingClientRect = () =>
    ({ width: 200, height: 100, top: 20, left: 10, right: 210, bottom: 120, x: 10, y: 20, toJSON: () => ({}) }) as DOMRect
}

describe("MagicCard", () => {
  it("renders children above decorative layers, merges className", () => {
    const { container } = render(
      <MagicCard className="extra" data-testid="m">
        <button>Inside</button>
      </MagicCard>
    )
    expect(screen.getByRole("button", { name: "Inside" })).toBeVisible()
    expect(screen.getByTestId("m")).toHaveClass("extra")
    container.querySelectorAll("[data-slot^='magic-card-']").forEach((el) => expect(el).toHaveAttribute("aria-hidden", "true"))
  })

  it("renders glass variant", () => {
    render(<MagicCard variant="glass" data-testid="m">g</MagicCard>)
    expect(screen.getByTestId("m")).toHaveAttribute("data-variant", "glass")
    expect(screen.getByTestId("m").className).toContain("backdrop-blur")
  })

  it("writes pointer position on fine pointers via rAF", () => {
    restoreMedia = mockMedia(["pointer: fine"])
    render(
      <MotionEngineProvider motion="full">
        <MagicCard data-testid="m">x</MagicCard>
      </MotionEngineProvider>
    )
    const card = screen.getByTestId("m")
    stubRect(card)
    fireEvent.pointerEnter(card, { clientX: 60, clientY: 70, pointerType: "mouse" })
    fireEvent.pointerMove(card, { clientX: 110, clientY: 90, pointerType: "mouse" })
    act(() => {
      vi.advanceTimersByTime(40)
    })
    expect(card).toHaveAttribute("data-active", "true")
    expect(card.style.getPropertyValue("--mx")).toBe("100px")
    expect(card.style.getPropertyValue("--my")).toBe("70px")
    fireEvent.pointerLeave(card)
    expect(card).toHaveAttribute("data-active", "false")
  })

  it("ignores pointer effects on coarse pointers", () => {
    restoreMedia = mockMedia([])
    render(
      <MotionEngineProvider motion="full">
        <MagicCard data-testid="m">x</MagicCard>
      </MotionEngineProvider>
    )
    const card = screen.getByTestId("m")
    stubRect(card)
    fireEvent.pointerEnter(card, { clientX: 60, clientY: 70, pointerType: "mouse" })
    fireEvent.pointerMove(card, { clientX: 110, clientY: 90, pointerType: "mouse" })
    act(() => {
      vi.advanceTimersByTime(40)
    })
    expect(card).toHaveAttribute("data-active", "false")
    expect(card.style.getPropertyValue("--mx")).toBe("")
  })

  it("is static at motion level none", () => {
    restoreMedia = mockMedia(["pointer: fine"])
    render(
      <MotionEngineProvider motion="none">
        <MagicCard data-testid="m">x</MagicCard>
      </MotionEngineProvider>
    )
    const card = screen.getByTestId("m")
    stubRect(card)
    fireEvent.pointerEnter(card, { clientX: 60, clientY: 70, pointerType: "mouse" })
    expect(card).toHaveAttribute("data-active", "false")
  })

  it("is static when prefers-reduced-motion is set", () => {
    restoreMedia = mockMedia(["pointer: fine", "prefers-reduced-motion"])
    render(<MagicCard data-testid="m">x</MagicCard>)
    const card = screen.getByTestId("m")
    stubRect(card)
    fireEvent.pointerEnter(card, { clientX: 60, clientY: 70, pointerType: "mouse" })
    expect(card).toHaveAttribute("data-active", "false")
  })

  it("applies gradient props as CSS variables and cancels pending frames on unmount", () => {
    const cancel = vi.spyOn(globalThis, "cancelAnimationFrame")
    restoreMedia = mockMedia(["pointer: fine"])
    const { unmount } = render(
      <MagicCard data-testid="m" gradientSize={300} gradientFrom="red" gradientTo="blue" gradientColor="green">
        x
      </MagicCard>
    )
    const card = screen.getByTestId("m")
    expect(card.style.getPropertyValue("--mc-size")).toBe("300px")
    expect(card.style.getPropertyValue("--mc-from")).toBe("red")
    stubRect(card)
    fireEvent.pointerMove(card, { clientX: 20, clientY: 30, pointerType: "mouse" })
    unmount()
    expect(cancel).toHaveBeenCalled()
  })

  it("calls user handlers and renders on the server", () => {
    const onPointerEnter = vi.fn()
    render(<MagicCard data-testid="m" onPointerEnter={onPointerEnter}>x</MagicCard>)
    fireEvent.pointerEnter(screen.getByTestId("m"))
    expect(onPointerEnter).toHaveBeenCalled()
    expect(() => renderToString(<MagicCard>ssr</MagicCard>)).not.toThrow()
  })
})
