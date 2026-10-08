"use client"

// Showcase demos for the layout family: scroll-area, aspect-ratio, collapsible, separator, icon-frame,
// accordion, browser-frame. Each `// @demo` block is extracted verbatim into the code string shown on
// the docs page (see scripts/gen-s3-code.mjs), so keep blocks free of docs-only helpers.

import { useState } from "react"
import {
  Bell,
  Bug,
  CaretDown,
  ChartLineUp,
  CreditCard,
  Lightning,
  Package,
  ShieldCheck,
  Sparkle,
  Stack,
  Truck
} from "@phosphor-icons/react/dist/ssr"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AspectRatio,
  Avatar,
  Badge,
  BrowserFrame,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  IconFrame,
  ScrollArea,
  ScrollBar,
  Separator
} from "@glinui/ui"

// @demo
export function ScrollAreaChangelogDemo() {
  const releases = [
    { version: "2.8.0", date: "Oct 6", tag: "Feature", tone: "accent" as const, note: "Scheduled exports and a new CSV mapper." },
    { version: "2.7.3", date: "Sep 29", tag: "Fix", tone: "danger" as const, note: "Timezone drift in recurring reports." },
    { version: "2.7.2", date: "Sep 22", tag: "Fix", tone: "danger" as const, note: "Dropdown menus now close on route change." },
    { version: "2.7.0", date: "Sep 15", tag: "Feature", tone: "accent" as const, note: "Dark appearance for the billing portal." },
    { version: "2.6.4", date: "Sep 8", tag: "Perf", tone: "success" as const, note: "Dashboard loads 38 percent faster." },
    { version: "2.6.0", date: "Aug 30", tag: "Feature", tone: "accent" as const, note: "Team roles with per-project access." },
    { version: "2.5.2", date: "Aug 21", tag: "Fix", tone: "danger" as const, note: "Webhook retries respect the backoff header." },
    { version: "2.5.0", date: "Aug 12", tag: "Feature", tone: "accent" as const, note: "Audit log with 90 day retention." }
  ]
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Changelog</CardTitle>
        <CardDescription>Recent releases</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea variant="outline" className="h-72" aria-label="Release history">
          <ol className="flex flex-col">
            {releases.map((release, index) => (
              <li key={release.version}>
                {index > 0 ? <Separator /> : null}
                <div className="flex flex-col gap-1.5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-sm font-semibold">v{release.version}</span>
                    <span className="text-xs text-[var(--color-muted)]">{release.date}</span>
                  </div>
                  <p className="text-sm">{release.note}</p>
                  <Badge variant="soft" tone={release.tone} size="sm" className="w-fit">{release.tag}</Badge>
                </div>
              </li>
            ))}
          </ol>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// @demo
export function ScrollAreaGalleryDemo() {
  const shots = ["Overview", "Reports", "Billing", "Members", "Audit log", "Webhooks", "API keys", "Settings"]
  return (
    <ScrollArea className="w-full max-w-lg whitespace-nowrap rounded-xl border border-[var(--line-soft)]" aria-label="Screens">
      <div className="flex gap-3 p-4">
        {shots.map((shot, index) => (
          <figure key={shot} className="flex shrink-0 flex-col gap-2">
            <div className="flex h-24 w-40 items-center justify-center rounded-lg bg-[var(--surface-3)] text-xs font-medium text-[var(--color-muted)]">
              {index + 1} / {shots.length}
            </div>
            <figcaption className="text-sm font-medium">{shot}</figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

// @demo
export function AspectRatioMediaDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
      {[
        { ratio: 16 / 9, label: "16:9", tone: "from-[var(--color-accent)]" },
        { ratio: 4 / 3, label: "4:3", tone: "from-[var(--tone-info)]" },
        { ratio: 1, label: "1:1", tone: "from-[var(--tone-success)]" },
        { ratio: 9 / 16, label: "9:16", tone: "from-[var(--tone-warning)]" }
      ].map((item) => (
        <div key={item.label} className={item.ratio < 1 ? "mx-auto w-1/2 sm:w-2/3" : ""}>
          <AspectRatio ratio={item.ratio} className="rounded-xl">
            <div className={`flex size-full items-end bg-gradient-to-br ${item.tone} to-[var(--surface-3)] p-3`}>
              <Badge variant="glass">{item.label}</Badge>
            </div>
          </AspectRatio>
        </div>
      ))}
    </div>
  )
}

// @demo
export function AspectRatioCardDemo() {
  return (
    <Card className="w-full max-w-sm overflow-hidden p-0">
      <AspectRatio ratio={16 / 9}>
        <div className="flex size-full items-center justify-center bg-gradient-to-br from-[var(--color-accent)] to-[var(--surface-3)]">
          <Sparkle aria-hidden weight="fill" className="size-10 text-white" />
        </div>
      </AspectRatio>
      <div className="flex flex-col gap-2 p-4">
        <Badge variant="soft" tone="accent" size="sm" className="w-fit">Guide</Badge>
        <h3 className="text-base font-semibold">Designing empty states</h3>
        <p className="text-sm text-[var(--color-muted)]">Six patterns that turn a blank screen into the next step.</p>
      </div>
    </Card>
  )
}

// @demo
export function CollapsibleOrderDemo() {
  const [open, setOpen] = useState(true)
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full max-w-md">
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-3">
          <IconFrame tone="accent" size="lg"><Package aria-hidden className="size-5" /></IconFrame>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Order #10482</span>
            <span className="text-xs text-[var(--color-muted)]">3 items, $148.00</span>
          </div>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" aria-label={open ? "Hide order details" : "Show order details"}>
            <CaretDown aria-hidden className={open ? "size-4 rotate-180 transition-transform" : "size-4 transition-transform"} />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <Separator />
        <ul className="flex flex-col gap-3 p-4 text-sm">
          <li className="flex justify-between gap-3"><span>Canvas tote bag x2</span><span className="tabular-nums">$64.00</span></li>
          <li className="flex justify-between gap-3"><span>Ceramic mug</span><span className="tabular-nums">$24.00</span></li>
          <li className="flex justify-between gap-3"><span>Shipping</span><span className="tabular-nums">$12.00</span></li>
          <li className="flex items-center gap-2 text-[var(--color-muted)]"><Truck aria-hidden className="size-4" />Arrives Oct 12 to Oct 14</li>
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}

// @demo
export function CollapsibleListDemo() {
  const [open, setOpen] = useState(false)
  const repos = ["glinui/ui", "glinui/docs", "glinui/tokens", "glinui/cli", "glinui/motion"]
  return (
    <Collapsible open={open} onOpenChange={setOpen} variant="plain" className="w-full max-w-sm">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <h4 className="text-sm font-semibold">{repos.length} repositories starred</h4>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm">{open ? "Show less" : "Show all"}</Button>
        </CollapsibleTrigger>
      </div>
      <div className="mx-4 mb-3 rounded-lg border border-[var(--line-soft)] px-3 py-2 font-mono text-sm">{repos[0]}</div>
      <CollapsibleContent className="flex flex-col gap-2 px-4 pb-4">
        {repos.slice(1).map((repo) => (
          <div key={repo} className="rounded-lg border border-[var(--line-soft)] px-3 py-2 font-mono text-sm">{repo}</div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

// @demo
export function SeparatorLayoutDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-5">
      <div className="flex h-5 items-center gap-4 text-sm">
        <span>Overview</span>
        <Separator orientation="vertical" />
        <span>Activity</span>
        <Separator orientation="vertical" />
        <span>Settings</span>
      </div>
      <Separator label="or continue with" />
      <Separator icon={<Sparkle aria-hidden className="size-4" />} variant="gradient" />
      <div className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between"><span>Subtotal</span><span className="tabular-nums">$148.00</span></div>
        <div className="flex justify-between"><span>Shipping</span><span className="tabular-nums">$12.00</span></div>
        <Separator variant="dashed" />
        <div className="flex justify-between font-semibold"><span>Total</span><span className="tabular-nums">$160.00</span></div>
      </div>
    </div>
  )
}

// @demo
export function IconFrameFeaturesDemo() {
  const features = [
    { icon: Lightning, tone: "accent" as const, title: "Fast builds", text: "Incremental builds finish in under 8 seconds." },
    { icon: ShieldCheck, tone: "success" as const, title: "Secure by default", text: "Secrets are encrypted and rotated automatically." },
    { icon: ChartLineUp, tone: "info" as const, title: "Live metrics", text: "Latency and error rates update every minute." },
    { icon: Bug, tone: "danger" as const, title: "Error tracking", text: "Group crashes by release and assign an owner." }
  ]
  return (
    <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
      {features.map((feature) => (
        <Card key={feature.title} className="flex flex-row items-start gap-4">
          <IconFrame tone={feature.tone} size="lg"><feature.icon aria-hidden className="size-5" /></IconFrame>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold">{feature.title}</h3>
            <p className="text-sm text-[var(--color-muted)]">{feature.text}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}

// @demo
export function AccordionFaqDemo() {
  const faqs = [
    ["Can I cancel at any time?", "Yes. Cancel from Billing and your plan stays active until the end of the period."],
    ["Do you offer discounts for nonprofits?", "Registered nonprofits get 50 percent off. Email billing with your registration number."],
    ["How do seats work?", "Each member who can edit counts as a seat. Viewers are always free."],
    ["Where is my data stored?", "In the region you choose at signup: US East, EU Central or Asia Pacific."]
  ]
  return (
    <section aria-labelledby="faq-title" className="flex w-full max-w-xl flex-col gap-4">
      <h3 id="faq-title" className="text-lg font-semibold">Billing questions</h3>
      <Accordion type="single" collapsible defaultValue="item-0">
        {faqs.map(([question, answer], index) => (
          <AccordionItem key={question} value={`item-${index}`}>
            <AccordionTrigger>{question}</AccordionTrigger>
            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

// @demo
export function AccordionMultipleDemo() {
  return (
    <Accordion type="multiple" defaultValue={["shipping", "returns"]} variant="separated" className="w-full max-w-xl">
      <AccordionItem value="shipping">
        <AccordionTrigger>Shipping</AccordionTrigger>
        <AccordionContent>Orders ship within 2 business days. Tracking is emailed once the parcel leaves our warehouse.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="returns">
        <AccordionTrigger>Returns</AccordionTrigger>
        <AccordionContent>Return unused items within 30 days for a full refund to your original payment method.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="warranty">
        <AccordionTrigger>Warranty</AccordionTrigger>
        <AccordionContent>Every product includes a two year warranty against manufacturing defects.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

// @demo
export function BrowserFrameAppDemo() {
  return (
    <BrowserFrame url="app.northwind.io/billing" className="w-full max-w-2xl">
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar fallback="NS" tone="accent" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Northwind Studio</span>
              <span className="text-xs text-[var(--color-muted)]">Team plan</span>
            </div>
          </div>
          <Button size="sm" variant="outline"><CreditCard aria-hidden className="size-4" />Manage billing</Button>
        </div>
        <Separator />
        <div className="grid gap-3 sm:grid-cols-3">
          {[["Spend", "$1,240"], ["Seats", "12"], ["Invoices", "8"]].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-[var(--surface-2)] p-3">
              <p className="text-xs text-[var(--color-muted)]">{label}</p>
              <p className="text-lg font-semibold tabular-nums">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </BrowserFrame>
  )
}

// @demo
export function BrowserFrameModesDemo() {
  return (
    <div className="grid w-full max-w-3xl gap-4 md:grid-cols-2">
      <BrowserFrame mode="simple" title="Release notes">
        <div className="flex items-center gap-3 p-5 text-sm">
          <IconFrame tone="success"><Stack aria-hidden className="size-4" /></IconFrame>
          Version 2.8 is live for all workspaces.
        </div>
      </BrowserFrame>
      <BrowserFrame url="glinui.com/docs">
        <div className="flex items-center gap-3 p-5 text-sm">
          <IconFrame tone="accent"><Bell aria-hidden className="size-4" /></IconFrame>
          Subscribe to product updates.
        </div>
      </BrowserFrame>
    </div>
  )
}
