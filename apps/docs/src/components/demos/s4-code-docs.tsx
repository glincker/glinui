"use client"

// Showcase demos for CodePanel, InstallCommand and BrowserFrame: a docs style page with file tabs and a
// product screenshot assembled from Glin components inside a browser window.

import * as React from "react"
import { ChartLineUp, CreditCard, Gear, House, MagnifyingGlass, Users } from "@phosphor-icons/react"
import { Avatar, Badge, BrowserFrame, Button, CodePanel, Heading, InstallCommand, Tabs, TabsContent, TabsList, TabsTrigger, Text, tokens } from "@glinui/ui"

import type { ComponentExample } from "@/lib/component-docs"

type Part = string | readonly ["k" | "s" | "c" | "f", string]
type CodeLine = readonly Part[]

const LAYOUT_LINES: CodeLine[] = [
  [["k", "import"], " { GlinProvider } ", ["k", "from"], " ", ["s", '"@glinui/ui"']],
  [["k", "import"], " ", ["s", '"@glinui/tokens/styles.css"']],
  [],
  [["k", "export default function"], " ", ["f", "RootLayout"], "({ children }) {"],
  ["  ", ["k", "return"], " ("],
  ['    <html lang="en">'],
  ["      <body>"],
  ["        <GlinProvider>{children}</GlinProvider>"],
  ["      </body>"],
  ["    </html>"],
  ["  )"],
  ["}"]
]

const PAGE_LINES: CodeLine[] = [
  [["k", "import"], " { Button } ", ["k", "from"], " ", ["s", '"@glinui/ui"']],
  [],
  [["k", "export default function"], " ", ["f", "Page"], "() {"],
  ["  ", ["k", "return"], " <Button>Get started</Button>"],
  ["}"]
]

const textOf = (lines: CodeLine[]): string => lines.map((line) => line.map((part) => (typeof part === "string" ? part : part[1])).join("")).join("\n")

const LAYOUT_TEXT = textOf(LAYOUT_LINES)
const PAGE_TEXT = textOf(PAGE_LINES)

function Lines({ lines }: { lines: CodeLine[] }) {
  return (
    <>
      {lines.map((parts, index) => (
        <React.Fragment key={index}>
          {tokens(...parts)}
          {index < lines.length - 1 ? "\n" : null}
        </React.Fragment>
      ))}
    </>
  )
}

const PAGE_WRAP = "flex w-full max-w-3xl flex-col gap-6 text-left"

function StepHeading({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span aria-hidden className="flex size-6 items-center justify-center rounded-full bg-[var(--surface-3)] text-xs font-semibold text-[var(--color-foreground)]">{n}</span>
      <Heading level={3} size="sm">{children}</Heading>
    </div>
  )
}

/** Quick start docs page: install tabs, then a two file CodePanel with a filename tab per file. */
function QuickStart() {
  const [file, setFile] = React.useState("layout")
  return (
    <article className={PAGE_WRAP}>
      <div className="flex flex-col gap-2">
        <Text variant="eyebrow">Getting started</Text>
        <Heading level={1} size="h2">Add Glin UI to a Next.js app</Heading>
        <Text variant="muted">Two packages, one import and your first component. It takes about two minutes.</Text>
      </div>
      <section className="flex flex-col gap-3" aria-label="Install">
        <StepHeading n={1}>Install the packages</StepHeading>
        <InstallCommand packageName="@glinui/ui @glinui/tokens" title="Terminal" />
      </section>
      <section className="flex flex-col gap-3" aria-label="Configure">
        <StepHeading n={2}>Wrap your app and use a component</StepHeading>
        <Tabs value={file} onValueChange={setFile} asChild>
          <div>
            <CodePanel
              title="app/"
              codeLabel="Example source"
              copyValue={file === "layout" ? LAYOUT_TEXT : PAGE_TEXT}
              tabs={
                <TabsList variant="keys" size="sm" aria-label="Files">
                  <TabsTrigger value="layout" variant="keys" size="sm">layout.tsx</TabsTrigger>
                  <TabsTrigger value="page" variant="keys" size="sm">page.tsx</TabsTrigger>
                </TabsList>
              }
            >
              <TabsContent value="layout" variant="keys" className="mt-0 p-0" asChild><span><Lines lines={LAYOUT_LINES} /></span></TabsContent>
              <TabsContent value="page" variant="keys" className="mt-0 p-0" asChild><span><Lines lines={PAGE_LINES} /></span></TabsContent>
            </CodePanel>
          </div>
        </Tabs>
      </section>
    </article>
  )
}

const quickStartCode = `"use client"

import { Fragment, useState } from "react"
import { CodePanel, Heading, InstallCommand, Tabs, TabsContent, TabsList, TabsTrigger, Text, tokens } from "@glinui/ui"

type Part = string | readonly ["k" | "s" | "c" | "f", string]

const layoutLines: Array<readonly Part[]> = ${JSON.stringify(LAYOUT_LINES)}

const pageLines: Array<readonly Part[]> = ${JSON.stringify(PAGE_LINES)}

const textOf = (lines: Array<readonly Part[]>) =>
  lines.map((line) => line.map((part) => (typeof part === "string" ? part : part[1])).join("")).join("\\n")

function Lines({ lines }: { lines: Array<readonly Part[]> }) {
  return (
    <>
      {lines.map((parts, index) => (
        <Fragment key={index}>
          {tokens(...parts)}
          {index < lines.length - 1 ? "\\n" : null}
        </Fragment>
      ))}
    </>
  )
}

export function QuickStart() {
  const [file, setFile] = useState("layout")
  return (
    <article className="${PAGE_WRAP}">
      <div className="flex flex-col gap-2">
        <Text variant="eyebrow">Getting started</Text>
        <Heading level={1} size="h2">Add Glin UI to a Next.js app</Heading>
        <Text variant="muted">Two packages, one import and your first component. It takes about two minutes.</Text>
      </div>
      <Heading level={3} size="sm">1. Install the packages</Heading>
      <InstallCommand packageName="@glinui/ui @glinui/tokens" title="Terminal" />
      <Heading level={3} size="sm">2. Wrap your app and use a component</Heading>
      <Tabs value={file} onValueChange={setFile} asChild>
        <div>
          <CodePanel
            title="app/"
            codeLabel="Example source"
            copyValue={textOf(file === "layout" ? layoutLines : pageLines)}
            tabs={
              <TabsList variant="keys" size="sm" aria-label="Files">
                <TabsTrigger value="layout" variant="keys" size="sm">layout.tsx</TabsTrigger>
                <TabsTrigger value="page" variant="keys" size="sm">page.tsx</TabsTrigger>
              </TabsList>
            }
          >
            <TabsContent value="layout" variant="keys" className="mt-0 p-0" asChild>
              <span><Lines lines={layoutLines} /></span>
            </TabsContent>
            <TabsContent value="page" variant="keys" className="mt-0 p-0" asChild>
              <span><Lines lines={pageLines} /></span>
            </TabsContent>
          </CodePanel>
        </div>
      </Tabs>
    </article>
  )
}`

function PanelVariants() {
  const items: Array<{ variant: "glinr" | "plain" | "outline"; name: string }> = [
    { variant: "glinr", name: "glinr" },
    { variant: "plain", name: "plain" },
    { variant: "outline", name: "outline" }
  ]
  return (
    <div className="grid w-full gap-4 md:grid-cols-3">
      {items.map((item) => (
        <CodePanel key={item.name} variant={item.variant} title={`${item.name}.ts`} copyValue={'const retries = 3'} codeLabel={`${item.name} sample`}>
          {tokens(["k", "const"], " retries = ", ["f", "3"], "\n", ["c", "// 4xx errors never retry"])}
        </CodePanel>
      ))}
    </div>
  )
}

const panelVariantsCode = `import { CodePanel, tokens } from "@glinui/ui"

const variants = ["glinr", "plain", "outline"] as const

export function PanelVariants() {
  return (
    <div className="grid w-full gap-4 md:grid-cols-3">
      {variants.map((variant) => (
        <CodePanel key={variant} variant={variant} title={\`\${variant}.ts\`} copyValue="const retries = 3" codeLabel={\`\${variant} sample\`}>
          {tokens(["k", "const"], " retries = ", ["f", "3"], "\\n", ["c", "// 4xx errors never retry"])}
        </CodePanel>
      ))}
    </div>
  )
}`

function CommandLayout() {
  return (
    <article className="flex w-full max-w-2xl flex-col gap-4 text-left">
      <Heading level={2} size="sm">Install the CLI</Heading>
      <Text variant="muted">Pick your package manager. The command is copied exactly as shown.</Text>
      <InstallCommand packageName="@acme/cli" title="Terminal" />
      <Text variant="muted">Or add a single component with the registry command.</Text>
      <InstallCommand
        title="Registry"
        commands={{
          pnpm: "pnpm dlx @glinui/cli@latest add button",
          npm: "npx @glinui/cli@latest add button",
          bun: "bunx @glinui/cli@latest add button"
        }}
      />
    </article>
  )
}

const commandLayoutCode = `import { Heading, InstallCommand, Text } from "@glinui/ui"

export function InstallDocs() {
  return (
    <article className="flex w-full max-w-2xl flex-col gap-4 text-left">
      <Heading level={2} size="sm">Install the CLI</Heading>
      <Text variant="muted">Pick your package manager. The command is copied exactly as shown.</Text>
      <InstallCommand packageName="@acme/cli" title="Terminal" />
      <Text variant="muted">Or add a single component with the registry command.</Text>
      <InstallCommand
        title="Registry"
        commands={{
          pnpm: "pnpm dlx @glinui/cli@latest add button",
          npm: "npx @glinui/cli@latest add button",
          bun: "bunx @glinui/cli@latest add button"
        }}
      />
    </article>
  )
}`

function CommandVariants() {
  return (
    <div className="grid w-full gap-4 md:grid-cols-2">
      <InstallCommand packageName="zod" variant="glinr" title="glinr" />
      <InstallCommand packageName="zod" variant="plain" title="plain" />
    </div>
  )
}

const commandVariantsCode = `import { InstallCommand } from "@glinui/ui"

export function InstallVariants() {
  return (
    <div className="grid w-full gap-4 md:grid-cols-2">
      <InstallCommand packageName="zod" variant="glinr" title="glinr" />
      <InstallCommand packageName="zod" variant="plain" title="plain" />
    </div>
  )
}`

/* ---------------------------------------------------------------- BrowserFrame */

const NAV = [
  { label: "Overview", icon: House, active: false },
  { label: "Billing", icon: CreditCard, active: true },
  { label: "Customers", icon: Users, active: false },
  { label: "Reports", icon: ChartLineUp, active: false },
  { label: "Settings", icon: Gear, active: false }
]

const INVOICES = [
  { id: "INV-2041", name: "Hollis Design", amount: "$2,400.00", status: "Paid", tone: "success" as const },
  { id: "INV-2040", name: "Brightline Labs", amount: "$890.00", status: "Pending", tone: "warning" as const },
  { id: "INV-2039", name: "Coastal Freight", amount: "$12,750.00", status: "Overdue", tone: "danger" as const }
]

const SCREEN_GRID = "grid min-h-[22rem] grid-cols-[3rem_1fr] sm:grid-cols-[10rem_1fr]"

/** A billing dashboard drawn with Glin components, used as the "screenshot" inside the frame. */
function BillingScreen() {
  return (
    <div className={SCREEN_GRID}>
      <nav aria-label="Product" className="flex flex-col gap-1 border-e border-[var(--line-soft)] bg-[var(--surface-1)] p-2 sm:p-3">
        {NAV.map((item) => (
          <span key={item.label} className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${item.active ? "bg-[var(--surface-3)] font-medium text-[var(--color-foreground)]" : "text-[var(--color-muted)]"}`}>
            <item.icon aria-hidden className="size-4 shrink-0" />
            <span className="hidden sm:inline">{item.label}</span>
          </span>
        ))}
      </nav>
      <div className="flex min-w-0 flex-col gap-4 p-4 text-left sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Heading level={2} size="sm">Billing</Heading>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-lg border border-[var(--line-soft)] px-2.5 py-1.5 text-xs text-[var(--color-muted)] sm:flex"><MagnifyingGlass aria-hidden className="size-3.5" />Search invoices</span>
            <Button size="sm">New invoice</Button>
            <Avatar fallback="MK" size="sm" />
          </div>
        </div>
        <dl className="grid grid-cols-3 gap-2 sm:gap-3">
          {[["Collected", "$48.2k"], ["Outstanding", "$13.6k"], ["Overdue", "$12.8k"]].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-3">
              <dt className="text-xs text-[var(--color-muted)]">{label}</dt>
              <dd className="mt-1 text-base font-semibold tabular-nums text-[var(--color-foreground)] sm:text-lg">{value}</dd>
            </div>
          ))}
        </dl>
        <ul className="divide-y divide-[var(--line-soft)] rounded-xl border border-[var(--line-soft)]">
          {INVOICES.map((invoice) => (
            <li key={invoice.id} className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm">
              <span className="flex min-w-0 flex-col">
                <span className="truncate font-medium text-[var(--color-foreground)]">{invoice.name}</span>
                <span className="text-xs text-[var(--color-muted)]">{invoice.id}</span>
              </span>
              <span className="flex items-center gap-3">
                <span className="hidden tabular-nums text-[var(--color-foreground)] sm:inline">{invoice.amount}</span>
                <Badge tone={invoice.tone} variant="soft">{invoice.status}</Badge>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const billingScreenCode = `import { ChartLineUp, CreditCard, Gear, House, MagnifyingGlass, Users } from "@phosphor-icons/react"
import { Avatar, Badge, BrowserFrame, Button, Heading } from "@glinui/ui"

const nav = [
  { label: "Overview", icon: House, active: false },
  { label: "Billing", icon: CreditCard, active: true },
  { label: "Customers", icon: Users, active: false },
  { label: "Reports", icon: ChartLineUp, active: false },
  { label: "Settings", icon: Gear, active: false }
]

const invoices = [
  { id: "INV-2041", name: "Hollis Design", amount: "$2,400.00", status: "Paid", tone: "success" },
  { id: "INV-2040", name: "Brightline Labs", amount: "$890.00", status: "Pending", tone: "warning" },
  { id: "INV-2039", name: "Coastal Freight", amount: "$12,750.00", status: "Overdue", tone: "danger" }
] as const

export function ProductShot() {
  return (
    <BrowserFrame url="app.northwind.dev/billing" className="w-full max-w-4xl">
      <div className="${SCREEN_GRID}">
        <nav aria-label="Product" className="flex flex-col gap-1 border-e border-[var(--line-soft)] bg-[var(--surface-1)] p-2 sm:p-3">
          {nav.map((item) => (
            <span key={item.label} className={\`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm \${item.active ? "bg-[var(--surface-3)] font-medium text-[var(--color-foreground)]" : "text-[var(--color-muted)]"}\`}>
              <item.icon aria-hidden className="size-4 shrink-0" />
              <span className="hidden sm:inline">{item.label}</span>
            </span>
          ))}
        </nav>
        <div className="flex min-w-0 flex-col gap-4 p-4 text-left sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Heading level={2} size="sm">Billing</Heading>
            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-2 rounded-lg border border-[var(--line-soft)] px-2.5 py-1.5 text-xs text-[var(--color-muted)] sm:flex"><MagnifyingGlass aria-hidden className="size-3.5" />Search invoices</span>
              <Button size="sm">New invoice</Button>
              <Avatar fallback="MK" size="sm" />
            </div>
          </div>
          <dl className="grid grid-cols-3 gap-2 sm:gap-3">
            {[["Collected", "$48.2k"], ["Outstanding", "$13.6k"], ["Overdue", "$12.8k"]].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-3">
                <dt className="text-xs text-[var(--color-muted)]">{label}</dt>
                <dd className="mt-1 text-base font-semibold tabular-nums text-[var(--color-foreground)] sm:text-lg">{value}</dd>
              </div>
            ))}
          </dl>
          <ul className="divide-y divide-[var(--line-soft)] rounded-xl border border-[var(--line-soft)]">
            {invoices.map((invoice) => (
              <li key={invoice.id} className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm">
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-medium text-[var(--color-foreground)]">{invoice.name}</span>
                  <span className="text-xs text-[var(--color-muted)]">{invoice.id}</span>
                </span>
                <span className="flex items-center gap-3">
                  <span className="hidden tabular-nums text-[var(--color-foreground)] sm:inline">{invoice.amount}</span>
                  <Badge tone={invoice.tone} variant="soft">{invoice.status}</Badge>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </BrowserFrame>
  )
}`

function FrameHero() {
  return (
    <BrowserFrame url="app.northwind.dev/billing" className="w-full max-w-4xl">
      <BillingScreen />
    </BrowserFrame>
  )
}

function FrameModes() {
  return (
    <div className="grid w-full gap-4 md:grid-cols-2">
      <BrowserFrame url="northwind.dev/pricing" frameLabel="Pricing page">
        <div className="flex flex-col gap-2 p-5 text-left">
          <Badge tone="accent" variant="soft" className="self-start">Pro</Badge>
          <p className="text-3xl font-semibold tabular-nums text-[var(--color-foreground)]">$24 <span className="text-sm font-normal text-[var(--color-muted)]">/ seat</span></p>
          <Text size="sm" variant="muted">Unlimited projects and priority support.</Text>
          <Button size="sm" className="mt-1 self-start">Start trial</Button>
        </div>
      </BrowserFrame>
      <BrowserFrame mode="simple" title="Release notes" frameLabel="Release notes window">
        <div className="flex flex-col gap-2 p-5 text-left">
          <Heading level={3} size="sm">Version 4.2</Heading>
          <Text size="sm" variant="muted">Scheduled exports now follow the workspace timezone.</Text>
          <Text size="sm" variant="muted">Audit log retention is 400 days on every plan.</Text>
        </div>
      </BrowserFrame>
    </div>
  )
}

const frameModesCode = `import { Badge, BrowserFrame, Button, Heading, Text } from "@glinui/ui"

export function FrameModes() {
  return (
    <div className="grid w-full gap-4 md:grid-cols-2">
      <BrowserFrame url="northwind.dev/pricing" frameLabel="Pricing page">
        <div className="flex flex-col gap-2 p-5 text-left">
          <Badge tone="accent" variant="soft" className="self-start">Pro</Badge>
          <p className="text-3xl font-semibold tabular-nums text-[var(--color-foreground)]">$24 <span className="text-sm font-normal text-[var(--color-muted)]">/ seat</span></p>
          <Text size="sm" variant="muted">Unlimited projects and priority support.</Text>
          <Button size="sm" className="mt-1 self-start">Start trial</Button>
        </div>
      </BrowserFrame>
      <BrowserFrame mode="simple" title="Release notes" frameLabel="Release notes window">
        <div className="flex flex-col gap-2 p-5 text-left">
          <Heading level={3} size="sm">Version 4.2</Heading>
          <Text size="sm" variant="muted">Scheduled exports now follow the workspace timezone.</Text>
          <Text size="sm" variant="muted">Audit log retention is 400 days on every plan.</Text>
        </div>
      </BrowserFrame>
    </div>
  )
}`

function FrameLanding() {
  return (
    <section aria-label="Product tour" className="flex w-full flex-col items-center gap-8 lg:flex-row lg:gap-10">
      <div className="flex max-w-sm flex-col gap-4 text-left">
        <Badge tone="accent" variant="soft" className="self-start">Billing</Badge>
        <Heading level={2} size="h2">Invoices that chase themselves</Heading>
        <Text variant="muted">Send, track and remind from one screen. Overdue invoices escalate on a schedule you control.</Text>
        <div className="flex gap-3"><Button>Try it free</Button><Button variant="outline">See pricing</Button></div>
      </div>
      <BrowserFrame url="app.northwind.dev/billing" className="w-full max-w-xl">
        <BillingScreen />
      </BrowserFrame>
    </section>
  )
}

const frameLandingCode = `import { Badge, BrowserFrame, Button, Heading, Text } from "@glinui/ui"

export function ProductTour() {
  return (
    <section aria-label="Product tour" className="flex w-full flex-col items-center gap-8 lg:flex-row lg:gap-10">
      <div className="flex max-w-sm flex-col gap-4 text-left">
        <Badge tone="accent" variant="soft" className="self-start">Billing</Badge>
        <Heading level={2} size="h2">Invoices that chase themselves</Heading>
        <Text variant="muted">Send, track and remind from one screen. Overdue invoices escalate on a schedule you control.</Text>
        <div className="flex gap-3"><Button>Try it free</Button><Button variant="outline">See pricing</Button></div>
      </div>
      <BrowserFrame url="app.northwind.dev/billing" className="w-full max-w-xl">
        {/* The billing screen from the first example */}
      </BrowserFrame>
    </section>
  )
}`

const ex = (title: string, description: string, code: string, render: React.ReactNode): ComponentExample => ({ title, description, code, render })

export const codeDocsExamples: Record<string, ComponentExample[]> = {
  "code-panel": [
    ex("Docs quick start", "A docs page step: install tabs, then a CodePanel whose header tabs switch between filenames. Copy always matches the visible file.", quickStartCode, <QuickStart />),
    ex("Variants", "Glinr raised panel, plain flat block and outline, each with a filename title and copy button.", panelVariantsCode, <PanelVariants />)
  ],
  "install-command": [
    ex("Install page", "Package manager tabs for a package, plus a custom command map for a registry add.", commandLayoutCode, <CommandLayout />),
    ex("Variants", "Surface variants of the underlying CodePanel.", commandVariantsCode, <CommandVariants />)
  ],
  "browser-frame": [
    ex("Product screenshot", "A billing dashboard built from Glin components fills the frame. Nothing is an image, so it stays sharp and themed.", billingScreenCode, <FrameHero />),
    ex("Address bar and simple mode", "Default shows the address bar, simple shows a centered window title.", frameModesCode, <FrameModes />),
    ex("In a landing section", "Copy on one side and the framed product on the other, collapsing to a column on small screens.", frameLandingCode, <FrameLanding />)
  ]
}
