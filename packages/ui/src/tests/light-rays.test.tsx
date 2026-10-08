import { cleanup, render } from "@testing-library/react"
import * as React from "react"
import { renderToString } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { LightRays, createRays } from "../components/light-rays"

type FakeAnim = { cancel: ReturnType<typeof vi.fn>; play: ReturnType<typeof vi.fn>; pause: ReturnType<typeof vi.fn> }
let anims: FakeAnim[] = []
let originalAnimate: unknown

beforeEach(() => {
  anims = []
  originalAnimate = (Element.prototype as { animate?: unknown }).animate
  Object.defineProperty(Element.prototype, "animate", {
    configurable: true,
    writable: true,
    value: vi.fn(() => {
      const a: FakeAnim = { cancel: vi.fn(), play: vi.fn(), pause: vi.fn() }
      anims.push(a)
      return a
    })
  })
})

afterEach(() => {
  cleanup()
  document.documentElement.removeAttribute("data-glin-motion")
  Object.defineProperty(Element.prototype, "animate", { configurable: true, writable: true, value: originalAnimate })
})

describe("LightRays", () => {
  it("is decorative and renders the requested ray count", () => {
    const { container } = render(<LightRays count={5} data-testid="rays" />)
    const root = container.querySelector('[data-slot="light-rays"]')
    expect(root).toHaveAttribute("aria-hidden", "true")
    expect(root?.className).toContain("pointer-events-none")
    expect(container.querySelectorAll("[data-ray]")).toHaveLength(5)
  })

  it("caps the ray count", () => {
    const { container } = render(<LightRays count={500} />)
    expect(container.querySelectorAll("[data-ray]")).toHaveLength(24)
  })

  it("merges className and forwards ref and props", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<LightRays ref={ref} className="custom-x" data-testid="r" />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current?.className).toContain("custom-x")
    expect(ref.current?.getAttribute("data-testid")).toBe("r")
  })

  it("applies token variables from props", () => {
    const { container } = render(<LightRays color="red" blur={12} length="40%" />)
    const root = container.firstElementChild as HTMLElement
    expect(root.style.getPropertyValue("--glin-rays-color")).toBe("red")
    expect(root.style.getPropertyValue("--glin-rays-blur")).toBe("12px")
    expect(root.style.getPropertyValue("--glin-rays-length")).toBe("40%")
  })

  it("is deterministic for a seed", () => {
    expect(createRays(6, 10, 3)).toEqual(createRays(6, 10, 3))
    expect(createRays(6, 10, 3)).not.toEqual(createRays(6, 10, 4))
  })

  it("animates at full level and cancels on unmount", () => {
    const { unmount } = render(<LightRays count={4} />)
    expect(anims).toHaveLength(4)
    unmount()
    anims.forEach((a) => expect(a.cancel).toHaveBeenCalled())
  })

  it("renders a static frame when motion is none", () => {
    document.documentElement.setAttribute("data-glin-motion", "none")
    const { container } = render(<LightRays count={4} />)
    expect(anims).toHaveLength(0)
    expect(container.firstElementChild).toHaveAttribute("data-animated", "false")
    const ray = container.querySelector("[data-ray]") as HTMLElement
    expect(ray.style.getPropertyValue("--ray-opacity")).not.toBe("")
  })

  it("renders on the server without throwing", () => {
    expect(() => renderToString(<LightRays />)).not.toThrow()
  })
})
