import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea
} from "../components/input-group"

describe("InputGroup", () => {
  it("renders addons around an input and orders them", () => {
    render(
      <InputGroup aria-label="Search group">
        <InputGroupInput placeholder="Search" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>12 results</InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon>
          <span data-testid="icon">i</span>
        </InputGroupAddon>
      </InputGroup>
    )
    expect(screen.getByRole("group", { name: "Search group" })).toBeInTheDocument()
    expect(screen.getByText("12 results").closest("[data-slot=input-group-addon]")).toHaveClass("order-last")
    expect(screen.getByTestId("icon").parentElement).toHaveClass("order-first")
  })

  it("focuses the input when an addon is clicked", async () => {
    render(
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput aria-label="Site" />
      </InputGroup>
    )
    await userEvent.click(screen.getByText("https://"))
    expect(screen.getByLabelText("Site")).toHaveFocus()
  })

  it("does not steal clicks from addon buttons", async () => {
    const onClick = vi.fn()
    render(
      <InputGroup>
        <InputGroupInput aria-label="Q" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton onClick={onClick}>Copy</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    )
    await userEvent.click(screen.getByRole("button", { name: "Copy" }))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(screen.getByRole("button", { name: "Copy" })).toHaveAttribute("type", "button")
  })

  it("supports sizes and the glass variant", () => {
    render(
      <>
        <InputGroup data-testid="s" size="sm"><InputGroupInput aria-label="a" /></InputGroup>
        <InputGroup data-testid="g" variant="glass" size="lg"><InputGroupInput aria-label="b" /></InputGroup>
      </>
    )
    expect(screen.getByTestId("s").className).toContain("h-8")
    expect(screen.getByTestId("g").className).toContain("h-10")
    expect(screen.getByTestId("g").className).toContain("backdrop-blur-xl")
  })

  it("passes aria-invalid, disabled and value through to the control", async () => {
    render(
      <InputGroup>
        <InputGroupInput aria-label="E" aria-invalid defaultValue="x" />
      </InputGroup>
    )
    const input = screen.getByLabelText("E")
    expect(input).toHaveAttribute("aria-invalid", "true")
    await userEvent.type(input, "yz")
    expect(input).toHaveValue("xyz")
  })

  it("renders a textarea control with block addon", () => {
    render(
      <InputGroup className="custom">
        <InputGroupTextarea aria-label="Msg" rows={2} />
        <InputGroupAddon align="block-end">Footer</InputGroupAddon>
      </InputGroup>
    )
    expect(screen.getByLabelText("Msg").tagName).toBe("TEXTAREA")
    expect(screen.getByText("Footer")).toHaveAttribute("data-align", "block-end")
    expect(screen.getByRole("group").className).toContain("custom")
  })
})
