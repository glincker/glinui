import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertTitle,
  Badge,
  Button,
  Card,
  Heading,
  IconFrame,
  Link,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text
} from "../index"
import { YesNo } from "../components/table"
import { CodePanel, tokens } from "../components/code-panel"
import { CopyButton } from "../components/copy-button"
import { InstallCommand } from "../components/install-command"

function mockClipboard() {
  const writeText = vi.fn().mockResolvedValue(undefined)
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true })
  return writeText
}

describe("Button key variants", () => {
  it("renders key and key-white with key color variables", () => {
    render(
      <>
        <Button variant="key" data-testid="key">Go</Button>
        <Button variant="key-white" data-testid="white">Go</Button>
      </>
    )
    expect(screen.getByTestId("key").className).toContain("--k-top")
    expect(screen.getByTestId("key").className).toContain("active:translate-y-px")
    expect(screen.getByTestId("white").className).toContain("--key-white-top")
  })

  it("applies icon nudge classes only when requested", () => {
    render(
      <>
        <Button iconNudge data-testid="nudge">A</Button>
        <Button data-testid="plain">B</Button>
      </>
    )
    expect(screen.getByTestId("nudge").className).toContain("translate-x-[2px]")
    expect(screen.getByTestId("plain").className).not.toContain("translate-x-[2px]")
  })
})

describe("Card lift props", () => {
  it("opts into the lift surface via elevation, face and ring", () => {
    render(<Card elevation={3} face={2} ring="hot" data-testid="card" />)
    const cls = screen.getByTestId("card").className
    expect(cls).toContain("padding-box")
    expect(cls).toContain("--elev-3")
    expect(cls).toContain("--face-2")
    expect(cls).toContain("--ring-hot")
  })

  it("renders an inset well", () => {
    render(<Card inset data-testid="well" />)
    expect(screen.getByTestId("well").className).toContain("--elev-inset")
    expect(screen.getByTestId("well").getAttribute("data-inset")).toBe("true")
  })

  it("keeps the plain variant flat (no ring gradient)", () => {
    render(<Card variant="plain" data-testid="plain" />)
    expect(screen.getByTestId("plain").className).not.toContain("padding-box")
  })
})

describe("Badge raised, dot and asChild", () => {
  it("renders raised with a hidden glowing dot", () => {
    render(<Badge variant="raised" dot dotTone="live" data-testid="b">Live</Badge>)
    const badge = screen.getByTestId("b")
    expect(badge.className).toContain("padding-box")
    const dot = badge.querySelector("[data-slot=badge-dot]")
    expect(dot).not.toBeNull()
    expect(dot?.getAttribute("aria-hidden")).toBe("true")
  })

  it("renders as the child element", () => {
    render(
      <Badge asChild dot>
        <a href="/x">Link badge</a>
      </Badge>
    )
    const link = screen.getByRole("link", { name: "Link badge" })
    expect(link.getAttribute("href")).toBe("/x")
    expect(link.querySelector("[data-slot=badge-dot]")).not.toBeNull()
  })
})

describe("Text and Heading", () => {
  it("renders an eyebrow with a dot", () => {
    render(<Text variant="eyebrow" dot data-testid="e">Platform</Text>)
    const el = screen.getByTestId("e")
    expect(el.className).toContain("uppercase")
    expect(el.className).toContain("tracking-[0.08em]")
    expect(el.querySelector("[data-slot=eyebrow-dot]")).not.toBeNull()
  })

  it("supports tone marks and lead", () => {
    render(
      <>
        <Text as="span" tone="live" data-testid="mark">hot</Text>
        <Text lead data-testid="lead">Lead</Text>
      </>
    )
    expect(screen.getByTestId("mark").tagName).toBe("SPAN")
    expect(screen.getByTestId("mark").className).toContain("signal-live")
    expect(screen.getByTestId("lead").className).toContain("56ch")
  })

  it("supports display heading size", () => {
    render(<Heading level={1} size="display">Big</Heading>)
    const h = screen.getByRole("heading", { level: 1 })
    expect(h.className).toContain("clamp(2.75rem,6.4vw,4.25rem)")
    expect(h.className).toContain("font-light")
    expect(h.className).toContain("balance")
  })
})

describe("Link arrow", () => {
  it("renders a decorative arrow without underline", () => {
    render(<Link variant="arrow" href="/go">Read more</Link>)
    const a = screen.getByRole("link", { name: "Read more" })
    expect(a.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true")
    expect(a.className).toContain("no-underline")
    expect(a.className).toContain("motion-reduce")
  })

  it("can hide the arrow", () => {
    render(<Link variant="arrow" hideArrow href="/go">Plain</Link>)
    expect(screen.getByRole("link").querySelector("svg")).toBeNull()
  })
})

describe("Tabs keys", () => {
  it("keeps ARIA and keyboard behavior", async () => {
    const user = userEvent.setup()
    render(
      <Tabs defaultValue="a">
        <TabsList variant="keys" aria-label="Keys">
          <TabsTrigger variant="keys" value="a">A</TabsTrigger>
          <TabsTrigger variant="keys" value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent variant="keys" value="a">Panel A</TabsContent>
        <TabsContent variant="keys" value="b">Panel B</TabsContent>
      </Tabs>
    )
    const a = screen.getByRole("tab", { name: "A" })
    expect(a.getAttribute("aria-selected")).toBe("true")
    expect(a.className).toContain("--key-white-top")
    a.focus()
    await user.keyboard("{ArrowRight}")
    expect(screen.getByRole("tab", { name: "B" }).getAttribute("aria-selected")).toBe("true")
    expect(screen.getByText("Panel B")).toBeVisible()
  })
})

describe("Accordion lift", () => {
  it("lifts the list and inherits the variant", async () => {
    const user = userEvent.setup()
    render(
      <Accordion type="single" collapsible variant="lift" data-testid="acc">
        <AccordionItem value="1" data-testid="item">
          <AccordionTrigger>Q1</AccordionTrigger>
          <AccordionContent>A1</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    expect(screen.getByTestId("acc").className).toContain("padding-box")
    expect(screen.getByTestId("item").className).toContain("line-soft")
    const trigger = screen.getByRole("button", { name: "Q1" })
    expect(trigger.getAttribute("aria-expanded")).toBe("false")
    await user.click(trigger)
    expect(trigger.getAttribute("aria-expanded")).toBe("true")
  })
})

describe("Table lift and YesNo", () => {
  it("renders a lift wrapper and wide table", () => {
    render(
      <Table variant="lift" wide data-testid="table">
        <TableBody>
          <TableRow>
            <TableCell>
              <YesNo value />
              <YesNo value={false} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(screen.getByTestId("table").className).toContain("min-w-[640px]")
    expect(document.querySelector("[data-slot=table-container]")?.className).toContain("padding-box")
    expect(screen.getByText("Yes")).toHaveClass("sr-only")
    expect(screen.getByText("No")).toHaveClass("sr-only")
  })
})

describe("Alert, IconFrame, Separator", () => {
  it("renders note and flag alerts", () => {
    render(
      <>
        <Alert variant="note" data-testid="note"><AlertTitle>Note</AlertTitle>Body</Alert>
        <Alert variant="flag" data-testid="flag"><AlertTitle>Flag</AlertTitle>Body</Alert>
      </>
    )
    expect(screen.getByTestId("note").className).toContain("padding-box")
    expect(screen.getByTestId("flag").className).toContain("ring-violet")
  })

  it("renders raised icon frame and hairline separator", () => {
    render(
      <>
        <IconFrame variant="raised" data-testid="icon" />
        <Separator variant="hairline" data-testid="sep" />
      </>
    )
    expect(screen.getByTestId("icon").className).toContain("padding-box")
    expect(screen.getByTestId("sep").className).toContain("--hairline")
    expect(screen.getByTestId("sep").className).toContain("h-px")
  })
})

describe("CopyButton", () => {
  afterEach(() => vi.useRealTimers())

  it("copies, announces, calls onCopy and resets after 1.6s", async () => {
    const writeText = mockClipboard()
    const onCopy = vi.fn()
    render(<CopyButton value="hello" onCopy={onCopy} />)
    const btn = screen.getByRole("button", { name: /copy/i })
    expect(btn.getAttribute("data-copied")).toBe("false")

    vi.useFakeTimers({ shouldAdvanceTime: true })
    btn.click()
    await waitFor(() => expect(btn.getAttribute("data-copied")).toBe("true"))
    expect(writeText).toHaveBeenCalledWith("hello")
    expect(onCopy).toHaveBeenCalledWith("hello")
    expect(screen.getByRole("status").textContent).toBe("Copied")

    vi.advanceTimersByTime(1700)
    await waitFor(() => expect(btn.getAttribute("data-copied")).toBe("false"))
  })

  it("prefers getValue over value", async () => {
    const writeText = mockClipboard()
    render(<CopyButton value="static" getValue={() => "lazy"} />)
    screen.getByRole("button").click()
    await waitFor(() => expect(writeText).toHaveBeenCalledWith("lazy"))
  })

  it("falls back to execCommand when the clipboard API rejects", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("denied"))
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true })
    const exec = vi.fn().mockReturnValue(true)
    Object.defineProperty(document, "execCommand", { value: exec, configurable: true })
    render(<CopyButton value="fallback" />)
    const btn = screen.getByRole("button")
    btn.click()
    await waitFor(() => expect(btn.getAttribute("data-copied")).toBe("true"))
    expect(exec).toHaveBeenCalledWith("copy")
  })
})

describe("CodePanel", () => {
  it("renders header, token classes and a scrollable region", () => {
    render(
      <CodePanel title="app.ts" copyValue="x" codeLabel="Snippet">
        {tokens(["k", "const "], ["f", "x"], " = ", ["s", '"a"'], ["c", " // hi"])}
      </CodePanel>
    )
    expect(screen.getByText("app.ts")).toBeVisible()
    expect(screen.getByRole("button", { name: /copy/i })).toBeVisible()
    const pre = screen.getByLabelText("Snippet")
    expect(pre.className).toContain("overflow-x-auto")
    expect(pre.querySelector(".tok-k")?.textContent).toBe("const ")
    expect(pre.querySelector(".tok-s")?.textContent).toBe('"a"')
    expect(pre.querySelector(".tok-c")).not.toBeNull()
    expect(pre.querySelector(".tok-f")).not.toBeNull()
  })
})

describe("InstallCommand", () => {
  it("switches tabs and copies the active command", async () => {
    const user = userEvent.setup()
    // userEvent installs its own clipboard stub, so mock after setup.
    const writeText = mockClipboard()
    const onCopy = vi.fn()
    render(<InstallCommand packageName="@glinui/ui" onCopy={onCopy} />)

    expect(screen.getAllByRole("tab")).toHaveLength(4)
    expect(screen.getByRole("tab", { name: "npm" }).getAttribute("aria-selected")).toBe("true")
    expect(screen.getByText("npm install @glinui/ui")).toBeVisible()

    await user.click(screen.getByRole("tab", { name: "pnpm" }))
    expect(screen.getByText("pnpm add @glinui/ui")).toBeVisible()

    await user.click(screen.getByRole("button", { name: /copy/i }))
    await waitFor(() => expect(writeText).toHaveBeenCalledWith("pnpm add @glinui/ui"))
    expect(onCopy).toHaveBeenCalledWith("pnpm add @glinui/ui", "pnpm")
  })

  it("supports custom commands and controlled value", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <InstallCommand commands={{ cli: "npx glin init", pip: "pip install glin" }} value="pip" onValueChange={onValueChange} />
    )
    expect(screen.getByRole("tab", { name: "pip" }).getAttribute("aria-selected")).toBe("true")
    await user.click(screen.getByRole("tab", { name: "cli" }))
    expect(onValueChange).toHaveBeenCalledWith("cli")
    expect(screen.getByRole("tab", { name: "pip" }).getAttribute("aria-selected")).toBe("true")
  })
})
