"use client"

// Showcase demos for the data display family: badge, chip, avatar, table, data-table, tree, counter, kbd, item.
// Each `// @demo` block is extracted verbatim into the code string shown on the docs page
// (see scripts/gen-s3-code.mjs), so keep blocks free of docs-only helpers.

import { useState } from "react"
import {
  ArrowsDownUp,
  Bell,
  CaretDown,
  CaretLeft,
  CaretRight,
  Check,
  DotsThree,
  Download,
  Envelope,
  FileCss,
  FileTsx,
  Gear,
  GitBranch,
  Lock,
  MagnifyingGlass,
  Moon,
  PencilSimple,
  ShieldCheck,
  Trash,
  UserCircle,
  Warning
} from "@phosphor-icons/react/dist/ssr"
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Chip,
  Counter,
  DataTable,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  IconFrame,
  Input,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  Kbd,
  Separator,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tree
} from "@glinui/ui"

// @demo
export function BadgeToolbarDemo() {
  const [status, setStatus] = useState("All")
  const filters = ["All", "Open", "In review", "Merged"]
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <div role="group" aria-label="Filter pull requests" className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <Button
            key={filter}
            size="sm"
            variant={status === filter ? "solid" : "outline"}
            aria-pressed={status === filter}
            onClick={() => setStatus(filter)}
          >
            {filter}
          </Button>
        ))}
      </div>
      <ItemGroup>
        <Item size="sm">
          <ItemMedia variant="icon"><GitBranch aria-hidden /></ItemMedia>
          <ItemContent>
            <ItemTitle>Add CSV export to reports</ItemTitle>
            <ItemDescription>#482 opened by Priya Nair</ItemDescription>
          </ItemContent>
          <ItemActions><Badge tone="success" variant="soft" dot>Open</Badge></ItemActions>
        </Item>
        <Item size="sm">
          <ItemMedia variant="icon"><GitBranch aria-hidden /></ItemMedia>
          <ItemContent>
            <ItemTitle>Fix timezone drift in schedules</ItemTitle>
            <ItemDescription>#479 opened by Diego Alvarez</ItemDescription>
          </ItemContent>
          <ItemActions><Badge tone="warning" variant="soft" dot dotTone="accent">In review</Badge></ItemActions>
        </Item>
        <Item size="sm">
          <ItemMedia variant="icon"><GitBranch aria-hidden /></ItemMedia>
          <ItemContent>
            <ItemTitle>Upgrade to Node 22</ItemTitle>
            <ItemDescription>#471 opened by Hana Sato</ItemDescription>
          </ItemContent>
          <ItemActions><Badge tone="accent" variant="soft">Merged</Badge></ItemActions>
        </Item>
      </ItemGroup>
    </div>
  )
}

// @demo
export function BadgeStatesDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge size="sm">Small</Badge>
        <Badge size="md">Medium</Badge>
        <Badge size="lg">Large</Badge>
        <Badge tone="accent" variant="solid">New</Badge>
        <Badge tone="danger" variant="outline">Blocked</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="soft" tone="success" dot>Live</Badge>
        <Badge variant="soft" tone="warning" dot dotTone="accent">Pending</Badge>
        <Badge variant="soft" tone="danger" dot dotTone="live">Failed</Badge>
        <Badge variant="soft" tone="info">
          <ShieldCheck aria-hidden className="mr-1 size-3.5" />
          Verified
        </Badge>
        <Badge variant="outline">
          <Lock aria-hidden className="mr-1 size-3.5" />
          Private
        </Badge>
      </div>
    </div>
  )
}

// @demo
export function ChipFiltersDemo() {
  const options = ["Design", "Engineering", "Marketing", "Support", "Finance", "People"]
  const [selected, setSelected] = useState<string[]>(["Design", "Engineering"])
  const toggle = (option: string) =>
    setSelected((current) => (current.includes(option) ? current.filter((item) => item !== option) : [...current, option]))
  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <span id="team-filter" className="text-sm font-medium">Teams</span>
        <span className="text-xs text-[var(--color-muted)]">{selected.length} selected</span>
      </div>
      <div role="group" aria-labelledby="team-filter" className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option)
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(option)}
              className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
            >
              <Chip variant={active ? "solid" : "outline"} tone={active ? "accent" : "neutral"} size="lg" className="cursor-pointer gap-1.5">
                {active ? <Check aria-hidden weight="bold" className="size-3.5" /> : null}
                {option}
              </Chip>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// @demo
export function ChipTagsDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Chip variant="soft" tone="accent">design-system</Chip>
        <Chip variant="soft" tone="info">react</Chip>
        <Chip variant="soft" tone="success">accessibility</Chip>
        <Chip variant="soft" tone="warning">needs-review</Chip>
        <Chip variant="soft" tone="danger">breaking</Chip>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Chip size="sm">Small</Chip>
        <Chip size="md">Medium</Chip>
        <Chip size="lg">Large</Chip>
      </div>
    </div>
  )
}

// @demo
export function AvatarTeamDemo() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Design system team</CardTitle>
        <CardDescription>8 members, 3 online now</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <AvatarGroup max={5}>
          <Avatar fallback="MK" tone="accent" status="online" />
          <Avatar fallback="JO" tone="success" status="online" />
          <Avatar fallback="PN" tone="info" status="away" />
          <Avatar fallback="DA" tone="warning" status="busy" />
          <Avatar fallback="HS" tone="danger" status="offline" />
          <Avatar fallback="LB" />
          <Avatar fallback="TR" />
          <Avatar fallback="EV" />
        </AvatarGroup>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--color-muted)]">
          <span>Online</span>
          <span>Away</span>
          <span>Busy</span>
          <span>Offline</span>
        </div>
      </CardContent>
    </Card>
  )
}

// @demo
export function AvatarSizesDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      <div className="flex flex-wrap items-end gap-4">
        {(["xs", "sm", "md", "lg", "xl", "2xl"] as const).map((size) => (
          <Avatar key={size} size={size} fallback="MK" tone="accent" />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Avatar size="lg" fallback="AB" radius="lg" tone="info" />
        <Avatar size="lg" fallback="CD" radius="md" tone="success" />
        <Avatar size="lg" fallback="EF" status="online" ring />
        <Avatar size="lg" fallback="GH" status="busy" variant="soft" tone="danger" />
      </div>
    </div>
  )
}

// @demo
export function AvatarLayoutDemo() {
  const members = [
    { initials: "MK", name: "Maya Kovacs", role: "Owner", status: "online" as const, tone: "accent" as const },
    { initials: "JO", name: "Jonas Okafor", role: "Admin", status: "away" as const, tone: "success" as const },
    { initials: "PN", name: "Priya Nair", role: "Editor", status: "online" as const, tone: "info" as const },
    { initials: "DA", name: "Diego Alvarez", role: "Viewer", status: "offline" as const, tone: "warning" as const }
  ]
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Members</CardTitle>
        <CardDescription>People with access to this workspace.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        {members.map((member, index) => (
          <div key={member.name}>
            {index > 0 ? <Separator /> : null}
            <div className="flex items-center gap-3 py-3">
              <Avatar fallback={member.initials} tone={member.tone} status={member.status} />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium">{member.name}</span>
                <span className="text-xs text-[var(--color-muted)]">{member.role}</span>
              </div>
              <Button variant="ghost" size="sm">Manage</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// @demo
export function TableInvoicesDemo() {
  const invoices = [
    { id: "INV-2041", client: "Northwind Studio", initials: "NS", amount: "$1,240.00", status: "Paid", due: "Oct 02" },
    { id: "INV-2040", client: "Fabrikam Labs", initials: "FL", amount: "$3,890.00", status: "Pending", due: "Oct 14" },
    { id: "INV-2039", client: "Contoso Health", initials: "CH", amount: "$620.50", status: "Overdue", due: "Sep 21" },
    { id: "INV-2038", client: "Tailspin Toys", initials: "TT", amount: "$2,115.00", status: "Paid", due: "Sep 18" }
  ]
  const tone = { Paid: "success", Pending: "warning", Overdue: "danger" } as const
  return (
    <div className="w-full max-w-3xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <button type="button" className="inline-flex items-center gap-1 font-semibold">
                Invoice
                <ArrowsDownUp aria-hidden className="size-3.5 text-[var(--color-muted)]" />
              </button>
            </TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Status</TableHead>
            <TableHead align="right">Amount</TableHead>
            <TableHead><span className="sr-only">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{invoice.id}</span>
                  <span className="text-xs text-[var(--color-muted)]">Due {invoice.due}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar size="xs" fallback={invoice.initials} />
                  <span>{invoice.client}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="soft" tone={tone[invoice.status as keyof typeof tone]} dot>{invoice.status}</Badge>
              </TableCell>
              <TableCell align="right" className="tabular-nums">{invoice.amount}</TableCell>
              <TableCell align="right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" aria-label={`Actions for ${invoice.id}`}>
                      <DotsThree aria-hidden weight="bold" className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem><Download aria-hidden className="size-4" />Download PDF</DropdownMenuItem>
                    <DropdownMenuItem><Envelope aria-hidden className="size-4" />Send reminder</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem><Trash aria-hidden className="size-4" />Void invoice</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// @demo
export function TableLayoutDemo() {
  const rows = [
    { name: "Glin UI", owner: "Maya Kovacs", visits: "48,210", status: "Live" },
    { name: "Docs", owner: "Jonas Okafor", visits: "21,904", status: "Live" },
    { name: "Registry", owner: "Priya Nair", visits: "9,318", status: "Building" },
    { name: "Playground", owner: "Diego Alvarez", visits: "2,044", status: "Paused" }
  ]
  const tone = { Live: "success", Building: "warning", Paused: "neutral" } as const
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Traffic over the last 30 days.</CardDescription>
          </div>
          <Button size="sm" variant="outline">
            <Download aria-hidden className="size-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Table striped size="sm">
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead align="right">Visits</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell>{row.owner}</TableCell>
                <TableCell><Badge variant="soft" tone={tone[row.status as keyof typeof tone]}>{row.status}</Badge></TableCell>
                <TableCell align="right" className="tabular-nums">{row.visits}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between gap-3 text-sm text-[var(--color-muted)]">
          <span>Showing 1 to 4 of 12</span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" disabled aria-label="Previous page"><CaretLeft aria-hidden className="size-4" /></Button>
            <Button size="sm" variant="outline" aria-label="Next page"><CaretRight aria-hidden className="size-4" /></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// @demo
export function DataTableUsersDemo() {
  type User = { id: string; name: string; email: string; role: string; status: string; seats: number }
  const users: User[] = [
    { id: "u1", name: "Maya Kovacs", email: "maya@northwind.io", role: "Owner", status: "Active", seats: 12 },
    { id: "u2", name: "Jonas Okafor", email: "jonas@northwind.io", role: "Admin", status: "Active", seats: 8 },
    { id: "u3", name: "Priya Nair", email: "priya@fabrikam.dev", role: "Editor", status: "Invited", seats: 4 },
    { id: "u4", name: "Diego Alvarez", email: "diego@contoso.com", role: "Viewer", status: "Suspended", seats: 1 },
    { id: "u5", name: "Hana Sato", email: "hana@tailspin.jp", role: "Editor", status: "Active", seats: 6 },
    { id: "u6", name: "Lena Brandt", email: "lena@fabrikam.dev", role: "Viewer", status: "Active", seats: 2 },
    { id: "u7", name: "Tomas Reyes", email: "tomas@contoso.com", role: "Admin", status: "Invited", seats: 5 }
  ]
  const [filter, setFilter] = useState("All")
  const tone = { Active: "success", Invited: "warning", Suspended: "danger" } as const
  const rows = filter === "All" ? users : users.filter((user) => user.status === filter)
  return (
    <div className="flex w-full max-w-3xl flex-col gap-3">
      <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
        {["All", "Active", "Invited", "Suspended"].map((option) => (
          <Button
            key={option}
            size="sm"
            variant={filter === option ? "solid" : "outline"}
            aria-pressed={filter === option}
            onClick={() => setFilter(option)}
          >
            {option}
          </Button>
        ))}
      </div>
      <DataTable
        columns={[
          {
            id: "name",
            header: "User",
            accessor: "name",
            sortable: true,
            searchable: true,
            cell: ({ row }) => (
              <div className="flex items-center gap-3">
                <Avatar size="sm" fallback={row.name.split(" ").map((part) => part[0]).join("")} />
                <div className="flex flex-col">
                  <span className="font-medium">{row.name}</span>
                  <span className="text-xs text-[var(--color-muted)]">{row.email}</span>
                </div>
              </div>
            )
          },
          { id: "role", header: "Role", accessor: "role", sortable: true },
          {
            id: "status",
            header: "Status",
            accessor: "status",
            cell: ({ row }) => (
              <Badge variant="soft" tone={tone[row.status as keyof typeof tone]} dot>{row.status}</Badge>
            )
          },
          { id: "seats", header: "Seats", accessor: "seats", sortable: true, align: "right" }
        ]}
        data={rows}
        getRowId={(row) => row.id}
        searchable
        searchPlaceholder="Search users"
        selectable
        pageSize={5}
      />
    </div>
  )
}

// @demo
export function TreeExplorerDemo() {
  return (
    <div className="w-full max-w-sm">
      <Tree
        aria-label="Project files"
        nodes={[
          {
            label: "src",
            children: [
              {
                label: "components",
                children: [
                  { label: "button.tsx", href: "#", icon: <FileTsx className="size-3.5" />, badge: "M", badgeVariant: "warning" },
                  { label: "card.tsx", href: "#", icon: <FileTsx className="size-3.5" /> },
                  { label: "toast.tsx", href: "#", icon: <FileTsx className="size-3.5" />, badge: "new", badgeVariant: "success" }
                ]
              },
              {
                label: "styles",
                children: [{ label: "globals.css", href: "#", icon: <FileCss className="size-3.5" /> }]
              },
              { label: "index.ts", href: "#" }
            ]
          },
          { label: "package.json", href: "#" },
          { label: "tsconfig.json", href: "#", badge: "M", badgeVariant: "warning" }
        ]}
      />
    </div>
  )
}

// @demo
export function CounterNavDemo() {
  const tabs = [
    { label: "Inbox", count: 12, tone: "accent" as const },
    { label: "Mentions", count: 3, tone: "danger" as const },
    { label: "Drafts", count: 0, tone: "neutral" as const },
    { label: "Archive", count: 248, tone: "neutral" as const }
  ]
  return (
    <div className="flex w-full max-w-sm flex-col gap-1 rounded-xl border border-[var(--line-soft)] p-2">
      {tabs.map((tab, index) => (
        <button
          key={tab.label}
          type="button"
          aria-current={index === 0 ? "page" : undefined}
          className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-[var(--surface-2)] aria-[current=page]:bg-[var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          {tab.label}
          <Counter value={tab.count} tone={tab.tone} variant={tab.tone === "neutral" ? "soft" : "solid"} max={99} aria-label={`${tab.count} items`} />
        </button>
      ))}
    </div>
  )
}

// @demo
export function CounterSizesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-2">
        <Counter value={4} size="sm" />
        <Counter value={42} size="md" />
        <Counter value={420} size="lg" />
      </div>
      <Button variant="outline" size="sm" className="gap-2">
        <Bell aria-hidden className="size-4" />
        Notifications
        <Counter value={7} tone="danger" variant="solid" size="sm" />
      </Button>
      <span className="relative inline-flex">
        <IconFrame size="lg"><Envelope aria-hidden className="size-5" /></IconFrame>
        <Counter value={128} max={99} tone="danger" variant="solid" size="sm" className="absolute -right-2 -top-2" aria-label="128 unread" />
      </span>
    </div>
  )
}

// @demo
export function KbdCheatSheetDemo() {
  const groups = [
    { title: "Navigation", rows: [["Open command palette", ["Ctrl", "K"]], ["Go to dashboard", ["G", "D"]], ["Toggle sidebar", ["Ctrl", "B"]]] },
    { title: "Editing", rows: [["Save", ["Ctrl", "S"]], ["Undo", ["Ctrl", "Z"]], ["Duplicate line", ["Shift", "Alt", "Down"]]] }
  ] as const
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Keyboard shortcuts</CardTitle>
        <CardDescription>Press ? anywhere to open this list.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {groups.map((group) => (
          <section key={group.title} aria-label={group.title} className="flex flex-col gap-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">{group.title}</h4>
            {group.rows.map(([label, keys]) => (
              <div key={label} className="flex items-center justify-between gap-4 border-b border-[var(--line-soft)] py-2 text-sm last:border-b-0">
                <span>{label}</span>
                <span className="flex items-center gap-1">
                  {keys.map((key) => (
                    <Kbd key={key}>{key}</Kbd>
                  ))}
                </span>
              </div>
            ))}
          </section>
        ))}
      </CardContent>
    </Card>
  )
}

// @demo
export function KbdInlineDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <label className="relative block">
        <span className="sr-only">Search</span>
        <MagnifyingGlass aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-muted)]" />
        <Input placeholder="Search docs" className="pl-9 pr-16" />
        <span className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
          <Kbd size="sm">Ctrl</Kbd>
          <Kbd size="sm">K</Kbd>
        </span>
      </label>
      <p className="text-sm text-[var(--color-muted)]">
        Press <Kbd size="sm">Esc</Kbd> to close, <Kbd size="sm">Enter</Kbd> to open the first result.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Kbd size="sm">sm</Kbd>
        <Kbd size="md">md</Kbd>
        <Kbd size="lg">lg</Kbd>
      </div>
    </div>
  )
}

// @demo
export function ItemSettingsDemo() {
  const [notify, setNotify] = useState(true)
  const [dark, setDark] = useState(false)
  return (
    <ItemGroup className="w-full max-w-lg">
      <Item>
        <ItemMedia variant="icon"><UserCircle aria-hidden /></ItemMedia>
        <ItemContent>
          <ItemTitle>Profile</ItemTitle>
          <ItemDescription>Name, avatar and public bio.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="outline"><PencilSimple aria-hidden className="size-4" />Edit</Button>
        </ItemActions>
      </Item>
      <ItemSeparator />
      <Item>
        <ItemMedia variant="icon"><Bell aria-hidden /></ItemMedia>
        <ItemContent>
          <ItemTitle id="notify-label">Email notifications</ItemTitle>
          <ItemDescription>Weekly digest and mentions.</ItemDescription>
        </ItemContent>
        <ItemActions><Switch checked={notify} onCheckedChange={setNotify} aria-labelledby="notify-label" /></ItemActions>
      </Item>
      <ItemSeparator />
      <Item>
        <ItemMedia variant="icon"><Moon aria-hidden /></ItemMedia>
        <ItemContent>
          <ItemTitle id="dark-label">Dark appearance</ItemTitle>
          <ItemDescription>Follows your system by default.</ItemDescription>
        </ItemContent>
        <ItemActions><Switch checked={dark} onCheckedChange={setDark} aria-labelledby="dark-label" /></ItemActions>
      </Item>
      <ItemSeparator />
      <Item>
        <ItemMedia variant="icon"><Gear aria-hidden /></ItemMedia>
        <ItemContent>
          <ItemTitle>Advanced</ItemTitle>
          <ItemDescription>API tokens, webhooks and data export.</ItemDescription>
        </ItemContent>
        <ItemActions><CaretRight aria-hidden className="size-4 text-[var(--color-muted)]" /></ItemActions>
      </Item>
    </ItemGroup>
  )
}

// @demo
export function ItemMediaDemo() {
  const tracks = [
    { title: "Night Drive", artist: "Mira Lowe", length: "3:42", tone: "accent" as const },
    { title: "Paper Lanterns", artist: "The Quiet Hours", length: "4:08", tone: "success" as const },
    { title: "Low Tide", artist: "Oskar Venn", length: "2:56", tone: "info" as const }
  ]
  return (
    <ItemGroup className="w-full max-w-lg gap-2">
      {tracks.map((track) => (
        <Item key={track.title} variant="outline" size="sm">
          <ItemMedia>
            <Avatar radius="lg" fallback={track.title.slice(0, 2)} tone={track.tone} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{track.title}</ItemTitle>
            <ItemDescription>{track.artist}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <span className="text-xs tabular-nums text-[var(--color-muted)]">{track.length}</span>
            <Button variant="ghost" size="sm" aria-label={`More options for ${track.title}`}>
              <CaretDown aria-hidden className="size-4" />
            </Button>
          </ItemActions>
        </Item>
      ))}
      <Item variant="soft" tone="warning" size="sm">
        <ItemMedia variant="icon"><Warning aria-hidden /></ItemMedia>
        <ItemContent>
          <ItemTitle>Offline mode is on</ItemTitle>
          <ItemDescription>Only downloaded tracks will play.</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
