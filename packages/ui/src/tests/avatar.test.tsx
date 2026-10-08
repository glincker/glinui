import { fireEvent, render, screen } from "@testing-library/react"

import { Avatar } from "../index"

describe("Avatar", () => {
  it("renders fallback text", () => {
    render(<Avatar fallback="GU" />)
    expect(screen.getByText("GU")).toBeVisible()
  })

  it("renders image when src is provided", () => {
    render(<Avatar src="/avatar.png" alt="Glin User" />)
    expect(screen.getByRole("img", { name: "Glin User" })).toHaveAttribute("src", "/avatar.png")
  })

  it("falls back after image load error", () => {
    render(<Avatar src="/broken.png" alt="Glin User" fallback="GU" />)
    const image = screen.getByRole("img", { name: "Glin User" })
    fireEvent.error(image)
    expect(screen.getByText("GU")).toBeVisible()
  })

  it("supports variants, sizes, and className forwarding", () => {
    const { rerender } = render(
      <Avatar data-testid="avatar" variant="glass" size="xs" radius="md" className="ring-1" />
    )
    expect(screen.getByTestId("avatar").className).toContain("backdrop-blur-xl")
    expect(screen.getByTestId("avatar").className).toContain("h-6")
    expect(screen.getByTestId("avatar").className).toContain("rounded-md")
    expect(screen.getByTestId("avatar")).toHaveClass("ring-1")

    rerender(<Avatar data-testid="avatar" variant="outline" size="xl" radius="square" />)
    expect(screen.getByTestId("avatar").className).toContain("bg-transparent")
    expect(screen.getByTestId("avatar").className).toContain("h-14")
    expect(screen.getByTestId("avatar").className).toContain("rounded-none")
  })

  it("supports liquid and ghost variants", () => {
    const { rerender } = render(<Avatar data-testid="avatar" variant="liquid" fallback="LQ" />)
    expect(screen.getByTestId("avatar").className).toContain("backdrop-blur-xl")

    rerender(<Avatar data-testid="avatar" variant="ghost" fallback="GH" />)
    expect(screen.getByTestId("avatar").className).toContain("border-transparent")
  })

  it("resets image error state when src changes", () => {
    const { rerender } = render(<Avatar src="/broken.png" alt="Broken user" fallback="BU" />)
    const brokenImage = screen.getByRole("img", { name: "Broken user" })
    fireEvent.error(brokenImage)
    expect(screen.getByText("BU")).toBeVisible()

    rerender(<Avatar src="/fresh.png" alt="Fresh user" fallback="FU" />)
    expect(screen.getByRole("img", { name: "Fresh user" })).toHaveAttribute("src", "/fresh.png")
  })
})
