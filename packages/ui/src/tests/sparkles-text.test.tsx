import * as React from "react"
import { render, screen } from "@testing-library/react"
import { SparklesText, MAX_SPARKLES } from "../components/sparkles-text"

function setMotion(level?: string) {
  if (level) document.documentElement.setAttribute("data-glin-motion", level)
  else document.documentElement.removeAttribute("data-glin-motion")
}

describe("SparklesText", () => {
  let cancelled = 0
  beforeEach(() => {
    cancelled = 0
    setMotion("full")
    ;(Element.prototype as unknown as { animate: unknown }).animate = vi.fn(() => ({
      cancel: () => {
        cancelled += 1
      },
      play: vi.fn(),
      updateTiming: vi.fn(),
      onfinish: null
    }))
  })
  afterEach(() => {
    setMotion()
    delete (Element.prototype as unknown as { animate?: unknown }).animate
  })

  it("renders children with real text and hidden sparkles", () => {
    const { container } = render(<SparklesText>Magic</SparklesText>)
    expect(screen.getByText("Magic")).toBeInTheDocument()
    const sparkles = container.querySelectorAll("svg")
    expect(sparkles).toHaveLength(10)
    sparkles.forEach((s) => expect(s).toHaveAttribute("aria-hidden", "true"))
  })

  it("caps the sparkle count", () => {
    const { container } = render(<SparklesText sparklesCount={500}>x</SparklesText>)
    expect(container.querySelectorAll("svg")).toHaveLength(MAX_SPARKLES)
  })

  it("applies custom colors", () => {
    const { container } = render(
      <SparklesText sparklesCount={2} colors={{ first: "rgb(1, 2, 3)", second: "rgb(4, 5, 6)" }}>x</SparklesText>
    )
    const svgs = container.querySelectorAll("svg")
    expect((svgs[0] as SVGElement).style.color).toBe("rgb(1, 2, 3)")
    expect((svgs[1] as SVGElement).style.color).toBe("rgb(4, 5, 6)")
  })

  it("renders a static two star accent when motion is none", () => {
    setMotion("none")
    const { container } = render(<SparklesText>Calm</SparklesText>)
    expect(container.querySelectorAll("svg")).toHaveLength(2)
    expect(Element.prototype.animate).not.toHaveBeenCalled()
  })

  it("cancels animations on unmount", () => {
    const { unmount } = render(<SparklesText sparklesCount={3}>x</SparklesText>)
    unmount()
    expect(cancelled).toBe(3)
  })

  it("supports as and className merge", () => {
    render(<SparklesText as="h1" className="extra" data-testid="s">x</SparklesText>)
    const el = screen.getByTestId("s")
    expect(el.tagName).toBe("H1")
    expect(el).toHaveClass("extra", "font-bold")
  })
})
