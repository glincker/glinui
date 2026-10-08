import { render, screen } from "@testing-library/react"

import { Alert, AlertDescription, AlertTitle } from "../index"

describe("Alert", () => {
  it("renders with alert role", () => {
    render(<Alert>System notice</Alert>)
    expect(screen.getByRole("alert")).toBeVisible()
  })

  it("renders title and description slots", () => {
    render(
      <Alert>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Your trial expires in 3 days.</AlertDescription>
      </Alert>
    )

    expect(screen.getByText("Heads up")).toBeVisible()
    expect(screen.getByText("Your trial expires in 3 days.")).toBeVisible()
  })

  it("supports variants and sizes", () => {
    render(
      <Alert data-testid="alert" variant="glass" size="lg">
        Glass alert
      </Alert>
    )

    const alert = screen.getByTestId("alert")
    expect(alert.className).toContain("backdrop-blur-xl")
    expect(alert.className).toContain("p-5")
  })
})
