import { render, screen } from "@testing-library/react"

import { Skeleton } from "../index"

describe("Skeleton", () => {
  it("renders as decorative by default", () => {
    render(<Skeleton data-testid="skeleton" />)
    expect(screen.getByTestId("skeleton")).toHaveAttribute("aria-hidden", "true")
  })

  it("supports variants and sizes", () => {
    const { rerender } = render(<Skeleton data-testid="skeleton" variant="glass" size="sm" />)
    expect(screen.getByTestId("skeleton").className).toContain("backdrop-blur-xl")
    expect(screen.getByTestId("skeleton").className).toContain("h-4")

    rerender(<Skeleton data-testid="skeleton" variant="outline" size="lg" />)
    expect(screen.getByTestId("skeleton").className).toContain("border-[var(--color-border)]")
    expect(screen.getByTestId("skeleton").className).toContain("h-10")
  })

  it("forwards className and supports semantic loading state", () => {
    render(
      <Skeleton
        data-testid="skeleton"
        decorative={false}
        role="status"
        aria-live="polite"
        className="w-44"
      />
    )

    const skeleton = screen.getByTestId("skeleton")
    expect(skeleton).toHaveClass("w-44")
    expect(skeleton).toHaveAttribute("role", "status")
    expect(skeleton).not.toHaveAttribute("aria-hidden")
  })

  it("includes reduced-motion fallback classes", () => {
    render(<Skeleton data-testid="skeleton" />)
    const shimmer = screen.getByTestId("skeleton").firstElementChild
    expect(shimmer?.className).toContain("motion-reduce:hidden")
  })
})
