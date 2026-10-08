import Image from "next/image"
import Link from "next/link"
import { GithubLogo, Heart } from "@phosphor-icons/react/dist/ssr"

import uiPackage from "../../../../../packages/ui/package.json"
import {
  bottomLinks,
  FREE_FOREVER_HREF,
  footerGroups,
  GLINCKER_URL,
  LICENSE_URL,
  REPO_URL
} from "@/lib/site-links"

import { FooterColumn, footerRing } from "./footer-columns"
import { ThemeToggle } from "@/components/theme-toggle"
import { FooterEcosystem } from "./footer-ecosystem"

const VERSION: string = uiPackage.version

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-[var(--line-soft)] bg-[var(--surface-0)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_repeat(4,1fr)]">
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Link href="/" className={`inline-flex items-center gap-2 rounded-md ${footerRing}`}>
              <Image src="/glincker-logo.png" alt="" width={24} height={24} unoptimized className="rounded-md dark:hidden" />
              <Image src="/glincker-logo.png" alt="" width={24} height={24} unoptimized className="hidden rounded-md invert dark:block" />
              <span className="text-sm font-semibold tracking-[-0.02em]">Glin UI</span>
            </Link>
            <p className="type-body max-w-xs text-[var(--color-muted)]">
              Free, open-source design hub for the modern web.
            </p>
            <p className="type-caption max-w-xs text-[var(--color-muted)]">
              MIT licensed and free forever.{" "}
              <Link href={FREE_FOREVER_HREF} className={`rounded-sm text-[var(--color-foreground)] underline underline-offset-2 ${footerRing}`}>
                Read the pledge
              </Link>
            </p>
            <Link
              href={REPO_URL}
              target="_blank"
              rel="noopener"
              className={`inline-flex min-h-11 items-center gap-2 rounded-md border border-[var(--line-soft)] px-3 text-sm text-[var(--color-foreground)] transition-colors hover:border-[var(--color-muted)] ${footerRing}`}
            >
              <GithubLogo aria-hidden className="size-4" />
              Star on GitHub
            </Link>
          </div>

          {footerGroups.map((group) => (
            <FooterColumn key={group.id} group={group} />
          ))}
        </div>

        <FooterEcosystem />

        <div className="mt-10 flex flex-col gap-4 border-t border-[var(--line-soft)] pt-6 type-caption text-[var(--color-muted)] lg:flex-row lg:items-center lg:justify-between">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>&copy; {year} GLINCKER.</span>
            <Link href={LICENSE_URL} target="_blank" rel="noopener" className={`rounded-sm underline-offset-2 hover:underline ${footerRing}`}>
              MIT License
            </Link>
            <span className="inline-flex items-center gap-1">
              Made with <Heart aria-hidden weight="fill" className="size-3" /> by
              <Link href={GLINCKER_URL} target="_blank" rel="noopener" className={`rounded-sm underline-offset-2 hover:underline ${footerRing}`}>
                GLINCKER
              </Link>
            </span>
            <span>v{VERSION}</span>
          </p>
          <div className="flex flex-wrap items-center gap-2">
          <ThemeToggle />
          <nav aria-label="Footer legal and feeds">
            <ul className="flex flex-wrap gap-x-1 gap-y-1">
              {bottomLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`inline-flex min-h-11 items-center rounded-sm px-2 hover:text-[var(--color-foreground)] ${footerRing}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
