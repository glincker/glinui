import { BrandIcon } from "./brand-icon"
import type { BrandName } from "./brands"

/** Small inline "logo + text" tag for page headers. The text names the brand, so the mark is decorative. */
export function BrandTag({ name, children }: { name: BrandName; children: React.ReactNode }) {
  return (
    <span className="inline-flex h-9 items-center gap-2 rounded-input border border-line-soft px-3 text-sm text-muted">
      <BrandIcon name={name} size={16} />
      {children}
    </span>
  )
}
