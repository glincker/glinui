import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderToString } from "react-dom/server"

import { GenerateButton } from "../components/generate-button"
import { MotionEngineProvider } from "../components/motion-engine"

describe("GenerateButton", () => {
  it("renders the idle label as the accessible name", () => {
    render(<GenerateButton />)
    expect(screen.getByRole("button", { name: "Generate" })).toBeInTheDocument()
    expect(screen.getByRole("button")).toHaveAttribute("data-generating", "false")
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-busy")
  })

  it("switches name, aria-busy and live status when generating", () => {
    render(<GenerateButton isGenerating />)
    const button = screen.getByRole("button", { name: "Generating" })
    expect(button).toHaveAttribute("aria-busy", "true")
    expect(button).toHaveAttribute("data-generating", "true")
    expect(screen.getByRole("status")).toHaveTextContent("Generating")
  })

  it("toggles on click when uncontrolled and reports changes", async () => {
    const user = userEvent.setup()
    const onGeneratingChange = vi.fn()
    render(<GenerateButton onGeneratingChange={onGeneratingChange} />)
    await user.click(screen.getByRole("button"))
    expect(screen.getByRole("button")).toHaveAttribute("data-generating", "true")
    expect(onGeneratingChange).toHaveBeenLastCalledWith(true)
    await user.click(screen.getByRole("button"))
    expect(onGeneratingChange).toHaveBeenLastCalledWith(false)
  })

  it("does not change state itself when controlled", async () => {
    const user = userEvent.setup()
    const onGeneratingChange = vi.fn()
    render(<GenerateButton isGenerating={false} onGeneratingChange={onGeneratingChange} />)
    await user.click(screen.getByRole("button"))
    expect(onGeneratingChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole("button")).toHaveAttribute("data-generating", "false")
  })

  it("starts generating from defaultGenerating", () => {
    render(<GenerateButton defaultGenerating />)
    expect(screen.getByRole("button")).toHaveAttribute("data-generating", "true")
  })

  it("is keyboard activatable with Enter and Space", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<GenerateButton onClick={onClick} />)
    screen.getByRole("button").focus()
    await user.keyboard("{Enter}")
    await user.keyboard(" ")
    expect(onClick).toHaveBeenCalledTimes(2)
  })

  it("loading shows a spinner, disables and sets aria-busy", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<GenerateButton loading onClick={onClick} />)
    const button = screen.getByRole("button")
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute("aria-busy", "true")
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument()
    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it("applies the glass variant and sizes", () => {
    const { rerender } = render(<GenerateButton variant="glass" size="lg" />)
    expect(screen.getByRole("button").className).toContain("backdrop-blur-xl")
    expect(screen.getByRole("button").className).toContain("h-12")
    rerender(<GenerateButton size="sm" />)
    expect(screen.getByRole("button").className).toContain("h-8")
  })

  it("applies the hue as a CSS variable and cleans it up", () => {
    const { unmount } = render(<GenerateButton hue={120} />)
    const button = screen.getByRole("button")
    expect(button.style.getPropertyValue("--glin-hue")).toBe("120")
    unmount()
    expect(button.style.getPropertyValue("--glin-hue")).toBe("")
  })

  it("supports custom labels and asChild", () => {
    render(
      <GenerateButton asChild label="Draft reply" generatingLabel="Drafting">
        <a href="/draft" />
      </GenerateButton>
    )
    expect(screen.getByRole("link", { name: "Draft reply" })).toHaveAttribute("href", "/draft")
  })

  it("does not animate the label or icon when motion is none or subtle", () => {
    const { container, rerender } = render(
      <MotionEngineProvider motion="none">
        <GenerateButton isGenerating />
      </MotionEngineProvider>
    )
    expect(container.innerHTML).not.toContain("glin-a4-gen-shine")
    expect(container.innerHTML).not.toContain("glin-a4-gen-spark")
    rerender(
      <MotionEngineProvider motion="subtle">
        <GenerateButton isGenerating />
      </MotionEngineProvider>
    )
    expect(container.innerHTML).not.toContain("glin-a4-gen-shine")
  })

  it("animates in full motion while generating", () => {
    const { container } = render(<GenerateButton isGenerating />)
    expect(container.innerHTML).toContain("glin-a4-gen-shine")
  })

  it("merges className and forwards ref", () => {
    const ref = { current: null as HTMLButtonElement | null }
    render(<GenerateButton ref={ref} className="custom-x" />)
    expect(ref.current).toBe(screen.getByRole("button"))
    expect(screen.getByRole("button").className).toContain("custom-x")
  })

  it("renders on the server without throwing", () => {
    expect(() => renderToString(<GenerateButton isGenerating />)).not.toThrow()
  })
})
