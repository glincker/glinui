import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { LogoCloud, LogoWordmark } from "../components/logo-cloud"
import { MotionEngineProvider } from "../components/motion-engine"

const items = [
  { name: "Acme", logo: <LogoWordmark>Acme</LogoWordmark>, href: "/acme" },
  { name: "Nimbus", logo: <LogoWordmark>Nimbus</LogoWordmark> },
  <LogoWordmark key="r">Raw</LogoWordmark>
]

describe("LogoCloud", () => {
  it("renders a labelled list with ReactNode and object items", () => {
    render(<LogoCloud items={items} listLabel="Customers" />)
    const list = screen.getByRole("list", { name: "Customers" })
    expect(list.querySelectorAll("li")).toHaveLength(3)
    expect(screen.getByRole("link", { name: "Acme" })).toHaveAttribute("href", "/acme")
    expect(screen.getByRole("img", { name: "Nimbus" })).toBeInTheDocument()
    expect(screen.getByText("Raw")).toBeInTheDocument()
  })

  it("is grayscale by default and can opt out", () => {
    const { rerender } = render(<LogoCloud items={items} />)
    expect(screen.getByRole("img", { name: "Nimbus" }).className).toContain("grayscale(1)")
    rerender(<LogoCloud items={items} grayscale={false} />)
    expect(screen.getByRole("img", { name: "Nimbus" }).className).not.toContain("grayscale(1)")
  })

  it("scrolls as a marquee at full motion with an aria-hidden copy and no links", () => {
    render(
      <MotionEngineProvider motion="full">
        <LogoCloud layout="marquee" items={items} title="Trusted" />
      </MotionEngineProvider>
    )
    const group = screen.getByRole("group", { name: "Trusted by" })
    expect(group.className).toContain("mask-image")
    expect(group.querySelectorAll("[aria-hidden=true]").length).toBeGreaterThan(0)
    expect(screen.queryByRole("link")).toBeNull()
    expect(group.querySelector(".group-hover\\:\\[animation-play-state\\:paused\\]")).not.toBeNull()
  })

  it("falls back to the static grid at motion none", () => {
    render(
      <MotionEngineProvider motion="none">
        <LogoCloud layout="marquee" items={items} />
      </MotionEngineProvider>
    )
    expect(screen.getByRole("list")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Acme" })).toBeInTheDocument()
  })
})
