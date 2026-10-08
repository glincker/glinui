import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { FeatureGrid, type FeatureItem } from "../components/feature-grid"

const features: FeatureItem[] = [
  { icon: <svg data-testid="i1" />, title: "Fast", description: "Quick", href: "/fast" },
  { icon: <svg />, title: "Safe", description: "Sturdy" },
  { title: "Open", description: "Free", span: 2 },
  { icon: <svg />, title: "Small", description: "Tiny" }
]

describe("FeatureGrid", () => {
  it("renders a labelled section, heading order and cards", () => {
    render(<FeatureGrid features={features} title="Why us" eyebrow="Features" description="Because" />)
    expect(screen.getByRole("region", { name: "Why us" })).toHaveAttribute("data-layout", "three-up")
    expect(screen.getByRole("heading", { level: 2, name: "Why us" })).toBeInTheDocument()
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(4)
    expect(screen.getByRole("link", { name: /Learn more/ })).toHaveAttribute("href", "/fast")
    expect(screen.getByTestId("i1").closest("[aria-hidden=true]")).not.toBeNull()
  })

  it("supports icon-list, alternating-rows and bento layouts", () => {
    const { rerender, container } = render(<FeatureGrid features={features} layout="icon-list" />)
    expect(container.querySelectorAll("li[data-slot=feature]")).toHaveLength(4)
    rerender(<FeatureGrid features={features} layout="alternating-rows" />)
    expect(container.querySelectorAll("li[data-slot=feature]")).toHaveLength(4)
    expect(container.querySelector("li.lg\\:flex-row-reverse")).not.toBeNull()
    rerender(<FeatureGrid features={features} layout="bento" />)
    expect(container.querySelectorAll("[data-slot=feature]")).toHaveLength(4)
    expect(container.querySelector(".lg\\:col-span-2")).not.toBeNull()
  })

  it("applies the block look", () => {
    render(<FeatureGrid features={features} variant="glass" />)
    expect(document.querySelector("[data-look=glass]")).not.toBeNull()
  })
})
