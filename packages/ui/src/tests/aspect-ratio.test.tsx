import { render, screen } from "@testing-library/react"

import { AspectRatio } from "../components/aspect-ratio"

describe("AspectRatio", () => {
  it("renders children and sets the ratio padding", () => {
    render(
      <AspectRatio ratio={16 / 9} data-testid="ar">
        <img alt="cover" src="x.png" />
      </AspectRatio>
    )
    expect(screen.getByAltText("cover")).toBeInTheDocument()
    const wrapper = screen.getByTestId("ar").parentElement
    expect(wrapper?.getAttribute("style")).toContain("56.25%")
  })

  it("supports variants and className merge", () => {
    const { rerender } = render(<AspectRatio data-testid="ar" variant="glass" className="w-40" />)
    expect(screen.getByTestId("ar").className).toContain("backdrop-blur-xl")
    expect(screen.getByTestId("ar")).toHaveClass("w-40")
    rerender(<AspectRatio data-testid="ar" variant="default" />)
    expect(screen.getByTestId("ar")).toHaveAttribute("data-variant", "glinr")
  })

  it("defaults to a square ratio", () => {
    render(<AspectRatio data-testid="ar" />)
    expect(screen.getByTestId("ar").parentElement?.getAttribute("style")).toContain("100%")
  })
})
