"use client"

import Link from "next/link"
import { useState } from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  ProgressCircle,
  RadioGroup,
  RadioGroupItem,
  Select,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Skeleton,
  Slider,
  Switch,
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
  Textarea,
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@glinui/ui"
import { ExampleBlock } from "@/components/docs/example-block"
import { type DocsImplementation, buildComponentHref } from "@/lib/docs-route"

import {
  primitiveComponentIds,
  primitiveDescriptions,
  primitiveTitles,
  type PrimitiveComponentId
} from "@/lib/primitives"

const EXAMPLE_CODE: Partial<Record<PrimitiveComponentId, string>> = {
  button: `import { Button } from "@glinui/ui"

export function Demo() {
  return (
    <div className="flex gap-3">
      <Button>Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  )
}`,
  input: `import { Input } from "@glinui/ui"

export function Demo() {
  return (
    <div className="space-y-3">
      <Input aria-label="Email" variant="glass" placeholder="name@example.com" />
      <Input aria-label="Search" variant="liquid" placeholder="Search components..." />
    </div>
  )
}`,
  tabs: `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@glinui/ui"

export function Demo() {
  return (
    <Tabs defaultValue="first">
      <TabsList variant="glass">
        <TabsTrigger value="first" variant="glass">First</TabsTrigger>
        <TabsTrigger value="second" variant="glass">Second</TabsTrigger>
      </TabsList>
      <TabsContent value="first" variant="glass">First tab content</TabsContent>
      <TabsContent value="second" variant="glass">Second tab content</TabsContent>
    </Tabs>
  )
}`,
  accordion: `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@glinui/ui"

export function Demo() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" variant="glass">
        <AccordionTrigger variant="glass">What is Glin UI?</AccordionTrigger>
        <AccordionContent variant="glass">Glin UI is a liquid-glass focused component library for React.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}`,
  alert: `import { Alert, AlertTitle, AlertDescription } from "@glinui/ui"

export function Demo() {
  return (
    <Alert variant="glass">
      <AlertTitle>Deployment ready</AlertTitle>
      <AlertDescription>Your latest build passed all checks.</AlertDescription>
    </Alert>
  )
}`,
  "dropdown-menu": `import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@glinui/ui"

export function Demo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger variant="glass">Open menu</DropdownMenuTrigger>
      <DropdownMenuContent variant="glass">
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}`,
  command: `import { Command, CommandInput, CommandList, CommandItem } from "@glinui/ui"

export function Demo() {
  return (
    <Command className="max-w-md">
      <CommandInput placeholder="Type a command..." />
      <CommandList>
        <CommandItem>Open settings</CommandItem>
        <CommandItem>Create project</CommandItem>
      </CommandList>
    </Command>
  )
}`,
  popover: `import { Popover, PopoverTrigger, PopoverContent } from "@glinui/ui"

export function Demo() {
  return (
    <Popover>
      <PopoverTrigger variant="glass">Open popover</PopoverTrigger>
      <PopoverContent variant="glass">Popover content</PopoverContent>
    </Popover>
  )
}`,
  sheet: `import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@glinui/ui"

export function Demo() {
  return (
    <Sheet>
      <SheetTrigger variant="glass">Open sheet</SheetTrigger>
      <SheetContent variant="glass">
        <SheetHeader>
          <SheetTitle>Project settings</SheetTitle>
          <SheetDescription>Adjust your workspace preferences.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}`,
  card: `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@glinui/ui"

export function Demo() {
  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle>Project overview</CardTitle>
        <CardDescription>Weekly performance summary.</CardDescription>
      </CardHeader>
      <CardContent>Revenue grew by 18% and churn decreased by 1.2%.</CardContent>
      <CardFooter>Updated 2 minutes ago.</CardFooter>
    </Card>
  )
}`,
  badge: `import { Badge } from "@glinui/ui"

export function Demo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="glass">Glass</Badge>
    </div>
  )
}`,
  avatar: `import { Avatar } from "@glinui/ui"

export function Demo() {
  return (
    <div className="flex items-center gap-3">
      <Avatar alt="Glin User" fallback="GU" />
      <Avatar variant="glass" alt="Glass User" fallback="GL" />
      <Avatar size="lg" alt="Large User" fallback="LU" />
    </div>
  )
}`,
  textarea: `import { Textarea } from "@glinui/ui"

export function Demo() {
  return (
    <div className="space-y-3">
      <Textarea aria-label="Feedback" variant="glass" placeholder="Share your feedback" rows={5} />
      <Textarea aria-label="Roadmap notes" variant="liquid" placeholder="Roadmap notes..." rows={3} />
    </div>
  )
}`,
  select: `import { Select } from "@glinui/ui"

export function Demo() {
  return (
    <Select
      aria-label="Team"
      variant="glass"
      defaultValue="engineering"
      options={[
        { value: "engineering", label: "Engineering" },
        { value: "design", label: "Design" },
        { value: "product", label: "Product" }
      ]}
    />
  )
}`,
  checkbox: `import { Checkbox } from "@glinui/ui"

export function Demo() {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Checkbox variant="glass" aria-label="Enable" />
      Enable experimental mode
    </div>
  )
}`,
  "radio-group": `import { RadioGroup, RadioGroupItem } from "@glinui/ui"

export function Demo() {
  return (
    <RadioGroup defaultValue="starter" aria-label="Plan" className="gap-3">
      <label className="flex items-center gap-2 text-sm">
        <RadioGroupItem value="starter" variant="glass" aria-label="Starter" /> Starter
      </label>
      <label className="flex items-center gap-2 text-sm">
        <RadioGroupItem value="pro" variant="glass" aria-label="Pro" /> Pro
      </label>
    </RadioGroup>
  )
}`,
  switch: `import { Switch } from "@glinui/ui"

export function Demo() {
  return (
    <label className="flex items-center gap-2 text-sm">
      <Switch aria-label="Notifications" />
      Notifications
    </label>
  )
}`,
  progress: `import { Progress, ProgressCircle } from "@glinui/ui"

export function Demo() {
  return (
    <div className="space-y-4">
      <Progress variant="glass" value={68} aria-label="Upload progress" />
      <ProgressCircle variant="liquid" value={68} aria-label="Upload progress circle" />
    </div>
  )
}`,
  separator: `import { Separator } from "@glinui/ui"

export function Demo() {
  return (
    <div className="space-y-4">
      <p className="text-sm">Section A</p>
      <Separator variant="glass" />
      <p className="text-sm">Section B</p>
    </div>
  )
}`,
  skeleton: `import { Skeleton } from "@glinui/ui"

export function Demo() {
  return (
    <div className="space-y-3">
      <Skeleton variant="glass" className="h-6 w-40" />
      <Skeleton variant="default" className="h-4 w-full max-w-sm" />
      <Skeleton variant="ghost" className="h-4 w-3/4 max-w-xs" />
    </div>
  )
}`,
  slider: `import { Slider } from "@glinui/ui"

export function Demo() {
  return <Slider variant="glass" defaultValue={[35]} max={100} step={1} aria-label="Volume" />
}`,
  table: `import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@glinui/ui"

export function Demo() {
  return (
    <Table variant="glass">
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Glin UI</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}`,
  modal: `import { Modal, ModalTrigger, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter, Button } from "@glinui/ui"

export function Demo() {
  return (
    <Modal>
      <ModalTrigger asChild>
        <Button>Open Modal</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Save changes</ModalTitle>
          <ModalDescription>Confirm before applying this update.</ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <Button variant="ghost">Cancel</Button>
          <Button>Confirm</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}`,
  tooltip: `import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, Button } from "@glinui/ui"

export function Demo() {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover for hint</Button>
        </TooltipTrigger>
        <TooltipContent>Tooltip with contextual guidance.</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}`,
  tree: `import { Tree } from "@glinui/ui"

export function Demo() {
  return (
    <Tree
      variant="outline"
      nodes={[
        {
          label: "src",
          children: [
            {
              label: "components",
              children: [
                { label: "button.tsx" },
                { label: "input.tsx" }
              ]
            },
            { label: "index.ts" }
          ]
        },
        { label: "package.json" }
      ]}
    />
  )
}`,
  toast: `import { ToastProvider, Toast, ToastTitle, ToastDescription, ToastClose, ToastViewport, Button } from "@glinui/ui"
import { useState } from "react"

export function Demo() {
  const [open, setOpen] = useState(false)
  return (
    <ToastProvider>
      <Button onClick={() => setOpen(true)}>Show toast</Button>
      <Toast open={open} onOpenChange={setOpen}>
        <ToastTitle>Saved</ToastTitle>
        <ToastDescription>Your settings were updated.</ToastDescription>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  )
}`
}

export function PrimitiveCatalog({ implementation = "radix" }: { implementation?: DocsImplementation }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Primitive Components</h2>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {primitiveComponentIds.map((id) => (
          <Link
            key={id}
            href={buildComponentHref(id, implementation)}
            className="rounded-2xl border border-border/60 bg-[var(--glass-2-surface)] p-4 backdrop-blur-xl [box-shadow:0_0_0_1px_rgb(255_255_255_/_0.06)_inset,var(--shadow-soft)] transition duration-fast ease-standard hover:-translate-y-0.5 hover:bg-[var(--glass-3-surface)]"
          >
            <p className="text-sm font-semibold">{primitiveTitles[id]}</p>
            <p className="mt-2 text-sm text-neutral-600">{primitiveDescriptions[id]}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function PrimitiveDocsDemo({
  component,
  implementation = "radix"
}: {
  component: PrimitiveComponentId
  implementation?: DocsImplementation
}) {
  const [checked, setChecked] = useState(false)
  const [switchChecked, setSwitchChecked] = useState(true)
  const [toastOpen, setToastOpen] = useState(false)

  return (
    <section className="space-y-4 rounded-2xl border border-border/60 bg-[var(--glass-3-surface)] p-6 backdrop-blur-2xl [box-shadow:0_0_0_1px_rgb(255_255_255_/_0.06)_inset,var(--shadow-elevated)]">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold">{primitiveTitles[component]}</h2>
        <p className="text-sm text-neutral-600">{primitiveDescriptions[component]}</p>
      </header>

      <ExampleBlock
        code={EXAMPLE_CODE[component] ?? `import { ${primitiveTitles[component]} } from "@glinui/ui"`}
        codeDefaultOpen={false}
      >
        <div className="w-full">
        {component === "button" ? (
          <div className="flex flex-wrap gap-3">
            <Button>Default</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        ) : null}

        {component === "input" ? (
          <div className="space-y-3">
            <Input aria-label="Email" variant="glass" placeholder="name@example.com" />
            <Input aria-label="Search" variant="liquid" placeholder="Search components..." />
          </div>
        ) : null}

        {component === "tabs" ? (
          <Tabs defaultValue="first">
            <TabsList variant="glass">
              <TabsTrigger value="first" variant="glass">
                First
              </TabsTrigger>
              <TabsTrigger value="second" variant="glass">
                Second
              </TabsTrigger>
            </TabsList>
            <TabsContent value="first" variant="glass">
              First tab content
            </TabsContent>
            <TabsContent value="second" variant="glass">
              Second tab content
            </TabsContent>
          </Tabs>
        ) : null}

        {component === "accordion" ? (
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1" variant="glass">
              <AccordionTrigger variant="glass">What is Glin UI?</AccordionTrigger>
              <AccordionContent variant="glass">
                Glin UI is a liquid-glass focused component library for React.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : null}

        {component === "alert" ? (
          <Alert variant="glass">
            <AlertTitle>Deployment ready</AlertTitle>
            <AlertDescription>Your latest build passed all checks.</AlertDescription>
          </Alert>
        ) : null}

        {component === "dropdown-menu" ? (
          <DropdownMenu>
            <DropdownMenuTrigger variant="glass">Open menu</DropdownMenuTrigger>
            <DropdownMenuContent variant="glass">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}

        {component === "popover" ? (
          <Popover>
            <PopoverTrigger variant="glass">Open popover</PopoverTrigger>
            <PopoverContent variant="glass">Popover content</PopoverContent>
          </Popover>
        ) : null}

        {component === "command" ? (
          <Command className="max-w-md">
            <CommandInput placeholder="Type a command..." />
            <CommandList>
              <CommandItem>Open settings</CommandItem>
              <CommandItem>Create project</CommandItem>
            </CommandList>
          </Command>
        ) : null}

        {component === "sheet" ? (
          <Sheet>
            <SheetTrigger variant="glass">Open sheet</SheetTrigger>
            <SheetContent variant="glass">
              <SheetHeader>
                <SheetTitle>Project settings</SheetTitle>
                <SheetDescription>Adjust your workspace preferences.</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        ) : null}

        {component === "card" ? (
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Project overview</CardTitle>
              <CardDescription>Weekly performance summary.</CardDescription>
            </CardHeader>
            <CardContent>Revenue grew by 18% and churn decreased by 1.2%.</CardContent>
            <CardFooter>Updated 2 minutes ago.</CardFooter>
          </Card>
        ) : null}

        {component === "badge" ? (
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="ghost">Ghost</Badge>
            <Badge variant="glass">Glass</Badge>
          </div>
        ) : null}

        {component === "avatar" ? (
          <div className="flex items-center gap-3">
            <Avatar alt="Glin User" fallback="GU" />
            <Avatar variant="glass" alt="Glass User" fallback="GL" />
            <Avatar size="lg" alt="Large User" fallback="LU" />
          </div>
        ) : null}

        {component === "textarea" ? (
          <div className="space-y-3">
            <Textarea aria-label="Feedback" variant="glass" placeholder="Share your feedback" rows={5} />
            <Textarea aria-label="Roadmap notes" variant="liquid" placeholder="Roadmap notes..." rows={3} />
          </div>
        ) : null}

        {component === "select" ? (
          <Select
            aria-label="Team"
            variant="glass"
            defaultValue="engineering"
            options={[
              { value: "engineering", label: "Engineering" },
              { value: "design", label: "Design" },
              { value: "product", label: "Product" }
            ]}
          />
        ) : null}

        {component === "checkbox" ? (
          <div className="flex items-center gap-2 text-sm">
            <Checkbox
              variant="glass"
              checked={checked}
              onCheckedChange={(value) => setChecked(Boolean(value))}
              aria-label="Enable"
            />
            Enable experimental mode
          </div>
        ) : null}

        {component === "radio-group" ? (
          <RadioGroup defaultValue="starter" aria-label="Plan" className="gap-3">
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="starter" variant="glass" aria-label="Starter" /> Starter
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="pro" variant="glass" aria-label="Pro" /> Pro
            </label>
          </RadioGroup>
        ) : null}

        {component === "switch" ? (
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={switchChecked} onCheckedChange={setSwitchChecked} aria-label="Notifications" />
            Notifications
          </label>
        ) : null}

        {component === "progress" ? (
          <div className="space-y-4">
            <Progress variant="glass" value={68} aria-label="Upload progress" />
            <ProgressCircle variant="liquid" value={68} aria-label="Upload progress circle" />
          </div>
        ) : null}

        {component === "separator" ? (
          <div className="space-y-4">
            <p className="text-sm">Section A</p>
            <Separator variant="glass" />
            <p className="text-sm">Section B</p>
          </div>
        ) : null}

        {component === "skeleton" ? (
          <div className="space-y-3">
            <Skeleton variant="glass" className="h-6 w-40" />
            <Skeleton variant="default" className="h-4 w-full max-w-sm" />
            <Skeleton variant="ghost" className="h-4 w-3/4 max-w-xs" />
          </div>
        ) : null}

        {component === "slider" ? (
          <Slider variant="glass" defaultValue={[35]} max={100} step={1} aria-label="Volume" />
        ) : null}

        {component === "table" ? (
          <Table variant="glass">
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Glin UI</TableCell>
                <TableCell>Active</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : null}

        {component === "modal" ? (
          <Modal>
            <ModalTrigger asChild>
              <Button>Open Modal</Button>
            </ModalTrigger>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Save changes</ModalTitle>
                <ModalDescription>Confirm before applying this update.</ModalDescription>
              </ModalHeader>
              <ModalFooter>
                <Button variant="ghost">Cancel</Button>
                <Button>Confirm</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        ) : null}

        {component === "tooltip" ? (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover for hint</Button>
              </TooltipTrigger>
              <TooltipContent>Tooltip with contextual guidance.</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null}

        {component === "toast" ? (
          <ToastProvider>
            <Button onClick={() => setToastOpen(true)}>Show toast</Button>
            <Toast open={toastOpen} onOpenChange={setToastOpen}>
              <ToastTitle>Saved</ToastTitle>
              <ToastDescription>Your settings were updated.</ToastDescription>
              <ToastClose />
            </Toast>
            <ToastViewport />
          </ToastProvider>
        ) : null}
        </div>
      </ExampleBlock>

      <p className="text-xs text-neutral-500">
        Implementation: <code>{implementation}</code>. Import path: <code>@glinui/ui</code>
      </p>
    </section>
  )
}
