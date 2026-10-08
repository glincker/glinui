"use client"

import { Bell, CaretRight, Gear, House, Tray, UsersThree } from "@phosphor-icons/react/dist/ssr"

import { Badge } from "@glinui/ui"
import { Button } from "@glinui/ui"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle
} from "@glinui/ui"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger
} from "@glinui/ui"
import type { Batch3Docs } from "./batch-3-types"

type SidebarDemoProps = { variant?: "glinr" | "plain" | "solid" | "soft" | "outline" | "ghost" | "gradient" | "glass"; collapsible?: "offcanvas" | "icon" | "none"; className?: string }

/** Bounded preview frame: the sidebar docks inside the frame, never to the viewport. */
function SidebarDemo({ variant, collapsible = "icon", className }: SidebarDemoProps) {
  return (
    <div
      className={
        variant === "glass"
          ? "relative h-80 w-full overflow-hidden rounded-xl border border-[var(--line-soft)] bg-gradient-to-br from-violet-500/30 via-sky-400/20 to-fuchsia-400/30"
          : `relative h-80 w-full overflow-hidden rounded-xl border border-[var(--line-soft)] bg-[var(--color-background)] ${className ?? ""}`
      }
    >
      <SidebarProvider storageKey={null} className="h-full">
        <Sidebar variant={variant} collapsible={collapsible} label="Workspace" containerClassName="static h-full">
          <SidebarHeader>
            <div className="flex h-9 items-center gap-2 px-2 text-sm font-semibold group-data-[collapsible=icon]/sidebar:justify-center group-data-[collapsible=icon]/sidebar:px-0">
              <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-[var(--color-accent)] text-xs text-white">G</span>
              <span className="truncate group-data-[collapsible=icon]/sidebar:hidden">Glin Studio</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Platform</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive tooltip="Home"><House aria-hidden="true" /><span>Home</span></SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Inbox"><Tray aria-hidden="true" /><span>Inbox</span></SidebarMenuButton>
                    <SidebarMenuBadge>8</SidebarMenuBadge>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Team"><UsersThree aria-hidden="true" /><span>Team</span></SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup collapsible>
              <SidebarGroupLabel>Account</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Settings"><Gear aria-hidden="true" /><span>Settings</span></SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Notifications"><Bell aria-hidden="true" /><span>Notifications</span></SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset className="bg-transparent">
          <header className="flex h-12 items-center gap-2 border-b border-[var(--line-soft)] px-3">
            <SidebarTrigger />
            <span className="text-sm text-[var(--color-muted)]">Press Ctrl/Cmd + B</span>
          </header>
          <div className="p-4 text-sm text-[var(--color-muted)]">Page content</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

const SIDEBAR_VARIANTS = ["glinr", "plain", "solid", "soft", "outline", "ghost", "gradient", "glass"] as const

/** Eight compact docked rails, one per look, to compare the active item and hairlines side by side. */
function SidebarVariantsDemo() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {SIDEBAR_VARIANTS.map((variant) => (
        <div
          key={variant}
          className={
            variant === "glass"
              ? "h-52 overflow-hidden rounded-xl border border-[var(--line-soft)] bg-gradient-to-br from-violet-500/30 via-sky-400/20 to-fuchsia-400/30"
              : "h-52 overflow-hidden rounded-xl border border-[var(--line-soft)] bg-[var(--color-background)]"
          }
        >
          <SidebarProvider storageKey={null} className="h-full min-h-0">
            <Sidebar variant={variant} collapsible="none" label={`${variant} sidebar`} containerClassName="static h-full">
              <SidebarHeader>
                <div className="flex h-8 items-center px-2 text-sm font-semibold">{variant}</div>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Platform</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton isActive><House aria-hidden="true" /><span>Home</span></SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton><Tray aria-hidden="true" /><span>Inbox</span></SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
          </SidebarProvider>
        </div>
      ))}
    </div>
  )
}

const sidebarVariantsCode = `import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@glinui/ui"

const variants = ["glinr", "plain", "solid", "soft", "outline", "ghost", "gradient", "glass"] as const

export function Demo() {
  return variants.map((variant) => (
    <SidebarProvider key={variant}>
      <Sidebar variant={variant} collapsible="none">
        <SidebarHeader>{variant}</SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem><SidebarMenuButton isActive>Home</SidebarMenuButton></SidebarMenuItem>
                <SidebarMenuItem><SidebarMenuButton>Inbox</SidebarMenuButton></SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  ))
}`

const sidebarCode = (variant: string | null, collapsible: string) => `import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger
} from "@glinui/ui"
import { House, Gear } from "@phosphor-icons/react"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar${variant ? ` variant="${variant}"` : ""} collapsible="${collapsible}">
        <SidebarHeader>Glin Studio</SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="Home"><House /><span>Home</span></SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Settings"><Gear /><span>Settings</span></SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>Footer</SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}`

export const batch3bDocs: Batch3Docs = {
  item: {
    badge: "Primitive / Molecule",
    props: [
      {
        title: "Item",
        rows: [
          { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "gradient" | "glass" | "muted"', defaultValue: "ambient (glinr)", description: "Surface variant. Omit to follow the ambient design style (glinr by default, plain for minimal, glass for glass)." },
          { prop: "tone", type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"', defaultValue: "neutral", description: "Colour tone for the vocabulary variants." },
          { prop: "size", type: '"default" | "sm"', defaultValue: "default", description: "Padding scale." },
          { prop: "asChild", type: "boolean", defaultValue: "false", description: "Render as the child element, for example a link." }
        ]
      },
      {
        title: "ItemMedia",
        rows: [{ prop: "variant", type: '"default" | "icon" | "image"', defaultValue: "default", description: "Icon tile or rounded image frame." }]
      },
      {
        title: "ItemGroup / ItemSeparator / ItemHeader / ItemContent / ItemTitle / ItemDescription / ItemActions / ItemFooter",
        rows: [{ prop: "className", type: "string", description: "Merged onto each slot." }]
      }
    ],
    accessibility: {
      summary: [
        "Items are neutral containers. Use `asChild` with an anchor or button for interactive rows.",
        "Interactive items show a violet focus ring.",
        "ItemSeparator exposes `role=\"separator\"`."
      ],
      keyboard: [
        { key: "Tab", description: "Moves focus through interactive items and actions." },
        { key: "Enter", description: "Activates a link item." }
      ]
    },
    reducedMotion: {
      description: "Hover and border transitions are removed with reduced motion.",
      affected: ["background-color", "border-color", "box-shadow"]
    },
    examples: [
      {
        title: "Basic",
        code: `import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle, Button } from "@glinui/ui"\nimport { Bell } from "@phosphor-icons/react"\n\nexport function Demo() {\n  return (\n    <Item variant="default">\n      <ItemMedia variant="icon"><Bell aria-hidden="true" /></ItemMedia>\n      <ItemContent>\n        <ItemTitle>Notifications</ItemTitle>\n        <ItemDescription>Choose what you hear about.</ItemDescription>\n      </ItemContent>\n      <ItemActions><Button size="sm" variant="outline">Manage</Button></ItemActions>\n    </Item>\n  )\n}`,
        render: (
          <Item variant="default" className="w-full max-w-md">
            <ItemMedia variant="icon"><Bell aria-hidden="true" /></ItemMedia>
            <ItemContent>
              <ItemTitle>Notifications</ItemTitle>
              <ItemDescription>Choose what you hear about.</ItemDescription>
            </ItemContent>
            <ItemActions><Button size="sm" variant="outline">Manage</Button></ItemActions>
          </Item>
        )
      },
      {
        title: "Variants",
        description: "Every vocabulary variant on the default tone. Omit variant to follow the ambient design style.",
        code: `import { Item, ItemContent, ItemDescription, ItemTitle } from "@glinui/ui"

export function ItemVariantsDemo() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Item variant="glinr"><ItemContent><ItemTitle>glinr</ItemTitle><ItemDescription>Item description</ItemDescription></ItemContent></Item>
      <Item variant="solid"><ItemContent><ItemTitle>solid</ItemTitle><ItemDescription>Item description</ItemDescription></ItemContent></Item>
      <Item variant="plain"><ItemContent><ItemTitle>plain</ItemTitle><ItemDescription>Item description</ItemDescription></ItemContent></Item>
      <Item variant="soft"><ItemContent><ItemTitle>soft</ItemTitle><ItemDescription>Item description</ItemDescription></ItemContent></Item>
      <Item variant="outline"><ItemContent><ItemTitle>outline</ItemTitle><ItemDescription>Item description</ItemDescription></ItemContent></Item>
      <Item variant="ghost"><ItemContent><ItemTitle>ghost</ItemTitle><ItemDescription>Item description</ItemDescription></ItemContent></Item>
      <Item variant="gradient"><ItemContent><ItemTitle>gradient</ItemTitle><ItemDescription>Item description</ItemDescription></ItemContent></Item>
    </div>
  )
}`,
        render: (
          <div className="grid gap-3 md:grid-cols-2">
            <Item variant="glinr"><ItemContent><ItemTitle>glinr</ItemTitle><ItemDescription>Item description</ItemDescription></ItemContent></Item>
            <Item variant="solid"><ItemContent><ItemTitle>solid</ItemTitle><ItemDescription>Item description</ItemDescription></ItemContent></Item>
            <Item variant="plain"><ItemContent><ItemTitle>plain</ItemTitle><ItemDescription>Item description</ItemDescription></ItemContent></Item>
            <Item variant="soft"><ItemContent><ItemTitle>soft</ItemTitle><ItemDescription>Item description</ItemDescription></ItemContent></Item>
            <Item variant="outline"><ItemContent><ItemTitle>outline</ItemTitle><ItemDescription>Item description</ItemDescription></ItemContent></Item>
            <Item variant="ghost"><ItemContent><ItemTitle>ghost</ItemTitle><ItemDescription>Item description</ItemDescription></ItemContent></Item>
            <Item variant="gradient"><ItemContent><ItemTitle>gradient</ItemTitle><ItemDescription>Item description</ItemDescription></ItemContent></Item>
          </div>
        )
      },
      {
        title: "Group with separators and link",
        code: `import { Item, ItemContent, ItemGroup, ItemSeparator, ItemTitle, ItemDescription } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <ItemGroup className="w-full max-w-md">\n      <Item asChild variant="muted"><a href="#a"><ItemContent><ItemTitle>Account</ItemTitle><ItemDescription>Profile and security</ItemDescription></ItemContent></a></Item>\n      <ItemSeparator />\n      <Item asChild variant="muted"><a href="#b"><ItemContent><ItemTitle>Billing</ItemTitle><ItemDescription>Plans and invoices</ItemDescription></ItemContent></a></Item>\n    </ItemGroup>\n  )\n}`,
        render: (
          <ItemGroup className="w-full max-w-md">
            <Item asChild variant="muted"><a href="#a"><ItemContent><ItemTitle>Account</ItemTitle><ItemDescription>Profile and security</ItemDescription></ItemContent><CaretRight aria-hidden="true" className="size-4 rtl:rotate-180" /></a></Item>
            <ItemSeparator />
            <Item asChild variant="muted"><a href="#b"><ItemContent><ItemTitle>Billing</ItemTitle><ItemDescription>Plans and invoices</ItemDescription></ItemContent><CaretRight aria-hidden="true" className="size-4 rtl:rotate-180" /></a></Item>
          </ItemGroup>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it. Switch the preview stage to Vivid or Photo to see the frosted surface.",
        code: `import { Item, ItemContent, ItemDescription, ItemFooter, ItemHeader, ItemTitle } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Item variant="glass">\n      <ItemHeader>Release</ItemHeader>\n      <ItemContent><ItemTitle>v1.24.0</ItemTitle><ItemDescription>Ships today.</ItemDescription></ItemContent>\n      <ItemFooter>Updated 2h ago</ItemFooter>\n    </Item>\n  )\n}`,
        render: (
          <Item variant="glass" className="w-full max-w-md">
            <ItemHeader><Badge>Release</Badge></ItemHeader>
            <ItemContent><ItemTitle>v1.24.0</ItemTitle><ItemDescription>Ships today.</ItemDescription></ItemContent>
            <ItemFooter className="text-xs text-[var(--color-muted)]">Updated 2h ago</ItemFooter>
          </Item>
        )
      }
    ]
  },

  sidebar: {
    badge: "Primitive / Organism",
    props: [
      {
        title: "SidebarProvider",
        rows: [
          { prop: "defaultOpen", type: "boolean", defaultValue: "true", description: "Initial open state when uncontrolled." },
          { prop: "open / onOpenChange", type: "boolean / (open: boolean) => void", description: "Controlled open state." },
          { prop: "storageKey", type: "string | null", defaultValue: '"glin-sidebar-state"', description: "localStorage key for persisting desktop state. Null disables persistence." }
        ]
      },
      {
        title: "Sidebar",
        rows: [
          { prop: "side", type: '"start" | "end"', defaultValue: "start", description: "Inline edge to dock to. Flips in RTL." },
          { prop: "variant", type: '"glinr" | "plain" | "solid" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "ambient style (glinr)", description: "Surface look. Omit it for the ambient design style: a lifted rail with hairline separators and a raised pill for the active item. `plain` is flat, `glass` is opt-in and needs a backdrop. Legacy `default` follows the ambient style." },
          { prop: "collapsible", type: '"offcanvas" | "icon" | "none"', defaultValue: "offcanvas", description: "Collapse to nothing, to an icon rail, or never." },
          { prop: "label", type: "string", defaultValue: "Sidebar", description: "Accessible name of the navigation landmark." },
          { prop: "containerClassName", type: "string", description: "Classes for the docking element, e.g. `static h-full` inside a bounded frame." }
        ]
      },
      {
        title: "SidebarMenuButton",
        rows: [
          { prop: "isActive", type: "boolean", defaultValue: "false", description: "Marks the current page and sets aria-current." },
          { prop: "tooltip", type: "string", description: "Label shown on hover when collapsed to icons." },
          { prop: "asChild", type: "boolean", defaultValue: "false", description: "Render a link element." },
          { prop: "variant / size", type: '"default" | "outline" / "sm" | "md" | "lg"', description: "Button style and height." }
        ]
      },
      {
        title: "SidebarGroup",
        rows: [
          { prop: "collapsible", type: "boolean", defaultValue: "false", description: "Makes the label a toggle with aria-expanded." },
          { prop: "defaultOpen", type: "boolean", defaultValue: "true", description: "Initial open state of a collapsible group." }
        ]
      },
      { title: "Other parts", rows: [{ prop: "useSidebar()", type: "{ state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar }", description: "Read and control the sidebar from any child." }] }
    ],
    accessibility: {
      summary: [
        "The panel is a `nav` landmark with an accessible name.",
        "The current page uses `aria-current=\"page\"`; collapsible group labels expose `aria-expanded` and `aria-controls`.",
        "On small screens the sidebar becomes a Sheet dialog with focus trap and Escape to close.",
        "In icon mode, labels stay in the accessibility tree (visually hidden) and tooltips reveal them."
      ],
      keyboard: [
        { key: "Ctrl/Cmd + B", description: "Toggle the sidebar." },
        { key: "Tab / Shift + Tab", description: "Move through menu buttons." },
        { key: "Enter / Space", description: "Activate a button or toggle a group." },
        { key: "Escape", description: "Close the mobile sheet." }
      ],
      aria: ['`<nav aria-label>`', '`aria-current="page"` on the active button', "`aria-expanded` on trigger and collapsible group labels"]
    },
    reducedMotion: {
      description: "Width and caret transitions are disabled; state changes apply instantly.",
      affected: ["width", "transform (rotate)"]
    },
    examples: [
      {
        title: "Collapsible to icons",
        description: "Use the trigger, the rail, or Ctrl/Cmd + B. Rendered inside a bounded frame.",
        code: sidebarCode(null, "icon"),
        render: <SidebarDemo />
      },
      {
        title: "Variants",
        description: "Every look of the shared vocabulary. glinr (the default) is a lifted rail with hairline separators and a raised pill for the active item; plain is flat and shadcn-like. Collapsed icon mode keeps the same pill as a circle.",
        code: sidebarVariantsCode,
        render: <SidebarVariantsDemo />
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a colourful or photographic backdrop behind the rail. The frame supplies one here.",
        code: sidebarCode("glass", "icon"),
        render: <SidebarDemo variant="glass" />
      },
      {
        title: "Off-canvas",
        description: "Collapses fully; reopen with the trigger.",
        code: sidebarCode(null, "offcanvas"),
        render: <SidebarDemo collapsible="offcanvas" />
      }
    ]
  }
}
