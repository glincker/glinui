import {
  Button,
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  HoverCard,
  HoverCardTrigger,
  Popover,
  PopoverTrigger,
  Sheet,
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Toaster,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  toast
} from "@glinui/ui"

import type { ComponentExample } from "@/lib/component-docs"
import { StageHoverCardContent, StagePopoverContent, StageSheetContent } from "@/components/docs/overlay-demos"
import {
  AlertDialogVariantsDemo,
  BreadcrumbVariantsDemo,
  CommandVariantsDemo,
  ContextMenuVariantsDemo,
  DropdownMenuVariantsDemo,
  HoverCardVariantsDemo,
  MenubarVariantsDemo,
  ModalVariantsDemo,
  NavigationMenuVariantsDemo,
  PaginationVariantsDemo,
  PopoverVariantsDemo,
  SheetVariantsDemo,
  ToasterVariantsDemo,
  TooltipVariantsDemo,
} from "@/components/docs/panel-variants-demos"
import {
  alertDialogVariantsCode,
  breadcrumbVariantsCode,
  commandVariantsCode,
  contextMenuVariantsCode,
  dropdownMenuVariantsCode,
  hoverCardVariantsCode,
  menubarVariantsCode,
  modalVariantsCode,
  navigationMenuVariantsCode,
  paginationVariantsCode,
  popoverVariantsCode,
  sheetVariantsCode,
  toasterVariantsCode,
  tooltipVariantsCode
} from "@/components/docs/panel-variants-code"

const DESCRIPTION =
  "Every look of the shared vocabulary: glinr (the default), plain (shadcn), solid, soft, outline, ghost, gradient and glass. Omit `variant` to follow the ambient design style."

function variants(code: string, render: ComponentExample["render"], description: string = DESCRIPTION): ComponentExample {
  return { title: "Variants", description, code, render }
}

/**
 * "Variants" examples for the floating panel family. Appended to each component's examples
 * (see component-docs-all.ts). The explicit glass example of each component is titled "Glass (opt-in)".
 */
export const panelVariantsExamples: Record<string, ComponentExample> = {
  modal: variants(modalVariantsCode, <ModalVariantsDemo />),
  "alert-dialog": variants(alertDialogVariantsCode, <AlertDialogVariantsDemo />),
  sheet: variants(sheetVariantsCode, <SheetVariantsDemo />),
  popover: variants(popoverVariantsCode, <PopoverVariantsDemo />),
  "hover-card": variants(hoverCardVariantsCode, <HoverCardVariantsDemo />),
  "dropdown-menu": variants(dropdownMenuVariantsCode, <DropdownMenuVariantsDemo />),
  "context-menu": variants(contextMenuVariantsCode, <ContextMenuVariantsDemo />),
  menubar: variants(menubarVariantsCode, <MenubarVariantsDemo />),
  "navigation-menu": variants(navigationMenuVariantsCode, <NavigationMenuVariantsDemo />),
  command: variants(commandVariantsCode, <CommandVariantsDemo />),
  tooltip: variants(tooltipVariantsCode, <TooltipVariantsDemo />, `${DESCRIPTION} The default tooltip is a compact high-contrast pill that inverts per theme scope.`),
  toast: variants(toasterVariantsCode, <ToasterVariantsDemo />, "Pick a look, then fire a toast. The Toaster owns the surface of every toast; success, error, warning and info add a leading status bar."),
  breadcrumb: variants(breadcrumbVariantsCode, <BreadcrumbVariantsDemo />),
  pagination: variants(paginationVariantsCode, <PaginationVariantsDemo />)
}

const GLASS_NOTE =
  "variant=\"glass\" is opt-in. It blurs and tints what sits behind the panel (with a readable opacity floor), so it needs a colourful or photographic backdrop: switch the stage backdrop to see it."

function glass(code: string, render: ComponentExample["render"]): ComponentExample {
  return { title: "Glass (opt-in)", description: GLASS_NOTE, code, render }
}

/** Explicit glass examples for components whose own docs entry has none. */
export const panelGlassExamples: Record<string, ComponentExample> = {
  sheet: glass(
    `import { Button, Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@glinui/ui"

export function Demo() {
  return (
    <Sheet>
      <SheetTrigger asChild><Button variant="outline">Open glass sheet</Button></SheetTrigger>
      <SheetContent variant="glass">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>The page behind stays visible through the panel.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose asChild><Button variant="ghost">Close</Button></SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}`,
    <Sheet>
      <SheetTrigger asChild><Button variant="outline">Open glass sheet</Button></SheetTrigger>
      <StageSheetContent variant="glass">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>The page behind stays visible through the panel.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose asChild><Button variant="ghost">Close</Button></SheetClose>
        </SheetFooter>
      </StageSheetContent>
    </Sheet>
  ),
  popover: glass(
    `import { Button, Popover, PopoverContent, PopoverTrigger } from "@glinui/ui"

export function Demo() {
  return (
    <Popover>
      <PopoverTrigger asChild><Button variant="outline">Open glass popover</Button></PopoverTrigger>
      <PopoverContent variant="glass">Frosted, with a readable floor.</PopoverContent>
    </Popover>
  )
}`,
    <Popover>
      <PopoverTrigger asChild><Button variant="outline">Open glass popover</Button></PopoverTrigger>
      <StagePopoverContent variant="glass">Frosted, with a readable floor.</StagePopoverContent>
    </Popover>
  ),
  "hover-card": glass(
    `import { Button, HoverCard, HoverCardContent, HoverCardTrigger } from "@glinui/ui"

export function Demo() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild><Button variant="outline">Hover for glass</Button></HoverCardTrigger>
      <HoverCardContent variant="glass">Frosted, with a readable floor.</HoverCardContent>
    </HoverCard>
  )
}`,
    <HoverCard>
      <HoverCardTrigger asChild><Button variant="outline">Hover for glass</Button></HoverCardTrigger>
      <StageHoverCardContent variant="glass">Frosted, with a readable floor.</StageHoverCardContent>
    </HoverCard>
  ),
  command: glass(
    `import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@glinui/ui"

export function Demo() {
  return (
    <Command variant="glass" className="max-w-md">
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandGroup heading="Actions">
          <CommandItem>Open settings</CommandItem>
          <CommandItem>Invite teammate</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}`,
    <Command variant="glass" className="max-w-md">
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandGroup heading="Actions">
          <CommandItem>Open settings</CommandItem>
          <CommandItem>Invite teammate</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
  tooltip: glass(
    `import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@glinui/ui"

export function Demo() {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild><Button variant="outline">Hover me</Button></TooltipTrigger>
        <TooltipContent variant="glass">Frosted tooltip</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}`,
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild><Button variant="outline">Hover me</Button></TooltipTrigger>
        <TooltipContent variant="glass">Frosted tooltip</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  toast: glass(
    `import { Button, Toaster, toast } from "@glinui/ui"

export function Demo() {
  return (
    <>
      <Toaster position="bottom-right" variant="glass" />
      <Button onClick={() => toast("Settings saved", { description: "Frosted, with a readable floor." })}>
        Show glass toast
      </Button>
    </>
  )
}`,
    <>
      <Toaster position="bottom-right" variant="glass" />
      <Button onClick={() => toast("Settings saved", { description: "Frosted, with a readable floor." })}>
        Show glass toast
      </Button>
    </>
  )
}
