"use client"

import { CaretDown, Copy, MagnifyingGlass, TextAlignCenter, TextAlignLeft, TextAlignRight, TextB, TextItalic, TextUnderline } from "@phosphor-icons/react"
import { Button } from "@glinui/ui"
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@glinui/ui"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea } from "@glinui/ui"
import { Toggle } from "@glinui/ui"
import { ToggleGroup, ToggleGroupItem } from "@glinui/ui"
import type { ComponentDocMeta } from "../component-docs"

const imp = (names: string, _mod?: string) => `import { ${names} } from "@glinui/ui"`

export const batch2aDocs: Record<string, ComponentDocMeta> = {
  toggle: {
    badge: "Primitive / Atom",
    props: [
      { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "glass"', defaultValue: 'ambient (glinr)', description: 'Look. Omit to follow the ambient design style: glinr is a raised key that presses in when on, plain is the flat shadcn toggle. Glass is opt-in.' },
      { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Height scale (h-8, h-9, h-10)." },
      { prop: "pressed", type: "boolean", description: "Controlled pressed state." },
      { prop: "defaultPressed", type: "boolean", defaultValue: "false", description: "Initial pressed state for uncontrolled use." },
      { prop: "onPressedChange", type: "(pressed: boolean) => void", description: "Fires when the pressed state changes." },
      { prop: "disabled", type: "boolean", defaultValue: "false", description: "Disables interaction." }
    ],
    accessibility: {
      summary: ["Renders a native button with `aria-pressed`.", "Icon-only toggles need an `aria-label`.", "Visible violet focus ring on `:focus-visible`."],
      keyboard: [{ key: "Enter / Space", description: "Toggle the pressed state." }, { key: "Tab", description: "Move focus to the toggle." }],
      aria: ["`aria-pressed` reflects state", "`data-state=\"on|off\"` for styling"]
    },
    reducedMotion: { description: "Colour transitions are removed under prefers-reduced-motion.", affected: ["background-color", "border-color"] },
    examples: [
      {
        title: "Default",
        code: `${imp("Toggle", "components/toggle")}\nimport { TextB } from "@phosphor-icons/react"\n\nexport function Demo() {\n  return (\n    <Toggle aria-label="Bold">\n      <TextB />\n    </Toggle>\n  )\n}`,
        render: <Toggle aria-label="Bold"><TextB /></Toggle>
      },
      {
        title: "Variants",
        description: "Each variant in the pressed state.",
        code: `import { Toggle } from "@glinui/ui"\nimport { TextB } from "@phosphor-icons/react"\n\nexport function Demo() {\n  return (\n    <div className="flex flex-wrap items-center gap-3">\n      <Toggle variant="glinr" defaultPressed aria-label="glinr"><TextB /></Toggle>\n      <Toggle variant="solid" defaultPressed aria-label="solid"><TextB /></Toggle>\n      <Toggle variant="plain" defaultPressed aria-label="plain"><TextB /></Toggle>\n      <Toggle variant="soft" defaultPressed aria-label="soft"><TextB /></Toggle>\n      <Toggle variant="outline" defaultPressed aria-label="outline"><TextB /></Toggle>\n      <Toggle variant="ghost" defaultPressed aria-label="ghost"><TextB /></Toggle>\n    </div>\n  )\n}`,
        render: (
          <div className="flex flex-wrap items-center gap-3">
            <Toggle variant="glinr" defaultPressed aria-label="glinr"><TextB /></Toggle>
            <Toggle variant="solid" defaultPressed aria-label="solid"><TextB /></Toggle>
            <Toggle variant="plain" defaultPressed aria-label="plain"><TextB /></Toggle>
            <Toggle variant="soft" defaultPressed aria-label="soft"><TextB /></Toggle>
            <Toggle variant="outline" defaultPressed aria-label="outline"><TextB /></Toggle>
            <Toggle variant="ghost" defaultPressed aria-label="ghost"><TextB /></Toggle>
          </div>
        )
      },
      {
        title: "Outline with label",
        code: `${imp("Toggle", "components/toggle")}\nimport { TextItalic } from "@phosphor-icons/react"\n\nexport function Demo() {\n  return (\n    <Toggle variant="outline" defaultPressed>\n      <TextItalic /> Italic\n    </Toggle>\n  )\n}`,
        render: <Toggle variant="outline" defaultPressed><TextItalic /> Italic</Toggle>
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it: pick Photo or Vivid in the stage backdrop switcher.",
        code: `${imp("Toggle", "components/toggle")}\nimport { TextUnderline } from "@phosphor-icons/react"\n\nexport function Demo() {\n  return (\n    <Toggle variant="glass" size="lg" defaultPressed aria-label="Underline">\n      <TextUnderline />\n    </Toggle>\n  )\n}`,
        render: <Toggle variant="glass" size="lg" defaultPressed aria-label="Underline"><TextUnderline /></Toggle>
      },
      {
        title: "State matrix",
        code: `${imp("Toggle", "components/toggle")}\nimport { TextB } from "@phosphor-icons/react"\n\nexport function Demo() {\n  return (\n    <div className="grid grid-cols-3 gap-3">\n      {(["sm", "md", "lg"] as const).map((size) => (\n        <div key={size} className="flex flex-col gap-2">\n          <Toggle size={size} aria-label="Off"><TextB /></Toggle>\n          <Toggle size={size} defaultPressed aria-label="On"><TextB /></Toggle>\n          <Toggle size={size} disabled aria-label="Disabled"><TextB /></Toggle>\n          <Toggle size={size} disabled defaultPressed aria-label="Disabled on"><TextB /></Toggle>\n        </div>\n      ))}\n    </div>\n  )\n}`,
        render: (
          <div className="grid grid-cols-3 gap-3">
            {(["sm", "md", "lg"] as const).map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <Toggle size={size} aria-label={`Off ${size}`}><TextB /></Toggle>
                <Toggle size={size} defaultPressed aria-label={`On ${size}`}><TextB /></Toggle>
                <Toggle size={size} disabled aria-label={`Disabled ${size}`}><TextB /></Toggle>
                <Toggle size={size} disabled defaultPressed aria-label={`Disabled on ${size}`}><TextB /></Toggle>
              </div>
            ))}
          </div>
        )
      }
    ]
  },

  "toggle-group": {
    badge: "Primitive / Molecule",
    props: [
      {
        title: "ToggleGroup",
        rows: [
          { prop: "type", type: '"single" | "multiple"', description: "Required. Single allows one pressed item, multiple allows many." },
          { prop: "value | defaultValue", type: "string | string[]", description: "Controlled or initial selection." },
          { prop: "onValueChange", type: "(value) => void", description: "Fires when the selection changes." },
          { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "glass"', defaultValue: 'ambient (glinr)', description: 'Applied to every item. Omit to follow the ambient design style. Glass is opt-in.' },
          { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Applied to every item." },
          { prop: "spacing", type: "0 | 1 | 2 | 3", defaultValue: "0", description: "Gap between items. 0 merges borders into one segmented control." }
        ]
      },
      { title: "ToggleGroupItem", rows: [{ prop: "value", type: "string", description: "Required. Value this item represents." }, { prop: "variant | size", type: "same as group", description: "Per item override." }] }
    ],
    accessibility: {
      summary: ["Single mode exposes `radiogroup` with `radio` items, multiple mode exposes `group` with toggle buttons.", "Roving tabindex: one tab stop for the whole group.", "Always label the group with `aria-label`."],
      keyboard: [{ key: "Arrow keys", description: "Move focus between items." }, { key: "Enter / Space", description: "Toggle the focused item." }, { key: "Home / End", description: "Move to first or last item." }],
      aria: ["`aria-label` on group", "`aria-checked` (single) or `aria-pressed` (multiple) on items"]
    },
    reducedMotion: { description: "Item colour transitions are disabled under prefers-reduced-motion.", affected: ["background-color", "border-color"] },
    examples: [
      {
        title: "Single",
        code: `${imp("ToggleGroup, ToggleGroupItem", "components/toggle-group")}\nimport { TextAlignLeft, TextAlignCenter, TextAlignRight } from "@phosphor-icons/react"\n\nexport function Demo() {\n  return (\n    <ToggleGroup type="single" defaultValue="left" aria-label="Alignment">\n      <ToggleGroupItem value="left" aria-label="Left"><TextAlignLeft /></ToggleGroupItem>\n      <ToggleGroupItem value="center" aria-label="Center"><TextAlignCenter /></ToggleGroupItem>\n      <ToggleGroupItem value="right" aria-label="Right"><TextAlignRight /></ToggleGroupItem>\n    </ToggleGroup>\n  )\n}`,
        render: (
          <ToggleGroup type="single" defaultValue="left" aria-label="Alignment">
            <ToggleGroupItem value="left" aria-label="Left"><TextAlignLeft /></ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="Center"><TextAlignCenter /></ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label="Right"><TextAlignRight /></ToggleGroupItem>
          </ToggleGroup>
        )
      },
      {
        title: "Variants",
        code: `import { ToggleGroup, ToggleGroupItem } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="flex flex-col items-start gap-3">\n      <ToggleGroup type="single" variant="glinr" defaultValue="week" aria-label="glinr">\n        <ToggleGroupItem value="day">Day</ToggleGroupItem>\n        <ToggleGroupItem value="week">Week</ToggleGroupItem>\n        <ToggleGroupItem value="month">Month</ToggleGroupItem>\n      </ToggleGroup>\n      <ToggleGroup type="single" variant="solid" defaultValue="week" aria-label="solid">\n        <ToggleGroupItem value="day">Day</ToggleGroupItem>\n        <ToggleGroupItem value="week">Week</ToggleGroupItem>\n        <ToggleGroupItem value="month">Month</ToggleGroupItem>\n      </ToggleGroup>\n      <ToggleGroup type="single" variant="plain" defaultValue="week" aria-label="plain">\n        <ToggleGroupItem value="day">Day</ToggleGroupItem>\n        <ToggleGroupItem value="week">Week</ToggleGroupItem>\n        <ToggleGroupItem value="month">Month</ToggleGroupItem>\n      </ToggleGroup>\n      <ToggleGroup type="single" variant="soft" defaultValue="week" aria-label="soft">\n        <ToggleGroupItem value="day">Day</ToggleGroupItem>\n        <ToggleGroupItem value="week">Week</ToggleGroupItem>\n        <ToggleGroupItem value="month">Month</ToggleGroupItem>\n      </ToggleGroup>\n      <ToggleGroup type="single" variant="outline" defaultValue="week" aria-label="outline">\n        <ToggleGroupItem value="day">Day</ToggleGroupItem>\n        <ToggleGroupItem value="week">Week</ToggleGroupItem>\n        <ToggleGroupItem value="month">Month</ToggleGroupItem>\n      </ToggleGroup>\n      <ToggleGroup type="single" variant="ghost" defaultValue="week" aria-label="ghost">\n        <ToggleGroupItem value="day">Day</ToggleGroupItem>\n        <ToggleGroupItem value="week">Week</ToggleGroupItem>\n        <ToggleGroupItem value="month">Month</ToggleGroupItem>\n      </ToggleGroup>\n    </div>\n  )\n}`,
        render: (
          <div className="flex flex-col items-start gap-3">
            <ToggleGroup type="single" variant="glinr" defaultValue="week" aria-label="glinr">
              <ToggleGroupItem value="day">Day</ToggleGroupItem>
              <ToggleGroupItem value="week">Week</ToggleGroupItem>
              <ToggleGroupItem value="month">Month</ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup type="single" variant="solid" defaultValue="week" aria-label="solid">
              <ToggleGroupItem value="day">Day</ToggleGroupItem>
              <ToggleGroupItem value="week">Week</ToggleGroupItem>
              <ToggleGroupItem value="month">Month</ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup type="single" variant="plain" defaultValue="week" aria-label="plain">
              <ToggleGroupItem value="day">Day</ToggleGroupItem>
              <ToggleGroupItem value="week">Week</ToggleGroupItem>
              <ToggleGroupItem value="month">Month</ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup type="single" variant="soft" defaultValue="week" aria-label="soft">
              <ToggleGroupItem value="day">Day</ToggleGroupItem>
              <ToggleGroupItem value="week">Week</ToggleGroupItem>
              <ToggleGroupItem value="month">Month</ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup type="single" variant="outline" defaultValue="week" aria-label="outline">
              <ToggleGroupItem value="day">Day</ToggleGroupItem>
              <ToggleGroupItem value="week">Week</ToggleGroupItem>
              <ToggleGroupItem value="month">Month</ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup type="single" variant="ghost" defaultValue="week" aria-label="ghost">
              <ToggleGroupItem value="day">Day</ToggleGroupItem>
              <ToggleGroupItem value="week">Week</ToggleGroupItem>
              <ToggleGroupItem value="month">Month</ToggleGroupItem>
            </ToggleGroup>
          </div>
        )
      },
      {
        title: "Multiple with spacing",
        code: `${imp("ToggleGroup, ToggleGroupItem", "components/toggle-group")}\nimport { TextB, TextItalic } from "@phosphor-icons/react"\n\nexport function Demo() {\n  return (\n    <ToggleGroup type="multiple" variant="outline" spacing={2} aria-label="Format">\n      <ToggleGroupItem value="bold" aria-label="Bold"><TextB /></ToggleGroupItem>\n      <ToggleGroupItem value="italic" aria-label="Italic"><TextItalic /></ToggleGroupItem>\n    </ToggleGroup>\n  )\n}`,
        render: (
          <ToggleGroup type="multiple" variant="outline" spacing={2} aria-label="Format">
            <ToggleGroupItem value="bold" aria-label="Bold"><TextB /></ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic"><TextItalic /></ToggleGroupItem>
          </ToggleGroup>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it: pick Photo or Vivid in the stage backdrop switcher.",
        code: `${imp("ToggleGroup, ToggleGroupItem", "components/toggle-group")}\n\nexport function Demo() {\n  return (\n    <ToggleGroup type="single" variant="glass" defaultValue="week" aria-label="Range">\n      <ToggleGroupItem value="day">Day</ToggleGroupItem>\n      <ToggleGroupItem value="week">Week</ToggleGroupItem>\n      <ToggleGroupItem value="month">Month</ToggleGroupItem>\n    </ToggleGroup>\n  )\n}`,
        render: (
          <ToggleGroup type="single" variant="glass" defaultValue="week" aria-label="Range">
            <ToggleGroupItem value="day">Day</ToggleGroupItem>
            <ToggleGroupItem value="week">Week</ToggleGroupItem>
            <ToggleGroupItem value="month">Month</ToggleGroupItem>
          </ToggleGroup>
        )
      }
    ]
  },

  "button-group": {
    badge: "Primitive / Molecule",
    props: [
      {
        title: "ButtonGroup",
        rows: [
          { prop: "orientation", type: '"horizontal" | "vertical"', defaultValue: "horizontal", description: "Layout direction. Adjacent buttons share borders; only outer ends are rounded." },
          { prop: "variant", type: '"default" | "glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "default", description: "Look shared with every child Button that does not set its own. Glass also adds a blurred container and needs a backdrop." },
          { prop: "tone", type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"', description: "Tone shared with child Buttons." },
          { prop: "size", type: '"xs" | "sm" | "md" | "lg" | "icon"', description: "Size shared with child Buttons." }
        ]
      },
      { title: "ButtonGroupText", rows: [{ prop: "asChild", type: "boolean", defaultValue: "false", description: "Render as the child element, for example a label." }] },
      { title: "ButtonGroupSeparator", rows: [{ prop: "orientation", type: '"horizontal" | "vertical"', defaultValue: "vertical", description: "Divider direction." }] }
    ],
    accessibility: {
      summary: ["Renders `role=\"group\"`; give it an `aria-label` describing the set.", "Each child keeps its own button semantics and focus ring (raised above neighbours)."],
      keyboard: [{ key: "Tab", description: "Move through each button in order." }],
      aria: ["`role=\"group\"` with `aria-label`", "`role=\"separator\"` on ButtonGroupSeparator"]
    },
    reducedMotion: { description: "Hover lift and press scale are disabled inside the group so merged edges stay aligned.", affected: ["transform"] },
    examples: [
      {
        title: "Default",
        code: `${imp("Button", "components/button")}\n${imp("ButtonGroup", "components/button-group")}\n\nexport function Demo() {\n  return (\n    <ButtonGroup aria-label="Pagination">\n      <Button variant="outline">Previous</Button>\n      <Button variant="outline">Next</Button>\n    </ButtonGroup>\n  )\n}`,
        render: (<ButtonGroup aria-label="Pagination"><Button variant="outline">Previous</Button><Button variant="outline">Next</Button></ButtonGroup>)
      },
      {
        title: "Primary split button",
        code: `${imp("Button", "components/button")}\n${imp("ButtonGroup, ButtonGroupSeparator", "components/button-group")}\nimport { CaretDown } from "@phosphor-icons/react"\n\nexport function Demo() {\n  return (\n    <ButtonGroup aria-label="Publish">\n      <Button variant="primary">Publish</Button>\n      <Button variant="primary" size="md" aria-label="More options"><CaretDown /></Button>\n    </ButtonGroup>\n  )\n}`,
        render: (<ButtonGroup aria-label="Publish"><Button variant="primary">Publish</Button><Button variant="primary" aria-label="More options"><CaretDown /></Button></ButtonGroup>)
      },
      {
        title: "Variants",
        code: `${imp("Button, ButtonGroup", "components/button-group")}\n\nexport function Demo() {\n  return (\n    <div className="grid gap-3">\n      <ButtonGroup variant="glinr" aria-label="Glinr"><Button>One</Button><Button>Two</Button></ButtonGroup>\n      <ButtonGroup variant="solid" aria-label="Solid"><Button>One</Button><Button>Two</Button></ButtonGroup>\n      <ButtonGroup variant="plain" aria-label="Plain"><Button>One</Button><Button>Two</Button></ButtonGroup>\n      <ButtonGroup variant="outline" aria-label="Outline"><Button>One</Button><Button>Two</Button></ButtonGroup>\n    </div>\n  )\n}`,
        render: (
          <div className="grid gap-3">
            <ButtonGroup variant="glinr" aria-label="Glinr"><Button>One</Button><Button>Two</Button></ButtonGroup>
            <ButtonGroup variant="solid" aria-label="Solid"><Button>One</Button><Button>Two</Button></ButtonGroup>
            <ButtonGroup variant="plain" aria-label="Plain"><Button>One</Button><Button>Two</Button></ButtonGroup>
            <ButtonGroup variant="soft" aria-label="Soft"><Button>One</Button><Button>Two</Button></ButtonGroup>
            <ButtonGroup variant="outline" aria-label="Outline"><Button>One</Button><Button>Two</Button></ButtonGroup>
            <ButtonGroup variant="ghost" aria-label="Ghost"><Button>One</Button><Button>Two</Button></ButtonGroup>
          </div>
        )
      },
      {
        title: "Glass (opt-in)",
        code: `${imp("Button, ButtonGroup, ButtonGroupSeparator, ButtonGroupText", "components/button-group")}\n\n// Glass needs a colorful or photographic backdrop to read.\nexport function Demo() {\n  return (\n    <ButtonGroup variant="glass" aria-label="Zoom">\n      <Button>-</Button>\n      <ButtonGroupText>100%</ButtonGroupText>\n      <ButtonGroupSeparator />\n      <Button>+</Button>\n    </ButtonGroup>\n  )\n}`,
        render: (<ButtonGroup variant="glass" aria-label="Zoom"><Button>-</Button><ButtonGroupText>100%</ButtonGroupText><ButtonGroupSeparator /><Button>+</Button></ButtonGroup>)
      }
    ]
  },

  "input-group": {
    badge: "Primitive / Molecule",
    props: [
      {
        title: "InputGroup",
        rows: [
          { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "glass" | "liquid" | "matte" | "filled"', defaultValue: 'ambient (glinr)', description: 'Surface of the shared container; the control inside stays transparent so radii stay concentric. Glass is opt-in.' },
          { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Container height (h-8, h-9, h-10)." }
        ]
      },
      { title: "InputGroupAddon", rows: [{ prop: "align", type: '"inline-start" | "inline-end" | "block-start" | "block-end"', defaultValue: "inline-start", description: "Where the addon sits. Clicking it focuses the control." }] },
      { title: "InputGroupInput / InputGroupTextarea", rows: [{ prop: "...props", type: "input / textarea attributes", description: "Borderless control that inherits the container ring, invalid and disabled states." }] },
      { title: "InputGroupButton", rows: [{ prop: "size", type: '"xs" | "sm"', defaultValue: "xs", description: "Compact button; accepts every Button variant." }] }
    ],
    accessibility: {
      summary: ["Container is `role=\"group\"`; the control keeps native input semantics.", "Focus ring and `aria-invalid` styling move to the whole container.", "Icon addons are decorative; label the control itself."],
      keyboard: [{ key: "Tab", description: "Move between the control and addon buttons." }],
      aria: ["`aria-invalid` on the control styles the container", "`aria-label` on the control when no visible label"]
    },
    reducedMotion: { description: "Border and shadow transitions are disabled under prefers-reduced-motion.", affected: ["border-color", "box-shadow"] },
    examples: [
      {
        title: "Icon and text addons",
        code: `${imp("InputGroup, InputGroupAddon, InputGroupInput, InputGroupText", "components/input-group")}\nimport { MagnifyingGlass } from "@phosphor-icons/react"\n\nexport function Demo() {\n  return (\n    <InputGroup>\n      <InputGroupAddon><MagnifyingGlass /></InputGroupAddon>\n      <InputGroupInput aria-label="Search" placeholder="Search..." />\n      <InputGroupAddon align="inline-end"><InputGroupText>12 results</InputGroupText></InputGroupAddon>\n    </InputGroup>\n  )\n}`,
        render: (
          <InputGroup>
            <InputGroupAddon><MagnifyingGlass /></InputGroupAddon>
            <InputGroupInput aria-label="Search" placeholder="Search..." />
            <InputGroupAddon align="inline-end"><InputGroupText>12 results</InputGroupText></InputGroupAddon>
          </InputGroup>
        )
      },
      {
        title: "With button",
        code: `${imp("InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput", "components/input-group")}\nimport { Copy } from "@phosphor-icons/react"\n\nexport function Demo() {\n  return (\n    <InputGroup>\n      <InputGroupInput aria-label="Link" defaultValue="https://glinui.com" readOnly />\n      <InputGroupAddon align="inline-end">\n        <InputGroupButton><Copy /> Copy</InputGroupButton>\n      </InputGroupAddon>\n    </InputGroup>\n  )\n}`,
        render: (
          <InputGroup>
            <InputGroupInput aria-label="Link" defaultValue="https://glinui.com" readOnly />
            <InputGroupAddon align="inline-end"><InputGroupButton><Copy /> Copy</InputGroupButton></InputGroupAddon>
          </InputGroup>
        )
      },
      {
        title: "Variants",
        code: `import { InputGroup, InputGroupInput } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="grid gap-3 sm:grid-cols-2">\n      <InputGroup variant="glinr">\n        <InputGroupInput aria-label="glinr" placeholder="glinr" />\n      </InputGroup>\n      <InputGroup variant="solid">\n        <InputGroupInput aria-label="solid" placeholder="solid" />\n      </InputGroup>\n      <InputGroup variant="plain">\n        <InputGroupInput aria-label="plain" placeholder="plain" />\n      </InputGroup>\n      <InputGroup variant="soft">\n        <InputGroupInput aria-label="soft" placeholder="soft" />\n      </InputGroup>\n      <InputGroup variant="outline">\n        <InputGroupInput aria-label="outline" placeholder="outline" />\n      </InputGroup>\n      <InputGroup variant="ghost">\n        <InputGroupInput aria-label="ghost" placeholder="ghost" />\n      </InputGroup>\n    </div>\n  )\n}`,
        render: (
          <div className="grid gap-3 sm:grid-cols-2">
            <InputGroup variant="glinr">
              <InputGroupInput aria-label="glinr" placeholder="glinr" />
            </InputGroup>
            <InputGroup variant="solid">
              <InputGroupInput aria-label="solid" placeholder="solid" />
            </InputGroup>
            <InputGroup variant="plain">
              <InputGroupInput aria-label="plain" placeholder="plain" />
            </InputGroup>
            <InputGroup variant="soft">
              <InputGroupInput aria-label="soft" placeholder="soft" />
            </InputGroup>
            <InputGroup variant="outline">
              <InputGroupInput aria-label="outline" placeholder="outline" />
            </InputGroup>
            <InputGroup variant="ghost">
              <InputGroupInput aria-label="ghost" placeholder="ghost" />
            </InputGroup>
          </div>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it: pick Photo or Vivid in the stage backdrop switcher.",
        code: `${imp("InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea", "components/input-group")}\n\nexport function Demo() {\n  return (\n    <InputGroup variant="glass">\n      <InputGroupTextarea aria-label="Message" placeholder="Write a message..." />\n      <InputGroupAddon align="block-end"><InputGroupText>0 / 280</InputGroupText></InputGroupAddon>\n    </InputGroup>\n  )\n}`,
        render: (
          <InputGroup variant="glass">
            <InputGroupTextarea aria-label="Message" placeholder="Write a message..." />
            <InputGroupAddon align="block-end"><InputGroupText>0 / 280</InputGroupText></InputGroupAddon>
          </InputGroup>
        )
      }
    ]
  }
}
