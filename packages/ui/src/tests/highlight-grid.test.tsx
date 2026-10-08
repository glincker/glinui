import { fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { HighlightGrid, type HighlightGridCell } from "../components/highlight-grid"
import { installPointerEvent } from "./a2-test-utils"
import { GlinProvider } from "../components/glin-provider"
import { MotionEngineProvider } from "../components/motion-engine"

const cells: HighlightGridCell[] = [
  { id: "a", content: "Alpha" },
  { id: "b", content: "Beta", href: "#beta" },
  { id: "c", content: "Gamma" },
  { id: "d", content: "Delta" }
]

function stubRects() {
  document.querySelectorAll<HTMLLIElement>("[data-slot=highlight-grid-cell]").forEach((li, i) => {
    Object.defineProperties(li, {
      offsetLeft: { configurable: true, value: (i % 2) * 100 },
      offsetTop: { configurable: true, value: Math.floor(i / 2) * 50 },
      offsetWidth: { configurable: true, value: 100 },
      offsetHeight: { configurable: true, value: 50 }
    })
  })
}

const panel = () => document.querySelector("[data-slot=highlight-grid-panel]") as HTMLElement

let restorePointer: () => void
beforeEach(() => {
  restorePointer = installPointerEvent()
})
afterEach(() => restorePointer())

describe("HighlightGrid", () => {
  it("renders a list of cells, links for href and an aria-hidden panel", () => {
    render(<HighlightGrid cells={cells} columns={2} />)
    expect(screen.getAllByRole("listitem")).toHaveLength(4)
    expect(screen.getByRole("link", { name: "Beta" })).toHaveAttribute("href", "#beta")
    expect(panel()).toHaveAttribute("aria-hidden", "true")
    expect(panel()).toHaveAttribute("data-visible", "false")
  })

  it("moves the panel to the hovered cell and sizes it to the cell rect", () => {
    render(<HighlightGrid cells={cells} columns={2} />)
    stubRects()
    fireEvent.pointerEnter(screen.getAllByRole("listitem")[3], { pointerType: "mouse" })
    expect(panel().style.getPropertyValue("--hg-x")).toBe("100px")
    expect(panel().style.getPropertyValue("--hg-y")).toBe("50px")
    expect(panel().style.getPropertyValue("--hg-w")).toBe("100px")
    expect(panel()).toHaveAttribute("data-visible", "true")
    fireEvent.pointerEnter(screen.getAllByRole("listitem")[0])
    expect(panel().style.getPropertyValue("--hg-x")).toBe("0px")
  })

  it("fades out when the pointer leaves the grid", () => {
    const { container } = render(<HighlightGrid cells={cells} />)
    stubRects()
    fireEvent.pointerEnter(screen.getAllByRole("listitem")[0])
    fireEvent.pointerLeave(container.firstChild as HTMLElement)
    expect(panel()).toHaveAttribute("data-visible", "false")
  })

  it("follows keyboard focus and supports roving arrow navigation", () => {
    render(<HighlightGrid cells={cells} columns={2} />)
    stubRects()
    const bodies = document.querySelectorAll<HTMLElement>("[data-slot=highlight-grid-cell-body]")
    expect(bodies[0]).toHaveAttribute("tabindex", "0")
    expect(bodies[1]).toHaveAttribute("tabindex", "-1")
    bodies[0].focus()
    expect(panel()).toHaveAttribute("data-visible", "true")
    fireEvent.keyDown(bodies[0], { key: "ArrowRight" })
    expect(document.activeElement).toBe(bodies[1])
    expect(panel().style.getPropertyValue("--hg-x")).toBe("100px")
    fireEvent.keyDown(bodies[1], { key: "End" })
    expect(document.activeElement).toBe(bodies[3])
    fireEvent.keyDown(bodies[3], { key: "Home" })
    expect(document.activeElement).toBe(bodies[0])
  })

  it("moves on touch pointer down and stays after the finger lifts", () => {
    const { container } = render(<HighlightGrid cells={cells} columns={2} />)
    stubRects()
    fireEvent.pointerDown(screen.getAllByRole("listitem")[2], { pointerType: "touch" })
    expect(panel().style.getPropertyValue("--hg-y")).toBe("50px")
    fireEvent.pointerLeave(container.firstChild as HTMLElement, { pointerType: "touch" })
    expect(panel()).toHaveAttribute("data-visible", "true")
    fireEvent.pointerDown(document.body)
    expect(panel()).toHaveAttribute("data-visible", "false")
  })

  it("uses a custom cellRenderer with active state", () => {
    render(
      <HighlightGrid cells={cells} cellRenderer={(cell, state) => <b>{`${cell.id}:${state.active}`}</b>} />
    )
    expect(screen.getByText("a:false")).toBeInTheDocument()
    fireEvent.pointerEnter(screen.getAllByRole("listitem")[0])
    expect(screen.getByText("a:true")).toBeInTheDocument()
  })

  it("resolves variant from the ambient style and has no glide at motion none", () => {
    const { rerender } = render(<HighlightGrid cells={cells} />)
    const base = panel().className
    rerender(
      <GlinProvider defaults={{ style: "minimal" }}>
        <HighlightGrid cells={cells} />
      </GlinProvider>
    )
    expect(panel().className).not.toBe(base)
    rerender(
      <MotionEngineProvider motion="none">
        <HighlightGrid cells={cells} />
      </MotionEngineProvider>
    )
    expect(document.querySelector("[data-slot=highlight-grid]")).toHaveAttribute("data-motion", "reduced")
  })

  it("disconnects its ResizeObserver on unmount", () => {
    const disconnect = vi.fn()
    const original = globalThis.ResizeObserver
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect = disconnect
    } as unknown as typeof ResizeObserver
    const { unmount } = render(<HighlightGrid cells={cells} />)
    unmount()
    expect(disconnect).toHaveBeenCalled()
    globalThis.ResizeObserver = original
  })
})
