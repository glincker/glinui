import Link from "next/link"
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr"

import type { SiteLinkGroup } from "@/lib/site-links"

import { FooterIcon } from "./footer-icon"

export const footerRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-0)]"

export function FooterColumn({ group }: { group: SiteLinkGroup }) {
  return (
    <nav aria-label={`Footer ${group.title}`}>
      <h3 className="type-eyebrow mb-3">{group.title}</h3>
      <ul className="space-y-1">
        {group.links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noopener" } : {})}
              className={`inline-flex min-h-8 items-center gap-1.5 rounded-sm text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)] ${footerRing}`}
            >
              {link.icon ? <FooterIcon icon={link.icon} /> : null}
              {link.label}
              {link.external ? <ArrowSquareOut aria-hidden className="size-3 shrink-0" /> : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
