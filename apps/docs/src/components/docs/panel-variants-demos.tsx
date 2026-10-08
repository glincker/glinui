"use client"

import * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  HoverCard,
  HoverCardTrigger,
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
  Modal,
  ModalClose,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
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

import {
  StageAlertDialogContent,
  StageDropdownMenuContent,
  StageHoverCardContent,
  StageModalContent,
  StagePopoverContent,
  StageSheetContent
} from "@/components/docs/overlay-demos"

/**
 * Variant matrices for the floating panel family. Each demo renders every vocabulary look
 * (glinr, plain, solid, soft, outline, ghost, gradient, glass) so the docs show the whole system.
 * Overlays use the Stage wrappers, so they stay inside the preview stage and sit on its backdrop.
 */

export const PANEL_VARIANTS = ["glinr", "plain", "solid", "soft", "outline", "ghost", "gradient", "glass"] as const
export type PanelDemoVariant = (typeof PANEL_VARIANTS)[number]

const ROW = "flex flex-wrap items-center gap-2"

export function ModalVariantsDemo() {
  return (
    <div className={ROW}>
      {PANEL_VARIANTS.map((variant) => (
        <Modal key={variant}>
          <ModalTrigger asChild>
            <Button size="sm" variant="outline">{variant}</Button>
          </ModalTrigger>
          <StageModalContent variant={variant} size="sm">
            <ModalHeader>
              <ModalTitle>{variant} modal</ModalTitle>
              <ModalDescription>Same content, different surface.</ModalDescription>
            </ModalHeader>
            <ModalFooter>
              <ModalClose asChild><Button variant="ghost">Close</Button></ModalClose>
              <Button>Continue</Button>
            </ModalFooter>
          </StageModalContent>
        </Modal>
      ))}
    </div>
  )
}

export function AlertDialogVariantsDemo() {
  return (
    <div className={ROW}>
      {PANEL_VARIANTS.map((variant) => (
        <AlertDialog key={variant}>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="outline">{variant}</Button>
          </AlertDialogTrigger>
          <StageAlertDialogContent variant={variant} size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>{variant} alert</AlertDialogTitle>
              <AlertDialogDescription>Confirm to continue.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </StageAlertDialogContent>
        </AlertDialog>
      ))}
    </div>
  )
}

export function SheetVariantsDemo() {
  return (
    <div className={ROW}>
      {PANEL_VARIANTS.map((variant) => (
        <Sheet key={variant}>
          <SheetTrigger asChild>
            <Button size="sm" variant="outline">{variant}</Button>
          </SheetTrigger>
          <StageSheetContent variant={variant} size="sm">
            <SheetHeader>
              <SheetTitle>{variant} sheet</SheetTitle>
              <SheetDescription>Same content, different surface.</SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose asChild><Button variant="ghost">Close</Button></SheetClose>
            </SheetFooter>
          </StageSheetContent>
        </Sheet>
      ))}
    </div>
  )
}

export function PopoverVariantsDemo() {
  return (
    <div className={ROW}>
      {PANEL_VARIANTS.map((variant) => (
        <Popover key={variant}>
          <PopoverTrigger asChild>
            <Button size="sm" variant="outline">{variant}</Button>
          </PopoverTrigger>
          <StagePopoverContent variant={variant} size="sm">
            <p className="font-medium">{variant} popover</p>
            <p className="mt-1 text-[var(--color-muted)]">Quick, anchored content.</p>
          </StagePopoverContent>
        </Popover>
      ))}
    </div>
  )
}

export function HoverCardVariantsDemo() {
  return (
    <div className={ROW}>
      {PANEL_VARIANTS.map((variant) => (
        <HoverCard key={variant} openDelay={0}>
          <HoverCardTrigger asChild>
            <Button size="sm" variant="outline">{variant}</Button>
          </HoverCardTrigger>
          <StageHoverCardContent variant={variant} size="sm">
            <p className="font-medium">{variant} hover card</p>
            <p className="mt-1 text-[var(--color-muted)]">Preview on hover or focus.</p>
          </StageHoverCardContent>
        </HoverCard>
      ))}
    </div>
  )
}

export function DropdownMenuVariantsDemo() {
  return (
    <div className={ROW}>
      {PANEL_VARIANTS.map((variant) => (
        <DropdownMenu key={variant}>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">{variant}</Button>
          </DropdownMenuTrigger>
          <StageDropdownMenuContent variant={variant}>
            <DropdownMenuItem>Profile<DropdownMenuShortcut>⌘P</DropdownMenuShortcut></DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </StageDropdownMenuContent>
        </DropdownMenu>
      ))}
    </div>
  )
}

export function ContextMenuVariantsDemo() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {PANEL_VARIANTS.map((variant) => (
        <ContextMenu key={variant} variant={variant}>
          <ContextMenuTrigger className="flex h-16 items-center justify-center rounded-lg border border-dashed border-[var(--color-border)] text-xs text-[var(--color-muted)]">
            Right click ({variant})
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Copy</ContextMenuItem>
            <ContextMenuItem>Paste</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Delete</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))}
    </div>
  )
}

export function MenubarVariantsDemo() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {PANEL_VARIANTS.map((variant) => (
        <div key={variant} className="flex items-center gap-3">
          <span className="w-16 text-xs text-[var(--color-muted)]">{variant}</span>
          <Menubar variant={variant}>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>New tab</MenubarItem>
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
        </div>
      ))}
    </div>
  )
}

export function NavigationMenuVariantsDemo() {
  return (
    <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
      {PANEL_VARIANTS.map((variant) => (
        <div key={variant} className="min-h-40">
          <NavigationMenu aria-label={`${variant} navigation`} variant={variant}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>{variant}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-48 gap-1">
                    <NavigationMenuLink href="#">Analytics</NavigationMenuLink>
                    <NavigationMenuLink href="#">Automation</NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#" active>Docs</NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      ))}
    </div>
  )
}

export function CommandVariantsDemo() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {PANEL_VARIANTS.map((variant) => (
        <Command key={variant} variant={variant} size="sm">
          <CommandInput placeholder={`${variant} palette`} />
          <CommandList>
            <CommandGroup heading="Actions">
              <CommandItem>Open settings</CommandItem>
              <CommandItem>Invite teammate</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      ))}
    </div>
  )
}

export function TooltipVariantsDemo() {
  return (
    <TooltipProvider delayDuration={0}>
      <div className={ROW}>
        {PANEL_VARIANTS.map((variant) => (
          <Tooltip key={variant}>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline">{variant}</Button>
            </TooltipTrigger>
            <TooltipContent variant={variant}>{variant} tooltip</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}

export function ToasterVariantsDemo() {
  const [variant, setVariant] = React.useState<PanelDemoVariant>("glinr")
  return (
    <div className="space-y-3">
      <Toaster position="bottom-right" variant={variant} />
      <div className={ROW} role="group" aria-label="Toaster variant">
        {PANEL_VARIANTS.map((item) => (
          <Button key={item} size="sm" variant={item === variant ? "primary" : "outline"} aria-pressed={item === variant} onClick={() => setVariant(item)}>
            {item}
          </Button>
        ))}
      </div>
      <div className={ROW}>
        <Button size="sm" onClick={() => toast.success("Saved", { description: `Rendered with the ${variant} look.` })}>Success</Button>
        <Button size="sm" onClick={() => toast.error("Failed", { description: "Status bar follows the type." })}>Error</Button>
        <Button size="sm" onClick={() => toast("Heads up", { description: "Neutral toast without a bar." })}>Default</Button>
      </div>
    </div>
  )
}

export function BreadcrumbVariantsDemo() {
  return (
    <div className="grid gap-3">
      {PANEL_VARIANTS.map((variant) => (
        <div key={variant} className="flex items-center gap-3">
          <span className="w-16 text-xs text-[var(--color-muted)]">{variant}</span>
          <Breadcrumb variant={variant}>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink href="#">Docs</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      ))}
    </div>
  )
}

export function PaginationVariantsDemo() {
  return (
    <div className="grid gap-3">
      {PANEL_VARIANTS.map((variant) => (
        <div key={variant} className="flex items-center gap-3">
          <span className="w-16 shrink-0 text-xs text-[var(--color-muted)]">{variant}</span>
          <Pagination variant={variant} className="mx-0 w-auto justify-start">
            <PaginationContent>
              <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
              <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
              <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>
              <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
              <PaginationItem><PaginationNext href="#" /></PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ))}
    </div>
  )
}
