import { render, screen } from "@testing-library/react"

import { Spinner } from "../components/spinner"

describe("Spinner", () => {
  it("exposes role=status with a default label", () => {
    render(<Spinner />)
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument()
  })

  it("accepts a custom label", () => {
    render(<Spinner label="Saving changes" />)
    expect(screen.getByRole("status", { name: "Saving changes" })).toBeInTheDocument()
  })

  it("supports sizes and variants", () => {
    const { rerender } = render(<Spinner size="xl" variant="muted" />)
    expect(screen.getByRole("status").className).toContain("size-12")
    expect(screen.getByRole("status").className).toContain("text-[color:var(--color-muted)]")
    rerender(<Spinner variant="glass" />)
    expect(screen.getByRole("status").className).toContain("backdrop-blur-xl")
  })

  it("uses CSS rotation with a reduced-motion pulsing dot ring fallback", () => {
    render(<Spinner />)
    const status = screen.getByRole("status")
    const svg = status.querySelector("svg")
    expect(svg).toHaveClass("animate-spin")
    expect(svg).toHaveClass("motion-reduce:hidden")
    const dots = status.querySelectorAll("[data-spinner-dot]")
    expect(dots).toHaveLength(8)
    expect(dots[0]).toHaveClass("motion-reduce:animate-pulse")
  })

  it("merges className", () => {
    render(<Spinner className="mx-2" />)
    expect(screen.getByRole("status")).toHaveClass("mx-2")
  })
})
