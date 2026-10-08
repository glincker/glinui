import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../components/collapsible"

function Demo(props: { variant?: "default" | "glass" | "ghost"; className?: string; defaultOpen?: boolean }) {
  return (
    <Collapsible data-testid="root" {...props}>
      <CollapsibleTrigger>Toggle</CollapsibleTrigger>
      <CollapsibleContent>Hidden body</CollapsibleContent>
    </Collapsible>
  )
}

describe("Collapsible", () => {
  it("is closed by default and toggles on click", async () => {
    const user = userEvent.setup()
    render(<Demo />)
    const trigger = screen.getByRole("button", { name: "Toggle" })
    expect(trigger).toHaveAttribute("aria-expanded", "false")
    expect(screen.queryByText("Hidden body")).not.toBeInTheDocument()
    await user.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText("Hidden body")).toBeVisible()
  })

  it("toggles with keyboard", async () => {
    const user = userEvent.setup()
    render(<Demo />)
    await user.tab()
    await user.keyboard("{Enter}")
    expect(screen.getByText("Hidden body")).toBeVisible()
    await user.keyboard(" ")
    expect(screen.queryByText("Hidden body")).not.toBeInTheDocument()
  })

  it("supports defaultOpen", () => {
    render(<Demo defaultOpen />)
    expect(screen.getByText("Hidden body")).toBeVisible()
  })

  it("applies variants", () => {
    const { rerender } = render(<Demo />)
    expect(screen.getByTestId("root")).toHaveAttribute("data-variant", "glinr")
    rerender(<Demo variant="glass" />)
    expect(screen.getByTestId("root").className).toMatch(/backdrop-blur-xl/)
    rerender(<Demo variant="ghost" />)
    expect(screen.getByTestId("root").className).toContain("bg-transparent")
  })

  it("merges className", () => {
    render(<Demo className="custom-x" />)
    expect(screen.getByTestId("root")).toHaveClass("custom-x")
  })
})
