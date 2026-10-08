import { componentDocExtrasA } from "@/lib/component-docs-extra-a"
import { componentDocExtrasB } from "@/lib/component-docs-extra-b"
import type { ComponentDocExtra, ComponentDocExtraMap } from "@/lib/component-docs-extra-types"
import { componentDocExtrasNotes } from "@/lib/component-docs-extra-notes"
import { variantsTheauthExtras } from "@/lib/new-components/variants-theauth"
import type { PrimitiveComponentId } from "@/lib/primitives"

export type { ComponentDocExtra, ComponentDocExtraExample } from "@/lib/component-docs-extra-types"

function mergeExtras(): ComponentDocExtraMap {
  const merged: ComponentDocExtraMap = { ...componentDocExtrasA, ...componentDocExtrasB }
  for (const [id, examples] of Object.entries(variantsTheauthExtras)) {
    const key = id as PrimitiveComponentId
    const base = merged[key] ?? {}
    merged[key] = { ...base, examples: [...(base.examples ?? []), ...examples] }
  }
  for (const [id, extra] of Object.entries(componentDocExtrasNotes)) {
    const key = id as PrimitiveComponentId
    merged[key] = { ...(merged[key] ?? {}), ...extra }
  }
  return merged
}

export const componentDocExtras: ComponentDocExtraMap = mergeExtras()

export function getComponentDocExtra(id: PrimitiveComponentId): ComponentDocExtra {
  return componentDocExtras[id] ?? {}
}
