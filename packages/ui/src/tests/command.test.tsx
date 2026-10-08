import { render, screen } from "@testing-library/react"

import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "../index"

describe("Command", () => {
  it("renders command palette with input and items", () => {
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem>Copy</CommandItem>
            <CommandItem>Paste</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    )
    expect(screen.getByPlaceholderText("Search...")).toBeVisible()
    expect(screen.getByText("Copy")).toBeVisible()
    expect(screen.getByText("Paste")).toBeVisible()
  })

  it("forwards custom className", () => {
    render(
      <Command data-testid="cmd" className="max-w-md">
        <CommandList>
          <CommandItem>Test</CommandItem>
        </CommandList>
      </Command>
    )
    expect(screen.getByTestId("cmd")).toHaveClass("max-w-md")
  })

  it("supports glass variant and size", () => {
    render(
      <Command data-testid="cmd" variant="glass" size="lg">
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandItem>Action</CommandItem>
        </CommandList>
      </Command>
    )

    expect(screen.getByTestId("cmd").className).toContain("backdrop-blur-xl")
    expect(screen.getByPlaceholderText("Search...").className).toContain("text-base")
    expect(screen.getByText("Action").className).toContain("text-base")
    expect(screen.getByText("Action").className).toContain("data-[selected=true]:[background:var(--panel-item-bg")
    expect(screen.getByTestId("cmd")).toHaveAttribute("data-variant", "glass")
  })

  it("supports liquid variant surface", () => {
    render(
      <Command data-testid="cmd" variant="liquid">
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandItem>Action</CommandItem>
        </CommandList>
      </Command>
    )

    expect(screen.getByTestId("cmd")).toHaveAttribute("data-variant", "glass")
    expect(screen.getByTestId("cmd").className).toContain("backdrop-blur-xl")
  })

  it("defaults to the glinr panel and never to glass", () => {
    render(
      <Command data-testid="cmd">
        <CommandList>
          <CommandItem>Action</CommandItem>
        </CommandList>
      </Command>
    )
    const cls = screen.getByTestId("cmd").className
    expect(screen.getByTestId("cmd")).toHaveAttribute("data-variant", "glinr")
    expect(cls).toContain("var(--ring-img)")
    expect(cls).not.toContain("backdrop-blur")
  })

  it("renders plain as a flat bordered panel", () => {
    render(
      <Command data-testid="cmd" variant="plain">
        <CommandList>
          <CommandItem>Action</CommandItem>
        </CommandList>
      </Command>
    )
    expect(screen.getByTestId("cmd").className).toContain("shadow-md")
    expect(screen.getByTestId("cmd").className).not.toContain("var(--sheen)")
  })
})
