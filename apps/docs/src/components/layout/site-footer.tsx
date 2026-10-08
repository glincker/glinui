import Image from "next/image"
import Link from "next/link"
import { ArrowSquareOut, GithubLogo } from "@phosphor-icons/react/dist/ssr"

type FooterLinkItem = { href: string; label: string; external?: boolean }

const columns: Array<{ title: string; links: FooterLinkItem[] }> = [
  {
    title: "Product",
    links: [
      { href: "/docs/components", label: "Components" },
      { href: "/docs/animations", label: "Animations" },
      { href: "/docs/colors", label: "Colors" },
      { href: "/docs/tokens", label: "Tokens" },
      { href: "/docs/motion", label: "Motion" }
    ]
  },
  {
    title: "Resources",
    links: [
      { href: "/docs/getting-started", label: "Getting Started" },
      { href: "/docs/accessibility", label: "Accessibility Hub" },
      { href: "/docs/api-metadata", label: "API Metadata" },
      { href: "/docs/directory", label: "Directory" },
      { href: "/docs/ai", label: "AI-ready docs" },
      { href: "/docs/attribution", label: "Attribution" },
      { href: "/docs/free-forever", label: "Free forever" }
    ]
  },
  {
    title: "Compare",
    links: [
      { href: "/docs/shadcn-alternative", label: "Glin UI vs shadcn/ui" },
      { href: "/docs/magicui-alternative", label: "vs Magic UI" },
      { href: "/docs/radix-ui-components", label: "Radix UI Components" },
      { href: "/docs/glassmorphism-react-components", label: "Glassmorphism React Components" }
    ]
  },
  {
    title: "Community",
    links: [
      { href: "https://github.com/GLINCKER/glinui", label: "GitHub", external: true },
      { href: "https://github.com/GLINCKER/glinui/discussions", label: "Discussions", external: true },
      { href: "https://www.npmjs.com/package/@glinui/ui", label: "npm @glinui/ui", external: true }
    ]
  }
]

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line-soft)] bg-[var(--surface-0)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Link href="/" className={`inline-flex items-center gap-2 rounded-md ${ring}`}>
              <Image src="/glincker-logo.png" alt="" width={24} height={24} unoptimized className="rounded-md dark:hidden" />
              <Image src="/glincker-logo.png" alt="" width={24} height={24} unoptimized className="hidden rounded-md invert dark:block" />
              <span className="text-sm font-semibold tracking-[-0.02em]">Glin UI</span>
            </Link>
            <p className="type-body max-w-xs text-[var(--color-muted)]">Design modern UI for the modern web.</p>
            <Link
              href="https://github.com/GLINCKER/glinui"
              target="_blank"
              rel="noreferrer"
              aria-label="Glin UI on GitHub"
              className={`inline-flex size-8 items-center justify-center rounded-md border border-[var(--line-soft)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] ${ring}`}
            >
              <GithubLogo className="size-4" />
            </Link>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={`Footer ${column.title}`}>
              <p className="type-eyebrow mb-3">{column.title}</p>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
                      className={`rounded-sm text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)] ${ring}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-[var(--line-soft)] pt-6 type-caption text-[var(--color-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            MIT License.{" "}
            <Link
              href="https://github.com/GLINCKER/glinui/blob/main/LICENSE"
              target="_blank"
              rel="noreferrer"
              className={`rounded-sm underline-offset-2 hover:underline ${ring}`}
            >
              View license
            </Link>
          </p>
          <Link
            href="https://glincker.com"
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-1 rounded-sm hover:text-[var(--color-foreground)] ${ring}`}
          >
            A GLINR product
            <ArrowSquareOut className="size-3" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
