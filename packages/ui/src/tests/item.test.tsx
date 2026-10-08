import { render, screen } from "@testing-library/react"

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle
} from "../components/item"

describe("Item", () => {
  it("renders the full composition", () => {
    render(
      <ItemGroup data-testid="group">
        <Item data-testid="item">
          <ItemHeader>Header</ItemHeader>
          <ItemMedia variant="icon" data-testid="media">m</ItemMedia>
          <ItemContent>
            <ItemTitle>Title</ItemTitle>
            <ItemDescription>Desc</ItemDescription>
          </ItemContent>
          <ItemActions><button type="button">Go</button></ItemActions>
          <ItemFooter>Footer</ItemFooter>
        </Item>
        <ItemSeparator />
        <Item>Second</Item>
      </ItemGroup>
    )
    expect(screen.getByText("Title")).toHaveAttribute("data-slot", "item-title")
    expect(screen.getByText("Desc").tagName).toBe("P")
    expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument()
    expect(screen.getByRole("separator")).toBeInTheDocument()
    expect(screen.getByTestId("media")).toHaveAttribute("data-variant", "icon")
    expect(screen.getByText("Footer")).toBeInTheDocument()
  })

  it("supports variants, sizes and className merge", () => {
    const { rerender } = render(<Item data-testid="item" variant="glass" size="sm" className="w-64" />)
    const item = screen.getByTestId("item")
    expect(item.className).toContain("backdrop-blur-xl")
    expect(item.className).toContain("py-3")
    expect(item).toHaveClass("w-64")
    rerender(<Item data-testid="item" variant="muted" />)
    expect(screen.getByTestId("item").className).toContain("[--face:var(--t-soft)]")
    rerender(<Item data-testid="item" variant="default" />)
    expect(screen.getByTestId("item")).toHaveAttribute("data-variant", "glinr")
  })

  it("renders as a link with asChild and keeps a focus ring", () => {
    render(
      <Item asChild>
        <a href="/docs">Docs link</a>
      </Item>
    )
    const link = screen.getByRole("link", { name: "Docs link" })
    expect(link).toHaveAttribute("data-slot", "item")
    expect(link.className).toContain("focus-visible:ring-[var(--color-accent)]")
  })
})
