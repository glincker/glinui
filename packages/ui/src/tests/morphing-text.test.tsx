import * as React from "react"
import { render, screen } from "@testing-library/react"
import { MorphingText } from "../components/morphing-text"

describe("MorphingText", () => {
  afterEach(() => {
    document.documentElement.removeAttribute("data-glin-motion")
    vi.restoreAllMocks()
  })

  it("lists every text for screen readers and hides the visual layer", () => {
    const { container } = render(<MorphingText texts={["One", "Two", "Three"]} />)
    expect(screen.getByText("One. Two. Three", { selector: ".sr-only" })).toBeInTheDocument()
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })

  it("renders the first text as the static initial frame", () => {
    render(<MorphingText texts={["Alpha", "Beta"]} />)
    const visible = document.querySelector('div[aria-hidden="true"] > span') as HTMLElement
    expect(visible.textContent).toBe("Alpha")
  })

  it("uses a unique filter id per instance", () => {
    const { container } = render(
      <>
        <MorphingText texts={["a", "b"]} />
        <MorphingText texts={["c", "d"]} />
      </>
    )
    const ids = Array.from(container.querySelectorAll("filter")).map((f) => f.id)
    expect(ids).toHaveLength(2)
    expect(new Set(ids).size).toBe(2)
  })

  it("does not start an animation loop when motion is none", () => {
    document.documentElement.setAttribute("data-glin-motion", "none")
    const raf = vi.spyOn(window, "requestAnimationFrame")
    render(<MorphingText texts={["a", "b"]} />)
    expect(raf).not.toHaveBeenCalled()
  })

  it("runs and cancels the loop when motion is full", () => {
    document.documentElement.setAttribute("data-glin-motion", "full")
    vi.spyOn(window, "requestAnimationFrame").mockImplementation(() => 42)
    const cancel = vi.spyOn(window, "cancelAnimationFrame")
    const { unmount } = render(<MorphingText texts={["a", "b"]} />)
    unmount()
    expect(cancel).toHaveBeenCalledWith(42)
  })

  it("merges className", () => {
    render(<MorphingText texts={["a"]} className="mine" data-testid="m" />)
    expect(screen.getByTestId("m")).toHaveClass("mine")
  })
})
