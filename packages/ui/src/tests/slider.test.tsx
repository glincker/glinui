import { render, screen } from "@testing-library/react"

import { Slider } from "../index"

describe("Slider", () => {
  it("renders slider thumb with role semantics", () => {
    render(<Slider defaultValue={[35]} aria-label="Volume" />)
    expect(screen.getByRole("slider")).toBeVisible()
  })

  it("applies glass variant classes", () => {
    render(<Slider variant="glass" size="lg" defaultValue={[50]} />)
    const thumb = screen.getByRole("slider")
    expect(thumb.className).toContain("glass-3")
    expect(thumb.className).toContain("h-6")
  })

  it("supports additional surface variants", () => {
    render(<Slider variant="liquid" defaultValue={[50]} />)
    const thumb = screen.getByRole("slider")
    expect(thumb.className).toContain("shadow-[0_0_0_2px_color-mix(in_oklab,var(--color-accent)_20%")
  })

  it("renders two thumbs for range values", () => {
    render(<Slider defaultValue={[20, 80]} aria-label="Range slider" />)
    expect(screen.getAllByRole("slider")).toHaveLength(2)
  })

  it("forwards className to root", () => {
    render(<Slider data-testid="slider" className="w-60" defaultValue={[20]} />)
    expect(screen.getByTestId("slider")).toHaveClass("w-60")
  })
})
