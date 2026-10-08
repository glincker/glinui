import { render, screen } from "@testing-library/react"

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../index"

describe("Table", () => {
  it("renders semantic table structure", () => {
    render(
      <Table>
        <TableCaption>Active projects</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Glin UI</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    expect(screen.getByRole("table")).toBeVisible()
    expect(screen.getByText("Active projects")).toBeVisible()
    expect(screen.getByText("Glin UI")).toBeVisible()
  })

  it("applies liquid variant wrapper classes", () => {
    const { container } = render(
      <Table variant="liquid">
        <TableBody>
          <TableRow>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.className).toContain("radial-gradient")
  })

  it("propagates size to header and body cells", () => {
    render(
      <Table size="lg">
        <TableHeader>
          <TableRow>
            <TableHead>Label</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Entry</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    expect(screen.getByRole("columnheader").className).toContain("h-12")
    expect(screen.getByRole("cell").className).toContain("p-4")
  })

  it("supports sticky header and striped rows", () => {
    render(
      <Table stickyHeader striped>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Alpha</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Beta</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    expect(screen.getAllByRole("rowgroup")[0]?.className).toContain("sticky")
    expect(screen.getByText("Beta").closest("tr")?.className).toContain("even:bg-")
  })

  it("supports cell alignment and grid lines", () => {
    render(
      <Table grid>
        <TableHeader>
          <TableRow>
            <TableHead align="right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell align="center">42</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    expect(screen.getByRole("columnheader").className).toContain("text-right")
    expect(screen.getByRole("cell").className).toContain("text-center")
    expect(screen.getByRole("columnheader").className).toContain("border-r")
  })

  it("supports fixed layout, no-wrap, and sticky first column", () => {
    render(
      <Table layout="fixed" noWrap stickyFirstColumn>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Glin UI</TableCell>
            <TableCell>Long description text</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    expect(screen.getByRole("table").className).toContain("table-fixed")
    expect(screen.getByRole("columnheader", { name: "Name" }).className).toContain("first:sticky")
    expect(screen.getByRole("cell", { name: "Glin UI" }).className).toContain("first:sticky")
    expect(screen.getByRole("columnheader", { name: "Name" }).className).toContain("whitespace-nowrap")
  })

  it("supports row tone styles", () => {
    render(
      <Table>
        <TableBody>
          <TableRow tone="success">
            <TableCell>Stable</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    expect(screen.getByText("Stable").closest("tr")?.className).toContain("--tone-success")
  })
})
