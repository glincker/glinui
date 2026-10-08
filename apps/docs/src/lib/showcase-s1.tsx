"use client"

// Showcase pass S1: buttons, forms and inputs. Heroes and layout examples are composed product UIs;
// code strings come from the demo sources via scripts/gen-showcase-s1-code.mjs.
import type { ComponentType } from "react"

import * as buttons from "@/components/demos/s1-buttons"
import * as forms from "@/components/demos/s1-forms"
import { s1Code } from "@/lib/showcase-s1-code"
import type { ComponentDocMeta, ComponentExample } from "@/lib/component-docs"
import type { PrimitiveComponentId } from "@/lib/primitives"

const demos: Record<string, ComponentType> = { ...buttons, ...forms } as unknown as Record<string, ComponentType>

function ex(title: string, name: string, description?: string): ComponentExample {
  const Demo = demos[name]
  return { title, description, code: s1Code[name] ?? "", render: <Demo /> }
}

type Plan = { hero: ComponentExample; keep: string[] | "rest"; extras?: ComponentExample[] }

const BRAND_NOTE = "Logos come from the docs BrandIcon helper; use your own marks in your app."

const plans: Record<string, Plan> = {
  button: {
    hero: ex("Default", "ButtonActionBar", "An editor action bar: a destructive soft button, a ghost cancel and a solid save that shows its loading state."),
    keep: ["Variants", "Glass (opt-in)"],
    extras: [
      ex("Sizes, icons and states", "ButtonStatesDemo", "Five sizes, leading and trailing icons, loading and disabled."),
      ex("In a layout", "ButtonPageHeader", "A page header with a quiet filter, an outline export and one primary action.")
    ]
  },
  "interactive-hover-button": { hero: ex("Default", "HoverButtonCta", "Hover, focus or press the button to flood it with the accent."), keep: ["Variants", "Glass (opt-in)", "Sizes, icons and states"] },
  "generate-button": { hero: ex("Default", "GenerateCompose", "Click to enter the glowing generating state, click again to stop."), keep: ["Variants", "Glass (opt-in)", "Hue, icon and loading"] },
  "button-group": {
    hero: ex("Default", "ButtonGroupToolbar", "A range switcher and a split merge action sharing merged borders."),
    keep: ["Variants", "Glass (opt-in)"],
    extras: [ex("Quantity stepper", "ToggleStepper", "Icon buttons around a live value make a compact stepper.")]
  },
  "copy-button": { hero: ex("Default", "CopyApiKey", "Labelled and icon-only copy buttons announce the result to screen readers."), keep: "rest" },
  toggle: { hero: ex("Default", "ToggleEditorToolbar", "Toggles and toggle groups in an editor toolbar."), keep: ["Variants", "Glass (opt-in)", "State matrix"] },
  "toggle-group": { hero: ex("Default", "ToggleViewSwitcher", "A single-select group that switches the layout of a list."), keep: ["Variants", "Multiple with spacing", "Glass (opt-in)"] },
  input: {
    hero: ex("Default", "InputSignUpForm", "A sign-up form with helper text, live error and success states. Try admin as the username."),
    keep: ["Variants", "Glass (opt-in)"],
    extras: [ex("States and sizes", "InputStatesDemo", "Empty, filled, invalid, disabled and the size scale, all labelled through Field.")]
  },
  textarea: { hero: ex("Default", "TextareaFeedbackForm", "A feedback form with a live character counter."), keep: ["Variants", "Glass (opt-in)"] },
  select: { hero: ex("Default", "SelectPreferences", "A settings panel with a label, helper text and a select per row."), keep: ["Variants", "Sizes", "Glass (opt-in)"] },
  combobox: { hero: ex("Default", "ComboboxFrameworkPicker", `A searchable picker kept in sync with quick-pick chips. ${BRAND_NOTE}`), keep: ["Variants", "Glass (opt-in)"] },
  "input-group": { hero: ex("Default", "InputGroupShare", "Icon, text, button and keyboard hint addons share one container."), keep: ["Variants", "Glass (opt-in)"] },
  "input-otp": { hero: ex("Default", "InputOtpVerify", "A verify-email card with a resend countdown. Typing a sixth digit verifies."), keep: ["Variants", "Alphanumeric", "Glass (opt-in)"] },
  field: { hero: ex("Default", "FieldCheckoutForm", "A full checkout form: fieldsets, descriptions, an error and a grouped card input."), keep: ["Label, description, error", "Invalid"] },
  label: { hero: ex("Default", "LabelPairings", "Labels for inputs, a checkbox and a switch, with required and optional markers."), keep: ["Variants"] },
  checkbox: { hero: ex("Default", "CheckboxColumns", "A select-all checkbox with an indeterminate state."), keep: ["Variants and sizes", "Glass (opt-in)"] },
  "radio-group": { hero: ex("Default", "RadioPlanPicker", "Card-style radios inside labels, with the checked card highlighted."), keep: ["Variants and sizes", "Glass (opt-in)"] },
  slider: { hero: ex("Default", "SliderPriceFilter", "A range slider with a live readout and a single volume slider."), keep: ["Variants", "Sizes", "Glass (opt-in)"] },
  switch: { hero: ex("Default", "SwitchNotifications", "A notification settings list where each switch is described by its note."), keep: ["State matrix", "Variants", "Glass (opt-in)"] },
  "prompt-input": { hero: ex("Default", "PromptComposer", "A chat composer with removable attachment chips and an attach action."), keep: ["Variants", "Loading", "Glass (opt-in)"] }
}

export const showcaseS1Ids = Object.keys(plans)

export function applyS1Showcase(docs: Record<PrimitiveComponentId, ComponentDocMeta>): void {
  for (const [id, plan] of Object.entries(plans)) {
    const key = id as PrimitiveComponentId
    const meta = docs[key]
    if (!meta) continue
    const existing = meta.examples.slice(1)
    const kept = plan.keep === "rest" ? existing : meta.examples.filter((item) => (plan.keep as string[]).includes(item.title))
    docs[key] = { ...meta, examples: [plan.hero, ...kept, ...(plan.extras ?? [])] }
  }
}
