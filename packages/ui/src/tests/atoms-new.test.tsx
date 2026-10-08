import { render, screen } from "@testing-library/react"

import {
  Chip,
  Code,
  Counter,
  Heading,
  IconFrame,
  Kbd,
  Label,
  Link,
  StatusDot,
  Text
} from "../index"

describe("New atom primitives", () => {
  it("renders Label with glass variant", () => {
    render(<Label variant="glass">Email</Label>)
    const label = screen.getByText("Email")
    expect(label.tagName).toBe("LABEL")
    expect(label.className).toContain("bg-[var(--glass-readable)]")
  })

  it("renders Link with href and no underline", () => {
    render(
      <Link href="/docs" underline={false}>
        Docs
      </Link>
    )
    const link = screen.getByRole("link", { name: "Docs" })
    expect(link).toHaveAttribute("href", "/docs")
    expect(link.className).toContain("no-underline")
  })

  it("renders Code and Kbd semantics", () => {
    render(
      <div>
        <Code>pnpm dev</Code>
        <Kbd>cmd</Kbd>
      </div>
    )

    expect(screen.getByText("pnpm dev").tagName).toBe("CODE")
    expect(screen.getByText("cmd").tagName).toBe("KBD")
  })

  it("renders Text with muted variant", () => {
    render(<Text variant="muted">Secondary copy</Text>)
    const text = screen.getByText("Secondary copy")
    expect(text.tagName).toBe("P")
    expect(text.className).toContain("text-[var(--color-muted)]")
  })

  it("renders Heading with requested level", () => {
    render(
      <Heading level={3} size="sm">
        Section title
      </Heading>
    )

    expect(screen.getByRole("heading", { name: "Section title", level: 3 })).toBeVisible()
  })

  it("renders Chip tone class", () => {
    render(<Chip tone="success">Stable</Chip>)
    const chip = screen.getByText("Stable")
    expect(chip.className).toContain("--tone-success")
  })

  it("renders StatusDot with pulse class", () => {
    const { container } = render(
      <StatusDot status="info" pulse label="Deploying" />
    )

    expect(screen.getByText("Deploying")).toBeVisible()
    expect(container.querySelector(".motion-safe\\:animate-pulse")).toBeTruthy()
  })

  it("renders Counter with max overflow", () => {
    render(<Counter value={230} max={99} />)
    expect(screen.getByText("99+")).toBeVisible()
  })

  it("renders IconFrame and forwards className", () => {
    render(
      <IconFrame data-testid="icon-frame" size="lg" className="custom-frame">
        A
      </IconFrame>
    )

    const frame = screen.getByTestId("icon-frame")
    expect(frame).toHaveClass("custom-frame")
    expect(frame.className).toContain("h-11")
  })
})
