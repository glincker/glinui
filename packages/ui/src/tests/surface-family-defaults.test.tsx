import * as React from "react"
import { render, screen } from "@testing-library/react"

import {
  Attachment,
  Avatar,
  Badge,
  Bubble,
  Chip,
  Code,
  CodePanel,
  Counter,
  Empty,
  GlinProvider,
  InstallCommand,
  Item,
  Kbd,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Terminal,
  Tree
} from "../index"

type Style = "glinr" | "minimal" | "glass"

function withStyle(style: Style | null, node: React.ReactNode) {
  return style ? <GlinProvider defaults={{ style }}>{node}</GlinProvider> : <>{node}</>
}

type Case = { name: string; render: (variant?: string) => React.ReactElement }

const cases: Case[] = [
  { name: "Badge", render: (v) => <Badge data-testid="x" variant={v as never}>b</Badge> },
  { name: "Chip", render: (v) => <Chip data-testid="x" variant={v as never}>c</Chip> },
  { name: "Counter", render: (v) => <Counter data-testid="x" value={3} variant={v as never} /> },
  { name: "Kbd", render: (v) => <Kbd data-testid="x" variant={v as never}>k</Kbd> },
  { name: "Code", render: (v) => <Code data-testid="x" variant={v as never}>c</Code> },
  { name: "Avatar", render: (v) => <Avatar data-testid="x" fallback="A" variant={v as never} /> },
  { name: "Bubble", render: (v) => <Bubble data-testid="x" variant={v as never}>b</Bubble> },
  { name: "Empty", render: (v) => <Empty data-testid="x" variant={v as never} /> },
  { name: "Item", render: (v) => <Item data-testid="x" variant={v as never} /> },
  { name: "Attachment", render: (v) => <Attachment data-testid="x" name="a.txt" variant={v as never} /> },
  { name: "Tree", render: (v) => <Tree data-testid="x" nodes={[{ label: "a" }]} variant={v as never} /> },
  { name: "CodePanel", render: (v) => <CodePanel data-testid="x" variant={v as never}>x</CodePanel> },
  { name: "Terminal", render: (v) => <Terminal data-testid="x" variant={v as never}>x</Terminal> }
]

describe.each(cases)("$name default resolution", ({ render: build }) => {
  it("defaults to glinr without a provider", () => {
    render(build())
    expect(screen.getByTestId("x")).toHaveAttribute("data-variant", "glinr")
  })

  it("follows the ambient style", () => {
    const { unmount } = render(withStyle("minimal", build()))
    expect(screen.getByTestId("x")).toHaveAttribute("data-variant", "plain")
    unmount()
    render(withStyle("glass", build()))
    expect(screen.getByTestId("x")).toHaveAttribute("data-variant", "glass")
  })

  it("lets an explicit variant win", () => {
    render(withStyle("minimal", build("soft")))
    expect(screen.getByTestId("x")).toHaveAttribute("data-variant", "soft")
  })
})

describe("Table default resolution", () => {
  const table = (variant?: string) => (
    <Table variant={variant as never}>
      <TableBody>
        <TableRow>
          <TableCell>v</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )

  it("uses the glinr lift wrapper by default and the shadcn table for minimal", () => {
    const { container, unmount } = render(table())
    expect(container.querySelector("[data-slot=table-container]")).toHaveAttribute("data-variant", "glinr")
    unmount()
    const flat = render(withStyle("minimal", table()))
    const wrapper = flat.container.querySelector("[data-slot=table-container]")
    expect(wrapper).toHaveAttribute("data-variant", "plain")
    expect(wrapper?.className).toContain("rounded-lg")
  })

  it("keeps the legacy lift alias on the glinr look", () => {
    const { container } = render(withStyle("minimal", table("lift")))
    expect(container.querySelector("[data-slot=table-container]")).toHaveAttribute("data-variant", "glinr")
  })
})

describe("variant vocabulary", () => {
  it.each(["glinr", "solid", "plain", "soft", "outline", "ghost", "gradient", "glass"] as const)(
    "Badge renders the %s variant",
    (variant) => {
      render(<Badge data-testid="x" variant={variant}>b</Badge>)
      expect(screen.getByTestId("x")).toHaveAttribute("data-variant", variant)
    }
  )

  it("maps legacy tone aliases to soft plus tone", () => {
    render(<Badge data-testid="x" variant="success">ok</Badge>)
    const el = screen.getByTestId("x")
    expect(el).toHaveAttribute("data-variant", "soft")
    expect(el.className).toContain("--tone-success")
  })

  it("tints the glinr pill face for non neutral tones", () => {
    render(<Chip data-testid="x" tone="danger">c</Chip>)
    expect(screen.getByTestId("x").className).toContain("[--face:var(--t-soft)]")
  })
})

describe("InstallCommand ambient style", () => {
  it("reads the ambient style through the code panel", () => {
    const { container } = render(withStyle("minimal", <InstallCommand packageName="@glinui/ui" />))
    expect(container.querySelector("[data-slot=code-panel]")).toHaveAttribute("data-variant", "plain")
  })
})
