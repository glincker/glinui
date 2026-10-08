import { act, fireEvent, render, screen } from "@testing-library/react"

import {
  CopyButton,
  GlinProvider,
  MotionEngineProvider,
  PulsatingButton,
  RippleButton,
  ShimmerButton
} from "../index"

describe("ShimmerButton", () => {
  it("defaults to a glinr surface with a sweep that follows the text colour", () => {
    const { container } = render(<ShimmerButton>Shine</ShimmerButton>)
    const button = screen.getByRole("button", { name: "Shine" })
    expect(button).toHaveAttribute("data-variant", "glinr")
    const sweep = container.querySelector('[data-slot="shimmer"]') as HTMLElement
    expect(sweep).toHaveAttribute("aria-hidden", "true")
    expect(sweep.className).toContain("currentColor_35%")
    expect(sweep.className).toContain("motion-reduce:hidden")
  })

  it("resolves the ambient style and lets an explicit variant win", () => {
    const { rerender } = render(
      <GlinProvider defaults={{ style: "minimal" }}>
        <ShimmerButton>S</ShimmerButton>
      </GlinProvider>
    )
    expect(screen.getByRole("button")).toHaveAttribute("data-variant", "plain")
    rerender(
      <GlinProvider defaults={{ style: "minimal" }}>
        <ShimmerButton variant="accent">S</ShimmerButton>
      </GlinProvider>
    )
    expect(screen.getByRole("button")).toHaveAttribute("data-variant", "solid")
  })

  it("uses a custom colour and duration through CSS variables", () => {
    const { container } = render(
      <ShimmerButton shimmerColor="red" shimmerDuration={3}>
        S
      </ShimmerButton>
    )
    const sweep = container.querySelector('[data-slot="shimmer"]') as HTMLElement
    expect(sweep.style.getPropertyValue("--shimmer-color")).toBe("red")
    expect(sweep.style.getPropertyValue("--shimmer-duration")).toBe("3s")
  })

  it("removes the sweep when motion is none", () => {
    const { container } = render(
      <MotionEngineProvider motion="none">
        <ShimmerButton>S</ShimmerButton>
      </MotionEngineProvider>
    )
    expect(container.querySelector('[data-slot="shimmer"]')).toBeNull()
  })
})

describe("PulsatingButton", () => {
  it("defaults to glinr with an accent pulse ring", () => {
    const { container } = render(<PulsatingButton>Pulse</PulsatingButton>)
    expect(screen.getByRole("button", { name: "Pulse" })).toHaveAttribute("data-variant", "glinr")
    const ring = container.querySelector('[data-slot="pulse"]') as HTMLElement
    expect(ring.className).toContain("var(--pulse-color,var(--color-accent))")
    expect(ring.className).toContain("motion-reduce:hidden")
  })

  it("removes the ring when motion is none and honours a custom colour", () => {
    const { container, rerender } = render(<PulsatingButton pulseColor="teal">P</PulsatingButton>)
    expect((container.querySelector('[data-slot="pulse"]') as HTMLElement).style.getPropertyValue("--pulse-color")).toBe("teal")
    rerender(
      <MotionEngineProvider motion="none">
        <PulsatingButton>P</PulsatingButton>
      </MotionEngineProvider>
    )
    expect(container.querySelector('[data-slot="pulse"]')).toBeNull()
  })
})

describe("RippleButton", () => {
  it("defaults to type=button and glinr, and spawns a ripple on press", () => {
    vi.useFakeTimers()
    const onClick = vi.fn()
    const { container } = render(<RippleButton onClick={onClick}>Press</RippleButton>)
    const button = screen.getByRole("button", { name: "Press" })
    expect(button).toHaveAttribute("type", "button")
    expect(button).toHaveAttribute("data-variant", "glinr")
    fireEvent.click(button, { clientX: 10, clientY: 5 })
    expect(onClick).toHaveBeenCalledTimes(1)
    const ripple = container.querySelector('[data-slot="ripple"]') as HTMLElement
    expect(ripple.className).toContain("currentColor_30%")
    act(() => {
      vi.advanceTimersByTime(700)
    })
    expect(container.querySelector('[data-slot="ripple"]')).toBeNull()
    vi.useRealTimers()
  })

  it("skips the ripple when motion is none but still calls onClick", () => {
    const onClick = vi.fn()
    const { container } = render(
      <MotionEngineProvider motion="none">
        <RippleButton onClick={onClick}>Press</RippleButton>
      </MotionEngineProvider>
    )
    fireEvent.click(screen.getByRole("button"))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(container.querySelector('[data-slot="ripple"]')).toBeNull()
  })
})

describe("CopyButton", () => {
  it("renders on the shared Button surface with a labelled icon-only mode", () => {
    const { rerender } = render(<CopyButton value="x" />)
    expect(screen.getByRole("button", { name: /Copy/ })).toHaveAttribute("data-variant", "glinr")
    rerender(<CopyButton value="x" iconOnly variant="outline" />)
    const button = screen.getByRole("button", { name: "Copy" })
    expect(button).toHaveAttribute("data-variant", "outline")
    expect(button).toHaveAttribute("type", "button")
  })

  it("copies and announces", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true })
    const onCopy = vi.fn()
    render(<CopyButton value="pnpm add" onCopy={onCopy} />)
    await act(async () => {
      fireEvent.click(screen.getByRole("button"))
    })
    expect(writeText).toHaveBeenCalledWith("pnpm add")
    expect(onCopy).toHaveBeenCalledWith("pnpm add")
    expect(screen.getByRole("button")).toHaveAttribute("data-copied", "true")
  })
})
