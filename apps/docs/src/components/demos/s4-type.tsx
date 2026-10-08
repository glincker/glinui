"use client"

// Showcase demos for typography: Heading, Text, Link, Code, Kbd, GradientText and ChromaticText.
// Each demo is a believable page fragment built from Glin components. Code strings mirror the rendered markup.

import * as React from "react"
import { ArrowRight, BookOpen, Command as CommandIcon, MagnifyingGlass } from "@phosphor-icons/react"
import { Avatar, Badge, Button, ChromaticText, Code, GradientText, Heading, Kbd, Link, Text } from "@glinui/ui"

import type { ComponentExample } from "@/lib/component-docs"

const IMPORT_ICON = 'import { ArrowRight } from "@phosphor-icons/react"\n'

const ARTICLE = "flex w-full max-w-2xl flex-col gap-5 text-left"

function ArticleHero() {
  return (
    <article className={ARTICLE}>
      <Text variant="eyebrow">Engineering, 8 min read</Text>
      <Heading level={1} size="display">How we cut cold starts from 900 ms to 90 ms</Heading>
      <Text size="lg" variant="muted">A walk through snapshotting, lazy imports and the one runtime flag that did most of the work.</Text>
      <div className="flex items-center gap-3">
        <Avatar fallback="MK" size="md" />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-[var(--color-foreground)]">Maya Kovacs</span>
          <span className="text-xs text-[var(--color-muted)]">Platform team, Oct 7 2026</span>
        </div>
      </div>
    </article>
  )
}

const articleCode = `import { Avatar, Heading, Text } from "@glinui/ui"

export function ArticleHeader() {
  return (
    <article className="${ARTICLE}">
      <Text variant="eyebrow">Engineering, 8 min read</Text>
      <Heading level={1} size="display">How we cut cold starts from 900 ms to 90 ms</Heading>
      <Text size="lg" variant="muted">A walk through snapshotting, lazy imports and the one runtime flag that did most of the work.</Text>
      <div className="flex items-center gap-3">
        <Avatar fallback="MK" size="md" />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-[var(--color-foreground)]">Maya Kovacs</span>
          <span className="text-xs text-[var(--color-muted)]">Platform team, Oct 7 2026</span>
        </div>
      </div>
    </article>
  )
}`

const SCALE: Array<{ size: "display" | "h2" | "h3" | "lg" | "md" | "sm"; level: 1 | 2 | 3 | 4; label: string }> = [
  { size: "display", level: 1, label: "display" },
  { size: "h2", level: 2, label: "h2" },
  { size: "h3", level: 3, label: "h3" },
  { size: "lg", level: 4, label: "lg" },
  { size: "md", level: 4, label: "md" },
  { size: "sm", level: 4, label: "sm" }
]

function TypeScale() {
  return (
    <div className="flex w-full max-w-2xl flex-col divide-y divide-[var(--line-soft)] rounded-xl border border-[var(--line-soft)] bg-[var(--surface-1)] text-left">
      {SCALE.map((row) => (
        <div key={row.size} className="flex items-baseline justify-between gap-4 px-5 py-3">
          <Heading level={row.level} size={row.size}>Quarterly review</Heading>
          <code className="shrink-0 font-mono text-xs text-[var(--color-muted)]">size=&quot;{row.label}&quot;</code>
        </div>
      ))}
    </div>
  )
}

const scaleCode = `import { Heading } from "@glinui/ui"

const scale = ["display", "h2", "h3", "lg", "md", "sm"] as const

export function TypeScale() {
  return (
    <div className="flex w-full max-w-2xl flex-col divide-y divide-[var(--line-soft)] rounded-xl border border-[var(--line-soft)] bg-[var(--surface-1)] text-left">
      {scale.map((size) => (
        <div key={size} className="flex items-baseline justify-between gap-4 px-5 py-3">
          <Heading level={2} size={size}>Quarterly review</Heading>
          <code className="shrink-0 font-mono text-xs text-[var(--color-muted)]">size="{size}"</code>
        </div>
      ))}
    </div>
  )
}`

const POSTS = [
  { title: "Designing a status page people actually read", meta: "Design, 5 min", who: "AL" },
  { title: "Why we moved billing events to a queue", meta: "Backend, 9 min", who: "JT" },
  { title: "A checklist for accessible data tables", meta: "Frontend, 6 min", who: "RS" }
]

function PostList() {
  return (
    <section aria-label="Latest posts" className="flex w-full max-w-2xl flex-col gap-4 text-left">
      <div className="flex items-end justify-between gap-4">
        <Heading level={2} size="md">Latest from the blog</Heading>
        <Link href="#posts" variant="arrow" size="sm">All posts</Link>
      </div>
      <ul className="grid gap-3 sm:grid-cols-3">
        {POSTS.map((post) => (
          <li key={post.title} className="flex flex-col gap-3 rounded-xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-4">
            <Heading level={3} size="sm">{post.title}</Heading>
            <div className="mt-auto flex items-center gap-2 text-xs text-[var(--color-muted)]">
              <Avatar fallback={post.who} size="xs" />
              {post.meta}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

const postsCode = `import { Avatar, Heading, Link } from "@glinui/ui"

const posts = [
  { title: "Designing a status page people actually read", meta: "Design, 5 min", who: "AL" },
  { title: "Why we moved billing events to a queue", meta: "Backend, 9 min", who: "JT" },
  { title: "A checklist for accessible data tables", meta: "Frontend, 6 min", who: "RS" }
]

export function PostList() {
  return (
    <section aria-label="Latest posts" className="flex w-full max-w-2xl flex-col gap-4 text-left">
      <div className="flex items-end justify-between gap-4">
        <Heading level={2} size="md">Latest from the blog</Heading>
        <Link href="/blog" variant="arrow" size="sm">All posts</Link>
      </div>
      <ul className="grid gap-3 sm:grid-cols-3">
        {posts.map((post) => (
          <li key={post.title} className="flex flex-col gap-3 rounded-xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-4">
            <Heading level={3} size="sm">{post.title}</Heading>
            <div className="mt-auto flex items-center gap-2 text-xs text-[var(--color-muted)]">
              <Avatar fallback={post.who} size="xs" />
              {post.meta}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}`

const GLASS_BACKDROP = "flex w-full flex-wrap items-center justify-center gap-4 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8"

function HeadingVariants() {
  return (
    <div data-glin-theme="dark" className={GLASS_BACKDROP}>
      <Heading level={3} size="sm">Default</Heading>
      <Heading level={3} size="sm" variant="outline">Outline</Heading>
      <Heading level={3} size="sm" variant="ghost">Ghost</Heading>
      <Heading level={3} size="sm" variant="glass">Glass</Heading>
    </div>
  )
}

const headingVariantsCode = `import { Heading } from "@glinui/ui"

export function HeadingVariants() {
  return (
    <div data-glin-theme="dark" className="${GLASS_BACKDROP}">
      <Heading level={3} size="sm">Default</Heading>
      <Heading level={3} size="sm" variant="outline">Outline</Heading>
      <Heading level={3} size="sm" variant="ghost">Ghost</Heading>
      <Heading level={3} size="sm" variant="glass">Glass</Heading>
    </div>
  )
}`

/* ---------------------------------------------------------------- Text */

function TextHero() {
  return (
    <article className={ARTICLE}>
      <Text variant="eyebrow">Release notes</Text>
      <Heading level={2} size="h2">Version 4.2 is out</Heading>
      <Text size="lg">Scheduled exports now run in your timezone, and the audit log keeps 400 days of history on every plan.</Text>
      <Text variant="muted">Existing schedules migrate automatically. If you pinned a UTC offset in the API, it keeps working, and the new <Code>timezone</Code> field takes priority when both are set.</Text>
      <Text size="sm" variant="muted">Published Oct 7, 2026. Questions? Reply to this post or write to support.</Text>
    </article>
  )
}

const textHeroCode = `import { Code, Heading, Text } from "@glinui/ui"

export function ReleaseNote() {
  return (
    <article className="${ARTICLE}">
      <Text variant="eyebrow">Release notes</Text>
      <Heading level={2} size="h2">Version 4.2 is out</Heading>
      <Text size="lg">Scheduled exports now run in your timezone, and the audit log keeps 400 days of history on every plan.</Text>
      <Text variant="muted">Existing schedules migrate automatically. If you pinned a UTC offset in the API, it keeps working, and the new <Code>timezone</Code> field takes priority when both are set.</Text>
      <Text size="sm" variant="muted">Published Oct 7, 2026. Questions? Reply to this post or write to support.</Text>
    </article>
  )
}`

function TextVariants() {
  return (
    <div data-glin-theme="dark" className={GLASS_BACKDROP}>
      <Text>Default</Text>
      <Text variant="muted" className="text-[var(--color-foreground)]">Muted</Text>
      <Text variant="eyebrow" className="text-[var(--color-foreground)]">Eyebrow</Text>
      <Text variant="ghost">Ghost</Text>
      <Text variant="glass">Glass</Text>
    </div>
  )
}

const textVariantsCode = `import { Text } from "@glinui/ui"

export function TextVariants() {
  return (
    <div data-glin-theme="dark" className="${GLASS_BACKDROP}">
      <Text>Default</Text>
      <Text variant="muted" className="text-[var(--color-foreground)]">Muted</Text>
      <Text variant="eyebrow" className="text-[var(--color-foreground)]">Eyebrow</Text>
      <Text variant="ghost">Ghost</Text>
      <Text variant="glass">Glass</Text>
    </div>
  )
}`

const CHANGELOG = [
  { date: "Oct 7", tag: "New", tone: "accent" as const, text: "Scheduled exports follow the workspace timezone." },
  { date: "Sep 29", tag: "Fixed", tone: "success" as const, text: "Invoice PDFs no longer clip long company names." },
  { date: "Sep 18", tag: "Changed", tone: "warning" as const, text: "API keys created before 2024 now expire after 12 months." }
]

function ChangelogLayout() {
  return (
    <section aria-label="Changelog" className="flex w-full max-w-xl flex-col gap-4 rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-6 text-left">
      <Heading level={2} size="sm">Changelog</Heading>
      <ol className="flex flex-col gap-4">
        {CHANGELOG.map((entry) => (
          <li key={entry.date} className="grid grid-cols-[4.5rem_1fr] items-start gap-3">
            <Text size="sm" variant="muted">{entry.date}</Text>
            <div className="flex flex-col items-start gap-1.5">
              <Badge tone={entry.tone} variant="soft">{entry.tag}</Badge>
              <Text>{entry.text}</Text>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

const changelogCode = `import { Badge, Heading, Text } from "@glinui/ui"

const entries = [
  { date: "Oct 7", tag: "New", tone: "accent", text: "Scheduled exports follow the workspace timezone." },
  { date: "Sep 29", tag: "Fixed", tone: "success", text: "Invoice PDFs no longer clip long company names." },
  { date: "Sep 18", tag: "Changed", tone: "warning", text: "API keys created before 2024 now expire after 12 months." }
] as const

export function Changelog() {
  return (
    <section aria-label="Changelog" className="flex w-full max-w-xl flex-col gap-4 rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-6 text-left">
      <Heading level={2} size="sm">Changelog</Heading>
      <ol className="flex flex-col gap-4">
        {entries.map((entry) => (
          <li key={entry.date} className="grid grid-cols-[4.5rem_1fr] items-start gap-3">
            <Text size="sm" variant="muted">{entry.date}</Text>
            <div className="flex flex-col items-start gap-1.5">
              <Badge tone={entry.tone} variant="soft">{entry.tag}</Badge>
              <Text>{entry.text}</Text>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}`

/* ---------------------------------------------------------------- Link */

const FOOTER_COLS: Array<[string, string[]]> = [
  ["Product", ["Features", "Pricing", "Changelog", "Status"]],
  ["Developers", ["Documentation", "API reference", "SDKs", "Community"]],
  ["Company", ["About", "Careers", "Press kit", "Contact"]]
]

function LinkHero() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-6 rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-6 text-left">
      <Text variant="muted">
        Read the <Link href="#guide">migration guide</Link> before upgrading, then check the <Link href="#api" variant="outline">API reference</Link> for removed fields.
        Need help? <Link href="#support" variant="arrow">Talk to support</Link>
      </Text>
      <nav aria-label="Footer" className="grid grid-cols-2 gap-6 border-t border-[var(--line-soft)] pt-6 sm:grid-cols-3">
        {FOOTER_COLS.map(([title, links]) => (
          <div key={title} className="flex flex-col gap-2">
            <Heading level={3} size="sm">{title}</Heading>
            <ul className="flex flex-col gap-1.5">
              {links.map((label) => (
                <li key={label}><Link href="#footer" variant="ghost" underline={false} size="sm">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  )
}

const linkHeroCode = `import { Heading, Link, Text } from "@glinui/ui"

const columns: Array<[string, string[]]> = [
  ["Product", ["Features", "Pricing", "Changelog", "Status"]],
  ["Developers", ["Documentation", "API reference", "SDKs", "Community"]],
  ["Company", ["About", "Careers", "Press kit", "Contact"]]
]

export function LinkShowcase() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-6 rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-6 text-left">
      <Text variant="muted">
        Read the <Link href="/guide">migration guide</Link> before upgrading, then check the <Link href="/api" variant="outline">API reference</Link> for removed fields.
        Need help? <Link href="/support" variant="arrow">Talk to support</Link>
      </Text>
      <nav aria-label="Footer" className="grid grid-cols-2 gap-6 border-t border-[var(--line-soft)] pt-6 sm:grid-cols-3">
        {columns.map(([title, links]) => (
          <div key={title} className="flex flex-col gap-2">
            <Heading level={3} size="sm">{title}</Heading>
            <ul className="flex flex-col gap-1.5">
              {links.map((label) => (
                <li key={label}><Link href="#" variant="ghost" underline={false} size="sm">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  )
}`

function LinkVariants() {
  return (
    <div data-glin-theme="dark" className={GLASS_BACKDROP}>
      <Link href="#v" variant="default">Default</Link>
      <Link href="#v" variant="arrow">Arrow</Link>
      <Link href="#v" variant="outline">Outline</Link>
      <Link href="#v" variant="ghost">Ghost</Link>
      <Link href="#v" variant="glass">Glass</Link>
    </div>
  )
}

const linkVariantsCode = `import { Link } from "@glinui/ui"

export function LinkVariants() {
  return (
    <div data-glin-theme="dark" className="${GLASS_BACKDROP}">
      <Link href="#" variant="default">Default</Link>
      <Link href="#" variant="arrow">Arrow</Link>
      <Link href="#" variant="outline">Outline</Link>
      <Link href="#" variant="ghost">Ghost</Link>
      <Link href="#" variant="glass">Glass</Link>
    </div>
  )
}`

function LinkCard() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3 rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-6 text-left">
      <div className="flex items-center gap-2 text-[var(--color-muted)]"><BookOpen aria-hidden className="size-4" /><Text variant="eyebrow">Guide</Text></div>
      <Heading level={3} size="md">Set up single sign on</Heading>
      <Text variant="muted">Connect Okta, Entra ID or Google Workspace in about ten minutes, then require SSO for every member.</Text>
      <div className="flex items-center justify-between gap-3 pt-1">
        <Link href="#sso" variant="arrow">Read the guide</Link>
        <Link href="#sso-video" size="sm" underline={false} variant="ghost">Watch the 3 min video</Link>
      </div>
    </div>
  )
}

const linkCardCode = `import { BookOpen } from "@phosphor-icons/react"
import { Heading, Link, Text } from "@glinui/ui"

export function GuideCard() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3 rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-6 text-left">
      <div className="flex items-center gap-2 text-[var(--color-muted)]"><BookOpen aria-hidden className="size-4" /><Text variant="eyebrow">Guide</Text></div>
      <Heading level={3} size="md">Set up single sign on</Heading>
      <Text variant="muted">Connect Okta, Entra ID or Google Workspace in about ten minutes, then require SSO for every member.</Text>
      <div className="flex items-center justify-between gap-3 pt-1">
        <Link href="/guides/sso" variant="arrow">Read the guide</Link>
        <Link href="/guides/sso/video" size="sm" underline={false} variant="ghost">Watch the 3 min video</Link>
      </div>
    </div>
  )
}`

/* ---------------------------------------------------------------- Code (inline) and Kbd */

function CodeHero() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4 rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-6 text-left">
      <Heading level={2} size="sm">Configure retries</Heading>
      <Text>
        Set <Code>maxRetries</Code> on the client to control how often a failed request is repeated. The default is <Code tone="accent">3</Code>, and
        requests that return <Code>4xx</Code> are never retried.
      </Text>
      <Text variant="muted">
        Override it per call with <Code variant="outline">client.get(url, {"{ maxRetries: 0 }"})</Code> or set the <Code variant="soft">ACME_MAX_RETRIES</Code> variable in your environment.
      </Text>
      <Code variant="block" className="block">pnpm acme config set maxRetries 5</Code>
    </div>
  )
}

const codeHeroCode = `import { Code, Heading, Text } from "@glinui/ui"

export function RetryDocs() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4 rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-6 text-left">
      <Heading level={2} size="sm">Configure retries</Heading>
      <Text>
        Set <Code>maxRetries</Code> on the client to control how often a failed request is repeated. The default is <Code tone="accent">3</Code>, and
        requests that return <Code>4xx</Code> are never retried.
      </Text>
      <Text variant="muted">
        Override it per call with <Code variant="outline">client.get(url, {"{ maxRetries: 0 }"})</Code> or set the <Code variant="soft">ACME_MAX_RETRIES</Code> variable in your environment.
      </Text>
      <Code variant="block" className="block">pnpm acme config set maxRetries 5</Code>
    </div>
  )
}`

function CodeVariants() {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-3 rounded-xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-6">
      {(["glinr", "plain", "soft", "outline", "ghost", "solid"] as const).map((variant) => (
        <Code key={variant} variant={variant}>{variant}</Code>
      ))}
      {(["accent", "success", "warning", "danger"] as const).map((tone) => (
        <Code key={tone} variant="soft" tone={tone}>{tone}</Code>
      ))}
    </div>
  )
}

const codeVariantsCode = `import { Code } from "@glinui/ui"

export function CodeVariants() {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-3 rounded-xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-6">
      {(["glinr", "plain", "soft", "outline", "ghost", "solid"] as const).map((variant) => (
        <Code key={variant} variant={variant}>{variant}</Code>
      ))}
      {(["accent", "success", "warning", "danger"] as const).map((tone) => (
        <Code key={tone} variant="soft" tone={tone}>{tone}</Code>
      ))}
    </div>
  )
}`

const SHORTCUTS: Array<[string, string[]]> = [
  ["Open command palette", ["⌘", "K"]],
  ["Search issues", ["/"]],
  ["Create issue", ["C"]],
  ["Toggle sidebar", ["⌘", "B"]],
  ["Go to inbox", ["G", "I"]]
]

function KbdHero() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-5 text-left">
      <div className="flex items-center gap-2 rounded-xl border border-[var(--line-soft)] bg-[var(--surface-0)] px-3 py-2 text-[var(--color-muted)]">
        <MagnifyingGlass aria-hidden className="size-4" />
        <span className="flex-1 text-sm">Search or run a command</span>
        <Kbd size="sm">⌘</Kbd>
        <Kbd size="sm">K</Kbd>
      </div>
      <Heading level={2} size="sm">Keyboard shortcuts</Heading>
      <ul className="flex flex-col divide-y divide-[var(--line-soft)]">
        {SHORTCUTS.map(([label, keys]) => (
          <li key={label} className="flex items-center justify-between gap-4 py-2.5">
            <Text>{label}</Text>
            <span className="flex items-center gap-1">
              {keys.map((key) => (
                <Kbd key={key}>{key}</Kbd>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const kbdHeroCode = `import { MagnifyingGlass } from "@phosphor-icons/react"
import { Heading, Kbd, Text } from "@glinui/ui"

const shortcuts: Array<[string, string[]]> = [
  ["Open command palette", ["⌘", "K"]],
  ["Search issues", ["/"]],
  ["Create issue", ["C"]],
  ["Toggle sidebar", ["⌘", "B"]],
  ["Go to inbox", ["G", "I"]]
]

export function ShortcutSheet() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-5 text-left">
      <div className="flex items-center gap-2 rounded-xl border border-[var(--line-soft)] bg-[var(--surface-0)] px-3 py-2 text-[var(--color-muted)]">
        <MagnifyingGlass aria-hidden className="size-4" />
        <span className="flex-1 text-sm">Search or run a command</span>
        <Kbd size="sm">⌘</Kbd>
        <Kbd size="sm">K</Kbd>
      </div>
      <Heading level={2} size="sm">Keyboard shortcuts</Heading>
      <ul className="flex flex-col divide-y divide-[var(--line-soft)]">
        {shortcuts.map(([label, keys]) => (
          <li key={label} className="flex items-center justify-between gap-4 py-2.5">
            <Text>{label}</Text>
            <span className="flex items-center gap-1">
              {keys.map((key) => (
                <Kbd key={key}>{key}</Kbd>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}`

function KbdVariants() {
  return (
    <div className="flex w-full flex-col items-center gap-4 rounded-xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-6">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {(["glinr", "plain", "soft", "outline", "ghost", "solid"] as const).map((variant) => (
          <Kbd key={variant} variant={variant}>{variant === "glinr" ? "⌘" : variant.slice(0, 1).toUpperCase()}</Kbd>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Kbd size="sm">Esc</Kbd>
        <Kbd size="md">Esc</Kbd>
        <Kbd size="lg">Esc</Kbd>
      </div>
    </div>
  )
}

const kbdVariantsCode = `import { Kbd } from "@glinui/ui"

export function KbdVariants() {
  return (
    <div className="flex w-full flex-col items-center gap-4 rounded-xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-6">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {(["glinr", "plain", "soft", "outline", "ghost", "solid"] as const).map((variant) => (
          <Kbd key={variant} variant={variant}>{variant === "glinr" ? "⌘" : variant.slice(0, 1).toUpperCase()}</Kbd>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Kbd size="sm">Esc</Kbd>
        <Kbd size="md">Esc</Kbd>
        <Kbd size="lg">Esc</Kbd>
      </div>
    </div>
  )
}`

function KbdLayout() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-3 rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-5 text-left">
      <Heading level={3} size="sm">Tooltip with a shortcut</Heading>
      <div className="flex flex-wrap items-center gap-3">
        <Button leadingIcon={<CommandIcon aria-hidden weight="bold" />}>New message</Button>
        <span className="inline-flex items-center gap-2 rounded-lg bg-[var(--surface-3)] px-2.5 py-1.5 text-xs text-[var(--color-foreground)]">
          Compose <Kbd size="sm">C</Kbd>
        </span>
      </div>
      <Text size="sm" variant="muted">Press <Kbd size="sm">Shift</Kbd> + <Kbd size="sm">Enter</Kbd> to add a new line without sending.</Text>
    </div>
  )
}

const kbdLayoutCode = `import { Command } from "@phosphor-icons/react"
import { Button, Heading, Kbd, Text } from "@glinui/ui"

export function ShortcutHints() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-3 rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-5 text-left">
      <Heading level={3} size="sm">Tooltip with a shortcut</Heading>
      <div className="flex flex-wrap items-center gap-3">
        <Button leadingIcon={<Command aria-hidden weight="bold" />}>New message</Button>
        <span className="inline-flex items-center gap-2 rounded-lg bg-[var(--surface-3)] px-2.5 py-1.5 text-xs text-[var(--color-foreground)]">
          Compose <Kbd size="sm">C</Kbd>
        </span>
      </div>
      <Text size="sm" variant="muted">Press <Kbd size="sm">Shift</Kbd> + <Kbd size="sm">Enter</Kbd> to add a new line without sending.</Text>
    </div>
  )
}`

/* ---------------------------------------------------------------- GradientText and ChromaticText */

const MARKETING = "relative isolate flex min-h-[22rem] w-full flex-col items-center justify-center gap-5 overflow-hidden rounded-xl bg-[var(--surface-0)] px-6 py-14 text-center"

function GradientHero() {
  return (
    <section data-glin-theme="dark" aria-label="Product announcement" className={MARKETING}>
      <GradientText badge effect="shine">Now in public beta</GradientText>
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-6xl">
        Design systems that <GradientText>ship themselves</GradientText>
      </h1>
      <Text size="lg" variant="muted" className="max-w-xl">Sync tokens from Figma, open a pull request with the diff and publish a versioned package, all from one workflow.</Text>
      <div className="flex flex-wrap justify-center gap-3">
        <Button size="lg" trailingIcon={<ArrowRight aria-hidden weight="bold" />}>Join the beta</Button>
        <Button size="lg" variant="outline">Watch the demo</Button>
      </div>
    </section>
  )
}

const gradientHeroCode = `${IMPORT_ICON}import { Button, GradientText, Text } from "@glinui/ui"

export function Announcement() {
  return (
    <section data-glin-theme="dark" className="${MARKETING}">
      <GradientText badge effect="shine">Now in public beta</GradientText>
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-6xl">
        Design systems that <GradientText>ship themselves</GradientText>
      </h1>
      <Text size="lg" variant="muted" className="max-w-xl">Sync tokens from Figma, open a pull request with the diff and publish a versioned package, all from one workflow.</Text>
      <div className="flex flex-wrap justify-center gap-3">
        <Button size="lg" trailingIcon={<ArrowRight aria-hidden weight="bold" />}>Join the beta</Button>
        <Button size="lg" variant="outline">Watch the demo</Button>
      </div>
    </section>
  )
}`

function GradientVariants() {
  return (
    <div data-glin-theme="dark" className="flex w-full flex-col items-center gap-4 rounded-xl bg-[var(--surface-0)] p-8">
      <GradientText className="text-4xl font-semibold">Flow effect</GradientText>
      <GradientText effect="shine" className="text-4xl font-semibold">Shine effect</GradientText>
      <GradientText from="#38bdf8" to="#a78bfa" className="text-4xl font-semibold">Custom colors</GradientText>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <GradientText badge>Badge</GradientText>
        <GradientText badge variant="outline">Outline badge</GradientText>
        <GradientText badge variant="glass">Glass badge</GradientText>
      </div>
    </div>
  )
}

const gradientVariantsCode = `import { GradientText } from "@glinui/ui"

export function GradientVariants() {
  return (
    <div data-glin-theme="dark" className="flex w-full flex-col items-center gap-4 rounded-xl bg-[var(--surface-0)] p-8">
      <GradientText className="text-4xl font-semibold">Flow effect</GradientText>
      <GradientText effect="shine" className="text-4xl font-semibold">Shine effect</GradientText>
      <GradientText from="#38bdf8" to="#a78bfa" className="text-4xl font-semibold">Custom colors</GradientText>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <GradientText badge>Badge</GradientText>
        <GradientText badge variant="outline">Outline badge</GradientText>
        <GradientText badge variant="glass">Glass badge</GradientText>
      </div>
    </div>
  )
}`

function ChromaticHero() {
  return (
    <section data-glin-theme="dark" aria-label="Event teaser" className={MARKETING}>
      <Badge tone="accent" variant="soft">Live, Nov 12</Badge>
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-6xl">
        <ChromaticText>Signal</ChromaticText> Conf 2026
      </h1>
      <Text size="lg" variant="muted" className="max-w-xl">One day of talks on realtime systems, observability and the humans who carry the pager.</Text>
      <div className="flex flex-wrap justify-center gap-3">
        <Button size="lg">Get a ticket</Button>
        <Button size="lg" variant="outline">View speakers</Button>
      </div>
    </section>
  )
}

const chromaticHeroCode = `import { Badge, Button, ChromaticText, Text } from "@glinui/ui"

export function EventTeaser() {
  return (
    <section data-glin-theme="dark" className="${MARKETING}">
      <Badge tone="accent" variant="soft">Live, Nov 12</Badge>
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-6xl">
        <ChromaticText>Signal</ChromaticText> Conf 2026
      </h1>
      <Text size="lg" variant="muted" className="max-w-xl">One day of talks on realtime systems, observability and the humans who carry the pager.</Text>
      <div className="flex flex-wrap justify-center gap-3">
        <Button size="lg">Get a ticket</Button>
        <Button size="lg" variant="outline">View speakers</Button>
      </div>
    </section>
  )
}`

function ChromaticVariants() {
  return (
    <div data-glin-theme="dark" className="flex w-full flex-wrap items-center justify-center gap-x-10 gap-y-4 rounded-xl bg-[var(--surface-0)] p-8">
      <ChromaticText className="text-4xl font-semibold text-[var(--color-foreground)]">Default</ChromaticText>
      <ChromaticText duration={3} offset={3} className="text-4xl font-semibold text-[var(--color-foreground)]">Glitch</ChromaticText>
      <ChromaticText colors={["#06b6d4", "#f97316"]} offset={4} className="text-4xl font-semibold text-[var(--color-foreground)]">Neon</ChromaticText>
    </div>
  )
}

const chromaticVariantsCode = `import { ChromaticText } from "@glinui/ui"

export function ChromaticVariants() {
  return (
    <div data-glin-theme="dark" className="flex w-full flex-wrap items-center justify-center gap-x-10 gap-y-4 rounded-xl bg-[var(--surface-0)] p-8">
      <ChromaticText className="text-4xl font-semibold text-[var(--color-foreground)]">Default</ChromaticText>
      <ChromaticText duration={3} offset={3} className="text-4xl font-semibold text-[var(--color-foreground)]">Glitch</ChromaticText>
      <ChromaticText colors={["#06b6d4", "#f97316"]} offset={4} className="text-4xl font-semibold text-[var(--color-foreground)]">Neon</ChromaticText>
    </div>
  )
}`

const ex = (title: string, description: string, code: string, render: React.ReactNode): ComponentExample => ({ title, description, code, render })

export const typeExamples: Record<string, ComponentExample[]> = {
  heading: [
    ex("Article header", "Display heading with an eyebrow, lead, and byline. The size prop sets the scale, level sets the outline.", articleCode, <ArticleHero />),
    ex("Type scale", "Six sizes, independent of the semantic level.", scaleCode, <TypeScale />),
    ex("Variants", "Outline, ghost and glass surfaces. Glass needs a colorful backdrop behind it.", headingVariantsCode, <HeadingVariants />),
    ex("In a layout", "Card headings inside a blog index, level 2 for the section and level 3 for each post.", postsCode, <PostList />)
  ],
  text: [
    ex("Release note", "Eyebrow, lead, body and caption sizes build a clear reading order.", textHeroCode, <TextHero />),
    ex("Variants", "Default, muted, eyebrow, ghost and glass on a vivid backdrop.", textVariantsCode, <TextVariants />),
    ex("In a layout", "Short entries in a changelog, paired with Badge.", changelogCode, <ChangelogLayout />)
  ],
  link: [
    ex("Inline and footer links", "Links inside running text and in a footer column group.", linkHeroCode, <LinkHero />),
    ex("Variants", "Default, arrow, outline, ghost and glass.", linkVariantsCode, <LinkVariants />),
    ex("In a layout", "A guide card with a primary arrow link and a quieter secondary one.", linkCardCode, <LinkCard />)
  ],
  code: [
    ex("Inline code in docs", "Code marks identifiers, values and commands inside prose. The block variant sets a one line command apart.", codeHeroCode, <CodeHero />),
    ex("Variants and tones", "Surface variants plus tones for status values.", codeVariantsCode, <CodeVariants />)
  ],
  kbd: [
    ex("Shortcut sheet", "A command search field and a list of shortcuts, each with Kbd keycaps.", kbdHeroCode, <KbdHero />),
    ex("Variants and sizes", "Six surface variants and three sizes.", kbdVariantsCode, <KbdVariants />),
    ex("In a layout", "Shortcut hints next to a button and inline in helper text.", kbdLayoutCode, <KbdLayout />)
  ],
  "gradient-text": [
    ex("Launch announcement", "A shine badge and a flowing gradient phrase inside a headline on a dark section.", gradientHeroCode, <GradientHero />),
    ex("Effects and badges", "Flow and shine effects, custom colors, and badge surfaces.", gradientVariantsCode, <GradientVariants />)
  ],
  "chromatic-text": [
    ex("Event teaser", "Chromatic aberration on one word of a conference headline.", chromaticHeroCode, <ChromaticHero />),
    ex("Variants", "Default split, a fast glitch and neon channel colors.", chromaticVariantsCode, <ChromaticVariants />)
  ]
}

export const typeCode = (id: string, index: number): string => typeExamples[id][index].code
export const typeRender = (id: string, index: number): React.ReactNode => typeExamples[id][index].render
