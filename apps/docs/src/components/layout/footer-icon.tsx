import { ChatsCircle, Bug, Globe, UserCircle } from "@phosphor-icons/react/dist/ssr"

import { BrandIcon } from "@/components/brand/brand-icon"
import { OwnLogo, type OwnLogoName } from "@/components/brand/own-logos"
import type { SiteIconKey } from "@/lib/site-links"

const phosphor = {
  user: UserCircle,
  globe: Globe,
  discussions: ChatsCircle,
  issues: Bug
} as const

/** Decorative 20px mark for a footer link. The link text carries the accessible name. */
export function FooterIcon({ icon }: { icon: SiteIconKey }) {
  const [kind, name] = icon.split(":") as ["brand" | "own" | "ph", string]
  if (kind === "brand") {
    return (
      <span aria-hidden className="inline-flex size-5 shrink-0 items-center justify-center text-[var(--color-foreground)]">
        <BrandIcon name={name as "github" | "npm"} size={20} variant="mono" />
      </span>
    )
  }
  if (kind === "own") return <OwnLogo name={name as OwnLogoName} className="size-5 shrink-0" />
  const Icon = phosphor[name as keyof typeof phosphor]
  return <Icon aria-hidden className="size-5 shrink-0 text-[var(--color-muted)]" />
}
