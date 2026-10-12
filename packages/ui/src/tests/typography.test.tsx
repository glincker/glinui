import { render, screen } from "@testing-library/react"

import { Display, Eyebrow, Lede } from "../index"

describe("Display", () => {
  it("renders an h2 by default", () => {
    render(<Display>Ship it</Display>)
    expect(screen.getByRole("heading", { level: 2, name: "Ship it" })).toBeVisible()
  })

  it("renders the requested element and size", () => {
    render(
      <Display as="h1" size="4xl" className="custom">
        Hero
      </Display>
    )
    const heading = screen.getByRole("heading", { level: 1, name: "Hero" })
    expect(heading).toHaveClass("custom")
    expect(heading.className).toContain("text-3xl")
  })

  it("can render a non heading element", () => {
    render(<Display as="p">Plain</Display>)
    expect(screen.queryByRole("heading")).toBeNull()
    expect(screen.getByText("Plain").tagName).toBe("P")
  })

  it("forwards refs", () => {
    const ref = { current: null as HTMLHeadingElement | null }
    render(<Display ref={ref}>Ref</Display>)
    expect(ref.current).toBeInstanceOf(HTMLElement)
  })
})

describe("Eyebrow", () => {
  it("renders the dot as decorative by default", () => {
    const { container } = render(<Eyebrow>Beta</Eyebrow>)
    expect(screen.getByText("Beta")).toBeVisible()
    expect(container.querySelector('span[aria-hidden="true"]')).not.toBeNull()
  })

  it("hides the dot when dot is false", () => {
    const { container } = render(<Eyebrow dot={false}>Beta</Eyebrow>)
    expect(container.querySelector("span")).toBeNull()
  })
})

describe("Lede", () => {
  it("renders a paragraph and merges className", () => {
    render(<Lede className="custom">Supporting copy</Lede>)
    const lede = screen.getByText("Supporting copy")
    expect(lede.tagName).toBe("P")
    expect(lede).toHaveClass("custom")
  })
})
