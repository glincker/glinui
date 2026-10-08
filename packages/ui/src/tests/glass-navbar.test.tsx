import { act, render, screen, waitFor } from "@testing-library/react"

import { GlassNavbar } from "../index"

describe("GlassNavbar", () => {
  it("renders navbar content", () => {
    render(<GlassNavbar>Navigation</GlassNavbar>)
    expect(screen.getByText("Navigation")).toBeVisible()
  })

  it("accepts the crisp variants without any blur", () => {
    render(
      <GlassNavbar data-testid="navbar" variant="glinr">
        Navigation
      </GlassNavbar>
    )
    expect(screen.getByTestId("navbar")).toHaveAttribute("data-variant", "glinr")
    expect(screen.getByTestId("navbar").className).not.toContain("backdrop-blur")
  })

  it("elevates on scroll", async () => {
    render(
      <GlassNavbar data-testid="navbar" scrollThreshold={20}>
        Navigation
      </GlassNavbar>
    )

    const navbar = screen.getByTestId("navbar")
    expect(navbar.className).toContain("var(--surface-1)_84%")
    expect(navbar).toHaveAttribute("data-variant", "glass")

    Object.defineProperty(window, "scrollY", {
      value: 64,
      writable: true,
      configurable: true
    })

    await act(async () => {
      window.dispatchEvent(new Event("scroll"))
    })

    await waitFor(() => {
      expect(navbar.className).toContain("var(--surface-1)_92%")
    })
  })
})
