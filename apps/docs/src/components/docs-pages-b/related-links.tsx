import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"

export type RelatedLink = { href: string; label: string; description?: string }

/** Hairline list of related pages. */
export function RelatedLinks({ links, heading = "Related guides" }: { links: RelatedLink[]; heading?: string }) {
  return (
    <nav aria-label={heading} className="space-y-3">
      <h2 className="type-h3">{heading}</h2>
      <ul className="divide-y divide-line-soft rounded-card border border-line-soft bg-surface-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group flex items-center justify-between gap-4 px-4 py-3 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-accent)]"
            >
              <span className="min-w-0">
                <span className="block text-sm font-medium">{link.label}</span>
                {link.description ? <span className="block text-sm text-muted">{link.description}</span> : null}
              </span>
              <ArrowRight
                className="size-4 shrink-0 text-muted transition-transform motion-reduce:transition-none group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
