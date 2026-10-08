import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Toggle, toggleVariants } from "../components/toggle"
import { resetToggleWarnings } from "../lib/warn-unlabeled"
import { ToggleGroup, ToggleGroupItem } from "../components/toggle-group"
import { findInvalidSizeClasses } from "./toggle-class-helpers"

describe("Toggle visuals and a11y", () => {
  beforeEach(() => resetToggleWarnings())

  it("uses color-mix for accent alpha, never a slash opacity on var()", () => {
    for (const variant of ["glinr", "solid", "plain", "soft", "outline", "ghost", "glass"] as const) {
      for (const size of ["sm", "md", "lg"] as const) {
        const cls = toggleVariants({ variant, size })
        expect(cls).not.toMatch(/\]\/\d/)
        expect(findInvalidSizeClasses(cls)).toEqual([])
      }
    }
    expect(toggleVariants({ variant: "default" })).toContain("data-[state=on]:[box-shadow:")
  })

  it("provides a 44px hit area and no inline style", () => {
    const { container } = render(<Toggle aria-label="B" size="sm">B</Toggle>)
    expect(screen.getByRole("button").className).toContain("after:-inset-y-1.5")
    expect(container.querySelector("[style]")).toBeNull()
  })

  it("warns once in dev when icon-only without a label", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    render(<Toggle><svg /></Toggle>)
    render(<Toggle><svg /></Toggle>)
    expect(warn).toHaveBeenCalledTimes(1)
    warn.mockRestore()
  })

  it("does not warn when labeled or has text", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    render(<Toggle aria-label="Bold"><svg /></Toggle>)
    render(<Toggle>Bold</Toggle>)
    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })

  it("group items warn when unlabeled icon-only", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a"><svg /></ToggleGroupItem>
      </ToggleGroup>
    )
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  it("group supports roving arrow focus and aria-checked selection", async () => {
    render(
      <ToggleGroup type="single" aria-label="Align" defaultValue="a">
        <ToggleGroupItem value="a" aria-label="A">A</ToggleGroupItem>
        <ToggleGroupItem value="b" aria-label="B">B</ToggleGroupItem>
      </ToggleGroup>
    )
    const a = screen.getByLabelText("A")
    a.focus()
    await userEvent.keyboard("{ArrowRight}")
    expect(screen.getByLabelText("B")).toHaveFocus()
    await userEvent.keyboard(" ")
    expect(screen.getByLabelText("B")).toHaveAttribute("aria-checked", "true")
    expect(a).toHaveAttribute("aria-checked", "false")
  })

  it("group joins edges with logical radii", () => {
    render(
      <ToggleGroup type="multiple" aria-label="Fmt">
        <ToggleGroupItem value="a" aria-label="A">A</ToggleGroupItem>
        <ToggleGroupItem value="b" aria-label="B">B</ToggleGroupItem>
      </ToggleGroup>
    )
    expect(screen.getByLabelText("A").className).toContain("first:rounded-s-xl")
    expect(screen.getByLabelText("B").className).toContain("last:rounded-e-xl")
  })
})
