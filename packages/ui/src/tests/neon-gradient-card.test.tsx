import { render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it } from "vitest"

import { MotionEngineProvider } from "../components/motion-engine"
import { NeonGradientCard } from "../components/neon-gradient-card"
import { installWebAnimations } from "./motion-test-utils"

let restore: (() => void) | undefined
afterEach(() => restore?.())

describe("NeonGradientCard", () => {
  it("renders content and decorative layers are aria-hidden", () => {
    const { container } = render(<NeonGradientCard>Hello neon</NeonGradientCard>)
    expect(screen.getByText("Hello neon")).toBeVisible()
    container.querySelectorAll('[data-slot="neon-glow"], [data-slot="neon-ring"]').forEach((el) => {
      expect(el).toHaveAttribute("aria-hidden", "true")
    })
  })

  it("sets CSS variables from props and merges className", () => {
    render(
      <NeonGradientCard data-testid="n" className="extra" borderSize={4} borderRadius={12} neonColors={{ firstColor: "red" }}>
        x
      </NeonGradientCard>
    )
    const el = screen.getByTestId("n")
    expect(el).toHaveClass("extra")
    expect(el.style.getPropertyValue("--neon-bw")).toBe("4px")
    expect(el.style.getPropertyValue("--neon-radius")).toBe("12px")
    expect(el.style.getPropertyValue("--neon-a")).toBe("red")
    expect(el.style.getPropertyValue("--neon-b")).toBe("")
  })

  it("glass variant uses a translucent face", () => {
    render(<NeonGradientCard variant="glass">glass body</NeonGradientCard>)
    expect(screen.getByText("glass body").className).toContain("backdrop-blur")
  })

  it("animates ring and glow at full, none at level none (glow removed)", () => {
    const api = installWebAnimations()
    restore = api.restore
    const { container, unmount } = render(
      <MotionEngineProvider motion="full">
        <NeonGradientCard>a</NeonGradientCard>
      </MotionEngineProvider>
    )
    expect(api.calls).toHaveLength(2)
    unmount()
    api.calls.length = 0
    const view = render(
      <MotionEngineProvider motion="none">
        <NeonGradientCard data-testid="n">a</NeonGradientCard>
      </MotionEngineProvider>
    )
    expect(api.calls).toHaveLength(0)
    expect(screen.getByTestId("n")).toHaveAttribute("data-animated", "false")
    expect(view.container.querySelector('[data-slot="neon-glow"]')).toHaveClass("hidden")
    expect(container).toBeDefined()
  })

  it("renders on the server without throwing", () => {
    expect(() => renderToString(<NeonGradientCard>ssr</NeonGradientCard>)).not.toThrow()
  })
})
