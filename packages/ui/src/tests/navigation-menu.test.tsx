import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "../components/navigation-menu"

function Demo(props: { variant?: "default" | "glass"; className?: string }) {
  return (
    <NavigationMenu data-testid="root" aria-label="Main" {...props}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="/analytics">Analytics</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/docs" className={navigationMenuTriggerStyle()} active>
            Docs
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

describe("NavigationMenu", () => {
  it("renders a navigation landmark with a list", () => {
    render(<Demo />)
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument()
    expect(screen.getByRole("list")).toBeInTheDocument()
  })

  it("marks the active link with aria-current", () => {
    render(<Demo />)
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("aria-current", "page")
  })

  it("opens content from the trigger and reflects aria-expanded", async () => {
    const user = userEvent.setup()
    render(<Demo />)
    const trigger = screen.getByRole("button", { name: "Products" })
    expect(trigger).toHaveAttribute("aria-expanded", "false")
    await user.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(await screen.findByRole("link", { name: "Analytics" })).toBeInTheDocument()
  })

  it("opens with keyboard", async () => {
    const user = userEvent.setup()
    render(<Demo />)
    await user.tab()
    expect(screen.getByRole("button", { name: "Products" })).toHaveFocus()
    await user.keyboard("{Enter}")
    expect(await screen.findByRole("link", { name: "Analytics" })).toBeInTheDocument()
  })

  it("merges className and exposes trigger style helper", () => {
    render(<Demo className="custom-x" />)
    expect(screen.getByTestId("root")).toHaveClass("custom-x")
    expect(navigationMenuTriggerStyle()).toContain("focus-visible:ring-2")
  })
})
