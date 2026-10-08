import { resolveVariant } from "../lib/surface"
import type { GlinStyle } from "../lib/glin-config"

/** Shell look shared by the marketing blocks. `glass` is opt-in and needs a backdrop. */
export type BlockVariant = "glinr" | "plain" | "glass"

/** Resolve a block variant: omitted follows the ambient style (glinr by default, plain under minimal). */
export function resolveBlockVariant(variant: string | null | undefined, ambient: GlinStyle): BlockVariant {
  const v = resolveVariant(variant, ambient, "container")
  if (v === "glass") return "glass"
  if (v === "plain") return "plain"
  return "glinr"
}
