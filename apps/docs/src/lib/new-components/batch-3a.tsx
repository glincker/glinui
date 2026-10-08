"use client"

import { Book, FolderOpen, Plus } from "@phosphor-icons/react/dist/ssr"

import { AspectRatio } from "@glinui/ui"
import { Button } from "@glinui/ui"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@glinui/ui"
import { ScrollArea, ScrollBar } from "@glinui/ui"
import { Spinner } from "@glinui/ui"
import type { Batch3Docs } from "./batch-3-types"

const tags = Array.from({ length: 24 }, (_, i) => `v1.${24 - i}.0`)

export const batch3aDocs: Batch3Docs = {
  "scroll-area": {
    badge: "Primitive / Molecule",
    props: [
      {
        title: "ScrollArea",
        rows: [
          { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "plain (chromeless)", description: "Surface variant. Omit to follow the ambient design style (glinr by default, plain for minimal, glass for glass)." },
          { prop: "tone", type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"', defaultValue: "neutral", description: "Colour tone for the vocabulary variants." },
          { prop: "viewportClassName", type: "string", description: "Class names applied to the scrollable viewport." },
          { prop: "type", type: '"auto" | "always" | "scroll" | "hover"', defaultValue: "hover", description: "When scrollbars are visible (Radix)." },
          { prop: "dir", type: '"ltr" | "rtl"', description: "Reading direction for scrollbar placement." }
        ]
      },
      {
        title: "ScrollBar",
        rows: [{ prop: "orientation", type: '"vertical" | "horizontal"', defaultValue: "vertical", description: "Add a horizontal ScrollBar for wide content." }]
      }
    ],
    accessibility: {
      summary: [
        "Native scrolling is preserved, so wheel, touch, and keyboard scroll work as usual.",
        "The viewport is focusable with a visible violet focus ring so keyboard users can scroll it."
      ],
      keyboard: [
        { key: "Tab", description: "Focus the viewport." },
        { key: "Arrow keys / PageUp / PageDown", description: "Scroll the focused viewport." }
      ],
      aria: ["Add `aria-label` or `aria-labelledby` on the viewport region when it is a landmark."]
    },
    reducedMotion: {
      description: "Scrollbar fade transitions are disabled with reduced motion.",
      affected: ["opacity", "background-color"]
    },
    examples: [
      {
        title: "Vertical list",
        description: "Constrain height and the scrollbar appears on hover.",
        code: `import { ScrollArea } from "@glinui/ui"\n\nconst tags = Array.from({ length: 24 }, (_, i) => \`v1.\${24 - i}.0\`)\n\nexport function Demo() {\n  return (\n    <ScrollArea variant="default" className="h-56 w-56">\n      <div className="p-4">\n        {tags.map((tag) => (\n          <div key={tag} className="border-b border-[var(--line-soft)] py-2 text-sm">{tag}</div>\n        ))}\n      </div>\n    </ScrollArea>\n  )\n}`,
        render: (
          <ScrollArea variant="default" className="h-56 w-56">
            <div className="p-4">
              {tags.map((tag) => (
                <div key={tag} className="border-b border-[var(--line-soft)] py-2 text-sm">{tag}</div>
              ))}
            </div>
          </ScrollArea>
        )
      },
      {
        title: "Variants",
        description: "Every vocabulary variant on the default tone. Omit variant to follow the ambient design style. Omitted variant renders a chromeless region like the shadcn primitive.",
        code: `import { ScrollArea } from "@glinui/ui"

export function ScrollAreaVariantsDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ScrollArea variant="glinr" className="h-24 w-full"><div className="space-y-1 p-3 text-sm"><div>First row</div><div>Second row</div><div>Third row</div><div>Fourth row</div></div></ScrollArea>
      <ScrollArea variant="solid" className="h-24 w-full"><div className="space-y-1 p-3 text-sm"><div>First row</div><div>Second row</div><div>Third row</div><div>Fourth row</div></div></ScrollArea>
      <ScrollArea variant="soft" className="h-24 w-full"><div className="space-y-1 p-3 text-sm"><div>First row</div><div>Second row</div><div>Third row</div><div>Fourth row</div></div></ScrollArea>
      <ScrollArea variant="outline" className="h-24 w-full"><div className="space-y-1 p-3 text-sm"><div>First row</div><div>Second row</div><div>Third row</div><div>Fourth row</div></div></ScrollArea>
      <ScrollArea variant="ghost" className="h-24 w-full"><div className="space-y-1 p-3 text-sm"><div>First row</div><div>Second row</div><div>Third row</div><div>Fourth row</div></div></ScrollArea>
      <ScrollArea variant="gradient" className="h-24 w-full"><div className="space-y-1 p-3 text-sm"><div>First row</div><div>Second row</div><div>Third row</div><div>Fourth row</div></div></ScrollArea>
    </div>
  )
}`,
        render: (
          <div className="grid gap-4 md:grid-cols-2">
            <ScrollArea variant="glinr" className="h-24 w-full"><div className="space-y-1 p-3 text-sm"><div>First row</div><div>Second row</div><div>Third row</div><div>Fourth row</div></div></ScrollArea>
            <ScrollArea variant="solid" className="h-24 w-full"><div className="space-y-1 p-3 text-sm"><div>First row</div><div>Second row</div><div>Third row</div><div>Fourth row</div></div></ScrollArea>
            <ScrollArea variant="soft" className="h-24 w-full"><div className="space-y-1 p-3 text-sm"><div>First row</div><div>Second row</div><div>Third row</div><div>Fourth row</div></div></ScrollArea>
            <ScrollArea variant="outline" className="h-24 w-full"><div className="space-y-1 p-3 text-sm"><div>First row</div><div>Second row</div><div>Third row</div><div>Fourth row</div></div></ScrollArea>
            <ScrollArea variant="ghost" className="h-24 w-full"><div className="space-y-1 p-3 text-sm"><div>First row</div><div>Second row</div><div>Third row</div><div>Fourth row</div></div></ScrollArea>
            <ScrollArea variant="gradient" className="h-24 w-full"><div className="space-y-1 p-3 text-sm"><div>First row</div><div>Second row</div><div>Third row</div><div>Fourth row</div></div></ScrollArea>
          </div>
        )
      },
      {
        title: "Horizontal",
        description: "Add a horizontal ScrollBar for wide content.",
        code: `import { ScrollArea, ScrollBar } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <ScrollArea variant="default" className="w-72 whitespace-nowrap">\n      <div className="flex gap-3 p-4">\n        {Array.from({ length: 12 }, (_, i) => (\n          <div key={i} className="h-16 w-24 shrink-0 rounded-lg bg-[var(--surface-3)]" />\n        ))}\n      </div>\n      <ScrollBar orientation="horizontal" />\n    </ScrollArea>\n  )\n}`,
        render: (
          <ScrollArea variant="default" className="w-72 whitespace-nowrap">
            <div className="flex gap-3 p-4">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="h-16 w-24 shrink-0 rounded-lg bg-[var(--surface-3)]" />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it. Switch the preview stage to Vivid or Photo to see the frosted surface.",
        code: `import { ScrollArea } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <ScrollArea variant="glass" className="h-40 w-56">\n      <p className="p-4 text-sm">Long content goes here...</p>\n    </ScrollArea>\n  )\n}`,
        render: (
          <ScrollArea variant="glass" className="h-40 w-56">
            <div className="space-y-2 p-4 text-sm">
              {tags.slice(0, 12).map((tag) => (<p key={tag}>Release {tag}</p>))}
            </div>
          </ScrollArea>
        )
      }
    ]
  },

  "aspect-ratio": {
    badge: "Primitive / Atom",
    props: [
      { prop: "ratio", type: "number", defaultValue: "1", description: "Width divided by height, e.g. 16 / 9." },
      { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "plain (chromeless)", description: "Surface variant. Omit to follow the ambient design style (glinr by default, plain for minimal, glass for glass)." },
      { prop: "tone", type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"', defaultValue: "neutral", description: "Colour tone for the vocabulary variants." },
      { prop: "className", type: "string", description: "Merged onto the frame." }
    ],
    accessibility: {
      summary: [
        "Layout-only primitive with no implicit role.",
        "Provide `alt` on images or `aria-label` on media placed inside."
      ],
      aria: ["No ARIA attributes are added."]
    },
    reducedMotion: {
      description: "No motion is used.",
      affected: []
    },
    examples: [
      {
        title: "16:9 frame",
        code: `import { AspectRatio } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="w-80">\n      <AspectRatio ratio={16 / 9} variant="default">\n        <div className="grid size-full place-items-center bg-[var(--surface-2)] text-sm">16 / 9</div>\n      </AspectRatio>\n    </div>\n  )\n}`,
        render: (
          <div className="w-80">
            <AspectRatio ratio={16 / 9} variant="default">
              <div className="grid size-full place-items-center bg-[var(--surface-2)] text-sm">16 / 9</div>
            </AspectRatio>
          </div>
        )
      },
      {
        title: "Variants",
        description: "Every vocabulary variant on the default tone. Omit variant to follow the ambient design style.",
        code: `import { AspectRatio } from "@glinui/ui"

export function AspectRatioVariantsDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <AspectRatio variant="glinr" ratio={16 / 9}><div className="grid size-full place-items-center text-sm">glinr</div></AspectRatio>
      <AspectRatio variant="solid" ratio={16 / 9}><div className="grid size-full place-items-center text-sm">solid</div></AspectRatio>
      <AspectRatio variant="soft" ratio={16 / 9}><div className="grid size-full place-items-center text-sm">soft</div></AspectRatio>
      <AspectRatio variant="outline" ratio={16 / 9}><div className="grid size-full place-items-center text-sm">outline</div></AspectRatio>
      <AspectRatio variant="ghost" ratio={16 / 9}><div className="grid size-full place-items-center text-sm">ghost</div></AspectRatio>
      <AspectRatio variant="gradient" ratio={16 / 9}><div className="grid size-full place-items-center text-sm">gradient</div></AspectRatio>
    </div>
  )
}`,
        render: (
          <div className="grid gap-4 md:grid-cols-3">
            <AspectRatio variant="glinr" ratio={16 / 9}><div className="grid size-full place-items-center text-sm">glinr</div></AspectRatio>
            <AspectRatio variant="solid" ratio={16 / 9}><div className="grid size-full place-items-center text-sm">solid</div></AspectRatio>
            <AspectRatio variant="soft" ratio={16 / 9}><div className="grid size-full place-items-center text-sm">soft</div></AspectRatio>
            <AspectRatio variant="outline" ratio={16 / 9}><div className="grid size-full place-items-center text-sm">outline</div></AspectRatio>
            <AspectRatio variant="ghost" ratio={16 / 9}><div className="grid size-full place-items-center text-sm">ghost</div></AspectRatio>
            <AspectRatio variant="gradient" ratio={16 / 9}><div className="grid size-full place-items-center text-sm">gradient</div></AspectRatio>
          </div>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it. Switch the preview stage to Vivid or Photo to see the frosted surface.",
        code: `import { AspectRatio } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="flex gap-4">\n      <div className="w-32"><AspectRatio ratio={1} variant="default" /></div>\n      <div className="w-32"><AspectRatio ratio={4 / 3} variant="glass" /></div>\n    </div>\n  )\n}`,
        render: (
          <div className="flex gap-4">
            <div className="w-32"><AspectRatio ratio={1} variant="default" className="grid place-items-center text-xs">1 / 1</AspectRatio></div>
            <div className="w-32"><AspectRatio ratio={4 / 3} variant="glass" className="grid place-items-center text-xs">4 / 3</AspectRatio></div>
          </div>
        )
      }
    ]
  },

  spinner: {
    badge: "Primitive / Atom",
    props: [
      { prop: "size", type: '"sm" | "md" | "lg" | "xl"', defaultValue: "md", description: "Diameter of the indicator." },
      { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "glass" | "muted" | "current"', defaultValue: 'ambient (glinr)', description: 'Color treatment. Omit to follow the ambient design style (glinr = accent, minimal = foreground). `current` inherits text color. Glass renders a chip and is opt-in.' },
      { prop: "label", type: "string", defaultValue: "Loading", description: "Accessible name announced to screen readers." }
    ],
    accessibility: {
      summary: [
        "Renders `role=\"status\"` with an `aria-label`, announcing politely to assistive tech.",
        "Visual shapes are `aria-hidden`; do not rely on them for meaning."
      ],
      aria: ['`role="status"`', "`aria-label` (defaults to `Loading`)"]
    },
    reducedMotion: {
      description: "Rotation is replaced by a ring of dots that pulses in opacity.",
      affected: ["transform (rotate)", "opacity"]
    },
    examples: [
      {
        title: "Sizes",
        code: `import { Spinner } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="flex items-center gap-4">\n      <Spinner size="sm" />\n      <Spinner />\n      <Spinner size="lg" />\n      <Spinner size="xl" />\n    </div>\n  )\n}`,
        render: (
          <div className="flex items-center gap-4">
            <Spinner size="sm" />
            <Spinner />
            <Spinner size="lg" />
            <Spinner size="xl" />
          </div>
        )
      },
      {
        title: "Variants",
        code: `import { Spinner } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="flex flex-wrap items-center gap-4">\n      <Spinner variant="glinr" label="glinr" />\n      <Spinner variant="solid" label="solid" />\n      <Spinner variant="plain" label="plain" />\n      <Spinner variant="soft" label="soft" />\n      <Spinner variant="outline" label="outline" />\n      <Spinner variant="ghost" label="ghost" />\n      <Spinner variant="muted" label="muted" />\n    </div>\n  )\n}`,
        render: (
          <div className="flex flex-wrap items-center gap-4">
            <Spinner variant="glinr" label="glinr" />
            <Spinner variant="solid" label="solid" />
            <Spinner variant="plain" label="plain" />
            <Spinner variant="soft" label="soft" />
            <Spinner variant="outline" label="outline" />
            <Spinner variant="ghost" label="ghost" />
            <Spinner variant="muted" label="muted" />
          </div>
        )
      },
      {
        title: "In a button",
        code: `import { Button, Spinner } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Button disabled><Spinner size="sm" variant="current" label="Saving" /> Saving</Button>\n  )\n}`,
        render: (
          <Button disabled><Spinner size="sm" variant="current" label="Saving" /> Saving</Button>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it: pick Photo or Vivid in the stage backdrop switcher.",
        code: `import { Spinner } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Spinner variant="glass" size="lg" />\n  )\n}`,
        render: (
          <Spinner variant="glass" size="lg" />
        )
      }
    ]
  },

  empty: {
    badge: "Primitive / Molecule",
    props: [
      {
        title: "Empty",
        rows: [{ prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "gradient" | "glass" | "dashed"', defaultValue: "ambient (glinr)", description: "Surface variant. Omit to follow the ambient design style (glinr by default, plain for minimal, glass for glass)." },
        { prop: "tone", type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"', defaultValue: "neutral", description: "Colour tone for the vocabulary variants." }]
      },
      {
        title: "EmptyMedia",
        rows: [{ prop: "variant", type: '"default" | "icon"', defaultValue: "default", description: "`icon` wraps the child icon in a tonal tile." }]
      },
      {
        title: "EmptyHeader / EmptyTitle / EmptyDescription / EmptyContent",
        rows: [{ prop: "className", type: "string", description: "Merged onto each slot." }]
      }
    ],
    accessibility: {
      summary: [
        "Plain content container; headings and links inside keep their native semantics.",
        "Decorative icons should be `aria-hidden`.",
        "Use an actual heading element via `EmptyTitle` content when the empty state needs to appear in the document outline."
      ],
      keyboard: [{ key: "Tab", description: "Moves through actions placed in EmptyContent." }]
    },
    reducedMotion: {
      description: "Static component with no motion.",
      affected: []
    },
    examples: [
      {
        title: "Default",
        code: `import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle, Button } from "@glinui/ui"\nimport { FolderOpen, Plus } from "@phosphor-icons/react"\n\nexport function Demo() {\n  return (\n    <Empty>\n      <EmptyHeader>\n        <EmptyMedia variant="icon"><FolderOpen aria-hidden="true" /></EmptyMedia>\n        <EmptyTitle>No projects yet</EmptyTitle>\n        <EmptyDescription>Create your first project to get started.</EmptyDescription>\n      </EmptyHeader>\n      <EmptyContent>\n        <Button><Plus /> New project</Button>\n      </EmptyContent>\n    </Empty>\n  )\n}`,
        render: (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon"><FolderOpen aria-hidden="true" /></EmptyMedia>
              <EmptyTitle>No projects yet</EmptyTitle>
              <EmptyDescription>Create your first project to get started.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button><Plus aria-hidden="true" /> New project</Button>
            </EmptyContent>
          </Empty>
        )
      },
      {
        title: "Variants",
        description: "Every vocabulary variant on the default tone. Omit variant to follow the ambient design style.",
        code: `import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@glinui/ui"

export function EmptyVariantsDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Empty variant="glinr"><EmptyHeader><EmptyTitle>glinr</EmptyTitle><EmptyDescription>No items yet.</EmptyDescription></EmptyHeader></Empty>
      <Empty variant="solid"><EmptyHeader><EmptyTitle>solid</EmptyTitle><EmptyDescription>No items yet.</EmptyDescription></EmptyHeader></Empty>
      <Empty variant="plain"><EmptyHeader><EmptyTitle>plain</EmptyTitle><EmptyDescription>No items yet.</EmptyDescription></EmptyHeader></Empty>
      <Empty variant="soft"><EmptyHeader><EmptyTitle>soft</EmptyTitle><EmptyDescription>No items yet.</EmptyDescription></EmptyHeader></Empty>
      <Empty variant="outline"><EmptyHeader><EmptyTitle>outline</EmptyTitle><EmptyDescription>No items yet.</EmptyDescription></EmptyHeader></Empty>
      <Empty variant="ghost"><EmptyHeader><EmptyTitle>ghost</EmptyTitle><EmptyDescription>No items yet.</EmptyDescription></EmptyHeader></Empty>
      <Empty variant="gradient"><EmptyHeader><EmptyTitle>gradient</EmptyTitle><EmptyDescription>No items yet.</EmptyDescription></EmptyHeader></Empty>
    </div>
  )
}`,
        render: (
          <div className="grid gap-4 md:grid-cols-2">
            <Empty variant="glinr"><EmptyHeader><EmptyTitle>glinr</EmptyTitle><EmptyDescription>No items yet.</EmptyDescription></EmptyHeader></Empty>
            <Empty variant="solid"><EmptyHeader><EmptyTitle>solid</EmptyTitle><EmptyDescription>No items yet.</EmptyDescription></EmptyHeader></Empty>
            <Empty variant="plain"><EmptyHeader><EmptyTitle>plain</EmptyTitle><EmptyDescription>No items yet.</EmptyDescription></EmptyHeader></Empty>
            <Empty variant="soft"><EmptyHeader><EmptyTitle>soft</EmptyTitle><EmptyDescription>No items yet.</EmptyDescription></EmptyHeader></Empty>
            <Empty variant="outline"><EmptyHeader><EmptyTitle>outline</EmptyTitle><EmptyDescription>No items yet.</EmptyDescription></EmptyHeader></Empty>
            <Empty variant="ghost"><EmptyHeader><EmptyTitle>ghost</EmptyTitle><EmptyDescription>No items yet.</EmptyDescription></EmptyHeader></Empty>
            <Empty variant="gradient"><EmptyHeader><EmptyTitle>gradient</EmptyTitle><EmptyDescription>No items yet.</EmptyDescription></EmptyHeader></Empty>
          </div>
        )
      },
      {
        title: "Dashed",
        code: `import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@glinui/ui"\nimport { Book } from "@phosphor-icons/react"\n\nexport function Demo() {\n  return (\n    <Empty variant="dashed">\n      <EmptyHeader>\n        <EmptyMedia variant="icon"><Book aria-hidden="true" /></EmptyMedia>\n        <EmptyTitle>Nothing here</EmptyTitle>\n        <EmptyDescription>Drop a file to begin.</EmptyDescription>\n      </EmptyHeader>\n    </Empty>\n  )\n}`,
        render: (
          <Empty variant="dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon"><Book aria-hidden="true" /></EmptyMedia>
              <EmptyTitle>Nothing here</EmptyTitle>
              <EmptyDescription>Drop a file to begin.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it. Switch the preview stage to Vivid or Photo to see the frosted surface.",
        code: `import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Empty variant="glass">\n      <EmptyHeader>\n        <EmptyTitle>Inbox zero</EmptyTitle>\n        <EmptyDescription>You are all caught up.</EmptyDescription>\n      </EmptyHeader>\n    </Empty>\n  )\n}`,
        render: (
          <Empty variant="glass">
            <EmptyHeader>
              <EmptyTitle>Inbox zero</EmptyTitle>
              <EmptyDescription>You are all caught up.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )
      }
    ]
  }
}
