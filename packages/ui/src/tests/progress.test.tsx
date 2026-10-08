import { render, screen } from "@testing-library/react"

import { Progress, ProgressCircle } from "../index"

describe("Progress", () => {
  it("renders progressbar semantics", () => {
    render(<Progress value={40} aria-label="Upload progress" />)
    expect(screen.getByRole("progressbar", { name: "Upload progress" })).toBeVisible()
  })

  it("applies glass variant and size classes", () => {
    render(<Progress data-testid="progress" variant="glass" size="lg" value={75} />)
    const root = screen.getByTestId("progress")
    expect(root.className).toContain("var(--glass-border)")
    expect(root.className).toContain("h-4")
  })

  it("applies liquid variant classes", () => {
    render(<Progress data-testid="progress-liquid" variant="liquid" value={56} />)
    const root = screen.getByTestId("progress-liquid")
    expect(root.className).toContain("radial-gradient")
  })

  it("clamps out-of-range values", () => {
    const { rerender } = render(<Progress data-testid="progress" value={120} />)
    expect(screen.getByTestId("progress")).toHaveAttribute("aria-valuenow", "100")

    rerender(<Progress data-testid="progress" value={-10} />)
    expect(screen.getByTestId("progress")).toHaveAttribute("aria-valuenow", "0")
  })

  it("supports indeterminate mode without aria-valuenow", () => {
    render(<Progress data-testid="progress-indeterminate" indeterminate aria-label="Loading" />)
    expect(screen.getByRole("progressbar", { name: "Loading" })).toBeVisible()
    expect(screen.getByTestId("progress-indeterminate")).not.toHaveAttribute("aria-valuenow")
  })
})

describe("ProgressCircle", () => {
  it("renders circular progressbar semantics", () => {
    render(<ProgressCircle value={62} aria-label="Build progress" />)
    expect(screen.getByRole("progressbar", { name: "Build progress" })).toBeVisible()
    expect(screen.getByText("62%")).toBeVisible()
  })

  it("supports liquid styling and clamped values", () => {
    render(<ProgressCircle data-testid="circle" variant="liquid" value={180} />)
    const root = screen.getByTestId("circle")
    expect(root).toHaveAttribute("aria-valuenow", "100")
    expect(root.querySelector("circle")?.getAttribute("class")).toContain("stroke-neutral-300/85")
  })

  it("supports custom formatter and hiding value", () => {
    const { rerender } = render(
      <ProgressCircle value={48} formatValue={(next) => `${next} pts`} />
    )

    expect(screen.getByText("48 pts")).toBeVisible()

    rerender(<ProgressCircle value={48} showValue={false} />)
    expect(screen.queryByText("48%")).not.toBeInTheDocument()
  })

  it("supports indeterminate circular mode", () => {
    render(
      <ProgressCircle data-testid="circle-indeterminate" indeterminate aria-label="Syncing" />
    )
    const root = screen.getByTestId("circle-indeterminate")
    expect(root).not.toHaveAttribute("aria-valuenow")
    expect(root.querySelector("svg")?.getAttribute("class")).toContain("animate-spin")
  })
})
