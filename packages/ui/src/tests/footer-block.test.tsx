import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { FooterBlock, type FooterLinkGroup } from "../components/footer-block"

const groups: FooterLinkGroup[] = [
  { title: "Product", links: [{ label: "Features", href: "/features" }, { label: "Blog", href: "https://x.test", target: "_blank" }] },
  { title: "Company", links: [{ label: "About", href: "/about" }] }
]

describe("FooterBlock", () => {
  it("renders a contentinfo landmark with one labelled nav per group", () => {
    render(<FooterBlock groups={groups} brand={<span>Brand</span>} />)
    expect(screen.getByRole("contentinfo")).toBeInTheDocument()
    expect(screen.getByRole("navigation", { name: "Product" })).toBeInTheDocument()
    expect(screen.getByRole("navigation", { name: "Company" })).toBeInTheDocument()
    expect(screen.getByText("Brand")).toBeInTheDocument()
  })

  it("adds a safe rel to target blank links and keeps explicit attributes", () => {
    render(<FooterBlock groups={groups} />)
    const link = screen.getByRole("link", { name: "Blog" })
    expect(link).toHaveAttribute("target", "_blank")
    expect(link.getAttribute("rel")).toContain("noopener")
    expect(screen.getByRole("link", { name: "Features" })).not.toHaveAttribute("rel")
  })

  it("renders social icon links with accessible names, legal row and theme slot", () => {
    render(
      <FooterBlock
        groups={groups}
        social={[{ label: "Source code", href: "https://g.test", icon: <svg /> }]}
        legal={[{ label: "Privacy", href: "/privacy" }]}
        copyright="Copyright 2026 Acme"
        themeToggle={<button type="button">Theme</button>}
      />
    )
    expect(screen.getByRole("link", { name: "Source code" })).toBeInTheDocument()
    const legal = screen.getByRole("navigation", { name: "Legal" })
    expect(within(legal).getByRole("link", { name: "Privacy" })).toBeInTheDocument()
    expect(screen.getByText("Copyright 2026 Acme")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Theme" })).toBeInTheDocument()
  })

  it("newsletter submits the email", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<FooterBlock groups={groups} newsletter={{ title: "Stay in touch", onSubmit }} />)
    await user.type(screen.getByLabelText("Email address"), "a@b.co")
    await user.click(screen.getByRole("button", { name: "Subscribe" }))
    expect(onSubmit).toHaveBeenCalledWith("a@b.co")
  })

  it("defaults to columns and glinr, supports minimal and big-wordmark", () => {
    const { container, rerender } = render(<FooterBlock groups={groups} />)
    const footer = container.querySelector("footer")!
    expect(footer).toHaveAttribute("data-layout", "columns")
    expect(footer).toHaveAttribute("data-variant", "glinr")
    rerender(<FooterBlock groups={groups} layout="minimal" variant="plain" />)
    expect(container.querySelector("footer")).toHaveAttribute("data-layout", "minimal")
    expect(container.querySelector("footer")).toHaveAttribute("data-variant", "plain")
    rerender(<FooterBlock groups={groups} layout="big-wordmark" wordmark="Acme" />)
    expect(container.querySelector('[data-slot="wordmark"]')).toHaveAttribute("aria-hidden", "true")
  })
})
