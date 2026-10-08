import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { vi } from "vitest"

import {
  Message,
  MessageAction,
  MessageActions,
  MessageAvatar,
  MessageContent,
  MessageCopyAction
} from "../components/message"

describe("Message", () => {
  it("lays out user messages at the end with the accent bubble", () => {
    render(
      <Message role="user" data-testid="m">
        <MessageAvatar fallback="ME" />
        <MessageContent>Hi there</MessageContent>
      </Message>
    )
    expect(screen.getByTestId("m").className).toContain("flex-row-reverse")
    expect(screen.getByTestId("m")).toHaveAttribute("data-role", "user")
    expect(screen.getByText("Hi there").className).toContain("[--t-bg:var(--tone-accent)]")
  })

  it("renders assistant with surface bubble and glass variant", () => {
    render(
      <div>
        <Message><MessageContent>plain</MessageContent></Message>
        <Message variant="glass"><MessageContent>glassy</MessageContent></Message>
      </div>
    )
    expect(screen.getByText("plain").className).toContain("var(--face-1,var(--surface-1))")
    expect(screen.getByText("glassy").className).toContain("backdrop-blur")
  })

  it("hides the avatar for system messages and renders a muted pill", () => {
    render(
      <Message role="system">
        <MessageAvatar fallback="SY" data-testid="av" />
        <MessageContent>Session started</MessageContent>
      </Message>
    )
    expect(screen.queryByTestId("av")).toBeNull()
    expect(screen.getByText("Session started").className).toContain("rounded-full")
  })

  it("supports bare content and grouped spacing", () => {
    render(
      <Message grouped data-testid="m">
        <MessageContent bare>Prose</MessageContent>
      </Message>
    )
    expect(screen.getByTestId("m").className).toContain("mt-1")
    expect(screen.getByText("Prose").className).not.toContain("rounded-2xl")
  })

  it("exposes a labelled toolbar with pressable actions", () => {
    const onClick = vi.fn()
    render(
      <MessageActions>
        <MessageAction label="Good response" pressed onClick={onClick}>+</MessageAction>
      </MessageActions>
    )
    expect(screen.getByRole("toolbar", { name: "Message actions" })).toBeInTheDocument()
    const btn = screen.getByRole("button", { name: "Good response" })
    expect(btn).toHaveAttribute("aria-pressed", "true")
    fireEvent.click(btn)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("copies text and shows confirmation", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true })
    const onCopy = vi.fn()
    render(<MessageCopyAction value="secret" onCopy={onCopy} />)
    fireEvent.click(screen.getByRole("button", { name: "Copy message" }))
    await waitFor(() => expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument())
    expect(writeText).toHaveBeenCalledWith("secret")
    expect(onCopy).toHaveBeenCalledWith("secret")
  })
})
