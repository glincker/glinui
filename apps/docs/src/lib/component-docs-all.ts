import { componentDocs, type ComponentDocMeta } from "@/lib/component-docs"
import { batch1Docs } from "@/lib/new-components/batch-1"
import { batch2Docs } from "@/lib/new-components/batch-2"
import { batch3Docs } from "@/lib/new-components/batch-3"
import { batch4Docs } from "@/lib/new-components/batch-4"
import { batchA1Docs } from "@/lib/new-components/batch-a1"
import { batchA2Docs } from "@/lib/new-components/batch-a2"
import { batchA3Docs } from "@/lib/new-components/batch-a3"
import { batchA4Docs } from "@/lib/new-components/batch-a4"
import { batchB1Docs } from "@/lib/new-components/batch-b1"
import { batchB2Docs } from "@/lib/new-components/batch-b2"
import { batchB3Docs } from "@/lib/new-components/batch-b3"
import { batchB4Docs } from "@/lib/new-components/batch-b4"
import { enginesDocs } from "@/lib/new-components/engines-docs"
import { modalGlassExample } from "@/lib/new-components/modal-glass-example"
import { panelGlassExamples, panelVariantsExamples } from "@/lib/new-components/panel-variants-examples"
import { applyShowcaseS4 } from "@/lib/new-components/showcase-s4"
import { mergeShowcaseS2, showcaseS2 } from "@/lib/new-components/showcase-s2"
import { applyS3Showcase } from "@/lib/showcase-s3"
import { applyS1Showcase } from "@/lib/showcase-s1"
import { applyS5Showcase } from "@/lib/showcase-s5"
import { variantsTheauthDocs } from "@/lib/new-components/variants-theauth-docs"
import type { PrimitiveComponentId } from "@/lib/primitives"

/** Every primitive's docs data: the original set plus the 2026 expansion batches. */
export const allComponentDocs: Record<PrimitiveComponentId, ComponentDocMeta> = {
  ...componentDocs,
  ...batch1Docs,
  ...batch2Docs,
  ...batch3Docs,
  ...batch4Docs,
  ...batchA1Docs,
  ...batchA2Docs,
  ...batchA3Docs,
  ...batchA4Docs,
  ...batchB1Docs,
  ...batchB2Docs,
  ...batchB3Docs,
  ...batchB4Docs,
  ...variantsTheauthDocs,
  ...enginesDocs
} as Record<PrimitiveComponentId, ComponentDocMeta>

applyShowcaseS4(allComponentDocs)

/* Showcase pass S2: navigation and overlay components get composed hero demos. */
for (const id of Object.keys(showcaseS2)) {
  const key = id as PrimitiveComponentId
  allComponentDocs[key] = mergeShowcaseS2(id, allComponentDocs[key])
}

const baseModal = allComponentDocs.modal
if (!baseModal.examples.some((example) => example.title === modalGlassExample.title)) {
  allComponentDocs.modal = { ...baseModal, examples: [...baseModal.examples, modalGlassExample] }
}

/* Floating panel family: append the "Variants" matrix (and keep "Glass (opt-in)" examples after it). */
for (const [id, example] of Object.entries(panelVariantsExamples)) {
  const key = id as PrimitiveComponentId
  const meta = allComponentDocs[key]
  if (meta && !meta.examples.some((existing) => existing.title === example.title)) {
    const glassIndex = meta.examples.findIndex((existing) => existing.title.startsWith("Glass"))
    const examples = [...meta.examples]
    examples.splice(glassIndex === -1 ? examples.length : glassIndex, 0, example)
    allComponentDocs[key] = { ...meta, examples }
  }
}

for (const [id, example] of Object.entries(panelGlassExamples)) {
  const key = id as PrimitiveComponentId
  const meta = allComponentDocs[key]
  if (meta && !meta.examples.some((existing) => existing.title === example.title)) {
    allComponentDocs[key] = { ...meta, examples: [...meta.examples, example] }
  }
}

/* Showcase pass S3: feedback, data display and layout components get composed hero demos. */
applyS3Showcase(allComponentDocs)

/* Showcase pass S1: buttons, forms and inputs get composed hero demos. */
applyS1Showcase(allComponentDocs)
applyS5Showcase(allComponentDocs)
