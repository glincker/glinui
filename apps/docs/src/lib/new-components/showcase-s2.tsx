import type { ComponentExample } from "@/lib/component-docs"
import type { PrimitiveComponentId } from "@/lib/primitives"
import {
  BreadcrumbFilesExample,
  BreadcrumbHeaderHero,
  LinkChangelogHero,
  LinkStatesExample,
  MenubarEditorHero,
  MenubarViewExample,
  NavInlineExample,
  NavMegaHero,
  PaginationCompactExample,
  PaginationTableHero,
  SidebarShellHero,
  TabsProjectHero,
  TabsUnderlineExample
} from "@/components/demos/nav-demos"
import {
  AlertDeleteHero,
  AlertDiscardExample,
  CommandPaletteHero,
  CommandUsersExample,
  ContextCanvasExample,
  ContextFilesHero,
  DropdownAccountHero,
  DropdownRowActionsExample,
  HoverCardLinkExample,
  HoverCardProfileHero,
  ModalInviteHero,
  ModalSizesExample,
  PopoverNotificationsExample,
  PopoverShareHero,
  SheetFiltersHero,
  SheetMobileNavExample,
  TooltipSidesExample,
  TooltipToolbarHero
} from "@/components/demos/overlay-showcase-demos"
import { showcaseS2Code } from "./showcase-s2-code.generated"

/*
 * Showcase examples for the Navigation and Overlays families (S2). Each entry replaces the plain "Basic"
 * example of the page and adds an "In a layout" or states example. Code strings are generated from the demo
 * sources (scratch script) so the copyable code matches what renders; Stage* wrappers become the plain components.
 */

function example(title: string, key: string, description: string, render: ComponentExample["render"]): ComponentExample {
  const code = showcaseS2Code[key]
  if (!code) throw new Error(`Missing generated code for ${key}`)
  return { title, description, code, render }
}

const OPEN_NOTE = "Overlays portal into the preview stage here. In your app they render into the page."

export const showcaseS2: Partial<Record<PrimitiveComponentId, ComponentExample[]>> = {
  "navigation-menu": [
    example("Marketing header", "NavMegaHero", "A site header with a mega menu opened by default. Each link pairs an icon with a short description.", <NavMegaHero />),
    example("Inline panels", "NavInlineExample", "Pass viewport={false} to render each panel under its own trigger instead of a shared viewport.", <NavInlineExample />)
  ],
  menubar: [
    example("Editor menu bar", "MenubarEditorHero", "A code editor window with File open. Shortcuts sit at the end of each row and submenus nest with MenubarSub.", <MenubarEditorHero />),
    example("View toggles", "MenubarViewExample", "Checkbox and radio items for editor settings. Press the arrow keys to move between menus.", <MenubarViewExample />)
  ],
  tabs: [
    example("Project page", "TabsProjectHero", "Tabs above a real panel: the active tab swaps the content, and arrow keys move focus between triggers.", <TabsProjectHero />),
    example("Underline with icons", "TabsUnderlineExample", "The underline look with icons, a count badge and a disabled tab.", <TabsUnderlineExample />)
  ],
  breadcrumb: [
    example("Page header", "BreadcrumbHeaderHero", "A trail with a home icon, a collapsed middle segment and the current page, above the page title and action.", <BreadcrumbHeaderHero />),
    example("Separators", "BreadcrumbFilesExample", "Pass any node as the separator, and keep the current page as plain text with BreadcrumbPage.", <BreadcrumbFilesExample />)
  ],
  sidebar: [
    example("App shell", "SidebarShellHero", "A mini app shell with a logo header, navigation groups, a collapsible group and a user footer. Use the trigger or Ctrl B to collapse it to icons. Below 768px wide the sidebar becomes a sheet.", <SidebarShellHero />)
  ],
  pagination: [
    example("Under a results table", "PaginationTableHero", "Page links below an invoices table, with a range summary on the left.", <PaginationTableHero />),
    example("Compact", "PaginationCompactExample", "Drop the ellipsis and numbered range when there are only a few pages.", <PaginationCompactExample />)
  ],
  link: [
    example("Changelog entry", "LinkChangelogHero", "Inline, arrow and footer links in one card.", <LinkChangelogHero />),
    example("Styles", "LinkStatesExample", "Underline, no underline, arrow, outline and size options.", <LinkStatesExample />)
  ],
  modal: [
    example("Invite teammates", "ModalInviteHero", `A members card with an invite dialog that holds a form and a live list. ${OPEN_NOTE}`, <ModalInviteHero />),
    example("Sizes", "ModalSizesExample", "Choose sm, md or lg to match the amount of content.", <ModalSizesExample />)
  ],
  "alert-dialog": [
    example("Delete a project", "AlertDeleteHero", `A destructive confirmation that lists consequences and asks for the project name before the action unlocks. ${OPEN_NOTE}`, <AlertDeleteHero />),
    example("Discard draft", "AlertDiscardExample", "A small alert dialog for a reversible but lossy action.", <AlertDiscardExample />)
  ],
  sheet: [
    example("Filters panel", "SheetFiltersHero", `A right-hand panel with form controls, opened from a results list. ${OPEN_NOTE}`, <SheetFiltersHero />),
    example("Mobile navigation", "SheetMobileNavExample", "A left sheet used as a mobile nav drawer.", <SheetMobileNavExample />)
  ],
  popover: [
    example("Share link", "PopoverShareHero", "A share popover opened by default with a link field and a switch. It stays interactive; press Escape to close.", <PopoverShareHero />),
    example("Notifications", "PopoverNotificationsExample", "A compact list in a popover anchored to an icon button.", <PopoverNotificationsExample />)
  ],
  "hover-card": [
    example("User profile", "HoverCardProfileHero", "A profile card shown from a handle. It is open by default here; in your app it opens on hover or keyboard focus.", <HoverCardProfileHero />),
    example("Link preview", "HoverCardLinkExample", "A small card previewing the target of an inline link.", <HoverCardLinkExample />)
  ],
  tooltip: [
    example("Toolbar", "TooltipToolbarHero", "Icon buttons labelled by tooltips with shortcuts. Italic is pinned open so the label is visible at a glance.", <TooltipToolbarHero />),
    example("Sides", "TooltipSidesExample", "Tooltips on all four sides, plus an explanation on a disabled action.", <TooltipSidesExample />)
  ],
  "dropdown-menu": [
    example("Account menu", "DropdownAccountHero", "An account menu opened by default: identity row with a plan badge, grouped items with icons and shortcuts, and a destructive sign out.", <DropdownAccountHero />),
    example("Row actions", "DropdownRowActionsExample", "A trigger menu at the end of a file row.", <DropdownRowActionsExample />)
  ],
  "context-menu": [
    example("File explorer", "ContextFilesHero", "Right click the card (or press and hold on touch) to open a menu with a submenu, a pinned toggle and a destructive item.", <ContextFilesHero />),
    example("Canvas", "ContextCanvasExample", "A menu for an empty canvas, with checkable view options.", <ContextCanvasExample />)
  ],
  command: [
    example("Command palette", "CommandPaletteHero", "A palette with recent items, suggestions and settings, each with an icon and shortcut. Type to filter.", <CommandPaletteHero />),
    example("Assign to", "CommandUsersExample", "The same component as a people picker, pre-filtered by the typed letter.", <CommandUsersExample />)
  ]
}

/** Existing examples that the showcase replaces; every other existing example (Variants, Glass, extras) is kept. */
const REPLACED_TITLES: ReadonlySet<string> = new Set(["Basic", "Basic Confirmation", "Collapsible to icons"])

export function mergeShowcaseS2<T extends { examples: ComponentExample[] }>(id: string, meta: T): T {
  const next = showcaseS2[id as PrimitiveComponentId]
  if (!next) return meta
  const titles = new Set(next.map((example) => example.title))
  const kept = meta.examples.filter((example) => !REPLACED_TITLES.has(example.title) && !titles.has(example.title))
  return { ...meta, examples: [...next, ...kept] }
}
