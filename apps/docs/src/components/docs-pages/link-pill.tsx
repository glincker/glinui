import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"

type LinkPillProps = {
  href: string
  children: React.ReactNode
  primary?: boolean
}

/** Quiet link button used for page-level calls to action. */
export function LinkPill({ href, children, primary = false }: LinkPillProps) {
  return (
    <Link
      href={href}
      className={
        primary
          ? "inline-flex h-9 items-center gap-1.5 rounded-input bg-brand px-3.5 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
          : "inline-flex h-9 items-center gap-1.5 rounded-input border border-line-soft bg-surface-1 px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand motion-reduce:transition-none"
      }
    >
      {children}
      <ArrowRight className="size-3.5" aria-hidden="true" />
    </Link>
  )
}
