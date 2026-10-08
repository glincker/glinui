"use client"

import { Plus, Rocket } from "@phosphor-icons/react/dist/ssr"
import { GenerateButton, InteractiveHoverButton } from "@glinui/ui"
import type { BatchA4Doc } from "./batch-a4-types"

export const batchA4aDocs: Record<string, BatchA4Doc> = {
  "interactive-hover-button": {
    badge: "Primitive / Atom",
    props: [
      {
        title: "InteractiveHoverButton",
        rows: [
          { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "ambient (glinr)", description: "Surface from the shared vocabulary. Omit for the ambient default. Glass is opt-in and needs a backdrop." },
          { prop: "tone", type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"', defaultValue: "neutral", description: "Colour axis." },
          { prop: "size", type: '"xs" | "sm" | "md" | "lg" | "icon"', defaultValue: "md", description: "Height and type size, aligned with Button." },
          { prop: "leadingIcon", type: "ReactNode", description: "Decorative icon before the label." },
          { prop: "trailingIcon", type: "ReactNode", description: "Decorative icon after the label. Replaces the hover arrow." },
          { prop: "loading", type: "boolean", defaultValue: "false", description: "Shows a Spinner, sets aria-busy and blocks interaction." },
          { prop: "asChild", type: "boolean", defaultValue: "false", description: "Render onto your own element, for example a router link." },
          { prop: "disabled", type: "boolean", defaultValue: "false", description: "Disables the control." }
        ]
      }
    ],
    accessibility: {
      summary: [
        "Native button (or your element with asChild) with the Button focus ring.",
        "The hover face is aria-hidden, so the label is read once. The original duplicated it.",
        "Keyboard focus triggers the same fill as hover, and press fills it on touch."
      ],
      keyboard: [
        { key: "Enter", description: "Activates the button." },
        { key: "Space", description: "Activates the button." },
        { key: "Tab", description: "Moves focus and plays the fill." }
      ],
      aria: ["`aria-busy` while loading", "`aria-disabled` when disabled or loading", "Decorative icons and the hover face use `aria-hidden`"]
    },
    reducedMotion: {
      description:
        "Motion level full slides the label and floods the surface with a clip-path. Subtle keeps the flood and opacity swap but drops the slide. None, or prefers-reduced-motion, switches state instantly. Hover effects only run on fine pointers.",
      affected: ["clip-path", "transform", "opacity"]
    },
    examples: [
      {
        title: "Default",
        description: "A crisp glinr pill. The accent dot floods it on hover, focus or press.",
        code: `import { InteractiveHoverButton } from "@glinui/ui"\n\nexport function Demo() {\n  return <InteractiveHoverButton>Get started</InteractiveHoverButton>\n}`,
        render: <InteractiveHoverButton>Get started</InteractiveHoverButton>
      },
      {
        title: "Variants",
        description: "The shared vocabulary. The accent dot floods whichever surface you pick.",
        code: `<div className="flex flex-wrap items-center gap-3">\n<InteractiveHoverButton variant="glinr">glinr</InteractiveHoverButton>\n<InteractiveHoverButton variant="solid">solid</InteractiveHoverButton>\n<InteractiveHoverButton variant="plain">plain</InteractiveHoverButton>\n<InteractiveHoverButton variant="soft">soft</InteractiveHoverButton>\n<InteractiveHoverButton variant="outline">outline</InteractiveHoverButton>\n<InteractiveHoverButton variant="ghost">ghost</InteractiveHoverButton>\n<InteractiveHoverButton variant="gradient">gradient</InteractiveHoverButton>\n</div>`,
        render: (
          <div className="flex flex-wrap items-center gap-3">
            <InteractiveHoverButton variant="glinr">glinr</InteractiveHoverButton>
            <InteractiveHoverButton variant="solid">solid</InteractiveHoverButton>
            <InteractiveHoverButton variant="plain">plain</InteractiveHoverButton>
            <InteractiveHoverButton variant="soft">soft</InteractiveHoverButton>
            <InteractiveHoverButton variant="outline">outline</InteractiveHoverButton>
            <InteractiveHoverButton variant="ghost">ghost</InteractiveHoverButton>
            <InteractiveHoverButton variant="gradient">gradient</InteractiveHoverButton>
          </div>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is never the default. It needs a colorful or photographic backdrop to read.",
        code: `<InteractiveHoverButton variant="glass">Book a demo</InteractiveHoverButton>`,
        render: <InteractiveHoverButton variant="glass">Book a demo</InteractiveHoverButton>
      },
      {
        title: "Sizes, icons and states",
        description: "Leading icon, small and large sizes, and a loading state.",
        code: `<InteractiveHoverButton size="sm">Small</InteractiveHoverButton>\n<InteractiveHoverButton size="lg" leadingIcon={<Plus />}>New project</InteractiveHoverButton>\n<InteractiveHoverButton loading>Saving</InteractiveHoverButton>`,
        render: (
          <div className="flex flex-wrap items-center gap-3">
            <InteractiveHoverButton size="sm">Small</InteractiveHoverButton>
            <InteractiveHoverButton size="lg" leadingIcon={<Plus />}>
              New project
            </InteractiveHoverButton>
            <InteractiveHoverButton loading>Saving</InteractiveHoverButton>
          </div>
        )
      }
    ],
    notes: [
      "Adapted from Interactive Hover Button by Magic UI (MIT).",
      "Improvements: one accessible label instead of two, a cheap clip-path fill instead of a 100x scaled dot, focus-visible and active parity with hover, logical RTL offsets with a mirrored arrow, sizes, the shared variant vocabulary (glinr default, glass opt-in), loading, asChild and motion levels."
    ]
  },
  "generate-button": {
    badge: "Primitive / Atom",
    props: [
      {
        title: "GenerateButton",
        rows: [
          { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "ambient (glinr)", description: "Surface from the shared vocabulary. Omit for the ambient default. Glass is opt-in and needs a backdrop." },
          { prop: "tone", type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"', defaultValue: "neutral", description: "Colour axis." },
          { prop: "size", type: '"xs" | "sm" | "md" | "lg" | "icon"', defaultValue: "md", description: "Height and type size." },
          { prop: "label", type: "string", defaultValue: "Generate", description: "Idle label." },
          { prop: "generatingLabel", type: "string", defaultValue: "Generating", description: "Label shown and announced while generating." },
          { prop: "isGenerating", type: "boolean", description: "Controlled generating state." },
          { prop: "defaultGenerating", type: "boolean", defaultValue: "false", description: "Initial state when uncontrolled." },
          { prop: "onGeneratingChange", type: "(generating: boolean) => void", description: "Called with the requested next state on activation." },
          { prop: "loading", type: "boolean", defaultValue: "false", description: "Spinner, aria-busy and disabled. Separate from the generating glow." },
          { prop: "hue", type: "number", defaultValue: "250", description: "Highlight hue from 0 to 360." },
          { prop: "leadingIcon", type: "ReactNode", description: "Replaces the sparkle." },
          { prop: "trailingIcon", type: "ReactNode", description: "Decorative icon after the label." },
          { prop: "asChild", type: "boolean", defaultValue: "false", description: "Render onto the single child element." }
        ]
      }
    ],
    accessibility: {
      summary: [
        "Native button with the Button focus ring. Generating is never triggered by focus alone.",
        "Only the visible label is in the accessibility tree, so the name is never doubled.",
        "A polite status region announces the generating label."
      ],
      keyboard: [
        { key: "Enter", description: "Requests the next state." },
        { key: "Space", description: "Requests the next state." }
      ],
      aria: ["`aria-busy` while generating or loading", "`role=status` live region with the generating label", "`data-generating` for styling hooks"]
    },
    reducedMotion: {
      description:
        "Full motion sweeps a highlight across the label and pulses the sparkle. Subtle and none keep a static glow and the label swap only.",
      affected: ["text sweep", "sparkle pulse"]
    },
    examples: [
      {
        title: "Click to generate",
        description: "Uncontrolled: activation toggles the state and reports it.",
        code: `import { GenerateButton } from "@glinui/ui"\n\nexport function Demo() {\n  return <GenerateButton />\n}`,
        render: <GenerateButton />
      },
      {
        title: "Controlled",
        description: "Drive the state from your request lifecycle.",
        code: `const [busy, setBusy] = useState(false)\n<GenerateButton\n  isGenerating={busy}\n  onGeneratingChange={setBusy}\n  label="Draft reply"\n  generatingLabel="Drafting"\n/>`,
        render: <GenerateButton defaultGenerating label="Draft reply" generatingLabel="Drafting" />
      },
      {
        title: "Variants",
        description: "The shining label follows the surface text colour on every variant.",
        code: `<div className="flex flex-wrap items-center gap-3">\n<GenerateButton variant="glinr" label="glinr" />\n<GenerateButton variant="solid" label="solid" />\n<GenerateButton variant="plain" label="plain" />\n<GenerateButton variant="soft" label="soft" />\n<GenerateButton variant="outline" label="outline" />\n<GenerateButton variant="ghost" label="ghost" />\n<GenerateButton variant="gradient" label="gradient" />\n</div>`,
        render: (
          <div className="flex flex-wrap items-center gap-3">
            <GenerateButton variant="glinr" label="glinr" />
            <GenerateButton variant="solid" label="solid" />
            <GenerateButton variant="plain" label="plain" />
            <GenerateButton variant="soft" label="soft" />
            <GenerateButton variant="outline" label="outline" />
            <GenerateButton variant="ghost" label="ghost" />
            <GenerateButton variant="gradient" label="gradient" />
          </div>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is never the default. It needs a colorful or photographic backdrop to read.",
        code: `<GenerateButton variant="glass" defaultGenerating label="Draft reply" generatingLabel="Drafting" />`,
        render: <GenerateButton variant="glass" defaultGenerating label="Draft reply" generatingLabel="Drafting" />
      },
      {
        title: "Hue, icon and loading",
        description: "Custom hue and icon, plus the submitting state.",
        code: `<GenerateButton hue={150} leadingIcon={<Rocket weight="fill" />} label="Deploy" />\n<GenerateButton loading />`,
        render: (
          <div className="flex flex-wrap items-center gap-3">
            <GenerateButton hue={150} defaultGenerating leadingIcon={<Rocket weight="fill" />} label="Deploy" generatingLabel="Deploying" />
            <GenerateButton loading />
          </div>
        )
      }
    ],
    notes: [
      "Adapted from Generate Button by Ashutoshx7 (Vengeance UI, MIT).",
      "Improvements: no injected style tag or font stack, scoped utilities on tokens, explicit generating and loading props instead of focus-driven state, aria-busy with a polite announcement, real disabled state, variant vocabulary (glinr default, glass opt-in), sizes and asChild."
    ]
  }
}
