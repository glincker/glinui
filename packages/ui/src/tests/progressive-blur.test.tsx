import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { MotionEngineProvider } from "../components/motion-engine"
import { ProgressiveBlur } from "../components/progressive-blur"

describe("ProgressiveBlur", () => {
  it("is aria-hidden, ignores pointer events and renders 8 layers by default", () => {
    render(<ProgressiveBlur data-testid="p" className="custom-x" />)
    const el = screen.getByTestId("p")
    expect(el).toHaveAttribute("aria-hidden", "true")
    expect(el).toHaveClass("custom-x", "pointer-events-none")
    expect(el.querySelectorAll("[data-layer]")).toHaveLength(8)
    expect(el).toHaveAttribute("data-mode", "blur")
  })

  it("clamps the layer count to 2..8", () => {
    const { rerender } = render(<ProgressiveBlur data-testid="p" blurLayers={20} />)
    expect(screen.getByTestId("p").querySelectorAll("[data-layer]")).toHaveLength(8)
    rerender(<ProgressiveBlur data-testid="p" blurLayers={0} />)
    expect(screen.getByTestId("p").querySelectorAll("[data-layer]")).toHaveLength(2)
  })

  it("maps direction to logical placement classes", () => {
    const { rerender } = render(<ProgressiveBlur data-testid="p" direction="top" />)
    expect(screen.getByTestId("p")).toHaveClass("top-0")
    rerender(<ProgressiveBlur data-testid="p" direction="start" />)
    expect(screen.getByTestId("p")).toHaveClass("start-0")
    rerender(<ProgressiveBlur data-testid="p" direction="end" />)
    expect(screen.getByTestId("p")).toHaveClass("end-0")
  })

  it("writes step, segment and size as CSS variables", () => {
    render(<ProgressiveBlur data-testid="p" blurLayers={4} blurIntensity={2} size={120} />)
    const el = screen.getByTestId("p")
    expect(el.style.getPropertyValue("--pb-step")).toBe("2px")
    expect(el.style.getPropertyValue("--pb-seg")).toBe("20%")
    expect(el.style.getPropertyValue("--pb-size")).toBe("120px")
  })

  it("uses a single gradient fade without backdrop-filter at motion none", () => {
    render(
      <MotionEngineProvider motion="none">
        <ProgressiveBlur data-testid="p" />
      </MotionEngineProvider>
    )
    const el = screen.getByTestId("p")
    expect(el).toHaveAttribute("data-mode", "fade")
    expect(el.querySelectorAll("[data-layer]")).toHaveLength(0)
    expect(el.innerHTML).not.toContain("backdrop-filter")
  })

  it("keeps the blur layers at subtle", () => {
    render(
      <MotionEngineProvider motion="subtle">
        <ProgressiveBlur data-testid="p" />
      </MotionEngineProvider>
    )
    expect(screen.getByTestId("p")).toHaveAttribute("data-mode", "blur")
  })
})
