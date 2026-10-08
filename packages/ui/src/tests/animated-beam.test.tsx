import { act, cleanup, render } from "@testing-library/react"
import * as React from "react"
import { renderToString } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { AnimatedBeam } from "../components/animated-beam"

const observers: Array<{ disconnect: ReturnType<typeof vi.fn>; observed: Element[]; cb: () => void }> = []
let anims: Array<{ cancel: ReturnType<typeof vi.fn>; play: ReturnType<typeof vi.fn>; pause: ReturnType<typeof vi.fn> }> = []
let originalAnimate: unknown

function rect(left: number, top: number, w: number, h: number): DOMRect {
  return { left, top, width: w, height: h, right: left + w, bottom: top + h, x: left, y: top, toJSON: () => ({}) }
}

beforeEach(() => {
  observers.length = 0
  anims = []
  originalAnimate = (Element.prototype as { animate?: unknown }).animate
  Object.defineProperty(Element.prototype, "animate", {
    configurable: true,
    writable: true,
    value: vi.fn(() => {
      const a = { cancel: vi.fn(), play: vi.fn(), pause: vi.fn() }
      anims.push(a)
      return a
    })
  })
  class RO {
    disconnect = vi.fn()
    observed: Element[] = []
    constructor(public cb: () => void) {
      observers.push(this)
    }
    observe(el: Element) {
      this.observed.push(el)
    }
    unobserve() {}
  }
  vi.stubGlobal("ResizeObserver", RO)
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    cb(0)
    return 1
  })
  vi.stubGlobal("cancelAnimationFrame", () => {})
  Object.defineProperty(SVGElement.prototype, "getTotalLength", { configurable: true, value: () => 200 })
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  document.documentElement.removeAttribute("data-glin-motion")
  Object.defineProperty(Element.prototype, "animate", { configurable: true, writable: true, value: originalAnimate })
})

function Harness(props: Partial<React.ComponentProps<typeof AnimatedBeam>> & { dir?: "rtl" | "ltr" }) {
  const container = React.useRef<HTMLDivElement>(null)
  const a = React.useRef<HTMLDivElement>(null)
  const b = React.useRef<HTMLDivElement>(null)
  React.useLayoutEffect(() => {
    container.current!.getBoundingClientRect = () => rect(0, 0, 400, 200)
    a.current!.getBoundingClientRect = () => rect(0, 90, 20, 20)
    b.current!.getBoundingClientRect = () => rect(380, 90, 20, 20)
  }, [])
  return (
    <div ref={container} dir={props.dir}>
      <div ref={a} />
      <div ref={b} />
      <AnimatedBeam containerRef={container} fromRef={a} toRef={b} {...props} />
    </div>
  )
}

describe("AnimatedBeam", () => {
  it("draws a path between anchors and is decorative", () => {
    const { container } = render(<Harness />)
    const svg = container.querySelector('[data-slot="animated-beam"]')
    expect(svg).toHaveAttribute("aria-hidden", "true")
    expect(svg?.getAttribute("class")).toContain("pointer-events-none")
    const paths = container.querySelectorAll("path")
    expect(paths).toHaveLength(2)
    expect(paths[0].getAttribute("d")).toBe("M 10,100 Q 200,100 390,100")
    expect(svg?.getAttribute("width")).toBe("400")
  })

  it("applies curvature, className and unique gradient id", () => {
    const { container } = render(
      <>
        <Harness curvature={40} className="beam-x" />
        <Harness />
      </>
    )
    const first = container.querySelector("svg")
    expect(first?.getAttribute("class")).toContain("beam-x")
    expect(container.querySelector("path")?.getAttribute("d")).toContain("Q 200,60")
    const ids = Array.from(container.querySelectorAll("linearGradient")).map((g) => g.id)
    expect(new Set(ids).size).toBe(2)
  })

  it("animates the dash and cancels on unmount", () => {
    const { unmount } = render(<Harness />)
    expect(anims.length).toBeGreaterThan(0)
    unmount()
    anims.forEach((a) => expect(a.cancel).toHaveBeenCalled())
  })

  it("observes container and both anchors and disconnects", () => {
    const { unmount } = render(<Harness />)
    expect(observers[0].observed).toHaveLength(3)
    unmount()
    expect(observers[0].disconnect).toHaveBeenCalled()
  })

  it("shows a static line when motion is none", () => {
    document.documentElement.setAttribute("data-glin-motion", "none")
    const { container } = render(<Harness />)
    expect(anims).toHaveLength(0)
    const beam = container.querySelectorAll("path")[1]
    expect(beam.getAttribute("stroke-dasharray")).toBeNull()
    expect(beam.getAttribute("opacity")).toBe("1")
  })

  it("flips x offsets in rtl", () => {
    const { container } = render(<Harness dir="rtl" startXOffset={10} />)
    const d = container.querySelector("path")?.getAttribute("d")
    expect(d?.startsWith("M 0,100")).toBe(true)
    void act
  })

  it("renders on the server without throwing", () => {
    const ref = { current: null }
    expect(() => renderToString(<AnimatedBeam containerRef={ref} fromRef={ref} toRef={ref} />)).not.toThrow()
  })
})
