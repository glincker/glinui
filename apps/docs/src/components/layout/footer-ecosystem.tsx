import Link from "next/link"
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr"

import { ecosystemLinks, GLINCKER_URL } from "@/lib/site-links"

import { footerRing } from "./footer-columns"
import { FooterIcon } from "./footer-icon"

export function FooterEcosystem() {
  return (
    <nav aria-label="Built by GLINCKER" className="mt-10 border-t border-[var(--line-soft)] pt-8">
      <h3 className="type-eyebrow mb-4">
        Built by{" "}
        <Link
          href={GLINCKER_URL}
          target="_blank"
          rel="noopener"
          className={`rounded-sm underline-offset-2 hover:underline ${footerRing}`}
        >
          GLINCKER
        </Link>
      </h3>
      <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-6 lg:[[data-docs-scroll-root]_&]:grid-cols-2 xl:[[data-docs-scroll-root]_&]:grid-cols-6">
        {ecosystemLinks.map((link) => (
          <li key={link.href} className="lg:col-span-2 lg:[[data-docs-scroll-root]_&]:col-span-1 xl:[[data-docs-scroll-root]_&]:col-span-2">
            <Link
              href={link.href}
              target="_blank"
              rel="noopener"
              className={`group flex h-full min-h-11 flex-col rounded-lg border border-[var(--line-soft)] bg-[var(--surface-1)] px-3 py-2 transition-colors hover:border-[var(--color-muted)] ${footerRing}`}
            >
              <span className="inline-flex items-center justify-between gap-2 text-sm font-medium text-[var(--color-foreground)]">
                <span className="inline-flex items-center gap-2">
                  {link.icon ? <FooterIcon icon={link.icon} /> : null}
                  {link.label}
                </span>
                <ArrowUpRight aria-hidden className="size-3.5 text-[var(--color-muted)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" />
              </span>
              <span className="type-caption text-[var(--color-muted)]">{link.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
