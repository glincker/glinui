import * as React from "react"
import { render, screen } from "@testing-library/react"
import { GradientText } from "../components/gradient-text"

function setMotion(level?: string) {
  if (level) document.documentElement.setAttribute("data-glin-motion", level)
  else document.documentElement.removeAttribute("data-glin-motion")
}

describe("GradientText", () => {
  let animate: ReturnType<typeof vi.fn>
  let cancel: ReturnType<typeof vi.fn>
  beforeEach(() => {
    setMotion("full")
    cancel = vi.fn()
    animate = vi.fn(() => ({ cancel }))
    ;(Element.prototype as unknown as { animate: unknown }).animate = animate
  })
  afterEach(() => {
    setMotion()
    delete (Element.prototype as unknown as { animate?: unknown }).animate
  })

  it("renders readable text with clip styling", () => {
    render(<GradientText>Launch</GradientText>)
    const el = screen.getByText("Launch")
    expect(el).toHaveClass("bg-clip-text", "text-transparent")
    expect(el).toHaveAttribute("data-effect", "flow")
  })

  it("supports the shine effect", () => {
    render(<GradientText effect="shine">Shiny</GradientText>)
    expect(screen.getByText("Shiny")).toHaveAttribute("data-effect", "shine")
    expect(animate).toHaveBeenCalledTimes(1)
  })

  it("wraps in a badge with default and glass surfaces", () => {
    const { rerender } = render(<GradientText badge data-testid="b">Tag</GradientText>)
    expect(screen.getByTestId("b")).toHaveClass("rounded-full")
    expect(screen.getByTestId("b")).toHaveAttribute("data-variant", "glinr")
    rerender(<GradientText badge variant="glass" data-testid="b">Tag</GradientText>)
    expect(screen.getByTestId("b")).toHaveAttribute("data-variant", "glass")
    expect(screen.getByTestId("b").className).toContain("backdrop-blur-xl")
  })

  it("applies custom colors through css variables", () => {
    render(<GradientText from="rgb(1, 2, 3)" to="rgb(4, 5, 6)">C</GradientText>)
    const el = screen.getByText("C")
    expect(el.style.getPropertyValue("--gt-from")).toBe("rgb(1, 2, 3)")
    expect(el.style.getPropertyValue("--gt-to")).toBe("rgb(4, 5, 6)")
  })

  it("does not animate when motion is none", () => {
    setMotion("none")
    render(<GradientText>Still</GradientText>)
    expect(animate).not.toHaveBeenCalled()
  })

  it("cancels the animation on unmount", () => {
    const { unmount } = render(<GradientText>Go</GradientText>)
    unmount()
    expect(cancel).toHaveBeenCalled()
  })

  it("merges className and forwards the ref", () => {
    const ref = React.createRef<HTMLSpanElement>()
    render(<GradientText ref={ref} className="mine">R</GradientText>)
    expect(ref.current).toHaveClass("mine")
  })
})
