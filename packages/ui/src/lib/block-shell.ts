import { cva } from "class-variance-authority"

import { resolveVariant } from "./surface"
import type { GlinStyle } from "./glin-config"

export type BlockLook = "glinr" | "plain" | "glass"

/** Shell of a marketing block. `glinr` is open (page canvas), `plain` is flat, `glass` is an opt-in translucent panel. */
export const blockShellVariants = cva("relative isolate w-full min-w-0", {
  variants: {
    look: {
      glinr: "",
      plain: "",
      glass:
        "overflow-hidden rounded-3xl border border-[var(--color-border)] [background:color-mix(in_oklab,var(--surface-1)_62%,transparent)] backdrop-blur-xl"
    }
  },
  defaultVariants: { look: "glinr" }
})

/** Resolve a block `variant` prop (or the ambient style) to one of the three block looks. */
export function resolveBlockLook(variant: string | null | undefined, ambient: GlinStyle): BlockLook {
  const resolved = resolveVariant(variant, ambient, "container")
  if (resolved === "glass") return "glass"
  if (resolved === "plain") return "plain"
  return "glinr"
}
