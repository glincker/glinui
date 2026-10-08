import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { GlinProvider } from "../components/glin-provider"
import { HeroSection } from "../components/hero-section"
import { MotionEngineProvider } from "../components/motion-engine"

const base = { title: "Ship faster", description: "Lede copy", primaryAction: { label: "Start", href: "/start" } }

describe("HeroSection", () => {
  it("renders a labelled section with an h1 and actions", () => {
    render(<HeroSection {...base} secondaryAction={{ label: "Docs" }} />)
    const region = screen.getByRole("region", { name: "Ship faster" })
    expect(region).toHaveAttribute("data-layout", "centered")
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Ship faster")
    expect(screen.getByRole("link", { name: "Start" })).toHaveAttribute("href", "/start")
    expect(screen.getByRole("button", { name: "Docs" })).toBeInTheDocument()
  })

  it("renders announcement, media and logos slots in split layout", () => {
    render(
      <HeroSection {...base} layout="split" announcement="New release" announcementHref="/new" media={<div data-testid="m" />} logos={<div data-testid="l" />} />
    )
    expect(screen.getByRole("link", { name: /New release/ })).toHaveAttribute("href", "/new")
    expect(screen.getByTestId("m").closest("[data-slot=hero-media]")).not.toBeNull()
    expect(screen.getByTestId("l")).toBeInTheDocument()
    expect(document.querySelector("[data-layout=split]")).not.toBeNull()
  })

  it("hides the background from assistive tech", () => {
    render(<HeroSection {...base} background={<i data-testid="bg" />} />)
    expect(screen.getByTestId("bg").closest("[aria-hidden=true]")).not.toBeNull()
  })

  it("resolves the look from the ambient style and the variant prop", () => {
    const { rerender } = render(<HeroSection {...base} />)
    expect(document.querySelector("[data-look=glinr]")).not.toBeNull()
    rerender(<HeroSection {...base} variant="glass" />)
    expect(document.querySelector("[data-look=glass]")?.className).toContain("backdrop-blur")
    rerender(
      <GlinProvider defaults={{ style: "minimal" }}>
        <HeroSection {...base} />
      </GlinProvider>
    )
    expect(document.querySelector("[data-look=plain]")).not.toBeNull()
  })

  it("renders static copy at motion none and with entrance off", () => {
    render(
      <MotionEngineProvider motion="none">
        <HeroSection {...base} />
      </MotionEngineProvider>
    )
    expect(screen.getByText("Ship faster")).toBeVisible()
    const { unmount } = render(<HeroSection {...base} entrance={false} />)
    expect(() => unmount()).not.toThrow()
  })
})
