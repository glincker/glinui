import type { PrimitiveComponentId } from "@/lib/primitives"

/** Code-only example (no live preview) migrated from legacy MDX pages. */
export type ComponentDocExtraExample = {
  title: string
  description?: string
  code?: string
}

export type ComponentDocExtra = {
  /** Short notes rendered at the top of Usage (caveats, differences, documented exceptions). */
  notes?: string[]
  /** Additional accessibility notes appended to the accessibility list. */
  accessibility?: string[]
  /** Additional reduced motion guidance. */
  reducedMotion?: string
  /** Additional usage sections rendered under Usage. */
  examples?: ComponentDocExtraExample[]
}

export type ComponentDocExtraMap = Partial<Record<PrimitiveComponentId, ComponentDocExtra>>
