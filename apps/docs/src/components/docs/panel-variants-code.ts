/* Code strings for the Variants examples. Short loops: the pattern is the same for every look. */

const LOOP = `const variants = ["glinr", "plain", "solid", "soft", "outline", "ghost", "gradient", "glass"] as const`

export const modalVariantsCode = `import { Button, Modal, ModalClose, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle, ModalTrigger } from "@glinui/ui"

${LOOP}

export function Demo() {
  return (
    <div className="flex flex-wrap gap-2">
      {variants.map((variant) => (
        <Modal key={variant}>
          <ModalTrigger asChild><Button size="sm" variant="outline">{variant}</Button></ModalTrigger>
          <ModalContent variant={variant} size="sm">
            <ModalHeader>
              <ModalTitle>{variant} modal</ModalTitle>
              <ModalDescription>Same content, different surface.</ModalDescription>
            </ModalHeader>
            <ModalFooter>
              <ModalClose asChild><Button variant="ghost">Close</Button></ModalClose>
              <Button>Continue</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ))}
    </div>
  )
}`

export const alertDialogVariantsCode = `import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, Button } from "@glinui/ui"

${LOOP}

export function Demo() {
  return (
    <div className="flex flex-wrap gap-2">
      {variants.map((variant) => (
        <AlertDialog key={variant}>
          <AlertDialogTrigger asChild><Button size="sm" variant="outline">{variant}</Button></AlertDialogTrigger>
          <AlertDialogContent variant={variant} size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>{variant} alert</AlertDialogTitle>
              <AlertDialogDescription>Confirm to continue.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ))}
    </div>
  )
}`

export const sheetVariantsCode = `import { Button, Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@glinui/ui"

${LOOP}

export function Demo() {
  return (
    <div className="flex flex-wrap gap-2">
      {variants.map((variant) => (
        <Sheet key={variant}>
          <SheetTrigger asChild><Button size="sm" variant="outline">{variant}</Button></SheetTrigger>
          <SheetContent variant={variant} size="sm">
            <SheetHeader>
              <SheetTitle>{variant} sheet</SheetTitle>
              <SheetDescription>Same content, different surface.</SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose asChild><Button variant="ghost">Close</Button></SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  )
}`

export const popoverVariantsCode = `import { Button, Popover, PopoverContent, PopoverTrigger } from "@glinui/ui"

${LOOP}

export function Demo() {
  return (
    <div className="flex flex-wrap gap-2">
      {variants.map((variant) => (
        <Popover key={variant}>
          <PopoverTrigger asChild><Button size="sm" variant="outline">{variant}</Button></PopoverTrigger>
          <PopoverContent variant={variant} size="sm">
            <p className="font-medium">{variant} popover</p>
            <p className="mt-1 text-[var(--color-muted)]">Quick, anchored content.</p>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  )
}`

export const hoverCardVariantsCode = `import { Button, HoverCard, HoverCardContent, HoverCardTrigger } from "@glinui/ui"

${LOOP}

export function Demo() {
  return (
    <div className="flex flex-wrap gap-2">
      {variants.map((variant) => (
        <HoverCard key={variant} openDelay={0}>
          <HoverCardTrigger asChild><Button size="sm" variant="outline">{variant}</Button></HoverCardTrigger>
          <HoverCardContent variant={variant} size="sm">
            <p className="font-medium">{variant} hover card</p>
            <p className="mt-1 text-[var(--color-muted)]">Preview on hover or focus.</p>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  )
}`

export const dropdownMenuVariantsCode = `import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@glinui/ui"

${LOOP}

export function Demo() {
  return (
    <div className="flex flex-wrap gap-2">
      {variants.map((variant) => (
        <DropdownMenu key={variant}>
          <DropdownMenuTrigger asChild><Button size="sm" variant="outline">{variant}</Button></DropdownMenuTrigger>
          <DropdownMenuContent variant={variant}>
            <DropdownMenuItem>Profile<DropdownMenuShortcut>⌘P</DropdownMenuShortcut></DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </div>
  )
}`

export const contextMenuVariantsCode = `import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@glinui/ui"

${LOOP}

export function Demo() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {variants.map((variant) => (
        <ContextMenu key={variant} variant={variant}>
          <ContextMenuTrigger className="flex h-16 items-center justify-center rounded-lg border border-dashed text-xs">
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
}`

export const menubarVariantsCode = `import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "@glinui/ui"

${LOOP}

export function Demo() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {variants.map((variant) => (
        <Menubar key={variant} variant={variant}>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New tab</MenubarItem>
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
      ))}
    </div>
  )
}`

export const navigationMenuVariantsCode = `import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@glinui/ui"

${LOOP}

export function Demo() {
  return (
    <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
      {variants.map((variant) => (
        <div key={variant} className="min-h-40">
          <NavigationMenu aria-label={\`\${variant} navigation\`} variant={variant}>
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
}`

export const commandVariantsCode = `import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@glinui/ui"

${LOOP}

export function Demo() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {variants.map((variant) => (
        <Command key={variant} variant={variant} size="sm">
          <CommandInput placeholder={\`\${variant} palette\`} />
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
}`

export const tooltipVariantsCode = `import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@glinui/ui"

${LOOP}

export function Demo() {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <Tooltip key={variant}>
            <TooltipTrigger asChild><Button size="sm" variant="outline">{variant}</Button></TooltipTrigger>
            <TooltipContent variant={variant}>{variant} tooltip</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}`

export const toasterVariantsCode = `import { Button, Toaster, toast } from "@glinui/ui"

// The Toaster owns the look of every toast it renders.
export function Demo() {
  return (
    <>
      <Toaster position="bottom-right" variant="plain" />
      <Button onClick={() => toast.success("Saved", { description: "Rendered with the plain look." })}>
        Show toast
      </Button>
    </>
  )
}`

export const breadcrumbVariantsCode = `import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@glinui/ui"

${LOOP}

export function Demo() {
  return (
    <div className="grid gap-3">
      {variants.map((variant) => (
        <Breadcrumb key={variant} variant={variant}>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="#">Docs</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      ))}
    </div>
  )
}`

export const paginationVariantsCode = `import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@glinui/ui"

${LOOP}

export function Demo() {
  return (
    <div className="grid gap-3">
      {variants.map((variant) => (
        <Pagination key={variant} variant={variant}>
          <PaginationContent>
            <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
            <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
            <PaginationItem><PaginationNext href="#" /></PaginationItem>
          </PaginationContent>
        </Pagination>
      ))}
    </div>
  )
}`
