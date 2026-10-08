import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ToggleGroup, ToggleGroupItem } from "../components/toggle-group"

describe("ToggleGroup", () => {
  it("renders a group with items (single selects one at a time)", async () => {
    const onValueChange = vi.fn()
    render(
      <ToggleGroup type="single" aria-label="Alignment" onValueChange={onValueChange}>
        <ToggleGroupItem value="left" aria-label="Left">L</ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Center">C</ToggleGroupItem>
      </ToggleGroup>
    )
    expect(screen.getByRole("radiogroup", { name: "Alignment" })).toBeInTheDocument()
    await userEvent.click(screen.getByLabelText("Left"))
    expect(onValueChange).toHaveBeenLastCalledWith("left")
    await userEvent.click(screen.getByLabelText("Center"))
    expect(onValueChange).toHaveBeenLastCalledWith("center")
    expect(screen.getByLabelText("Left")).toHaveAttribute("data-state", "off")
  })

  it("supports multiple selection", async () => {
    const onValueChange = vi.fn()
    render(
      <ToggleGroup type="multiple" aria-label="Format" onValueChange={onValueChange}>
        <ToggleGroupItem value="b" aria-label="Bold">B</ToggleGroupItem>
        <ToggleGroupItem value="i" aria-label="Italic">I</ToggleGroupItem>
      </ToggleGroup>
    )
    await userEvent.click(screen.getByLabelText("Bold"))
    await userEvent.click(screen.getByLabelText("Italic"))
    expect(onValueChange).toHaveBeenLastCalledWith(["b", "i"])
    expect(screen.getByLabelText("Bold")).toHaveAttribute("aria-pressed", "true")
  })

  it("supports controlled value", () => {
    render(
      <ToggleGroup type="single" value="center" aria-label="A">
        <ToggleGroupItem value="left" aria-label="Left">L</ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Center">C</ToggleGroupItem>
      </ToggleGroup>
    )
    expect(screen.getByLabelText("Center")).toHaveAttribute("data-state", "on")
  })

  it("passes variant and size to items and merges shared borders", () => {
    render(
      <ToggleGroup type="single" variant="glass" size="lg" aria-label="A">
        <ToggleGroupItem value="a" aria-label="A1">a</ToggleGroupItem>
        <ToggleGroupItem value="b" aria-label="B1" size="sm">b</ToggleGroupItem>
      </ToggleGroup>
    )
    const a = screen.getByLabelText("A1")
    expect(a.className).toContain("backdrop-blur-xl")
    expect(a.className).toContain("h-10")
    expect(a.className).toContain("rounded-none")
    expect(screen.getByLabelText("B1").className).toContain("h-8")
  })

  it("uses gaps instead of merged borders when spacing is set", () => {
    render(
      <ToggleGroup type="single" spacing={2} aria-label="A" className="extra">
        <ToggleGroupItem value="a" aria-label="A1">a</ToggleGroupItem>
      </ToggleGroup>
    )
    expect(screen.getByRole("radiogroup").className).toContain("gap-2")
    expect(screen.getByRole("radiogroup").className).toContain("extra")
    expect(screen.getByLabelText("A1").className).not.toContain("rounded-none")
  })

  it("moves focus between items with arrow keys", async () => {
    render(
      <ToggleGroup type="single" aria-label="A">
        <ToggleGroupItem value="a" aria-label="A1">a</ToggleGroupItem>
        <ToggleGroupItem value="b" aria-label="B1">b</ToggleGroupItem>
      </ToggleGroup>
    )
    screen.getByLabelText("A1").focus()
    await userEvent.keyboard("{ArrowRight}")
    expect(screen.getByLabelText("B1")).toHaveFocus()
  })
})
