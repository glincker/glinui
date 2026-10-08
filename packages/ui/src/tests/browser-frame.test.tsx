import { render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"

import { BrowserFrame } from "../components/browser-frame"

describe("BrowserFrame", () => {
  it("renders the address text as a real element", () => {
    render(<BrowserFrame url="example.com/app">Content</BrowserFrame>)
    expect(screen.getByText("example.com/app")).toBeVisible()
  })

  it("keeps children fully accessible", () => {
    render(
      <BrowserFrame>
        <button type="button">Inside</button>
      </BrowserFrame>
    )
    expect(screen.getByRole("button", { name: "Inside" })).toBeInTheDocument()
  })

  it("exposes a labelled group and hides the traffic lights", () => {
    const { container } = render(<BrowserFrame url="glinui.com">x</BrowserFrame>)
    expect(screen.getByRole("group", { name: "Browser window: glinui.com" })).toBeInTheDocument()
    const dots = container.querySelector('[data-slot="chrome"] [aria-hidden="true"]')
    expect(dots?.children).toHaveLength(3)
  })

  it("accepts a custom frame label", () => {
    render(<BrowserFrame frameLabel="Product preview">x</BrowserFrame>)
    expect(screen.getByRole("group", { name: "Product preview" })).toBeInTheDocument()
  })

  it("renders an image with alt when src is given", () => {
    render(<BrowserFrame src="/shot.png" alt="Dashboard screenshot" />)
    expect(screen.getByRole("img", { name: "Dashboard screenshot" })).toHaveAttribute("src", "/shot.png")
  })

  it("prefers children over src", () => {
    render(
      <BrowserFrame src="/shot.png" alt="shot">
        <p>Custom</p>
      </BrowserFrame>
    )
    expect(screen.getByText("Custom")).toBeInTheDocument()
    expect(screen.queryByRole("img")).toBeNull()
  })

  it("simple mode shows a title and no address bar", () => {
    const { container } = render(
      <BrowserFrame mode="simple" title="Settings">
        x
      </BrowserFrame>
    )
    expect(container.querySelector('[data-slot="address"]')).toBeNull()
    expect(screen.getByText("Settings")).toBeInTheDocument()
  })

  it("applies the glass variant", () => {
    render(
      <BrowserFrame variant="glass" data-testid="frame">
        x
      </BrowserFrame>
    )
    expect(screen.getByTestId("frame").className).toContain("backdrop-blur-xl")
  })

  it("uses no inline styles, no animation and merges className", () => {
    render(
      <BrowserFrame className="custom-x" data-testid="frame">
        x
      </BrowserFrame>
    )
    const frame = screen.getByTestId("frame")
    expect(frame.className).toContain("custom-x")
    expect(frame.innerHTML).not.toContain("style=")
    expect(frame.innerHTML).not.toContain("animate-")
  })

  it("forwards ref and renders on the server", () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<BrowserFrame ref={ref}>x</BrowserFrame>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(() => renderToString(<BrowserFrame>ssr</BrowserFrame>)).not.toThrow()
  })
})
