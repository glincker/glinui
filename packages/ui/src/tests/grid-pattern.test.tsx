import { cleanup, render } from "@testing-library/react"
import * as React from "react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import { GridPattern } from "../components/grid-pattern"

afterEach(() => {
  cleanup()
  document.documentElement.removeAttribute("data-glin-motion")
  vi.unstubAllGlobals()
})

describe("GridPattern", () => {
  it("is decorative and renders a pattern fill", () => {
    const { container } = render(<GridPattern />)
    const svg = container.querySelector("svg")
    expect(svg).toHaveAttribute("aria-hidden", "true")
    expect(svg?.getAttribute("class")).toContain("pointer-events-none")
    expect(container.querySelector("pattern")).toBeInTheDocument()
  })

  it("uses a unique pattern id per instance", () => {
    const { container } = render(
      <>
        <GridPattern />
        <GridPattern />
      </>
    )
    const ids = Array.from(container.querySelectorAll("pattern")).map((p) => p.id)
    expect(new Set(ids).size).toBe(2)
    ids.forEach((id) => expect(id).not.toContain(":"))
  })

  it("supports stripes and merges className", () => {
    const { container } = render(<GridPattern variant="stripes" className="extra" fade="radial" />)
    const svg = container.querySelector("svg")
    expect(svg?.getAttribute("data-variant")).toBe("stripes")
    expect(svg?.getAttribute("class")).toContain("extra")
    expect(container.querySelector("pattern")?.getAttribute("patternTransform")).toBe("rotate(45)")
  })

  it("forwards ref", () => {
    const ref = React.createRef<SVGSVGElement>()
    render(<GridPattern ref={ref} />)
    expect(ref.current).toBeInstanceOf(SVGSVGElement)
  })

  it("animates highlighted squares only at full motion", () => {
    const { container, rerender } = render(<GridPattern squares={[[1, 1], [2, 2]]} />)
    expect(container.querySelectorAll("rect[data-square]")).toHaveLength(2)
    expect(container.querySelectorAll("animate")).toHaveLength(2)
    cleanup()
    document.documentElement.setAttribute("data-glin-motion", "none")
    const next = render(<GridPattern squares={[[1, 1]]} />)
    expect(next.container.querySelectorAll("animate")).toHaveLength(0)
    expect(next.container.querySelectorAll("rect[data-square]")).toHaveLength(1)
    void rerender
  })

  it("renders interactive cells from the measured size and disconnects the observer", () => {
    const disconnect = vi.fn()
    class RO {
      constructor(public cb: () => void) {}
      observe() {}
      unobserve() {}
      disconnect = disconnect
    }
    vi.stubGlobal("ResizeObserver", RO)
    vi.spyOn(SVGSVGElement.prototype, "getBoundingClientRect").mockReturnValue({
      width: 120, height: 80, top: 0, left: 0, right: 120, bottom: 80, x: 0, y: 0, toJSON: () => ({})
    })
    const { container, unmount } = render(<GridPattern interactive width={40} height={40} />)
    expect(container.querySelectorAll("rect[data-cell]")).toHaveLength(6)
    unmount()
    expect(disconnect).toHaveBeenCalled()
  })

  it("renders on the server without throwing", () => {
    expect(() => renderToString(<GridPattern interactive squares={[[0, 0]]} />)).not.toThrow()
  })
})
