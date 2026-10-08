import { act, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { CylinderCarousel } from "../components/cylinder-carousel"
import { GlinProvider } from "../components/glin-provider"
import { MotionEngineProvider } from "../components/motion-engine"

const items = ["One", "Two", "Three", "Four"].map((t) => <span key={t}>{t}</span>)

afterEach(() => vi.useRealTimers())

describe("CylinderCarousel", () => {
  it("exposes carousel semantics and n of N slide names", () => {
    render(<CylinderCarousel items={items} label="Featured" />)
    const region = screen.getByRole("region", { name: "Featured" })
    expect(region).toHaveAttribute("aria-roledescription", "carousel")
    const slides = screen.getAllByRole("group", { hidden: true })
    expect(slides).toHaveLength(4)
    expect(slides[0]).toHaveAttribute("aria-label", "1 of 4")
    expect(slides[0]).toHaveAttribute("aria-roledescription", "slide")
  })

  it("marks only the front slide interactive and the rest inert", () => {
    const { container } = render(<CylinderCarousel items={items} />)
    const slides = container.querySelectorAll("[data-slot=cylinder-carousel-slide]")
    expect(slides[0]).not.toHaveAttribute("inert")
    expect(slides[1]).toHaveAttribute("inert")
    expect(slides[0]).toHaveAttribute("data-front", "true")
  })

  it("steps with buttons and arrow keys, wrapping around", () => {
    const onValueChange = vi.fn()
    const { container } = render(<CylinderCarousel items={items} onValueChange={onValueChange} />)
    fireEvent.click(screen.getByRole("button", { name: "Next slide" }))
    expect(onValueChange).toHaveBeenLastCalledWith(1)
    fireEvent.click(screen.getByRole("button", { name: "Previous slide" }))
    fireEvent.click(screen.getByRole("button", { name: "Previous slide" }))
    expect(onValueChange).toHaveBeenLastCalledWith(3)
    const viewport = container.querySelector("[data-slot=cylinder-carousel-viewport]") as HTMLElement
    fireEvent.keyDown(viewport, { key: "ArrowRight" })
    expect(onValueChange).toHaveBeenLastCalledWith(0)
    fireEvent.keyDown(viewport, { key: "End" })
    expect(onValueChange).toHaveBeenLastCalledWith(3)
    fireEvent.keyDown(viewport, { key: "Home" })
    expect(onValueChange).toHaveBeenLastCalledWith(0)
  })

  it("follows a controlled value the short way", () => {
    const { container, rerender } = render(<CylinderCarousel items={items} value={0} />)
    rerender(<CylinderCarousel items={items} value={3} />)
    const ring = container.querySelector("[data-slot=cylinder-carousel-ring]") as HTMLElement
    expect(ring.style.getPropertyValue("--cc-rot")).toBe("-90.000deg")
  })

  it("resolves default surface variant and honours explicit variants", () => {
    const { container, rerender } = render(<CylinderCarousel items={items} />)
    const first = () => container.querySelector("[data-slot=cylinder-carousel-slide]") as HTMLElement
    const defaultClass = first().className
    rerender(<CylinderCarousel items={items} variant="plain" />)
    expect(first().className).not.toBe(defaultClass)
    rerender(
      <GlinProvider defaults={{ style: "minimal" }}>
        <CylinderCarousel items={items} />
      </GlinProvider>
    )
    expect(first().className).toContain("shadow-sm")
  })

  it("autoplays only at motion full, pauses on hover and focus, and shows a pause button", () => {
    vi.useFakeTimers()
    const onValueChange = vi.fn()
    const { container } = render(
      <MotionEngineProvider motion="full">
        <CylinderCarousel items={items} autoPlay autoPlayInterval={1000} onValueChange={onValueChange} />
      </MotionEngineProvider>
    )
    act(() => void vi.advanceTimersByTime(1100))
    expect(onValueChange).toHaveBeenCalledWith(1)
    const region = container.querySelector("[data-slot=cylinder-carousel]") as HTMLElement
    expect(container.querySelector("[aria-live]")).toHaveAttribute("aria-live", "off")
    fireEvent.pointerEnter(region)
    onValueChange.mockClear()
    act(() => void vi.advanceTimersByTime(3000))
    expect(onValueChange).not.toHaveBeenCalled()
    fireEvent.pointerLeave(region)
    fireEvent.click(screen.getByRole("button", { name: "Pause automatic rotation" }))
    act(() => void vi.advanceTimersByTime(3000))
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it("does not autoplay at motion subtle or none and renders a flat list at none", () => {
    vi.useFakeTimers()
    const onValueChange = vi.fn()
    const { container } = render(
      <MotionEngineProvider motion="none">
        <CylinderCarousel items={items} autoPlay autoPlayInterval={1000} onValueChange={onValueChange} />
      </MotionEngineProvider>
    )
    act(() => void vi.advanceTimersByTime(5000))
    expect(onValueChange).not.toHaveBeenCalled()
    expect(container.querySelector("[data-slot=cylinder-carousel]")).toHaveAttribute("data-mode", "flat")
    expect(container.querySelectorAll("[inert]")).toHaveLength(0)
  })

  it("clears its timer on unmount", () => {
    vi.useFakeTimers()
    const { unmount } = render(
      <MotionEngineProvider motion="full">
        <CylinderCarousel items={items} autoPlay />
      </MotionEngineProvider>
    )
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
