import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger
} from "../components/context-menu"

function Demo(props: { variant?: "default" | "glass" | "plain"; onCopy?: () => void }) {
  return (
    <ContextMenu variant={props.variant}>
      <ContextMenuTrigger data-testid="area" className="custom-x">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent data-testid="content">
        <ContextMenuLabel>Actions</ContextMenuLabel>
        <ContextMenuItem onSelect={props.onCopy}>
          Copy <ContextMenuShortcut>Cmd C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked>Pinned</ContextMenuCheckboxItem>
        <ContextMenuItem disabled>Disabled</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

describe("ContextMenu", () => {
  it("opens on contextmenu event and exposes roles", () => {
    render(<Demo />)
    expect(screen.queryByRole("menu")).not.toBeInTheDocument()
    fireEvent.contextMenu(screen.getByTestId("area"))
    expect(screen.getByRole("menu")).toBeVisible()
    expect(screen.getByRole("menuitem", { name: /Copy/ })).toBeInTheDocument()
    expect(screen.getByRole("menuitemcheckbox", { name: "Pinned" })).toHaveAttribute("aria-checked", "true")
    expect(screen.getByRole("menuitem", { name: "Disabled" })).toHaveAttribute("aria-disabled", "true")
  })

  it("selects an item and closes", async () => {
    const user = userEvent.setup()
    const onCopy = vi.fn()
    render(<Demo onCopy={onCopy} />)
    fireEvent.contextMenu(screen.getByTestId("area"))
    await user.click(screen.getByRole("menuitem", { name: /Copy/ }))
    expect(onCopy).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole("menu")).not.toBeInTheDocument()
  })

  it("closes with Escape", async () => {
    const user = userEvent.setup()
    render(<Demo />)
    fireEvent.contextMenu(screen.getByTestId("area"))
    await user.keyboard("{Escape}")
    expect(screen.queryByRole("menu")).not.toBeInTheDocument()
  })

  it("uses the glinr panel by default and glass when requested", () => {
    const { unmount } = render(<Demo />)
    fireEvent.contextMenu(screen.getByTestId("area"))
    expect(screen.getByTestId("content")).toHaveAttribute("data-variant", "glinr")
    expect(screen.getByTestId("content").className).not.toMatch(/backdrop-blur/)
    unmount()
    render(<Demo variant="glass" />)
    fireEvent.contextMenu(screen.getByTestId("area"))
    expect(screen.getByTestId("content").className).toMatch(/backdrop-blur-xl/)
  })

  it("keeps trigger className", () => {
    render(<Demo />)
    expect(screen.getByTestId("area")).toHaveClass("custom-x")
  })
})
