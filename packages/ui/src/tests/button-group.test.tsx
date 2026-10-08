import { render, screen } from "@testing-library/react"

import { Button } from "../components/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText
} from "../components/button-group"

describe("ButtonGroup", () => {
  it("renders a labelled group of buttons", () => {
    render(
      <ButtonGroup aria-label="Actions">
        <Button variant="outline">Copy</Button>
        <Button variant="primary">Save</Button>
      </ButtonGroup>
    )
    const group = screen.getByRole("group", { name: "Actions" })
    expect(group).toHaveAttribute("data-slot", "button-group")
    expect(screen.getAllByRole("button")).toHaveLength(2)
  })

  it("merges adjacent buttons with shared borders and outer-only rounding", () => {
    render(
      <ButtonGroup aria-label="A">
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>
    )
    const cls = screen.getByRole("group").className
    expect(cls).toContain("[&>*]:!rounded-none")
    expect(cls).toContain("[&>*:first-child]:!rounded-s-xl")
    expect(cls).toContain("[&>*:last-child]:!rounded-e-xl")
    expect(cls).toContain("[&>*:not(:first-child)]:-ms-px")
  })

  it("supports vertical orientation", () => {
    render(<ButtonGroup orientation="vertical" aria-label="V"><Button>a</Button></ButtonGroup>)
    const group = screen.getByRole("group")
    expect(group).toHaveAttribute("data-orientation", "vertical")
    expect(group.className).toContain("flex-col")
    expect(group.className).toContain("-mt-px")
  })

  it("supports glass variant and className merge", () => {
    render(<ButtonGroup variant="glass" className="custom" aria-label="G"><Button>a</Button></ButtonGroup>)
    expect(screen.getByRole("group").className).toContain("backdrop-blur-md")
    expect(screen.getByRole("group").className).toContain("custom")
  })

  it("renders text and separator parts", () => {
    render(
      <ButtonGroup aria-label="P">
        <ButtonGroupText>https://</ButtonGroupText>
        <ButtonGroupSeparator />
        <Button>Go</Button>
      </ButtonGroup>
    )
    expect(screen.getByText("https://")).toHaveAttribute("data-slot", "button-group-text")
    const sep = screen.getByRole("separator")
    expect(sep).toHaveAttribute("aria-orientation", "vertical")
  })

  it("renders ButtonGroupText asChild", () => {
    render(
      <ButtonGroup aria-label="P">
        <ButtonGroupText asChild>
          <label htmlFor="x">Label</label>
        </ButtonGroupText>
      </ButtonGroup>
    )
    expect(screen.getByText("Label").tagName).toBe("LABEL")
  })
})
