import { act, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { CircularGallery, type CircularGalleryItem } from "../components/circular-gallery"
import { MotionEngineProvider } from "../components/motion-engine"

const items: CircularGalleryItem[] = ["Aurora", "Basalt", "Cobalt", "Dune", "Ember"].map((label) => ({
  id: label.toLowerCase(),
  label,
  content: <span>{label} tile</span>
}))

afterEach(() => vi.useRealTimers())

describe("CircularGallery", () => {
  it("renders a listbox of options with roving tabindex and aria-current on the front", () => {
    render(<CircularGallery items={items} label="Moods" />)
    expect(screen.getByRole("listbox", { name: "Moods" })).toBeInTheDocument()
    const options = screen.getAllByRole("option")
    expect(options).toHaveLength(5)
    expect(options[0]).toHaveAttribute("aria-current", "true")
    expect(options[0]).toHaveAttribute("aria-selected", "true")
    expect(options[0]).toHaveAttribute("tabindex", "0")
    expect(options[1]).toHaveAttribute("tabindex", "-1")
    expect(options[1]).not.toHaveAttribute("aria-current")
  })

  it("shows the front caption", () => {
    render(<CircularGallery items={items} defaultValue={2} />)
    expect(document.querySelector("[data-slot=circular-gallery-caption]")).toHaveTextContent("Cobalt")
  })

  it("arrow keys, Home and End move the front tile and focus", () => {
    const onValueChange = vi.fn()
    render(<CircularGallery items={items} onValueChange={onValueChange} />)
    const options = screen.getAllByRole("option")
    act(() => options[0].focus())
    fireEvent.keyDown(options[0], { key: "ArrowRight" })
    expect(onValueChange).toHaveBeenLastCalledWith(1)
    expect(document.activeElement).toBe(options[1])
    fireEvent.keyDown(options[1], { key: "ArrowLeft" })
    fireEvent.keyDown(options[0], { key: "ArrowLeft" })
    expect(onValueChange).toHaveBeenLastCalledWith(4)
    fireEvent.keyDown(options[4], { key: "Home" })
    expect(onValueChange).toHaveBeenLastCalledWith(0)
    fireEvent.keyDown(options[0], { key: "End" })
    expect(onValueChange).toHaveBeenLastCalledWith(4)
  })

  it("clicking a back tile rotates it forward", () => {
    const onValueChange = vi.fn()
    render(<CircularGallery items={items} onValueChange={onValueChange} />)
    fireEvent.click(screen.getAllByRole("option")[2])
    expect(onValueChange).toHaveBeenLastCalledWith(2)
    expect(screen.getAllByRole("option")[2]).toHaveAttribute("aria-current", "true")
  })

  it("lays tiles out on a ring: front is largest and sharpest", () => {
    render(<CircularGallery items={items} />)
    const [front, side, back] = [0, 1, 2].map((i) => screen.getAllByRole("option")[i])
    expect(front.style.getPropertyValue("--g-s")).toBe("1.000")
    expect(front.style.getPropertyValue("--g-b")).toBe("0.00px")
    expect(Number(side.style.getPropertyValue("--g-s"))).toBeLessThan(1)
    expect(Number(back.style.getPropertyValue("--g-s"))).toBeLessThan(Number(side.style.getPropertyValue("--g-s")))
  })

  it("is controlled by value", () => {
    const { rerender } = render(<CircularGallery items={items} value={0} />)
    rerender(<CircularGallery items={items} value={3} />)
    expect(screen.getAllByRole("option")[3]).toHaveAttribute("aria-selected", "true")
  })

  it("auto rotates only at motion full and pauses on hover", () => {
    vi.useFakeTimers()
    const onValueChange = vi.fn()
    const { container } = render(
      <MotionEngineProvider motion="full">
        <CircularGallery items={items} autoRotate autoRotateInterval={1000} onValueChange={onValueChange} />
      </MotionEngineProvider>
    )
    act(() => void vi.advanceTimersByTime(1100))
    expect(onValueChange).toHaveBeenCalledWith(1)
    onValueChange.mockClear()
    fireEvent.pointerEnter(container.firstChild as HTMLElement)
    act(() => void vi.advanceTimersByTime(4000))
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it("does not auto rotate and snaps instantly at motion none, and cleans up", () => {
    vi.useFakeTimers()
    const onValueChange = vi.fn()
    const { unmount } = render(
      <MotionEngineProvider motion="none">
        <CircularGallery items={items} autoRotate autoRotateInterval={1000} onValueChange={onValueChange} />
      </MotionEngineProvider>
    )
    act(() => void vi.advanceTimersByTime(5000))
    expect(onValueChange).not.toHaveBeenCalled()
    fireEvent.click(screen.getAllByRole("option")[1])
    expect(screen.getAllByRole("option")[1].style.getPropertyValue("--g-s")).toBe("1.000")
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })

  it("only captures the wheel when opted in", () => {
    const onValueChange = vi.fn()
    const { container, rerender } = render(<CircularGallery items={items} onValueChange={onValueChange} />)
    const root = container.firstChild as HTMLElement
    const plain = new WheelEvent("wheel", { deltaY: 100, cancelable: true, bubbles: true })
    root.dispatchEvent(plain)
    expect(plain.defaultPrevented).toBe(false)
    rerender(<CircularGallery items={items} wheel onValueChange={onValueChange} />)
    const opted = new WheelEvent("wheel", { deltaY: 100, cancelable: true, bubbles: true })
    root.dispatchEvent(opted)
    expect(opted.defaultPrevented).toBe(true)
    expect(onValueChange).toHaveBeenLastCalledWith(1)
  })
})
