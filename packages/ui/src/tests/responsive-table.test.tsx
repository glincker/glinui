import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"

import { ResponsiveTable, type ResponsiveColumn } from "../index"
import {
  DEFAULT_VIRTUALIZE_OVER,
  cardFields,
  paddingFor,
  priorityClass,
  shouldVirtualize,
  splitColumns
} from "../lib/responsive-table"

type Row = { id: string; name: string; region: string; size: string }

const rows: Row[] = [
  { id: "a", name: "api", region: "fra", size: "2 vCPU" },
  { id: "b", name: "web", region: "iad", size: "1 vCPU" }
]

const columns: ResponsiveColumn<Row>[] = [
  { id: "name", header: "Name", cell: (r) => r.name },
  { id: "region", header: "Region", cell: (r) => r.region, priority: 2 },
  { id: "size", header: "Size", cell: (r) => r.size, priority: 3, cardLabel: "Machine size" }
]

function mockViewport(wide: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: wide,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  })) as unknown as typeof window.matchMedia
}

afterEach(() => {
  // @ts-expect-error restore the jsdom default of no matchMedia
  delete window.matchMedia
})

describe("responsive-table helpers", () => {
  it.each([
    [undefined, ""],
    [1, ""],
    [2, "hidden [@container_rtable_(min-width:42rem)]:table-cell"],
    [3, "hidden [@container_rtable_(min-width:56rem)]:table-cell"]
  ] as const)("priorityClass(%s)", (priority, expected) => {
    expect(priorityClass(priority)).toBe(expected)
  })

  it("virtualizes only above the threshold", () => {
    expect(shouldVirtualize(DEFAULT_VIRTUALIZE_OVER)).toBe(false)
    expect(shouldVirtualize(DEFAULT_VIRTUALIZE_OVER + 1)).toBe(true)
    expect(shouldVirtualize(5, 4)).toBe(true)
  })

  it("picks the flagged primary column, else the first", () => {
    const cols = [{ id: "a" }, { id: "b", primary: true }, { id: "c", hideInCard: true }]
    expect(splitColumns(cols).primary?.id).toBe("b")
    expect(splitColumns([{ id: "a" }, { id: "b" }]).primary?.id).toBe("a")
    expect(cardFields(cols).map((c) => c.id)).toEqual(["a"])
  })

  it("computes spacer padding from the rendered window", () => {
    expect(paddingFor([], 100)).toEqual({ top: 0, bottom: 0 })
    expect(paddingFor([{ start: 40, end: 60 }, { start: 60, end: 80 }], 200)).toEqual({ top: 40, bottom: 120 })
  })
})

describe("ResponsiveTable", () => {
  it("renders a table with every column when the viewport is wide", () => {
    mockViewport(true)
    render(<ResponsiveTable rows={rows} columns={columns} getRowId={(r) => r.id} ariaLabel="Servers" />)
    const table = screen.getByRole("table", { name: "Servers" })
    expect(within(table).getAllByRole("columnheader")).toHaveLength(3)
    expect(within(table).getAllByRole("row")).toHaveLength(3)
  })

  it("marks lower priority columns with container query classes", () => {
    mockViewport(true)
    render(<ResponsiveTable rows={rows} columns={columns} getRowId={(r) => r.id} ariaLabel="Servers" />)
    const headers = screen.getAllByRole("columnheader")
    expect(headers[0].className).not.toContain("rtable")
    expect(headers[1].className).toContain("@container_rtable_(min-width:42rem)")
    expect(headers[2].className).toContain("@container_rtable_(min-width:56rem)")
    expect(screen.getByRole("table").parentElement?.className).toContain("[container-name:rtable]")
  })

  it("stacks rows into a labelled list of cards below the breakpoint", () => {
    mockViewport(false)
    render(<ResponsiveTable rows={rows} columns={columns} getRowId={(r) => r.id} ariaLabel="Servers" />)
    expect(screen.queryByRole("table")).toBeNull()
    const list = screen.getByRole("list", { name: "Servers" })
    expect(within(list).getAllByRole("listitem")).toHaveLength(2)
    expect(within(list).getAllByText("Machine size")).toHaveLength(2)
    expect(within(list).getByText("api")).toBeInTheDocument()
  })

  it("never stacks when stackBelow is none", () => {
    mockViewport(false)
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === "(min-width: 0px)",
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    })) as unknown as typeof window.matchMedia
    render(<ResponsiveTable rows={rows} columns={columns} getRowId={(r) => r.id} ariaLabel="Servers" stackBelow="none" />)
    expect(screen.getByRole("table")).toBeInTheDocument()
  })

  it("collapses row actions into a keyboard operable menu", async () => {
    mockViewport(true)
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(
      <ResponsiveTable
        rows={rows}
        columns={columns}
        getRowId={(r) => r.id}
        ariaLabel="Servers"
        actionsLabel={(r) => `Actions for ${r.name}`}
        actions={(r) => [{ id: "restart", label: "Restart", onSelect: () => onSelect(r.id) }]}
      />
    )
    const trigger = screen.getByRole("button", { name: "Actions for api" })
    trigger.focus()
    await user.keyboard("{Enter}")
    await user.click(await screen.findByRole("menuitem", { name: "Restart" }))
    expect(onSelect).toHaveBeenCalledWith("a")
  })

  it("makes rows focusable and activates them with Enter and Space", async () => {
    mockViewport(true)
    const onRowClick = vi.fn()
    const user = userEvent.setup()
    render(
      <ResponsiveTable rows={rows} columns={columns} getRowId={(r) => r.id} ariaLabel="Servers" onRowClick={onRowClick} />
    )
    const first = screen.getAllByRole("row")[1]
    first.focus()
    await user.keyboard("{Enter}")
    await user.keyboard(" ")
    expect(onRowClick).toHaveBeenCalledTimes(2)
    expect(onRowClick).toHaveBeenCalledWith(rows[0])
  })

  it("does not fire row activation from an inner button", async () => {
    mockViewport(true)
    const onRowClick = vi.fn()
    const user = userEvent.setup()
    const cols: ResponsiveColumn<Row>[] = [{ id: "n", header: "Name", cell: (r) => <button type="button">{r.name}</button> }]
    render(<ResponsiveTable rows={rows} columns={cols} getRowId={(r) => r.id} ariaLabel="Servers" onRowClick={onRowClick} />)
    await user.click(screen.getByRole("button", { name: "api" }))
    expect(onRowClick).not.toHaveBeenCalled()
  })

  it("passes through row props and uses translated labels", () => {
    mockViewport(true)
    render(
      <ResponsiveTable
        rows={rows}
        columns={columns}
        getRowId={(r) => r.id}
        ariaLabel="Servers"
        leading={{ cell: () => <span /> }}
        actions={() => [{ id: "x", label: "X" }]}
        labels={{ actionsColumn: "Aktionen", leadingColumn: "Auswahl", rowActions: "Zeilenaktionen" }}
        getRowProps={(r) => ({ "aria-current": r.id === "a" ? "true" : undefined, "data-kind": "server" })}
      />
    )
    expect(screen.getByText("Aktionen")).toBeInTheDocument()
    expect(screen.getByText("Auswahl")).toBeInTheDocument()
    expect(screen.getAllByRole("button", { name: "Zeilenaktionen" })).toHaveLength(2)
    expect(screen.getAllByRole("row")[1]).toHaveAttribute("aria-current", "true")
    expect(screen.getAllByRole("row")[1]).toHaveAttribute("data-kind", "server")
  })
})
