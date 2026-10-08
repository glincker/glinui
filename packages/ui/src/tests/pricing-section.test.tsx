import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { PricingSection, type PricingTier } from "../components/pricing-section"

const tiers: PricingTier[] = [
  { id: "a", name: "Starter", price: { monthly: 12, yearly: 10 }, features: ["One seat"], cta: { label: "Start", href: "/s" } },
  { id: "b", name: "Pro", price: { monthly: 30, yearly: 24 }, features: ["Ten seats", "Support"], cta: { label: "Go" }, highlighted: true, badge: "Popular" },
  { id: "c", name: "Team", price: "Custom", features: ["Everything"], cta: { label: "Talk" } }
]

describe("PricingSection", () => {
  it("renders tiers, features, highlight and a polite price", () => {
    render(<PricingSection tiers={tiers} title="Pricing" />)
    expect(screen.getByRole("region", { name: "Pricing" })).toBeInTheDocument()
    expect(screen.getByText("$12")).toBeInTheDocument()
    expect(screen.getByText("Custom")).toBeInTheDocument()
    expect(screen.getByRole("list", { name: "Pro features" }).querySelectorAll("li")).toHaveLength(2)
    expect(screen.getByText("Popular")).toBeInTheDocument()
    expect(document.querySelector("[data-highlighted=true] [data-slot=shine-border]")).not.toBeNull()
    expect(document.querySelector("[aria-live=polite]")).not.toBeNull()
  })

  it("toggles uncontrolled and reports changes", () => {
    const onBillingChange = vi.fn()
    render(<PricingSection tiers={tiers} onBillingChange={onBillingChange} />)
    fireEvent.click(screen.getByRole("switch", { name: "Bill yearly" }))
    expect(screen.getByText("$10")).toBeInTheDocument()
    expect(onBillingChange).toHaveBeenCalledWith("yearly")
  })

  it("stays controlled and formats currency and locale", () => {
    const { rerender } = render(<PricingSection tiers={tiers} billing="monthly" currency="EUR" locale="de-DE" />)
    expect(screen.getByText(/12\s*€/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole("switch"))
    expect(screen.getByText(/12\s*€/)).toBeInTheDocument()
    rerender(<PricingSection tiers={tiers} billing="yearly" currency="EUR" locale="de-DE" />)
    expect(screen.getByText(/10\s*€/)).toBeInTheDocument()
  })

  it("renders a comparison table layout and can hide the toggle and effect", () => {
    render(
      <PricingSection
        tiers={tiers}
        layout="table"
        hideToggle
        highlightEffect="none"
        comparison={[{ label: "Seats", values: ["1", "10", "Unlimited"] }, { label: "SSO", values: [false, false, true] }]}
      />
    )
    expect(screen.getByRole("table")).toBeInTheDocument()
    expect(screen.getByRole("rowheader", { name: "SSO" })).toBeInTheDocument()
    expect(screen.getAllByText("Included").length).toBe(1)
    expect(screen.queryByRole("switch")).toBeNull()
    expect(document.querySelector("[data-slot=shine-border]")).toBeNull()
  })
})
