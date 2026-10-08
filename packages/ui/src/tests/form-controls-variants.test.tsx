import { render, screen } from "@testing-library/react"

import {
  Checkbox,
  Combobox,
  GlinProvider,
  Input,
  InputGroup,
  InputGroupInput,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  Label,
  MorphingTabs,
  Progress,
  PromptInput,
  RadioGroup,
  RadioGroupItem,
  Select,
  Skeleton,
  Slider,
  Spinner,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
  Textarea,
  Toggle,
  ToggleGroup,
  ToggleGroupItem
} from "../index"
import { resolveControlVariant } from "../lib/control"

type Case = { name: string; render: (variant?: string) => React.ReactElement; pick: () => HTMLElement }

const options = [{ label: "One", value: "1" }]

const cases: Case[] = [
  { name: "Input", render: (v) => <Input aria-label="x" variant={v as never} />, pick: () => screen.getByLabelText("x") },
  { name: "Textarea", render: (v) => <Textarea aria-label="x" variant={v as never} />, pick: () => screen.getByLabelText("x") },
  { name: "Select", render: (v) => <Select aria-label="x" options={options} variant={v as never} />, pick: () => screen.getByLabelText("x") },
  { name: "Checkbox", render: (v) => <Checkbox aria-label="x" variant={v as never} />, pick: () => screen.getByLabelText("x") },
  {
    name: "RadioGroupItem",
    render: (v) => (
      <RadioGroup aria-label="r">
        <RadioGroupItem value="a" aria-label="x" variant={v as never} />
      </RadioGroup>
    ),
    pick: () => screen.getByLabelText("x")
  },
  { name: "Switch", render: (v) => <Switch aria-label="x" variant={v as never} />, pick: () => screen.getByLabelText("x") },
  { name: "Toggle", render: (v) => <Toggle aria-label="x" variant={v as never} />, pick: () => screen.getByLabelText("x") },
  {
    name: "ToggleGroupItem",
    render: (v) => (
      <ToggleGroup type="single" aria-label="g" variant={v as never}>
        <ToggleGroupItem value="a" aria-label="x">A</ToggleGroupItem>
      </ToggleGroup>
    ),
    pick: () => screen.getByLabelText("x")
  },
  { name: "Slider", render: (v) => <Slider data-testid="x" variant={v as never} defaultValue={[10]} />, pick: () => screen.getByTestId("x") },
  { name: "Combobox", render: (v) => <Combobox aria-label="x" options={options} variant={v as never} />, pick: () => screen.getByLabelText("x") },
  {
    name: "InputGroup",
    render: (v) => (
      <InputGroup data-testid="x" variant={v as never}>
        <InputGroupInput aria-label="i" />
      </InputGroup>
    ),
    pick: () => screen.getByTestId("x")
  },
  {
    name: "InputOTPSlot",
    render: (v) => (
      <InputOTP aria-label="otp" maxLength={2} variant={v as never}>
        <InputOTPGroup>
          <InputOTPSlot index={0} data-testid="x" />
        </InputOTPGroup>
      </InputOTP>
    ),
    pick: () => screen.getByTestId("x")
  },
  { name: "PromptInput", render: (v) => <PromptInput variant={v as never} />, pick: () => screen.getByRole("textbox").closest("form") as HTMLElement },
  {
    name: "TabsList",
    render: (v) => (
      <Tabs defaultValue="a">
        <TabsList data-testid="x" variant={v as never}>
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
      </Tabs>
    ),
    pick: () => screen.getByTestId("x")
  },
  { name: "Progress", render: (v) => <Progress data-testid="x" value={40} variant={v as never} />, pick: () => screen.getByTestId("x") },
  { name: "Skeleton", render: (v) => <Skeleton data-testid="x" variant={v as never} />, pick: () => screen.getByTestId("x") },
  { name: "Spinner", render: (v) => <Spinner variant={v as never} />, pick: () => screen.getByRole("status") },
  {
    name: "MorphingTabs",
    render: (v) => <MorphingTabs aria-label="m" items={[{ id: "a", label: "A" }]} variant={v as never} />,
    pick: () => screen.getByRole("tablist")
  }
]

describe("form control default resolution", () => {
  it.each(cases)("$name defaults to glinr with no provider", ({ render: r, pick }) => {
    render(r())
    expect(pick()).toHaveAttribute("data-variant", "glinr")
  })

  it.each(cases)("$name follows style=minimal (plain) and style=glass (glass)", ({ render: r, pick }) => {
    const { unmount } = render(<GlinProvider defaults={{ style: "minimal" }}>{r()}</GlinProvider>)
    expect(pick()).toHaveAttribute("data-variant", "plain")
    unmount()
    render(<GlinProvider defaults={{ style: "glass" }}>{r()}</GlinProvider>)
    expect(pick()).toHaveAttribute("data-variant", "glass")
  })

  it.each(cases)("$name explicit variant wins over the ambient style", ({ render: r, pick }) => {
    render(<GlinProvider defaults={{ style: "glass" }}>{r("solid")}</GlinProvider>)
    expect(pick()).toHaveAttribute("data-variant", "solid")
  })
})

describe("vocabulary variants", () => {
  const names = ["glinr", "solid", "plain", "soft", "outline", "ghost", "glass"] as const
  it.each(names)("Input renders the %s variant", (variant) => {
    render(<Input aria-label="x" variant={variant} />)
    expect(screen.getByLabelText("x")).toHaveAttribute("data-variant", variant)
  })

  it("glinr input is an inset well with a gradient hairline ring", () => {
    render(<Input aria-label="x" />)
    const cls = screen.getByLabelText("x").className
    expect(cls).toContain("--elev-inset")
    expect(cls).toContain("--ring-img")
  })

  it("plain input is flat shadcn: small radius, 1px border", () => {
    render(<Input aria-label="x" variant="plain" />)
    const cls = screen.getByLabelText("x").className
    expect(cls).toContain("rounded-md")
    expect(cls).not.toContain("--ring-img:var(--ring)")
  })

  it("glass input is opt-in and uses the readable glass fill", () => {
    render(<Input aria-label="x" variant="glass" />)
    expect(screen.getByLabelText("x").className).toContain("--glass-readable")
  })

  it("every text variant carries an aria-invalid danger ring and sm/md/lg heights", () => {
    render(
      <>
        <Input aria-label="s" size="sm" />
        <Input aria-label="m" />
        <Input aria-label="l" size="lg" />
      </>
    )
    expect(screen.getByLabelText("s").className).toContain("h-8")
    expect(screen.getByLabelText("m").className).toContain("h-9")
    expect(screen.getByLabelText("l").className).toContain("h-10")
    expect(screen.getByLabelText("m").className).toContain("aria-[invalid=true]:border-[color:var(--tone-danger)]")
  })

  it("aliases: frosted maps to glass, gradient to glinr, default to ambient", () => {
    expect(resolveControlVariant("frosted")).toBe("glass")
    expect(resolveControlVariant("gradient")).toBe("glinr")
    expect(resolveControlVariant("default", "minimal")).toBe("plain")
    expect(resolveControlVariant("liquid", "minimal")).toBe("liquid")
  })

  it("Tabs: keys is still the glinr segmented look and children inherit the list variant", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList variant="keys" data-testid="list">
          <TabsTrigger value="a" data-testid="trigger">A</TabsTrigger>
        </TabsList>
      </Tabs>
    )
    expect(screen.getByTestId("list").className).toContain("rounded-full")
    expect(screen.getByTestId("trigger").className).toContain("rounded-full")
  })

  it("Label stays a plain text label by default and supports chip variants", () => {
    render(
      <>
        <Label>Plain</Label>
        <Label variant="soft">Soft</Label>
      </>
    )
    expect(screen.getByText("Plain").className).not.toContain("px-2")
    expect(screen.getByText("Soft").className).toContain("px-2")
  })
})
