import { act, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ImageComparison } from "../components/image-comparison"
import { installPointerEvent } from "./a2-test-utils"
import { GlinProvider } from "../components/glin-provider"

const layers = { before: <div>Old UI</div>, after: <div>New UI</div> }

let restorePointer: () => void
beforeEach(() => {
  restorePointer = installPointerEvent()
})
afterEach(() => restorePointer())

describe("ImageComparison", () => {
  it("renders both ReactNode layers and a slider with value semantics", () => {
    render(<ImageComparison {...layers} />)
    expect(screen.getByText("Old UI")).toBeInTheDocument()
    expect(screen.getByText("New UI")).toBeInTheDocument()
    const slider = screen.getByRole("slider", { name: "Comparison position" })
    expect(slider).toHaveAttribute("aria-valuenow", "50")
    expect(slider).toHaveAttribute("aria-valuemin", "0")
    expect(slider).toHaveAttribute("aria-valuemax", "100")
    expect(slider).toHaveAttribute("aria-orientation", "horizontal")
  })

  it("writes the split to a CSS variable", () => {
    const { container } = render(<ImageComparison {...layers} defaultValue={30} />)
    expect((container.firstChild as HTMLElement).style.getPropertyValue("--ic-pos")).toBe("30%")
  })

  it("moves with arrow, shift, page, Home and End keys and clamps", () => {
    const onValueChange = vi.fn()
    render(<ImageComparison {...layers} step={2} onValueChange={onValueChange} />)
    const slider = screen.getByRole("slider")
    fireEvent.keyDown(slider, { key: "ArrowRight" })
    expect(slider).toHaveAttribute("aria-valuenow", "52")
    fireEvent.keyDown(slider, { key: "ArrowLeft", shiftKey: true })
    expect(slider).toHaveAttribute("aria-valuenow", "42")
    fireEvent.keyDown(slider, { key: "PageUp" })
    expect(slider).toHaveAttribute("aria-valuenow", "32")
    fireEvent.keyDown(slider, { key: "Home" })
    expect(slider).toHaveAttribute("aria-valuenow", "0")
    fireEvent.keyDown(slider, { key: "ArrowLeft" })
    expect(onValueChange).toHaveBeenLastCalledWith(0)
    fireEvent.keyDown(slider, { key: "End" })
    expect(slider).toHaveAttribute("aria-valuenow", "100")
  })

  it("supports vertical orientation with up and down keys", () => {
    render(<ImageComparison {...layers} orientation="vertical" />)
    const slider = screen.getByRole("slider")
    expect(slider).toHaveAttribute("aria-orientation", "vertical")
    fireEvent.keyDown(slider, { key: "ArrowDown" })
    expect(slider).toHaveAttribute("aria-valuenow", "52")
    fireEvent.keyDown(slider, { key: "ArrowUp" })
    fireEvent.keyDown(slider, { key: "ArrowUp" })
    expect(slider).toHaveAttribute("aria-valuenow", "48")
  })

  it("is controlled by value", () => {
    const { rerender } = render(<ImageComparison {...layers} value={20} />)
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "20")
    rerender(<ImageComparison {...layers} value={80} />)
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "80")
  })

  it("drags with the pointer using the frame rect", () => {
    const queue: FrameRequestCallback[] = []
    const raf = vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      queue.push(cb)
      return queue.length
    })
    const flush = () => act(() => queue.splice(0).forEach((cb) => cb(0)))
    const { container } = render(<ImageComparison {...layers} />)
    const root = container.firstChild as HTMLElement
    root.getBoundingClientRect = () => ({ left: 0, right: 200, top: 0, bottom: 100, width: 200, height: 100, x: 0, y: 0, toJSON: () => ({}) })
    fireEvent.pointerDown(root, { clientX: 150, clientY: 10, button: 0 })
    flush()
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "75")
    expect(root).toHaveAttribute("data-dragging", "true")
    fireEvent.pointerMove(root, { clientX: 40, clientY: 10 })
    flush()
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "20")
    fireEvent.pointerUp(root)
    expect(root).toHaveAttribute("data-dragging", "false")
    raf.mockRestore()
  })

  it("labels the layers and hides decorative chips from assistive tech", () => {
    render(<ImageComparison {...layers} beforeLabel="Draft" afterLabel="Final" />)
    expect(screen.getByRole("group", { name: "Draft" })).toBeInTheDocument()
    expect(screen.getByRole("group", { name: "Final" })).toBeInTheDocument()
  })

  it("resolves default and minimal ambient variants", () => {
    const { container, rerender } = render(<ImageComparison {...layers} />)
    const before = (container.firstChild as HTMLElement).className
    rerender(
      <GlinProvider defaults={{ style: "minimal" }}>
        <ImageComparison {...layers} />
      </GlinProvider>
    )
    expect((container.firstChild as HTMLElement).className).not.toBe(before)
  })
})
