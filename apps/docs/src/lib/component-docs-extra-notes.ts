import type { ComponentDocExtraMap } from "@/lib/component-docs-extra-types"

const STAGE_NOTE =
  "Overlay demos on this page render inside the preview stage so they stay contained. In your app they portal to the document body as usual."

/** Usage notes for the 2026 expansion components and the contained overlay demos. */
export const componentDocExtrasNotes: ComponentDocExtraMap = {
  field: {
    notes: [
      "FieldControl wires one child control to its Field. It clones the child and injects the generated id (matching the label htmlFor), aria-describedby pointing at the description and error, aria-invalid when an error is present and aria-required. Put exactly one control inside it.",
      "Unlike shadcn Field, which leaves id and aria wiring to you, Glin UI Field does it through FieldControl, so labels, hints and errors stay connected without manual ids. Controls rendered outside FieldControl are not wired."
    ]
  },
  sidebar: {
    notes: [
      "The sidebar animates its width when it collapses. Width is a documented exception to the transform and opacity only motion rule, because the content column must reflow with it. The transition is disabled under prefers-reduced-motion.",
      "Use containerClassName to control the docking element, for example static h-full when the sidebar lives inside a bounded frame instead of the viewport."
    ]
  },
  combobox: {
    notes: ["Combobox is single select only. For multiple selection, compose Popover with Command, or use a checkbox group."]
  },
  modal: { notes: [STAGE_NOTE] },
  "alert-dialog": { notes: [STAGE_NOTE] },
  sheet: { notes: [STAGE_NOTE] }
}
