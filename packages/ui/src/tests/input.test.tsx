import { render, screen } from "@testing-library/react"

import { Input } from "../index"

describe("Input", () => {
  it("renders textbox semantics", () => {
    render(<Input aria-label="Email" placeholder="name@example.com" />)
    expect(screen.getByRole("textbox", { name: "Email" })).toBeVisible()
  })

  it("applies liquid and matte variants", () => {
    render(
      <div>
        <Input data-testid="liquid" variant="liquid" placeholder="Liquid input" />
        <Input data-testid="matte" variant="matte" placeholder="Matte input" />
      </div>
    )

    expect(screen.getByTestId("liquid").className).toContain("radial-gradient")
    expect(screen.getByTestId("matte").className).toContain("linear-gradient")
  })

  it("applies size classes", () => {
    render(
      <div>
        <Input data-testid="sm" size="sm" />
        <Input data-testid="lg" size="lg" />
      </div>
    )

    expect(screen.getByTestId("sm").className).toContain("h-8")
    expect(screen.getByTestId("lg").className).toContain("h-10")
  })

  it("supports native attributes", () => {
    render(<Input data-testid="password" type="password" disabled />)
    const input = screen.getByTestId("password")
    expect(input).toHaveAttribute("type", "password")
    expect(input).toBeDisabled()
  })
})
