"use client"

// Showcase demos for the Navigation family (S2): composed product UI around each component.
// The code strings that users copy live in src/lib/new-components/showcase-s2-nav.tsx.

import * as React from "react"
import {
  ChartLineUp,
  Cube,
  FileText,
  GearSix,
  House,
  Lightning,
  Plugs,
  Receipt,
  ShieldCheck,
  SidebarSimple,
  Stack,
  Users,
  UsersThree
} from "@phosphor-icons/react/dist/ssr"
import {
  Avatar,
  Badge,
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Checkbox,
  Heading,
  IconFrame,
  Kbd,
  Link,
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
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
  SidebarTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
  navigationMenuTriggerStyle
} from "@glinui/ui"

/* NavigationMenu: a marketing site header with a mega menu open ---------------------------- */

const MEGA = [
  { icon: ChartLineUp, title: "Analytics", text: "Funnels, cohorts and retention in one view." },
  { icon: Lightning, title: "Automation", text: "Trigger flows from product events." },
  { icon: ShieldCheck, title: "Access control", text: "Roles, SSO and audit logs for every team." },
  { icon: Plugs, title: "Integrations", text: "Sync with the tools your team already uses." }
]

export function NavMegaHero() {
  return (
    <div className="mx-auto min-h-80 w-full max-w-3xl">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] px-4 py-2.5 [box-shadow:var(--elev-1)]">
        <div className="flex items-center gap-2 font-semibold">
          <IconFrame size="sm" tone="accent"><Cube aria-hidden="true" /></IconFrame>
          Lumen
        </div>
        <NavigationMenu aria-label="Main" defaultValue="products">
          <NavigationMenuList>
            <NavigationMenuItem value="products">
              <NavigationMenuTrigger>Products</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-full gap-1 p-1 md:w-[34rem] md:grid-cols-2">
                  {MEGA.map(({ icon: Icon, title, text }) => (
                    <NavigationMenuLink key={title} href="#" className="flex items-start gap-3">
                      <IconFrame size="sm"><Icon aria-hidden="true" /></IconFrame>
                      <span className="grid gap-0.5">
                        <span className="text-sm font-medium">{title}</span>
                        <span className="text-xs leading-5 text-[var(--color-muted)]">{text}</span>
                      </span>
                    </NavigationMenuLink>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem value="resources">
              <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-56 gap-1">
                  <NavigationMenuLink href="#">Guides</NavigationMenuLink>
                  <NavigationMenuLink href="#">Changelog</NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>Pricing</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost">Sign in</Button>
          <Button size="sm">Start free</Button>
        </div>
      </header>
    </div>
  )
}

export function NavInlineExample() {
  return (
    <div className="mx-auto min-h-56 w-full max-w-xl">
      <NavigationMenu aria-label="Docs" viewport={false} defaultValue="learn" className="max-w-none justify-start">
        <NavigationMenuList>
          <NavigationMenuItem value="learn" className="relative">
            <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-60 gap-1 p-1">
                <li><NavigationMenuLink href="#"><span className="block text-sm font-medium">Quickstart</span><span className="block text-xs text-[var(--color-muted)]">Ship a first page in 5 minutes.</span></NavigationMenuLink></li>
                <li><NavigationMenuLink href="#"><span className="block text-sm font-medium">Theming</span><span className="block text-xs text-[var(--color-muted)]">Tokens, modes and variants.</span></NavigationMenuLink></li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>Components</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>Examples</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

/* Menubar: a code editor menu bar ---------------------------------------------------------- */

function EditorWindow({ open, children }: { open: "file" | "view"; children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-80 w-full max-w-2xl overflow-hidden rounded-xl border border-[var(--line-soft)] bg-[var(--surface-1)] [box-shadow:var(--elev-1)]">
      <div className="flex items-center gap-3 border-b border-[var(--line-soft)] px-2 py-1.5">
        <span className="ps-1 text-xs font-semibold" aria-hidden="true">{`{ }`}</span>
        <Menubar defaultValue={open} className="border-0 bg-transparent p-0 [box-shadow:none]">
          {children}
        </Menubar>
      </div>
      <div className="grid gap-1 p-4 font-mono text-xs leading-6 text-[var(--color-muted)]">
        <p><span className="text-[var(--color-accent)]">export</span> function Header() {"{"}</p>
        <p className="ps-4"><span className="text-[var(--color-accent)]">return</span> {"<nav aria-label=\"Main\" />"}</p>
        <p>{"}"}</p>
      </div>
    </div>
  )
}

export function MenubarEditorHero() {
  return (
    <EditorWindow open="file">
      <MenubarMenu value="file">
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent className="w-60">
          <MenubarItem>New file <MenubarShortcut>Ctrl N</MenubarShortcut></MenubarItem>
          <MenubarItem>Open folder <MenubarShortcut>Ctrl O</MenubarShortcut></MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Open recent</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>lumen-web</MenubarItem>
              <MenubarItem>billing-service</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Save <MenubarShortcut>Ctrl S</MenubarShortcut></MenubarItem>
          <MenubarItem>Save all <MenubarShortcut>Ctrl Shift S</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Close editor <MenubarShortcut>Ctrl W</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="edit">
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent className="w-56">
          <MenubarItem>Undo <MenubarShortcut>Ctrl Z</MenubarShortcut></MenubarItem>
          <MenubarItem>Redo <MenubarShortcut>Ctrl Y</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="view">
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent className="w-56">
          <MenubarItem>Command palette <MenubarShortcut>Ctrl K</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </EditorWindow>
  )
}

export function MenubarViewExample() {
  const [minimap, setMinimap] = React.useState(true)
  const [wrap, setWrap] = React.useState(false)
  const [theme, setTheme] = React.useState("dark")
  return (
    <EditorWindow open="view">
      <MenubarMenu value="file">
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent><MenubarItem>New file</MenubarItem></MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="view">
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent className="w-60">
          <MenubarLabel>Editor</MenubarLabel>
          <MenubarCheckboxItem checked={minimap} onCheckedChange={setMinimap}>Minimap</MenubarCheckboxItem>
          <MenubarCheckboxItem checked={wrap} onCheckedChange={setWrap}>Word wrap <MenubarShortcut>Alt Z</MenubarShortcut></MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarLabel>Color theme</MenubarLabel>
          <MenubarRadioGroup value={theme} onValueChange={setTheme}>
            <MenubarRadioItem value="light">Light</MenubarRadioItem>
            <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </EditorWindow>
  )
}

/* Tabs: a project page with a real panel --------------------------------------------------- */

const ACTIVITY = [
  { who: "AK", text: "Ava Kim merged release 2.4 into main", when: "12 min ago" },
  { who: "JR", text: "Jon Reyes commented on the pricing page", when: "1 h ago" },
  { who: "SP", text: "Sara Patel invited two teammates", when: "Yesterday" }
]

export function TabsProjectHero() {
  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-5 [box-shadow:var(--elev-1)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Heading level={3} size="sm">Lumen web app</Heading>
          <Text size="sm" className="text-[var(--color-muted)]">Production, deployed 12 minutes ago</Text>
        </div>
        <Badge tone="success" dot>Live</Badge>
      </div>
      <Tabs defaultValue="activity" className="mt-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Text size="sm" className="pt-3 text-[var(--color-muted)]">48.2k visits this week, up 12% on last week.</Text>
        </TabsContent>
        <TabsContent value="activity">
          <ul className="grid gap-3 pt-3">
            {ACTIVITY.map((row) => (
              <li key={row.text} className="flex items-center gap-3">
                <Avatar size="sm" fallback={row.who} alt="" />
                <span className="grid text-sm">
                  <span>{row.text}</span>
                  <span className="text-xs text-[var(--color-muted)]">{row.when}</span>
                </span>
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="billing">
          <Text size="sm" className="pt-3 text-[var(--color-muted)]">Team plan, renews on 1 November. Next invoice: $240.00.</Text>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export function TabsUnderlineExample() {
  return (
    <div className="mx-auto w-full max-w-xl">
      <Tabs defaultValue="members">
        <TabsList variant="underline" className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="members" className="gap-1.5"><UsersThree aria-hidden="true" />Members</TabsTrigger>
          <TabsTrigger value="roles" className="gap-1.5"><ShieldCheck aria-hidden="true" />Roles</TabsTrigger>
          <TabsTrigger value="invoices" className="gap-1.5"><Receipt aria-hidden="true" />Invoices <Badge size="sm">3</Badge></TabsTrigger>
          <TabsTrigger value="locked" disabled>Audit log</TabsTrigger>
        </TabsList>
        <TabsContent value="members"><Text size="sm" className="pt-4 text-[var(--color-muted)]">12 members across 3 teams.</Text></TabsContent>
        <TabsContent value="roles"><Text size="sm" className="pt-4 text-[var(--color-muted)]">Owner, admin, editor and viewer roles.</Text></TabsContent>
        <TabsContent value="invoices"><Text size="sm" className="pt-4 text-[var(--color-muted)]">3 invoices are waiting for payment.</Text></TabsContent>
      </Tabs>
    </div>
  )
}

/* Breadcrumb: a page header with path, title and actions ----------------------------------- */

export function BreadcrumbHeaderHero() {
  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-5 [box-shadow:var(--elev-1)]">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="#"><House aria-hidden="true" className="size-4" /><span className="sr-only">Home</span></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="#">Projects</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="#">Lumen web</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Deployments</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Heading level={3} size="md">Deployments</Heading>
          <Text size="sm" className="text-[var(--color-muted)]">Every build of Lumen web, newest first.</Text>
        </div>
        <Button size="sm">New deployment</Button>
      </div>
    </div>
  )
}

export function BreadcrumbFilesExample() {
  return (
    <div className="mx-auto grid w-full max-w-xl gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="#">Documents</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem><BreadcrumbLink href="#">Contracts</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem><BreadcrumbPage><FileText aria-hidden="true" className="me-1 inline size-4" />Vendor agreement.pdf</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="#">Settings</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Billing</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

/* Pagination: under a results table -------------------------------------------------------- */

const INVOICES = [
  { id: "INV-1042", customer: "Northwind Traders", amount: "$1,280.00", status: "Paid", tone: "success" },
  { id: "INV-1041", customer: "Halcyon Labs", amount: "$640.00", status: "Pending", tone: "warning" },
  { id: "INV-1040", customer: "Brightside Co", amount: "$2,150.00", status: "Paid", tone: "success" },
  { id: "INV-1039", customer: "Orbit Studio", amount: "$320.00", status: "Overdue", tone: "danger" }
] as const

export function PaginationTableHero() {
  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-4 [box-shadow:var(--elev-1)]">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-end">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {INVOICES.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.id}</TableCell>
                <TableCell>{row.customer}</TableCell>
                <TableCell><Badge size="sm" tone={row.tone} dot>{row.status}</Badge></TableCell>
                <TableCell className="text-end tabular-nums">{row.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <Text size="sm" className="text-[var(--color-muted)]">Showing 1 to 4 of 48 invoices</Text>
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
            <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
            <PaginationItem><PaginationEllipsis /></PaginationItem>
            <PaginationItem><PaginationLink href="#">12</PaginationLink></PaginationItem>
            <PaginationItem><PaginationNext href="#" /></PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export function PaginationCompactExample() {
  return (
    <div className="mx-auto grid w-full max-w-md gap-6">
      <Pagination>
        <PaginationContent>
          <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
          <PaginationItem><PaginationLink href="#" isActive>4</PaginationLink></PaginationItem>
          <PaginationItem><PaginationNext href="#" /></PaginationItem>
        </PaginationContent>
      </Pagination>
      <Pagination>
        <PaginationContent>
          <PaginationItem><PaginationLink href="#" aria-label="Page 1">1</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink href="#" isActive aria-label="Page 2">2</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink href="#" aria-label="Page 3">3</PaginationLink></PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

/* Sidebar: a mini app shell ---------------------------------------------------------------- */

const NAV_MAIN = [
  { icon: House, label: "Overview", active: true },
  { icon: ChartLineUp, label: "Analytics" },
  { icon: Stack, label: "Projects", badge: "8" },
  { icon: Users, label: "Team" }
]
const NAV_ADMIN = [
  { icon: Receipt, label: "Billing" },
  { icon: GearSix, label: "Settings" }
]

export function SidebarShellHero() {
  return (
    <SidebarProvider storageKey={null} className="mx-auto h-96 min-h-0 w-full max-w-3xl overflow-hidden rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] [box-shadow:var(--elev-1)]">
      <Sidebar collapsible="icon" label="App" containerClassName="static h-full">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" tooltip="Lumen">
                <IconFrame size="sm" tone="accent"><Cube aria-hidden="true" /></IconFrame>
                <span className="grid text-start leading-tight"><span className="text-sm font-semibold">Lumen</span><span className="text-xs text-[var(--color-muted)]">Team plan</span></span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_MAIN.map(({ icon: Icon, label, active, badge }) => (
                  <SidebarMenuItem key={label}>
                    <SidebarMenuButton isActive={active} tooltip={label}><Icon aria-hidden="true" /><span>{label}</span></SidebarMenuButton>
                    {badge ? <SidebarMenuBadge>{badge}</SidebarMenuBadge> : null}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup collapsible>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_ADMIN.map(({ icon: Icon, label }) => (
                  <SidebarMenuItem key={label}>
                    <SidebarMenuButton tooltip={label}><Icon aria-hidden="true" /><span>{label}</span></SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" tooltip="Ava Kim">
                <Avatar size="sm" fallback="AK" alt="" />
                <span className="grid text-start leading-tight"><span className="text-sm font-medium">Ava Kim</span><span className="text-xs text-[var(--color-muted)]">ava@lumen.test</span></span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="min-w-0 flex-1 p-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger aria-label="Toggle sidebar"><SidebarSimple aria-hidden="true" /></SidebarTrigger>
          <Heading level={3} size="sm">Overview</Heading>
          <Kbd className="ms-auto">Ctrl B</Kbd>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[{ k: "Visits", v: "48.2k" }, { k: "Conversion", v: "3.9%" }].map((m) => (
            <div key={m.k} className="rounded-xl border border-[var(--line-soft)] p-3">
              <Text size="sm" className="text-[var(--color-muted)]">{m.k}</Text>
              <p className="text-2xl font-semibold tabular-nums">{m.v}</p>
            </div>
          ))}
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm"><Checkbox defaultChecked /> Show weekly digest</label>
      </SidebarInset>
    </SidebarProvider>
  )
}

/* Link: changelog entry with inline, arrow and footer links -------------------------------- */

export function LinkChangelogHero() {
  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-5 [box-shadow:var(--elev-1)]">
      <div className="flex items-center gap-2">
        <Badge tone="accent" size="sm">v2.4</Badge>
        <Text size="sm" className="text-[var(--color-muted)]">Released 3 October</Text>
      </div>
      <Heading level={3} size="md" className="mt-3">Faster dashboards</Heading>
      <Text className="mt-2 text-[var(--color-muted)]">
        Charts now render from cached queries, so the overview loads in under a second. Read the{" "}
        <Link href="#">migration notes</Link> before upgrading, or check the <Link href="#" underline={false}>full changelog</Link>.
      </Text>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Link href="#" variant="arrow">Read the release post</Link>
        <Link href="#" variant="ghost">Download notes</Link>
      </div>
      <nav aria-label="Footer" className="mt-5 flex flex-wrap gap-x-4 gap-y-1 border-t border-[var(--line-soft)] pt-3 text-sm">
        <Link href="#" variant="ghost" size="sm">Status</Link>
        <Link href="#" variant="ghost" size="sm">Privacy</Link>
        <Link href="#" variant="ghost" size="sm">Terms</Link>
      </nav>
    </div>
  )
}

export function LinkStatesExample() {
  return (
    <div className="mx-auto grid w-full max-w-md gap-3">
      <Link href="#">Default underlined link</Link>
      <Link href="#" underline={false}>Link without underline</Link>
      <Link href="#" variant="arrow">Arrow link</Link>
      <Link href="#" variant="outline">Outline link</Link>
      <Link href="#" size="lg">Large link</Link>
    </div>
  )
}
