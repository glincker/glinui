import type { GalleryItem } from "@/components/gallery/gallery-types"
import { buildComponentHref } from "@/lib/docs-route"
import { DEFAULT_DOCS_IMPLEMENTATION } from "@/lib/docs-config"
import {
  primitiveDescriptions,
  primitiveMaturity,
  signatureComponentIds,
  signatureDescriptions,
  type ComponentId
} from "@/lib/primitives"
import { getRegistryItem } from "@glinui/registry"
import { getCategories, getComponentsByCategory, getEntry, getFamily, getTitle } from "@/lib/taxonomy"

const signatureSet: ReadonlySet<string> = new Set(signatureComponentIds)

function describe(id: string): string {
  const known =
    (primitiveDescriptions as Record<string, string | undefined>)[id] ??
    (signatureDescriptions as Record<string, string | undefined>)[id]
  return known ?? `${getTitle(id)} component.`
}

function adaptedField(id: string): { adaptedFrom?: string } {
  const provenance = getRegistryItem(id)?.provenance
  return provenance ? { adaptedFrom: provenance.sourceName } : {}
}

/** Gallery items in taxonomy order. Unmapped ids land in the fallback category, never dropped. */
export function buildGalleryItems(): GalleryItem[] {
  let order = 0
  return getCategories().flatMap((category) =>
    getComponentsByCategory(category.id).map((id): GalleryItem => {
      const entry = getEntry(id)
      const familySize = getFamily(id).length
      return {
        id: id as ComponentId,
        title: getTitle(id),
        description: describe(id),
        href: buildComponentHref(id as ComponentId, DEFAULT_DOCS_IMPLEMENTATION),
        category: category.id,
        kind: signatureSet.has(id) ? "signature" : "primitive",
        maturity: (primitiveMaturity as Record<string, string>)[id] === "beta" ? "beta" : "stable",
        isNew: entry.tags.includes("new"),
        order: order++,
        tags: entry.tags,
        family: entry.family,
        hasVariants: Boolean(entry.base && familySize > 1),
        variantCount: Math.max(familySize - 1, 0),
        ...adaptedField(id)
      }
    })
  )
}
