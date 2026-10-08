import type { ComponentDocMeta } from "../component-docs"
import { batch2aDocs } from "./batch-2a"
import { batch2bDocs } from "./batch-2b"

/** Docs for batch 2 components, keyed by component id (same shape as componentDocs entries). */
export const batch2Docs: Record<string, ComponentDocMeta> = {
  ...batch2aDocs,
  ...batch2bDocs
}

export type Batch2Meta = {
  id: string
  title: string
  description: string
  badge: "Primitive / Atom" | "Primitive / Molecule"
  maturity: "beta"
  /** Paths relative to the repo root. */
  files: string[]
  dependencies: string[]
}

const file = (id: string) => `packages/ui/src/components/${id}.tsx`

export const batch2Meta: Batch2Meta[] = [
  { id: "toggle", title: "Toggle", description: "A two-state button that can be pressed on or off.", badge: "Primitive / Atom", maturity: "beta", files: [file("toggle")], dependencies: ["@radix-ui/react-toggle", "class-variance-authority"] },
  { id: "toggle-group", title: "Toggle Group", description: "A set of toggles with single or multiple selection and merged segmented borders.", badge: "Primitive / Molecule", maturity: "beta", files: [file("toggle-group"), file("toggle")], dependencies: ["@radix-ui/react-toggle-group", "@radix-ui/react-toggle", "class-variance-authority"] },
  { id: "button-group", title: "Button Group", description: "Merges adjacent buttons into one segmented control with shared borders.", badge: "Primitive / Molecule", maturity: "beta", files: [file("button-group"), file("button")], dependencies: ["@radix-ui/react-slot", "class-variance-authority"] },
  { id: "input-group", title: "Input Group", description: "An input with inline or block addons such as icons, text and buttons in one shared container.", badge: "Primitive / Molecule", maturity: "beta", files: [file("input-group"), file("button")], dependencies: ["@radix-ui/react-slot", "class-variance-authority"] },
  { id: "input-otp", title: "Input OTP", description: "A one-time-code input with segmented slots, paste and autofill support.", badge: "Primitive / Molecule", maturity: "beta", files: [file("input-otp")], dependencies: ["@phosphor-icons/react", "class-variance-authority"] },
  { id: "field", title: "Field", description: "Accessible form field layout that wires labels, descriptions and errors to a control.", badge: "Primitive / Molecule", maturity: "beta", files: [file("field")], dependencies: ["@radix-ui/react-slot", "class-variance-authority"] },
  { id: "combobox", title: "Combobox", description: "A searchable select built from Popover and Command.", badge: "Primitive / Molecule", maturity: "beta", files: [file("combobox"), file("command"), file("popover")], dependencies: ["cmdk", "@radix-ui/react-popover", "@phosphor-icons/react", "class-variance-authority"] }
]
