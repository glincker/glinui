import { render, screen } from "@testing-library/react"

import { Bubble } from "../components/bubble"

describe("Bubble", () => {
  it("renders children with the default token surface", () => {
    render(<Bubble>Hello</Bubble>)
    const el = screen.getByText("Hello")
    expect(el.className).toContain("var(--face-1,var(--surface-1))")
    expect(el).toHaveAttribute("data-variant", "glinr")
  })

  it("applies accent, muted and glass variants", () => {
    render(
      <div>
        <Bubble variant="accent">a</Bubble>
        <Bubble variant="muted">m</Bubble>
        <Bubble variant="glass">g</Bubble>
      </div>
    )
    expect(screen.getByText("a").className).toContain("[--t-bg:var(--tone-accent)]")
    expect(screen.getByText("m").className).toContain("[--face:var(--t-soft)]")
    expect(screen.getByText("g").className).toContain("backdrop-blur")
  })

  it("squares the tail corner using logical properties", () => {
    render(
      <div>
        <Bubble tail align="start">s</Bubble>
        <Bubble tail align="end">e</Bubble>
      </div>
    )
    expect(screen.getByText("s").className).toContain("rounded-es-sm")
    expect(screen.getByText("e").className).toContain("rounded-ee-sm")
  })

  it("tightens corners when grouped and forwards refs", () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<Bubble ref={ref} grouped align="end">x</Bubble>)
    expect(ref.current?.className).toContain("rounded-e-md")
  })
})
