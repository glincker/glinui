import Image from "next/image"

import { BrandIcon } from "./brand-icon"
import { BRANDS, BRAND_FOOTNOTE, type BrandName } from "./brands"

type CompareLockupProps = {
  /** thesvg mark for the other side of the comparison. */
  other: BrandName
  /** Text between the two marks. "vs" for alternatives, "on" for stack pages. */
  joiner?: "vs" | "on"
}

const chip =
  "inline-flex items-center gap-2.5 rounded-card border border-line-soft bg-surface-1 py-2 pl-2.5 pr-3.5 text-sm font-medium shadow-elev-1"

/** Glin UI mark next to the compared project's mark. Honest, neutral pairing; no ranking implied. */
export function CompareLockup({ other, joiner = "vs" }: CompareLockupProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <span className={chip}>
          <Image src="/glincker-logo.png" alt="" width={24} height={24} unoptimized className="size-6 rounded-md dark:hidden" />
          <Image
            src="/glincker-logo.png"
            alt=""
            width={24}
            height={24}
            unoptimized
            className="hidden size-6 rounded-md invert dark:block"
          />
          Glin UI
        </span>
        <span className="type-eyebrow" aria-hidden="true">
          {joiner}
        </span>
        <span className={chip}>
          <BrandIcon name={other} size={24} />
          {BRANDS[other].label}
        </span>
      </div>
      <p className="text-xs text-muted">{BRAND_FOOTNOTE}</p>
    </div>
  )
}
