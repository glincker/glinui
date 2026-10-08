import { render, screen } from "@testing-library/react"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "../components/empty"

describe("Empty", () => {
  it("renders all slots", () => {
    render(
      <Empty data-testid="empty">
        <EmptyHeader>
          <EmptyMedia variant="icon" data-testid="media">i</EmptyMedia>
          <EmptyTitle>No projects</EmptyTitle>
          <EmptyDescription>Create one to begin.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <button type="button">Create</button>
        </EmptyContent>
      </Empty>
    )
    expect(screen.getByText("No projects")).toHaveAttribute("data-slot", "empty-title")
    expect(screen.getByText("Create one to begin.").tagName).toBe("P")
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument()
    expect(screen.getByTestId("media")).toHaveAttribute("data-variant", "icon")
  })

  it("supports variants and className merge", () => {
    const { rerender } = render(<Empty data-testid="empty" variant="glass" className="min-h-40" />)
    expect(screen.getByTestId("empty").className).toContain("backdrop-blur-xl")
    expect(screen.getByTestId("empty")).toHaveClass("min-h-40")
    rerender(<Empty data-testid="empty" variant="dashed" />)
    expect(screen.getByTestId("empty").className).toContain("border-dashed")
    rerender(<Empty data-testid="empty" />)
    expect(screen.getByTestId("empty")).toHaveAttribute("data-variant", "glinr")
  })

  it("forwards refs", () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<Empty ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
