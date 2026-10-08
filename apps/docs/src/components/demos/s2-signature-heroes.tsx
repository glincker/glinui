"use client"

// Hero demos for the signature pages glass-navbar, glass-dock, glass-breadcrumb, morphing-tabs and
// floating-panel, plus the toast pages. Composed product UI; the copyable code is generated from this file
// by scripts/gen-showcase-s2-code.mjs (pnpm showcase:code).

import * as React from "react"
import { ChartLineUp, Chat, FolderSimple, House, Lightning, Trash, UsersThree, Warning, X } from "@phosphor-icons/react/dist/ssr"
import {
  Avatar,
  Badge,
  Button,
  FloatingPanel,
  GlassBreadcrumb,
  GlassDock,
  GlassNavbar,
  Heading,
  MorphingTabs,
  Text,
  Toaster,
  toast
} from "@glinui/ui"

const FEED = [
  { id: "a", title: "Q3 revenue is up 12 percent", meta: "Finance, 2 hours ago" },
  { id: "b", title: "Checkout latency back under 300 ms", meta: "Platform, yesterday" },
  { id: "c", title: "Three teams adopted the new onboarding flow", meta: "Product, Monday" },
  { id: "d", title: "Security review passed for the billing service", meta: "Security, last week" }
]

export function GlassNavbarHero() {
  return (
    <div
      tabIndex={0}
      aria-label="Dashboard preview, scrollable"
      className="mx-auto h-80 w-full max-w-3xl overflow-y-auto rounded-2xl border border-[var(--line-soft)] bg-[linear-gradient(135deg,#6366f1,#ec4899_55%,#f59e0b)] p-3"
    >
      <GlassNavbar aria-label="Workspace" className="rounded-xl px-4">
        <div className="flex h-14 items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-semibold">
            <Lightning aria-hidden="true" />
            Lumen
          </div>
          <nav aria-label="Primary" className="hidden items-center gap-5 text-sm sm:flex">
            <a href="#" aria-current="page" className="font-medium">Overview</a>
            <a href="#" className="text-[var(--color-muted)]">Reports</a>
            <a href="#" className="text-[var(--color-muted)]">Team</a>
          </nav>
          <div className="flex items-center gap-2">
            <Badge tone="accent" size="sm">Pro</Badge>
            <Avatar size="sm" fallback="AK" alt="" />
          </div>
        </div>
      </GlassNavbar>
      <div className="mt-3 grid gap-3">
        {FEED.map((item) => (
          <article key={item.id} className="rounded-xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-4">
            <Heading level={3} size="sm">{item.title}</Heading>
            <Text size="sm" className="mt-1 text-[var(--color-muted)]">{item.meta}</Text>
          </article>
        ))}
      </div>
    </div>
  )
}

export function GlassDockHero() {
  return (
    <div className="mx-auto flex min-h-72 w-full max-w-2xl flex-col justify-between rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-4 [box-shadow:var(--elev-1)]">
      <div className="grid gap-1">
        <Heading level={3} size="sm">Good morning, Ava</Heading>
        <Text size="sm" className="text-[var(--color-muted)]">3 reviews waiting and a standup at 10:30.</Text>
      </div>
      <GlassDock
        aria-label="Applications"
        className="mx-auto"
        items={[
          { id: "home", icon: <House weight="fill" />, label: "Home" },
          { id: "files", icon: <FolderSimple weight="fill" />, label: "Files" },
          { id: "chat", icon: <Chat weight="fill" />, label: "Messages" },
          { id: "team", icon: <UsersThree weight="fill" />, label: "Team" },
          { id: "stats", icon: <ChartLineUp weight="fill" />, label: "Analytics" }
        ]}
      />
    </div>
  )
}

export function GlassBreadcrumbHero() {
  return (
    <div className="mx-auto grid min-h-56 w-full max-w-2xl content-start gap-4 rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-5 [box-shadow:var(--elev-1)]">
      <GlassBreadcrumb
        aria-label="Project location"
        items={[
          { id: "ws", label: "Workspace", href: "#" },
          { id: "proj", label: "Website redesign", href: "#" },
          { id: "files", label: "Assets", href: "#" },
          { id: "img", label: "Hero images", href: "#" },
          { id: "cur", label: "launch-banner.png" }
        ]}
        maxItems={4}
      />
      <div className="flex items-center justify-between gap-3">
        <div>
          <Heading level={3} size="sm">launch-banner.png</Heading>
          <Text size="sm" className="text-[var(--color-muted)]">2.4 MB, edited 3 hours ago by Jon Reyes</Text>
        </div>
        <Button size="sm" variant="outline">Download</Button>
      </div>
    </div>
  )
}

const REPORT_PANELS: Record<string, { title: string; text: string; badge: string }> = {
  overview: { title: "Revenue this month", text: "$48,200 across 312 paid invoices, up 8 percent on last month.", badge: "+8%" },
  customers: { title: "Active customers", text: "1,284 accounts used the product at least once in the last 30 days.", badge: "1,284" },
  invoices: { title: "Open invoices", text: "17 invoices are waiting on payment, 4 of them past their due date.", badge: "17" },
  settings: { title: "Billing settings", text: "Net 30 terms, USD, invoices sent from billing@lumen.test.", badge: "Net 30" }
}

export function MorphingTabsHero() {
  const [active, setActive] = React.useState("overview")
  const panel = REPORT_PANELS[active]
  return (
    <div className="mx-auto grid w-full max-w-xl gap-4 rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-5 [box-shadow:var(--elev-1)]">
      <MorphingTabs
        aria-label="Billing sections"
        activeId={active}
        onTabChange={setActive}
        items={[
          { id: "overview", label: "Overview" },
          { id: "customers", label: "Customers" },
          { id: "invoices", label: "Invoices" },
          { id: "settings", label: "Settings" }
        ]}
      />
      <div role="region" aria-live="polite" className="rounded-xl border border-[var(--line-soft)] p-4">
        <div className="flex items-center justify-between gap-3">
          <Heading level={3} size="sm">{panel.title}</Heading>
          <Badge tone="accent" size="sm">{panel.badge}</Badge>
        </div>
        <Text size="sm" className="mt-2 text-[var(--color-muted)]">{panel.text}</Text>
      </div>
    </div>
  )
}

export function FloatingPanelProductHero() {
  return (
    <div className="relative mx-auto min-h-72 w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-5 [box-shadow:var(--elev-1)]">
      <Heading level={3} size="sm">Homepage draft</Heading>
      <Text size="sm" className="mt-1 max-w-sm text-[var(--color-muted)]">
        Drag the inspector anywhere on the canvas. It keeps its place while you edit the page.
      </Text>
      <div className="mt-4 grid max-w-sm gap-2" aria-hidden="true">
        <div className="h-3 rounded-full bg-[var(--surface-3)]" />
        <div className="h-3 w-4/5 rounded-full bg-[var(--surface-3)]" />
        <div className="h-3 w-3/5 rounded-full bg-[var(--surface-3)]" />
      </div>
      <FloatingPanel closable draggable defaultX={300} defaultY={36} width={240} aria-label="Inspector">
        <div className="grid gap-3 p-4">
          <Heading level={4} size="sm">Inspector</Heading>
          <div className="flex items-center justify-between text-sm">
            <span>Status</span>
            <Badge tone="success" size="sm">Published</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Owner</span>
            <Avatar size="sm" fallback="AK" alt="Ava Kim" />
          </div>
          <Button size="sm">Publish changes</Button>
        </div>
      </FloatingPanel>
    </div>
  )
}

export function ToastSaveHero() {
  const [saves, setSaves] = React.useState(0)
  return (
    <div className="mx-auto grid w-full max-w-md gap-4 rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-5 [box-shadow:var(--elev-1)]">
      <Toaster position="bottom-right" />
      <div>
        <Heading level={3} size="sm">Profile</Heading>
        <Text size="sm" className="mt-1 text-[var(--color-muted)]">Changes to your display name and photo apply across the workspace.</Text>
      </div>
      <div className="flex items-center gap-3">
        <Avatar size="md" fallback="AK" alt="" />
        <div className="grid text-sm">
          <span className="font-medium">Ava Kim</span>
          <span className="text-[var(--color-muted)]">{saves} saves this session</span>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setSaves((n) => n + 1)
            toast.success("Profile saved", {
              description: "Your changes are live for everyone in Lumen.",
              action: {
                label: "Undo",
                onClick: () => {
                  setSaves((n) => Math.max(0, n - 1))
                  toast("Changes reverted")
                }
              }
            })
          }}
        >
          Save changes
        </Button>
      </div>
    </div>
  )
}

export function ToastStackHero() {
  return (
    <div className="mx-auto grid w-full max-w-md gap-4 rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-5 [box-shadow:var(--elev-1)]">
      <Toaster position="bottom-right" closeButton visibleToasts={4} />
      <div>
        <Heading level={3} size="sm">Notification variants</Heading>
        <Text size="sm" className="mt-1 text-[var(--color-muted)]">Fire a few in a row to see them stack and collapse.</Text>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => toast.success("Deploy finished", { description: "lumen-web is live on production." })}>Success</Button>
        <Button size="sm" variant="outline" onClick={() => toast.warning("Storage almost full", { description: "You have used 92 percent of your plan." })}>
          <Warning aria-hidden="true" />
          Warning
        </Button>
        <Button size="sm" variant="outline" onClick={() => toast.error("Payment failed", { description: "Your card ending 4242 was declined." })}>
          <X aria-hidden="true" />
          Error
        </Button>
        <Button size="sm" variant="outline" onClick={() => toast("File deleted", { description: "launch-banner.png moved to trash.", action: { label: "Undo", onClick: () => toast.success("Restored") } })}>
          <Trash aria-hidden="true" />
          With undo
        </Button>
      </div>
    </div>
  )
}
