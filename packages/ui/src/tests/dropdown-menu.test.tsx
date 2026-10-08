import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../index"

describe("DropdownMenu", () => {
  it("opens and renders menu item", async () => {
    const user = userEvent.setup()

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Account</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await user.click(screen.getByRole("button", { name: "Open menu" }))
    expect(screen.getByText("Account")).toBeVisible()
  })

  it("applies glass variant classes", async () => {
    const user = userEvent.setup()

    render(
      <DropdownMenu>
        <DropdownMenuTrigger variant="glass">Open menu</DropdownMenuTrigger>
        <DropdownMenuContent variant="glass" data-testid="content">
          <DropdownMenuItem>Account</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await user.click(screen.getByRole("button", { name: "Open menu" }))
    expect(screen.getByTestId("content").className).toMatch(/backdrop-blur-(md|lg|xl)/)
  })

  it("highlights items through panel tokens that adapt to every theme scope", async () => {
    const user = userEvent.setup()

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Account</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await user.click(screen.getByRole("button", { name: "Open menu" }))
    expect(screen.getByRole("menuitem", { name: "Account" }).className).toContain("data-[highlighted]:[background:var(--panel-item-bg")
  })
})
