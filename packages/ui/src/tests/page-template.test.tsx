import { render, screen } from "@testing-library/react"

import { PageTemplate } from "../index"

describe("PageTemplate", () => {
  it("renders the title as the page h1 with description and content", () => {
    render(
      <PageTemplate title="Servers" description="Machines you manage">
        <p>Body</p>
      </PageTemplate>
    )
    expect(screen.getByRole("heading", { level: 1, name: "Servers" })).toBeInTheDocument()
    expect(screen.getByText("Machines you manage")).toBeInTheDocument()
    expect(screen.getByText("Body")).toBeInTheDocument()
  })

  it("renders the slots: breadcrumb, status, actions, tabs and banners", () => {
    render(
      <PageTemplate
        title="Servers"
        breadcrumb={<nav aria-label="Breadcrumb">Home</nav>}
        status={<span>Healthy</span>}
        actions={<button type="button">Add</button>}
        tabs={<div role="tablist" />}
        banners={<div role="status">Maintenance</div>}
        eyebrow="Infrastructure"
      />
    )
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument()
    expect(screen.getByText("Healthy")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument()
    expect(screen.getByRole("tablist")).toBeInTheDocument()
    expect(screen.getByRole("status")).toHaveTextContent("Maintenance")
    expect(screen.getByText("Infrastructure")).toBeInTheDocument()
  })

  it("prefers logo over icon and hides the decorative icon tile from assistive tech", () => {
    const { rerender, container } = render(<PageTemplate title="T" icon={<svg data-testid="icon" />} />)
    expect(container.querySelector("[data-slot=page-template-icon]")).toHaveAttribute("aria-hidden", "true")
    rerender(<PageTemplate title="T" icon={<svg data-testid="icon" />} logo={<span data-testid="logo" />} />)
    expect(screen.getByTestId("logo")).toBeInTheDocument()
    expect(screen.queryByTestId("icon")).toBeNull()
  })

  it("renders a help link with an accessible name and supports a custom link component", () => {
    const { rerender } = render(<PageTemplate title="T" helpHref="/docs/servers" />)
    expect(screen.getByRole("link", { name: "Help" })).toHaveAttribute("href", "/docs/servers")
    const Custom = ({ href, children, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a data-router="1" href={href} {...rest}>
        {children}
      </a>
    )
    rerender(<PageTemplate title="T" helpHref="/x" helpLabel="Aide" LinkComponent={Custom} />)
    expect(screen.getByRole("link", { name: "Aide" })).toHaveAttribute("data-router", "1")
  })

  it("omits the help link without helpHref and applies the width variant", () => {
    const { container } = render(<PageTemplate title="T" width="full" />)
    expect(screen.queryByRole("link")).toBeNull()
    expect(container.firstElementChild?.className).toContain("max-w-none")
  })
})
