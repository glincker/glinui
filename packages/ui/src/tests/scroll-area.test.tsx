import { render, screen } from "@testing-library/react"

import { ScrollArea, ScrollBar } from "../components/scroll-area"

describe("ScrollArea", () => {
  it("renders children inside a viewport", () => {
    render(
      <ScrollArea data-testid="root" className="h-24">
        <p>Content</p>
      </ScrollArea>
    )
    expect(screen.getByText("Content")).toBeInTheDocument()
    expect(screen.getByTestId("root").querySelector("[data-radix-scroll-area-viewport]")).not.toBeNull()
  })

  it("supports variants and merges className", () => {
    const { rerender } = render(<ScrollArea data-testid="root" variant="glass" className="w-40" />)
    expect(screen.getByTestId("root").className).toContain("backdrop-blur-xl")
    expect(screen.getByTestId("root")).toHaveClass("w-40")
    rerender(<ScrollArea data-testid="root" variant="default" />)
    expect(screen.getByTestId("root")).toHaveAttribute("data-variant", "glinr")
  })

  it("applies viewportClassName and focus ring on the viewport", () => {
    render(<ScrollArea data-testid="root" viewportClassName="p-2">x</ScrollArea>)
    const viewport = screen.getByTestId("root").querySelector("[data-radix-scroll-area-viewport]")
    expect(viewport).toHaveClass("p-2")
    expect(viewport?.className).toContain("focus-visible:ring-[var(--color-accent)]")
  })

  it("exports a ScrollBar with display name", () => {
    expect(ScrollBar.displayName).toBe("ScrollBar")
  })
})
