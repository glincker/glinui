import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "../components/pagination"

function Demo(props: { variant?: "default" | "glass" | "plain"; className?: string }) {
  return (
    <Pagination data-testid="nav" {...props}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#prev" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#1">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#2" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#next" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

describe("Pagination", () => {
  it("renders a labelled navigation landmark", () => {
    render(<Demo />)
    expect(screen.getByRole("navigation", { name: "pagination" })).toBeInTheDocument()
    expect(screen.getAllByRole("listitem")).toHaveLength(5)
  })

  it("marks only the active page with aria-current", () => {
    render(<Demo />)
    expect(screen.getByRole("link", { name: "2" })).toHaveAttribute("aria-current", "page")
    expect(screen.getByRole("link", { name: "1" })).not.toHaveAttribute("aria-current")
  })

  it("labels previous and next links", () => {
    render(<Demo />)
    expect(screen.getByRole("link", { name: "Go to previous page" })).toHaveAttribute("href", "#prev")
    expect(screen.getByRole("link", { name: "Go to next page" })).toHaveAttribute("href", "#next")
  })

  it("exposes ellipsis text for screen readers", () => {
    render(<Demo />)
    expect(screen.getByText("More pages")).toHaveClass("sr-only")
  })

  it("is keyboard focusable in order", async () => {
    const user = userEvent.setup()
    render(<Demo />)
    await user.tab()
    expect(screen.getByRole("link", { name: "Go to previous page" })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole("link", { name: "1" })).toHaveFocus()
  })

  it("applies variant data attribute and merges className", () => {
    render(<Demo variant="glass" className="custom-x" />)
    expect(screen.getByTestId("nav")).toHaveAttribute("data-variant", "glass")
    expect(screen.getByTestId("nav")).toHaveClass("custom-x")
    expect(screen.getByRole("link", { name: "2" }).className).toContain("backdrop-blur-xl")
  })

  it("defaults to the glinr look with a raised current page", () => {
    render(<Demo />)
    expect(screen.getByTestId("nav")).toHaveAttribute("data-variant", "glinr")
    expect(screen.getByRole("link", { name: "2" }).className).toContain("var(--ring-hot")
    expect(screen.getByRole("link", { name: "1" }).className).not.toContain("var(--ring-hot")
  })
})
