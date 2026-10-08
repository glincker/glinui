import { render, screen } from "@testing-library/react"

import { Separator } from "../index"

describe("Separator", () => {
  it("renders decorative separator by default", () => {
    render(<Separator data-testid="separator" />)
    const separator = screen.getByTestId("separator")
    expect(separator).toHaveAttribute("aria-hidden", "true")
    expect(separator.className).toContain("w-full")
    expect(separator.className).toContain("h-px")
  })

  it("supports orientation and size variants", () => {
    render(<Separator data-testid="separator" orientation="vertical" size="lg" />)
    const separator = screen.getByTestId("separator")
    expect(separator.className).toContain("h-full")
    expect(separator.className).toContain("w-0.5")
  })

  it("supports semantic separator role", () => {
    render(<Separator data-testid="separator" decorative={false} orientation="vertical" />)
    const separator = screen.getByTestId("separator")
    expect(separator).toHaveAttribute("role", "separator")
    expect(separator).toHaveAttribute("aria-orientation", "vertical")
    expect(separator).not.toHaveAttribute("aria-hidden")
  })

  it("applies glass variant classes and forwards className", () => {
    render(<Separator data-testid="separator" variant="glass" className="my-2" />)
    const separator = screen.getByTestId("separator")
    expect(separator.className).toContain("bg-[var(--glass-refraction-top)]")
    expect(separator).toHaveClass("my-2")
  })
})
