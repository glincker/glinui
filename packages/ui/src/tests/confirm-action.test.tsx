import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"

import { ConfirmAction, type ConfirmActionProps } from "../index"

function setup(props: Partial<ConfirmActionProps> = {}) {
  const onConfirm = vi.fn()
  const onOpenChange = vi.fn()
  render(
    <ConfirmAction
      trigger={(open) => (
        <button type="button" onClick={open}>
          Delete
        </button>
      )}
      title="Delete web?"
      description="This cannot be undone."
      consequences={["The container is removed", "Logs are dropped"]}
      confirmLabel="Delete web"
      onConfirm={onConfirm}
      onOpenChange={onOpenChange}
      {...props}
    />
  )
  return { onConfirm, onOpenChange, user: userEvent.setup() }
}

describe("ConfirmAction", () => {
  it("stays closed until the trigger opens it", async () => {
    const { user } = setup()
    expect(screen.queryByRole("alertdialog")).toBeNull()
    await user.click(screen.getByRole("button", { name: "Delete" }))
    const dialog = screen.getByRole("alertdialog", { name: "Delete web?" })
    expect(dialog).toHaveAccessibleDescription("This cannot be undone.")
    expect(screen.getByText("The container is removed")).toBeInTheDocument()
    expect(screen.getByText("Logs are dropped")).toBeInTheDocument()
  })

  it("focuses Cancel first and closes on Escape", async () => {
    const { user, onOpenChange } = setup()
    await user.click(screen.getByRole("button", { name: "Delete" }))
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus()
    await user.keyboard("{Escape}")
    expect(screen.queryByRole("alertdialog")).toBeNull()
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
  })

  it("passes a close callback and keeps the dialog open until it is called", async () => {
    const onConfirm = vi.fn()
    const { user, onOpenChange } = setup({ onConfirm })
    await user.click(screen.getByRole("button", { name: "Delete" }))
    await user.click(screen.getByRole("button", { name: "Delete web" }))
    expect(screen.getByRole("alertdialog")).toBeInTheDocument()
    const close = onConfirm.mock.calls[0][0] as () => void
    act(() => close())
    await vi.waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull())
    expect(onOpenChange).toHaveBeenNthCalledWith(1, true)
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
  })

  it("blocks confirm until the typed value matches exactly", async () => {
    const { user, onConfirm } = setup({ typedConfirm: "web" })
    await user.click(screen.getByRole("button", { name: "Delete" }))
    const confirm = screen.getByRole("button", { name: "Delete web" })
    const field = screen.getByLabelText("Type web to confirm")
    expect(confirm).toBeDisabled()
    await user.type(field, "we")
    expect(confirm).toBeDisabled()
    await user.type(field, "b")
    expect(confirm).toBeEnabled()
    await user.keyboard("{Enter}")
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it("does not confirm on Enter while the typed value is wrong", async () => {
    const { user, onConfirm } = setup({ typedConfirm: "web" })
    await user.click(screen.getByRole("button", { name: "Delete" }))
    await user.type(screen.getByLabelText("Type web to confirm"), "x{Enter}")
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it("clears the typed value when reopened", async () => {
    const { user } = setup({ typedConfirm: "web" })
    await user.click(screen.getByRole("button", { name: "Delete" }))
    await user.type(screen.getByLabelText("Type web to confirm"), "web")
    await user.click(screen.getByRole("button", { name: "Cancel" }))
    await user.click(screen.getByRole("button", { name: "Delete" }))
    expect(screen.getByLabelText("Type web to confirm")).toHaveValue("")
  })

  it("shows pending text, disables confirm and surfaces errors", async () => {
    const { user } = setup({ pending: true, pendingLabel: "Deleting", error: "Server said no" })
    await user.click(screen.getByRole("button", { name: "Delete" }))
    expect(screen.getByRole("button", { name: "Deleting" })).toBeDisabled()
    expect(screen.getByText("Server said no")).toBeInTheDocument()
  })

  it("accepts translated strings", async () => {
    const { user } = setup({
      cancelLabel: "Abbrechen",
      typedConfirm: "web",
      typedConfirmLabel: (v) => `Tippe ${v} zur Bestaetigung`
    })
    await user.click(screen.getByRole("button", { name: "Delete" }))
    expect(screen.getByRole("button", { name: "Abbrechen" })).toBeInTheDocument()
    expect(screen.getByLabelText("Tippe web zur Bestaetigung")).toBeInTheDocument()
  })
})
