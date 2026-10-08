import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"

import { PromptInput } from "../components/prompt-input"

describe("PromptInput", () => {
  it("has an accessible textarea and a send button", () => {
    render(<PromptInput label="Ask Glin" />)
    expect(screen.getByRole("textbox", { name: "Ask Glin" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled()
  })

  it("sends on Enter and clears an uncontrolled field", async () => {
    const onSubmit = vi.fn()
    render(<PromptInput onSubmit={onSubmit} />)
    const box = screen.getByRole("textbox")
    await userEvent.type(box, "hello{Enter}")
    expect(onSubmit).toHaveBeenCalledWith("hello")
    expect(box).toHaveValue("")
  })

  it("inserts a newline on Shift+Enter instead of sending", async () => {
    const onSubmit = vi.fn()
    render(<PromptInput onSubmit={onSubmit} />)
    const box = screen.getByRole("textbox")
    await userEvent.type(box, "a{Shift>}{Enter}{/Shift}b")
    expect(onSubmit).not.toHaveBeenCalled()
    expect(box).toHaveValue("a\nb")
  })

  it("ignores Enter while an IME composition is active", () => {
    const onSubmit = vi.fn()
    render(<PromptInput onSubmit={onSubmit} defaultValue="konnichiwa" />)
    const box = screen.getByRole("textbox")
    fireEvent.compositionStart(box)
    fireEvent.keyDown(box, { key: "Enter" })
    expect(onSubmit).not.toHaveBeenCalled()
    fireEvent.compositionEnd(box)
    fireEvent.keyDown(box, { key: "Enter", keyCode: 229 })
    expect(onSubmit).not.toHaveBeenCalled()
    fireEvent.keyDown(box, { key: "Enter" })
    expect(onSubmit).toHaveBeenCalledWith("konnichiwa")
  })

  it("supports Cmd/Ctrl+Enter mode where plain Enter adds a line", () => {
    const onSubmit = vi.fn()
    render(<PromptInput submitOn="mod-enter" onSubmit={onSubmit} defaultValue="go" />)
    const box = screen.getByRole("textbox")
    fireEvent.keyDown(box, { key: "Enter" })
    expect(onSubmit).not.toHaveBeenCalled()
    fireEvent.keyDown(box, { key: "Enter", metaKey: true })
    expect(onSubmit).toHaveBeenCalledWith("go")
  })

  it("does not send empty or whitespace-only input", () => {
    const onSubmit = vi.fn()
    render(<PromptInput onSubmit={onSubmit} defaultValue="   " />)
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" })
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("is read-only while loading and shows a working stop button", () => {
    const onStop = vi.fn()
    const onSubmit = vi.fn()
    render(<PromptInput loading onStop={onStop} onSubmit={onSubmit} defaultValue="x" />)
    const box = screen.getByRole("textbox")
    expect(box).toHaveAttribute("readonly")
    expect(box).toHaveAttribute("aria-busy", "true")
    fireEvent.keyDown(box, { key: "Enter" })
    expect(onSubmit).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole("button", { name: "Stop generating" }))
    expect(onStop).toHaveBeenCalled()
  })

  it("disables everything when disabled", () => {
    render(<PromptInput disabled defaultValue="x" />)
    expect(screen.getByRole("textbox")).toBeDisabled()
    expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled()
  })

  it("shows the character hint and works controlled", () => {
    const onValueChange = vi.fn()
    render(<PromptInput value="abc" maxLength={10} onValueChange={onValueChange} />)
    expect(screen.getByText("3/10")).toBeInTheDocument()
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "abcd" } })
    expect(onValueChange).toHaveBeenCalledWith("abcd")
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-describedby")
  })

  it("renders attachment and action slots and the glass variant", () => {
    render(<PromptInput variant="glass" attachments={<span>chip</span>} actions={<button type="button">Attach</button>} />)
    expect(screen.getByText("chip")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Attach" })).toBeInTheDocument()
    expect(screen.getByRole("textbox").closest("form")?.className).toContain("backdrop-blur")
  })
})
