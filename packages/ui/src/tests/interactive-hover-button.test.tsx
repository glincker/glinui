import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderToString } from "react-dom/server"
import { Plus } from "@phosphor-icons/react/dist/ssr"

import { InteractiveHoverButton } from "../components/interactive-hover-button"
import { MotionEngineProvider } from "../components/motion-engine"

describe("InteractiveHoverButton", () => {
  it("renders one accessible label and hides the duplicate hover face", () => {
    const { container } = render(<InteractiveHoverButton>Get started</InteractiveHoverButton>)
    expect(screen.getByRole("button", { name: "Get started" })).toBeInTheDocument()
    const face = container.querySelector('[data-slot="hover-face"]')
    expect(face).toHaveAttribute("aria-hidden", "true")
    expect(face).toHaveTextContent("Get started")
  })

  it("defaults to type=button and the default variant", () => {
    render(<InteractiveHoverButton>Go</InteractiveHoverButton>)
    const button = screen.getByRole("button")
    expect(button).toHaveAttribute("type", "button")
    expect(button.className).toContain("var(--ring)")
    expect(button.className).not.toContain("backdrop-blur")
  })

  it("applies the glass variant", () => {
    render(<InteractiveHoverButton variant="glass">Glass</InteractiveHoverButton>)
    expect(screen.getByRole("button").className).toContain("backdrop-blur-xl")
  })

  it("supports sm, md and lg sizes", () => {
    const { rerender } = render(<InteractiveHoverButton size="sm">S</InteractiveHoverButton>)
    expect(screen.getByRole("button").className).toContain("h-8")
    rerender(<InteractiveHoverButton size="lg">L</InteractiveHoverButton>)
    expect(screen.getByRole("button").className).toContain("h-12")
  })

  it("activates with click, Enter and Space", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<InteractiveHoverButton onClick={onClick}>Go</InteractiveHoverButton>)
    await user.click(screen.getByRole("button"))
    screen.getByRole("button").focus()
    await user.keyboard("{Enter}")
    await user.keyboard(" ")
    expect(onClick).toHaveBeenCalledTimes(3)
  })

  it("has the focus-visible fill hook for keyboard parity", () => {
    const { container } = render(<InteractiveHoverButton>Go</InteractiveHoverButton>)
    expect(container.querySelector('[data-slot="fill"]')?.className).toContain("group-focus-visible:")
  })

  it("shows a spinner, sets aria-busy and blocks clicks while loading", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <InteractiveHoverButton loading onClick={onClick}>
        Save
      </InteractiveHoverButton>
    )
    const button = screen.getByRole("button")
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute("aria-busy", "true")
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument()
    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it("is disabled when disabled", () => {
    render(<InteractiveHoverButton disabled>Nope</InteractiveHoverButton>)
    expect(screen.getByRole("button")).toBeDisabled()
  })

  it("renders icons as decorative", () => {
    const { container } = render(
      <InteractiveHoverButton leadingIcon={<Plus data-testid="lead" />}>Add</InteractiveHoverButton>
    )
    expect(container.querySelector('[data-slot="rest"] [aria-hidden="true"]')).toContainElement(
      screen.getAllByTestId("lead")[0] ?? null
    )
  })

  it("supports asChild with a link and keeps one accessible name", () => {
    render(
      <InteractiveHoverButton asChild>
        <a href="/docs">Read docs</a>
      </InteractiveHoverButton>
    )
    const link = screen.getByRole("link", { name: "Read docs" })
    expect(link).toHaveAttribute("href", "/docs")
  })

  it("drops transitions and slides when motion is none", () => {
    const { container } = render(
      <MotionEngineProvider motion="none">
        <InteractiveHoverButton>Static</InteractiveHoverButton>
      </MotionEngineProvider>
    )
    expect(container.querySelector('[data-slot="rest"]')?.className).toContain("transition-none")
    expect(container.querySelector('[data-slot="rest"]')?.className).not.toContain("translate-x-3")
  })

  it("keeps color and opacity only when motion is subtle", () => {
    const { container } = render(
      <MotionEngineProvider motion="subtle">
        <InteractiveHoverButton>Subtle</InteractiveHoverButton>
      </MotionEngineProvider>
    )
    expect(container.querySelector('[data-slot="rest"]')?.className).not.toContain("translate-x-3")
  })

  it("merges className and forwards ref", () => {
    const ref = { current: null as HTMLButtonElement | null }
    render(
      <InteractiveHoverButton ref={ref} className="custom-x">
        Merge
      </InteractiveHoverButton>
    )
    expect(ref.current).toBe(screen.getByRole("button"))
    expect(screen.getByRole("button").className).toContain("custom-x")
  })

  it("renders on the server without throwing", () => {
    expect(() => renderToString(<InteractiveHoverButton>SSR</InteractiveHoverButton>)).not.toThrow()
  })
})
