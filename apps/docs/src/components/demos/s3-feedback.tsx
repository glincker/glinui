"use client"

// Showcase demos for the feedback family: alert, progress, skeleton, spinner, status-dot, empty.
// Each `// @demo` block is extracted verbatim into the code string shown on the docs page
// (see scripts/gen-s3-code.mjs), so keep blocks free of docs-only helpers.

import { useEffect, useState } from "react"
import {
  ArrowClockwise,
  CheckCircle,
  CloudArrowUp,
  File,
  FileArchive,
  MagnifyingGlass,
  Plus,
  Tray,
  X
} from "@phosphor-icons/react/dist/ssr"
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  IconFrame,
  Progress,
  ProgressCircle,
  Separator,
  Skeleton,
  Spinner,
  StatusDot
} from "@glinui/ui"

// @demo
export function AlertBannersDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <Alert tone="info">
        <AlertTitle>Version 2.4 is available</AlertTitle>
        <AlertDescription>Adds scheduled exports and fixes two sync bugs.</AlertDescription>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm">Update now</Button>
          <Button size="sm" variant="ghost">Release notes</Button>
        </div>
      </Alert>
      <Alert tone="success">
        <AlertTitle>Invoice INV-2041 paid</AlertTitle>
        <AlertDescription>Northwind Studio paid $1,240.00 by card.</AlertDescription>
      </Alert>
      <Alert tone="warning">
        <AlertTitle>92 percent of build minutes used</AlertTitle>
        <AlertDescription>Builds pause at 100 percent. The quota resets on Nov 1.</AlertDescription>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" variant="outline">Upgrade plan</Button>
        </div>
      </Alert>
      <Alert tone="danger">
        <AlertTitle>Deploy to production failed</AlertTitle>
        <AlertDescription>Migration 0042 timed out after 60 seconds. The previous release is still live.</AlertDescription>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" variant="outline">View logs</Button>
          <Button size="sm" variant="ghost">Retry</Button>
        </div>
      </Alert>
    </div>
  )
}

// @demo
export function AlertDismissDemo() {
  const [open, setOpen] = useState(true)
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      {open ? (
        <Alert tone="accent" icon>
          <AlertTitle>Invite your team</AlertTitle>
          <AlertDescription>Projects with two or more members ship twice as often.</AlertDescription>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm">Invite teammates</Button>
            <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>Dismiss</Button>
          </div>
        </Alert>
      ) : (
        <Button variant="outline" size="sm" className="w-fit" onClick={() => setOpen(true)}>
          <ArrowClockwise aria-hidden className="size-4" />
          Show banner again
        </Button>
      )}
      <Alert variant="note">
        <AlertTitle>Note</AlertTitle>
        <AlertDescription>Quiet aside for tips that do not need a tone.</AlertDescription>
      </Alert>
      <Alert variant="flag">
        <AlertTitle>Flag</AlertTitle>
        <AlertDescription>Brand-colored callout for launches and announcements.</AlertDescription>
      </Alert>
    </div>
  )
}

// @demo
export function AlertLayoutDemo() {
  return (
    <section aria-label="Billing settings" className="flex w-full max-w-xl flex-col gap-4">
      <Alert tone="warning">
        <AlertTitle>Your card expires next month</AlertTitle>
        <AlertDescription>Update it before Nov 1 to avoid a failed renewal.</AlertDescription>
        <div className="mt-3">
          <Button size="sm" variant="outline">Update card</Button>
        </div>
      </Alert>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Team plan</CardTitle>
            <Badge tone="success" variant="soft" dot>Active</Badge>
          </div>
          <CardDescription>5 seats, billed monthly.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-baseline gap-1">
          <span className="text-3xl font-semibold">$60</span>
          <span className="text-sm text-[var(--color-muted)]">per month</span>
        </CardContent>
      </Card>
    </section>
  )
}

// @demo
export function ProgressUploadDemo() {
  const files = [
    { name: "brand-guidelines.pdf", size: "4.2 MB", value: 100 },
    { name: "homepage-v3.fig", size: "18.6 MB", value: 64 },
    { name: "launch-assets.zip", size: "52 MB", value: 23 }
  ]
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <IconFrame tone="accent" size="lg"><CloudArrowUp aria-hidden className="size-5" /></IconFrame>
          <div>
            <CardTitle>Uploading 3 files</CardTitle>
            <CardDescription>About 40 seconds left</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {files.map((file) => (
          <div key={file.name} className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                {file.value === 100 ? (
                  <CheckCircle aria-hidden weight="fill" className="size-4 shrink-0 text-[var(--tone-success)]" />
                ) : (
                  <File aria-hidden className="size-4 shrink-0 text-[var(--color-muted)]" />
                )}
                <span className="truncate font-medium">{file.name}</span>
              </span>
              <span className="shrink-0 tabular-nums text-[var(--color-muted)]">{file.value}%</span>
            </div>
            <Progress aria-label={`Uploading ${file.name}`} value={file.value} size="sm" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// @demo
export function ProgressOnboardingDemo() {
  const steps = [
    { label: "Create workspace", done: true },
    { label: "Invite your team", done: true },
    { label: "Connect a repository", done: false },
    { label: "Ship your first deploy", done: false }
  ]
  const done = steps.filter((step) => step.done).length
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Get started</CardTitle>
            <CardDescription>{done} of {steps.length} steps complete</CardDescription>
          </div>
          <ProgressCircle value={(done / steps.length) * 100} size="lg" showValue aria-label="Onboarding progress" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Progress aria-label="Onboarding progress" value={(done / steps.length) * 100} />
        <ul className="flex flex-col gap-2 text-sm">
          {steps.map((step) => (
            <li key={step.label} className="flex items-center gap-2">
              <CheckCircle
                aria-hidden
                weight={step.done ? "fill" : "regular"}
                className={step.done ? "size-4 text-[var(--tone-success)]" : "size-4 text-[var(--color-muted)]"}
              />
              <span className={step.done ? "text-[var(--color-muted)] line-through" : "font-medium"}>{step.label}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

// @demo
export function ProgressSizesDemo() {
  const [value, setValue] = useState(35)
  useEffect(() => {
    const id = window.setInterval(() => setValue((current) => (current >= 100 ? 8 : current + 9)), 900)
    return () => window.clearInterval(id)
  }, [])
  return (
    <div className="flex w-full max-w-md flex-col gap-5">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-col gap-1.5">
          <span className="font-mono text-xs text-[var(--color-muted)]">size {size}</span>
          <Progress aria-label={`Progress ${size}`} size={size} value={value} />
        </div>
      ))}
      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-xs text-[var(--color-muted)]">indeterminate</span>
        <Progress aria-label="Waiting for server" indeterminate />
      </div>
    </div>
  )
}

// @demo
export function SkeletonFeedDemo() {
  return (
    <div className="grid w-full max-w-3xl gap-4 md:grid-cols-2">
      <Card className="flex flex-col gap-4" aria-busy="true" aria-label="Loading post">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-11/12" />
          <Skeleton className="h-3.5 w-2/3" />
        </div>
        <Skeleton className="h-32 w-full rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </Card>
      <Card className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Avatar fallback="MK" tone="accent" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">Maya Kovacs</span>
            <span className="text-xs text-[var(--color-muted)]">Product designer, 2h ago</span>
          </div>
        </div>
        <p className="text-sm">
          Shipped the new billing page today. The empty states took longer than the happy path, but they
          feel much better now.
        </p>
        <div className="flex h-32 w-full items-center justify-center rounded-lg bg-[var(--surface-3)] text-sm text-[var(--color-muted)]">
          billing-page.png
        </div>
        <div className="flex gap-2">
          <Badge variant="soft">24 likes</Badge>
          <Badge variant="soft">6 comments</Badge>
        </div>
      </Card>
    </div>
  )
}

// @demo
export function SkeletonStatesDemo() {
  const [loading, setLoading] = useState(true)
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Button variant="outline" size="sm" className="w-fit" onClick={() => setLoading((value) => !value)}>
        {loading ? "Show loaded state" : "Show loading state"}
      </Button>
      <Card className="flex items-center gap-4" aria-busy={loading}>
        {loading ? (
          <>
            <Skeleton className="size-12 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </>
        ) : (
          <>
            <Avatar fallback="JO" size="lg" tone="success" />
            <div className="flex flex-col">
              <span className="font-medium">Jonas Okafor</span>
              <span className="text-sm text-[var(--color-muted)]">Engineering manager</span>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

// @demo
export function SpinnerButtonsDemo() {
  const [saving, setSaving] = useState(false)
  useEffect(() => {
    if (!saving) return
    const id = window.setTimeout(() => setSaving(false), 2400)
    return () => window.clearTimeout(id)
  }, [saving])
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button disabled={saving} onClick={() => setSaving(true)}>
          {saving ? <Spinner size="sm" variant="current" label="Saving" /> : null}
          {saving ? "Saving changes" : "Save changes"}
        </Button>
        <Button variant="outline" disabled>
          <Spinner size="sm" variant="current" label="Syncing" />
          Syncing
        </Button>
        <Button variant="ghost" size="sm" disabled>
          <Spinner size="sm" variant="current" label="Loading" />
          Loading
        </Button>
      </div>
      <Card className="flex flex-col items-center gap-3 py-10 text-center" aria-busy="true">
        <Spinner size="lg" label="Loading dashboard" />
        <div>
          <p className="text-sm font-medium">Loading your dashboard</p>
          <p className="text-sm text-[var(--color-muted)]">Fetching the latest numbers</p>
        </div>
      </Card>
    </div>
  )
}

// @demo
export function SpinnerSizesDemo() {
  return (
    <div className="flex flex-wrap items-end gap-8">
      {(["sm", "md", "lg", "xl"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Spinner size={size} label={`Loading ${size}`} />
          <span className="font-mono text-xs text-[var(--color-muted)]">{size}</span>
        </div>
      ))}
      <div className="flex flex-col items-center gap-2">
        <Spinner size="lg" variant="muted" label="Loading muted" />
        <span className="font-mono text-xs text-[var(--color-muted)]">muted</span>
      </div>
    </div>
  )
}

// @demo
export function StatusDotServicesDemo() {
  const services = [
    { name: "API", note: "Operational", status: "success" as const },
    { name: "Dashboard", note: "Operational", status: "success" as const },
    { name: "Webhooks", note: "Degraded, retrying", status: "warning" as const, pulse: true },
    { name: "Billing", note: "Major outage", status: "danger" as const, pulse: true },
    { name: "Docs", note: "Maintenance at 02:00 UTC", status: "info" as const },
    { name: "Legacy SDK", note: "Not monitored", status: "neutral" as const }
  ]
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>System status</CardTitle>
        <CardDescription>Updated 2 minutes ago</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        {services.map((service, index) => (
          <div key={service.name}>
            {index > 0 ? <Separator /> : null}
            <div className="flex items-center justify-between gap-3 py-3">
              <span className="text-sm font-medium">{service.name}</span>
              <StatusDot status={service.status} pulse={service.pulse} label={service.note} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// @demo
export function StatusDotSizesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
      {(["sm", "md", "lg"] as const).map((size) => (
        <StatusDot key={size} size={size} status="success" label={`Size ${size}`} />
      ))}
      {(["neutral", "info", "success", "warning", "danger"] as const).map((status) => (
        <StatusDot key={status} status={status} pulse={status === "danger"} label={status} />
      ))}
    </div>
  )
}

// @demo
export function EmptyInboxDemo() {
  return (
    <Empty className="w-full max-w-lg">
      <EmptyHeader>
        <EmptyMedia variant="icon"><Tray aria-hidden /></EmptyMedia>
        <EmptyTitle>Inbox zero</EmptyTitle>
        <EmptyDescription>You have answered every conversation. New messages will show up here.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex flex-wrap justify-center gap-2">
          <Button>Compose message</Button>
          <Button variant="outline">View archive</Button>
        </div>
      </EmptyContent>
    </Empty>
  )
}

// @demo
export function EmptySearchDemo() {
  return (
    <Empty variant="dashed" className="w-full max-w-lg">
      <EmptyHeader>
        <EmptyMedia variant="icon"><MagnifyingGlass aria-hidden /></EmptyMedia>
        <EmptyTitle>No results for "quarterly report"</EmptyTitle>
        <EmptyDescription>Check the spelling, remove a filter, or search by project name instead.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex flex-wrap justify-center gap-2">
          <Button variant="outline" size="sm">
            <X aria-hidden className="size-4" />
            Clear filters
          </Button>
          <Button size="sm">
            <Plus aria-hidden className="size-4" />
            New document
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  )
}

// @demo
export function EmptyLayoutDemo() {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Exports</CardTitle>
          <Button size="sm" variant="outline">Schedule export</Button>
        </div>
        <CardDescription>Download reports as CSV or PDF.</CardDescription>
      </CardHeader>
      <CardContent>
        <Empty variant="plain">
          <EmptyHeader>
            <EmptyMedia variant="icon"><FileArchive aria-hidden /></EmptyMedia>
            <EmptyTitle>No exports yet</EmptyTitle>
            <EmptyDescription>Exports you create stay available for 30 days.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="sm">Create first export</Button>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  )
}
