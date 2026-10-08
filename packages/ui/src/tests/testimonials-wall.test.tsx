import { render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { MotionEngineProvider } from "../components/motion-engine"
import { TestimonialsWall, testimonialInitials, type TestimonialItem } from "../components/testimonials-wall"
import { installWebAnimations } from "./motion-test-utils"

let restore: (() => void) | undefined
afterEach(() => restore?.())

const items: TestimonialItem[] = [
  { quote: "Placeholder quote one.", name: "Ada Example", role: "Role A", rating: 4 },
  { quote: "Placeholder quote two.", name: "Bo Sample" },
  { quote: "Placeholder quote three.", name: "Cy" }
]

describe("TestimonialsWall", () => {
  it("renders a labelled section with blockquote and cite", () => {
    render(<TestimonialsWall items={items} title="Loved" />)
    expect(screen.getByRole("region", { name: "Loved" })).toBeInTheDocument()
    expect(document.querySelectorAll("blockquote")).toHaveLength(3)
    expect(document.querySelectorAll("cite")).toHaveLength(3)
  })

  it("uses initials, never images, and labels the rating", () => {
    render(<TestimonialsWall items={items} />)
    expect(screen.getByText("AE")).toBeInTheDocument()
    expect(screen.getByText("C")).toBeInTheDocument()
    expect(document.querySelector("img")).toBeNull()
    expect(screen.getByRole("img", { name: "Rated 4 out of 5" })).toBeInTheDocument()
    expect(testimonialInitials("  ")).toBe("?")
  })

  it("defaults to masonry columns and follows variant", () => {
    const { container } = render(<TestimonialsWall items={items} />)
    const section = container.querySelector("section")!
    expect(section).toHaveAttribute("data-layout", "masonry-columns")
    expect(section).toHaveAttribute("data-variant", "glinr")
  })

  it("accepts plain and glass variants", () => {
    const { container, rerender } = render(<TestimonialsWall items={items} variant="plain" />)
    expect(container.querySelector("section")).toHaveAttribute("data-variant", "plain")
    rerender(<TestimonialsWall items={items} variant="glass" />)
    expect(container.querySelector("section")).toHaveAttribute("data-variant", "glass")
  })

  it("single-quote shows only the first item", () => {
    render(<TestimonialsWall items={items} layout="single-quote" />)
    expect(document.querySelectorAll("blockquote")).toHaveLength(1)
  })

  it("marquee animates two columns at full, duplicates are aria-hidden, and cancels on unmount", () => {
    const api = installWebAnimations()
    restore = api.restore
    const { container, unmount } = render(
      <MotionEngineProvider motion="full">
        <TestimonialsWall items={items} layout="marquee-columns" />
      </MotionEngineProvider>
    )
    expect(api.calls).toHaveLength(2)
    expect(container.querySelectorAll('[aria-hidden="true"][inert]').length).toBeGreaterThan(0)
    unmount()
  })

  it("marquee is static with motion none", () => {
    const api = installWebAnimations()
    restore = api.restore
    const { container } = render(
      <MotionEngineProvider motion="none">
        <TestimonialsWall items={items} layout="marquee-columns" />
      </MotionEngineProvider>
    )
    expect(api.calls).toHaveLength(0)
    expect(container.querySelector("section")).toHaveAttribute("data-animated", "false")
    expect(document.querySelectorAll("blockquote")).toHaveLength(3)
  })
})
