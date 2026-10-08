"use client"

// Showcase demos for the Overlays and menus family (S2). Dialogs, sheets and popovers portal into the preview
// stage through the Stage* wrappers; the copyable code (src/lib/new-components/showcase-s2-code.generated.ts)
// is generated from these functions with the wrappers swapped for the plain components.

import * as React from "react"
import {
  Bell,
  BookmarkSimple,
  Copy,
  CreditCard,
  Cube,
  DownloadSimple,
  FileText,
  FolderSimple,
  Funnel,
  GearSix,
  Globe,
  House,
  Image,
  Lifebuoy,
  Link as LinkIcon,
  List,
  MagnifyingGlass,
  PencilSimple,
  Plus,
  SignOut,
  TextB,
  TextItalic,
  TextUnderline,
  Trash,
  UserPlus,
  Users
} from "@phosphor-icons/react/dist/ssr"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Avatar,
  Badge,
  Button,
  Checkbox,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Heading,
  HoverCard,
  HoverCardTrigger,
  IconFrame,
  Input,
  Kbd,
  Label,
  Modal,
  ModalClose,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
  Popover,
  PopoverTrigger,
  Sheet,
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Switch,
  Text,
  Tooltip,
  TooltipProvider,
  TooltipTrigger
} from "@glinui/ui"

import {
  StageAlertDialogContent,
  StageDropdownMenuContent,
  StageHoverCardContent,
  StageModalContent,
  StagePopoverContent,
  StageSheetContent,
  StageTooltipContent
} from "@/components/docs/overlay-demos"

const CARD = "mx-auto w-full rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-5 [box-shadow:var(--elev-1)]"

/* Modal: invite teammates --------------------------------------------------------------- */

const MEMBERS = [
  { name: "Ava Kim", mail: "ava@lumen.test", role: "Owner", initials: "AK" },
  { name: "Jon Reyes", mail: "jon@lumen.test", role: "Admin", initials: "JR" },
  { name: "Sara Patel", mail: "sara@lumen.test", role: "Editor", initials: "SP" }
]

export function ModalInviteHero() {
  const [emails, setEmails] = React.useState<string[]>(["mia@lumen.test"])
  const [draft, setDraft] = React.useState("")
  const add = () => {
    const value = draft.trim()
    if (value && !emails.includes(value)) setEmails([...emails, value])
    setDraft("")
  }
  return (
    <div className={`${CARD} max-w-lg`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <Heading level={3} size="sm">Members</Heading>
          <Text size="sm" className="text-[var(--color-muted)]">3 of 10 seats used</Text>
        </div>
        <Modal>
          <ModalTrigger asChild><Button size="sm"><UserPlus aria-hidden="true" />Invite teammates</Button></ModalTrigger>
          <StageModalContent>
            <ModalHeader>
              <ModalTitle>Invite teammates</ModalTitle>
              <ModalDescription>They get an email with a link to join Lumen.</ModalDescription>
            </ModalHeader>
            <form
              className="grid gap-3"
              onSubmit={(event) => {
                event.preventDefault()
                add()
              }}
            >
              <Label htmlFor="invite-email">Email address</Label>
              <div className="flex gap-2">
                <Input id="invite-email" type="email" placeholder="name@company.com" value={draft} onChange={(event) => setDraft(event.target.value)} />
                <Button type="submit" variant="outline">Add</Button>
              </div>
            </form>
            <ul className="grid gap-2" aria-label="People to invite">
              {emails.map((email) => (
                <li key={email} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2"><Avatar size="xs" fallback={email.slice(0, 2).toUpperCase()} alt="" />{email}</span>
                  <Badge size="sm">Editor</Badge>
                </li>
              ))}
            </ul>
            <ModalFooter>
              <ModalClose asChild><Button variant="ghost">Cancel</Button></ModalClose>
              <ModalClose asChild><Button disabled={emails.length === 0}>{`Send ${emails.length} invite${emails.length === 1 ? "" : "s"}`}</Button></ModalClose>
            </ModalFooter>
          </StageModalContent>
        </Modal>
      </div>
      <ul className="mt-4 grid divide-y divide-[var(--line-soft)]">
        {MEMBERS.map((member) => (
          <li key={member.mail} className="flex items-center gap-3 py-2.5">
            <Avatar size="sm" fallback={member.initials} alt="" />
            <span className="grid min-w-0 flex-1 text-sm">
              <span className="font-medium">{member.name}</span>
              <span className="truncate text-xs text-[var(--color-muted)]">{member.mail}</span>
            </span>
            <Badge size="sm">{member.role}</Badge>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ModalSizesExample() {
  return (
    <div className="mx-auto flex flex-wrap items-center justify-center gap-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Modal key={size}>
          <ModalTrigger asChild><Button variant="outline" size="sm">{`Size ${size}`}</Button></ModalTrigger>
          <StageModalContent size={size}>
            <ModalHeader>
              <ModalTitle>Rename workspace</ModalTitle>
              <ModalDescription>Pick a name your team will recognise.</ModalDescription>
            </ModalHeader>
            <Input aria-label="Workspace name" defaultValue="Lumen" />
            <ModalFooter>
              <ModalClose asChild><Button variant="ghost">Cancel</Button></ModalClose>
              <ModalClose asChild><Button>Save name</Button></ModalClose>
            </ModalFooter>
          </StageModalContent>
        </Modal>
      ))}
    </div>
  )
}

/* AlertDialog: delete a project --------------------------------------------------------- */

export function AlertDeleteHero() {
  const [confirm, setConfirm] = React.useState("")
  return (
    <div className={`${CARD} max-w-lg`}>
      <div className="flex items-start gap-3">
        <IconFrame tone="danger"><Trash aria-hidden="true" /></IconFrame>
        <div className="grid flex-1 gap-1">
          <Heading level={3} size="sm">Delete this project</Heading>
          <Text size="sm" className="text-[var(--color-muted)]">Removes lumen-web, its deployments and all stored analytics.</Text>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <AlertDialog onOpenChange={() => setConfirm("")}>
          <AlertDialogTrigger asChild><Button variant="outline" tone="danger">Delete project</Button></AlertDialogTrigger>
          <StageAlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete lumen-web?</AlertDialogTitle>
              <AlertDialogDescription>This cannot be undone. Deleting the project will:</AlertDialogDescription>
            </AlertDialogHeader>
            <ul className="list-disc space-y-1 ps-5 text-sm text-[var(--color-muted)]">
              <li>Remove 142 deployments and their logs</li>
              <li>Disconnect 3 custom domains</li>
              <li>Cancel the 2 scheduled jobs</li>
            </ul>
            <div className="grid gap-2">
              <Label htmlFor="confirm-name">Type lumen-web to confirm</Label>
              <Input id="confirm-name" value={confirm} onChange={(event) => setConfirm(event.target.value)} autoComplete="off" />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep project</AlertDialogCancel>
              <AlertDialogAction variant="destructive" disabled={confirm !== "lumen-web"}>Delete project</AlertDialogAction>
            </AlertDialogFooter>
          </StageAlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

export function AlertDiscardExample() {
  return (
    <div className={`${CARD} max-w-md`}>
      <Label htmlFor="draft-title">Post title</Label>
      <Input id="draft-title" className="mt-2" defaultValue="Launch notes for v2.4" />
      <div className="mt-4 flex justify-end gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild><Button variant="ghost">Discard draft</Button></AlertDialogTrigger>
          <StageAlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Discard this draft?</AlertDialogTitle>
              <AlertDialogDescription>Your unsaved edits will be lost.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep editing</AlertDialogCancel>
              <AlertDialogAction>Discard</AlertDialogAction>
            </AlertDialogFooter>
          </StageAlertDialogContent>
        </AlertDialog>
        <Button>Publish</Button>
      </div>
    </div>
  )
}

/* Sheet: filters panel and mobile nav ---------------------------------------------------- */

const LISTINGS = [
  { name: "Harbor loft", meta: "2 bed, 1 bath", price: "$2,400" },
  { name: "Maple row house", meta: "3 bed, 2 bath", price: "$3,150" },
  { name: "Station studio", meta: "Studio, 1 bath", price: "$1,350" }
]

export function SheetFiltersHero() {
  return (
    <div className={`${CARD} max-w-lg`}>
      <div className="flex items-center justify-between gap-3">
        <Heading level={3} size="sm">Rentals near you</Heading>
        <Sheet>
          <SheetTrigger asChild><Button size="sm" variant="outline"><Funnel aria-hidden="true" />Filters<Badge size="sm" className="ms-1">2</Badge></Button></SheetTrigger>
          <StageSheetContent side="right">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Narrow 128 listings by what matters.</SheetDescription>
            </SheetHeader>
            <fieldset className="grid gap-3 py-4">
              <legend className="mb-1 text-sm font-medium">Bedrooms</legend>
              {["Studio", "1 bedroom", "2 bedrooms", "3 or more"].map((label, index) => (
                <label key={label} className="flex items-center gap-2 text-sm"><Checkbox defaultChecked={index === 2} />{label}</label>
              ))}
            </fieldset>
            <div className="flex items-center justify-between gap-3 border-t border-[var(--line-soft)] py-3 text-sm">
              <Label htmlFor="pets">Pets allowed</Label>
              <Switch id="pets" defaultChecked />
            </div>
            <SheetFooter>
              <SheetClose asChild><Button variant="ghost">Reset</Button></SheetClose>
              <SheetClose asChild><Button>Show 41 results</Button></SheetClose>
            </SheetFooter>
          </StageSheetContent>
        </Sheet>
      </div>
      <ul className="mt-4 grid divide-y divide-[var(--line-soft)]">
        {LISTINGS.map((item) => (
          <li key={item.name} className="flex items-center justify-between gap-3 py-3 text-sm">
            <span className="grid"><span className="font-medium">{item.name}</span><span className="text-xs text-[var(--color-muted)]">{item.meta}</span></span>
            <span className="tabular-nums">{item.price}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SheetMobileNavExample() {
  const links = [
    { icon: House, label: "Home" },
    { icon: FolderSimple, label: "Projects" },
    { icon: Users, label: "Team" },
    { icon: GearSix, label: "Settings" }
  ]
  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] [box-shadow:var(--elev-1)]">
      <div className="flex items-center gap-2 border-b border-[var(--line-soft)] px-3 py-2">
        <Sheet>
          <SheetTrigger asChild><Button size="icon" variant="ghost" aria-label="Open menu"><List aria-hidden="true" /></Button></SheetTrigger>
          <StageSheetContent side="left">
            <SheetHeader>
              <SheetTitle>Lumen</SheetTitle>
              <SheetDescription>Jump to a section.</SheetDescription>
            </SheetHeader>
            <nav aria-label="Mobile" className="grid gap-1 py-4">
              {links.map(({ icon: Icon, label }) => (
                <a key={label} href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-[color-mix(in_oklab,var(--color-foreground)_8%,transparent)]"><Icon aria-hidden="true" className="size-4" />{label}</a>
              ))}
            </nav>
          </StageSheetContent>
        </Sheet>
        <span className="text-sm font-semibold">Lumen</span>
      </div>
      <div className="p-4"><Text size="sm" className="text-[var(--color-muted)]">Tap the menu to slide the navigation in from the left.</Text></div>
    </div>
  )
}

/* Popover: share a link ------------------------------------------------------------------ */

export function PopoverShareHero() {
  return (
    <div className="mx-auto flex min-h-72 w-full max-w-md flex-col items-end">
      <div className={`${CARD} flex items-center justify-between gap-3`}>
        <span className="flex items-center gap-2 text-sm font-medium"><FileText aria-hidden="true" className="size-4" />Q4 roadmap</span>
        <Popover defaultOpen>
          <PopoverTrigger asChild><Button size="sm"><LinkIcon aria-hidden="true" />Share</Button></PopoverTrigger>
          <StagePopoverContent align="end" className="w-80" onOpenAutoFocus={(event) => event.preventDefault()}>
            <div className="grid gap-3">
              <div>
                <p className="text-sm font-medium">Share this document</p>
                <p className="text-xs text-[var(--color-muted)]">Anyone with the link can view.</p>
              </div>
              <div className="flex gap-2">
                <Input aria-label="Share link" readOnly value="lumen.test/d/q4-roadmap" />
                <Button size="icon" variant="outline" aria-label="Copy link"><Copy aria-hidden="true" /></Button>
              </div>
              <div className="flex items-center justify-between text-sm">
                <Label htmlFor="allow-comments">Allow comments</Label>
                <Switch id="allow-comments" defaultChecked />
              </div>
            </div>
          </StagePopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export function PopoverNotificationsExample() {
  const items = [
    { title: "Deploy finished", when: "2 min ago" },
    { title: "Sara commented on Pricing", when: "1 h ago" },
    { title: "Invoice INV-1042 paid", when: "Yesterday" }
  ]
  return (
    <div className="mx-auto flex w-full max-w-xs justify-center">
      <Popover>
        <PopoverTrigger asChild><Button variant="outline" size="icon" aria-label="Notifications, 3 new"><Bell aria-hidden="true" /></Button></PopoverTrigger>
        <StagePopoverContent className="w-72">
          <p className="text-sm font-medium">Notifications</p>
          <ul className="mt-2 grid divide-y divide-[var(--line-soft)]">
            {items.map((item) => (
              <li key={item.title} className="py-2 text-sm"><p>{item.title}</p><p className="text-xs text-[var(--color-muted)]">{item.when}</p></li>
            ))}
          </ul>
        </StagePopoverContent>
      </Popover>
    </div>
  )
}

/* HoverCard: user profile ---------------------------------------------------------------- */

export function HoverCardProfileHero() {
  return (
    <div className={`${CARD} max-w-md`}>
      <p className="text-sm leading-6">
        Release notes drafted by{" "}
        <HoverCard defaultOpen openDelay={100}>
          <HoverCardTrigger asChild>
            <a href="#" className="font-medium text-[var(--color-accent)] underline decoration-dotted underline-offset-4">@avakim</a>
          </HoverCardTrigger>
          <StageHoverCardContent className="w-80">
            <div className="flex gap-3">
              <Avatar size="lg" fallback="AK" alt="Ava Kim" />
              <div className="grid gap-1">
                <p className="text-sm font-semibold">Ava Kim</p>
                <p className="text-xs text-[var(--color-muted)]">@avakim</p>
                <p className="text-sm">Design engineer on the platform team. Writes about tokens and motion.</p>
                <div className="mt-1 flex items-center gap-3 text-xs text-[var(--color-muted)]">
                  <span><strong className="text-[var(--color-foreground)]">128</strong> posts</span>
                  <span><strong className="text-[var(--color-foreground)]">2.4k</strong> followers</span>
                </div>
              </div>
            </div>
          </StageHoverCardContent>
        </HoverCard>
        {" "}and reviewed by the docs team. Hover the handle to see who wrote it.
      </p>
    </div>
  )
}

export function HoverCardLinkExample() {
  return (
    <div className="mx-auto w-full max-w-md text-sm leading-6">
      See the{" "}
      <HoverCard openDelay={100} closeDelay={80}>
        <HoverCardTrigger asChild><a href="#" className="font-medium underline decoration-dotted underline-offset-4">pricing page</a></HoverCardTrigger>
        <StageHoverCardContent className="w-72" size="sm">
          <p className="text-sm font-medium">Pricing</p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">Free for individuals. Team plans start at $20 per seat each month.</p>
        </StageHoverCardContent>
      </HoverCard>{" "}
      for plan details.
    </div>
  )
}

/* Tooltip: a formatting toolbar ----------------------------------------------------------- */

export function TooltipToolbarHero() {
  const tools = [
    { icon: TextB, label: "Bold", keys: "Ctrl B" },
    { icon: TextItalic, label: "Italic", keys: "Ctrl I" },
    { icon: TextUnderline, label: "Underline", keys: "Ctrl U" },
    { icon: LinkIcon, label: "Insert link", keys: "Ctrl K" },
    { icon: Image, label: "Insert image", keys: "Ctrl Shift I" }
  ]
  return (
    <TooltipProvider delayDuration={200}>
      <div className={`${CARD} max-w-md pt-14`}>
        <div role="toolbar" aria-label="Text formatting" className="flex flex-wrap items-center gap-1 rounded-xl border border-[var(--line-soft)] p-1">
          {tools.map(({ icon: Icon, label, keys }, index) => (
            <Tooltip key={label} defaultOpen={index === 1}>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" aria-label={label}><Icon aria-hidden="true" /></Button>
              </TooltipTrigger>
              <StageTooltipContent side="top">{label} <Kbd size="sm">{keys}</Kbd></StageTooltipContent>
            </Tooltip>
          ))}
        </div>
        <p className="mt-4 text-sm text-[var(--color-muted)]">Hover or focus a button to see its name and shortcut.</p>
      </div>
    </TooltipProvider>
  )
}

export function TooltipSidesExample() {
  return (
    <TooltipProvider delayDuration={100}>
      <div className="mx-auto flex flex-wrap items-center justify-center gap-3 py-8">
        {(["top", "right", "bottom", "left"] as const).map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger asChild><Button variant="outline" size="sm">{side}</Button></TooltipTrigger>
            <StageTooltipContent side={side}>{`Opens on the ${side}`}</StageTooltipContent>
          </Tooltip>
        ))}
        <Tooltip>
          <TooltipTrigger asChild><Button size="sm" disabled aria-label="Export, unavailable"><DownloadSimple aria-hidden="true" />Export</Button></TooltipTrigger>
          <StageTooltipContent>Export is unavailable on the free plan</StageTooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

/* DropdownMenu: account menu ------------------------------------------------------------- */

export function DropdownAccountHero() {
  return (
    <div className="mx-auto min-h-96 w-full max-w-lg">
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] px-4 py-2.5 [box-shadow:var(--elev-1)]">
        <span className="flex items-center gap-2 text-sm font-semibold"><Cube aria-hidden="true" className="size-4" />Lumen</span>
        <DropdownMenu defaultOpen modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-auto gap-2 px-2 py-1" aria-label="Account menu">
              <Avatar size="sm" fallback="AK" alt="" status="online" />
              <span className="hidden text-sm font-medium sm:inline">Ava Kim</span>
            </Button>
          </DropdownMenuTrigger>
          <StageDropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="flex items-center justify-between gap-2">
              <span className="grid"><span className="text-sm font-medium">Ava Kim</span><span className="text-xs font-normal text-[var(--color-muted)]">ava@lumen.test</span></span>
              <Badge size="sm" tone="accent">Pro</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
              <DropdownMenuItem><PencilSimple aria-hidden="true" className="size-4" />Profile<DropdownMenuShortcut>Ctrl P</DropdownMenuShortcut></DropdownMenuItem>
              <DropdownMenuItem><CreditCard aria-hidden="true" className="size-4" />Billing<DropdownMenuShortcut>Ctrl B</DropdownMenuShortcut></DropdownMenuItem>
              <DropdownMenuItem><GearSix aria-hidden="true" className="size-4" />Settings<DropdownMenuShortcut>Ctrl ,</DropdownMenuShortcut></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem><Lifebuoy aria-hidden="true" className="size-4" />Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[var(--tone-danger-text)]"><SignOut aria-hidden="true" className="size-4" />Sign out<DropdownMenuShortcut>Shift Q</DropdownMenuShortcut></DropdownMenuItem>
          </StageDropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export function DropdownRowActionsExample() {
  return (
    <div className={`${CARD} max-w-md`}>
      <div className="flex items-center gap-3">
        <IconFrame size="sm"><FileText aria-hidden="true" /></IconFrame>
        <span className="grid min-w-0 flex-1 text-sm"><span className="font-medium">Vendor agreement.pdf</span><span className="text-xs text-[var(--color-muted)]">2.4 MB, edited yesterday</span></span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button size="icon" variant="ghost" aria-label="File actions">...</Button></DropdownMenuTrigger>
          <StageDropdownMenuContent align="end">
            <DropdownMenuItem><DownloadSimple aria-hidden="true" className="size-4" />Download</DropdownMenuItem>
            <DropdownMenuItem><Copy aria-hidden="true" className="size-4" />Duplicate</DropdownMenuItem>
            <DropdownMenuItem><BookmarkSimple aria-hidden="true" className="size-4" />Add to favorites</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[var(--tone-danger-text)]"><Trash aria-hidden="true" className="size-4" />Delete</DropdownMenuItem>
          </StageDropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

/* ContextMenu: file explorer ------------------------------------------------------------- */

const FILES = [
  { name: "brand-guidelines.pdf", size: "4.2 MB", icon: FileText },
  { name: "hero-banner.png", size: "1.1 MB", icon: Image },
  { name: "Roadmap", size: "12 items", icon: FolderSimple }
]

export function ContextFilesHero() {
  return (
    <div className="mx-auto w-full max-w-md">
      <ContextMenu>
        <ContextMenuTrigger className="block rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--surface-1)] p-4 [box-shadow:var(--elev-1)]">
          <div className="flex items-center justify-between gap-3 pb-3">
            <Heading level={3} size="sm">Design assets</Heading>
            <Badge size="sm">Right click anywhere</Badge>
          </div>
          <ul className="grid divide-y divide-[var(--line-soft)]">
            {FILES.map(({ name, size, icon: Icon }) => (
              <li key={name} className="flex items-center gap-3 py-2.5 text-sm">
                <Icon aria-hidden="true" className="size-5 text-[var(--color-muted)]" />
                <span className="flex-1">{name}</span>
                <span className="text-xs text-[var(--color-muted)]">{size}</span>
              </li>
            ))}
          </ul>
          <p className="pt-3 text-xs text-[var(--color-muted)]">On touch screens, press and hold. On a keyboard, use Shift F10.</p>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-60">
          <ContextMenuLabel>brand-guidelines.pdf</ContextMenuLabel>
          <ContextMenuItem>Open <ContextMenuShortcut>Enter</ContextMenuShortcut></ContextMenuItem>
          <ContextMenuItem>Rename <ContextMenuShortcut>F2</ContextMenuShortcut></ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Move to</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>Roadmap</ContextMenuItem>
              <ContextMenuItem>Archive</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem checked>Pin to top</ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuItem className="text-[var(--tone-danger-text)]">Delete <ContextMenuShortcut>Del</ContextMenuShortcut></ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}

export function ContextCanvasExample() {
  return (
    <div className="mx-auto w-full max-w-md">
      <ContextMenu>
        <ContextMenuTrigger className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--surface-1)] text-sm text-[var(--color-muted)]">
          Right click the canvas
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuItem><Plus aria-hidden="true" className="size-4" />New frame <ContextMenuShortcut>F</ContextMenuShortcut></ContextMenuItem>
          <ContextMenuItem><Globe aria-hidden="true" className="size-4" />Paste here <ContextMenuShortcut>Ctrl V</ContextMenuShortcut></ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem checked>Show grid</ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem>Snap to objects</ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}

/* Command: palette ----------------------------------------------------------------------- */

export function CommandPaletteHero() {
  return (
    <div className="mx-auto w-full max-w-lg">
      <Command className="rounded-2xl border border-[var(--line-soft)] [box-shadow:var(--elev-2)]">
        <CommandInput placeholder="Search pages, people and commands" />
        <CommandList className="max-h-72">
          <CommandEmpty>No results for that search.</CommandEmpty>
          <CommandGroup heading="Recent">
            <CommandItem><FileText aria-hidden="true" className="size-4" />Q4 roadmap</CommandItem>
            <CommandItem><FolderSimple aria-hidden="true" className="size-4" />Brand assets</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Suggestions">
            <CommandItem><Plus aria-hidden="true" className="size-4" />New document<CommandShortcut>Ctrl N</CommandShortcut></CommandItem>
            <CommandItem><UserPlus aria-hidden="true" className="size-4" />Invite teammate<CommandShortcut>Ctrl I</CommandShortcut></CommandItem>
            <CommandItem><MagnifyingGlass aria-hidden="true" className="size-4" />Search workspace<CommandShortcut>Ctrl F</CommandShortcut></CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem><GearSix aria-hidden="true" className="size-4" />Preferences<CommandShortcut>Ctrl ,</CommandShortcut></CommandItem>
            <CommandItem><CreditCard aria-hidden="true" className="size-4" />Billing</CommandItem>
          </CommandGroup>
        </CommandList>
        <div className="flex items-center justify-between gap-3 border-t border-[var(--line-soft)] px-3 py-2 text-xs text-[var(--color-muted)]">
          <span className="flex items-center gap-1"><Kbd size="sm">Up</Kbd><Kbd size="sm">Down</Kbd> to move</span>
          <span className="flex items-center gap-1"><Kbd size="sm">Enter</Kbd> to open</span>
        </div>
      </Command>
    </div>
  )
}

export function CommandUsersExample() {
  const people = [
    { name: "Ava Kim", role: "Owner", initials: "AK" },
    { name: "Jon Reyes", role: "Admin", initials: "JR" },
    { name: "Sara Patel", role: "Editor", initials: "SP" },
    { name: "Mia Chen", role: "Viewer", initials: "MC" }
  ]
  return (
    <div className="mx-auto w-full max-w-sm">
      <Command className="rounded-2xl border border-[var(--line-soft)]">
        <CommandInput placeholder="Assign to..." defaultValue="a" />
        <CommandList>
          <CommandEmpty>Nobody matches that name.</CommandEmpty>
          <CommandGroup heading="People">
            {people.map((person) => (
              <CommandItem key={person.name} value={person.name}>
                <Avatar size="xs" fallback={person.initials} alt="" />
                {person.name}
                <CommandShortcut>{person.role}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}
