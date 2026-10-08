import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { CtaBand } from "../components/cta-band"

describe("CtaBand", () => {
  it("renders a labelled section with heading and actions as links", () => {
    render(
      <CtaBand title="Start now" description="Free." primary={{ label: "Get started", href: "/start" }} secondary={{ label: "Docs", href: "/docs" }} />
    )
    expect(screen.getByRole("region", { name: "Start now" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Get started" })).toHaveAttribute("href", "/start")
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs")
  })

  it("defaults to centered with the glinr variant and no glow", () => {
    const { container } = render(<CtaBand title="T" />)
    const section = container.querySelector("section")!
    expect(section).toHaveAttribute("data-layout", "centered")
    expect(section).toHaveAttribute("data-variant", "glinr")
    expect(container.querySelector('[data-slot="glow"]')).toBeNull()
  })

  it("boxed-gradient shows the token glow, and glow can be forced", () => {
    const { container, rerender } = render(<CtaBand title="T" layout="boxed-gradient" />)
    expect(container.querySelector('[data-slot="glow"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="glow"]')).toHaveAttribute("aria-hidden", "true")
    rerender(<CtaBand title="T" glow />)
    expect(container.querySelector('[data-slot="glow"]')).toBeInTheDocument()
  })

  it("split layout with email capture submits the address", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<CtaBand title="T" layout="split" emailCapture={{ onSubmit, buttonLabel: "Join" }} />)
    await user.type(screen.getByLabelText("Email address"), "a@b.co")
    await user.click(screen.getByRole("button", { name: "Join" }))
    expect(onSubmit).toHaveBeenCalledWith("a@b.co")
  })

  it("renders the decorative background slot hidden from assistive tech", () => {
    const { container } = render(<CtaBand title="T" background={<i data-testid="bg" />} />)
    expect(container.querySelector('[data-slot="background"]')).toHaveAttribute("aria-hidden", "true")
  })

  it("accepts variant overrides", () => {
    const { container } = render(<CtaBand title="T" variant="glass" layout="split" />)
    expect(container.querySelector("section")).toHaveAttribute("data-variant", "glass")
  })
})
