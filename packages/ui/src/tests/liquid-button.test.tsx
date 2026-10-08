import { render, screen } from "@testing-library/react"

import { LiquidButton } from "../index"

describe("LiquidButton", () => {
  it("renders button label", () => {
    render(<LiquidButton>Start free trial</LiquidButton>)
    expect(screen.getByRole("button", { name: "Start free trial" })).toBeVisible()
  })

  it("applies fluid hover and press classes", () => {
    render(
      <LiquidButton data-testid="liquid-button" intensity="strong">
        CTA
      </LiquidButton>
    )

    const button = screen.getByTestId("liquid-button")
    expect(button.className).toContain("hover:scale-[1.03]")
    expect(button.className).toContain("active:scale-y-[0.97]")
    expect(button.className).toContain("motion-reduce:active:scale-y-100")
  })

  it("defaults to a crisp glinr surface with a token-coloured liquid fill", () => {
    render(<LiquidButton data-testid="l">CTA</LiquidButton>)
    const button = screen.getByTestId("l")
    expect(button).toHaveAttribute("data-variant", "glinr")
    expect(button.className).not.toContain("backdrop-blur")
    expect(button.className).toContain("before:bg-[color:var(--liquid-fill,color-mix(in_oklab,var(--color-accent)_34%,transparent))]")
    expect(button.className).toContain("[[data-glin-motion=none]_&]:before:transition-none")
  })
})
