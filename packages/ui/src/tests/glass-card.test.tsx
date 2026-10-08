import { render, screen } from "@testing-library/react"

import { GlassCard, GlassCardContent, GlassCardFooter, GlassCardHeader } from "../index"

describe("GlassCard", () => {
  it("renders composable sections", () => {
    render(
      <GlassCard>
        <GlassCardHeader>Header</GlassCardHeader>
        <GlassCardContent>Content</GlassCardContent>
        <GlassCardFooter>Footer</GlassCardFooter>
      </GlassCard>
    )

    expect(screen.getByText("Header")).toBeVisible()
    expect(screen.getByText("Content")).toBeVisible()
    expect(screen.getByText("Footer")).toBeVisible()
  })

  it("keeps glass as its identity with a readable floor", () => {
    render(
      <GlassCard data-testid="glass-card">
        <GlassCardContent>Body</GlassCardContent>
      </GlassCard>
    )

    const card = screen.getByTestId("glass-card")
    expect(card.className).toContain("var(--glass-readable)")
    expect(card.className).toContain("backdrop-blur-xl")
    expect(card.className).toContain("[border-top-color:var(--glass-refraction-top)]")
  })

  it("accepts the other variants", () => {
    render(
      <GlassCard data-testid="glass-card" variant="glinr">
        <GlassCardContent>Body</GlassCardContent>
      </GlassCard>
    )
    const card = screen.getByTestId("glass-card")
    expect(card.className).not.toContain("backdrop-blur")
    expect(card.className).toContain("padding-box")
  })
})
