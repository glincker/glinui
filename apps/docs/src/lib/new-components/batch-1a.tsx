"use client"

import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@glinui/ui"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@glinui/ui"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@glinui/ui"
import type { ComponentDocMeta } from "../component-docs"

export const batch1aDocs: Record<string, ComponentDocMeta> = {
  collapsible: {
    badge: "Primitive / Atom",
    props: [
      {
        title: "Collapsible",
        rows: [
          { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "ambient (glinr)", description: "Surface variant. Omit to follow the ambient design style (glinr by default, plain for minimal, glass for glass)." },
          { prop: "tone", type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"', defaultValue: "neutral", description: "Colour tone for the vocabulary variants." },
          { prop: "open", type: "boolean", description: "Controlled open state." },
          { prop: "defaultOpen", type: "boolean", defaultValue: "false", description: "Initial open state when uncontrolled." },
          { prop: "onOpenChange", type: "(open: boolean) => void", description: "Called when the open state changes." },
          { prop: "disabled", type: "boolean", defaultValue: "false", description: "Prevents toggling." }
        ]
      },
      {
        title: "CollapsibleTrigger / CollapsibleContent",
        rows: [
          { prop: "asChild", type: "boolean", defaultValue: "false", description: "Merge props onto the child element, for example a Button." },
          { prop: "forceMount", type: "boolean", description: "Content only: keep mounted for custom animation control." }
        ]
      }
    ],
    accessibility: {
      summary: [
        "Trigger is a native button wired to the content with aria-controls.",
        "Hidden content is removed from the accessibility tree.",
        "Visible violet focus ring on the trigger."
      ],
      keyboard: [
        { key: "Enter", description: "Toggle the content." },
        { key: "Space", description: "Toggle the content." }
      ],
      aria: ["`aria-expanded` on the trigger", "`aria-controls` links trigger to content", "`data-state` open or closed"]
    },
    reducedMotion: {
      description: "Content fades and slides 4px on open. With prefers-reduced-motion the animation is removed and content appears instantly.",
      affected: ["opacity", "transform"]
    },
    examples: [
      {
        title: "Basic",
        description: "Trigger and content on a solid token surface.",
        code: `import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Collapsible className="w-72 p-4">\n      <CollapsibleTrigger className="text-sm font-medium">3 starred repositories</CollapsibleTrigger>\n      <CollapsibleContent className="mt-3 space-y-2 text-sm text-[var(--color-muted)]">\n        <div>glinui/ui</div>\n        <div>glinui/tokens</div>\n      </CollapsibleContent>\n    </Collapsible>\n  )\n}`,
        render: (
          <Collapsible className="w-72 p-4">
            <CollapsibleTrigger className="text-sm font-medium">3 starred repositories</CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-2 text-sm text-[var(--color-muted)]">
              <div>glinui/ui</div>
              <div>glinui/tokens</div>
            </CollapsibleContent>
          </Collapsible>
        )
      },
      {
        title: "Variants",
        description: "Every vocabulary variant on the default tone. Omit variant to follow the ambient design style.",
        code: `import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@glinui/ui"

export function CollapsibleVariantsDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Collapsible variant="glinr" defaultOpen className="p-4"><CollapsibleTrigger className="text-sm font-medium">glinr</CollapsibleTrigger><CollapsibleContent className="mt-2 text-sm">Content</CollapsibleContent></Collapsible>
      <Collapsible variant="solid" defaultOpen className="p-4"><CollapsibleTrigger className="text-sm font-medium">solid</CollapsibleTrigger><CollapsibleContent className="mt-2 text-sm">Content</CollapsibleContent></Collapsible>
      <Collapsible variant="plain" defaultOpen className="p-4"><CollapsibleTrigger className="text-sm font-medium">plain</CollapsibleTrigger><CollapsibleContent className="mt-2 text-sm">Content</CollapsibleContent></Collapsible>
      <Collapsible variant="soft" defaultOpen className="p-4"><CollapsibleTrigger className="text-sm font-medium">soft</CollapsibleTrigger><CollapsibleContent className="mt-2 text-sm">Content</CollapsibleContent></Collapsible>
      <Collapsible variant="outline" defaultOpen className="p-4"><CollapsibleTrigger className="text-sm font-medium">outline</CollapsibleTrigger><CollapsibleContent className="mt-2 text-sm">Content</CollapsibleContent></Collapsible>
      <Collapsible variant="ghost" defaultOpen className="p-4"><CollapsibleTrigger className="text-sm font-medium">ghost</CollapsibleTrigger><CollapsibleContent className="mt-2 text-sm">Content</CollapsibleContent></Collapsible>
      <Collapsible variant="gradient" defaultOpen className="p-4"><CollapsibleTrigger className="text-sm font-medium">gradient</CollapsibleTrigger><CollapsibleContent className="mt-2 text-sm">Content</CollapsibleContent></Collapsible>
    </div>
  )
}`,
        render: (
          <div className="grid gap-4 md:grid-cols-2">
            <Collapsible variant="glinr" defaultOpen className="p-4"><CollapsibleTrigger className="text-sm font-medium">glinr</CollapsibleTrigger><CollapsibleContent className="mt-2 text-sm">Content</CollapsibleContent></Collapsible>
            <Collapsible variant="solid" defaultOpen className="p-4"><CollapsibleTrigger className="text-sm font-medium">solid</CollapsibleTrigger><CollapsibleContent className="mt-2 text-sm">Content</CollapsibleContent></Collapsible>
            <Collapsible variant="plain" defaultOpen className="p-4"><CollapsibleTrigger className="text-sm font-medium">plain</CollapsibleTrigger><CollapsibleContent className="mt-2 text-sm">Content</CollapsibleContent></Collapsible>
            <Collapsible variant="soft" defaultOpen className="p-4"><CollapsibleTrigger className="text-sm font-medium">soft</CollapsibleTrigger><CollapsibleContent className="mt-2 text-sm">Content</CollapsibleContent></Collapsible>
            <Collapsible variant="outline" defaultOpen className="p-4"><CollapsibleTrigger className="text-sm font-medium">outline</CollapsibleTrigger><CollapsibleContent className="mt-2 text-sm">Content</CollapsibleContent></Collapsible>
            <Collapsible variant="ghost" defaultOpen className="p-4"><CollapsibleTrigger className="text-sm font-medium">ghost</CollapsibleTrigger><CollapsibleContent className="mt-2 text-sm">Content</CollapsibleContent></Collapsible>
            <Collapsible variant="gradient" defaultOpen className="p-4"><CollapsibleTrigger className="text-sm font-medium">gradient</CollapsibleTrigger><CollapsibleContent className="mt-2 text-sm">Content</CollapsibleContent></Collapsible>
          </div>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Readable glass panel, open by default.",
        code: `import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Collapsible variant="glass" defaultOpen className="w-72 p-4">\n      <CollapsibleTrigger className="text-sm font-medium">Advanced options</CollapsibleTrigger>\n      <CollapsibleContent className="mt-3 text-sm text-[var(--color-muted)]">\n        Fine tune blur, saturation and refraction.\n      </CollapsibleContent>\n    </Collapsible>\n  )\n}`,
        render: (
          <Collapsible variant="glass" defaultOpen className="w-72 p-4">
            <CollapsibleTrigger className="text-sm font-medium">Advanced options</CollapsibleTrigger>
            <CollapsibleContent className="mt-3 text-sm text-[var(--color-muted)]">
              Fine tune blur, saturation and refraction.
            </CollapsibleContent>
          </Collapsible>
        )
      }
    ]
  },

  breadcrumb: {
    badge: "Primitive / Molecule",
    props: [
      {
        title: "Breadcrumb",
        rows: [
          { prop: "variant", type: '"glinr" | "plain" | "solid" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "ambient style (glinr)", description: "Omit it for the ambient design style: a bare trail whose current page is a raised pill. `plain` is a flat trail, `solid`, `soft`, `outline` and `gradient` wrap it in a pill, `glass` is opt-in and needs a backdrop. Legacy `default` follows the ambient style, `frosted` maps to `glass`." }
        ]
      },
      {
        title: "BreadcrumbLink",
        rows: [{ prop: "asChild", type: "boolean", defaultValue: "false", description: "Render your router link instead of an anchor." }]
      },
      {
        title: "BreadcrumbSeparator / BreadcrumbEllipsis / BreadcrumbPage",
        rows: [
          { prop: "children", type: "ReactNode", defaultValue: "CaretRight", description: "Separator only: custom separator icon. Flips automatically in RTL." }
        ]
      }
    ],
    accessibility: {
      summary: [
        "Rendered as a nav landmark labelled breadcrumb with an ordered list.",
        "The current page is marked with aria-current=page.",
        "Separators are hidden from assistive tech; the ellipsis exposes a screen reader label."
      ],
      keyboard: [{ key: "Tab", description: "Move through breadcrumb links in order." }],
      aria: ['`aria-label="breadcrumb"` on nav', '`aria-current="page"` on BreadcrumbPage', '`aria-hidden` on separators']
    },
    reducedMotion: {
      description: "Only color transitions are used, and they are disabled with prefers-reduced-motion.",
      affected: ["color"]
    },
    examples: [
      {
        title: "Basic",
        code: `import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Breadcrumb>\n      <BreadcrumbList>\n        <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>\n        <BreadcrumbSeparator />\n        <BreadcrumbItem><BreadcrumbLink href="/docs">Docs</BreadcrumbLink></BreadcrumbItem>\n        <BreadcrumbSeparator />\n        <BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>\n      </BreadcrumbList>\n    </Breadcrumb>\n  )\n}`,
        render: (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink href="#">Docs</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a colourful or photographic backdrop to read as frosted. Pick one in the stage header.",
        code: `import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Breadcrumb variant="glass">\n      <BreadcrumbList>\n        <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>\n        <BreadcrumbSeparator />\n        <BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>\n        <BreadcrumbSeparator />\n        <BreadcrumbItem><BreadcrumbPage>Settings</BreadcrumbPage></BreadcrumbItem>\n      </BreadcrumbList>\n    </Breadcrumb>\n  )\n}`,
        render: (
          <Breadcrumb variant="glass">
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Settings</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        )
      }
    ]
  },

  pagination: {
    badge: "Primitive / Molecule",
    props: [
      {
        title: "Pagination",
        rows: [{ prop: "variant", type: '"glinr" | "plain" | "solid" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "ambient style (glinr)", description: "Look of the page links. Omit it for the ambient design style: pill links with a raised current page. `plain` is the shadcn outline look, `glass` is opt-in and needs a backdrop." }]
      },
      {
        title: "PaginationLink",
        rows: [
          { prop: "isActive", type: "boolean", defaultValue: "false", description: "Marks the current page with aria-current=page." },
          { prop: "size", type: '"icon" | "sm" | "default"', defaultValue: "icon", description: "Hit area size." }
        ]
      },
      {
        title: "PaginationPrevious / PaginationNext / PaginationEllipsis",
        rows: [{ prop: "children", type: "ReactNode", description: "Override the Previous or Next label." }]
      }
    ],
    accessibility: {
      summary: [
        "Rendered as a nav landmark labelled pagination.",
        "The active page link carries aria-current=page.",
        "Previous and next have explicit accessible names; the ellipsis has a screen reader label."
      ],
      keyboard: [{ key: "Tab", description: "Move through page links." }, { key: "Enter", description: "Follow the focused link." }],
      aria: ['`aria-label="pagination"` on nav', '`aria-current="page"` on active link', '`aria-label="Go to next page"`']
    },
    reducedMotion: {
      description: "Only color transitions are used, and they are disabled with prefers-reduced-motion.",
      affected: ["background-color"]
    },
    examples: [
      {
        title: "Basic",
        code: `import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Pagination>\n      <PaginationContent>\n        <PaginationItem><PaginationPrevious href="#" /></PaginationItem>\n        <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>\n        <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>\n        <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>\n        <PaginationItem><PaginationEllipsis /></PaginationItem>\n        <PaginationItem><PaginationNext href="#" /></PaginationItem>\n      </PaginationContent>\n    </Pagination>\n  )\n}`,
        render: (
          <Pagination>
            <PaginationContent>
              <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
              <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
              <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>
              <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
              <PaginationItem><PaginationEllipsis /></PaginationItem>
              <PaginationItem><PaginationNext href="#" /></PaginationItem>
            </PaginationContent>
          </Pagination>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a colourful or photographic backdrop to read as frosted. Pick one in the stage header.",
        code: `import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Pagination variant="glass">\n      <PaginationContent>\n        <PaginationItem><PaginationPrevious href="#" /></PaginationItem>\n        <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>\n        <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>\n        <PaginationItem><PaginationNext href="#" /></PaginationItem>\n      </PaginationContent>\n    </Pagination>\n  )\n}`,
        render: (
          <Pagination variant="glass">
            <PaginationContent>
              <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
              <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
              <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>
              <PaginationItem><PaginationNext href="#" /></PaginationItem>
            </PaginationContent>
          </Pagination>
        )
      }
    ]
  }
}
