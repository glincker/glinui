import { render, screen } from "@testing-library/react"

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "../components/breadcrumb"

function Demo(props: { variant?: "default" | "solid" | "glass" | "plain" | "glinr"; className?: string }) {
  return (
    <Breadcrumb data-testid="nav" {...props}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <a href="/docs" data-testid="aschild">Docs</a>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

describe("Breadcrumb", () => {
  it("renders a labelled nav landmark with an ordered list", () => {
    render(<Demo />)
    expect(screen.getByRole("navigation", { name: "breadcrumb" })).toBeInTheDocument()
    expect(screen.getByRole("list")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/")
  })

  it("marks the current page", () => {
    render(<Demo />)
    const page = screen.getByText("Breadcrumb")
    expect(page).toHaveAttribute("aria-current", "page")
    expect(page).toHaveAttribute("aria-disabled", "true")
  })

  it("hides separators from assistive tech and exposes ellipsis text", () => {
    const { container } = render(<Demo />)
    expect(container.querySelectorAll('li[role="presentation"][aria-hidden="true"]')).toHaveLength(3)
    expect(screen.getByText("More")).toHaveClass("sr-only")
  })

  it("supports asChild links", () => {
    render(<Demo />)
    const link = screen.getByTestId("aschild")
    expect(link.tagName).toBe("A")
    expect(link.className).toContain("focus-visible:ring-2")
  })

  it("applies variants and merges className", () => {
    const { rerender } = render(<Demo variant="glass" className="custom-x" />)
    expect(screen.getByTestId("nav")).toHaveClass("custom-x")
    expect(screen.getByTestId("nav").className).toMatch(/backdrop-blur-xl/)
    rerender(<Demo variant="solid" />)
    expect(screen.getByTestId("nav").className).toContain("var(--ring-solid)")
  })

  it("defaults to the glinr trail with a raised current page", () => {
    render(<Demo />)
    expect(screen.getByTestId("nav")).toHaveAttribute("data-variant", "glinr")
    expect(screen.getByTestId("nav").className).not.toContain("backdrop-blur")
    expect(screen.getByText("Breadcrumb").className).toContain("var(--ring-hot")
  })

  it("keeps the plain trail flat", () => {
    render(<Demo variant="plain" />)
    expect(screen.getByTestId("nav")).toHaveAttribute("data-variant", "plain")
    expect(screen.getByText("Breadcrumb").className).not.toContain("var(--ring-hot")
  })
})
