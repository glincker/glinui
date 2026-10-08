"use client"

import { Combobox } from "@glinui/ui"
import { Field, FieldControl, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@glinui/ui"
import { Input } from "@glinui/ui"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@glinui/ui"
import type { ComponentDocMeta } from "../component-docs"

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro", keywords: ["islands"] },
  { value: "nuxt", label: "Nuxt" },
  { value: "sveltekit", label: "SvelteKit" }
]

const frameworksCode = `const frameworks = [\n  { value: "next", label: "Next.js" },\n  { value: "remix", label: "Remix" },\n  { value: "astro", label: "Astro", keywords: ["islands"] },\n  { value: "nuxt", label: "Nuxt" },\n  { value: "sveltekit", label: "SvelteKit" }\n]\n`

export const batch2bDocs: Record<string, ComponentDocMeta> = {
  "input-otp": {
    badge: "Primitive / Molecule",
    props: [
      {
        title: "InputOTP",
        rows: [
          { prop: "maxLength", type: "number", description: "Required. Number of characters." },
          { prop: "value | defaultValue", type: "string", description: "Controlled or initial value." },
          { prop: "onChange", type: "(value: string) => void", description: "Fires on every accepted change." },
          { prop: "onComplete", type: "(value: string) => void", description: "Fires once when all slots are filled." },
          { prop: "pattern", type: "string", defaultValue: "REGEXP_ONLY_DIGITS", description: "Regex source the whole value must match. Also exported: REGEXP_ONLY_CHARS, REGEXP_ONLY_DIGITS_AND_CHARS." },
          { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "glass"', defaultValue: 'ambient (glinr)', description: 'Slot look. Omit to follow the ambient design style. Glass is opt-in.' },
          { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Slot size." },
          { prop: "autoComplete", type: "string", defaultValue: "one-time-code", description: "Enables SMS and password manager autofill." }
        ]
      },
      { title: "InputOTPSlot", rows: [{ prop: "index", type: "number", description: "Required. Zero-based position rendered by the slot." }] },
      { title: "InputOTPGroup / InputOTPSeparator", rows: [{ prop: "className", type: "string", description: "Layout grouping and visual divider." }] }
    ],
    accessibility: {
      summary: ["A single real `input` carries focus, value and the accessible name, so screen readers announce one field, not N boxes.", "Slots are `aria-hidden` visuals.", "Paste and one-time-code autofill fill every slot at once.", "Default `aria-label` is Verification code; override it."],
      keyboard: [{ key: "0-9 / characters", description: "Fill the active slot and advance." }, { key: "Backspace", description: "Delete the previous character." }, { key: "Arrow Left / Right", description: "Move the caret (mirrored in RTL)." }, { key: "Home / End", description: "Jump to first slot or end." }, { key: "Ctrl/Cmd + V", description: "Paste a full code." }],
      aria: ["`aria-label` on the input", "`aria-invalid` highlights every slot", "`inputmode=\"numeric\"` for digit patterns"]
    },
    reducedMotion: { description: "The blinking caret and colour transitions are disabled under prefers-reduced-motion.", affected: ["caret opacity pulse", "border-color"] },
    examples: [
      {
        title: "Six digits",
        code: `${`import { InputOTP, InputOTPGroup, InputOTPSlot } from "@glinui/ui"`}\n\nexport function Demo() {\n  return (\n    <InputOTP maxLength={6}>\n      <InputOTPGroup>\n        {[0, 1, 2, 3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} />)}\n      </InputOTPGroup>\n    </InputOTP>\n  )\n}`,
        render: (
          <InputOTP maxLength={6}>
            <InputOTPGroup>{[0, 1, 2, 3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
          </InputOTP>
        )
      },
      {
        title: "Variants",
        code: `import { InputOTP, InputOTPGroup, InputOTPSlot } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="flex flex-col items-start gap-3">\n      <InputOTP maxLength={4} variant="glinr" defaultValue="12" aria-label="glinr">\n        <InputOTPGroup>{[0, 1, 2, 3].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>\n      </InputOTP>\n      <InputOTP maxLength={4} variant="solid" defaultValue="12" aria-label="solid">\n        <InputOTPGroup>{[0, 1, 2, 3].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>\n      </InputOTP>\n      <InputOTP maxLength={4} variant="plain" defaultValue="12" aria-label="plain">\n        <InputOTPGroup>{[0, 1, 2, 3].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>\n      </InputOTP>\n      <InputOTP maxLength={4} variant="soft" defaultValue="12" aria-label="soft">\n        <InputOTPGroup>{[0, 1, 2, 3].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>\n      </InputOTP>\n      <InputOTP maxLength={4} variant="outline" defaultValue="12" aria-label="outline">\n        <InputOTPGroup>{[0, 1, 2, 3].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>\n      </InputOTP>\n      <InputOTP maxLength={4} variant="ghost" defaultValue="12" aria-label="ghost">\n        <InputOTPGroup>{[0, 1, 2, 3].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>\n      </InputOTP>\n    </div>\n  )\n}`,
        render: (
          <div className="flex flex-col items-start gap-3">
            <InputOTP maxLength={4} variant="glinr" defaultValue="12" aria-label="glinr">
              <InputOTPGroup>{[0, 1, 2, 3].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
            </InputOTP>
            <InputOTP maxLength={4} variant="solid" defaultValue="12" aria-label="solid">
              <InputOTPGroup>{[0, 1, 2, 3].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
            </InputOTP>
            <InputOTP maxLength={4} variant="plain" defaultValue="12" aria-label="plain">
              <InputOTPGroup>{[0, 1, 2, 3].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
            </InputOTP>
            <InputOTP maxLength={4} variant="soft" defaultValue="12" aria-label="soft">
              <InputOTPGroup>{[0, 1, 2, 3].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
            </InputOTP>
            <InputOTP maxLength={4} variant="outline" defaultValue="12" aria-label="outline">
              <InputOTPGroup>{[0, 1, 2, 3].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
            </InputOTP>
            <InputOTP maxLength={4} variant="ghost" defaultValue="12" aria-label="ghost">
              <InputOTPGroup>{[0, 1, 2, 3].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
            </InputOTP>
          </div>
        )
      },
      {
        title: "Grouped with separator",
        code: `import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <InputOTP maxLength={6} defaultValue="123">\n      <InputOTPGroup>\n        {[0, 1, 2].map((i) => <InputOTPSlot key={i} index={i} />)}\n      </InputOTPGroup>\n      <InputOTPSeparator />\n      <InputOTPGroup>\n        {[3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} />)}\n      </InputOTPGroup>\n    </InputOTP>\n  )\n}`,
        render: (
          <InputOTP maxLength={6} defaultValue="123">
            <InputOTPGroup>{[0, 1, 2].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>{[3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
          </InputOTP>
        )
      },
      {
        title: "Alphanumeric",
        code: `import { InputOTP, InputOTPGroup, InputOTPSlot, REGEXP_ONLY_DIGITS_AND_CHARS } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <InputOTP maxLength={4} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} defaultValue="A1">\n      <InputOTPGroup>{[0, 1, 2, 3].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>\n    </InputOTP>\n  )\n}`,
        render: (
          <InputOTP maxLength={4} pattern="^[a-zA-Z0-9]+$" defaultValue="A1">
            <InputOTPGroup>{[0, 1, 2, 3].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
          </InputOTP>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it: pick Photo or Vivid in the stage backdrop switcher.",
        code: `import { InputOTP, InputOTPGroup, InputOTPSlot } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <InputOTP maxLength={4} variant="glass" defaultValue="12">\n      <InputOTPGroup>{[0, 1, 2, 3].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>\n    </InputOTP>\n  )\n}`,
        render: (
          <InputOTP maxLength={4} variant="glass" defaultValue="12">
            <InputOTPGroup>{[0, 1, 2, 3].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
          </InputOTP>
        )
      }
    ]
  },

  field: {
    badge: "Primitive / Molecule",
    props: [
      {
        title: "Field",
        rows: [
          { prop: "orientation", type: '"vertical" | "horizontal" | "responsive"', defaultValue: "vertical", description: "Label and control layout. Responsive stacks on small screens." },
          { prop: "invalid", type: "boolean", defaultValue: "false", description: "Marks the control aria-invalid and tints the label." },
          { prop: "disabled", type: "boolean", defaultValue: "false", description: "Disables the control and dims the field." }
        ]
      },
      { title: "FieldControl", rows: [{ prop: "children", type: "ReactElement", description: "Single control. Receives the generated id, aria-describedby, aria-invalid and disabled." }] },
      { title: "FieldError", rows: [{ prop: "errors", type: "Array<{ message?: string }>", description: "Messages from a form library; duplicates collapse. Renders nothing when empty." }] },
      { title: "FieldLabel, FieldDescription, FieldContent, FieldTitle, FieldGroup, FieldSet, FieldLegend, FieldSeparator", rows: [{ prop: "className", type: "string", description: "Layout and typography parts. FieldLegend takes variant legend or label." }] }
    ],
    accessibility: {
      summary: ["Each Field generates ids so the label `htmlFor`, description and error are wired automatically via FieldControl.", "FieldError uses `role=\"alert\"` so errors are announced.", "`aria-describedby` only lists parts that are rendered.", "FieldSet and FieldLegend use native fieldset and legend semantics."],
      keyboard: [{ key: "Tab", description: "Moves through controls; clicking a label focuses its control." }],
      aria: ["`aria-describedby` with description and error ids", "`aria-invalid` when invalid or an error is rendered", "`role=\"alert\"` on errors"]
    },
    reducedMotion: { description: "Field is layout only and has no motion of its own." },
    examples: [
      {
        title: "Label, description, error",
        code: `import { Field, FieldControl, FieldDescription, FieldError, FieldLabel } from "@glinui/ui"\nimport { Input } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Field>\n      <FieldLabel>Email</FieldLabel>\n      <FieldControl><Input type="email" placeholder="name@example.com" /></FieldControl>\n      <FieldDescription>We never share your email.</FieldDescription>\n      <FieldError>Enter a valid email address.</FieldError>\n    </Field>\n  )\n}`,
        render: (
          <div className="w-full max-w-sm">
            <Field>
              <FieldLabel>Email</FieldLabel>
              <FieldControl><Input type="email" placeholder="name@example.com" /></FieldControl>
              <FieldDescription>We never share your email.</FieldDescription>
              <FieldError>Enter a valid email address.</FieldError>
            </Field>
          </div>
        )
      },
      {
        title: "FieldSet",
        description: "Field wraps any control. The default Input is the glinr inset well; the label turns red and the control gets a red ring when invalid.",
        code: `import { Field, FieldControl, FieldGroup, FieldLabel, FieldLegend, FieldSet, Input } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="w-full max-w-sm">\n      <FieldSet>\n        <FieldLegend>Profile</FieldLegend>\n        <FieldGroup>\n          <Field><FieldLabel>Name</FieldLabel><FieldControl><Input /></FieldControl></Field>\n          <Field><FieldLabel>Handle</FieldLabel><FieldControl><Input /></FieldControl></Field>\n        </FieldGroup>\n      </FieldSet>\n    </div>\n  )\n}`,
        render: (
          <div className="w-full max-w-sm">
            <FieldSet>
              <FieldLegend>Profile</FieldLegend>
              <FieldGroup>
                <Field><FieldLabel>Name</FieldLabel><FieldControl><Input /></FieldControl></Field>
                <Field><FieldLabel>Handle</FieldLabel><FieldControl><Input /></FieldControl></Field>
              </FieldGroup>
            </FieldSet>
          </div>
        )
      },
      {
        title: "Invalid",
        code: `import { Field, FieldControl, FieldError, FieldLabel } from "@glinui/ui"\nimport { Input } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Field invalid>\n      <FieldLabel>Username</FieldLabel>\n      <FieldControl><Input defaultValue="a" /></FieldControl>\n      <FieldError errors={[{ message: "At least 3 characters" }]} />\n    </Field>\n  )\n}`,
        render: (
          <div className="w-full max-w-sm">
            <Field invalid>
              <FieldLabel>Username</FieldLabel>
              <FieldControl><Input defaultValue="a" /></FieldControl>
              <FieldError errors={[{ message: "At least 3 characters" }]} />
            </Field>
          </div>
        )
      },
      {
        title: "Plain controls",
        description: "Pass variant=plain for the flat shadcn field look.",
        code: `import { Field, FieldControl, FieldLabel, Input } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="w-full max-w-sm">\n      <Field>\n        <FieldLabel>Email</FieldLabel>\n        <FieldControl><Input variant="plain" type="email" placeholder="name@example.com" /></FieldControl>\n      </Field>\n    </div>\n  )\n}`,
        render: (
          <div className="w-full max-w-sm">
            <Field>
              <FieldLabel>Email</FieldLabel>
              <FieldControl><Input variant="plain" type="email" placeholder="name@example.com" /></FieldControl>
            </Field>
          </div>
        )
      }
    ]
  },

  combobox: {
    badge: "Primitive / Molecule",
    props: [
      { prop: "options", type: "{ value: string; label: string; keywords?: string[]; disabled?: boolean }[]", description: "Required. Selectable items." },
      { prop: "value | defaultValue", type: "string", description: "Controlled or initial selection." },
      { prop: "onValueChange", type: "(value: string) => void", description: "Fires on selection. Empty string means cleared." },
      { prop: "open | onOpenChange", type: "boolean | (open: boolean) => void", description: "Controlled popover state." },
      { prop: "placeholder", type: "string", defaultValue: "Select an option", description: "Trigger text with no selection." },
      { prop: "searchPlaceholder", type: "string", defaultValue: "Search...", description: "Placeholder of the filter input." },
      { prop: "emptyText", type: "string", defaultValue: "No results found.", description: "Shown when nothing matches." },
      { prop: "clearable", type: "boolean", defaultValue: "false", description: "Selecting the active option again clears it." },
      { prop: "name", type: "string", description: "Adds a hidden input for native form submission." },
      { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "glass" | "liquid" | "matte" | "filled"', defaultValue: 'ambient (glinr)', description: 'Trigger look. Omit to follow the ambient design style. Glass is opt-in and also frosts the panel.' },
      { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Trigger height." }
    ],
    accessibility: {
      summary: ["Trigger is `role=\"combobox\"` with `aria-expanded`, `aria-haspopup=\"listbox\"` and `aria-controls`.", "The panel is a filterable listbox (Command) with a labelled search field.", "Focus returns to the trigger when the panel closes.", "Pass `aria-label` or label it through Field."],
      keyboard: [{ key: "Enter / Space / Arrow Down", description: "Open the list from the trigger." }, { key: "Type", description: "Filter options." }, { key: "Arrow Up / Down", description: "Move the highlighted option." }, { key: "Enter", description: "Select the highlighted option." }, { key: "Escape", description: "Close without changing the value." }],
      aria: ["`role=\"combobox\"` and `aria-expanded` on trigger", "`aria-invalid` and `aria-describedby` pass through", "`role=\"listbox\"` and `role=\"option\"` from cmdk"]
    },
    reducedMotion: { description: "Panel open and close animations are disabled under prefers-reduced-motion.", affected: ["opacity", "transform"] },
    examples: [
      {
        title: "Default",
        code: `import { Combobox } from "@glinui/ui"\n\n${frameworksCode}\nexport function Demo() {\n  return <Combobox options={frameworks} aria-label="Framework" placeholder="Select framework..." />\n}`,
        render: <div className="w-64"><Combobox options={frameworks} aria-label="Framework" placeholder="Select framework..." /></div>
      },
      {
        title: "Variants",
        code: `import { Combobox } from "@glinui/ui"\n\n${frameworksCode}\nexport function Demo() {\n  return (\n    <div className="grid gap-3 sm:grid-cols-2">\n      <Combobox variant="glinr" options={frameworks} aria-label="glinr" placeholder="glinr" />\n      <Combobox variant="solid" options={frameworks} aria-label="solid" placeholder="solid" />\n      <Combobox variant="plain" options={frameworks} aria-label="plain" placeholder="plain" />\n      <Combobox variant="soft" options={frameworks} aria-label="soft" placeholder="soft" />\n      <Combobox variant="outline" options={frameworks} aria-label="outline" placeholder="outline" />\n      <Combobox variant="ghost" options={frameworks} aria-label="ghost" placeholder="ghost" />\n    </div>\n  )\n}`,
        render: (
          <div className="grid gap-3 sm:grid-cols-2">
            <Combobox variant="glinr" options={frameworks} aria-label="glinr" placeholder="glinr" />
            <Combobox variant="solid" options={frameworks} aria-label="solid" placeholder="solid" />
            <Combobox variant="plain" options={frameworks} aria-label="plain" placeholder="plain" />
            <Combobox variant="soft" options={frameworks} aria-label="soft" placeholder="soft" />
            <Combobox variant="outline" options={frameworks} aria-label="outline" placeholder="outline" />
            <Combobox variant="ghost" options={frameworks} aria-label="ghost" placeholder="ghost" />
          </div>
        )
      },
      {
        title: "Preselected and clearable",
        code: `import { Combobox } from "@glinui/ui"\n\n${frameworksCode}\nexport function Demo() {\n  return <Combobox options={frameworks} defaultValue="astro" clearable aria-label="Framework" />\n}`,
        render: <div className="w-64"><Combobox options={frameworks} defaultValue="astro" clearable aria-label="Framework" /></div>
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it: pick Photo or Vivid in the stage backdrop switcher.",
        code: `import { Combobox } from "@glinui/ui"\n\n${frameworksCode}\nexport function Demo() {\n  return <Combobox variant="glass" options={frameworks} aria-label="Framework" />\n}`,
        render: <div className="w-64"><Combobox variant="glass" options={frameworks} aria-label="Framework" /></div>
      }
    ]
  }
}
