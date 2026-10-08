"use client"

// Showcase demos for the Buttons category. Each exported function is a self-contained,
// copy-pasteable example: the docs code strings are generated from these sources
// (see src/lib/showcase-s1-code.ts), so keep every demo free of local helpers.

import { useEffect, useRef, useState } from "react"
import {
  ArrowRight,
  BellRinging,
  Check,
  DownloadSimple,
  FloppyDisk,
  Lightning,
  Minus,
  Plus,
  Rocket,
  ShoppingCart,
  Sparkle,
  TextAlignCenter,
  TextAlignLeft,
  TextAlignRight,
  TextB,
  TextItalic,
  TextUnderline,
  Trash,
  Broadcast,
  Funnel,
  Cloud,
  Palette,
  Moon,
  WifiHigh,
  Bluetooth,
  Airplane
} from "@phosphor-icons/react/dist/ssr"
import {
  Badge,
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CopyButton,
  GenerateButton,
  GlassToggle,
  InteractiveHoverButton,
  LiquidButton,
  MagneticCTA,
  Progress,
  PulsatingButton,
  RippleButton,
  ShimmerButton,
  Toggle,
  ToggleGroup,
  ToggleGroupItem
} from "@glinui/ui"

/* Button ---------------------------------------------------------------- */

export function ButtonActionBar() {
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle")
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  function save() {
    setState("saving")
    timer.current = setTimeout(() => setState("saved"), 1400)
  }

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Release notes for v2.4</CardTitle>
          <Badge tone={state === "saved" ? "success" : "warning"} variant="soft" dot>
            {state === "saved" ? "Saved" : "Unsaved changes"}
          </Badge>
        </div>
        <CardDescription>Edited a few minutes ago by Maya Chen. Changes apply to the public changelog.</CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="soft" tone="danger" leadingIcon={<Trash weight="bold" />}>
          Delete draft
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => setState("idle")}>
            Cancel
          </Button>
          <Button
            variant="solid"
            tone="accent"
            loading={state === "saving"}
            leadingIcon={state === "saved" ? <Check weight="bold" /> : <FloppyDisk weight="bold" />}
            onClick={save}
          >
            {state === "saving" ? "Saving" : state === "saved" ? "Saved" : "Save changes"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export function ButtonStatesDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-5">
      <div className="flex flex-wrap items-end gap-3">
        <Button size="xs">Extra small</Button>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" variant="outline" aria-label="Add a member">
          <Plus weight="bold" />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="solid" tone="accent" leadingIcon={<Plus weight="bold" />}>
          New project
        </Button>
        <Button variant="outline" trailingIcon={<ArrowRight weight="bold" />} iconNudge>
          Continue
        </Button>
        <Button variant="solid" tone="accent" loading>
          Publishing
        </Button>
        <Button variant="outline" loading>
          Syncing
        </Button>
        <Button disabled>Unavailable</Button>
        <Button variant="solid" tone="danger" disabled>
          Delete
        </Button>
      </div>
    </div>
  )
}

export function ButtonPageHeader() {
  return (
    <Card className="w-full max-w-3xl">
      <CardContent className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-foreground">Invoices</h3>
          <p className="text-sm text-[var(--color-muted)]">48 invoices this quarter, 3 overdue.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" leadingIcon={<Funnel weight="bold" />}>
            Filter
          </Button>
          <Button variant="outline" leadingIcon={<DownloadSimple weight="bold" />}>
            Export CSV
          </Button>
          <Button variant="solid" tone="accent" leadingIcon={<Plus weight="bold" />}>
            New invoice
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

/* Signature buttons ----------------------------------------------------- */

export function ShimmerPricing() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Pro</CardTitle>
          <Badge tone="accent" variant="soft">Most popular</Badge>
        </div>
        <CardDescription>For teams shipping weekly.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-foreground">
          <span className="text-4xl font-semibold tracking-tight">$24</span>
          <span className="text-sm text-[var(--color-muted)]"> per seat, per month</span>
        </p>
        <ul className="space-y-2 text-sm text-[var(--color-muted)]">
          <li className="flex items-center gap-2"><Check weight="bold" className="size-4 text-[color:var(--tone-success-text)]" />Unlimited projects</li>
          <li className="flex items-center gap-2"><Check weight="bold" className="size-4 text-[color:var(--tone-success-text)]" />Audit log and SSO</li>
          <li className="flex items-center gap-2"><Check weight="bold" className="size-4 text-[color:var(--tone-success-text)]" />Priority support</li>
        </ul>
        <ShimmerButton className="w-full" trailingIcon={<ArrowRight weight="bold" />}>
          Start 14 day trial
        </ShimmerButton>
      </CardContent>
    </Card>
  )
}

export function RippleAddToCart() {
  const [count, setCount] = useState(0)
  return (
    <Card className="w-full max-w-sm">
      <CardContent className="flex items-center gap-4">
        <div
          aria-hidden
          className="grid size-16 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-sky-400 text-white"
        >
          <Lightning weight="fill" className="size-7" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground">Studio keyboard, 75%</p>
          <p className="text-sm text-[var(--color-muted)]">$129.00, ships in 2 days</p>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-3">
        <span className="text-sm text-[var(--color-muted)]" aria-live="polite">
          {count === 0 ? "Your cart is empty" : `${count} in your cart`}
        </span>
        <RippleButton leadingIcon={<ShoppingCart weight="bold" />} onClick={() => setCount((value) => value + 1)}>
          Add to cart
        </RippleButton>
      </CardFooter>
    </Card>
  )
}

export function PulsatingGoLive() {
  const [live, setLive] = useState(false)
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Friday product demo</CardTitle>
          <Badge tone={live ? "danger" : "neutral"} variant="soft" dot>
            {live ? "On air" : "Offline"}
          </Badge>
        </div>
        <CardDescription>Camera and microphone are ready. 128 people are waiting in the lobby.</CardDescription>
      </CardHeader>
      <CardFooter>
        {live ? (
          <Button variant="outline" tone="danger" className="w-full" onClick={() => setLive(false)}>
            End broadcast
          </Button>
        ) : (
          <PulsatingButton className="w-full" leadingIcon={<Broadcast weight="bold" />} onClick={() => setLive(true)}>
            Go live
          </PulsatingButton>
        )}
      </CardFooter>
    </Card>
  )
}

export function LiquidUpgrade() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Cloud weight="duotone" className="size-5 text-[var(--color-accent)]" />
          <CardTitle>Storage almost full</CardTitle>
        </div>
        <CardDescription>You have used 18.6 GB of your 20 GB plan.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={93} aria-label="Storage used" />
        <LiquidButton className="w-full" leadingIcon={<Rocket weight="bold" />}>
          Upgrade to 200 GB
        </LiquidButton>
      </CardContent>
    </Card>
  )
}

export function MagneticHero() {
  return (
    <section aria-label="Launch announcement" className="flex w-full max-w-xl flex-col items-center gap-5 py-6 text-center">
      <Badge tone="accent" variant="soft">New: scheduled deploys</Badge>
      <h3 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Ship on your own schedule</h3>
      <p className="max-w-md text-sm text-[var(--color-muted)]">
        Queue a release for Tuesday morning and let the pipeline handle the rest. Rollbacks stay one click away.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <MagneticCTA size="lg" variant="solid" tone="accent" trailingIcon={<ArrowRight weight="bold" />}>
          Book a demo
        </MagneticCTA>
        <Button size="lg" variant="ghost">
          Read the changelog
        </Button>
      </div>
    </section>
  )
}

export function HoverButtonCta() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Join the beta</CardTitle>
        <CardDescription>Early access to the new analytics workspace. Hover or focus the button to see it fill.</CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-[var(--color-muted)]">1,240 teams already in</span>
        <InteractiveHoverButton>Request access</InteractiveHoverButton>
      </CardFooter>
    </Card>
  )
}

export function GenerateCompose() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Product description</CardTitle>
        <CardDescription>Draft copy for the Studio keyboard from its spec sheet. Press the button to start and again to stop.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border/60 p-3 text-sm text-[var(--color-muted)]">
          75% layout, gasket mount, hot-swap switches, USB-C and Bluetooth, aluminum case in three finishes.
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-3">
        <span className="text-sm text-[var(--color-muted)]">Uses 1 credit</span>
        <GenerateButton label="Generate copy" generatingLabel="Writing" leadingIcon={<Sparkle weight="fill" />} />
      </CardFooter>
    </Card>
  )
}

/* Button group ---------------------------------------------------------- */

export function ButtonGroupToolbar() {
  const [range, setRange] = useState("week")
  return (
    <Card className="w-full max-w-xl">
      <CardContent className="flex flex-wrap items-center justify-between gap-3">
        <ButtonGroup aria-label="Time range">
          {["day", "week", "month"].map((value) => (
            <Button
              key={value}
              variant={range === value ? "solid" : "outline"}
              aria-pressed={range === value}
              onClick={() => setRange(value)}
            >
              {value === "day" ? "Day" : value === "week" ? "Week" : "Month"}
            </Button>
          ))}
        </ButtonGroup>
        <ButtonGroup aria-label="Pull request actions" variant="outline">
          <Button leadingIcon={<Check weight="bold" />}>Merge pull request</Button>
          <ButtonGroupSeparator />
          <Button size="icon" aria-label="More merge options">
            <ArrowRight weight="bold" className="rotate-90" />
          </Button>
        </ButtonGroup>
      </CardContent>
    </Card>
  )
}

/* Copy button ----------------------------------------------------------- */

export function CopyApiKey() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>API key</CardTitle>
        <CardDescription>Use this key to authenticate server requests. Treat it like a password.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-[var(--surface-1)] px-3 py-2">
          <code className="truncate font-mono text-sm text-foreground">glin_live_4f9a7c21b6e8</code>
          <CopyButton value="glin_live_4f9a7c21b6e8" variant="outline" size="sm" label="Copy key" copiedLabel="Copied" />
        </div>
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-[var(--surface-1)] px-3 py-2">
          <code className="truncate font-mono text-sm text-foreground">pnpm add @glinui/ui</code>
          <CopyButton value="pnpm add @glinui/ui" variant="ghost" size="icon" iconOnly label="Copy install command" />
        </div>
      </CardContent>
    </Card>
  )
}

/* Toggle ---------------------------------------------------------------- */

export function ToggleEditorToolbar() {
  return (
    <Card className="w-full max-w-lg">
      <CardContent className="space-y-4">
        <div role="toolbar" aria-label="Text formatting" className="flex flex-wrap items-center gap-2">
          <ToggleGroup type="multiple" defaultValue={["bold", "italic"]} aria-label="Text style">
            <ToggleGroupItem value="bold" aria-label="Bold"><TextB weight="bold" /></ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic"><TextItalic weight="bold" /></ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline"><TextUnderline weight="bold" /></ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup type="single" defaultValue="left" aria-label="Alignment">
            <ToggleGroupItem value="left" aria-label="Align left"><TextAlignLeft /></ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="Align center"><TextAlignCenter /></ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label="Align right"><TextAlignRight /></ToggleGroupItem>
          </ToggleGroup>
          <Toggle aria-label="Notify subscribers" defaultPressed variant="soft">
            <BellRinging weight="bold" />
          </Toggle>
        </div>
        <p className="rounded-lg border border-border/60 bg-[var(--surface-1)] p-3 text-sm text-foreground">
          Weekly digest: three launches, one deprecation and a new way to schedule deploys.
        </p>
      </CardContent>
    </Card>
  )
}

export function ToggleViewSwitcher() {
  const [view, setView] = useState("list")
  const rows = ["Atlas redesign", "Billing migration", "Mobile onboarding"]
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Projects</CardTitle>
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(next) => next && setView(next)}
            aria-label="Layout"
            size="sm"
          >
            <ToggleGroupItem value="list">List</ToggleGroupItem>
            <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        <ul className={view === "grid" ? "grid grid-cols-3 gap-2" : "grid gap-2"}>
          {rows.map((row) => (
            <li key={row} className="rounded-lg border border-border/60 bg-[var(--surface-1)] px-3 py-2 text-sm text-foreground">
              {row}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export function ToggleStepper() {
  const [qty, setQty] = useState(2)
  return (
    <ButtonGroup aria-label="Quantity" variant="outline">
      <Button size="icon" aria-label="Decrease quantity" onClick={() => setQty((value) => Math.max(1, value - 1))}>
        <Minus weight="bold" />
      </Button>
      <Button aria-live="polite" tabIndex={-1} className="min-w-12 tabular-nums">{qty}</Button>
      <Button size="icon" aria-label="Increase quantity" onClick={() => setQty((value) => value + 1)}>
        <Plus weight="bold" />
      </Button>
    </ButtonGroup>
  )
}

/* Glass toggle ---------------------------------------------------------- */

export function GlassQuickSettings() {
  return (
    <section
      aria-label="Quick settings"
      className="w-full max-w-xs space-y-1 rounded-2xl border border-white/25 bg-white/10 p-2 text-white backdrop-blur-xl"
    >
      {[
        { id: "wifi", label: "Wi-Fi", note: "Studio-5G", icon: WifiHigh, on: true },
        { id: "bt", label: "Bluetooth", note: "2 devices", icon: Bluetooth, on: true },
        { id: "dnd", label: "Focus", note: "Until 5 PM", icon: Moon, on: false },
        { id: "air", label: "Airplane mode", note: "Off", icon: Airplane, on: false },
        { id: "theme", label: "Night shift", note: "Warm tone", icon: Palette, on: true }
      ].map(({ id, label, note, icon: Icon, on }) => (
        <div key={id} className="flex items-center gap-3 rounded-xl px-3 py-2.5">
          <Icon weight="bold" className="size-5 shrink-0" aria-hidden />
          <label htmlFor={`gt-${id}`} className="min-w-0 flex-1">
            <span className="block text-sm font-medium">{label}</span>
            <span className="block text-xs text-white/80">{note}</span>
          </label>
          <GlassToggle id={`gt-${id}`} defaultChecked={on} />
        </div>
      ))}
    </section>
  )
}
