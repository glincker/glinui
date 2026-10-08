import { fireEvent, render, screen } from "@testing-library/react"
import { vi } from "vitest"

import { Thinking } from "../components/thinking"

describe("Thinking", () => {
  it("announces the active state as a status", () => {
    render(<Thinking />)
    expect(screen.getByRole("status")).toHaveTextContent("Thinking")
  })

  it("renders the done label without status role", () => {
    render(<Thinking active={false} doneLabel="Thought for 4s" />)
    expect(screen.getByText("Thought for 4s")).toBeInTheDocument()
    expect(screen.queryByRole("status")).toBeNull()
  })

  it("supports the shimmer indicator", () => {
    render(<Thinking indicator="shimmer" />)
    expect(screen.getByText("Thinking").className).toContain("animate-pulse")
  })

  it("toggles reasoning details with aria-expanded", () => {
    const onOpenChange = vi.fn()
    render(<Thinking onOpenChange={onOpenChange}>Step one</Thinking>)
    const btn = screen.getByRole("button")
    expect(btn).toHaveAttribute("aria-expanded", "false")
    expect(screen.getByText("Step one")).not.toBeVisible()
    fireEvent.click(btn)
    expect(btn).toHaveAttribute("aria-expanded", "true")
    expect(btn.getAttribute("aria-controls")).toBe(screen.getByText("Step one").id)
    expect(screen.getByText("Step one")).toBeVisible()
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it("can be controlled and default open", () => {
    const { rerender } = render(<Thinking defaultOpen>Body</Thinking>)
    expect(screen.getByText("Body")).toBeVisible()
    rerender(<Thinking open={false}>Body</Thinking>)
    expect(screen.getByText("Body")).not.toBeVisible()
  })
})
