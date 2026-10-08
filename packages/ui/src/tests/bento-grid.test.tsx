import { render, screen } from "@testing-library/react"
import { Star } from "@phosphor-icons/react/dist/ssr"
import { renderToString } from "react-dom/server"
import { describe, expect, it } from "vitest"
import axe from "axe-core"

import { BentoCard, BentoGrid } from "../components/bento-grid"
import { MotionEngineProvider } from "../components/motion-engine"

describe("BentoGrid", () => {
  it("is a responsive grid (1, 2, 3 columns) and merges className", () => {
    render(<BentoGrid data-testid="g" className="extra"><div /></BentoGrid>)
    const grid = screen.getByTestId("g")
    expect(grid).toHaveClass("grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-3", "extra")
  })
})

describe("BentoCard", () => {
  it("renders name as heading, description, aria-hidden icon and background", () => {
    const { container } = render(
      <BentoCard name="Analytics" description="Track things" Icon={Star} background={<div data-testid="bg" />} />
    )
    expect(screen.getByRole("heading", { name: "Analytics", level: 3 })).toBeVisible()
    expect(screen.getByText("Track things")).toBeVisible()
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true")
    expect(screen.getByTestId("bg").parentElement).toHaveAttribute("aria-hidden", "true")
    expect(container.querySelector("a")).toBeNull()
  })

  it("is one real anchor when href is set, with the CTA inside", () => {
    render(<BentoCard name="Docs" description="Read" href="/docs" cta="Learn more" target="_blank" />)
    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "/docs")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
    expect(link).toHaveTextContent("Learn more")
    expect(link.querySelectorAll("a, button")).toHaveLength(0)
  })

  it("supports glass variant, heading level and className", () => {
    render(<BentoCard name="G" description="d" variant="glass" headingLevel={2} className="lg:col-span-2" data-testid="c" />)
    expect(screen.getByTestId("c").className).toContain("backdrop-blur")
    expect(screen.getByTestId("c")).toHaveClass("lg:col-span-2")
    expect(screen.getByRole("heading", { level: 2 })).toBeVisible()
  })

  it("keeps the CTA always visible at motion level none", () => {
    render(
      <MotionEngineProvider motion="none">
        <BentoCard name="N" description="d" href="/x" cta="Go" />
      </MotionEngineProvider>
    )
    expect(document.querySelector('[data-slot="bento-cta"]')?.className).not.toContain("opacity-0")
  })

  it("hides the CTA by default only for fine pointers at full motion", () => {
    render(
      <MotionEngineProvider motion="full">
        <BentoCard name="N" description="d" href="/x" cta="Go" />
      </MotionEngineProvider>
    )
    expect(document.querySelector('[data-slot="bento-cta"]')?.className).toContain("pointer:fine")
  })

  it("has no axe violations", async () => {
    const { container } = render(
      <BentoGrid>
        <BentoCard name="One" description="First" href="/one" cta="Open" Icon={Star} />
        <BentoCard name="Two" description="Second" />
      </BentoGrid>
    )
    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })

  it("renders on the server", () => {
    expect(() => renderToString(<BentoGrid><BentoCard name="a" description="b" href="/" cta="c" /></BentoGrid>)).not.toThrow()
  })
})
