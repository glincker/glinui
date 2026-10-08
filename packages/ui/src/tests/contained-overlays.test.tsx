import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  Modal,
  ModalContent,
  ModalDescription,
  ModalTitle,
  ModalTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger
} from "../index"

function setup() {
  const stage = document.createElement("div")
  document.body.appendChild(stage)
  return stage
}

describe("container prop", () => {
  it("scopes Modal portal to the container with absolute positioning", async () => {
    const user = userEvent.setup()
    const stage = setup()
    render(
      <Modal>
        <ModalTrigger>Open</ModalTrigger>
        <ModalContent container={stage}>
          <ModalTitle>T</ModalTitle>
          <ModalDescription>D</ModalDescription>
        </ModalContent>
      </Modal>
    )
    await user.click(screen.getByRole("button", { name: "Open" }))
    const dialog = screen.getByRole("dialog")
    expect(stage.contains(dialog)).toBe(true)
    expect(dialog.className).toContain("absolute")
    expect(dialog.className).not.toContain("fixed")
    expect(stage.querySelector("[data-state=open][class*='inset-0']")?.className).toContain("absolute")
  })

  it("keeps fixed positioning without container", async () => {
    const user = userEvent.setup()
    render(
      <Modal>
        <ModalTrigger>Open</ModalTrigger>
        <ModalContent>
          <ModalTitle>T</ModalTitle>
          <ModalDescription>D</ModalDescription>
        </ModalContent>
      </Modal>
    )
    await user.click(screen.getByRole("button", { name: "Open" }))
    expect(screen.getByRole("dialog").className).toContain("fixed")
  })

  it("scopes AlertDialog to the container", async () => {
    const user = userEvent.setup()
    const stage = setup()
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent container={stage}>
          <AlertDialogTitle>T</AlertDialogTitle>
          <AlertDialogDescription>D</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    )
    await user.click(screen.getByRole("button", { name: "Open" }))
    const dialog = screen.getByRole("alertdialog")
    expect(stage.contains(dialog)).toBe(true)
    expect(dialog.className).toContain("absolute")
  })

  it("scopes Sheet to the container", async () => {
    const user = userEvent.setup()
    const stage = setup()
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent container={stage}>
          <SheetTitle>T</SheetTitle>
          <SheetDescription>D</SheetDescription>
        </SheetContent>
      </Sheet>
    )
    await user.click(screen.getByRole("button", { name: "Open" }))
    const dialog = screen.getByRole("dialog")
    expect(stage.contains(dialog)).toBe(true)
    expect(dialog.className).toContain("absolute")
  })

  it("portals Popover into the container", async () => {
    const user = userEvent.setup()
    const stage = setup()
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent container={stage}>Body</PopoverContent>
      </Popover>
    )
    await user.click(screen.getByRole("button", { name: "Open" }))
    expect(stage.textContent).toContain("Body")
  })
})
