import { render, screen } from "@testing-library/react"

import { Badge } from "../index"

describe("Badge", () => {
  it("renders badge text", () => {
    render(<Badge>Status</Badge>)
    expect(screen.getByText("Status")).toBeVisible()
  })

  it("applies glass variant classes", () => {
    render(
      <Badge variant="glass" data-testid="badge">
        Glass status
      </Badge>
    )

    expect(screen.getByTestId("badge").className).toContain("backdrop-blur-xl")
  })
})
