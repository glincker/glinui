import { cleanup, render } from "@testing-library/react"
import * as React from "react"
import { renderToString } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { FlickeringGrid, toRgbTriplet } from "../components/flickering-grid"

const ctx = {
  setTransform: vi.fn(),
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  getImageData: vi.fn(() => ({ data: [10, 20, 30, 255] })),
  fillStyle: ""
}
const rafCallbacks = new Map<number, FrameRequestCallback>()
let rafId = 0
const roDisconnect = vi.fn()
const ioDisconnect = vi.fn()

beforeEach(() => {
  rafId = 0
  rafCallbacks.clear()
  Object.values(ctx).forEach((f) => typeof f === "function" && "mockClear" in f && (f as ReturnType<typeof vi.fn>).mockClear())
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(ctx as unknown as CanvasRenderingContext2D)
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    rafCallbacks.set(++rafId, cb)
    return rafId
  })
  vi.stubGlobal("cancelAnimationFrame", (id: number) => rafCallbacks.delete(id))
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect = roDisconnect
    }
  )
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect = ioDisconnect
    }
  )
  Object.defineProperty(HTMLElement.prototype, "clientWidth", { configurable: true, value: 100 })
  Object.defineProperty(HTMLElement.prototype, "clientHeight", { configurable: true, value: 50 })
  roDisconnect.mockClear()
  ioDisconnect.mockClear()
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  document.documentElement.removeAttribute("data-glin-motion")
})

describe("FlickeringGrid", () => {
  it("renders a decorative canvas that fills its container", () => {
    const { container } = render(<FlickeringGrid className="grid-x" />)
    const root = container.querySelector('[data-slot="flickering-grid"]')
    expect(root).toHaveAttribute("aria-hidden", "true")
    expect(root?.className).toContain("grid-x")
    expect(root?.className).toContain("pointer-events-none")
    expect(container.querySelector("canvas")).toBeInTheDocument()
  })

  it("sizes the canvas buffer from the container and draws squares", () => {
    const { container } = render(<FlickeringGrid squareSize={4} gridGap={6} />)
    const canvas = container.querySelector("canvas") as HTMLCanvasElement
    expect(canvas.width).toBe(100)
    expect(canvas.height).toBe(50)
    expect(ctx.fillRect).toHaveBeenCalledTimes(10 * 5 + 1) // 50 cells plus the 1px color probe
  })

  it("draws round squares with arc", () => {
    render(<FlickeringGrid variant="round" />)
    expect(ctx.arc).toHaveBeenCalled()
  })

  it("starts the rAF loop and cancels it on unmount with observers disconnected", () => {
    const { unmount } = render(<FlickeringGrid />)
    expect(rafCallbacks.size).toBe(1)
    unmount()
    expect(rafCallbacks.size).toBe(0)
    expect(roDisconnect).toHaveBeenCalled()
    expect(ioDisconnect).toHaveBeenCalled()
  })

  it("draws one static frame and no loop when motion is none", () => {
    document.documentElement.setAttribute("data-glin-motion", "none")
    const { container } = render(<FlickeringGrid />)
    expect(rafCallbacks.size).toBe(0)
    expect(ctx.fillRect).toHaveBeenCalled()
    expect(container.firstElementChild).toHaveAttribute("data-animated", "false")
  })

  it("injects the color token as a css variable", () => {
    const { container } = render(<FlickeringGrid color="var(--color-accent)" />)
    expect((container.firstElementChild as HTMLElement).style.getPropertyValue("--glin-flicker-color")).toBe("var(--color-accent)")
  })

  it("forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<FlickeringGrid ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it("converts colors to an rgb triplet with a safe fallback", () => {
    expect(toRgbTriplet("rgb(10, 20, 30)")).toBe("10, 20, 30")
  })

  it("renders on the server without throwing", () => {
    expect(() => renderToString(<FlickeringGrid />)).not.toThrow()
  })
})
