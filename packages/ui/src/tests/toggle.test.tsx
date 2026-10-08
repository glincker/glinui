import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createRef } from "react"

import { Toggle } from "../components/toggle"

describe("Toggle", () => {
  it("renders a button with aria-pressed false by default", () => {
    render(<Toggle aria-label="Bold">B</Toggle>)
    const el = screen.getByRole("button", { name: "Bold" })
    expect(el).toHaveAttribute("aria-pressed", "false")
    expect(el).toHaveAttribute("data-state", "off")
  })

  it("toggles uncontrolled on click and fires onPressedChange", async () => {
    const onPressedChange = vi.fn()
    render(
      <Toggle aria-label="Bold" onPressedChange={onPressedChange}>
        B
      </Toggle>
    )
    const el = screen.getByRole("button", { name: "Bold" })
    await userEvent.click(el)
    expect(el).toHaveAttribute("aria-pressed", "true")
    expect(onPressedChange).toHaveBeenCalledWith(true)
  })

  it("toggles with keyboard", async () => {
    render(<Toggle aria-label="Italic">I</Toggle>)
    const el = screen.getByRole("button", { name: "Italic" })
    el.focus()
    await userEvent.keyboard("{Enter}")
    expect(el).toHaveAttribute("data-state", "on")
    await userEvent.keyboard(" ")
    expect(el).toHaveAttribute("data-state", "off")
  })

  it("respects controlled pressed", async () => {
    render(
      <Toggle aria-label="Lock" pressed>
        L
      </Toggle>
    )
    const el = screen.getByRole("button", { name: "Lock" })
    await userEvent.click(el)
    expect(el).toHaveAttribute("aria-pressed", "true")
  })

  it("applies variants and sizes", () => {
    render(
      <>
        <Toggle aria-label="a">a</Toggle>
        <Toggle aria-label="b" variant="glass" size="lg">
          b
        </Toggle>
        <Toggle aria-label="c" variant="outline" size="sm">
          c
        </Toggle>
      </>
    )
    expect(screen.getByLabelText("a").className).toContain("--ring-img")
    expect(screen.getByLabelText("a").className).toContain("h-9")
    expect(screen.getByLabelText("b").className).toContain("backdrop-blur-xl")
    expect(screen.getByLabelText("b").className).toContain("h-10")
    expect(screen.getByLabelText("c").className).toContain("h-8")
  })

  it("supports disabled and merges className and ref", () => {
    const ref = createRef<HTMLButtonElement>()
    render(
      <Toggle ref={ref} aria-label="x" disabled className="custom-class">
        x
      </Toggle>
    )
    expect(ref.current).toBe(screen.getByRole("button"))
    expect(ref.current).toBeDisabled()
    expect(ref.current?.className).toContain("custom-class")
  })
})
