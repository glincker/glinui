import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderToString } from "react-dom/server"
import { ArrowRight, Plus } from "@phosphor-icons/react/dist/ssr"

import { Button, ButtonGroup, GlinProvider, SURFACE_TONES, SURFACE_VARIANTS } from "../index"

describe("Button", () => {
  it("renders the button text", () => {
    render(<Button>Launch</Button>)
    expect(screen.getByRole("button", { name: "Launch" })).toBeVisible()
  })

  it("defaults to the glinr look with no provider", () => {
    render(<Button data-testid="b">Primary</Button>)
    const b = screen.getByTestId("b")
    expect(b).toHaveAttribute("data-variant", "glinr")
    expect(b.className).toContain("var(--ring)")
    expect(b.className).not.toContain("backdrop-blur")
  })

  it("resolves the default through the ambient style, explicit variant wins", () => {
    const cases: Array<[string, "minimal" | "glass", string | undefined]> = [
      ["plain", "minimal", undefined],
      ["glass", "glass", undefined],
      ["solid", "glass", "solid"]
    ]
    for (const [expected, style, variant] of cases) {
      const { unmount } = render(
        <GlinProvider defaults={{ style }}>
          <Button data-testid="b" variant={variant as "solid" | undefined}>x</Button>
        </GlinProvider>
      )
      expect(screen.getByTestId("b")).toHaveAttribute("data-variant", expected)
      unmount()
    }
  })

  it("treats the legacy default as the ambient default", () => {
    render(<Button variant="default" data-testid="b">x</Button>)
    expect(screen.getByTestId("b")).toHaveAttribute("data-variant", "glinr")
  })

  it("renders every vocabulary variant and tone", () => {
    for (const variant of SURFACE_VARIANTS) {
      for (const tone of SURFACE_TONES) {
        const { unmount } = render(<Button variant={variant} tone={tone} data-testid="b">x</Button>)
        expect(screen.getByTestId("b")).toHaveAttribute("data-variant", variant)
        expect(screen.getByTestId("b").className).not.toMatch(/\]\/\d/)
        unmount()
      }
    }
  })

  it("maps legacy aliases", () => {
    render(
      <div>
        <Button variant="primary" data-testid="primary">p</Button>
        <Button variant="secondary" data-testid="secondary">s</Button>
        <Button variant="destructive" data-testid="destructive">d</Button>
        <Button variant="frosted" data-testid="frosted">f</Button>
      </div>
    )
    expect(screen.getByTestId("primary")).toHaveAttribute("data-variant", "solid")
    expect(screen.getByTestId("primary").className).toContain("--tone-accent")
    expect(screen.getByTestId("secondary")).toHaveAttribute("data-variant", "soft")
    expect(screen.getByTestId("destructive").className).toContain("--tone-danger")
    expect(screen.getByTestId("frosted")).toHaveAttribute("data-variant", "glass")
  })

  it("applies glass classes only when asked", () => {
    render(<Button variant="glass" data-testid="b">Glass</Button>)
    expect(screen.getByTestId("b").className).toContain("backdrop-blur-xl")
  })

  it("keeps the liquid, matte, glow, key and key-white looks", () => {
    render(
      <div>
        <Button variant="liquid" data-testid="liquid">L</Button>
        <Button variant="matte" data-testid="matte">M</Button>
        <Button variant="glow" data-testid="glow">G</Button>
        <Button variant="key" data-testid="key">K</Button>
        <Button variant="key-white" data-testid="kw">W</Button>
      </div>
    )
    expect(screen.getByTestId("liquid").className).toContain("backdrop-blur-xl")
    expect(screen.getByTestId("matte").className).toContain("var(--surface-2)")
    expect(screen.getByTestId("glow").className).toContain("color-mix(in_oklab,var(--color-accent)_45%")
    expect(screen.getByTestId("key").className).toContain("--k-top")
    expect(screen.getByTestId("kw").className).toContain("--key-white-top")
    expect(screen.getByTestId("liquid").className).toContain("focus-visible:ring-2")
  })

  it("plain is flat and keeps size text over its own text size", () => {
    render(<Button variant="plain" size="xs" data-testid="b">x</Button>)
    const cls = screen.getByTestId("b").className
    expect(cls).toContain("rounded-md")
    expect(cls).not.toContain("--ring-solid")
    expect(cls).toContain("text-xs")
    expect(cls).not.toContain("text-sm")
  })

  it("applies size classes", () => {
    render(
      <div>
        <Button size="xs" data-testid="xs">X</Button>
        <Button size="sm" data-testid="sm">S</Button>
        <Button size="lg" data-testid="lg">L</Button>
        <Button size="icon" aria-label="Add" data-testid="icon"><Plus /></Button>
      </div>
    )
    expect(screen.getByTestId("xs").className).toContain("h-7")
    expect(screen.getByTestId("sm").className).toContain("h-8")
    expect(screen.getByTestId("lg").className).toContain("h-10")
    expect(screen.getByTestId("icon").className).toContain("size-9")
  })

  it("has the accent focus ring and disabled styling on every surface variant", () => {
    render(<Button variant="solid" data-testid="b">x</Button>)
    const cls = screen.getByTestId("b").className
    expect(cls).toContain("focus-visible:ring-2")
    expect(cls).toContain("focus-visible:ring-[color:var(--color-accent)]")
    expect(cls).toContain("disabled:opacity-50")
  })

  it("renders decorative icons and keeps one accessible name", () => {
    render(
      <Button leadingIcon={<Plus data-testid="lead" />} trailingIcon={<ArrowRight />}>
        Add item
      </Button>
    )
    expect(screen.getByRole("button", { name: "Add item" })).toBeVisible()
    expect(screen.getByTestId("lead").closest("[aria-hidden='true']")).not.toBeNull()
  })

  it("shows a spinner, sets aria-busy and blocks clicks while loading", async () => {
    const onClick = vi.fn()
    render(<Button loading onClick={onClick}>Save</Button>)
    const b = screen.getByRole("button")
    expect(b).toHaveAttribute("aria-busy", "true")
    expect(b).toBeDisabled()
    expect(b).toHaveAttribute("data-loading", "true")
    await userEvent.setup().click(b)
    expect(onClick).not.toHaveBeenCalled()
  })

  it("supports asChild for link rendering, with icons and loading", () => {
    render(
      <Button asChild trailingIcon={<ArrowRight data-testid="arrow" />}>
        <a href="/docs/getting-started">Read docs</a>
      </Button>
    )
    const link = screen.getByRole("link", { name: "Read docs" })
    expect(link).toBeVisible()
    expect(link.className).toContain("inline-flex")
    expect(link).toContainElement(screen.getByTestId("arrow"))
  })

  it("inherits variant, tone and size from a ButtonGroup, and own props win", () => {
    render(
      <ButtonGroup variant="outline" tone="danger" size="sm" aria-label="g">
        <Button data-testid="a">A</Button>
        <Button variant="solid" data-testid="b">B</Button>
      </ButtonGroup>
    )
    expect(screen.getByTestId("a")).toHaveAttribute("data-variant", "outline")
    expect(screen.getByTestId("a").className).toContain("--tone-danger")
    expect(screen.getByTestId("a").className).toContain("h-8")
    expect(screen.getByTestId("b")).toHaveAttribute("data-variant", "solid")
  })

  it("renders on the server without throwing", () => {
    expect(() => renderToString(<Button leadingIcon={<Plus />}>Go</Button>)).not.toThrow()
  })

  it("has no em or en dashes in class output", () => {
    render(<Button variant="key" data-testid="b">x</Button>)
    expect(screen.getByTestId("b").className).not.toMatch(/[–—]/)
  })
})
