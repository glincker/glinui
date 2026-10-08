import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createRef, useState } from "react"

import { GlassToggle } from "../components/glass-toggle"
import { Switch } from "../components/switch"
import { findInvalidSizeClasses } from "./toggle-class-helpers"

const sizes = ["sm", "md", "lg"] as const

describe.each([
  ["Switch", Switch],
  ["GlassToggle", GlassToggle]
])("%s behavior", (_name, Component) => {
  it("toggles on click (uncontrolled) and reports the change", async () => {
    const onCheckedChange = vi.fn()
    render(<Component aria-label="Wifi" onCheckedChange={onCheckedChange} />)
    const el = screen.getByRole("switch", { name: "Wifi" })
    expect(el).toHaveAttribute("aria-checked", "false")
    await userEvent.click(el)
    expect(el).toHaveAttribute("aria-checked", "true")
    expect(onCheckedChange).toHaveBeenLastCalledWith(true)
    await userEvent.click(el)
    expect(el).toHaveAttribute("aria-checked", "false")
  })

  it("toggles with Space and Enter-free keyboard activation", async () => {
    render(<Component aria-label="Wifi" />)
    const el = screen.getByRole("switch")
    el.focus()
    await userEvent.keyboard(" ")
    expect(el).toHaveAttribute("aria-checked", "true")
  })

  it("respects defaultChecked and controlled checked", async () => {
    const onCheckedChange = vi.fn()
    const { rerender } = render(<Component aria-label="x" checked={false} onCheckedChange={onCheckedChange} />)
    const el = screen.getByRole("switch")
    await userEvent.click(el)
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    expect(el).toHaveAttribute("aria-checked", "false")
    rerender(<Component aria-label="x" checked onCheckedChange={onCheckedChange} />)
    expect(el).toHaveAttribute("aria-checked", "true")
  })

  it("is inert when disabled", async () => {
    const onCheckedChange = vi.fn()
    render(<Component aria-label="x" disabled onCheckedChange={onCheckedChange} />)
    await userEvent.click(screen.getByRole("switch"))
    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it("is inert and aria-busy while loading, with a spinner", async () => {
    const onCheckedChange = vi.fn()
    render(<Component aria-label="x" loading onCheckedChange={onCheckedChange} />)
    const el = screen.getByRole("switch")
    await userEvent.click(el)
    expect(onCheckedChange).not.toHaveBeenCalled()
    expect(el).toHaveAttribute("aria-busy", "true")
    expect(el).toBeDisabled()
    expect(el.querySelector('[role="status"]')).not.toBeNull()
  })

  it("submits its value through a native form", () => {
    render(
      <form data-testid="f">
        <Component aria-label="x" name="notify" value="yes" defaultChecked />
      </form>
    )
    const data = new FormData(screen.getByTestId("f") as HTMLFormElement)
    expect(data.get("notify")).toBe("yes")
  })

  it("omits the field when off and supports the form attribute", () => {
    render(
      <>
        <form id="outside" data-testid="f" />
        <Component aria-label="x" name="n" form="outside" />
        <Component aria-label="y" name="m" form="outside" defaultChecked />
      </>
    )
    const data = new FormData(screen.getByTestId("f") as HTMLFormElement)
    expect(data.get("n")).toBeNull()
    expect(data.get("m")).toBe("on")
  })

  it("forwards refs", () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Component ref={ref} aria-label="x" />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("renders a clickable label and linked description", async () => {
    render(<Component label="Airplane mode" description="Disables radios" />)
    const el = screen.getByRole("switch", { name: "Airplane mode" })
    expect(el).toHaveAccessibleDescription("Disables radios")
    await userEvent.click(screen.getByText("Airplane mode"))
    expect(el).toHaveAttribute("aria-checked", "true")
  })

  it("shows on/off icons following state", async () => {
    render(<Component aria-label="x" onIcon={<i data-testid="on" />} offIcon={<i data-testid="off" />} />)
    expect(screen.getByTestId("off")).toBeInTheDocument()
    expect(screen.queryByTestId("on")).toBeNull()
    await userEvent.click(screen.getByRole("switch"))
    expect(screen.getByTestId("on")).toBeInTheDocument()
  })

  it("renders track labels on lg only", () => {
    const { container, rerender } = render(<Component aria-label="x" size="lg" showLabels />)
    expect(container.querySelector('[data-slot="switch-label-on"]')).not.toBeNull()
    rerender(<Component aria-label="x" size="md" showLabels />)
    expect(container.querySelector('[data-slot="switch-label-on"]')).toBeNull()
  })

  it.each(sizes)("size %s uses only valid size classes and a non-zero thumb", (size) => {
    render(<Component aria-label="x" size={size} />)
    const el = screen.getByRole("switch")
    const thumb = el.querySelector('[data-slot="switch-thumb"]') as HTMLElement
    const all = `${el.className} ${thumb.className}`
    expect(all).not.toMatch(/size-4\.5|size-5\.5/)
    expect(findInvalidSizeClasses(all)).toEqual([])
    expect(thumb.className).toMatch(/size-\[\d/)
  })

  it("applies logical (RTL aware) translate and origin classes and motion guards", () => {
    render(<Component aria-label="x" />)
    const el = screen.getByRole("switch")
    const thumb = el.querySelector('[data-slot="switch-thumb"]') as HTMLElement
    expect(thumb.className).toContain("rtl:data-[state=checked]:-translate-x-[var(--sw-travel)]")
    expect(thumb.className).toContain("start-0.5")
    expect(thumb.className).toContain("motion-reduce:transition-none")
    expect(thumb.className).toContain("[[data-glin-motion=none]_&]:transition-none")
    expect(thumb.className).toContain("[[data-glin-motion=subtle]_&]:transition-none")
  })

  it("provides a 44px hit area through a pseudo element", () => {
    render(<Component aria-label="x" size="sm" />)
    expect(screen.getByRole("switch").className).toContain("after:-inset-y-3")
  })

  it("has no static inline style and no invalid var opacity classes", () => {
    const { container } = render(<Component aria-label="x" defaultChecked />)
    const styled = Array.from(container.querySelectorAll("[style]"))
    expect(styled).toEqual([])
    expect(container.innerHTML).not.toMatch(/\]\/\d/)
  })

  it("sets activeColor as a custom property only", () => {
    render(<Component aria-label="x" activeColor="rgb(255, 0, 0)" defaultChecked />)
    const el = screen.getByRole("switch")
    expect(el.style.getPropertyValue("--sw-active")).toBe("rgb(255, 0, 0)")
    expect(el.style.backgroundColor).toBe("")
  })

  it("works in a controlled parent with a state readout", async () => {
    function Demo() {
      const [on, setOn] = useState(false)
      return (
        <>
          <Component aria-label="x" checked={on} onCheckedChange={setOn} />
          <output>{on ? "on" : "off"}</output>
        </>
      )
    }
    render(<Demo />)
    fireEvent.click(screen.getByRole("switch"))
    expect(screen.getByRole("status")).toHaveTextContent("on")
  })
})

describe("Switch variants", () => {
  it("renders a liquid fill for glass variants but not default", () => {
    const { container, rerender } = render(<Switch aria-label="x" variant="glass" />)
    expect(container.querySelector('[data-slot="switch-fill"]')?.className).toContain("origin-left")
    expect(container.querySelector('[data-slot="switch-fill"]')?.className).toContain("rtl:origin-right")
    rerender(<Switch aria-label="x" />)
    expect(container.querySelector('[data-slot="switch-fill"]')).toBeNull()
  })

  it("RTL: dir=rtl ancestor keeps the toggle working", async () => {
    render(
      <div dir="rtl">
        <Switch aria-label="x" />
      </div>
    )
    await userEvent.click(screen.getByRole("switch"))
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true")
  })
})
