import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderToString } from "react-dom/server"
import { StrictMode } from "react"

import { MotionEngineProvider } from "../components/motion-engine"
import { AnimatedSpan, Terminal, TypingAnimation } from "../components/terminal"

function Demo({ motion }: { motion?: "none" | "subtle" | "full" }) {
  const body = (
    <Terminal title="shell" startOnView={false}>
      <TypingAnimation duration={10}>$ pnpm add @glinui/ui</TypingAnimation>
      <AnimatedSpan>Done in 2s</AnimatedSpan>
    </Terminal>
  )
  return motion ? <MotionEngineProvider motion={motion}>{body}</MotionEngineProvider> : body
}

const advance = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms)
  })

/** Timers are chained through renders, so step in small increments. */
const settle = (steps = 60, ms = 50) => {
  for (let i = 0; i < steps; i += 1) advance(ms)
}

describe("Terminal", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it("renders the full final text on the server", () => {
    const html = renderToString(<Demo />)
    expect(html).toContain("$ pnpm add @glinui/ui")
    expect(html).toContain("Done in 2s")
    expect(html).not.toContain("invisible")
  })

  it("renders the full text immediately when motion is none", () => {
    render(<Demo motion="none" />)
    expect(screen.getByText("$ pnpm add @glinui/ui")).toBeVisible()
    expect(screen.getByText("Done in 2s")).toBeVisible()
    expect(screen.getByRole("group")).toHaveAttribute("data-animating", "false")
  })

  it("types the command, then reveals the next line in sequence", () => {
    const { container } = render(<Demo />)
    const lines = container.querySelectorAll("[data-state]")
    expect(lines[1]).toHaveAttribute("data-state", "hidden")
    advance(1)
    advance(60)
    expect(container.querySelector("code span span")?.textContent?.length).toBeGreaterThan(0)
    expect(screen.getByRole("group")).toHaveAttribute("data-animating", "true")
    advance(400)
    advance(400)
    advance(400)
    expect(container.querySelectorAll("[data-state='shown']").length).toBe(2)
    expect(screen.getByRole("group")).toHaveAttribute("data-animating", "false")
  })

  it("hides the animated layer from assistive tech and exposes a full transcript", () => {
    const { container } = render(<Demo />)
    expect(container.querySelector("pre")).toHaveAttribute("aria-hidden", "true")
    const transcript = container.querySelector('[data-slot="transcript"]')
    expect(transcript).toHaveTextContent("$ pnpm add @glinui/ui")
    expect(transcript).toHaveTextContent("Done in 2s")
    settle()
    expect(container.querySelector("pre")).not.toHaveAttribute("aria-hidden")
    expect(container.querySelector('[data-slot="transcript"]')).toBeNull()
  })

  it("subtle motion fades lines without typing", () => {
    const { container } = render(<Demo motion="subtle" />)
    settle()
    expect(container.querySelector("pre")).not.toHaveAttribute("aria-hidden")
    expect(container.innerHTML).not.toContain("glin-a4-caret")
    expect(screen.getByText("$ pnpm add @glinui/ui")).toBeInTheDocument()
  })

  it("waits for intersection when startOnView is on", () => {
    const callbacks: Array<(entries: Array<{ isIntersecting: boolean }>) => void> = []
    class IO {
      constructor(cb: (entries: Array<{ isIntersecting: boolean }>) => void) {
        callbacks.push(cb)
      }
      observe() {}
      disconnect() {}
    }
    vi.stubGlobal("IntersectionObserver", IO)
    const { container } = render(
      <Terminal>
        <AnimatedSpan>Line</AnimatedSpan>
      </Terminal>
    )
    advance(1000)
    expect(container.querySelector("[data-state]")).toHaveAttribute("data-state", "hidden")
    act(() => callbacks.forEach((cb) => cb([{ isIntersecting: true }])))
    advance(1)
    expect(container.querySelector("[data-state]")).toHaveAttribute("data-state", "shown")
    vi.unstubAllGlobals()
  })

  it("clears timers on unmount", () => {
    const { unmount } = render(<Demo />)
    advance(1)
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })

  it("is strict mode safe and still completes", () => {
    const { container } = render(
      <StrictMode>
        <Demo />
      </StrictMode>
    )
    settle()
    expect(container.querySelectorAll("[data-state='shown']").length).toBe(2)
    expect(container.querySelector("code")?.textContent).toBe("$ pnpm add @glinui/uiDone in 2s")
  })

  it("non-sequence mode reveals every line after its own delay", () => {
    const { container } = render(
      <Terminal sequence={false} startOnView={false}>
        <AnimatedSpan delay={100}>A</AnimatedSpan>
        <AnimatedSpan delay={500}>B</AnimatedSpan>
      </Terminal>
    )
    advance(150)
    const states = Array.from(container.querySelectorAll("[data-state]")).map((n) => n.getAttribute("data-state"))
    expect(states).toEqual(["shown", "hidden"])
  })

  it("ignores non animated children for sequencing", () => {
    const { container } = render(
      <Terminal startOnView={false}>
        <span>plain</span>
        <AnimatedSpan>after</AnimatedSpan>
      </Terminal>
    )
    advance(1)
    expect(container.querySelector("[data-state]")).toHaveAttribute("data-state", "shown")
  })

  it("copies the transcript with a polite live region", async () => {
    vi.useRealTimers()
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true })
    render(<Demo motion="none" />)
    await user.click(screen.getByRole("button", { name: "Copy terminal output" }))
    expect(writeText).toHaveBeenCalledWith("$ pnpm add @glinui/ui\nDone in 2s")
    expect(screen.getByRole("status")).toHaveTextContent("Copied terminal output")
  })

  it("supports glass, hides copy, forces ltr output and merges className", () => {
    const { container } = render(
      <Terminal variant="glass" showCopy={false} className="custom-x" aria-label="Install">
        <AnimatedSpan>x</AnimatedSpan>
      </Terminal>
    )
    const root = screen.getByRole("group", { name: "Install" })
    expect(root.className).toContain("backdrop-blur-xl")
    expect(root.className).toContain("custom-x")
    expect(screen.queryByRole("button")).toBeNull()
    expect(container.querySelector("pre")).toHaveAttribute("dir", "ltr")
  })

  it("renders standalone items as plain text", () => {
    render(<TypingAnimation>hello</TypingAnimation>)
    expect(screen.getByText("hello")).toBeInTheDocument()
  })
})
