import { render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { MotionEngineProvider } from "../components/motion-engine"
import { ShineBorder } from "../components/shine-border"
import { installWebAnimations } from "./motion-test-utils"

let restore: (() => void) | undefined
afterEach(() => restore?.())

describe("ShineBorder", () => {
  it("renders an aria-hidden decorative layer and merges className", () => {
    render(<ShineBorder data-testid="s" className="custom-x" />)
    const el = screen.getByTestId("s")
    expect(el).toHaveAttribute("aria-hidden", "true")
    expect(el).toHaveClass("custom-x", "pointer-events-none", "rounded-[inherit]")
  })

  it("applies width and color variables, accepts arrays", () => {
    render(<ShineBorder data-testid="s" borderWidth={3} shineColor={["red", "blue"]} />)
    const el = screen.getByTestId("s")
    expect(el.style.getPropertyValue("--shine-bw")).toBe("3px")
    expect(el.style.getPropertyValue("--shine-color")).toBe("red,blue")
  })

  it("supports glass variant", () => {
    render(<ShineBorder data-testid="s" variant="glass" />)
    expect(screen.getByTestId("s").className).toContain("color-mix")
  })

  it("animates at level full and cancels on unmount", () => {
    const api = installWebAnimations()
    restore = api.restore
    const { unmount } = render(
      <MotionEngineProvider motion="full">
        <ShineBorder duration={10} />
      </MotionEngineProvider>
    )
    expect(api.calls).toHaveLength(1)
    expect(api.calls[0].options.duration).toBe(10000)
    unmount()
  })

  it("stays static at level none", () => {
    const api = installWebAnimations()
    restore = api.restore
    render(
      <MotionEngineProvider motion="none">
        <ShineBorder data-testid="s" />
      </MotionEngineProvider>
    )
    expect(api.calls).toHaveLength(0)
    expect(screen.getByTestId("s")).toHaveAttribute("data-animated", "false")
  })
})
