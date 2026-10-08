"use client"

import { AnimatedSpan, BrowserFrame, Terminal, TypingAnimation } from "@glinui/ui"
import type { BatchA4Doc } from "./batch-a4-types"

function SkeletonScreen() {
  return (
    <div className="space-y-3 p-5">
      <div className="h-4 w-1/3 rounded bg-[var(--color-border)]" />
      <div className="h-3 w-2/3 rounded bg-[color-mix(in_oklab,var(--color-border)_70%,transparent)]" />
      <div className="grid grid-cols-3 gap-3 pt-2">
        <div className="h-16 rounded-lg bg-[var(--surface-2)]" />
        <div className="h-16 rounded-lg bg-[var(--surface-2)]" />
        <div className="h-16 rounded-lg bg-[var(--surface-2)]" />
      </div>
    </div>
  )
}

export const batchA4bDocs: Record<string, BatchA4Doc> = {
  "browser-frame": {
    badge: "Primitive / Molecule",
    props: [
      {
        title: "BrowserFrame",
        rows: [
          { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "ambient (glinr)", description: "Surface variant. Omit to follow the ambient design style (glinr by default, plain for minimal, glass for glass)." },
          { prop: "tone", type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"', defaultValue: "neutral", description: "Colour tone for the vocabulary variants." },
          { prop: "mode", type: '"default" | "simple"', defaultValue: "default", description: "Address bar, or a centered window title only." },
          { prop: "url", type: "string", defaultValue: "glinui.com", description: "Address bar text." },
          { prop: "title", type: "string", description: "Window title for simple mode." },
          { prop: "src / alt", type: "string", description: "Optional image for the viewport. alt is required with src." },
          { prop: "frameLabel", type: "string", description: "Accessible name of the frame group." },
          { prop: "viewportClassName", type: "string", description: "Classes for the content area, for example an aspect ratio." },
          { prop: "children", type: "ReactNode", description: "Any content. Wins over src." }
        ]
      }
    ],
    accessibility: {
      summary: [
        "The traffic-light dots are decorative and aria-hidden.",
        "The address is a real text element, and children keep their own semantics and focus order.",
        "The frame is a labelled group and does not use role=img, so inner content stays reachable."
      ],
      aria: ["`role=group` with `aria-label`", "Dots use `aria-hidden`", "`alt` is required when `src` is used"]
    },
    reducedMotion: { description: "Static chrome with no animation.", affected: [] },
    examples: [
      {
        title: "Default",
        description: "Pure CSS chrome. Put any UI in the viewport.",
        code: `import { BrowserFrame } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <BrowserFrame url="app.glinui.com/dashboard">\n      <div className="p-5">Your product UI</div>\n    </BrowserFrame>\n  )\n}`,
        render: (
          <BrowserFrame url="app.glinui.com/dashboard" className="max-w-xl">
            <SkeletonScreen />
          </BrowserFrame>
        )
      },
      {
        title: "Variants",
        description: "Every vocabulary variant on the default tone. Omit variant to follow the ambient design style.",
        code: `import { BrowserFrame } from "@glinui/ui"

export function BrowserFrameVariantsDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <BrowserFrame variant="glinr" url="glinr.glinui.com"><div className="p-6 text-sm">Preview</div></BrowserFrame>
      <BrowserFrame variant="solid" url="solid.glinui.com"><div className="p-6 text-sm">Preview</div></BrowserFrame>
      <BrowserFrame variant="plain" url="plain.glinui.com"><div className="p-6 text-sm">Preview</div></BrowserFrame>
      <BrowserFrame variant="soft" url="soft.glinui.com"><div className="p-6 text-sm">Preview</div></BrowserFrame>
      <BrowserFrame variant="outline" url="outline.glinui.com"><div className="p-6 text-sm">Preview</div></BrowserFrame>
      <BrowserFrame variant="ghost" url="ghost.glinui.com"><div className="p-6 text-sm">Preview</div></BrowserFrame>
      <BrowserFrame variant="gradient" url="gradient.glinui.com"><div className="p-6 text-sm">Preview</div></BrowserFrame>
    </div>
  )
}`,
        render: (
          <div className="grid gap-4 md:grid-cols-2">
            <BrowserFrame variant="glinr" url="glinr.glinui.com"><div className="p-6 text-sm">Preview</div></BrowserFrame>
            <BrowserFrame variant="solid" url="solid.glinui.com"><div className="p-6 text-sm">Preview</div></BrowserFrame>
            <BrowserFrame variant="plain" url="plain.glinui.com"><div className="p-6 text-sm">Preview</div></BrowserFrame>
            <BrowserFrame variant="soft" url="soft.glinui.com"><div className="p-6 text-sm">Preview</div></BrowserFrame>
            <BrowserFrame variant="outline" url="outline.glinui.com"><div className="p-6 text-sm">Preview</div></BrowserFrame>
            <BrowserFrame variant="ghost" url="ghost.glinui.com"><div className="p-6 text-sm">Preview</div></BrowserFrame>
            <BrowserFrame variant="gradient" url="gradient.glinui.com"><div className="p-6 text-sm">Preview</div></BrowserFrame>
          </div>
        )
      },
      {
        title: "Simple mode",
        description: "A window title instead of an address bar.",
        code: `<BrowserFrame mode="simple" title="Settings">...</BrowserFrame>`,
        render: (
          <BrowserFrame mode="simple" title="Settings" className="max-w-xl">
            <SkeletonScreen />
          </BrowserFrame>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it. Switch the preview stage to Vivid or Photo to see the frosted surface.",
        code: `<BrowserFrame variant="glass" url="glinui.com">...</BrowserFrame>`,
        render: (
          <BrowserFrame variant="glass" url="glinui.com" className="max-w-xl">
            <SkeletonScreen />
          </BrowserFrame>
        )
      }
    ],
    notes: [
      "Adapted from Safari by Magic UI (MIT), renamed to avoid the Apple trademark.",
      "Improvements: generic CSS chrome drawn with tokens instead of one SVG, a children slot for real UI (the original only took image or video), real address text, glass, simple mode and no bundled media."
    ]
  },
  terminal: {
    badge: "Primitive / Molecule",
    props: [
      {
        title: "Terminal",
        rows: [
          { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "ambient (glinr)", description: "Surface variant. Omit to follow the ambient design style (glinr by default, plain for minimal, glass for glass)." },
          { prop: "tone", type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"', defaultValue: "neutral", description: "Colour tone for the vocabulary variants." },
          { prop: "title", type: "string", description: "Window title, also the default accessible name." },
          { prop: "sequence", type: "boolean", defaultValue: "true", description: "Reveal animated children one after another." },
          { prop: "startOnView", type: "boolean", defaultValue: "true", description: "Wait until the terminal is scrolled into view." },
          { prop: "showCopy", type: "boolean", defaultValue: "true", description: "Show the copy button." },
          { prop: "copyValue", type: "string", description: "Copied text. Defaults to the full transcript." },
          { prop: "outputClassName", type: "string", description: "Classes for the scrolling output." }
        ]
      },
      {
        title: "AnimatedSpan / TypingAnimation",
        rows: [
          { prop: "delay", type: "number", defaultValue: "0", description: "Milliseconds to wait after the item's turn." },
          { prop: "duration", type: "number", defaultValue: "60", description: "TypingAnimation: milliseconds per character." },
          { prop: "children", type: "string | ReactNode", description: "TypingAnimation needs a string; AnimatedSpan takes any node." }
        ]
      }
    ],
    accessibility: {
      summary: [
        "The first render, SSR and reduced motion all show the full final text.",
        "While animating, the visual layer is aria-hidden and a screen-reader-only transcript carries the full text, so nothing is announced character by character.",
        "The copy button announces the result through a polite live region."
      ],
      keyboard: [{ key: "Tab", description: "Reaches the copy button; the output area has no extra tab stops." }],
      aria: ["`role=group` with `aria-label`", "`aria-live=off` on the animated layer", "Copy status is `role=status`"]
    },
    reducedMotion: {
      description:
        "Full motion types commands and fades lines in. Subtle fades lines in without typing. None, or prefers-reduced-motion, renders the full transcript at once. Timers are cleared on unmount.",
      affected: ["typing", "line fade", "caret blink"]
    },
    examples: [
      {
        title: "Install transcript",
        description: "Typed command followed by output lines.",
        code: `import { AnimatedSpan, Terminal, TypingAnimation } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Terminal title="zsh">\n      <TypingAnimation>$ pnpm dlx glinui add button</TypingAnimation>\n      <AnimatedSpan className="text-[var(--color-signal-ok)]">Installed button</AnimatedSpan>\n    </Terminal>\n  )\n}`,
        render: (
          <Terminal title="zsh">
            <TypingAnimation>$ pnpm dlx glinui add button</TypingAnimation>
            <AnimatedSpan className="text-[var(--color-signal-ok)]">Installed button</AnimatedSpan>
            <AnimatedSpan className="text-[var(--color-muted)]">1 file written to components/ui</AnimatedSpan>
          </Terminal>
        )
      },
      {
        title: "Variants",
        description: "Every vocabulary variant on the default tone. Omit variant to follow the ambient design style.",
        code: `import { AnimatedSpan, Terminal } from "@glinui/ui"

export function TerminalVariantsDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Terminal variant="glinr" title="glinr" sequence={false} showCopy={false}><AnimatedSpan>$ pnpm add @glinui/ui</AnimatedSpan></Terminal>
      <Terminal variant="solid" title="solid" sequence={false} showCopy={false}><AnimatedSpan>$ pnpm add @glinui/ui</AnimatedSpan></Terminal>
      <Terminal variant="plain" title="plain" sequence={false} showCopy={false}><AnimatedSpan>$ pnpm add @glinui/ui</AnimatedSpan></Terminal>
      <Terminal variant="soft" title="soft" sequence={false} showCopy={false}><AnimatedSpan>$ pnpm add @glinui/ui</AnimatedSpan></Terminal>
      <Terminal variant="outline" title="outline" sequence={false} showCopy={false}><AnimatedSpan>$ pnpm add @glinui/ui</AnimatedSpan></Terminal>
      <Terminal variant="ghost" title="ghost" sequence={false} showCopy={false}><AnimatedSpan>$ pnpm add @glinui/ui</AnimatedSpan></Terminal>
      <Terminal variant="gradient" title="gradient" sequence={false} showCopy={false}><AnimatedSpan>$ pnpm add @glinui/ui</AnimatedSpan></Terminal>
    </div>
  )
}`,
        render: (
          <div className="grid gap-4 md:grid-cols-2">
            <Terminal variant="glinr" title="glinr" sequence={false} showCopy={false}><AnimatedSpan>$ pnpm add @glinui/ui</AnimatedSpan></Terminal>
            <Terminal variant="solid" title="solid" sequence={false} showCopy={false}><AnimatedSpan>$ pnpm add @glinui/ui</AnimatedSpan></Terminal>
            <Terminal variant="plain" title="plain" sequence={false} showCopy={false}><AnimatedSpan>$ pnpm add @glinui/ui</AnimatedSpan></Terminal>
            <Terminal variant="soft" title="soft" sequence={false} showCopy={false}><AnimatedSpan>$ pnpm add @glinui/ui</AnimatedSpan></Terminal>
            <Terminal variant="outline" title="outline" sequence={false} showCopy={false}><AnimatedSpan>$ pnpm add @glinui/ui</AnimatedSpan></Terminal>
            <Terminal variant="ghost" title="ghost" sequence={false} showCopy={false}><AnimatedSpan>$ pnpm add @glinui/ui</AnimatedSpan></Terminal>
            <Terminal variant="gradient" title="gradient" sequence={false} showCopy={false}><AnimatedSpan>$ pnpm add @glinui/ui</AnimatedSpan></Terminal>
          </div>
        )
      },
      {
        title: "No sequence",
        description: "Every line starts on its own delay.",
        code: `<Terminal sequence={false} showCopy={false}>\n  <AnimatedSpan delay={200}>one</AnimatedSpan>\n  <AnimatedSpan delay={900}>two</AnimatedSpan>\n</Terminal>`,
        render: (
          <Terminal sequence={false} showCopy={false}>
            <AnimatedSpan delay={200}>one</AnimatedSpan>
            <AnimatedSpan delay={900}>two</AnimatedSpan>
          </Terminal>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it. Switch the preview stage to Vivid or Photo to see the frosted surface.",
        code: `<Terminal variant="glass" title="build">...</Terminal>`,
        render: (
          <Terminal variant="glass" title="build">
            <TypingAnimation duration={30}>$ pnpm build</TypingAnimation>
            <AnimatedSpan>Compiled in 1.2s</AnimatedSpan>
          </Terminal>
        )
      }
    ],
    notes: [
      "Adapted from Terminal by Magic UI (MIT).",
      "Improvements: no animation library, timers with cleanup and Strict Mode safety, a static first render for SSR and reduced motion, a screen-reader transcript instead of live typing, a built-in copy button, glass variant and tokenised colors."
    ]
  }
}
