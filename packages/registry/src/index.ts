import type { Provenance } from "./provenance"
import { adaptedRegistry } from "./adapted"
import { batchBRegistry } from "./batch-b"

export type { Provenance, ProvenanceSource, ProvenanceStatus } from "./provenance"
export { buildProvenance, getProvenanceSource, provenanceSources } from "./provenance"

export type RegistryItem = {
  name: string
  namespace: "@glinui"
  type: "primitive" | "signature" | "block"
  title: string
  description: string
  docsPath: string
  importPath: string
  /** Optional grouping tag (for example "ai"). */
  category?: string
  /** npm packages and the @glinui/ui runtime this item needs. */
  dependencies: string[]
  /** Other registry items whose source this item imports. */
  registryDependencies?: string[]
  files: string[]
  install: {
    package: string
    registry: string
  }
  /** Set for components adapted from other open source projects (additive, optional). */
  provenance?: Provenance
}

const coreRegistry: RegistryItem[] = [
  {
    name: "button",
    namespace: "@glinui",
    type: "primitive",
    title: "Button",
    description: "Action control with default, glass, liquid, matte, glow, outline, and ghost variants.",
    docsPath: "/docs/components/radix/button",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: [
      "packages/ui/src/components/button.tsx",
      "packages/ui/src/tests/button.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add button"
    }
  },
  {
    name: "input",
    namespace: "@glinui",
    type: "primitive",
    title: "Input",
    description: "Single-line input with glass, liquid, matte, and utility variants.",
    docsPath: "/docs/components/radix/input",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: [
      "packages/ui/src/components/input.tsx",
      "packages/ui/src/tests/input.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add input"
    }
  },
  {
    name: "textarea",
    namespace: "@glinui",
    type: "primitive",
    title: "Textarea",
    description: "Multi-line input with glass, liquid, matte, and utility variants.",
    docsPath: "/docs/components/radix/textarea",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: [
      "packages/ui/src/components/textarea.tsx",
      "packages/ui/src/tests/textarea.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add textarea"
    }
  },
  {
    name: "select",
    namespace: "@glinui",
    type: "primitive",
    title: "Select",
    description: "Native select with glass, liquid, matte, and utility variants.",
    docsPath: "/docs/components/radix/select",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: [
      "packages/ui/src/components/select.tsx",
      "packages/ui/src/tests/select.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add select"
    }
  },
  {
    name: "checkbox",
    namespace: "@glinui",
    type: "primitive",
    title: "Checkbox",
    description: "Radix checkbox with glass, liquid, matte, and outline surface variants.",
    docsPath: "/docs/components/radix/checkbox",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: [
      "packages/ui/src/components/checkbox.tsx",
      "packages/ui/src/tests/checkbox.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add checkbox"
    }
  },
  {
    name: "radio-group",
    namespace: "@glinui",
    type: "primitive",
    title: "Radio Group",
    description: "Mutually exclusive selection control with variant-capable radio items.",
    docsPath: "/docs/components/radix/radio-group",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: [
      "packages/ui/src/components/radio-group.tsx",
      "packages/ui/src/tests/radio-group.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add radio-group"
    }
  },
  {
    name: "switch",
    namespace: "@glinui",
    type: "primitive",
    title: "Switch",
    description: "On/off control built on Radix switch primitive.",
    docsPath: "/docs/components/radix/switch",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/switch.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add switch"
    }
  },
  {
    name: "accordion",
    namespace: "@glinui",
    type: "primitive",
    title: "Accordion",
    description: "Expandable content sections with smooth disclosure behavior.",
    docsPath: "/docs/components/radix/accordion",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: [
      "packages/ui/src/components/accordion.tsx",
      "packages/ui/src/tests/accordion.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add accordion"
    }
  },
  {
    name: "alert",
    namespace: "@glinui",
    type: "primitive",
    title: "Alert",
    description: "Contextual feedback message with default, glass, outline, and ghost variants.",
    docsPath: "/docs/components/radix/alert",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: [
      "packages/ui/src/components/alert.tsx",
      "packages/ui/src/tests/alert.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add alert"
    }
  },
  {
    name: "alert-dialog",
    namespace: "@glinui",
    type: "primitive",
    title: "Alert Dialog",
    description: "Destructive action confirmation dialog with explicit cancel and action controls.",
    docsPath: "/docs/components/radix/alert-dialog",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: [
      "packages/ui/src/components/alert-dialog.tsx",
      "packages/ui/src/tests/alert-dialog.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add alert-dialog"
    }
  },
  {
    name: "avatar",
    namespace: "@glinui",
    type: "primitive",
    title: "Avatar",
    description: "Profile image with SVG-ready sources, fallback rendering, and multiple glass-aware surface variants.",
    docsPath: "/docs/components/radix/avatar",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: [
      "packages/ui/src/components/avatar.tsx",
      "packages/ui/src/tests/avatar.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add avatar"
    }
  },
  {
    name: "badge",
    namespace: "@glinui",
    type: "primitive",
    title: "Badge",
    description: "Compact status indicator for labels, states, and counts.",
    docsPath: "/docs/components/radix/badge",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: [
      "packages/ui/src/components/badge.tsx",
      "packages/ui/src/tests/badge.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add badge"
    }
  },
  {
    name: "card",
    namespace: "@glinui",
    type: "primitive",
    title: "Card",
    description: "Flexible surface container for grouped content.",
    docsPath: "/docs/components/radix/card",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: [
      "packages/ui/src/components/card.tsx",
      "packages/ui/src/tests/card.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add card"
    }
  },
  {
    name: "command",
    namespace: "@glinui",
    type: "primitive",
    title: "Command",
    description: "Command palette for keyboard-driven actions and search.",
    docsPath: "/docs/components/radix/command",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui", "cmdk"],
    files: [
      "packages/ui/src/components/command.tsx",
      "packages/ui/src/tests/command.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add command"
    }
  },
  {
    name: "dropdown-menu",
    namespace: "@glinui",
    type: "primitive",
    title: "Dropdown Menu",
    description: "Action menu anchored to a trigger with keyboard navigation.",
    docsPath: "/docs/components/radix/dropdown-menu",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: [
      "packages/ui/src/components/dropdown-menu.tsx",
      "packages/ui/src/tests/dropdown-menu.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add dropdown-menu"
    }
  },
  {
    name: "modal",
    namespace: "@glinui",
    type: "primitive",
    title: "Modal / Dialog",
    description: "Layered dialog for focused tasks or confirmations.",
    docsPath: "/docs/components/radix/modal",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/modal.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add modal"
    }
  },
  {
    name: "popover",
    namespace: "@glinui",
    type: "primitive",
    title: "Popover",
    description: "Floating content panel anchored to a trigger element.",
    docsPath: "/docs/components/radix/popover",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: [
      "packages/ui/src/components/popover.tsx",
      "packages/ui/src/tests/popover.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add popover"
    }
  },
  {
    name: "hover-card",
    namespace: "@glinui",
    type: "primitive",
    title: "Hover Card",
    description: "Preview card that appears on hover or focus with configurable delays and placement.",
    docsPath: "/docs/components/radix/hover-card",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: [
      "packages/ui/src/components/hover-card.tsx",
      "packages/ui/src/tests/hover-card.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add hover-card"
    }
  },
  {
    name: "progress",
    namespace: "@glinui",
    type: "primitive",
    title: "Progress",
    description: "Determinate linear and circular progress indicators with tokenized variants and sizing.",
    docsPath: "/docs/components/radix/progress",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: [
      "packages/ui/src/components/progress.tsx",
      "packages/ui/src/tests/progress.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add progress"
    }
  },
  {
    name: "separator",
    namespace: "@glinui",
    type: "primitive",
    title: "Separator",
    description: "Visual divider for grouping content with orientation support.",
    docsPath: "/docs/components/radix/separator",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: [
      "packages/ui/src/components/separator.tsx",
      "packages/ui/src/tests/separator.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add separator"
    }
  },
  {
    name: "sheet",
    namespace: "@glinui",
    type: "primitive",
    title: "Sheet / Drawer",
    description: "Sliding panel for side, top, or bottom contextual workflows.",
    docsPath: "/docs/components/radix/sheet",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: [
      "packages/ui/src/components/sheet.tsx",
      "packages/ui/src/tests/sheet.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add sheet"
    }
  },
  {
    name: "skeleton",
    namespace: "@glinui",
    type: "primitive",
    title: "Skeleton",
    description: "Loading placeholder surface with reduced-motion fallback.",
    docsPath: "/docs/components/radix/skeleton",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: [
      "packages/ui/src/components/skeleton.tsx",
      "packages/ui/src/tests/skeleton.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add skeleton"
    }
  },
  {
    name: "slider",
    namespace: "@glinui",
    type: "primitive",
    title: "Slider",
    description: "Range input control built on Radix slider primitive with glass thumb/track styling.",
    docsPath: "/docs/components/radix/slider",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: [
      "packages/ui/src/components/slider.tsx",
      "packages/ui/src/tests/slider.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add slider"
    }
  },
  {
    name: "tabs",
    namespace: "@glinui",
    type: "primitive",
    title: "Tabs",
    description: "Tabbed interface for switching between grouped content panels.",
    docsPath: "/docs/components/radix/tabs",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: [
      "packages/ui/src/components/tabs.tsx",
      "packages/ui/src/tests/tabs.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add tabs"
    }
  },
  {
    name: "table",
    namespace: "@glinui",
    type: "primitive",
    title: "Table",
    description: "Composable data table with semantic sections and glass variant support.",
    docsPath: "/docs/components/radix/table",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: [
      "packages/ui/src/components/table.tsx",
      "packages/ui/src/tests/table.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add table"
    }
  },
  {
    name: "data-table",
    namespace: "@glinui",
    type: "primitive",
    title: "Data Table",
    description: "Feature-rich table wrapper with search, sorting, pagination, selection, and column controls.",
    docsPath: "/docs/components/radix/data-table",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: [
      "packages/ui/src/components/data-table.tsx",
      "packages/ui/src/components/table.tsx",
      "packages/ui/src/tests/data-table.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add data-table"
    }
  },
  {
    name: "toast",
    namespace: "@glinui",
    type: "primitive",
    title: "Toast",
    description: "Glassmorphic toast notifications powered by Sonner with success, error, warning, info, loading, promise, and action support.",
    docsPath: "/docs/components/radix/toast",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui", "sonner"],
    files: ["packages/ui/src/components/sonner.tsx", "packages/ui/src/components/toast.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add toast"
    }
  },
  {
    name: "tooltip",
    namespace: "@glinui",
    type: "primitive",
    title: "Tooltip",
    description: "Context hint on hover/focus using Radix tooltip primitive.",
    docsPath: "/docs/components/radix/tooltip",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/tooltip.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add tooltip"
    }
  },
  {
    name: "tree",
    namespace: "@glinui",
    type: "primitive",
    title: "Tree",
    description: "Hierarchical tree view for file structures, navigation, and nested data.",
    docsPath: "/docs/components/radix/tree",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/tree.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add tree"
    }
  },
  {
    name: "chip",
    namespace: "@glinui",
    type: "primitive",
    title: "Chip",
    description: "Compact pill-style tag for statuses and lightweight metadata.",
    docsPath: "/docs/components/radix/chip",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/chip.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add chip"
    }
  },
  {
    name: "code",
    namespace: "@glinui",
    type: "primitive",
    title: "Code",
    description: "Inline code element for commands, snippets, and tokenized literals.",
    docsPath: "/docs/components/radix/code",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/code.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add code"
    }
  },
  {
    name: "counter",
    namespace: "@glinui",
    type: "primitive",
    title: "Counter",
    description: "Numeric badge that compacts overflow values like 99+.",
    docsPath: "/docs/components/radix/counter",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/counter.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add counter"
    }
  },
  {
    name: "heading",
    namespace: "@glinui",
    type: "primitive",
    title: "Heading",
    description: "Semantic heading primitive with independent style scaling.",
    docsPath: "/docs/components/radix/heading",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/heading.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add heading"
    }
  },
  {
    name: "icon-frame",
    namespace: "@glinui",
    type: "primitive",
    title: "Icon Frame",
    description: "Consistent framed surface for icon glyphs and short initials.",
    docsPath: "/docs/components/radix/icon-frame",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/icon-frame.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add icon-frame"
    }
  },
  {
    name: "kbd",
    namespace: "@glinui",
    type: "primitive",
    title: "Kbd",
    description: "Keyboard keycap primitive for shortcuts and key hints.",
    docsPath: "/docs/components/radix/kbd",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/kbd.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add kbd"
    }
  },
  {
    name: "label",
    namespace: "@glinui",
    type: "primitive",
    title: "Label",
    description: "Form label primitive with shared glass-aware variants.",
    docsPath: "/docs/components/radix/label",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/label.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add label"
    }
  },
  {
    name: "link",
    namespace: "@glinui",
    type: "primitive",
    title: "Link",
    description: "Tokenized anchor primitive with focus ring and variant surfaces.",
    docsPath: "/docs/components/radix/link",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/link.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add link"
    }
  },
  {
    name: "status-dot",
    namespace: "@glinui",
    type: "primitive",
    title: "Status Dot",
    description: "Colored status indicator with optional label and pulse state.",
    docsPath: "/docs/components/radix/status-dot",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/status-dot.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add status-dot"
    }
  },
  {
    name: "text",
    namespace: "@glinui",
    type: "primitive",
    title: "Text",
    description: "Body text primitive for default, muted, and glass-highlighted copy.",
    docsPath: "/docs/components/radix/text",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/text.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add text"
    }
  },

  // ── Molecule (Signature) Components ──────────────────────────────────────
  {
    name: "glass-card",
    namespace: "@glinui",
    type: "signature",
    title: "Glass Card",
    description: "Frosted card with depth-aware blur, refraction edge highlights, and elevation transitions.",
    docsPath: "/docs/components/glass-card",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/glass-card.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add glass-card"
    }
  },
  {
    name: "glass-navbar",
    namespace: "@glinui",
    type: "signature",
    title: "Glass Navbar",
    description: "Translucent navigation bar that responds to scroll with blur intensity.",
    docsPath: "/docs/components/glass-navbar",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/glass-navbar.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add glass-navbar"
    }
  },
  {
    name: "liquid-button",
    namespace: "@glinui",
    type: "signature",
    title: "Liquid Button",
    description: "Button with fluid hover lift, press squish, and radial shine effect.",
    docsPath: "/docs/components/liquid-button",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/liquid-button.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add liquid-button"
    }
  },
  {
    name: "magnetic-cta",
    namespace: "@glinui",
    type: "signature",
    title: "Magnetic CTA",
    description: "Call-to-action button with subtle cursor-attraction on hover.",
    docsPath: "/docs/components/magnetic-cta",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/magnetic-cta.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add magnetic-cta"
    }
  },
  {
    name: "spotlight-card",
    namespace: "@glinui",
    type: "signature",
    title: "Spotlight Card",
    description: "Card with cursor-tracked radial spotlight effect on hover.",
    docsPath: "/docs/components/spotlight-card",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/spotlight-card.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add spotlight-card"
    }
  },
  {
    name: "border-beam",
    namespace: "@glinui",
    type: "signature",
    title: "Border Beam",
    description: "Light beam that travels along the border of its container via CSS offset-path.",
    docsPath: "/docs/components/border-beam",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/border-beam.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add border-beam"
    }
  },
  {
    name: "marquee",
    namespace: "@glinui",
    type: "signature",
    title: "Marquee",
    description: "Infinite horizontal or vertical scrolling content with pause-on-hover support.",
    docsPath: "/docs/components/marquee",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/marquee.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add marquee"
    }
  },
  {
    name: "ripple",
    namespace: "@glinui",
    type: "signature",
    title: "Ripple",
    description: "Concentric expanding rings radiating from center for decorative backgrounds.",
    docsPath: "/docs/components/ripple",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/ripple.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add ripple"
    }
  },
  {
    name: "shimmer-button",
    namespace: "@glinui",
    type: "signature",
    title: "Shimmer Button",
    description: "Button with animated shimmer sweep overlay and glass-aware variants.",
    docsPath: "/docs/components/shimmer-button",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/shimmer-button.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add shimmer-button"
    }
  },
  {
    name: "meteor-shower",
    namespace: "@glinui",
    type: "signature",
    title: "Meteor Shower",
    description: "Falling diagonal streaks with staggered delays for hero backgrounds.",
    docsPath: "/docs/components/meteor-shower",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/meteor-shower.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add meteor-shower"
    }
  },
  {
    name: "animated-gradient",
    namespace: "@glinui",
    type: "signature",
    title: "Animated Gradient",
    description: "Animated color-shifting gradient background with warm, cool, aurora, and glass presets.",
    docsPath: "/docs/components/animated-gradient",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/animated-gradient.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add animated-gradient"
    }
  },
  {
    name: "number-ticker",
    namespace: "@glinui",
    type: "signature",
    title: "Number Ticker",
    description: "Animated number counter triggered by scroll visibility via IntersectionObserver.",
    docsPath: "/docs/components/number-ticker",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/number-ticker.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add number-ticker"
    }
  },
  {
    name: "text-reveal",
    namespace: "@glinui",
    type: "signature",
    title: "Text Reveal",
    description: "Word-by-word opacity reveal driven by scroll position.",
    docsPath: "/docs/components/text-reveal",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/text-reveal.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add text-reveal"
    }
  },
  {
    name: "pulsating-button",
    namespace: "@glinui",
    type: "signature",
    title: "Pulsating Button",
    description: "Button with a pulsing glow ring animation for attention-grabbing CTAs.",
    docsPath: "/docs/components/pulsating-button",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/pulsating-button.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add pulsating-button"
    }
  },
  {
    name: "dot-pattern",
    namespace: "@glinui",
    type: "signature",
    title: "Dot Pattern",
    description: "Static SVG dot grid background with configurable size, gap, and theme colors.",
    docsPath: "/docs/components/dot-pattern",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/dot-pattern.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add dot-pattern"
    }
  },
  // ── Batch 2 Signature Components ────────────────────────────────────────
  {
    name: "retro-grid",
    namespace: "@glinui",
    type: "signature",
    title: "Retro Grid",
    description: "CSS perspective grid with scrolling lines for retro-futuristic backgrounds.",
    docsPath: "/docs/components/retro-grid",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/retro-grid.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add retro-grid"
    }
  },
  {
    name: "orbiting-circles",
    namespace: "@glinui",
    type: "signature",
    title: "Orbiting Circles",
    description: "CSS-driven orbital animation that keeps children upright via double-rotate.",
    docsPath: "/docs/components/orbiting-circles",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/orbiting-circles.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add orbiting-circles"
    }
  },
  {
    name: "blur-fade",
    namespace: "@glinui",
    type: "signature",
    title: "Blur Fade",
    description: "Scroll-triggered entrance animation with blur, fade, and slide transitions.",
    docsPath: "/docs/components/blur-fade",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/blur-fade.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add blur-fade"
    }
  },
  {
    name: "glow-border",
    namespace: "@glinui",
    type: "signature",
    title: "Glow Border",
    description: "Rotating conic-gradient glow effect around container border.",
    docsPath: "/docs/components/glow-border",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/glow-border.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add glow-border"
    }
  },
  {
    name: "word-rotate",
    namespace: "@glinui",
    type: "signature",
    title: "Word Rotate",
    description: "Cycling text animation that rotates through an array of words.",
    docsPath: "/docs/components/word-rotate",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/word-rotate.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add word-rotate"
    }
  },
  {
    name: "typewriter",
    namespace: "@glinui",
    type: "signature",
    title: "Typewriter",
    description: "Character-by-character typing animation with blinking cursor and loop support.",
    docsPath: "/docs/components/typewriter",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/typewriter.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add typewriter"
    }
  },
  {
    name: "depth-card",
    namespace: "@glinui",
    type: "signature",
    title: "Depth Card",
    description: "Parallax tilt card with layered glass planes and glare effect on hover.",
    docsPath: "/docs/components/depth-card",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/depth-card.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add depth-card"
    }
  },
  {
    name: "morphing-tabs",
    namespace: "@glinui",
    type: "signature",
    title: "Morphing Tabs",
    description: "Tab component with a smoothly sliding indicator that morphs between items.",
    docsPath: "/docs/components/morphing-tabs",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/morphing-tabs.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add morphing-tabs"
    }
  },
  {
    name: "glass-dock",
    namespace: "@glinui",
    type: "signature",
    title: "Glass Dock",
    description: "macOS-style dock with proximity magnification and frosted glass surface.",
    docsPath: "/docs/components/glass-dock",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/glass-dock.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add glass-dock"
    }
  },
  {
    name: "aurora-background",
    namespace: "@glinui",
    type: "signature",
    title: "Aurora Background",
    description: "Animated gradient mesh backdrop with floating blurred blobs.",
    docsPath: "/docs/components/aurora-background",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/aurora-background.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add aurora-background"
    }
  },
  {
    name: "particle-field",
    namespace: "@glinui",
    type: "signature",
    title: "Particle Field",
    description: "Ambient floating particle system with CSS-only staggered animations.",
    docsPath: "/docs/components/particle-field",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/particle-field.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add particle-field"
    }
  },
  {
    name: "blur-spotlight",
    namespace: "@glinui",
    type: "signature",
    title: "Blur Spotlight",
    description: "Cursor-following ambient glow effect for background layers.",
    docsPath: "/docs/components/blur-spotlight",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/blur-spotlight.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add blur-spotlight"
    }
  },
  {
    name: "prism-border",
    namespace: "@glinui",
    type: "signature",
    title: "Prism Border",
    description: "Animated rainbow refraction border using a shifting linear gradient.",
    docsPath: "/docs/components/prism-border",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/prism-border.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add prism-border"
    }
  },
  {
    name: "chromatic-text",
    namespace: "@glinui",
    type: "signature",
    title: "Chromatic Text",
    description: "Text with chromatic aberration effect, RGB channel splitting.",
    docsPath: "/docs/components/chromatic-text",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/chromatic-text.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add chromatic-text"
    }
  },
  {
    name: "gradient-mesh",
    namespace: "@glinui",
    type: "signature",
    title: "Gradient Mesh",
    description: "Generative mesh gradient background using overlapping radial gradients.",
    docsPath: "/docs/components/gradient-mesh",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/gradient-mesh.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add gradient-mesh"
    }
  },
  {
    name: "ripple-button",
    namespace: "@glinui",
    type: "signature",
    title: "Ripple Button",
    description: "Button with liquid ripple effect on press.",
    docsPath: "/docs/components/ripple-button",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/ripple-button.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add ripple-button"
    }
  },
  {
    name: "glass-toggle",
    namespace: "@glinui",
    type: "signature",
    title: "Glass Toggle",
    description: "Toggle switch with liquid fill animation and frosted glass surface.",
    docsPath: "/docs/components/glass-toggle",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/glass-toggle.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add glass-toggle"
    }
  },
  {
    name: "glass-breadcrumb",
    namespace: "@glinui",
    type: "signature",
    title: "Glass Breadcrumb",
    description: "Pill-style breadcrumb with glass indicators and collapsible items.",
    docsPath: "/docs/components/glass-breadcrumb",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/glass-breadcrumb.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add glass-breadcrumb"
    }
  },
  {
    name: "floating-panel",
    namespace: "@glinui",
    type: "signature",
    title: "Floating Panel",
    description: "Draggable glass panel with depth shadows and optional close button.",
    docsPath: "/docs/components/floating-panel",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/floating-panel.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add floating-panel"
    }
  },
  {
    name: "light-leak",
    namespace: "@glinui",
    type: "signature",
    title: "Light Leak",
    description: "Simulated lens flare and light leak overlay with drifting animation.",
    docsPath: "/docs/components/light-leak",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/light-leak.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add light-leak"
    }
  },
  {
    name: "reveal-text",
    namespace: "@glinui",
    type: "signature",
    title: "Reveal Text",
    description: "Text that reveals through a clip-path wipe animation triggered on view.",
    docsPath: "/docs/components/reveal-text",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/reveal-text.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add reveal-text"
    }
  },
  {
    name: "spotlight",
    namespace: "@glinui",
    type: "signature",
    title: "Spotlight",
    description: "Full-page spotlight overlay for onboarding and feature highlighting.",
    docsPath: "/docs/components/spotlight",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui"],
    files: ["packages/ui/src/components/spotlight.tsx"],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add spotlight"
    }
  },
  {
    name: "aspect-ratio",
    namespace: "@glinui",
    type: "primitive",
    title: "Aspect Ratio",
    description: "Constrains content to a width to height ratio with optional surface frame.",
    docsPath: "/docs/components/radix/aspect-ratio",
    importPath: "@glinui/ui",
    dependencies: [
      "@glinui/ui",
      "@radix-ui/react-aspect-ratio",
      "class-variance-authority"
    ],
    files: [
      "packages/ui/src/components/aspect-ratio.tsx",
      "packages/ui/src/tests/aspect-ratio.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add aspect-ratio"
    }
  },
  {
    name: "attachment",
    namespace: "@glinui",
    type: "primitive",
    title: "Attachment",
    description: "File chip or image thumbnail with type icon, size, upload progress and remove button.",
    category: "ai",
    docsPath: "/docs/components/radix/attachment",
    importPath: "@glinui/ui",
    dependencies: [
      "@glinui/ui",
      "@phosphor-icons/react",
      "class-variance-authority"
    ],
    files: [
      "packages/ui/src/components/attachment.tsx",
      "packages/ui/src/tests/attachment.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add attachment"
    }
  },
  {
    name: "breadcrumb",
    namespace: "@glinui",
    type: "primitive",
    title: "Breadcrumb",
    description: "Navigation trail with separators, collapsed ellipsis and variant-capable links.",
    docsPath: "/docs/components/radix/breadcrumb",
    importPath: "@glinui/ui",
    dependencies: [
      "@glinui/ui",
      "@phosphor-icons/react",
      "@radix-ui/react-slot",
      "class-variance-authority"
    ],
    files: [
      "packages/ui/src/components/breadcrumb.tsx",
      "packages/ui/src/tests/breadcrumb.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add breadcrumb"
    }
  },
  {
    name: "bubble",
    namespace: "@glinui",
    type: "primitive",
    title: "Bubble",
    description: "Chat bubble surface with default, muted, accent and glass variants, optional tail and grouped spacing.",
    category: "ai",
    docsPath: "/docs/components/radix/bubble",
    importPath: "@glinui/ui",
    dependencies: [
      "@glinui/ui",
      "class-variance-authority"
    ],
    files: [
      "packages/ui/src/components/bubble.tsx",
      "packages/ui/src/tests/bubble.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add bubble"
    }
  },
  {
    name: "button-group",
    namespace: "@glinui",
    type: "primitive",
    title: "Button Group",
    description: "Merges adjacent buttons into one segmented control with shared borders.",
    docsPath: "/docs/components/radix/button-group",
    importPath: "@glinui/ui",
    dependencies: [
      "@glinui/ui",
      "@radix-ui/react-slot",
      "class-variance-authority"
    ],
    files: [
      "packages/ui/src/components/button-group.tsx",
      "packages/ui/src/tests/button-group.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add button-group"
    }
  },
  {
    name: "code-panel",
    namespace: "@glinui",
    type: "primitive",
    title: "Code Panel",
    description: "Raised header bar over an inset code well with tok-k, tok-s, tok-c and tok-f token classes.",
    docsPath: "/docs/components/radix/code-panel",
    importPath: "@glinui/ui",
    dependencies: [
      "@glinui/ui"
    ],
    registryDependencies: [
      "card",
      "copy-button"
    ],
    files: [
      "packages/ui/src/components/code-panel.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add code-panel"
    }
  },
  {
    name: "collapsible",
    namespace: "@glinui",
    type: "primitive",
    title: "Collapsible",
    description: "Radix collapsible region with an animated trigger and content for show and hide sections.",
    docsPath: "/docs/components/radix/collapsible",
    importPath: "@glinui/ui",
    dependencies: [
      "@glinui/ui",
      "@radix-ui/react-collapsible",
      "class-variance-authority"
    ],
    files: [
      "packages/ui/src/components/collapsible.tsx",
      "packages/ui/src/tests/collapsible.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add collapsible"
    }
  },
  {
    name: "combobox",
    namespace: "@glinui",
    type: "primitive",
    title: "Combobox",
    description: "A searchable select built from Popover and Command.",
    docsPath: "/docs/components/radix/combobox",
    importPath: "@glinui/ui",
    dependencies: [
      "@glinui/ui",
      "@phosphor-icons/react",
      "class-variance-authority"
    ],
    registryDependencies: [
      "command",
      "popover"
    ],
    files: [
      "packages/ui/src/components/combobox.tsx",
      "packages/ui/src/tests/combobox.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add combobox"
    }
  },
  {
    name: "context-menu",
    namespace: "@glinui",
    type: "primitive",
    title: "Context Menu",
    description: "Right-click menu with items, checkbox and radio items, submenus and shortcuts.",
    docsPath: "/docs/components/radix/context-menu",
    importPath: "@glinui/ui",
    dependencies: [
      "@glinui/ui",
      "@phosphor-icons/react",
      "@radix-ui/react-context-menu",
      "class-variance-authority"
    ],
    files: [
      "packages/ui/src/components/context-menu.tsx",
      "packages/ui/src/tests/context-menu.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add context-menu"
    }
  },
  {
    name: "copy-button",
    namespace: "@glinui",
    type: "primitive",
    title: "Copy Button",
    description: "Raised pill that copies text, announces the result and resets after 1.6 seconds.",
    docsPath: "/docs/components/radix/copy-button",
    importPath: "@glinui/ui",
    dependencies: [
      "@glinui/ui",
      "@phosphor-icons/react"
    ],
    files: [
      "packages/ui/src/components/copy-button.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add copy-button"
    }
  },
  {
    name: "empty",
    namespace: "@glinui",
    type: "primitive",
    title: "Empty",
    description: "Empty state with media, title, description, and action slots.",
    docsPath: "/docs/components/radix/empty",
    importPath: "@glinui/ui",
    dependencies: [
      "@glinui/ui",
      "class-variance-authority"
    ],
    files: [
      "packages/ui/src/components/empty.tsx",
      "packages/ui/src/tests/empty.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add empty"
    }
  },
  {
    name: "field",
    namespace: "@glinui",
    type: "primitive",
    title: "Field",
    description: "Accessible form field layout that wires labels, descriptions and errors to a control.",
    docsPath: "/docs/components/radix/field",
    importPath: "@glinui/ui",
    dependencies: [
      "@glinui/ui",
      "@radix-ui/react-slot",
      "class-variance-authority"
    ],
    files: [
      "packages/ui/src/components/field.tsx",
      "packages/ui/src/tests/field.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add field"
    }
  },
  {
    name: "input-group",
    namespace: "@glinui",
    type: "primitive",
    title: "Input Group",
    description: "An input with inline or block addons such as icons, text and buttons in one shared container.",
    docsPath: "/docs/components/radix/input-group",
    importPath: "@glinui/ui",
    dependencies: [
      "@glinui/ui",
      "class-variance-authority"
    ],
    registryDependencies: [
      "button"
    ],
    files: [
      "packages/ui/src/components/input-group.tsx",
      "packages/ui/src/tests/input-group.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add input-group"
    }
  },
  {
    name: "input-otp",
    namespace: "@glinui",
    type: "primitive",
    title: "Input OTP",
    description: "A one-time-code input with segmented slots, paste and autofill support.",
    docsPath: "/docs/components/radix/input-otp",
    importPath: "@glinui/ui",
    dependencies: [
      "@glinui/ui",
      "@phosphor-icons/react",
      "class-variance-authority"
    ],
    files: [
      "packages/ui/src/components/input-otp.tsx",
      "packages/ui/src/tests/input-otp.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add input-otp"
    }
  },
  {
    name: "install-command",
    namespace: "@glinui",
    type: "primitive",
    title: "Install Command",
    description: "Package manager tabs, a $ prefixed command and a copy button inside a code panel.",
    docsPath: "/docs/components/radix/install-command",
    importPath: "@glinui/ui",
    dependencies: [
      "@glinui/ui"
    ],
    registryDependencies: [
      "code-panel",
      "copy-button",
      "tabs"
    ],
    files: [
      "packages/ui/src/components/install-command.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add install-command"
    }
  },
  {
    name: "item",
    namespace: "@glinui",
    type: "primitive",
    title: "Item",
    description: "Flexible list row with media, content, actions, header, and footer slots.",
    docsPath: "/docs/components/radix/item",
    importPath: "@glinui/ui",
    dependencies: [
      "@glinui/ui",
      "@radix-ui/react-slot",
      "class-variance-authority"
    ],
    files: [
      "packages/ui/src/components/item.tsx",
      "packages/ui/src/tests/item.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add item"
    }
  },
  {
    name: "menubar",
    namespace: "@glinui",
    type: "primitive",
    title: "Menubar",
    description: "Desktop-style horizontal menu bar with nested menus, checkbox and radio items.",
    docsPath: "/docs/components/radix/menubar",
    importPath: "@glinui/ui",
    dependencies: [
      "@glinui/ui",
      "@phosphor-icons/react",
      "@radix-ui/react-menubar",
      "class-variance-authority"
    ],
    files: [
      "packages/ui/src/components/menubar.tsx",
      "packages/ui/src/tests/menubar.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add menubar"
    }
  },
  {
    name: "message",
    namespace: "@glinui",
    type: "primitive",
    title: "Message",
    description: "Chat turn layout with roles, avatar, bubble content and an actions toolbar (copy, regenerate, feedback).",
    category: "ai",
    docsPath: "/docs/components/radix/message",
    importPath: "@glinui/ui",
    dependencies: [
      "@glinui/ui",
      "@phosphor-icons/react"
    ],
    registryDependencies: [
      "avatar",
      "bubble"
    ],
    files: [
      "packages/ui/src/components/message.tsx",
      "packages/ui/src/tests/message.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add message"
    }
  },
  {
    name: "message-scroller",
    namespace: "@glinui",
    type: "primitive",
    title: "Message Scroller",
    description: "Conversation log that sticks to the bottom, shows a jump to latest pill and announces new messages politely.",
    category: "ai",
    docsPath: "/docs/components/radix/message-scroller",
    importPath: "@glinui/ui",
    dependencies: [
      "@glinui/ui",
      "@phosphor-icons/react"
    ],
    files: [
      "packages/ui/src/components/message-scroller.tsx",
      "packages/ui/src/lib/use-prefers-reduced-motion.ts",
      "packages/ui/src/tests/message-scroller.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add message-scroller"
    }
  },
  {
    name: "navigation-menu",
    namespace: "@glinui",
    type: "primitive",
    title: "Navigation Menu",
    description: "Site navigation with animated content panels, links and a shared viewport.",
    docsPath: "/docs/components/radix/navigation-menu",
    importPath: "@glinui/ui",
    dependencies: [
      "@glinui/ui",
      "@phosphor-icons/react",
      "@radix-ui/react-navigation-menu",
      "class-variance-authority"
    ],
    files: [
      "packages/ui/src/components/navigation-menu.tsx",
      "packages/ui/src/tests/navigation-menu.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add navigation-menu"
    }
  },
  {
    name: "pagination",
    namespace: "@glinui",
    type: "primitive",
    title: "Pagination",
    description: "Page navigation with previous and next controls, numbered links and ellipsis.",
    docsPath: "/docs/components/radix/pagination",
    importPath: "@glinui/ui",
    dependencies: [
      "@glinui/ui",
      "@phosphor-icons/react",
      "class-variance-authority"
    ],
    files: [
      "packages/ui/src/components/pagination.tsx",
      "packages/ui/src/tests/pagination.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add pagination"
    }
  },
  {
    name: "prompt-input",
    namespace: "@glinui",
    type: "primitive",
    title: "Prompt Input",
    description: "Auto-growing chat composer with send and stop, IME-safe Enter handling, attachment slot and character hint.",
    category: "ai",
    docsPath: "/docs/components/radix/prompt-input",
    importPath: "@glinui/ui",
    dependencies: [
      "@glinui/ui",
      "@phosphor-icons/react",
      "class-variance-authority"
    ],
    files: [
      "packages/ui/src/components/prompt-input.tsx",
      "packages/ui/src/tests/prompt-input.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add prompt-input"
    }
  },
  {
    name: "questionnaire",
    namespace: "@glinui",
    type: "primitive",
    title: "Questionnaire",
    description: "Multi-step form with single and multiple choice option cards, progress and keyboard accessible radio and checkbox semantics.",
    category: "ai",
    docsPath: "/docs/components/radix/questionnaire",
    importPath: "@glinui/ui",
    dependencies: [
      "@glinui/ui",
      "@phosphor-icons/react",
      "class-variance-authority"
    ],
    files: [
      "packages/ui/src/components/questionnaire.tsx",
      "packages/ui/src/tests/questionnaire.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add questionnaire"
    }
  },
  {
    name: "scroll-area",
    namespace: "@glinui",
    type: "primitive",
    title: "Scroll Area",
    description: "Custom-styled scroll container with vertical and horizontal scrollbars that keeps native scrolling.",
    docsPath: "/docs/components/radix/scroll-area",
    importPath: "@glinui/ui",
    dependencies: [
      "@glinui/ui",
      "@radix-ui/react-scroll-area",
      "class-variance-authority"
    ],
    files: [
      "packages/ui/src/components/scroll-area.tsx",
      "packages/ui/src/tests/scroll-area.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add scroll-area"
    }
  },
  {
    name: "sidebar",
    namespace: "@glinui",
    type: "primitive",
    title: "Sidebar",
    description: "Collapsible app sidebar with icon rail, mobile sheet, Ctrl/Cmd+B shortcut, and persisted state.",
    docsPath: "/docs/components/radix/sidebar",
    importPath: "@glinui/ui",
    dependencies: [
      "@glinui/ui",
      "@phosphor-icons/react",
      "@radix-ui/react-slot",
      "class-variance-authority"
    ],
    registryDependencies: [
      "sheet",
      "tooltip"
    ],
    files: [
      "packages/ui/src/components/sidebar.tsx",
      "packages/ui/src/components/sidebar-context.tsx",
      "packages/ui/src/tests/sidebar.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add sidebar"
    }
  },
  {
    name: "spinner",
    namespace: "@glinui",
    type: "primitive",
    title: "Spinner",
    description: "Accessible loading indicator with a reduced-motion pulsing ring fallback.",
    docsPath: "/docs/components/radix/spinner",
    importPath: "@glinui/ui",
    dependencies: [
      "@glinui/ui",
      "class-variance-authority"
    ],
    files: [
      "packages/ui/src/components/spinner.tsx",
      "packages/ui/src/tests/spinner.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add spinner"
    }
  },
  {
    name: "streaming-text",
    namespace: "@glinui",
    type: "primitive",
    title: "Streaming Text",
    description: "Progressive text reveal with caret and completion callback, instant under reduced motion.",
    category: "ai",
    docsPath: "/docs/components/radix/streaming-text",
    importPath: "@glinui/ui",
    dependencies: [
      "@glinui/ui"
    ],
    files: [
      "packages/ui/src/components/streaming-text.tsx",
      "packages/ui/src/lib/use-prefers-reduced-motion.ts",
      "packages/ui/src/tests/streaming-text.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add streaming-text"
    }
  },
  {
    name: "thinking",
    namespace: "@glinui",
    type: "primitive",
    title: "Thinking",
    description: "Reasoning indicator with animated dots or pulsing text and collapsible reasoning details.",
    category: "ai",
    docsPath: "/docs/components/radix/thinking",
    importPath: "@glinui/ui",
    dependencies: [
      "@glinui/ui",
      "@phosphor-icons/react"
    ],
    files: [
      "packages/ui/src/components/thinking.tsx",
      "packages/ui/src/tests/thinking.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add thinking"
    }
  },
  {
    name: "toggle",
    namespace: "@glinui",
    type: "primitive",
    title: "Toggle",
    description: "A two-state button that can be pressed on or off.",
    docsPath: "/docs/components/radix/toggle",
    importPath: "@glinui/ui",
    dependencies: [
      "@glinui/ui",
      "@radix-ui/react-toggle",
      "class-variance-authority"
    ],
    files: [
      "packages/ui/src/components/toggle.tsx",
      "packages/ui/src/tests/toggle.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add toggle"
    }
  },
  {
    name: "toggle-group",
    namespace: "@glinui",
    type: "primitive",
    title: "Toggle Group",
    description: "A set of toggles with single or multiple selection and merged segmented borders.",
    docsPath: "/docs/components/radix/toggle-group",
    importPath: "@glinui/ui",
    dependencies: [
      "@glinui/ui",
      "@radix-ui/react-toggle-group",
      "class-variance-authority"
    ],
    registryDependencies: [
      "toggle"
    ],
    files: [
      "packages/ui/src/components/toggle-group.tsx",
      "packages/ui/src/tests/toggle-group.test.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add toggle-group"
    }
  },
  {
    name: "reveal",
    namespace: "@glinui",
    type: "primitive",
    title: "Reveal",
    description: "Scroll-triggered entrance with fade, slide, blur and scale variants, driven by a pluggable animation engine (css, motion or gsap).",
    category: "motion",
    docsPath: "/docs/components/radix/reveal",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui", "@glinui/motion"],
    files: [
      "packages/ui/src/components/reveal.tsx",
      "packages/ui/src/components/motion-engine.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/motion @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add reveal"
    }
  },
  {
    name: "split-text",
    namespace: "@glinui",
    type: "primitive",
    title: "Split Text",
    description: "Splits text into characters, words or lines and animates them in with the active animation engine.",
    category: "motion",
    docsPath: "/docs/components/radix/split-text",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui", "@glinui/motion"],
    registryDependencies: ["reveal"],
    files: [
      "packages/ui/src/components/split-text.tsx",
      "packages/ui/src/components/motion-engine.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/motion @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add split-text"
    }
  },
  {
    name: "count-up",
    namespace: "@glinui",
    type: "primitive",
    title: "Count Up",
    description: "Counts a number up on scroll with the active animation engine, jumping to the end value when motion is off.",
    category: "motion",
    docsPath: "/docs/components/radix/count-up",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui", "@glinui/motion"],
    registryDependencies: ["reveal"],
    files: [
      "packages/ui/src/components/count-up.tsx",
      "packages/ui/src/components/motion-engine.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/motion @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add count-up"
    }
  },
  {
    name: "stagger-list",
    namespace: "@glinui",
    type: "primitive",
    title: "Stagger List",
    description: "Reveals child items one after another with configurable stagger and direction using the active animation engine.",
    category: "motion",
    docsPath: "/docs/components/radix/stagger-list",
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui", "@glinui/motion"],
    registryDependencies: ["reveal"],
    files: [
      "packages/ui/src/components/stagger-list.tsx",
      "packages/ui/src/components/motion-engine.tsx"
    ],
    install: {
      package: "npm install @glinui/ui @glinui/motion @glinui/tokens",
      registry: "pnpm dlx @glinui/cli@latest add stagger-list"
    }
  }
]

/** Core items plus components adapted from MIT licensed projects (see adapted.ts). */
export const baseRegistry: RegistryItem[] = [...coreRegistry, ...adaptedRegistry, ...batchBRegistry]

export function getRegistryItem(name: string) {
  return baseRegistry.find((item) => item.name === name) ?? null
}
