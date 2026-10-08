"use client"

import { CodePanel, tokens } from "@glinui/ui"
import { CopyButton } from "@glinui/ui"
import { InstallCommand } from "@glinui/ui"
import type { ComponentDocMeta } from "../component-docs"

export const variantsTheauthDocs: Record<string, ComponentDocMeta> = {
  "copy-button": {
    badge: "Primitive / Atom",
    props: [
      { prop: "value", type: "string", defaultValue: '""', description: "Text to copy." },
      { prop: "getValue", type: "() => string", description: "Lazily resolve the text. Wins over value." },
      { prop: "onCopy", type: "(value: string) => void", description: "Called after a successful copy. Use for analytics." },
      { prop: "label", type: "string", defaultValue: "Copy", description: "Idle label." },
      { prop: "copiedLabel", type: "string", defaultValue: "Copied", description: "Label shown and announced after copying." },
      { prop: "resetMs", type: "number", defaultValue: "1600", description: "Delay before returning to idle." },
      { prop: "iconOnly", type: "boolean", defaultValue: "false", description: "Hide the text label and keep an accessible name." },
      { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "ambient (glinr)", description: "Surface from the shared Button vocabulary." },
      { prop: "tone", type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"', defaultValue: "neutral", description: "Colour axis." },
      { prop: "size", type: '"xs" | "sm" | "md" | "lg" | "icon"', defaultValue: "xs", description: "Button size. iconOnly defaults to a compact square." }
    ],
    accessibility: {
      summary: [
        "Native button; the result is announced through a polite live region.",
        "data-copied reflects state for styling hooks.",
        "Falls back to document.execCommand when the Clipboard API is unavailable."
      ],
      keyboard: [{ key: "Enter / Space", description: "Copies the text." }],
      aria: ["role=status live region with the copied label", "aria-label when iconOnly"]
    },
    reducedMotion: { description: "Only a 1px press translate, removed under reduced motion.", affected: ["press translate"] },
    examples: [
      {
        title: "Copy text",
        code: `import { CopyButton } from "@glinui/ui"\n\nexport function Demo() {\n  return <CopyButton value="npm install @glinui/ui" onCopy={(v) => console.info(v)} />\n}`,
        render: <CopyButton value="npm install @glinui/ui" />
      },
      {
        title: "Icon only",
        code: `<CopyButton value="sk_live_123" iconOnly label="Copy key" />`,
        render: <CopyButton value="sk_live_123" iconOnly label="Copy key" />
      },
      {
        title: "Variants",
        code: `<CopyButton value="x" variant="glinr" />\n<CopyButton value="x" variant="solid" />\n<CopyButton value="x" variant="plain" />\n<CopyButton value="x" variant="soft" />\n<CopyButton value="x" variant="outline" />\n<CopyButton value="x" variant="ghost" />`,
        render: (
          <div className="flex flex-wrap items-center gap-2">
            <CopyButton value="x" variant="glinr" />
            <CopyButton value="x" variant="solid" />
            <CopyButton value="x" variant="plain" />
            <CopyButton value="x" variant="soft" />
            <CopyButton value="x" variant="outline" />
            <CopyButton value="x" variant="ghost" />
          </div>
        )
      },
      {
        title: "Glass (opt-in)",
        code: `<CopyButton value="x" variant="glass" />`,
        render: <CopyButton value="x" variant="glass" />
      }
    ]
  },
  "code-panel": {
    badge: "Primitive / Molecule",
    props: [
      { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "ambient (glinr)", description: "glinr is the canonical raised panel, plain a flat bordered code block, glass opt-in." },
      { prop: "title", type: "ReactNode", description: "Header title, usually a file name." },
      { prop: "tabs", type: "ReactNode", description: "Header slot after the title." },
      { prop: "actions", type: "ReactNode", description: "Header slot on the right." },
      { prop: "copyValue", type: "string", description: "Adds a CopyButton copying this text." },
      { prop: "onCopy", type: "(value: string) => void", description: "Called after the built-in CopyButton succeeds." },
      { prop: "hideHeader", type: "boolean", defaultValue: "false", description: "Remove the header bar." },
      { prop: "codeLabel", type: "string", defaultValue: "Code", description: "Accessible name of the scrollable region." }
    ],
    accessibility: {
      summary: [
        "The code well is focusable so keyboard users can scroll it horizontally.",
        "Token colors rely on the tok-k, tok-s, tok-c and tok-f classes, never on color alone for meaning."
      ],
      aria: ["aria-label on the pre element"]
    },
    reducedMotion: { description: "No motion.", affected: [] },
    examples: [
      {
        title: "Tokens helper",
        code: `import { CodePanel, tokens } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <CodePanel title="auth.ts" copyValue="const client = createClient()">\n      {tokens(["k", "const "], ["f", "client"], " = createClient(", ["s", '"key"'], ")", ["c", " // init"])}\n    </CodePanel>\n  )\n}`,
        render: (
          <CodePanel title="auth.ts" copyValue="const client = createClient()">
            {tokens(["k", "const "], ["f", "client"], " = createClient(", ["s", '"key"'], ")", ["c", " // init"])}
          </CodePanel>
        )
      },
      {
        title: "Variants",
        description: "Every vocabulary variant on the default tone. Omit variant to follow the ambient design style.",
        code: `import { CodePanel } from "@glinui/ui"

export function CodePanelVariantsDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <CodePanel variant="glinr" title="glinr.ts" copyValue="pnpm add @glinui/ui">pnpm add @glinui/ui</CodePanel>
      <CodePanel variant="solid" title="solid.ts" copyValue="pnpm add @glinui/ui">pnpm add @glinui/ui</CodePanel>
      <CodePanel variant="plain" title="plain.ts" copyValue="pnpm add @glinui/ui">pnpm add @glinui/ui</CodePanel>
      <CodePanel variant="soft" title="soft.ts" copyValue="pnpm add @glinui/ui">pnpm add @glinui/ui</CodePanel>
      <CodePanel variant="outline" title="outline.ts" copyValue="pnpm add @glinui/ui">pnpm add @glinui/ui</CodePanel>
      <CodePanel variant="ghost" title="ghost.ts" copyValue="pnpm add @glinui/ui">pnpm add @glinui/ui</CodePanel>
      <CodePanel variant="gradient" title="gradient.ts" copyValue="pnpm add @glinui/ui">pnpm add @glinui/ui</CodePanel>
    </div>
  )
}`,
        render: (
          <div className="grid gap-4 md:grid-cols-2">
            <CodePanel variant="glinr" title="glinr.ts" copyValue="pnpm add @glinui/ui">pnpm add @glinui/ui</CodePanel>
            <CodePanel variant="solid" title="solid.ts" copyValue="pnpm add @glinui/ui">pnpm add @glinui/ui</CodePanel>
            <CodePanel variant="plain" title="plain.ts" copyValue="pnpm add @glinui/ui">pnpm add @glinui/ui</CodePanel>
            <CodePanel variant="soft" title="soft.ts" copyValue="pnpm add @glinui/ui">pnpm add @glinui/ui</CodePanel>
            <CodePanel variant="outline" title="outline.ts" copyValue="pnpm add @glinui/ui">pnpm add @glinui/ui</CodePanel>
            <CodePanel variant="ghost" title="ghost.ts" copyValue="pnpm add @glinui/ui">pnpm add @glinui/ui</CodePanel>
            <CodePanel variant="gradient" title="gradient.ts" copyValue="pnpm add @glinui/ui">pnpm add @glinui/ui</CodePanel>
          </div>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it. Switch the preview stage to Vivid or Photo to see the frosted surface.",
        code: `import { CodePanel } from "@glinui/ui"

export function CodePanelGlassDemo() {
  return (
    <CodePanel variant="glass" title="glass.ts" copyValue="pnpm add @glinui/ui">pnpm add @glinui/ui</CodePanel>
  )
}`,
        render: (
          <CodePanel variant="glass" title="glass.ts" copyValue="pnpm add @glinui/ui">pnpm add @glinui/ui</CodePanel>
        )
      }
    ]
  },
  "install-command": {
    badge: "Primitive / Molecule",
    props: [
      { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "ambient (glinr)", description: "Passed to the underlying CodePanel. Follows the ambient style when omitted." },
      { prop: "packageName", type: "string", defaultValue: "@glinui/ui", description: "Builds npm, pnpm, yarn and bun commands." },
      { prop: "commands", type: "Record<string, string>", description: "Custom tab label to command map." },
      { prop: "value / defaultValue", type: "string", description: "Controlled or uncontrolled active tab." },
      { prop: "onValueChange", type: "(value: string) => void", description: "Tab change callback." },
      { prop: "onCopy", type: "(command: string, tab: string) => void", description: "Called after copying." }
    ],
    accessibility: {
      summary: ["Built on Tabs: arrow keys move between package managers.", "The $ prefix is hidden from assistive technology and from selection."],
      keyboard: [
        { key: "ArrowLeft / ArrowRight", description: "Move between tabs." },
        { key: "Enter / Space", description: "Activate the copy button." }
      ]
    },
    reducedMotion: { description: "No motion beyond the copy button press.", affected: [] },
    examples: [
      {
        title: "Package managers",
        code: `import { InstallCommand } from "@glinui/ui"\n\nexport function Demo() {\n  return <InstallCommand packageName="@glinui/ui" />\n}`,
        render: <InstallCommand packageName="@glinui/ui" />
      },
      {
        title: "Variants",
        description: "Every vocabulary variant on the default tone. Omit variant to follow the ambient design style.",
        code: `import { InstallCommand } from "@glinui/ui"

export function InstallCommandVariantsDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <InstallCommand variant="glinr" title="glinr" />
      <InstallCommand variant="solid" title="solid" />
      <InstallCommand variant="plain" title="plain" />
      <InstallCommand variant="soft" title="soft" />
      <InstallCommand variant="outline" title="outline" />
      <InstallCommand variant="ghost" title="ghost" />
      <InstallCommand variant="gradient" title="gradient" />
    </div>
  )
}`,
        render: (
          <div className="grid gap-4 md:grid-cols-2">
            <InstallCommand variant="glinr" title="glinr" />
            <InstallCommand variant="solid" title="solid" />
            <InstallCommand variant="plain" title="plain" />
            <InstallCommand variant="soft" title="soft" />
            <InstallCommand variant="outline" title="outline" />
            <InstallCommand variant="ghost" title="ghost" />
            <InstallCommand variant="gradient" title="gradient" />
          </div>
        )
      },
      {
        title: "Custom commands",
        code: `<InstallCommand commands={{ cli: "npx glin init", docker: "docker run glin/server" }} />`,
        render: <InstallCommand commands={{ cli: "npx glin init", docker: "docker run glin/server" }} />
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it. Switch the preview stage to Vivid or Photo to see the frosted surface.",
        code: `import { InstallCommand } from "@glinui/ui"

export function InstallCommandGlassDemo() {
  return (
    <InstallCommand variant="glass" title="glass" />
  )
}`,
        render: (
          <InstallCommand variant="glass" title="glass" />
        )
      }
    ]
  }
}
