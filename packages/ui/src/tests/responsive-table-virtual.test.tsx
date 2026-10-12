import { render, screen } from "@testing-library/react"
import { vi } from "vitest"

import { VirtualResponsiveTable } from "../components/responsive-table-virtual"
import type { ResponsiveColumn } from "../components/responsive-table"

type Row = { id: string; name: string }

const makeRows = (n: number): Row[] => Array.from({ length: n }, (_, i) => ({ id: `r${i}`, name: `row-${i}` }))
const columns: ResponsiveColumn<Row>[] = [{ id: "name", header: "Name", cell: (r) => r.name }]

function mockLayout(height: number) {
  // jsdom has no layout: report a 400px viewport and a fixed row height to the virtualizer.
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(height)
  vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(800)
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    width: 800,
    height,
    top: 0,
    left: 0,
    right: 800,
    bottom: height,
    x: 0,
    y: 0,
    toJSON: () => ({})
  })
}

function mockViewport(wide: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: wide,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  })) as unknown as typeof window.matchMedia
}

afterEach(() => {
  vi.restoreAllMocks()
  // @ts-expect-error restore the jsdom default of no matchMedia
  delete window.matchMedia
})

describe("VirtualResponsiveTable", () => {
  it("renders every row at or below the threshold", () => {
    mockViewport(true)
    mockLayout(400)
    render(<VirtualResponsiveTable rows={makeRows(5)} columns={columns} getRowId={(r) => r.id} ariaLabel="Rows" />)
    expect(screen.getAllByRole("row")).toHaveLength(6)
    expect(screen.getByRole("table")).not.toHaveAttribute("aria-rowcount")
  })

  it("windows the table above the threshold and announces the total", () => {
    mockViewport(true)
    mockLayout(400)
    render(
      <VirtualResponsiveTable
        rows={makeRows(500)}
        columns={columns}
        getRowId={(r) => r.id}
        ariaLabel="Rows"
        virtualizeOver={50}
        estimateRowHeight={40}
      />
    )
    const rendered = screen.getAllByRole("row").length
    expect(rendered).toBeGreaterThan(1)
    expect(rendered).toBeLessThan(100)
    expect(screen.getByRole("table")).toHaveAttribute("aria-rowcount", "501")
    expect(screen.getByText("row-0")).toBeInTheDocument()
    expect(screen.queryByText("row-499")).toBeNull()
  })

  it("windows the stacked card list too", () => {
    mockViewport(false)
    mockLayout(400)
    render(
      <VirtualResponsiveTable
        rows={makeRows(500)}
        columns={columns}
        getRowId={(r) => r.id}
        ariaLabel="Rows"
        virtualizeOver={50}
        estimateRowHeight={40}
      />
    )
    const items = screen.getAllByRole("listitem").filter((li) => li.hasAttribute("data-row-id"))
    expect(items.length).toBeGreaterThan(0)
    expect(items.length).toBeLessThan(100)
  })
})
