import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger
} from "../components/menubar"

function Demo(props: { variant?: "default" | "glass" | "plain"; className?: string; onNew?: () => void }) {
  return (
    <Menubar data-testid="bar" variant={props.variant} className={props.className}>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent data-testid="content">
          <MenubarItem onSelect={props.onNew}>
            New <MenubarShortcut>Cmd N</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarCheckboxItem checked>Autosave</MenubarCheckboxItem>
          <MenubarRadioGroup value="a">
            <MenubarRadioItem value="a">Alpha</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

describe("Menubar", () => {
  it("renders a menubar with menuitem triggers", () => {
    render(<Demo />)
    expect(screen.getByRole("menubar")).toBeInTheDocument()
    expect(screen.getAllByRole("menuitem")).toHaveLength(2)
  })

  it("opens a menu and exposes item roles and checked state", async () => {
    const user = userEvent.setup()
    render(<Demo />)
    await user.click(screen.getByRole("menuitem", { name: "File" }))
    expect(screen.getByRole("menu")).toBeVisible()
    expect(screen.getByRole("menuitemcheckbox", { name: "Autosave" })).toHaveAttribute("aria-checked", "true")
    expect(screen.getByRole("menuitemradio", { name: "Alpha" })).toHaveAttribute("aria-checked", "true")
  })

  it("selects an item and closes", async () => {
    const user = userEvent.setup()
    const onNew = vi.fn()
    render(<Demo onNew={onNew} />)
    await user.click(screen.getByRole("menuitem", { name: "File" }))
    await user.click(screen.getByRole("menuitem", { name: /New/ }))
    expect(onNew).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole("menu")).not.toBeInTheDocument()
  })

  it("moves between triggers with arrow keys and closes with Escape", async () => {
    const user = userEvent.setup()
    render(<Demo />)
    await user.click(screen.getByRole("menuitem", { name: "File" }))
    await user.keyboard("{ArrowRight}")
    expect(screen.getByRole("menuitem", { name: "Undo" })).toBeInTheDocument()
    await user.keyboard("{Escape}")
    expect(screen.queryByRole("menu")).not.toBeInTheDocument()
  })

  it("uses the glinr panel by default and glass when requested", async () => {
    const user = userEvent.setup()
    const { unmount } = render(<Demo />)
    await user.click(screen.getByRole("menuitem", { name: "File" }))
    expect(screen.getByTestId("content")).toHaveAttribute("data-variant", "glinr")
    expect(screen.getByTestId("content").className).not.toMatch(/backdrop-blur/)
    unmount()
    render(<Demo variant="glass" />)
    await user.click(screen.getByRole("menuitem", { name: "File" }))
    expect(screen.getByTestId("content").className).toMatch(/backdrop-blur-xl/)
  })

  it("merges className", () => {
    render(<Demo className="custom-x" />)
    expect(screen.getByTestId("bar")).toHaveClass("custom-x")
  })
})
