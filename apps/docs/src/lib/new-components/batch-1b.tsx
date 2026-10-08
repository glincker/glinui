"use client"

import { ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuShortcut, ContextMenuTrigger } from "@glinui/ui"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from "@glinui/ui"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@glinui/ui"
import type { ComponentDocMeta } from "../component-docs"

const menuMotion = {
  description: "Panels fade and scale from 95% on open using transform and opacity only. With prefers-reduced-motion the animation is removed.",
  affected: ["opacity", "transform"]
}

const navCode = (variant: string) =>
  `import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <NavigationMenu aria-label="Main"${variant}>\n      <NavigationMenuList>\n        <NavigationMenuItem>\n          <NavigationMenuTrigger>Products</NavigationMenuTrigger>\n          <NavigationMenuContent>\n            <div className="grid w-64 gap-1">\n              <NavigationMenuLink href="#">Analytics</NavigationMenuLink>\n              <NavigationMenuLink href="#">Automation</NavigationMenuLink>\n            </div>\n          </NavigationMenuContent>\n        </NavigationMenuItem>\n        <NavigationMenuItem>\n          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>Docs</NavigationMenuLink>\n        </NavigationMenuItem>\n      </NavigationMenuList>\n    </NavigationMenu>\n  )\n}`

function NavDemo({ variant }: { variant?: "glass" }) {
  return (
    <div className="min-h-44">
      <NavigationMenu aria-label="Main" variant={variant}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-64 gap-1">
                <NavigationMenuLink href="#">Analytics</NavigationMenuLink>
                <NavigationMenuLink href="#">Automation</NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>Docs</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

const menubarCode = (variant: string) =>
  `import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Menubar${variant}>\n      <MenubarMenu>\n        <MenubarTrigger>File</MenubarTrigger>\n        <MenubarContent>\n          <MenubarItem>New tab <MenubarShortcut>Cmd T</MenubarShortcut></MenubarItem>\n          <MenubarItem>New window</MenubarItem>\n          <MenubarSeparator />\n          <MenubarItem>Print</MenubarItem>\n        </MenubarContent>\n      </MenubarMenu>\n      <MenubarMenu>\n        <MenubarTrigger>Edit</MenubarTrigger>\n        <MenubarContent>\n          <MenubarItem>Undo</MenubarItem>\n          <MenubarItem>Redo</MenubarItem>\n        </MenubarContent>\n      </MenubarMenu>\n    </Menubar>\n  )\n}`

function BarDemo({ variant }: { variant?: "glass" }) {
  return (
    <Menubar variant={variant}>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New tab <MenubarShortcut>Cmd T</MenubarShortcut></MenubarItem>
          <MenubarItem>New window</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Print</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo</MenubarItem>
          <MenubarItem>Redo</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

const ctxCode = (variant: string) =>
  `import { ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuShortcut, ContextMenuTrigger } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <ContextMenu${variant}>\n      <ContextMenuTrigger className="flex h-32 w-72 items-center justify-center rounded-xl border border-dashed border-[var(--color-border)] text-sm text-[var(--color-muted)]">\n        Right click here\n      </ContextMenuTrigger>\n      <ContextMenuContent className="w-56">\n        <ContextMenuLabel>Actions</ContextMenuLabel>\n        <ContextMenuItem>Back <ContextMenuShortcut>Cmd [</ContextMenuShortcut></ContextMenuItem>\n        <ContextMenuItem>Reload <ContextMenuShortcut>Cmd R</ContextMenuShortcut></ContextMenuItem>\n        <ContextMenuSeparator />\n        <ContextMenuCheckboxItem checked>Show bookmarks</ContextMenuCheckboxItem>\n      </ContextMenuContent>\n    </ContextMenu>\n  )\n}`

function CtxDemo({ variant }: { variant?: "glass" }) {
  return (
    <ContextMenu variant={variant}>
      <ContextMenuTrigger className="flex h-32 w-72 items-center justify-center rounded-xl border border-dashed border-[var(--color-border)] text-sm text-[var(--color-muted)]">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuLabel>Actions</ContextMenuLabel>
        <ContextMenuItem>Back <ContextMenuShortcut>Cmd [</ContextMenuShortcut></ContextMenuItem>
        <ContextMenuItem>Reload <ContextMenuShortcut>Cmd R</ContextMenuShortcut></ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked>Show bookmarks</ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

const menuItemRows = [
  { prop: "inset", type: "boolean", defaultValue: "false", description: "Item and label: add start padding to align with items that have indicators." },
  { prop: "disabled", type: "boolean", defaultValue: "false", description: "Item: blocks selection and focus." },
  { prop: "onSelect", type: "(event: Event) => void", description: "Item: called on selection." }
]

export const batch1bDocs: Record<string, ComponentDocMeta> = {
  "navigation-menu": {
    badge: "Primitive / Molecule",
    props: [
      {
        title: "NavigationMenu",
        rows: [
          { prop: "variant", type: '"glinr" | "plain" | "solid" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "ambient style (glinr)", description: "Surface of the viewport panel and the trigger pills. Omit it for the ambient design style. `glass` is opt-in and needs a backdrop." },
          { prop: "viewport", type: "boolean", defaultValue: "true", description: "Render content in a shared viewport below the list." },
          { prop: "delayDuration", type: "number", defaultValue: "200", description: "Hover open delay in ms." },
          { prop: "dir", type: '"ltr" | "rtl"', description: "Reading direction for motion and keyboard." }
        ]
      },
      {
        title: "NavigationMenuLink / Trigger",
        rows: [
          { prop: "active", type: "boolean", description: "Link: marks the current page with aria-current=page." },
          { prop: "navigationMenuTriggerStyle()", type: "() => string", description: "Helper to style a plain link like a trigger." }
        ]
      }
    ],
    accessibility: {
      summary: [
        "Rendered as a nav landmark; give it an aria-label.",
        "Triggers announce expanded state and control their content.",
        "Full roving keyboard support from Radix."
      ],
      keyboard: [
        { key: "Tab", description: "Move to the next trigger or link." },
        { key: "Enter / Space", description: "Open the focused trigger." },
        { key: "ArrowLeft / ArrowRight", description: "Move between top level items." },
        { key: "ArrowDown", description: "Enter open content." },
        { key: "Escape", description: "Close content and return focus to trigger." }
      ],
      aria: ["`aria-expanded` on triggers", "`aria-controls` links trigger to content", '`aria-current="page"` on active link']
    },
    reducedMotion: menuMotion,
    examples: [
      { title: "Basic", description: "Click Products to open the viewport.", code: navCode(""), render: <NavDemo /> },
      { title: "Glass (opt-in)", description: "Glass is opt-in and needs a colourful or photographic backdrop. Pick one in the stage header.", code: navCode(' variant="glass"'), render: <NavDemo variant="glass" /> }
    ]
  },

  menubar: {
    badge: "Primitive / Molecule",
    props: [
      {
        title: "Menubar",
        rows: [
          { prop: "variant", type: '"glinr" | "plain" | "solid" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "ambient style (glinr)", description: "Bar and panel surface. Omit it for the ambient design style; the open trigger and highlighted items are raised pills in the glinr look. `glass` is opt-in and needs a backdrop." },
          { prop: "value", type: "string", description: "Controlled open menu value." },
          { prop: "onValueChange", type: "(value: string) => void", description: "Called when the open menu changes." },
          { prop: "loop", type: "boolean", defaultValue: "false", description: "Loop keyboard focus across triggers." }
        ]
      },
      { title: "MenubarItem and friends", rows: menuItemRows }
    ],
    accessibility: {
      summary: [
        "Uses the WAI-ARIA menubar pattern with roving focus.",
        "Check and radio items expose their checked state.",
        "Panels render in a portal and restore focus on close."
      ],
      keyboard: [
        { key: "ArrowLeft / ArrowRight", description: "Move between menu triggers." },
        { key: "ArrowDown", description: "Open the menu and focus the first item." },
        { key: "ArrowUp / ArrowDown", description: "Move between items." },
        { key: "Enter / Space", description: "Select the focused item." },
        { key: "Escape", description: "Close the menu." }
      ],
      aria: ['`role="menubar"`, `menu`, `menuitem`', "`aria-checked` on checkbox and radio items", "`aria-haspopup` and `aria-expanded` on triggers"]
    },
    reducedMotion: menuMotion,
    examples: [
      { title: "Basic", code: menubarCode(""), render: <BarDemo /> },
      { title: "Glass (opt-in)", description: "Glass is opt-in and needs a colourful or photographic backdrop. Pick one in the stage header.", code: menubarCode(' variant="glass"'), render: <BarDemo variant="glass" /> }
    ]
  },

  "context-menu": {
    badge: "Primitive / Molecule",
    props: [
      {
        title: "ContextMenu",
        rows: [
          { prop: "variant", type: '"glinr" | "plain" | "solid" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "ambient style (glinr)", description: "Panel surface for content and submenus. Omit it for the ambient design style. `glass` is opt-in and needs a backdrop." },
          { prop: "onOpenChange", type: "(open: boolean) => void", description: "Called when the menu opens or closes." },
          { prop: "modal", type: "boolean", defaultValue: "true", description: "Block outside interaction while open." }
        ]
      },
      { title: "ContextMenuItem and friends", rows: menuItemRows }
    ],
    accessibility: {
      summary: [
        "Opens on right click, long press on touch, or the keyboard context menu key.",
        "Focus moves into the menu and returns to the trigger on close.",
        "Check and radio items expose their checked state."
      ],
      keyboard: [
        { key: "Shift + F10 / Menu key", description: "Open the menu from the focused trigger." },
        { key: "ArrowUp / ArrowDown", description: "Move between items." },
        { key: "ArrowRight / ArrowLeft", description: "Open or close a submenu." },
        { key: "Enter / Space", description: "Select the focused item." },
        { key: "Escape", description: "Close the menu." }
      ],
      aria: ['`role="menu"` and `menuitem`', "`aria-checked` on checkbox and radio items", "`aria-disabled` on disabled items"]
    },
    reducedMotion: menuMotion,
    examples: [
      { title: "Basic", description: "Right click the dashed area.", code: ctxCode(""), render: <CtxDemo /> },
      { title: "Glass (opt-in)", description: "Glass is opt-in and needs a colourful or photographic backdrop. Pick one in the stage header.", code: ctxCode(' variant="glass"'), render: <CtxDemo variant="glass" /> }
    ]
  }
}
