"use client"

import { TableFamilyMatrix } from "@/components/variants/family-demos"
import { CodeFamilyMatrix } from "@/components/variants/family-demos"
import { BadgeFamilyMatrix } from "@/components/variants/family-demos"
import { AccordionHero, AccordionLayout, AccordionVariantsDemo, AlertHero, AlertLayout, AlertTonesDemo, AlertVariantsDemo, CardHeaderWell, CardHero, CardInteractive, CardLayout, CardOnPhoto, CardVariantsMatrix, IconFrameTonesDemo, IconFrameVariantsDemo, SeparatorVariantsDemo } from "@/components/demos/card-demos"
import type { ReactNode } from "react"
import { useState } from "react"
import { ControlledDemo, FormDemo, IconsDemo, LoadingDemo, PhotoStage, PlainStage, RowsDemo, StateMatrix } from "./switch-demos"
import { demoCode } from "./switch-demo-code"
import {
  StageAlertDialogContent,
  StageDropdownMenuContent,
  StageHoverCardContent,
  StageModalContent,
  StagePopoverContent,
  StageSheetContent
} from "@/components/docs/overlay-demos"
import { ToastSaveHero, ToastStackHero } from "@/components/demos/s2-signature-heroes"
import { showcaseS2Code } from "@/lib/new-components/showcase-s2-code.generated"
import type { PropRow } from "@/components/docs/props-table"
import { ButtonIconsDemo, ButtonLoadingDemo, ButtonTonesRow, ButtonVariantsMatrix } from "@/components/variants/button-demos"
import type { NewComponentId, PrimitiveComponentId } from "@/lib/primitives"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Chip,
  Code,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
  DataTable,
  Counter,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Heading,
  HoverCard,
  HoverCardTrigger,
  IconFrame,
  Input,
  Kbd,
  Label,
  Link,
  Modal,
  ModalClose,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
  Popover,
  PopoverTrigger,
  Progress,
  ProgressCircle,
  RadioGroup,
  RadioGroupItem,
  Select,
  Separator,
  Sheet,
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Skeleton,
  Slider,
  StatusDot,
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
  Text,
  Textarea,
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  Toaster,
  toast,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tree
} from "@glinui/ui"

// ── Types ────────────────────────────────────────────────────────────────────

export type ComponentExample = {
  title: string
  description?: string
  code: string
  render: ReactNode
}

export type KeyboardRow = {
  key: string
  description: string
}

export type PropsGroup = {
  title: string
  rows: PropRow[]
}

export type ComponentDocMeta = {
  badge: string
  /** Props for single-component, or groups for molecules with sub-components */
  props: PropRow[] | PropsGroup[]
  accessibility: {
    summary: string[]
    keyboard?: KeyboardRow[]
    aria?: string[]
  }
  reducedMotion: {
    description: string
    affected?: string[]
  }
  examples: ComponentExample[]
  /** Optional usage notes shown at the top of Usage (differences, caveats). */
  notes?: string[]
}

// ── Helper for stateful previews ─────────────────────────────────────────────

function ToastDemo() {
  return (
    <>
      <Toaster position="bottom-right" />
      <Button onClick={() => toast("Settings saved", { description: "Your workspace has been updated." })}>
        Show toast
      </Button>
    </>
  )
}

function ToastTypesDemo() {
  return (
    <>
      <Toaster position="bottom-right" />
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => toast.success("Saved", { description: "Your changes were saved." })}>Success</Button>
        <Button size="sm" onClick={() => toast.error("Failed", { description: "Something went wrong." })}>Error</Button>
        <Button size="sm" onClick={() => toast.warning("Careful", { description: "This action cannot be undone." })}>Warning</Button>
        <Button size="sm" onClick={() => toast.info("Info", { description: "A new version is available." })}>Info</Button>
        <Button size="sm" onClick={() => toast.loading("Uploading...", { description: "Please wait." })}>Loading</Button>
      </div>
    </>
  )
}

function ToastActionDemo() {
  return (
    <>
      <Toaster position="bottom-right" />
      <Button size="sm" onClick={() => toast("File deleted", {
        description: "The file has been moved to trash.",
        action: { label: "Undo", onClick: () => toast.success("Restored") }
      })}>
        With action
      </Button>
    </>
  )
}

function ToastPromiseDemo() {
  return (
    <>
      <Toaster position="bottom-right" />
      <Button size="sm" onClick={() => {
        toast.promise(
          new Promise<{ name: string }>((resolve) => setTimeout(() => resolve({ name: "report.pdf" }), 2000)),
          {
            loading: "Generating report...",
            success: (data) => `${data.name} is ready!`,
            error: "Failed to generate report"
          }
        )
      }}>
        Promise toast
      </Button>
    </>
  )
}

function CheckboxDemo() {
  const [checked, setChecked] = useState(false)
  return (
    <label className="flex items-center gap-2 text-sm">
      <Checkbox checked={checked} onCheckedChange={(v) => setChecked(Boolean(v))} aria-label="Enable" />
      Enable experimental mode
    </label>
  )
}

function SwitchDemo() {
  const [on, setOn] = useState(true)
  return (
    <label className="flex items-center gap-2 text-sm">
      <Switch checked={on} onCheckedChange={setOn} aria-label="Notifications" />
      Notifications
    </label>
  )
}

function SliderRangeDemo() {
  const [value, setValue] = useState([24, 78])

  return (
    <div className="space-y-3">
      <Slider value={value} onValueChange={setValue} max={100} step={1} aria-label="Engagement range" />
      <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
        <span>{value[0]}%</span>
        <span>{value[1]}%</span>
      </div>
    </div>
  )
}

function SliderAtmosphereDemo() {
  const [value, setValue] = useState([62])

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[color:var(--line-soft)] bg-[var(--surface-1)] p-4">
      <div className="pointer-events-none absolute -left-6 -top-10 h-24 w-24 rounded-full bg-[color-mix(in_oklab,var(--color-accent)_25%,transparent)] blur-2xl motion-safe:animate-pulse" />
      <div className="pointer-events-none absolute -bottom-10 right-0 h-24 w-24 rounded-full bg-[color-mix(in_oklab,var(--color-foreground)_15%,transparent)] blur-3xl motion-safe:animate-pulse" />
      <div className="relative space-y-3">
        <div className="flex items-center justify-between text-xs text-[color:var(--color-muted)]">
          <span>Atmosphere</span>
          <Badge variant="soft">{value[0]}%</Badge>
        </div>
        <Slider value={value} onValueChange={setValue} max={100} aria-label="Atmosphere amount" />
      </div>
    </div>
  )
}

// ── Registry ─────────────────────────────────────────────────────────────────

export const componentDocs: Record<Exclude<PrimitiveComponentId, NewComponentId>, ComponentDocMeta> = {
  button: {
    badge: "Primitive / Atom",
    props: [
      { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "gradient" | "glass" | "liquid" | "matte" | "glow" | "key" | "key-white"', defaultValue: "ambient (glinr)", description: "Visual treatment. Omit for the ambient style default (glinr, plain under style=minimal, glass under style=glass). Legacy names default, primary, secondary, destructive, frosted and raised still work as aliases." },
      { prop: "tone", type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"', defaultValue: "neutral", description: "Colour axis for the vocabulary variants." },
      { prop: "size", type: '"xs" | "sm" | "md" | "lg" | "icon"', defaultValue: "md", description: "Height and horizontal padding scale. `icon` is a square button, give it an `aria-label`." },
      { prop: "leadingIcon", type: "ReactNode", description: "Decorative icon before the label." },
      { prop: "trailingIcon", type: "ReactNode", description: "Decorative icon after the label." },
      { prop: "loading", type: "boolean", defaultValue: "false", description: "Shows a spinner, sets aria-busy and blocks interaction." },
      { prop: "iconNudge", type: "boolean", defaultValue: "false", description: "Nudges icons toward the trailing edge on hover and focus." },
      { prop: "asChild", type: "boolean", defaultValue: "false", description: "Renders child element with button styles." }
    ],
    accessibility: {
      summary: [
        "Native `button` semantics by default.",
        "Visible 2px accent focus ring with offset on every variant (plain uses a neutral ring).",
        "`disabled` and `loading` block interaction, lower emphasis and set `aria-disabled` / `aria-busy`.",
        "Icon-only buttons need an `aria-label`.",
        "Supports `asChild` for semantic link rendering."
      ],
      keyboard: [
        { key: "Enter", description: "Activate the button." },
        { key: "Space", description: "Activate the button." }
      ],
      aria: [
        '`role="button"` native',
        "`aria-disabled` when disabled or loading",
        "`aria-busy` while loading"
      ]
    },
    reducedMotion: {
      description: "Transitions use tokenized timing and disable transform-heavy motion with `prefers-reduced-motion`.",
      affected: ["transform", "opacity", "box-shadow", "background-color"]
    },
    examples: [
      {
        title: "Basic",
        code: `import { Button } from "@glinui/ui"\n\nexport function Demo() {\n  return <Button>Get started</Button>\n}`,
        render: <Button>Get started</Button>
      },
      {
        title: "Variants",
        code: `import { Button, SURFACE_TONES, SURFACE_VARIANTS } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="grid gap-2">\n      {SURFACE_VARIANTS.map((variant) => (\n        <div key={variant} className="flex flex-wrap gap-2">\n          {SURFACE_TONES.map((tone) => (\n            <Button key={tone} variant={variant} tone={tone}>\n              {variant} {tone}\n            </Button>\n          ))}\n        </div>\n      ))}\n    </div>\n  )\n}`,
        render: <ButtonVariantsMatrix />
      },
      {
        title: "Tones",
        code: `import { Button } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="flex flex-wrap gap-2">\n      <Button tone="neutral">neutral</Button>\n      <Button tone="accent">accent</Button>\n      <Button tone="success">success</Button>\n      <Button tone="warning">warning</Button>\n      <Button tone="danger">danger</Button>\n      <Button tone="info">info</Button>\n    </div>\n  )\n}`,
        render: <ButtonTonesRow />
      },
      {
        title: "With icons",
        code: `import { ArrowRight, Plus } from "@phosphor-icons/react"\nimport { Button } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="flex flex-wrap items-center gap-3">\n      <Button leadingIcon={<Plus weight="bold" />}>New project</Button>\n      <Button variant="solid" trailingIcon={<ArrowRight weight="bold" />} iconNudge>\n        Continue\n      </Button>\n      <Button variant="outline" size="icon" aria-label="Add item">\n        <Plus weight="bold" />\n      </Button>\n    </div>\n  )\n}`,
        render: <ButtonIconsDemo />
      },
      {
        title: "Loading",
        code: `import { Button } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="flex flex-wrap items-center gap-3">\n      <Button loading>Saving</Button>\n      <Button variant="solid" loading>Saving</Button>\n      <Button disabled>Disabled</Button>\n    </div>\n  )\n}`,
        render: <ButtonLoadingDemo />
      },
      {
        title: "Sizes",
        code: `import { Button } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="flex flex-wrap items-end gap-2">\n      <Button size="xs">Extra small</Button>\n      <Button size="sm">Small</Button>\n      <Button size="md">Medium</Button>\n      <Button size="lg">Large</Button>\n    </div>\n  )\n}`,
        render: (
          <div className="flex flex-wrap items-end gap-2">
            <Button size="xs">Extra small</Button>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        )
      },
      {
        title: "As link (asChild)",
        code: `import { Button } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Button asChild variant="solid">\n      <a href="/docs/getting-started">Read the docs</a>\n    </Button>\n  )\n}`,
        render: (
          <Button asChild variant="solid">
            <a href="/docs/getting-started">Read the docs</a>
          </Button>
        )
      },
      {
        title: "Glass (opt-in)",
        code: `import { Button } from "@glinui/ui"\n\n// Glass needs a colorful or photographic backdrop to read.\nexport function Demo() {\n  return <Button variant="glass">Glass</Button>\n}`,
        render: <Button variant="glass">Glass</Button>
      },
      {
        title: "Extra looks",
        code: `import { Button } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="flex flex-wrap gap-2">\n      <Button variant="liquid">Liquid</Button>\n      <Button variant="matte">Matte</Button>\n      <Button variant="glow">Glow</Button>\n    </div>\n  )\n}`,
        render: (
          <div className="flex flex-wrap gap-2">
            <Button variant="liquid">Liquid</Button>
            <Button variant="matte">Matte</Button>
            <Button variant="glow">Glow</Button>
          </div>
        )
      }
    ]
  },

  input: {
    badge: "Primitive / Atom",
    props: [
      { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "glass" | "liquid" | "matte" | "underline" | "filled"', defaultValue: 'ambient (glinr)', description: 'Surface look. Omit to follow the ambient design style: glinr is an inset well with a gradient hairline ring, plain is a flat shadcn field. Glass is opt-in.' },
      { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Height scale." },
      { prop: "type", type: "string", defaultValue: "text", description: "HTML input type." },
      { prop: "disabled", type: "boolean", defaultValue: "false", description: "Disables interaction." },
      { prop: "placeholder", type: "string", description: "Placeholder text." }
    ],
    accessibility: {
      summary: [
        "Native `input` semantics.",
        "Visible focus ring on `:focus-visible`.",
        "Pair with `<label>` or `aria-label` for screen readers."
      ],
      keyboard: [
        { key: "Tab", description: "Move focus to the input." }
      ],
      aria: [
        '`role="textbox"` native',
        "`aria-invalid` for validation"
      ]
    },
    reducedMotion: {
      description: "Focus transitions use tokenized timing.",
      affected: ["border-color", "box-shadow"]
    },
    examples: [
      {
        title: "Default",
        code: `import { Input } from "@glinui/ui"\n\nexport function Demo() {\n  return <Input placeholder="name@example.com" />\n}`,
        render: <Input placeholder="name@example.com" />
      },
      {
        title: "Variants",
        description: "glinr (default) is the inset well, plain is the flat shadcn field. Each state is AA readable on every stage backdrop.",
        code: `import { Input } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="grid gap-3 sm:grid-cols-2">\n      <Input variant="glinr" placeholder="glinr" />\n      <Input variant="solid" placeholder="solid" />\n      <Input variant="plain" placeholder="plain" />\n      <Input variant="soft" placeholder="soft" />\n      <Input variant="outline" placeholder="outline" />\n      <Input variant="ghost" placeholder="ghost" />\n    </div>\n  )\n}`,
        render: (
          <div className="grid gap-3 sm:grid-cols-2">
            <Input variant="glinr" placeholder="glinr" />
            <Input variant="solid" placeholder="solid" />
            <Input variant="plain" placeholder="plain" />
            <Input variant="soft" placeholder="soft" />
            <Input variant="outline" placeholder="outline" />
            <Input variant="ghost" placeholder="ghost" />
          </div>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it: pick Photo or Vivid in the stage backdrop switcher.",
        code: `import { Input } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Input variant="glass" placeholder="Glass input" />\n  )\n}`,
        render: (
          <Input variant="glass" placeholder="Glass input" />
        )
      },
      {
        title: "Liquid + Matte",
        code: `import { Input } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="space-y-3">\n      <Input variant="liquid" placeholder="Liquid input" />\n      <Input variant="matte" placeholder="Matte input" />\n    </div>\n  )\n}`,
        render: (
          <div className="space-y-3">
            <Input variant="liquid" placeholder="Liquid input" />
            <Input variant="matte" placeholder="Matte input" />
          </div>
        )
      },
      {
        title: "Underline",
        code: `import { Input } from "@glinui/ui"\n\nexport function Demo() {\n  return <Input variant="underline" placeholder="Underline input" />\n}`,
        render: <Input variant="underline" placeholder="Underline input" />
      },
      {
        title: "Filled",
        code: `import { Input } from "@glinui/ui"\n\nexport function Demo() {\n  return <Input variant="filled" placeholder="Filled input" />\n}`,
        render: <Input variant="filled" placeholder="Filled input" />
      },
      {
        title: "Ghost",
        code: `import { Input } from "@glinui/ui"\n\nexport function Demo() {\n  return <Input variant="ghost" placeholder="Ghost input" />\n}`,
        render: <Input variant="ghost" placeholder="Ghost input" />
      },
      {
        title: "Sizes and invalid",
        code: `import { Input } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="grid gap-3 sm:grid-cols-2">\n      <Input size="sm" placeholder="Small, h-8" />\n      <Input size="md" placeholder="Medium, h-9" />\n      <Input size="lg" placeholder="Large, h-10" />\n      <Input aria-invalid placeholder="Invalid" defaultValue="not-an-email" />\n    </div>\n  )\n}`,
        render: (
          <div className="grid gap-3 sm:grid-cols-2">
            <Input size="sm" placeholder="Small, h-8" />
            <Input size="md" placeholder="Medium, h-9" />
            <Input size="lg" placeholder="Large, h-10" />
            <Input aria-invalid placeholder="Invalid" defaultValue="not-an-email" />
          </div>
        )
      }
    ]
  },

  chip: {
    badge: "Primitive / Atom",
    props: [
      { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "ambient (glinr)", description: "Surface variant. Omit to follow the ambient design style (glinr by default, plain for minimal, glass for glass)." },
      { prop: "tone", type: '"neutral" | "info" | "success" | "warning" | "danger"', defaultValue: "neutral", description: "Semantic text color." },
      { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Height and horizontal padding scale." }
    ],
    accessibility: {
      summary: [
        "Non-interactive status label element by default.",
        "Use `aria-label` when chip meaning is not explicit from text."
      ],
      aria: [
        '`role="status"` optional for live status chips'
      ]
    },
    reducedMotion: {
      description: "Chip visual transitions are color-only and disabled with reduced motion.",
      affected: ["background-color", "border-color", "color"]
    },
    examples: [
      {
        title: "Tones",
        code: `import { Chip } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="flex flex-wrap gap-2">\n      <Chip>Neutral</Chip>\n      <Chip tone="info">Info</Chip>\n      <Chip tone="success">Success</Chip>\n      <Chip tone="warning">Warning</Chip>\n      <Chip tone="danger">Danger</Chip>\n    </div>\n  )\n}`,
        render: (
          <div className="flex flex-wrap gap-2">
            <Chip>Neutral</Chip>
            <Chip tone="info">Info</Chip>
            <Chip tone="success">Success</Chip>
            <Chip tone="warning">Warning</Chip>
            <Chip tone="danger">Danger</Chip>
          </div>
        )
      },
      {
        title: "Variants",
        description: "Every vocabulary variant on the default tone. Omit variant to follow the ambient design style.",
        code: `import { Chip } from "@glinui/ui"

export function ChipVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Chip variant="glinr">glinr</Chip>
      <Chip variant="solid">solid</Chip>
      <Chip variant="plain">plain</Chip>
      <Chip variant="soft">soft</Chip>
      <Chip variant="outline">outline</Chip>
      <Chip variant="ghost">ghost</Chip>
      <Chip variant="gradient">gradient</Chip>
    </div>
  )
}`,
        render: (
          <div className="flex flex-wrap items-center gap-3">
            <Chip variant="glinr">glinr</Chip>
            <Chip variant="solid">solid</Chip>
            <Chip variant="plain">plain</Chip>
            <Chip variant="soft">soft</Chip>
            <Chip variant="outline">outline</Chip>
            <Chip variant="ghost">ghost</Chip>
            <Chip variant="gradient">gradient</Chip>
          </div>
        )
      },
      {
        title: "Tones",
        description: "Tone works on every vocabulary variant. Soft faces are tinted with color-mix on the surface tokens.",
        code: `import { Chip } from "@glinui/ui"

export function ChipTonesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Chip variant="soft" tone="neutral">neutral</Chip>
      <Chip variant="soft" tone="accent">accent</Chip>
      <Chip variant="soft" tone="success">success</Chip>
      <Chip variant="soft" tone="warning">warning</Chip>
      <Chip variant="soft" tone="danger">danger</Chip>
      <Chip variant="soft" tone="info">info</Chip>
    </div>
  )
}`,
        render: (
          <div className="flex flex-wrap items-center gap-3">
            <Chip variant="soft" tone="neutral">neutral</Chip>
            <Chip variant="soft" tone="accent">accent</Chip>
            <Chip variant="soft" tone="success">success</Chip>
            <Chip variant="soft" tone="warning">warning</Chip>
            <Chip variant="soft" tone="danger">danger</Chip>
            <Chip variant="soft" tone="info">info</Chip>
          </div>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it. Switch the preview stage to Vivid or Photo to see the frosted surface.",
        code: `import { Chip } from "@glinui/ui"\n\nexport function Demo() {\n  return <Chip variant="glass">Preview</Chip>\n}`,
        render: <Chip variant="glass">Preview</Chip>
      }
    ]
  },

  code: {
    badge: "Primitive / Atom",
    props: [
      { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "gradient" | "glass" | "block"', defaultValue: "ambient (glinr)", description: "Surface variant. Omit to follow the ambient design style (glinr by default, plain for minimal, glass for glass)." },
      { prop: "tone", type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"', defaultValue: "neutral", description: "Colour tone for the vocabulary variants." },
      { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Font-size scale." }
    ],
    accessibility: {
      summary: [
        "Uses semantic `<code>` element for inline code fragments."
      ],
      aria: []
    },
    reducedMotion: {
      description: "No motion-dependent behavior.",
      affected: []
    },
    examples: [
      {
        title: "Inline Code",
        code: `import { Code } from "@glinui/ui"\n\nexport function Demo() {\n  return <Code>pnpm --filter @glinui/docs dev</Code>\n}`,
        render: <Code>pnpm --filter @glinui/docs dev</Code>
      },
      {
        title: "Variants",
        description: "Every vocabulary variant on the default tone. Omit variant to follow the ambient design style.",
        code: `import { Code } from "@glinui/ui"

export function CodeVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Code variant="glinr">glinr</Code>
      <Code variant="solid">solid</Code>
      <Code variant="plain">plain</Code>
      <Code variant="soft">soft</Code>
      <Code variant="outline">outline</Code>
      <Code variant="ghost">ghost</Code>
      <Code variant="gradient">gradient</Code>
    </div>
  )
}`,
        render: (
          <div className="flex flex-wrap items-center gap-3">
            <Code variant="glinr">glinr</Code>
            <Code variant="solid">solid</Code>
            <Code variant="plain">plain</Code>
            <Code variant="soft">soft</Code>
            <Code variant="outline">outline</Code>
            <Code variant="ghost">ghost</Code>
            <Code variant="gradient">gradient</Code>
          </div>
        )
      },
      {
        title: "Variants matrix",
        description: "Every variant by tone (where the component has tones), rendered in the light and dark theme scopes.",
        code: `import { SURFACE_VARIANTS } from "@glinui/ui"\n\n// code across the vocabulary\n{SURFACE_VARIANTS.map((variant) => (\n  <Code key={variant} variant={variant}>pnpm add @glinui/ui</Code>\n))}`,
        render: <CodeFamilyMatrix />
      },
      {
        title: "Variants",
        code: `import { Code } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="flex flex-wrap gap-2">\n      <Code>default</Code>\n      <Code variant="soft">glass</Code>\n      <Code variant="outline">outline</Code>\n      <Code variant="ghost">ghost</Code>\n    </div>\n  )\n}`,
        render: (
          <div className="flex flex-wrap gap-2">
            <Code>default</Code>
            <Code variant="soft">glass</Code>
            <Code variant="outline">outline</Code>
            <Code variant="ghost">ghost</Code>
          </div>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it. Switch the preview stage to Vivid or Photo to see the frosted surface.",
        code: `import { Code } from "@glinui/ui"

export function CodeGlassDemo() {
  return (
    <Code variant="glass">glass</Code>
  )
}`,
        render: (
          <Code variant="glass">glass</Code>
        )
      }
    ]
  },

  counter: {
    badge: "Primitive / Atom",
    props: [
      { prop: "value", type: "number", description: "Current numeric value." },
      { prop: "max", type: "number", defaultValue: "99", description: "Maximum before collapsing into `max+` format." },
      { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "ambient (glinr)", description: "Surface variant. Omit to follow the ambient design style (glinr by default, plain for minimal, glass for glass)." },
      { prop: "tone", type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"', defaultValue: "neutral", description: "Colour tone for the vocabulary variants." },
      { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Counter density." }
    ],
    accessibility: {
      summary: [
        "Use `aria-label` to describe what the count represents."
      ],
      aria: [
        '`aria-live="polite"` for dynamically updating counts'
      ]
    },
    reducedMotion: {
      description: "Counter updates are static by default with no animated value tweening.",
      affected: []
    },
    examples: [
      {
        title: "Basic",
        code: `import { Counter } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="flex items-center gap-2">\n      <Counter value={7} />\n      <Counter variant="soft" value={32} />\n      <Counter variant="outline" value={120} max={99} />\n    </div>\n  )\n}`,
        render: (
          <div className="flex items-center gap-2">
            <Counter value={7} />
            <Counter variant="soft" value={32} />
            <Counter variant="outline" value={120} max={99} />
          </div>
        )
      },
      {
        title: "Variants",
        description: "Every vocabulary variant on the default tone. Omit variant to follow the ambient design style.",
        code: `import { Counter } from "@glinui/ui"

export function CounterVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Counter variant="glinr" value={12} />
      <Counter variant="solid" value={12} />
      <Counter variant="plain" value={12} />
      <Counter variant="soft" value={12} />
      <Counter variant="outline" value={12} />
      <Counter variant="ghost" value={12} />
      <Counter variant="gradient" value={12} />
    </div>
  )
}`,
        render: (
          <div className="flex flex-wrap items-center gap-3">
            <Counter variant="glinr" value={12} />
            <Counter variant="solid" value={12} />
            <Counter variant="plain" value={12} />
            <Counter variant="soft" value={12} />
            <Counter variant="outline" value={12} />
            <Counter variant="ghost" value={12} />
            <Counter variant="gradient" value={12} />
          </div>
        )
      },
      {
        title: "Tones",
        description: "Tone works on every vocabulary variant. Soft faces are tinted with color-mix on the surface tokens.",
        code: `import { Counter } from "@glinui/ui"

export function CounterTonesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Counter variant="soft" tone="neutral" value={12} />
      <Counter variant="soft" tone="accent" value={12} />
      <Counter variant="soft" tone="success" value={12} />
      <Counter variant="soft" tone="warning" value={12} />
      <Counter variant="soft" tone="danger" value={12} />
      <Counter variant="soft" tone="info" value={12} />
    </div>
  )
}`,
        render: (
          <div className="flex flex-wrap items-center gap-3">
            <Counter variant="soft" tone="neutral" value={12} />
            <Counter variant="soft" tone="accent" value={12} />
            <Counter variant="soft" tone="success" value={12} />
            <Counter variant="soft" tone="warning" value={12} />
            <Counter variant="soft" tone="danger" value={12} />
            <Counter variant="soft" tone="info" value={12} />
          </div>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it. Switch the preview stage to Vivid or Photo to see the frosted surface.",
        code: `import { Counter } from "@glinui/ui"

export function CounterGlassDemo() {
  return (
    <Counter variant="glass" value={12} />
  )
}`,
        render: (
          <Counter variant="glass" value={12} />
        )
      }
    ]
  },

  heading: {
    badge: "Primitive / Atom",
    props: [
      { prop: "level", type: "1 | 2 | 3 | 4 | 5 | 6", defaultValue: "2", description: "Semantic heading tag level." },
      { prop: "variant", type: '"default" | "glass" | "outline" | "ghost"', defaultValue: "default", description: "Surface treatment." },
      { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Typographic scale independent of level." }
    ],
    accessibility: {
      summary: [
        "Preserves semantic heading hierarchy with configurable level."
      ],
      aria: []
    },
    reducedMotion: {
      description: "No motion-dependent behavior.",
      affected: []
    },
    examples: [
      {
        title: "Levels",
        code: `import { Heading } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="space-y-2">\n      <Heading level={1} size="lg">Hero heading</Heading>\n      <Heading level={2}>Section heading</Heading>\n      <Heading level={3} size="sm">Subsection heading</Heading>\n    </div>\n  )\n}`,
        render: (
          <div className="space-y-2">
            <Heading level={1} size="lg">Hero heading</Heading>
            <Heading level={2}>Section heading</Heading>
            <Heading level={3} size="sm">Subsection heading</Heading>
          </div>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it. Switch the preview stage to Vivid or Photo to see the frosted surface.",
        code: `import { Heading } from "@glinui/ui"\n\nexport function Demo() {\n  return <Heading variant="glass">Frosted heading</Heading>\n}`,
        render: <Heading variant="glass">Frosted heading</Heading>
      }
    ]
  },

  "hover-card": {
    badge: "Primitive / Molecule",
    props: [
      {
        title: "HoverCardProps",
        rows: [
          { prop: "openDelay", type: "number", defaultValue: "200", description: "Delay in milliseconds before opening on hover/focus." },
          { prop: "closeDelay", type: "number", defaultValue: "100", description: "Delay in milliseconds before closing after pointer leaves." },
          { prop: "open", type: "boolean", description: "Controlled open state." },
          { prop: "defaultOpen", type: "boolean", description: "Initial open state for uncontrolled usage." },
          { prop: "onOpenChange", type: "(open: boolean) => void", description: "Open state change handler." }
        ]
      },
      {
        title: "HoverCardContentProps",
        rows: [
          { prop: "variant", type: '"glinr" | "plain" | "solid" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "ambient style (glinr)", description: "Panel look. Omit it for the ambient design style (glinr shell with a gradient hairline ring). `plain` is the shadcn border and shadow, `glass` is opt-in and needs a backdrop." },
          { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Content width and density scale." },
          { prop: "align", type: '"start" | "center" | "end"', defaultValue: "center", description: "Alignment relative to the trigger." },
          { prop: "side", type: '"top" | "right" | "bottom" | "left"', defaultValue: "bottom", description: "Preferred side for content placement." },
          { prop: "sideOffset", type: "number", defaultValue: "10", description: "Distance from trigger in pixels." }
        ]
      }
    ],
    accessibility: {
      summary: [
        "Built on Radix Hover Card and opens on hover and keyboard focus.",
        "Hover card content should be supplemental; avoid critical-only information.",
        "Use non-interactive preview content for concise summaries."
      ],
      keyboard: [
        { key: "Tab / Shift+Tab", description: "Move focus to or away from the trigger." },
        { key: "Escape", description: "Close the hover card when focused." }
      ],
      aria: [
        "`aria-describedby` linkage is handled by Radix primitives",
        "Trigger remains semantic and keyboard reachable"
      ]
    },
    reducedMotion: {
      description: "Entrance and exit transitions are disabled under `prefers-reduced-motion`.",
      affected: ["opacity", "transform"]
    },
    examples: [
      {
        title: "Basic",
        code: `import { Avatar, HoverCard, HoverCardContent, HoverCardTrigger } from "@glinui/ui"

export function Demo() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="inline-flex items-center gap-2 text-sm font-medium underline decoration-dotted underline-offset-4">
          <Avatar fallback="GL" size="sm" />
          @glinui
        </button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-1">
          <p className="text-sm font-semibold">@glinui</p>
          <p className="text-xs text-neutral-600 dark:text-neutral-300">
            Crisp, themeable component system for modern interfaces.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}`,
        render: (
          <HoverCard>
            <HoverCardTrigger asChild>
              <button className="inline-flex items-center gap-2 text-sm font-medium underline decoration-dotted underline-offset-4">
                <Avatar fallback="GL" size="sm" />
                @glinui
              </button>
            </HoverCardTrigger>
            <StageHoverCardContent>
              <div className="space-y-1">
                <p className="text-sm font-semibold">@glinui</p>
                <p className="text-xs text-neutral-600 dark:text-neutral-300">
                  Crisp, themeable component system for modern interfaces.
                </p>
              </div>
            </StageHoverCardContent>
          </HoverCard>
        )
      },
      {
        title: "Delays and surface",
        code: `import { Badge, HoverCard, HoverCardContent, HoverCardTrigger } from "@glinui/ui"

export function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <HoverCard openDelay={0} closeDelay={150}>
        <HoverCardTrigger asChild>
          <button className="text-sm font-medium underline decoration-dotted underline-offset-4">
            Instant preview
          </button>
        </HoverCardTrigger>
        <HoverCardContent size="sm">
          <div className="space-y-2">
            <Badge>default</Badge>
            <p className="text-xs text-neutral-600 dark:text-neutral-300">Open delay: 0ms</p>
          </div>
        </HoverCardContent>
      </HoverCard>
      <HoverCard openDelay={500} closeDelay={250}>
        <HoverCardTrigger asChild>
          <button className="text-sm font-medium underline decoration-dotted underline-offset-4">
            Delayed preview
          </button>
        </HoverCardTrigger>
        <HoverCardContent variant="plain" size="md">
          <p className="text-xs text-neutral-600 dark:text-neutral-300">
            Opens after 500ms with the plain surface.
          </p>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}`,
        render: (
          <div className="flex flex-wrap items-center gap-4">
            <HoverCard openDelay={0} closeDelay={150}>
              <HoverCardTrigger asChild>
                <button className="text-sm font-medium underline decoration-dotted underline-offset-4">
                  Instant preview
                </button>
              </HoverCardTrigger>
              <StageHoverCardContent size="sm">
                <div className="space-y-2">
                  <Badge>default</Badge>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300">Open delay: 0ms</p>
                </div>
              </StageHoverCardContent>
            </HoverCard>
            <HoverCard openDelay={500} closeDelay={250}>
              <HoverCardTrigger asChild>
                <button className="text-sm font-medium underline decoration-dotted underline-offset-4">
                  Delayed preview
                </button>
              </HoverCardTrigger>
              <StageHoverCardContent variant="plain" size="md">
                <p className="text-xs text-neutral-600 dark:text-neutral-300">
                  Opens after 500ms with the plain surface.
                </p>
              </StageHoverCardContent>
            </HoverCard>
          </div>
        )
      }
    ]
  },

  "icon-frame": {
    badge: "Primitive / Atom",
    props: [
      { prop: "variant", type: 'SurfaceVariant | "default" | "raised"', defaultValue: "ambient (glinr)", description: "Surface treatment. Glass is opt-in." },
      { prop: "tone", type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"', defaultValue: "neutral", description: "Icon and tint color." },
      { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Square frame size." }
    ],
    accessibility: {
      summary: [
        "Use `aria-hidden` when decorative.",
        "Add screen-reader text for meaningful icons."
      ],
      aria: [
        '`aria-hidden="true"` for decorative usage'
      ]
    },
    reducedMotion: {
      description: "Frame transitions are color-only and respect reduced-motion settings.",
      affected: ["background-color", "border-color"]
    },
    examples: [
      {
        title: "Variants",
        description: "The shared vocabulary. Omit `variant` for the ambient style (glinr).",
        code: "import { IconFrame } from \"@glinui/ui\"\n\n<IconFrame variant=\"glinr\" tone=\"accent\"><Bell /></IconFrame>",
        render: <IconFrameVariantsDemo />
      },
      {
        title: "Tones",
        description: "Soft frames in every tone.",
        code: "import { IconFrame } from \"@glinui/ui\"\n\n<IconFrame variant=\"soft\" tone=\"success\"><Bell /></IconFrame>",
        render: <IconFrameTonesDemo />
      }
    ]
  },

  kbd: {
    badge: "Primitive / Atom",
    props: [
      { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "ambient (glinr)", description: "Surface variant. Omit to follow the ambient design style (glinr by default, plain for minimal, glass for glass)." },
      { prop: "tone", type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"', defaultValue: "neutral", description: "Colour tone for the vocabulary variants." },
      { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Keycap size." }
    ],
    accessibility: {
      summary: [
        "Uses semantic `<kbd>` element for keyboard shortcuts."
      ],
      aria: []
    },
    reducedMotion: {
      description: "No motion-dependent behavior.",
      affected: []
    },
    examples: [
      {
        title: "Shortcut",
        code: `import { Kbd } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="flex items-center gap-2 text-sm">\n      <span>Open command palette:</span>\n      <Kbd>cmd</Kbd>\n      <Kbd>K</Kbd>\n    </div>\n  )\n}`,
        render: (
          <div className="flex items-center gap-2 text-sm">
            <span>Open command palette:</span>
            <Kbd>cmd</Kbd>
            <Kbd>K</Kbd>
          </div>
        )
      },
      {
        title: "Variants",
        description: "Every vocabulary variant on the default tone. Omit variant to follow the ambient design style.",
        code: `import { Kbd } from "@glinui/ui"

export function KbdVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Kbd variant="glinr">K</Kbd>
      <Kbd variant="solid">K</Kbd>
      <Kbd variant="plain">K</Kbd>
      <Kbd variant="soft">K</Kbd>
      <Kbd variant="outline">K</Kbd>
      <Kbd variant="ghost">K</Kbd>
      <Kbd variant="gradient">K</Kbd>
    </div>
  )
}`,
        render: (
          <div className="flex flex-wrap items-center gap-3">
            <Kbd variant="glinr">K</Kbd>
            <Kbd variant="solid">K</Kbd>
            <Kbd variant="plain">K</Kbd>
            <Kbd variant="soft">K</Kbd>
            <Kbd variant="outline">K</Kbd>
            <Kbd variant="ghost">K</Kbd>
            <Kbd variant="gradient">K</Kbd>
          </div>
        )
      },
      {
        title: "Tones",
        description: "Tone works on every vocabulary variant. Soft faces are tinted with color-mix on the surface tokens.",
        code: `import { Kbd } from "@glinui/ui"

export function KbdTonesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Kbd variant="soft" tone="neutral">K</Kbd>
      <Kbd variant="soft" tone="accent">K</Kbd>
      <Kbd variant="soft" tone="success">K</Kbd>
      <Kbd variant="soft" tone="warning">K</Kbd>
      <Kbd variant="soft" tone="danger">K</Kbd>
      <Kbd variant="soft" tone="info">K</Kbd>
    </div>
  )
}`,
        render: (
          <div className="flex flex-wrap items-center gap-3">
            <Kbd variant="soft" tone="neutral">K</Kbd>
            <Kbd variant="soft" tone="accent">K</Kbd>
            <Kbd variant="soft" tone="success">K</Kbd>
            <Kbd variant="soft" tone="warning">K</Kbd>
            <Kbd variant="soft" tone="danger">K</Kbd>
            <Kbd variant="soft" tone="info">K</Kbd>
          </div>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it. Switch the preview stage to Vivid or Photo to see the frosted surface.",
        code: `import { Kbd } from "@glinui/ui"

export function KbdGlassDemo() {
  return (
    <Kbd variant="glass">K</Kbd>
  )
}`,
        render: (
          <Kbd variant="glass">K</Kbd>
        )
      }
    ]
  },

  label: {
    badge: "Primitive / Atom",
    props: [
      { prop: "htmlFor", type: "string", description: "Associates label with a form control id." },
      { prop: "variant", type: '"default" | "glinr" | "plain" | "solid" | "soft" | "outline" | "ghost" | "glass"', defaultValue: 'ambient (plain text)', description: 'Plain text by default. solid, soft, outline, ghost and glass render a chip around the label. Glass is opt-in.' },
      { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Font-size scale." }
    ],
    accessibility: {
      summary: [
        "Uses semantic `<label>` for screen reader form-field association."
      ],
      aria: [
        "`htmlFor` should match form control `id`"
      ]
    },
    reducedMotion: {
      description: "No motion-dependent behavior.",
      affected: []
    },
    examples: [
      {
        title: "Field Label",
        code: `import { Input, Label } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="space-y-2">\n      <Label htmlFor="email">Email address</Label>\n      <Input id="email" type="email" placeholder="name@example.com" />\n    </div>\n  )\n}`,
        render: (
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" placeholder="name@example.com" />
          </div>
        )
      },
      {
        title: "Variants",
        description: "Glass is opt-in and needs a backdrop behind it.",
        code: `import { Label } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="flex flex-wrap items-center gap-3">\n      <Label>Default</Label>\n      <Label variant="solid">solid</Label>\n      <Label variant="soft">soft</Label>\n      <Label variant="outline">outline</Label>\n      <Label variant="ghost">ghost</Label>\n      <Label variant="glass">glass</Label>\n    </div>\n  )\n}`,
        render: (
          <div className="flex flex-wrap items-center gap-3">
            <Label>Default</Label>
            <Label variant="solid">solid</Label>
            <Label variant="soft">soft</Label>
            <Label variant="outline">outline</Label>
            <Label variant="ghost">ghost</Label>
            <Label variant="glass">glass</Label>
          </div>
        )
      }
    ]
  },

  link: {
    badge: "Primitive / Atom",
    props: [
      { prop: "href", type: "string", description: "Destination URL." },
      { prop: "variant", type: '"default" | "glass" | "outline" | "ghost"', defaultValue: "default", description: "Surface treatment." },
      { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Text scale." },
      { prop: "underline", type: "boolean", defaultValue: "true", description: "Enable underline decoration." }
    ],
    accessibility: {
      summary: [
        "Uses semantic anchor element with keyboard navigation.",
        "Focus-visible ring is applied for keyboard users."
      ],
      keyboard: [
        { key: "Enter", description: "Open the link destination." }
      ],
      aria: [
        '`role="link"` native',
        "`aria-current` for active navigation states"
      ]
    },
    reducedMotion: {
      description: "Hover/focus styles are color-only and respect reduced motion settings.",
      affected: ["color", "background-color", "border-color"]
    },
    examples: [
      {
        title: "Variants",
        code: `import { Link } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="flex flex-wrap gap-2">\n      <Link href=\"#\">Default</Link>\n      <Link href=\"#\" variant=\"outline\">Outline</Link>\n      <Link href=\"#\" variant=\"ghost\">Ghost</Link>\n    </div>\n  )\n}`,
        render: (
          <div className="flex flex-wrap gap-2">
            <Link href="#">Default</Link>
            <Link href="#" variant="outline">Outline</Link>
            <Link href="#" variant="ghost">Ghost</Link>
          </div>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it. Switch the preview stage to Vivid or Photo to see the frosted surface.",
        code: `import { Link } from "@glinui/ui"

export function LinkGlassDemo() {
  return (
    <Link href="#" variant="glass">Glass link</Link>
  )
}`,
        render: (
          <Link href="#" variant="glass">Glass link</Link>
        )
      }
    ]
  },

  "status-dot": {
    badge: "Primitive / Atom",
    props: [
      { prop: "status", type: '"neutral" | "info" | "success" | "warning" | "danger"', defaultValue: "neutral", description: "Dot color semantic." },
      { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Dot and label size scale." },
      { prop: "pulse", type: "boolean", defaultValue: "false", description: "Enable subtle pulse animation on the indicator." },
      { prop: "label", type: "string", description: "Optional status label text." }
    ],
    accessibility: {
      summary: [
        "Pair status color with text for non-color-only communication.",
        "Optional pulse animation is reduced-motion safe."
      ],
      aria: [
        '`aria-live="polite"` when representing dynamic system state'
      ]
    },
    reducedMotion: {
      description: "Pulse animation uses `motion-safe` and disables with reduced-motion preferences.",
      affected: ["opacity"]
    },
    examples: [
      {
        title: "Status States",
        code: `import { StatusDot } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="space-y-2">\n      <StatusDot status="success" label="Healthy" />\n      <StatusDot status="warning" label="Degraded" />\n      <StatusDot status="danger" label="Down" pulse />\n    </div>\n  )\n}`,
        render: (
          <div className="space-y-2">
            <StatusDot status="success" label="Healthy" />
            <StatusDot status="warning" label="Degraded" />
            <StatusDot status="danger" label="Down" pulse />
          </div>
        )
      }
    ]
  },

  text: {
    badge: "Primitive / Atom",
    props: [
      { prop: "variant", type: '"default" | "muted" | "glass" | "ghost"', defaultValue: "default", description: "Text treatment style." },
      { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Type scale." }
    ],
    accessibility: {
      summary: [
        "Renders semantic paragraph text by default."
      ],
      aria: []
    },
    reducedMotion: {
      description: "No motion-dependent behavior.",
      affected: []
    },
    examples: [
      {
        title: "Styles",
        code: `import { Text } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="space-y-2">\n      <Text>Default body copy.</Text>\n      <Text variant="muted">Muted supporting copy.</Text>\n    </div>\n  )\n}`,
        render: (
          <div className="space-y-2">
            <Text>Default body copy.</Text>
            <Text variant="muted">Muted supporting copy.</Text>
          </div>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it. Switch the preview stage to Vivid or Photo to see the frosted surface.",
        code: `import { Text } from "@glinui/ui"

export function TextGlassDemo() {
  return (
    <Text variant="glass">Glass highlighted note.</Text>
  )
}`,
        render: (
          <Text variant="glass">Glass highlighted note.</Text>
        )
      }
    ]
  },

  textarea: {
    badge: "Primitive / Atom",
    props: [
      { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "glass" | "liquid" | "matte" | "underline" | "filled"', defaultValue: 'ambient (glinr)', description: 'Surface look. Omit to follow the ambient design style. Glass is opt-in.' },
      { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Text size and inner spacing." },
      { prop: "rows", type: "number", defaultValue: "4", description: "Number of visible text lines." },
      { prop: "disabled", type: "boolean", defaultValue: "false", description: "Disables interaction." },
      { prop: "placeholder", type: "string", description: "Placeholder text." }
    ],
    accessibility: {
      summary: [
        "Native `textarea` semantics.",
        "Pair with `<label>` or `aria-label` for screen readers."
      ],
      keyboard: [
        { key: "Tab", description: "Move focus to the textarea." }
      ],
      aria: [
        '`role="textbox"` native',
        "`aria-invalid` for validation"
      ]
    },
    reducedMotion: {
      description: "No animation dependencies.",
      affected: []
    },
    examples: [
      {
        title: "Basic",
        code: `import { Textarea } from "@glinui/ui"\n\nexport function Demo() {\n  return <Textarea placeholder="Share your feedback..." />\n}`,
        render: <Textarea placeholder="Share your feedback..." />
      },
      {
        title: "Custom Rows",
        code: `import { Textarea } from "@glinui/ui"\n\nexport function Demo() {\n  return <Textarea placeholder="Write a longer message..." rows={8} />\n}`,
        render: <Textarea placeholder="Write a longer message..." rows={8} />
      },
      {
        title: "Variants",
        code: `import { Textarea } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="grid gap-3 sm:grid-cols-2">\n      <Textarea variant="glinr" placeholder="glinr" rows={2} />\n      <Textarea variant="solid" placeholder="solid" rows={2} />\n      <Textarea variant="plain" placeholder="plain" rows={2} />\n      <Textarea variant="soft" placeholder="soft" rows={2} />\n      <Textarea variant="outline" placeholder="outline" rows={2} />\n      <Textarea variant="ghost" placeholder="ghost" rows={2} />\n    </div>\n  )\n}`,
        render: (
          <div className="grid gap-3 sm:grid-cols-2">
            <Textarea variant="glinr" placeholder="glinr" rows={2} />
            <Textarea variant="solid" placeholder="solid" rows={2} />
            <Textarea variant="plain" placeholder="plain" rows={2} />
            <Textarea variant="soft" placeholder="soft" rows={2} />
            <Textarea variant="outline" placeholder="outline" rows={2} />
            <Textarea variant="ghost" placeholder="ghost" rows={2} />
          </div>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it: pick Photo or Vivid in the stage backdrop switcher.",
        code: `import { Textarea } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Textarea variant="glass" placeholder="Glass textarea" />\n  )\n}`,
        render: (
          <Textarea variant="glass" placeholder="Glass textarea" />
        )
      },
      {
        title: "Liquid + Matte",
        code: `import { Textarea } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="space-y-3">\n      <Textarea variant="liquid" placeholder="Liquid textarea" />\n      <Textarea variant="matte" placeholder="Matte textarea" />\n    </div>\n  )\n}`,
        render: (
          <div className="space-y-3">
            <Textarea variant="liquid" placeholder="Liquid textarea" />
            <Textarea variant="matte" placeholder="Matte textarea" />
          </div>
        )
      }
    ]
  },

  select: {
    badge: "Primitive / Atom",
    props: [
      { prop: "options", type: "SelectOption[]", description: "Array of { label, value, disabled? }." },
      { prop: "placeholder", type: "string", description: "Disabled placeholder option text." },
      { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "glass" | "liquid" | "matte"', defaultValue: 'ambient (glinr)', description: 'Surface look. Omit to follow the ambient design style. Glass is opt-in.' },
      { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Height scale." },
      { prop: "disabled", type: "boolean", defaultValue: "false", description: "Disables interaction." }
    ],
    accessibility: {
      summary: [
        "Native `select` semantics with keyboard navigation.",
        "Pair with `<label>` or `aria-label`."
      ],
      keyboard: [
        { key: "Enter / Space", description: "Open the select dropdown." },
        { key: "Arrow Up / Down", description: "Navigate options." }
      ],
      aria: [
        '`role="combobox"` native',
        "`aria-expanded`",
        "`aria-selected`"
      ]
    },
    reducedMotion: {
      description: "No animation dependencies.",
      affected: []
    },
    examples: [
      {
        title: "Basic",
        code: `import { Select } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Select\n      placeholder="Pick a framework"\n      options={[\n        { value: "react", label: "React" },\n        { value: "vue", label: "Vue" },\n        { value: "svelte", label: "Svelte" }\n      ]}\n    />\n  )\n}`,
        render: (
          <Select
            placeholder="Pick a framework"
            options={[
              { value: "react", label: "React" },
              { value: "vue", label: "Vue" },
              { value: "svelte", label: "Svelte" }
            ]}
          />
        )
      },
      {
        title: "Sizes",
        code: `import { Select } from "@glinui/ui"\n\nconst opts = [{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }]\n\nexport function Demo() {\n  return (\n    <div className="space-y-3 max-w-xs">\n      <Select size="sm" options={opts} placeholder="Small" />\n      <Select size="md" options={opts} placeholder="Medium" />\n      <Select size="lg" options={opts} placeholder="Large" />\n    </div>\n  )\n}`,
        render: (
          <div className="space-y-3 max-w-xs">
            <Select size="sm" options={[{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }]} placeholder="Small" />
            <Select size="md" options={[{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }]} placeholder="Medium" />
            <Select size="lg" options={[{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }]} placeholder="Large" />
          </div>
        )
      },
      {
        title: "Variants",
        code: `import { Select } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="grid gap-3 sm:grid-cols-2">\n      <Select variant="glinr" options={[{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }]} placeholder="glinr" />\n      <Select variant="solid" options={[{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }]} placeholder="solid" />\n      <Select variant="plain" options={[{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }]} placeholder="plain" />\n      <Select variant="soft" options={[{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }]} placeholder="soft" />\n      <Select variant="outline" options={[{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }]} placeholder="outline" />\n      <Select variant="ghost" options={[{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }]} placeholder="ghost" />\n    </div>\n  )\n}`,
        render: (
          <div className="grid gap-3 sm:grid-cols-2">
            <Select variant="glinr" options={[{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }]} placeholder="glinr" />
            <Select variant="solid" options={[{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }]} placeholder="solid" />
            <Select variant="plain" options={[{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }]} placeholder="plain" />
            <Select variant="soft" options={[{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }]} placeholder="soft" />
            <Select variant="outline" options={[{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }]} placeholder="outline" />
            <Select variant="ghost" options={[{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }]} placeholder="ghost" />
          </div>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it: pick Photo or Vivid in the stage backdrop switcher.",
        code: `import { Select } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Select variant="glass" options={[{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }]} placeholder="Glass" />\n  )\n}`,
        render: (
          <Select variant="glass" options={[{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }]} placeholder="Glass" />
        )
      },
      {
        title: "Liquid + Matte",
        code: `import { Select } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="space-y-3">\n      <Select variant="liquid" options={[{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }]} placeholder="Liquid" />\n      <Select variant="matte" options={[{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }]} placeholder="Matte" />\n    </div>\n  )\n}`,
        render: (
          <div className="space-y-3">
            <Select variant="liquid" options={[{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }]} placeholder="Liquid" />
            <Select variant="matte" options={[{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }]} placeholder="Matte" />
          </div>
        )
      }
    ]
  },

  checkbox: {
    badge: "Primitive / Atom",
    props: [
      { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "glass" | "liquid" | "matte"', defaultValue: 'ambient (glinr)', description: 'Surface look. Omit to follow the ambient design style: glinr is an inset well with a raised accent check, plain is the flat shadcn box. Glass is opt-in.' },
      { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Control size." },
      { prop: "checked", type: "boolean | 'indeterminate'", description: "Controlled checked state." },
      { prop: "defaultChecked", type: "boolean", description: "Initial checked state." },
      { prop: "onCheckedChange", type: "(checked: boolean | 'indeterminate') => void", description: "Change handler." },
      { prop: "disabled", type: "boolean", defaultValue: "false", description: "Disables interaction." }
    ],
    accessibility: {
      summary: [
        "Built on Radix Checkbox with full ARIA support.",
        "Pair with `<label>` via `htmlFor`."
      ],
      keyboard: [
        { key: "Space", description: "Toggle checked state." }
      ],
      aria: [
        '`role="checkbox"`',
        "`aria-checked`",
        "`aria-required`"
      ]
    },
    reducedMotion: {
      description: "Check icon transitions respect `prefers-reduced-motion`.",
      affected: ["transform", "opacity"]
    },
    examples: [
      {
        title: "Basic",
        code: `import { Checkbox } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <label className="flex items-center gap-2 text-sm">\n      <Checkbox />\n      Accept terms and conditions\n    </label>\n  )\n}`,
        render: <CheckboxDemo />
      },
      {
        title: "Disabled",
        code: `import { Checkbox } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <label className="flex items-center gap-2 text-sm opacity-50">\n      <Checkbox disabled />\n      Disabled option\n    </label>\n  )\n}`,
        render: (
          <label className="flex items-center gap-2 text-sm opacity-50">
            <Checkbox disabled />
            Disabled option
          </label>
        )
      },
      {
        title: "Variants and sizes",
        code: `import { Checkbox } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="space-y-3">\n      <div className="flex items-center gap-3">\n        <Checkbox variant="glinr" defaultChecked aria-label="glinr" />\n        <Checkbox variant="solid" defaultChecked aria-label="solid" />\n        <Checkbox variant="plain" defaultChecked aria-label="plain" />\n        <Checkbox variant="soft" defaultChecked aria-label="soft" />\n        <Checkbox variant="outline" defaultChecked aria-label="outline" />\n        <Checkbox variant="ghost" defaultChecked aria-label="ghost" />\n      </div>\n      <div className="flex items-center gap-3">\n        <Checkbox size="sm" defaultChecked aria-label="Small" />\n        <Checkbox size="md" defaultChecked aria-label="Medium" />\n        <Checkbox size="lg" defaultChecked aria-label="Large" />\n        <Checkbox defaultChecked="indeterminate" aria-label="Indeterminate" />\n        <Checkbox aria-invalid aria-label="Invalid" />\n      </div>\n    </div>\n  )\n}`,
        render: (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Checkbox variant="glinr" defaultChecked aria-label="glinr" />
              <Checkbox variant="solid" defaultChecked aria-label="solid" />
              <Checkbox variant="plain" defaultChecked aria-label="plain" />
              <Checkbox variant="soft" defaultChecked aria-label="soft" />
              <Checkbox variant="outline" defaultChecked aria-label="outline" />
              <Checkbox variant="ghost" defaultChecked aria-label="ghost" />
            </div>
            <div className="flex items-center gap-3">
              <Checkbox size="sm" defaultChecked aria-label="Small" />
              <Checkbox size="md" defaultChecked aria-label="Medium" />
              <Checkbox size="lg" defaultChecked aria-label="Large" />
              <Checkbox defaultChecked="indeterminate" aria-label="Indeterminate" />
              <Checkbox aria-invalid aria-label="Invalid" />
            </div>
          </div>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it: pick Photo or Vivid in the stage backdrop switcher.",
        code: `import { Checkbox } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="flex items-center gap-3">\n      <Checkbox variant="glass" defaultChecked aria-label="Glass checked" />\n      <Checkbox variant="glass" aria-label="Glass" />\n    </div>\n  )\n}`,
        render: (
          <div className="flex items-center gap-3">
            <Checkbox variant="glass" defaultChecked aria-label="Glass checked" />
            <Checkbox variant="glass" aria-label="Glass" />
          </div>
        )
      }
    ]
  },

  "radio-group": {
    badge: "Primitive / Atom",
    props: [
      {
        title: "RadioGroupProps",
        rows: [
          { prop: "value", type: "string", description: "Controlled selected value." },
          { prop: "defaultValue", type: "string", description: "Initial selected value for uncontrolled usage." },
          { prop: "onValueChange", type: "(value: string) => void", description: "Change handler." },
          { prop: "orientation", type: '"horizontal" | "vertical"', defaultValue: '"vertical"', description: "Layout direction." },
          { prop: "disabled", type: "boolean", defaultValue: "false", description: "Disables all items." }
        ]
      },
      {
        title: "RadioGroupItemProps",
        rows: [
          { prop: "value", type: "string", description: "Value submitted by the item when selected." },
          { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "glass" | "liquid" | "matte"', defaultValue: 'ambient (glinr)', description: 'Surface look for `RadioGroupItem`. Omit to follow the ambient design style. Glass is opt-in.' },
          { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Control size for `RadioGroupItem`." },
          { prop: "disabled", type: "boolean", defaultValue: "false", description: "Disables this radio item." }
        ]
      }
    ],
    accessibility: {
      summary: [
        "Built on Radix RadioGroup with full ARIA support.",
        "Each item requires a unique `value`."
      ],
      keyboard: [
        { key: "Arrow Up / Down / Left / Right", description: "Navigate between radio items." },
        { key: "Space", description: "Select the focused radio item." }
      ],
      aria: [
        '`role="radiogroup"` on root',
        '`role="radio"` on items',
        "`aria-checked`"
      ]
    },
    reducedMotion: {
      description: "Indicator transitions respect `prefers-reduced-motion`.",
      affected: ["transform", "opacity"]
    },
    examples: [
      {
        title: "Basic",
        code: `import { RadioGroup, RadioGroupItem } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <RadioGroup defaultValue="starter" className="gap-3">\n      <label className="flex items-center gap-2 text-sm">\n        <RadioGroupItem value="starter" /> Starter\n      </label>\n      <label className="flex items-center gap-2 text-sm">\n        <RadioGroupItem value="pro" /> Pro\n      </label>\n      <label className="flex items-center gap-2 text-sm">\n        <RadioGroupItem value="enterprise" /> Enterprise\n      </label>\n    </RadioGroup>\n  )\n}`,
        render: (
          <RadioGroup defaultValue="starter" className="gap-3">
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="starter" /> Starter
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="pro" /> Pro
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="enterprise" /> Enterprise
            </label>
          </RadioGroup>
        )
      },
      {
        title: "Variants and sizes",
        code: `import { RadioGroup, RadioGroupItem } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="space-y-3">\n      <RadioGroup defaultValue="glinr" orientation="horizontal" className="flex items-center gap-3">\n        <RadioGroupItem value="glinr" variant="glinr" aria-label="glinr" />\n        <RadioGroupItem value="solid" variant="solid" aria-label="solid" />\n        <RadioGroupItem value="plain" variant="plain" aria-label="plain" />\n        <RadioGroupItem value="soft" variant="soft" aria-label="soft" />\n        <RadioGroupItem value="outline" variant="outline" aria-label="outline" />\n        <RadioGroupItem value="ghost" variant="ghost" aria-label="ghost" />\n      </RadioGroup>\n      <RadioGroup defaultValue="md" orientation="horizontal" className="flex items-center gap-3">\n        <RadioGroupItem value="sm" size="sm" aria-label="Small" />\n        <RadioGroupItem value="md" size="md" aria-label="Medium" />\n        <RadioGroupItem value="lg" size="lg" aria-label="Large" />\n      </RadioGroup>\n    </div>\n  )\n}`,
        render: (
          <div className="space-y-3">
            <RadioGroup defaultValue="glinr" orientation="horizontal" className="flex items-center gap-3">
              <RadioGroupItem value="glinr" variant="glinr" aria-label="glinr" />
              <RadioGroupItem value="solid" variant="solid" aria-label="solid" />
              <RadioGroupItem value="plain" variant="plain" aria-label="plain" />
              <RadioGroupItem value="soft" variant="soft" aria-label="soft" />
              <RadioGroupItem value="outline" variant="outline" aria-label="outline" />
              <RadioGroupItem value="ghost" variant="ghost" aria-label="ghost" />
            </RadioGroup>
            <RadioGroup defaultValue="md" orientation="horizontal" className="flex items-center gap-3">
              <RadioGroupItem value="sm" size="sm" aria-label="Small" />
              <RadioGroupItem value="md" size="md" aria-label="Medium" />
              <RadioGroupItem value="lg" size="lg" aria-label="Large" />
            </RadioGroup>
          </div>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it: pick Photo or Vivid in the stage backdrop switcher.",
        code: `import { RadioGroup, RadioGroupItem } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <RadioGroup defaultValue="a" orientation="horizontal" className="flex items-center gap-3">\n      <RadioGroupItem value="a" variant="glass" aria-label="A" />\n      <RadioGroupItem value="b" variant="glass" aria-label="B" />\n    </RadioGroup>\n  )\n}`,
        render: (
          <RadioGroup defaultValue="a" orientation="horizontal" className="flex items-center gap-3">
            <RadioGroupItem value="a" variant="glass" aria-label="A" />
            <RadioGroupItem value="b" variant="glass" aria-label="B" />
          </RadioGroup>
        )
      }
    ]
  },

  switch: {
    badge: "Primitive / Atom",
    props: [
      { prop: "checked", type: "boolean", description: "Controlled on/off state." },
      { prop: "defaultChecked", type: "boolean", description: "Initial state." },
      { prop: "onCheckedChange", type: "(checked: boolean) => void", description: "Change handler." },
      { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "glass" | "liquid" | "matte" | "frosted"', defaultValue: 'ambient (glinr)', description: 'Track look. Omit to follow the ambient design style: glinr is an inset well with a raised accent fill, plain is the flat shadcn switch. Glass variants add a frosted track and liquid accent fill (opt-in).' },
      { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "36x20, 44x24 or 52x28 track." },
      { prop: "onIcon / offIcon", type: "ReactNode", description: "Icon inside the thumb for each state, sized to the thumb." },
      { prop: "showLabels", type: "boolean", defaultValue: "false", description: "Show On/Off text inside the track (lg only). Customize with onLabel and offLabel." },
      { prop: "loading", type: "boolean", defaultValue: "false", description: "Shows a spinner in the thumb, makes the switch inert and sets aria-busy." },
      { prop: "label / description", type: "ReactNode", description: "Renders a clickable label row with linked description." },
      { prop: "activeColor", type: "string", description: "Custom checked color, applied as a CSS custom property." },
      { prop: "name / value / required / form", type: "string | boolean", description: "Native form participation." },
      { prop: "disabled", type: "boolean", defaultValue: "false", description: "Disables interaction." }
    ],
    accessibility: {
      summary: [
        "Built on Radix Switch with `role=\"switch\"`.",
        "`label` and `description` wire `htmlFor` and `aria-describedby` for you.",
        "44px minimum hit area; the thumb travels toward the inline end in RTL."
      ],
      keyboard: [
        { key: "Space", description: "Toggle the switch on/off." }
      ],
      aria: [
        '`role="switch"`',
        "`aria-checked`",
        "`aria-busy` while loading"
      ]
    },
    reducedMotion: {
      description: "The thumb slide and stretch are instant under `prefers-reduced-motion` and when `data-glin-motion` is `none` or `subtle`.",
      affected: ["transform"]
    },
    examples: [
      {
        title: "State matrix",
        code: demoCode("switch").matrix,
        render: <PlainStage><StateMatrix kind="switch" /></PlainStage>
      },
      {
        title: "Variants",
        description: "Each variant on and off. Pick a backdrop in the stage to check contrast.",
        code: `import { Switch } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="flex flex-wrap items-center gap-4">\n      <Switch variant="glinr" defaultChecked aria-label="glinr on" />\n      <Switch variant="glinr" aria-label="glinr off" />\n      <Switch variant="solid" defaultChecked aria-label="solid on" />\n      <Switch variant="solid" aria-label="solid off" />\n      <Switch variant="plain" defaultChecked aria-label="plain on" />\n      <Switch variant="plain" aria-label="plain off" />\n      <Switch variant="soft" defaultChecked aria-label="soft on" />\n      <Switch variant="soft" aria-label="soft off" />\n      <Switch variant="outline" defaultChecked aria-label="outline on" />\n      <Switch variant="outline" aria-label="outline off" />\n      <Switch variant="ghost" defaultChecked aria-label="ghost on" />\n      <Switch variant="ghost" aria-label="ghost off" />\n    </div>\n  )\n}`,
        render: (
          <div className="flex flex-wrap items-center gap-4">
            <Switch variant="glinr" defaultChecked aria-label="glinr on" />
            <Switch variant="glinr" aria-label="glinr off" />
            <Switch variant="solid" defaultChecked aria-label="solid on" />
            <Switch variant="solid" aria-label="solid off" />
            <Switch variant="plain" defaultChecked aria-label="plain on" />
            <Switch variant="plain" aria-label="plain off" />
            <Switch variant="soft" defaultChecked aria-label="soft on" />
            <Switch variant="soft" aria-label="soft off" />
            <Switch variant="outline" defaultChecked aria-label="outline on" />
            <Switch variant="outline" aria-label="outline off" />
            <Switch variant="ghost" defaultChecked aria-label="ghost on" />
            <Switch variant="ghost" aria-label="ghost off" />
          </div>
        )
      },
      {
        title: "With icons",
        code: demoCode("switch").icons,
        render: <PlainStage><IconsDemo kind="switch" /></PlainStage>
      },
      {
        title: "With label and description",
        code: demoCode("switch").rows,
        render: <RowsDemo kind="switch" />
      },
      {
        title: "Loading",
        code: demoCode("switch").loading,
        render: <LoadingDemo kind="switch" />
      },
      {
        title: "Glass (opt-in)",
        description: "Glass needs a backdrop: it is shown here on a photo stage.",
        code: `import { Switch } from "@glinui/ui"\n\nexport function Demo() {\n  return <Switch variant="glass" defaultChecked />\n}`,
        render: <PhotoStage><Switch variant="glass" defaultChecked aria-label="Glass" /></PhotoStage>
      },
      {
        title: "Controlled",
        code: demoCode("switch").controlled,
        render: <PlainStage><ControlledDemo kind="switch" /></PlainStage>
      },
      {
        title: "Form",
        code: demoCode("switch").form,
        render: <PlainStage><FormDemo kind="switch" /></PlainStage>
      }
    ]
  },

  accordion: {
    badge: "Primitive / Molecule",
    props: [
      {
        title: "Accordion",
        rows: [
          { prop: "type", type: '"single" | "multiple"', defaultValue: "single", description: "Allow one or multiple open items." },
          { prop: "collapsible", type: "boolean", defaultValue: "false", description: "Allow closing all items when type is single." },
          { prop: "defaultValue", type: "string | string[]", description: "Initially open item value(s)." },
          { prop: "value", type: "string | string[]", description: "Controlled open item value(s)." },
          { prop: "onValueChange", type: "(value: string | string[]) => void", description: "Open state change handler." }
        ]
      },
      {
        title: "AccordionItem",
        rows: [
          { prop: "value", type: "string", description: "Unique identifier for the item." },
          { prop: "variant", type: '"default" | "glass" | "outline" | "ghost" | "separated"', defaultValue: "default", description: "Visual treatment." },
          { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Density scale." },
          { prop: "disabled", type: "boolean", defaultValue: "false", description: "Prevents interaction." }
        ]
      },
      {
        title: "AccordionTrigger",
        rows: [
          { prop: "variant", type: '"default" | "glass" | "outline" | "ghost" | "separated"', defaultValue: "default", description: "Visual treatment." },
          { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Density scale." }
        ]
      },
      {
        title: "AccordionContent",
        rows: [
          { prop: "variant", type: '"default" | "glass" | "outline" | "ghost" | "separated"', defaultValue: "default", description: "Visual treatment." },
          { prop: "contentSize", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Content area density scale." }
        ]
      }
    ],
    accessibility: {
      summary: [
        "Built on Radix Accordion with full WAI-ARIA.",
        "Content regions are associated via `aria-controls`."
      ],
      keyboard: [
        { key: "Enter / Space", description: "Toggle the focused item open/closed." },
        { key: "Arrow Up", description: "Move focus to the previous trigger." },
        { key: "Arrow Down", description: "Move focus to the next trigger." }
      ],
      aria: [
        '`role="region"` on content',
        "`aria-expanded` on trigger",
        "`aria-controls` linking trigger to content"
      ]
    },
    reducedMotion: {
      description: "Open/close height transitions respect `prefers-reduced-motion`.",
      affected: ["height"]
    },
    examples: [
      {
        title: "Default",
        description: "glinr renders the list as one lifted shell with hairline dividers and a rotating caret.",
        code: "import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from \"@glinui/ui\"\n\n<Accordion type=\"single\" collapsible defaultValue=\"item-0\">\n  <AccordionItem value=\"item-0\">\n    <AccordionTrigger>Can I use it without Tailwind?</AccordionTrigger>\n    <AccordionContent>Add the preset once.</AccordionContent>\n  </AccordionItem>\n</Accordion>",
        render: <AccordionHero />
      },
      {
        title: "Variants",
        description: "glinr, plain (shadcn borders), solid, soft, outline and glass (opt-in).",
        code: "import { Accordion } from \"@glinui/ui\"\n\n<Accordion variant=\"plain\" type=\"single\" collapsible>...</Accordion>",
        render: <AccordionVariantsDemo />
      },
      {
        title: "In a layout",
        description: "A help-center section with the FAQ beside a heading.",
        code: "import { Accordion } from \"@glinui/ui\"\n\n<section className=\"grid gap-6 md:grid-cols-[1fr_1.4fr]\">\n  <div>...</div>\n  <Accordion type=\"single\" collapsible>...</Accordion>\n</section>",
        render: <AccordionLayout />
      }
    ]
  },

  alert: {
    badge: "Primitive / Molecule",
    props: [
      {
        title: "Alert",
        rows: [
          { prop: "variant", type: 'SurfaceVariant | "default" | "destructive" | "success" | "warning" | "info" | "liquid" | "matte" | "glow" | "note" | "flag"', defaultValue: "ambient (glinr)", description: "Surface look. Omitted follows the ambient design style. Glass is opt-in." },
          { prop: "tone", type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"', defaultValue: "neutral", description: "Accent bar, tint and icon color." },
          { prop: "icon", type: "boolean | ReactNode", description: "true renders the tone icon, a node renders a custom icon, false hides it. A non-neutral tone shows its icon by default." },
          { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Padding density." },
          { prop: "role", type: "string", defaultValue: "alert", description: "ARIA role." }
        ]
      },
      {
        title: "AlertTitle",
        rows: [
          { prop: "className", type: "string", description: "Additional class names." }
        ]
      },
      {
        title: "AlertDescription",
        rows: [
          { prop: "className", type: "string", description: "Additional class names." }
        ]
      }
    ],
    accessibility: {
      summary: [
        "Uses `role=\"alert\"` by default.",
        "Keep alert text concise and actionable.",
        "Prefer one alert per context region."
      ],
      aria: [
        '`role="alert"` native',
        '`aria-live="assertive"`'
      ]
    },
    reducedMotion: {
      description: "Alert is static and does not rely on animation.",
      affected: []
    },
    examples: [
      {
        title: "Default",
        description: "Tones come with an icon, a left accent bar and a tinted glinr face.",
        code: "import { Alert, AlertDescription, AlertTitle } from \"@glinui/ui\"\n\n<Alert tone=\"warning\">\n  <AlertTitle>Almost out of quota</AlertTitle>\n  <AlertDescription>You have used 92 percent of this month's builds.</AlertDescription>\n</Alert>",
        render: <AlertHero />
      },
      {
        title: "Variants",
        description: "glinr is the default. plain is flat shadcn. glass is opt-in and needs a backdrop.",
        code: "import { Alert } from \"@glinui/ui\"\n\n<Alert variant=\"glinr\" tone=\"accent\" icon />\n<Alert variant=\"plain\" tone=\"accent\" icon />\n<Alert variant=\"solid\" tone=\"accent\" icon />\n<Alert variant=\"soft\" tone=\"accent\" icon />\n<Alert variant=\"glass\" tone=\"accent\" icon />",
        render: <AlertVariantsDemo />
      },
      {
        title: "Tones and quiet looks",
        description: "neutral, accent, success, warning, danger and info, plus the `note` and `flag` looks.",
        code: "import { Alert } from \"@glinui/ui\"\n\n<Alert tone=\"success\" icon>...</Alert>\n<Alert variant=\"note\">...</Alert>\n<Alert variant=\"flag\">...</Alert>",
        render: <AlertTonesDemo />
      },
      {
        title: "In a layout",
        description: "A billing warning above a pricing card.",
        code: "import { Alert, Card } from \"@glinui/ui\"\n\n<section className=\"flex flex-col gap-4\">\n  <Alert tone=\"warning\">...</Alert>\n  <Card>...</Card>\n</section>",
        render: <AlertLayout />
      }
    ]
  },

  "alert-dialog": {
    badge: "Primitive / Molecule",
    props: [
      {
        title: "AlertDialog",
        rows: [
          { prop: "open", type: "boolean", description: "Controlled open state." },
          { prop: "defaultOpen", type: "boolean", description: "Initial open state for uncontrolled usage." },
          { prop: "onOpenChange", type: "(open: boolean) => void", description: "Open state change handler." }
        ]
      },
      {
        title: "AlertDialogTrigger",
        rows: [{ prop: "asChild", type: "boolean", defaultValue: "false", description: "Render trigger as child element." }]
      },
      {
        title: "AlertDialogContentProps",
        rows: [
          { prop: "variant", type: '"glinr" | "plain" | "solid" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "ambient style (glinr)", description: "Panel look. Omit it for the ambient design style: glinr shell, raised header and footer strips. `plain` is the shadcn border and shadow, `glass` is opt-in and needs a backdrop. Legacy `default` follows the ambient style, `matte` maps to `solid`, `frosted` to `glass`." },
          { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Content width and density scale." }
        ]
      },
      {
        title: "AlertDialogActionProps",
        rows: [
          { prop: "variant", type: '"default" | "destructive" | "glass" | "matte"', defaultValue: "default", description: "Visual treatment for the confirm action. `default` is the neutral solid button, `destructive` uses the danger tone." }
        ]
      },
      {
        title: "AlertDialogCancel",
        rows: [{ prop: "asChild", type: "boolean", defaultValue: "false", description: "Render cancel action as child element." }]
      }
    ],
    accessibility: {
      summary: [
        "Built on Radix Alert Dialog with focus trap and screen reader semantics.",
        "Use a clear, explicit `AlertDialogTitle` and concise `AlertDialogDescription` for destructive actions.",
        "Focus returns to the trigger after close."
      ],
      keyboard: [
        { key: "Escape", description: "Close the alert dialog." },
        { key: "Tab / Shift+Tab", description: "Cycle focus between actions." },
        { key: "Enter / Space", description: "Activate focused action." }
      ],
      aria: [
        '`role="alertdialog"`',
        "`aria-labelledby`",
        "`aria-describedby`"
      ]
    },
    reducedMotion: {
      description: "Overlay and panel transitions respect `prefers-reduced-motion` and reduce to instant state changes.",
      affected: ["opacity", "transform"]
    },
    examples: [
      {
        title: "Basic Confirmation",
        code: `import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button
} from "@glinui/ui"

export function Demo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Delete project</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone and will permanently remove all project data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}`,
        render: (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>Delete project</Button>
            </AlertDialogTrigger>
            <StageAlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete project?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone and will permanently remove all project data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </StageAlertDialogContent>
          </AlertDialog>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a colourful or photographic backdrop to read as frosted. Pick one in the stage header.",
        code: `import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button
} from "@glinui/ui"

export function Demo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Archive workspace</Button>
      </AlertDialogTrigger>
      <AlertDialogContent variant="glass" size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Archive workspace?</AlertDialogTitle>
          <AlertDialogDescription>
            Members will lose write access until you restore the workspace.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Not now</AlertDialogCancel>
          <AlertDialogAction variant="glass">Archive</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}`,
        render: (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Archive workspace</Button>
            </AlertDialogTrigger>
            <StageAlertDialogContent variant="glass" size="sm">
              <AlertDialogHeader>
                <AlertDialogTitle>Archive workspace?</AlertDialogTitle>
                <AlertDialogDescription>
                  Members will lose write access until you restore the workspace.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Not now</AlertDialogCancel>
                <AlertDialogAction variant="glass">Archive</AlertDialogAction>
              </AlertDialogFooter>
            </StageAlertDialogContent>
          </AlertDialog>
        )
      }
    ]
  },

  avatar: {
    badge: "Primitive / Atom",
    props: [
      { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "gradient" | "glass" | "liquid" | "matte" | "glow"', defaultValue: "ambient (glinr)", description: "Surface variant. Omit to follow the ambient design style (glinr by default, plain for minimal, glass for glass)." },
      { prop: "tone", type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"', defaultValue: "neutral", description: "Colour tone for the vocabulary variants." },
      { prop: "size", type: '"xs" | "sm" | "md" | "lg" | "xl" | "2xl"', defaultValue: "md", description: "Dimensions: xs=24px, sm=32px, md=40px, lg=48px, xl=56px, 2xl=80px." },
      { prop: "radius", type: '"full" | "lg" | "md" | "square"', defaultValue: "full", description: "Corner radius style." },
      { prop: "src", type: "string", description: "Image URL." },
      { prop: "alt", type: "string", description: "Alt text; first char used as fallback." },
      { prop: "fallback", type: "string", description: "Explicit fallback text (overrides alt)." },
      { prop: "status", type: '"online" | "offline" | "busy" | "away"', description: "Status indicator dot." },
      { prop: "ring", type: "boolean", defaultValue: "false", description: "Add ring for grouped/emphasized avatars." }
    ],
    accessibility: {
      summary: [
        "Image alt text provided via `alt` prop.",
        "Fallback text rendered when image fails to load.",
        "Status indicators include `aria-label` for screen readers."
      ],
      aria: [
        '`role="img"` on image',
        "`aria-label` on status dot"
      ]
    },
    reducedMotion: {
      description: "Hover transitions respect `prefers-reduced-motion`.",
      affected: ["transform", "box-shadow"]
    },
    examples: [
      {
        title: "Default",
        description: "The default look follows the ambient design style: glinr unless a provider says otherwise.",
        code: `import { Avatar } from "@glinui/ui"

export function AvatarDemo() {
  return (
    <Avatar fallback="GL" />
  )
}`,
        render: (
          <Avatar fallback="GL" />
        )
      },
      {
        title: "Variants",
        description: "Every vocabulary variant on the default tone. Omit variant to follow the ambient design style.",
        code: `import { Avatar } from "@glinui/ui"

export function AvatarVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Avatar variant="glinr" fallback="GL" />
      <Avatar variant="solid" fallback="GL" />
      <Avatar variant="plain" fallback="GL" />
      <Avatar variant="soft" fallback="GL" />
      <Avatar variant="outline" fallback="GL" />
      <Avatar variant="ghost" fallback="GL" />
      <Avatar variant="gradient" fallback="GL" />
    </div>
  )
}`,
        render: (
          <div className="flex flex-wrap items-center gap-3">
            <Avatar variant="glinr" fallback="GL" />
            <Avatar variant="solid" fallback="GL" />
            <Avatar variant="plain" fallback="GL" />
            <Avatar variant="soft" fallback="GL" />
            <Avatar variant="outline" fallback="GL" />
            <Avatar variant="ghost" fallback="GL" />
            <Avatar variant="gradient" fallback="GL" />
          </div>
        )
      },
      {
        title: "Status & Group",
        code: `import { Avatar, AvatarGroup } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="space-y-4">\n      <div className="flex gap-4">\n        <Avatar fallback="ON" variant="soft" status="online" />\n        <Avatar fallback="AW" variant="soft" status="away" />\n        <Avatar fallback="BS" variant="soft" status="busy" />\n      </div>\n      <AvatarGroup max={3}>\n        <Avatar fallback="A" />\n        <Avatar fallback="B" />\n        <Avatar fallback="C" />\n        <Avatar fallback="D" />\n      </AvatarGroup>\n    </div>\n  )\n}`,
        render: (
          <div className="space-y-4">
            <div className="flex gap-4">
              <Avatar fallback="ON" variant="soft" status="online" />
              <Avatar fallback="AW" variant="soft" status="away" />
              <Avatar fallback="BS" variant="soft" status="busy" />
            </div>
            <AvatarGroup max={3}>
              <Avatar fallback="A" />
              <Avatar fallback="B" />
              <Avatar fallback="C" />
              <Avatar fallback="D" />
            </AvatarGroup>
          </div>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it. Switch the preview stage to Vivid or Photo to see the frosted surface.",
        code: `import { Avatar } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="flex items-center gap-4">\n      <Avatar fallback="DF" variant="default" />\n      <Avatar fallback="GL" variant="glass" />\n      <Avatar fallback="LQ" variant="liquid" />\n      <Avatar fallback="MT" variant="matte" />\n      <Avatar fallback="GW" variant="glow" />\n    </div>\n  )\n}`,
        render: (
          <div className="flex items-center gap-4">
            <Avatar fallback="DF" variant="default" />
            <Avatar fallback="GL" variant="glass" />
            <Avatar fallback="LQ" variant="liquid" />
            <Avatar fallback="MT" variant="matte" />
            <Avatar fallback="GW" variant="glow" />
          </div>
        )
      }
    ]
  },

  badge: {
    badge: "Primitive / Atom",
    props: [
      { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "gradient" | "glass" | "liquid" | "matte" | "glow"', defaultValue: "ambient (glinr)", description: "Surface variant. Omit to follow the ambient design style (glinr by default, plain for minimal, glass for glass)." },
      { prop: "tone", type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"', defaultValue: "neutral", description: "Colour tone for the vocabulary variants." },
      { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Height scale (h-5/h-6/h-7)." }
    ],
    accessibility: {
      summary: [
        "Renders as `<span>` -- decorative by default.",
        "Add `role=\"status\"` if badge conveys live state."
      ],
      aria: [
        "Decorative by default",
        'Add `role="status"` for live state badges'
      ]
    },
    reducedMotion: {
      description: "No animation dependencies.",
      affected: []
    },
    examples: [
      {
        title: "Default",
        description: "The default look follows the ambient design style: glinr unless a provider says otherwise.",
        code: `import { Badge } from "@glinui/ui"

export function BadgeDemo() {
  return (
    <Badge>Badge</Badge>
  )
}`,
        render: (
          <Badge>Badge</Badge>
        )
      },
      {
        title: "Variants",
        description: "Every vocabulary variant on the default tone. Omit variant to follow the ambient design style.",
        code: `import { Badge } from "@glinui/ui"

export function BadgeVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="glinr">glinr</Badge>
      <Badge variant="solid">solid</Badge>
      <Badge variant="plain">plain</Badge>
      <Badge variant="soft">soft</Badge>
      <Badge variant="outline">outline</Badge>
      <Badge variant="ghost">ghost</Badge>
      <Badge variant="gradient">gradient</Badge>
    </div>
  )
}`,
        render: (
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="glinr">glinr</Badge>
            <Badge variant="solid">solid</Badge>
            <Badge variant="plain">plain</Badge>
            <Badge variant="soft">soft</Badge>
            <Badge variant="outline">outline</Badge>
            <Badge variant="ghost">ghost</Badge>
            <Badge variant="gradient">gradient</Badge>
          </div>
        )
      },
      {
        title: "Variants matrix",
        description: "Every variant by tone (where the component has tones), rendered in the light and dark theme scopes.",
        code: `import { SURFACE_VARIANTS } from "@glinui/ui"\n\n// badge across the vocabulary\n{SURFACE_VARIANTS.map((variant) => (\n  <Badge key={variant} variant={variant}>{variant}</Badge>\n))}`,
        render: <BadgeFamilyMatrix />
      },
      {
        title: "Tones",
        description: "Tone works on every vocabulary variant. Soft faces are tinted with color-mix on the surface tokens.",
        code: `import { Badge } from "@glinui/ui"

export function BadgeTonesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="soft" tone="neutral">neutral</Badge>
      <Badge variant="soft" tone="accent">accent</Badge>
      <Badge variant="soft" tone="success">success</Badge>
      <Badge variant="soft" tone="warning">warning</Badge>
      <Badge variant="soft" tone="danger">danger</Badge>
      <Badge variant="soft" tone="info">info</Badge>
    </div>
  )
}`,
        render: (
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="soft" tone="neutral">neutral</Badge>
            <Badge variant="soft" tone="accent">accent</Badge>
            <Badge variant="soft" tone="success">success</Badge>
            <Badge variant="soft" tone="warning">warning</Badge>
            <Badge variant="soft" tone="danger">danger</Badge>
            <Badge variant="soft" tone="info">info</Badge>
          </div>
        )
      },
      {
        title: "Semantic Variants",
        code: `import { Badge } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="flex flex-wrap gap-2">\n      <Badge variant="success">Success</Badge>\n      <Badge variant="warning">Warning</Badge>\n      <Badge variant="destructive">Error</Badge>\n      <Badge variant="info">Info</Badge>\n    </div>\n  )\n}`,
        render: (
          <div className="flex flex-wrap gap-2">
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="destructive">Error</Badge>
            <Badge variant="info">Info</Badge>
          </div>
        )
      },
      {
        title: "Minimal & Sizes",
        code: `import { Badge } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="flex flex-wrap items-end gap-2">\n      <Badge variant="outline">Outline</Badge>\n      <Badge variant="ghost">Ghost</Badge>\n      <Badge size="sm">Small</Badge>\n      <Badge size="md">Medium</Badge>\n      <Badge size="lg">Large</Badge>\n    </div>\n  )\n}`,
        render: (
          <div className="flex flex-wrap items-end gap-2">
            <Badge variant="outline">Outline</Badge>
            <Badge variant="ghost">Ghost</Badge>
            <Badge size="sm">Small</Badge>
            <Badge size="md">Medium</Badge>
            <Badge size="lg">Large</Badge>
          </div>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it. Switch the preview stage to Vivid or Photo to see the frosted surface.",
        code: `import { Badge } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="flex flex-wrap gap-2">\n      <Badge>Default</Badge>\n      <Badge variant="glass">Glass</Badge>\n      <Badge variant="liquid">Liquid</Badge>\n      <Badge variant="matte">Matte</Badge>\n      <Badge variant="glow">Glow</Badge>\n    </div>\n  )\n}`,
        render: (
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="glass">Glass</Badge>
            <Badge variant="liquid">Liquid</Badge>
            <Badge variant="matte">Matte</Badge>
            <Badge variant="glow">Glow</Badge>
          </div>
        )
      }
    ]
  },

  card: {
    badge: "Primitive / Molecule",
    props: [
      {
        title: "CardProps",
        rows: [
          { prop: "variant", type: 'SurfaceVariant | "default" | "elevated" | "interactive" | "frosted" | "liquid" | "matte" | "lift"', defaultValue: "ambient (glinr)", description: "Surface look. Omitted follows the ambient design style: glinr, plain or glass. Glass is opt-in." },
          { prop: "tone", type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"', defaultValue: "neutral", description: "Tone for soft, outline, ghost, gradient and glass." },
          { prop: "interactive", type: "boolean", defaultValue: "false", description: "Hover lift and pointer cursor." },
          { prop: "inset", type: "boolean", defaultValue: "false", description: "Recessed well instead of a raised surface." },
          { prop: "elevation / face / ring", type: "1 | 2 | 3 / 0 | 1 | 2 / default | hot | brand", description: "Tune the glinr and solid looks." },
          { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Padding density (p-4/p-6/p-8)." }
        ]
      },
      {
        title: "CardHeaderProps",
        rows: [
          { prop: "className", type: "string", description: "Additional class names." }
        ]
      },
      {
        title: "CardTitleProps",
        rows: [
          { prop: "className", type: "string", description: "Additional class names." }
        ]
      },
      {
        title: "CardDescriptionProps",
        rows: [
          { prop: "className", type: "string", description: "Additional class names." }
        ]
      },
      {
        title: "CardContentProps",
        rows: [
          { prop: "className", type: "string", description: "Additional class names." }
        ]
      },
      {
        title: "CardFooterProps",
        rows: [
          { prop: "className", type: "string", description: "Additional class names." }
        ]
      }
    ],
    accessibility: {
      summary: [
        "Semantic `<div>` containers.",
        "Use `CardTitle` for heading hierarchy.",
        "Add landmark roles if card represents a section."
      ],
      aria: [
        "Semantic divs",
        "Heading hierarchy via CardTitle"
      ]
    },
    reducedMotion: {
      description: "No animation dependencies.",
      affected: []
    },
    examples: [
      {
        title: "Default",
        description: "Omit `variant` and the card follows the ambient style: the glinr lift look (gradient hairline ring, tonal face) with no extra props.",
        code: "import { Button, Badge, Card } from \"@glinui/ui\"\n\nexport function Demo() {\n  return (\n    <Card>\n      <PricingBody />\n    </Card>\n  )\n}",
        render: <CardHero />
      },
      {
        title: "Variants",
        description: "The full vocabulary across tones in both theme scopes. glinr is the default, plain is the flat shadcn card, solid is a neutral tonal face, glass is opt-in.",
        code: "import { Card } from \"@glinui/ui\"\n\n<Card variant=\"glinr\" />\n<Card variant=\"plain\" />\n<Card variant=\"solid\" />\n<Card variant=\"soft\" tone=\"accent\" />\n<Card variant=\"outline\" />\n<Card variant=\"ghost\" />\n<Card variant=\"gradient\" />\n<Card variant=\"glass\" />",
        render: <CardVariantsMatrix />
      },
      {
        title: "Glass on a backdrop",
        description: "Four surfaces over a vivid backdrop. Glass needs a backdrop to read as glass.",
        code: "import { Card } from \"@glinui/ui\"\n\n<Card variant=\"glinr\" />\n<Card variant=\"plain\" />\n<Card variant=\"solid\" />\n<Card variant=\"glass\" />",
        render: <CardOnPhoto />
      },
      {
        title: "Header and well",
        description: "`CardHeader variant=\"strip\"` is a raised strip that bleeds to the card edges. `CardContent inset` is a recessed well with the concentric inner radius.",
        code: "import { Badge, Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from \"@glinui/ui\"\n\nexport function Demo() {\n  return (\n    <Card>\n      <CardHeader variant=\"strip\" className=\"flex items-center justify-between\">\n        <CardTitle>deploy.log</CardTitle>\n        <Badge tone=\"success\" variant=\"soft\" dot>Passing</Badge>\n      </CardHeader>\n      <CardContent inset className=\"font-mono\">$ pnpm build</CardContent>\n      <CardFooter><Button size=\"sm\">Redeploy</Button></CardFooter>\n    </Card>\n  )\n}",
        render: <CardHeaderWell />
      },
      {
        title: "Interactive",
        description: "`interactive` adds a hover lift and a pointer cursor. Make the card focusable and keyboard-operable yourself when it acts as a control.",
        code: "import { Card } from \"@glinui/ui\"\n\n<Card interactive tabIndex={0}>...</Card>",
        render: <CardInteractive />
      },
      {
        title: "In a layout",
        description: "A metrics card next to a soft accent upsell card.",
        code: "import { Card } from \"@glinui/ui\"\n\n<section className=\"grid gap-4 sm:grid-cols-3\">\n  <Card className=\"sm:col-span-2\">...</Card>\n  <Card variant=\"soft\" tone=\"accent\">...</Card>\n</section>",
        render: <CardLayout />
      }
    ]
  },

  command: {
    badge: "Primitive / Molecule",
    props: [
      {
        title: "Command",
        rows: [
          { prop: "children", type: "ReactNode", description: "CommandInput, CommandList, etc." },
          { prop: "variant", type: '"default" | "glass" | "outline" | "ghost" | "liquid" | "matte"', defaultValue: "default", description: "Surface style for the command root." },
          { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Density scale for input and item rows." },
          { prop: "className", type: "string", description: "Additional class names." },
          { prop: "filter", type: "(value: string, search: string) => number", description: "Custom filter function." },
          { prop: "shouldFilter", type: "boolean", defaultValue: "true", description: "Enable built-in filtering." }
        ]
      },
      {
        title: "CommandInput",
        rows: [
          { prop: "placeholder", type: "string", description: "Placeholder text for the search input." },
          { prop: "className", type: "string", description: "Additional class names." }
        ]
      },
      {
        title: "CommandList",
        rows: [
          { prop: "className", type: "string", description: "Additional class names." }
        ]
      },
      {
        title: "CommandGroup",
        rows: [
          { prop: "heading", type: "string", description: "Group heading label." },
          { prop: "className", type: "string", description: "Additional class names." }
        ]
      },
      {
        title: "CommandItem",
        rows: [
          { prop: "value", type: "string", description: "Value used for filtering and selection." },
          { prop: "onSelect", type: "(value: string) => void", description: "Called when item is selected." },
          { prop: "disabled", type: "boolean", defaultValue: "false", description: "Prevents interaction." }
        ]
      },
      {
        title: "CommandShortcut",
        rows: [
          { prop: "className", type: "string", description: "Additional class names." }
        ]
      }
    ],
    accessibility: {
      summary: [
        "Built on cmdk with keyboard-first navigation.",
        "Input auto-focuses for immediate search."
      ],
      keyboard: [
        { key: "Arrow Up / Down", description: "Navigate between items." },
        { key: "Enter", description: "Select the highlighted item." },
        { key: "Escape", description: "Close the command palette." }
      ],
      aria: [
        '`role="listbox"` on list',
        '`role="option"` on items',
        "`aria-selected`"
      ]
    },
    reducedMotion: {
      description: "List transitions respect `prefers-reduced-motion`.",
      affected: ["opacity", "transform"]
    },
    examples: [
      {
        title: "Basic",
        code: `import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Command className="max-w-md">\n      <CommandInput placeholder="Type a command..." />\n      <CommandList>\n        <CommandEmpty>No results.</CommandEmpty>\n        <CommandGroup heading="Suggestions">\n          <CommandItem>Calendar<CommandShortcut>\u2318K</CommandShortcut></CommandItem>\n          <CommandItem>Search<CommandShortcut>\u2318S</CommandShortcut></CommandItem>\n          <CommandItem>Settings</CommandItem>\n        </CommandGroup>\n      </CommandList>\n    </Command>\n  )\n}`,
        render: (
          <Command className="max-w-md">
            <CommandInput placeholder="Type a command..." />
            <CommandList>
              <CommandEmpty>No results.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem>Calendar<CommandShortcut>⌘K</CommandShortcut></CommandItem>
                <CommandItem>Search<CommandShortcut>⌘S</CommandShortcut></CommandItem>
                <CommandItem>Settings</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        )
      }
    ]
  },

  "dropdown-menu": {
    badge: "Primitive / Molecule",
    props: [
      {
        title: "DropdownMenu",
        rows: [
          { prop: "open", type: "boolean", description: "Controlled open state." },
          { prop: "defaultOpen", type: "boolean", description: "Initial open state." },
          { prop: "onOpenChange", type: "(open: boolean) => void", description: "Open state change handler." },
          { prop: "modal", type: "boolean", defaultValue: "true", description: "Trap focus within the menu." }
        ]
      },
      {
        title: "DropdownMenuTrigger",
        rows: [
          { prop: "variant", type: '"default" | "glass" | "outline" | "ghost"', defaultValue: "default", description: "Visual treatment." },
          { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Density scale." },
          { prop: "asChild", type: "boolean", defaultValue: "false", description: "Render as child element." }
        ]
      },
      {
        title: "DropdownMenuContent",
        rows: [
          { prop: "variant", type: '"glinr" | "plain" | "solid" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "ambient style (glinr)", description: "Panel look. Omit it for the ambient design style (glinr shell, raised pill for the highlighted item). `plain` is the shadcn border and shadow, `glass` is opt-in and needs a backdrop. Legacy `default` follows the ambient style." },
          { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Density scale." },
          { prop: "sideOffset", type: "number", defaultValue: "4", description: "Distance from trigger in pixels." },
          { prop: "align", type: '"start" | "center" | "end"', defaultValue: "center", description: "Alignment relative to trigger." }
        ]
      },
      {
        title: "DropdownMenuItem",
        rows: [
          { prop: "variant", type: '"default" | "glass" | "outline" | "ghost"', defaultValue: "default", description: "Accepted for backwards compatibility. Items follow the look of their panel." },
          { prop: "inset", type: "boolean", defaultValue: "false", description: "Adds left padding for icon alignment." },
          { prop: "disabled", type: "boolean", defaultValue: "false", description: "Prevents interaction." }
        ]
      },
      {
        title: "DropdownMenuLabel",
        rows: [
          { prop: "inset", type: "boolean", defaultValue: "false", description: "Adds left padding for icon alignment." }
        ]
      }
    ],
    accessibility: {
      summary: [
        "Built on Radix DropdownMenu with full WAI-ARIA.",
        "Focus is trapped within the menu when open."
      ],
      keyboard: [
        { key: "Enter / Space", description: "Open the menu or select an item." },
        { key: "Arrow Up / Down", description: "Navigate between menu items." },
        { key: "Arrow Right", description: "Open a submenu." },
        { key: "Arrow Left", description: "Close a submenu." },
        { key: "Escape", description: "Close the menu." }
      ],
      aria: [
        '`role="menu"`',
        '`role="menuitem"`',
        "`aria-expanded`",
        "`aria-haspopup`"
      ]
    },
    reducedMotion: {
      description: "Open/close transitions respect `prefers-reduced-motion`.",
      affected: ["opacity", "transform"]
    },
    examples: [
      {
        title: "Basic",
        code: `import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <DropdownMenu>\n      <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>\n      <DropdownMenuContent>\n        <DropdownMenuLabel>My Account</DropdownMenuLabel>\n        <DropdownMenuSeparator />\n        <DropdownMenuItem>Profile</DropdownMenuItem>\n        <DropdownMenuItem>Settings</DropdownMenuItem>\n        <DropdownMenuItem>Logout</DropdownMenuItem>\n      </DropdownMenuContent>\n    </DropdownMenu>\n  )\n}`,
        render: (
          <DropdownMenu>
            <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
            <StageDropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </StageDropdownMenuContent>
          </DropdownMenu>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a colourful or photographic backdrop to read as frosted. Pick one in the stage header.",
        code: `import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <DropdownMenu>\n      <DropdownMenuTrigger>Glass menu</DropdownMenuTrigger>\n      <DropdownMenuContent variant="glass">\n        <DropdownMenuItem>Profile</DropdownMenuItem>\n        <DropdownMenuItem>Billing</DropdownMenuItem>\n      </DropdownMenuContent>\n    </DropdownMenu>\n  )\n}`,
        render: (
          <DropdownMenu>
            <DropdownMenuTrigger>Glass menu</DropdownMenuTrigger>
            <StageDropdownMenuContent variant="glass">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
            </StageDropdownMenuContent>
          </DropdownMenu>
        )
      }
    ]
  },

  modal: {
    badge: "Primitive / Molecule",
    props: [
      {
        title: "Modal",
        rows: [
          { prop: "open", type: "boolean", description: "Controlled open state." },
          { prop: "defaultOpen", type: "boolean", description: "Initial open state." },
          { prop: "onOpenChange", type: "(open: boolean) => void", description: "Open state change handler." },
          { prop: "modal", type: "boolean", defaultValue: "true", description: "Trap focus and block background interaction." }
        ]
      },
      {
        title: "ModalTrigger",
        rows: [
          { prop: "asChild", type: "boolean", defaultValue: "false", description: "Render as child element." }
        ]
      },
      {
        title: "ModalContent",
        rows: [
          { prop: "variant", type: '"glinr" | "plain" | "solid" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "ambient style (glinr)", description: "Panel look. Omit it for the ambient design style (glinr shell with a gradient hairline ring, elev-3). `plain` is the shadcn border and shadow, `solid` and `soft` are tonal, `glass` is opt-in and needs a backdrop. In the glinr look `ModalHeader` and `ModalFooter` become raised strips that bleed to the dialog edges. Legacy `default` follows the ambient style, `frosted` maps to `glass`, `matte` to `solid`." },
          { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Dialog width and padding." },
          { prop: "container", type: "HTMLElement | null", description: "Portal target. When set, the dialog and its flat dim scrim are positioned inside that element." },
          { prop: "className", type: "string", description: "Additional class names." },
          { prop: "onEscapeKeyDown", type: "(event: KeyboardEvent) => void", description: "Called when Escape is pressed." },
          { prop: "onPointerDownOutside", type: "(event: PointerDownOutsideEvent) => void", description: "Called when clicking outside." }
        ]
      },
      {
        title: "ModalHeader",
        rows: [
          { prop: "className", type: "string", description: "Additional class names." }
        ]
      },
      {
        title: "ModalTitle",
        rows: [
          { prop: "className", type: "string", description: "Additional class names." }
        ]
      },
      {
        title: "ModalDescription",
        rows: [
          { prop: "className", type: "string", description: "Additional class names." }
        ]
      },
      {
        title: "ModalFooter",
        rows: [
          { prop: "className", type: "string", description: "Additional class names." }
        ]
      },
      {
        title: "ModalClose",
        rows: [
          { prop: "asChild", type: "boolean", defaultValue: "false", description: "Render as child element." }
        ]
      }
    ],
    accessibility: {
      summary: [
        "Built on Radix Dialog with focus trapping.",
        "ModalTitle is required for screen readers.",
        "Background interaction blocked when modal."
      ],
      keyboard: [
        { key: "Escape", description: "Close the modal." },
        { key: "Tab", description: "Cycle focus within the modal." }
      ],
      aria: [
        '`role="dialog"`',
        '`aria-modal="true"`',
        "`aria-labelledby`",
        "`aria-describedby`"
      ]
    },
    reducedMotion: {
      description: "Open/close transitions respect `prefers-reduced-motion`.",
      affected: ["opacity", "transform"]
    },
    examples: [
      {
        title: "Basic",
        code: `import { Modal, ModalTrigger, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter, ModalClose, Button } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Modal>\n      <ModalTrigger asChild><Button>Open Modal</Button></ModalTrigger>\n      <ModalContent>\n        <ModalHeader>\n          <ModalTitle>Edit Profile</ModalTitle>\n          <ModalDescription>Make changes to your profile.</ModalDescription>\n        </ModalHeader>\n        <ModalFooter>\n          <ModalClose asChild><Button variant="ghost">Cancel</Button></ModalClose>\n          <Button>Save</Button>\n        </ModalFooter>\n      </ModalContent>\n    </Modal>\n  )\n}`,
        render: (
          <Modal>
            <ModalTrigger asChild><Button>Open Modal</Button></ModalTrigger>
            <StageModalContent>
              <ModalHeader>
                <ModalTitle>Edit Profile</ModalTitle>
                <ModalDescription>Make changes to your profile.</ModalDescription>
              </ModalHeader>
              <ModalFooter>
                <ModalClose asChild><Button variant="ghost">Cancel</Button></ModalClose>
                <Button>Save</Button>
              </ModalFooter>
            </StageModalContent>
          </Modal>
        )
      }
    ]
  },

  popover: {
    badge: "Primitive / Molecule",
    props: [
      {
        title: "Popover",
        rows: [
          { prop: "open", type: "boolean", description: "Controlled open state." },
          { prop: "defaultOpen", type: "boolean", description: "Initial open state." },
          { prop: "onOpenChange", type: "(open: boolean) => void", description: "Open state change handler." },
          { prop: "modal", type: "boolean", defaultValue: "false", description: "Trap focus within the popover." }
        ]
      },
      {
        title: "PopoverTrigger",
        rows: [
          { prop: "asChild", type: "boolean", defaultValue: "false", description: "Render as child element." }
        ]
      },
      {
        title: "PopoverContent",
        rows: [
          { prop: "variant", type: '"glinr" | "plain" | "solid" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "ambient style (glinr)", description: "Panel look. Omit it for the ambient design style (glinr shell with a gradient hairline ring, elev-3). `plain` is the shadcn border and shadow, `solid` and `soft` are tonal, `glass` is opt-in and needs a backdrop.  Legacy `default` follows the ambient style, `frosted` maps to `glass`, `matte` to `solid`." },
          { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Content width (w-56/w-72/w-80)." },
          { prop: "align", type: '"start" | "center" | "end"', defaultValue: "center", description: "Alignment relative to trigger." },
          { prop: "sideOffset", type: "number", defaultValue: "8", description: "Distance from trigger in pixels." },
          { prop: "side", type: '"top" | "right" | "bottom" | "left"', defaultValue: "bottom", description: "Preferred side of the trigger." }
        ]
      }
    ],
    accessibility: {
      summary: [
        "Built on Radix Popover with focus management.",
        "Focus returns to trigger on close."
      ],
      keyboard: [
        { key: "Escape", description: "Close the popover." },
        { key: "Tab", description: "Cycle focus within the popover." }
      ],
      aria: [
        "`aria-expanded` on trigger",
        "`aria-controls` linking trigger to content"
      ]
    },
    reducedMotion: {
      description: "Open/close transitions respect `prefers-reduced-motion`.",
      affected: ["opacity", "transform"]
    },
    examples: [
      {
        title: "Basic",
        code: `import { Popover, PopoverTrigger, PopoverContent } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Popover>\n      <PopoverTrigger>Open popover</PopoverTrigger>\n      <PopoverContent>\n        <div className="space-y-2">\n          <h4 className="font-medium text-sm">Dimensions</h4>\n          <p className="text-sm text-neutral-500">Set the dimensions for the layer.</p>\n        </div>\n      </PopoverContent>\n    </Popover>\n  )\n}`,
        render: (
          <Popover>
            <PopoverTrigger>Open popover</PopoverTrigger>
            <StagePopoverContent>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Dimensions</h4>
                <p className="text-sm text-neutral-500">Set the dimensions for the layer.</p>
              </div>
            </StagePopoverContent>
          </Popover>
        )
      }
    ]
  },

  progress: {
    badge: "Primitive / Atom",
    props: [
      { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "gradient" | "glass" | "liquid" | "matte"', defaultValue: 'ambient (glinr)', description: 'Look. Omit to follow the ambient design style: glinr is an inset track with an accent fill. Glass is opt-in.' },
      { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Track height (h-2/h-3/h-4)." },
      { prop: "value", type: "number", defaultValue: "0", description: "Progress value (0-100, clamped)." },
      { prop: "indeterminate", type: "boolean", defaultValue: "false", description: "Loading state without a specific value." }
    ],
    accessibility: {
      summary: [
        "Built on Radix Progress with `role=\"progressbar\"`.",
        "Provide `aria-label` for screen readers."
      ],
      aria: [
        '`role="progressbar"`',
        "`aria-valuenow`",
        "`aria-valuemin`",
        "`aria-valuemax`"
      ]
    },
    reducedMotion: {
      description: "Width transition respects `prefers-reduced-motion` via `motion-reduce:transition-none`.",
      affected: ["width"]
    },
    examples: [
      {
        title: "Basic",
        code: `import { Progress } from "@glinui/ui"\n\nexport function Demo() {\n  return <Progress value={68} aria-label="Upload progress" />\n}`,
        render: <Progress value={68} aria-label="Upload progress" />
      },
      {
        title: "Variants",
        code: `import { Progress } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="space-y-3">\n      <Progress variant="glinr" value={30} aria-label="glinr" />\n      <Progress variant="solid" value={38} aria-label="solid" />\n      <Progress variant="plain" value={46} aria-label="plain" />\n      <Progress variant="soft" value={54} aria-label="soft" />\n      <Progress variant="outline" value={62} aria-label="outline" />\n      <Progress variant="ghost" value={70} aria-label="ghost" />\n      <Progress variant="gradient" value={78} aria-label="gradient" />\n    </div>\n  )\n}`,
        render: (
          <div className="space-y-3">
            <Progress variant="glinr" value={30} aria-label="glinr" />
            <Progress variant="solid" value={38} aria-label="solid" />
            <Progress variant="plain" value={46} aria-label="plain" />
            <Progress variant="soft" value={54} aria-label="soft" />
            <Progress variant="outline" value={62} aria-label="outline" />
            <Progress variant="ghost" value={70} aria-label="ghost" />
            <Progress variant="gradient" value={78} aria-label="gradient" />
          </div>
        )
      },
      {
        title: "Sizes",
        code: `import { Progress } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="space-y-4">\n      <Progress size="sm" value={25} aria-label="Small" />\n      <Progress size="md" value={50} aria-label="Medium" />\n      <Progress size="lg" value={75} aria-label="Large" />\n    </div>\n  )\n}`,
        render: (
          <div className="space-y-4">
            <Progress size="sm" value={25} aria-label="Small" />
            <Progress size="md" value={50} aria-label="Medium" />
            <Progress size="lg" value={75} aria-label="Large" />
          </div>
        )
      },
      {
        title: "Circular",
        code: `import { ProgressCircle } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="flex items-center gap-4">\n      <ProgressCircle size="sm" value={30} aria-label="Small progress" />\n      <ProgressCircle value={64} aria-label="Default progress" />\n      <ProgressCircle size="lg" variant="gradient" value={88} aria-label="Gradient progress" />\n    </div>\n  )\n}`,
        render: (
          <div className="flex items-center gap-4">
            <ProgressCircle size="sm" value={30} aria-label="Small progress" />
            <ProgressCircle value={64} aria-label="Default progress" />
            <ProgressCircle size="lg" variant="gradient" value={88} aria-label="Gradient progress" />
          </div>
        )
      },
      {
        title: "Indeterminate",
        code: `import { Progress, ProgressCircle } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="flex items-center gap-4">\n      <div className="w-64">\n        <Progress indeterminate aria-label="Loading data" />\n      </div>\n      <ProgressCircle indeterminate aria-label="Syncing" />\n    </div>\n  )\n}`,
        render: (
          <div className="flex items-center gap-4">
            <div className="w-64">
              <Progress indeterminate aria-label="Loading data" />
            </div>
            <ProgressCircle indeterminate aria-label="Syncing" />
          </div>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it: pick Photo or Vivid in the stage backdrop switcher.",
        code: `import { Progress, ProgressCircle } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="flex items-center gap-4">\n      <div className="w-64">\n        <Progress variant="glass" value={60} aria-label="Glass progress" />\n      </div>\n      <ProgressCircle variant="glass" value={64} aria-label="Glass circle" />\n    </div>\n  )\n}`,
        render: (
          <div className="flex items-center gap-4">
            <div className="w-64">
              <Progress variant="glass" value={60} aria-label="Glass progress" />
            </div>
            <ProgressCircle variant="glass" value={64} aria-label="Glass circle" />
          </div>
        )
      }
    ]
  },

  separator: {
    badge: "Primitive / Atom",
    props: [
      { prop: "variant", type: '"glinr" | "plain" | "glass" | "outline" | "ghost" | "gradient" | "dashed" | "dotted" | "hairline" | "default"', defaultValue: "ambient (glinr)", description: "Line style. Omitted or `default` follows the ambient design style." },
      { prop: "orientation", type: '"horizontal" | "vertical"', defaultValue: "horizontal", description: "Divider direction." },
      { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Thickness." },
      { prop: "label", type: "string", description: "Centered text label displayed on the separator." },
      { prop: "icon", type: "ReactNode", description: "Centered icon displayed on the separator." },
      { prop: "decorative", type: "boolean", defaultValue: "true", description: "When true, sets aria-hidden." }
    ],
    accessibility: {
      summary: [
        "Uses `role=\"separator\"` when not decorative.",
        "Set `decorative={false}` for semantic separators."
      ],
      aria: [
        '`role="separator"` when not decorative',
        "`aria-orientation`",
        "`aria-hidden` when decorative"
      ]
    },
    reducedMotion: {
      description: "No animation dependencies.",
      affected: []
    },
    examples: [
      {
        title: "Variants",
        description: "Omitted `variant` follows the ambient style: an engraved glinr hairline, a flat plain line, or glass.",
        code: "import { Separator } from \"@glinui/ui\"\n\n<Separator />\n<Separator variant=\"plain\" />\n<Separator variant=\"hairline\" />\n<Separator variant=\"dashed\" />",
        render: <SeparatorVariantsDemo />
      }
    ]
  },

  sheet: {
    badge: "Primitive / Molecule",
    props: [
      {
        title: "Sheet",
        rows: [
          { prop: "open", type: "boolean", description: "Controlled open state." },
          { prop: "defaultOpen", type: "boolean", description: "Initial open state." },
          { prop: "onOpenChange", type: "(open: boolean) => void", description: "Open state change handler." },
          { prop: "modal", type: "boolean", defaultValue: "true", description: "Trap focus and block background interaction." }
        ]
      },
      {
        title: "SheetTrigger",
        rows: [
          { prop: "asChild", type: "boolean", defaultValue: "false", description: "Render as child element." }
        ]
      },
      {
        title: "SheetContent",
        rows: [
          { prop: "variant", type: '"glinr" | "plain" | "solid" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "ambient style (glinr)", description: "Panel look. Omit it for the ambient design style (glinr shell with a gradient hairline ring, elev-3). `plain` is the shadcn border and shadow, `solid` and `soft` are tonal, `glass` is opt-in and needs a backdrop. In the glinr look `SheetHeader` becomes a raised strip. Legacy `default` follows the ambient style, `frosted` maps to `glass`, `matte` to `solid`." },
          { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Panel width/height." },
          { prop: "side", type: '"top" | "bottom" | "left" | "right"', defaultValue: "right", description: "Slide-in direction." }
        ]
      },
      {
        title: "SheetHeader",
        rows: [
          { prop: "className", type: "string", description: "Additional class names." }
        ]
      },
      {
        title: "SheetTitle",
        rows: [
          { prop: "className", type: "string", description: "Additional class names." }
        ]
      },
      {
        title: "SheetDescription",
        rows: [
          { prop: "className", type: "string", description: "Additional class names." }
        ]
      },
      {
        title: "SheetFooter",
        rows: [
          { prop: "className", type: "string", description: "Additional class names." }
        ]
      },
      {
        title: "SheetClose",
        rows: [
          { prop: "asChild", type: "boolean", defaultValue: "false", description: "Render as child element." }
        ]
      }
    ],
    accessibility: {
      summary: [
        "Built on Radix Dialog with focus trapping.",
        "SheetTitle required for screen readers."
      ],
      keyboard: [
        { key: "Escape", description: "Close the sheet." },
        { key: "Tab", description: "Cycle focus within the sheet." }
      ],
      aria: [
        '`role="dialog"`',
        '`aria-modal="true"`',
        "`aria-labelledby`"
      ]
    },
    reducedMotion: {
      description: "Slide transitions respect `prefers-reduced-motion`.",
      affected: ["transform"]
    },
    examples: [
      {
        title: "Basic",
        code: `import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose, Button } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Sheet>\n      <SheetTrigger asChild><Button variant="outline">Open Sheet</Button></SheetTrigger>\n      <SheetContent>\n        <SheetHeader>\n          <SheetTitle>Settings</SheetTitle>\n          <SheetDescription>Adjust preferences.</SheetDescription>\n        </SheetHeader>\n        <SheetFooter>\n          <SheetClose asChild><Button variant="ghost">Cancel</Button></SheetClose>\n          <Button>Save</Button>\n        </SheetFooter>\n      </SheetContent>\n    </Sheet>\n  )\n}`,
        render: (
          <Sheet>
            <SheetTrigger asChild><Button variant="outline">Open Sheet</Button></SheetTrigger>
            <StageSheetContent>
              <SheetHeader>
                <SheetTitle>Settings</SheetTitle>
                <SheetDescription>Adjust preferences.</SheetDescription>
              </SheetHeader>
              <SheetFooter>
                <SheetClose asChild><Button variant="ghost">Cancel</Button></SheetClose>
                <Button>Save</Button>
              </SheetFooter>
            </StageSheetContent>
          </Sheet>
        )
      },
      {
        title: "Bottom Sheet",
        code: `import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, Button } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Sheet>\n      <SheetTrigger asChild><Button>Bottom Sheet</Button></SheetTrigger>\n      <SheetContent side="bottom">\n        <SheetHeader><SheetTitle>Quick Actions</SheetTitle></SheetHeader>\n      </SheetContent>\n    </Sheet>\n  )\n}`,
        render: (
          <Sheet>
            <SheetTrigger asChild><Button>Bottom Sheet</Button></SheetTrigger>
            <StageSheetContent side="bottom">
              <SheetHeader><SheetTitle>Quick Actions</SheetTitle></SheetHeader>
            </StageSheetContent>
          </Sheet>
        )
      }
    ]
  },

  skeleton: {
    badge: "Primitive / Atom",
    props: [
      { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "glass" | "liquid" | "matte"', defaultValue: 'ambient (glinr)', description: 'Placeholder look. Omit to follow the ambient design style. Glass is opt-in.' },
      { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Height (h-4/h-6/h-10)." },
      { prop: "decorative", type: "boolean", defaultValue: "true", description: "When true, sets aria-hidden." }
    ],
    accessibility: {
      summary: [
        "Sets `aria-hidden` when decorative.",
        "Uses `motion-safe:animate-pulse` with `motion-reduce:animate-none`."
      ],
      aria: [
        '`aria-hidden="true"` when decorative',
        '`aria-busy="true"` on parent container'
      ]
    },
    reducedMotion: {
      description: "Pulse animation disabled with `prefers-reduced-motion: reduce`.",
      affected: ["opacity"]
    },
    examples: [
      {
        title: "Loading Pattern",
        code: `import { Skeleton } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="space-y-3">\n      <Skeleton className="h-32 w-full rounded-xl" />\n      <Skeleton className="h-4 w-3/4" />\n      <Skeleton className="h-4 w-1/2" />\n    </div>\n  )\n}`,
        render: (
          <div className="space-y-3">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        )
      },
      {
        title: "Variants",
        code: `import { Skeleton } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="grid gap-3 sm:grid-cols-2">\n      <Skeleton variant="glinr" className="h-6 w-full" />\n      <Skeleton variant="solid" className="h-6 w-full" />\n      <Skeleton variant="plain" className="h-6 w-full" />\n      <Skeleton variant="soft" className="h-6 w-full" />\n      <Skeleton variant="outline" className="h-6 w-full" />\n      <Skeleton variant="ghost" className="h-6 w-full" />\n    </div>\n  )\n}`,
        render: (
          <div className="grid gap-3 sm:grid-cols-2">
            <Skeleton variant="glinr" className="h-6 w-full" />
            <Skeleton variant="solid" className="h-6 w-full" />
            <Skeleton variant="plain" className="h-6 w-full" />
            <Skeleton variant="soft" className="h-6 w-full" />
            <Skeleton variant="outline" className="h-6 w-full" />
            <Skeleton variant="ghost" className="h-6 w-full" />
          </div>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it: pick Photo or Vivid in the stage backdrop switcher.",
        code: `import { Skeleton } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="space-y-3">\n      <Skeleton variant="glass" className="h-6 w-40" />\n      <Skeleton variant="glass" className="h-4 w-full max-w-sm" />\n    </div>\n  )\n}`,
        render: (
          <div className="space-y-3">
            <Skeleton variant="glass" className="h-6 w-40" />
            <Skeleton variant="glass" className="h-4 w-full max-w-sm" />
          </div>
        )
      }
    ]
  },

  slider: {
    badge: "Primitive / Atom",
    props: [
      { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "glass" | "liquid"', defaultValue: 'ambient (glinr)', description: 'Look. Omit to follow the ambient design style: glinr is an inset track with an accent range and a raised key thumb. Glass is opt-in.' },
      { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Track and thumb size scale." },
      { prop: "defaultValue", type: "number[]", description: "Initial value(s)." },
      { prop: "value", type: "number[]", description: "Controlled value(s)." },
      { prop: "onValueChange", type: "(value: number[]) => void", description: "Change handler for controlled sliders." },
      { prop: "max", type: "number", defaultValue: "100", description: "Maximum value." },
      { prop: "step", type: "number", defaultValue: "1", description: "Step increment." },
      { prop: "disabled", type: "boolean", defaultValue: "false", description: "Disables interaction." }
    ],
    accessibility: {
      summary: [
        "Built on Radix Slider with full ARIA support.",
        "Supports single-value and range sliders (multiple thumbs).",
        "Provide `aria-label` for screen readers."
      ],
      keyboard: [
        { key: "Arrow Left / Right", description: "Decrease / increase value by one step." },
        { key: "Home", description: "Set to minimum value." },
        { key: "End", description: "Set to maximum value." }
      ],
      aria: [
        '`role="slider"`',
        "`aria-valuenow`",
        "`aria-valuemin`",
        "`aria-valuemax`",
        "`aria-orientation`"
      ]
    },
    reducedMotion: {
      description: "Thumb and track transitions respect `prefers-reduced-motion`.",
      affected: ["transform", "box-shadow", "opacity"]
    },
    examples: [
      {
        title: "Basic",
        code: `import { Slider } from "@glinui/ui"\n\nexport function Demo() {\n  return <Slider defaultValue={[35]} max={100} step={1} aria-label="Volume" />\n}`,
        render: <Slider defaultValue={[35]} max={100} step={1} aria-label="Volume" />
      },
      {
        title: "Variants",
        code: `import { Slider } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="space-y-4">\n      <Slider variant="glinr" defaultValue={[20]} aria-label="glinr slider" />\n      <Slider variant="solid" defaultValue={[32]} aria-label="solid slider" />\n      <Slider variant="plain" defaultValue={[44]} aria-label="plain slider" />\n      <Slider variant="soft" defaultValue={[56]} aria-label="soft slider" />\n      <Slider variant="outline" defaultValue={[68]} aria-label="outline slider" />\n      <Slider variant="ghost" defaultValue={[80]} aria-label="ghost slider" />\n    </div>\n  )\n}`,
        render: (
          <div className="space-y-4">
            <Slider variant="glinr" defaultValue={[20]} aria-label="glinr slider" />
            <Slider variant="solid" defaultValue={[32]} aria-label="solid slider" />
            <Slider variant="plain" defaultValue={[44]} aria-label="plain slider" />
            <Slider variant="soft" defaultValue={[56]} aria-label="soft slider" />
            <Slider variant="outline" defaultValue={[68]} aria-label="outline slider" />
            <Slider variant="ghost" defaultValue={[80]} aria-label="ghost slider" />
          </div>
        )
      },
      {
        title: "Sizes",
        code: `import { Slider } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="space-y-4">\n      <Slider size="sm" defaultValue={[24]} aria-label="Small slider" />\n      <Slider size="md" defaultValue={[52]} aria-label="Medium slider" />\n      <Slider size="lg" defaultValue={[78]} aria-label="Large slider" />\n    </div>\n  )\n}`,
        render: (
          <div className="space-y-4">
            <Slider size="sm" defaultValue={[24]} aria-label="Small slider" />
            <Slider size="md" defaultValue={[52]} aria-label="Medium slider" />
            <Slider size="lg" defaultValue={[78]} aria-label="Large slider" />
          </div>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it: pick Photo or Vivid in the stage backdrop switcher.",
        code: `import { Slider } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Slider variant="glass" defaultValue={[40]} aria-label="Glass slider" />\n  )\n}`,
        render: (
          <Slider variant="glass" defaultValue={[40]} aria-label="Glass slider" />
        )
      },
      {
        title: "Range",
        code: `import * as React from "react"\nimport { Slider } from "@glinui/ui"\n\nexport function Demo() {\n  const [value, setValue] = React.useState([24, 78])\n\n  return (\n    <div className="space-y-3">\n      <Slider value={value} onValueChange={setValue} max={100} step={1} aria-label="Engagement range" />\n      <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">\n        <span>{value[0]}%</span>\n        <span>{value[1]}%</span>\n      </div>\n    </div>\n  )\n}`,
        render: <SliderRangeDemo />
      },
      {
        title: "Animated Atmosphere",
        description: "Decorative blur layers pulse with reduced-motion fallback while slider values stay readable.",
        code: `import * as React from "react"\nimport { Badge, Slider } from "@glinui/ui"\n\nexport function Demo() {\n  const [value, setValue] = React.useState([62])\n\n  return (\n    <div className="relative overflow-hidden rounded-2xl border border-white/25 bg-[var(--glass-1-surface)] p-4 dark:border-white/10 dark:bg-white/[0.03]">\n      <div className="pointer-events-none absolute -left-6 -top-10 h-24 w-24 rounded-full bg-[var(--color-accent)]/25 blur-2xl motion-safe:animate-pulse" />\n      <div className="pointer-events-none absolute -bottom-10 right-0 h-24 w-24 rounded-full bg-[var(--color-foreground)]/15 blur-3xl motion-safe:animate-pulse" />\n      <div className="relative space-y-3">\n        <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-300">\n          <span>Atmosphere</span>\n          <Badge variant="glass">{value[0]}%</Badge>\n        </div>\n        <Slider variant="liquid" value={value} onValueChange={setValue} max={100} aria-label="Atmosphere amount" />\n      </div>\n    </div>\n  )\n}`,
        render: <SliderAtmosphereDemo />
      }
    ]
  },

  tabs: {
    badge: "Primitive / Molecule",
    props: [
      {
        title: "Tabs",
        rows: [
          { prop: "defaultValue", type: "string", description: "Initially active tab." },
          { prop: "value", type: "string", description: "Controlled active tab." },
          { prop: "onValueChange", type: "(value: string) => void", description: "Tab change handler." },
          { prop: "orientation", type: '"horizontal" | "vertical"', defaultValue: "horizontal", description: "Layout direction of the tab list." },
          { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "underline" | "glass" | "liquid" | "matte" | "keys"', defaultValue: 'ambient (glinr)', description: "Default look for the list, triggers and panels inside. Each part can still set its own." },
          { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Default density for every part inside." }
        ]
      },
      {
        title: "TabsList",
        rows: [
          { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "underline" | "glass" | "liquid" | "matte" | "keys"', defaultValue: "inherits Tabs", description: "Look. Omit to inherit from Tabs or the ambient design style: glinr is the raised pill track (keys), plain is the flat shadcn tabs. Glass is opt-in." },
          { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Density scale." }
        ]
      },
      {
        title: "TabsTrigger",
        rows: [
          { prop: "value", type: "string", description: "Unique value identifying this tab." },
          { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "underline" | "glass" | "liquid" | "matte" | "keys"', defaultValue: "inherits Tabs", description: "Look. Omit to inherit from Tabs or the ambient design style: glinr is the raised pill track (keys), plain is the flat shadcn tabs. Glass is opt-in." },
          { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Density scale." },
          { prop: "disabled", type: "boolean", defaultValue: "false", description: "Prevents interaction." }
        ]
      },
      {
        title: "TabsContent",
        rows: [
          { prop: "value", type: "string", description: "Value matching the associated trigger." },
          { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "underline" | "glass" | "liquid" | "matte" | "keys"', defaultValue: "inherits Tabs", description: "Look. Omit to inherit from Tabs or the ambient design style: glinr is the raised pill track (keys), plain is the flat shadcn tabs. Glass is opt-in." }
        ]
      }
    ],
    accessibility: {
      summary: [
        "Built on Radix Tabs with full WAI-ARIA.",
        "Content is associated via `aria-controls`."
      ],
      keyboard: [
        { key: "Arrow Left / Right", description: "Navigate between tab triggers." },
        { key: "Enter / Space", description: "Select the focused tab." }
      ],
      aria: [
        '`role="tablist"` on list',
        '`role="tab"` on triggers',
        '`role="tabpanel"` on content',
        "`aria-selected`",
        "`aria-controls`"
      ]
    },
    reducedMotion: {
      description: "Active indicator transitions respect `prefers-reduced-motion`.",
      affected: ["transform", "opacity"]
    },
    examples: [
      {
        title: "Basic",
        code: `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Tabs defaultValue="account">\n      <TabsList>\n        <TabsTrigger value="account">Account</TabsTrigger>\n        <TabsTrigger value="password">Password</TabsTrigger>\n      </TabsList>\n      <TabsContent value="account">\n        <p className="text-sm text-[color:var(--color-muted)]">Account settings.</p>\n      </TabsContent>\n      <TabsContent value="password">\n        <p className="text-sm text-[color:var(--color-muted)]">Password settings.</p>\n      </TabsContent>\n    </Tabs>\n  )\n}`,
        render: (
          <Tabs defaultValue="account">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <p className="text-sm text-[color:var(--color-muted)]">Account settings.</p>
            </TabsContent>
            <TabsContent value="password">
              <p className="text-sm text-[color:var(--color-muted)]">Password settings.</p>
            </TabsContent>
          </Tabs>
        )
      },
      {
        title: "Variants",
        description: "Set variant once on Tabs and the list, triggers and panels inherit it. glinr is the raised pill track, underline slides an accent bar with transform only.",
        code: `import { Tabs, TabsList, TabsTrigger } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="grid gap-4 md:grid-cols-2">\n      <Tabs defaultValue="a" variant="glinr">\n        <TabsList>\n          <TabsTrigger value="a">glinr</TabsTrigger>\n          <TabsTrigger value="b">Two</TabsTrigger>\n          <TabsTrigger value="c">Three</TabsTrigger>\n        </TabsList>\n      </Tabs>\n      <Tabs defaultValue="a" variant="solid">\n        <TabsList>\n          <TabsTrigger value="a">solid</TabsTrigger>\n          <TabsTrigger value="b">Two</TabsTrigger>\n          <TabsTrigger value="c">Three</TabsTrigger>\n        </TabsList>\n      </Tabs>\n      <Tabs defaultValue="a" variant="plain">\n        <TabsList>\n          <TabsTrigger value="a">plain</TabsTrigger>\n          <TabsTrigger value="b">Two</TabsTrigger>\n          <TabsTrigger value="c">Three</TabsTrigger>\n        </TabsList>\n      </Tabs>\n      <Tabs defaultValue="a" variant="soft">\n        <TabsList>\n          <TabsTrigger value="a">soft</TabsTrigger>\n          <TabsTrigger value="b">Two</TabsTrigger>\n          <TabsTrigger value="c">Three</TabsTrigger>\n        </TabsList>\n      </Tabs>\n      <Tabs defaultValue="a" variant="outline">\n        <TabsList>\n          <TabsTrigger value="a">outline</TabsTrigger>\n          <TabsTrigger value="b">Two</TabsTrigger>\n          <TabsTrigger value="c">Three</TabsTrigger>\n        </TabsList>\n      </Tabs>\n      <Tabs defaultValue="a" variant="underline">\n        <TabsList>\n          <TabsTrigger value="a">underline</TabsTrigger>\n          <TabsTrigger value="b">Two</TabsTrigger>\n          <TabsTrigger value="c">Three</TabsTrigger>\n        </TabsList>\n      </Tabs>\n    </div>\n  )\n}`,
        render: (
          <div className="grid gap-4 md:grid-cols-2">
            <Tabs defaultValue="a" variant="glinr">
              <TabsList>
                <TabsTrigger value="a">glinr</TabsTrigger>
                <TabsTrigger value="b">Two</TabsTrigger>
                <TabsTrigger value="c">Three</TabsTrigger>
              </TabsList>
            </Tabs>
            <Tabs defaultValue="a" variant="solid">
              <TabsList>
                <TabsTrigger value="a">solid</TabsTrigger>
                <TabsTrigger value="b">Two</TabsTrigger>
                <TabsTrigger value="c">Three</TabsTrigger>
              </TabsList>
            </Tabs>
            <Tabs defaultValue="a" variant="plain">
              <TabsList>
                <TabsTrigger value="a">plain</TabsTrigger>
                <TabsTrigger value="b">Two</TabsTrigger>
                <TabsTrigger value="c">Three</TabsTrigger>
              </TabsList>
            </Tabs>
            <Tabs defaultValue="a" variant="soft">
              <TabsList>
                <TabsTrigger value="a">soft</TabsTrigger>
                <TabsTrigger value="b">Two</TabsTrigger>
                <TabsTrigger value="c">Three</TabsTrigger>
              </TabsList>
            </Tabs>
            <Tabs defaultValue="a" variant="outline">
              <TabsList>
                <TabsTrigger value="a">outline</TabsTrigger>
                <TabsTrigger value="b">Two</TabsTrigger>
                <TabsTrigger value="c">Three</TabsTrigger>
              </TabsList>
            </Tabs>
            <Tabs defaultValue="a" variant="underline">
              <TabsList>
                <TabsTrigger value="a">underline</TabsTrigger>
                <TabsTrigger value="b">Two</TabsTrigger>
                <TabsTrigger value="c">Three</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it: pick Photo or Vivid in the stage backdrop switcher.",
        code: `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Tabs defaultValue="first" variant="glass">\n      <TabsList>\n        <TabsTrigger value="first">First</TabsTrigger>\n        <TabsTrigger value="second">Second</TabsTrigger>\n      </TabsList>\n      <TabsContent value="first">Glass tab content.</TabsContent>\n      <TabsContent value="second">Second panel.</TabsContent>\n    </Tabs>\n  )\n}`,
        render: (
          <Tabs defaultValue="first" variant="glass">
            <TabsList>
              <TabsTrigger value="first">First</TabsTrigger>
              <TabsTrigger value="second">Second</TabsTrigger>
            </TabsList>
            <TabsContent value="first">Glass tab content.</TabsContent>
            <TabsContent value="second">Second panel.</TabsContent>
          </Tabs>
        )
      },
      {
        title: "Liquid + Matte Variants",
        code: `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="grid gap-4 md:grid-cols-2">\n      <Tabs defaultValue="liquid-1">\n        <TabsList variant="liquid">\n          <TabsTrigger value="liquid-1" variant="liquid">Liquid A</TabsTrigger>\n          <TabsTrigger value="liquid-2" variant="liquid">Liquid B</TabsTrigger>\n        </TabsList>\n        <TabsContent value="liquid-1" variant="liquid">Liquid tab surface.</TabsContent>\n        <TabsContent value="liquid-2" variant="liquid">Second liquid panel.</TabsContent>\n      </Tabs>\n      <Tabs defaultValue="matte-1">\n        <TabsList variant="matte">\n          <TabsTrigger value="matte-1" variant="matte">Matte A</TabsTrigger>\n          <TabsTrigger value="matte-2" variant="matte">Matte B</TabsTrigger>\n        </TabsList>\n        <TabsContent value="matte-1" variant="matte">Matte tab surface.</TabsContent>\n        <TabsContent value="matte-2" variant="matte">Second matte panel.</TabsContent>\n      </Tabs>\n    </div>\n  )\n}`,
        render: (
          <div className="grid gap-4 md:grid-cols-2">
            <Tabs defaultValue="liquid-1">
              <TabsList variant="liquid">
                <TabsTrigger value="liquid-1" variant="liquid">Liquid A</TabsTrigger>
                <TabsTrigger value="liquid-2" variant="liquid">Liquid B</TabsTrigger>
              </TabsList>
              <TabsContent value="liquid-1" variant="liquid">Liquid tab surface.</TabsContent>
              <TabsContent value="liquid-2" variant="liquid">Second liquid panel.</TabsContent>
            </Tabs>
            <Tabs defaultValue="matte-1">
              <TabsList variant="matte">
                <TabsTrigger value="matte-1" variant="matte">Matte A</TabsTrigger>
                <TabsTrigger value="matte-2" variant="matte">Matte B</TabsTrigger>
              </TabsList>
              <TabsContent value="matte-1" variant="matte">Matte tab surface.</TabsContent>
              <TabsContent value="matte-2" variant="matte">Second matte panel.</TabsContent>
            </Tabs>
          </div>
        )
      }
    ]
  },

  table: {
    badge: "Primitive / Molecule",
    props: [
      {
        title: "Table",
        rows: [
          { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "gradient" | "glass" | "liquid" | "matte" | "lift"', defaultValue: "ambient (glinr)", description: "Surface variant. Omit to follow the ambient design style (glinr by default, plain for minimal, glass for glass)." },
          { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: "md", description: "Text and spacing scale." },
          { prop: "stickyHeader", type: "boolean", defaultValue: "false", description: "Makes `<TableHeader />` stick to the top while scrolling." },
          { prop: "stickyFirstColumn", type: "boolean", defaultValue: "false", description: "Pins the first column while horizontally scrolling." },
          { prop: "striped", type: "boolean", defaultValue: "false", description: "Applies alternating row background treatment." },
          { prop: "interactive", type: "boolean", defaultValue: "true", description: "Enables row hover treatment." },
          { prop: "grid", type: "boolean", defaultValue: "false", description: "Adds vertical grid separators between cells." },
          { prop: "layout", type: '"auto" | "fixed"', defaultValue: "auto", description: "Sets table layout algorithm." },
          { prop: "noWrap", type: "boolean", defaultValue: "false", description: "Forces single-line cell and header content." },
          { prop: "rowDividers", type: "boolean", defaultValue: "true", description: "Toggles horizontal row borders." },
          { prop: "containerClassName", type: "string", description: "Class names for the scroll container wrapper." }
        ]
      },
      {
        title: "TableHeader",
        rows: [
          { prop: "className", type: "string", description: "Additional class names." }
        ]
      },
      {
        title: "TableRow",
        rows: [
          { prop: "tone", type: '"default" | "info" | "success" | "warning" | "danger"', defaultValue: "default", description: "Applies semantic row emphasis." },
          { prop: "className", type: "string", description: "Additional class names." }
        ]
      },
      {
        title: "TableHead",
        rows: [
          { prop: "align", type: '"left" | "center" | "right"', defaultValue: "left", description: "Text alignment for header cells." },
          { prop: "sticky", type: "boolean", defaultValue: "false", description: "Pins a specific header cell to the left." },
          { prop: "className", type: "string", description: "Additional class names." }
        ]
      },
      {
        title: "TableBody",
        rows: [
          { prop: "className", type: "string", description: "Additional class names." }
        ]
      },
      {
        title: "TableCell",
        rows: [
          { prop: "align", type: '"left" | "center" | "right"', defaultValue: "left", description: "Text alignment for body cells." },
          { prop: "truncate", type: "boolean", defaultValue: "false", description: "Applies single-line truncation with ellipsis." },
          { prop: "sticky", type: "boolean", defaultValue: "false", description: "Pins a specific body cell to the left." },
          { prop: "className", type: "string", description: "Additional class names." }
        ]
      }
    ],
    accessibility: {
      summary: [
        "Native `<table>` semantics with proper `<thead>`/`<tbody>` structure.",
        "Use `<th>` for column headers.",
        "Sticky headers preserve semantics because structure remains native."
      ],
      aria: [
        "Native table semantics with `<th scope>`"
      ]
    },
    reducedMotion: {
      description: "Row hover color transitions use motion-safe classes with reduced-motion fallback.",
      affected: ["background-color"]
    },
    examples: [
      {
        title: "Basic",
        code: `import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Table>\n      <TableHeader>\n        <TableRow>\n          <TableHead>Project</TableHead>\n          <TableHead>Status</TableHead>\n          <TableHead align="right">MRR</TableHead>\n        </TableRow>\n      </TableHeader>\n      <TableBody>\n        <TableRow>\n          <TableCell>Glin UI</TableCell>\n          <TableCell>Shipping</TableCell>\n          <TableCell align="right">$18,400</TableCell>\n        </TableRow>\n        <TableRow>\n          <TableCell>Glin Docs</TableCell>\n          <TableCell>Active</TableCell>\n          <TableCell align="right">$7,920</TableCell>\n        </TableRow>\n      </TableBody>\n    </Table>\n  )\n}`,
        render: (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead align="right">MRR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Glin UI</TableCell>
                <TableCell>Shipping</TableCell>
                <TableCell align="right">$18,400</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Glin Docs</TableCell>
                <TableCell>Active</TableCell>
                <TableCell align="right">$7,920</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )
      },
      {
        title: "Variants",
        description: "Every vocabulary variant on the default tone. Omit variant to follow the ambient design style.",
        code: `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@glinui/ui"

export function TableVariantsDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Table variant="glinr" containerClassName="w-full"><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Glin UI</TableCell><TableCell>Active</TableCell></TableRow></TableBody></Table>
      <Table variant="solid" containerClassName="w-full"><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Glin UI</TableCell><TableCell>Active</TableCell></TableRow></TableBody></Table>
      <Table variant="plain" containerClassName="w-full"><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Glin UI</TableCell><TableCell>Active</TableCell></TableRow></TableBody></Table>
      <Table variant="soft" containerClassName="w-full"><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Glin UI</TableCell><TableCell>Active</TableCell></TableRow></TableBody></Table>
      <Table variant="outline" containerClassName="w-full"><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Glin UI</TableCell><TableCell>Active</TableCell></TableRow></TableBody></Table>
      <Table variant="ghost" containerClassName="w-full"><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Glin UI</TableCell><TableCell>Active</TableCell></TableRow></TableBody></Table>
      <Table variant="gradient" containerClassName="w-full"><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Glin UI</TableCell><TableCell>Active</TableCell></TableRow></TableBody></Table>
    </div>
  )
}`,
        render: (
          <div className="grid gap-4 md:grid-cols-2">
            <Table variant="glinr" containerClassName="w-full"><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Glin UI</TableCell><TableCell>Active</TableCell></TableRow></TableBody></Table>
            <Table variant="solid" containerClassName="w-full"><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Glin UI</TableCell><TableCell>Active</TableCell></TableRow></TableBody></Table>
            <Table variant="plain" containerClassName="w-full"><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Glin UI</TableCell><TableCell>Active</TableCell></TableRow></TableBody></Table>
            <Table variant="soft" containerClassName="w-full"><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Glin UI</TableCell><TableCell>Active</TableCell></TableRow></TableBody></Table>
            <Table variant="outline" containerClassName="w-full"><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Glin UI</TableCell><TableCell>Active</TableCell></TableRow></TableBody></Table>
            <Table variant="ghost" containerClassName="w-full"><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Glin UI</TableCell><TableCell>Active</TableCell></TableRow></TableBody></Table>
            <Table variant="gradient" containerClassName="w-full"><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Glin UI</TableCell><TableCell>Active</TableCell></TableRow></TableBody></Table>
          </div>
        )
      },
      {
        title: "Variants matrix",
        description: "Every variant by tone (where the component has tones), rendered in the light and dark theme scopes.",
        code: `import { SURFACE_VARIANTS } from "@glinui/ui"\n\n// table across the vocabulary\n{SURFACE_VARIANTS.map((variant) => (\n  <Table key={variant} variant={variant}>{/* header and rows */}</Table>\n))}`,
        render: <TableFamilyMatrix />
      },
      {
        title: "Sticky Header + Striped",
        code: `import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@glinui/ui"\n\nconst rows = [\n  { region: "North America", users: "12,400", conversion: "8.2%" },\n  { region: "Europe", users: "9,280", conversion: "7.5%" },\n  { region: "APAC", users: "15,032", conversion: "6.9%" },\n  { region: "LATAM", users: "4,310", conversion: "5.8%" }\n]\n\nexport function Demo() {\n  return (\n    <Table stickyHeader striped containerClassName="max-h-52">\n      <TableHeader>\n        <TableRow>\n          <TableHead>Region</TableHead>\n          <TableHead align="right">Users</TableHead>\n          <TableHead align="right">Conversion</TableHead>\n        </TableRow>\n      </TableHeader>\n      <TableBody>\n        {rows.map((row) => (\n          <TableRow key={row.region}>\n            <TableCell>{row.region}</TableCell>\n            <TableCell align="right">{row.users}</TableCell>\n            <TableCell align="right">{row.conversion}</TableCell>\n          </TableRow>\n        ))}\n      </TableBody>\n    </Table>\n  )\n}`,
        render: (
          <Table stickyHeader striped containerClassName="max-h-52">
            <TableHeader>
              <TableRow>
                <TableHead>Region</TableHead>
                <TableHead align="right">Users</TableHead>
                <TableHead align="right">Conversion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { region: "North America", users: "12,400", conversion: "8.2%" },
                { region: "Europe", users: "9,280", conversion: "7.5%" },
                { region: "APAC", users: "15,032", conversion: "6.9%" },
                { region: "LATAM", users: "4,310", conversion: "5.8%" },
                { region: "Middle East", users: "2,980", conversion: "6.2%" },
                { region: "Africa", users: "1,740", conversion: "4.7%" }
              ].map((row) => (
                <TableRow key={row.region}>
                  <TableCell>{row.region}</TableCell>
                  <TableCell align="right">{row.users}</TableCell>
                  <TableCell align="right">{row.conversion}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      },
      {
        title: "Sticky First Column",
        description: "Keep identifiers visible in horizontally scrollable comparison tables.",
        code: `import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Table stickyFirstColumn noWrap variant="matte">\n      <TableHeader>\n        <TableRow>\n          <TableHead>Feature</TableHead>\n          <TableHead align="right">Jan</TableHead>\n          <TableHead align="right">Feb</TableHead>\n          <TableHead align="right">Mar</TableHead>\n          <TableHead align="right">Apr</TableHead>\n          <TableHead align="right">May</TableHead>\n        </TableRow>\n      </TableHeader>\n      <TableBody>\n        <TableRow>\n          <TableCell>Active Teams</TableCell>\n          <TableCell align="right">89</TableCell>\n          <TableCell align="right">94</TableCell>\n          <TableCell align="right">102</TableCell>\n          <TableCell align="right">108</TableCell>\n          <TableCell align="right">113</TableCell>\n        </TableRow>\n        <TableRow tone="success">\n          <TableCell>Release Velocity</TableCell>\n          <TableCell align="right">+8%</TableCell>\n          <TableCell align="right">+11%</TableCell>\n          <TableCell align="right">+14%</TableCell>\n          <TableCell align="right">+16%</TableCell>\n          <TableCell align="right">+19%</TableCell>\n        </TableRow>\n      </TableBody>\n    </Table>\n  )\n}`,
        render: (
          <Table stickyFirstColumn noWrap variant="matte">
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                <TableHead align="right">Jan</TableHead>
                <TableHead align="right">Feb</TableHead>
                <TableHead align="right">Mar</TableHead>
                <TableHead align="right">Apr</TableHead>
                <TableHead align="right">May</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Active Teams</TableCell>
                <TableCell align="right">89</TableCell>
                <TableCell align="right">94</TableCell>
                <TableCell align="right">102</TableCell>
                <TableCell align="right">108</TableCell>
                <TableCell align="right">113</TableCell>
              </TableRow>
              <TableRow tone="success">
                <TableCell>Release Velocity</TableCell>
                <TableCell align="right">+8%</TableCell>
                <TableCell align="right">+11%</TableCell>
                <TableCell align="right">+14%</TableCell>
                <TableCell align="right">+16%</TableCell>
                <TableCell align="right">+19%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it. Switch the preview stage to Vivid or Photo to see the frosted surface.",
        code: `import { Badge, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Table variant="glass" grid>\n      <TableHeader>\n        <TableRow>\n          <TableHead>Feature</TableHead>\n          <TableHead align="center">Owner</TableHead>\n          <TableHead align="right">Velocity</TableHead>\n          <TableHead align="right">Status</TableHead>\n        </TableRow>\n      </TableHeader>\n      <TableBody>\n        <TableRow>\n          <TableCell truncate>Interactive docs search + semantic indexing</TableCell>\n          <TableCell align="center">Core</TableCell>\n          <TableCell align="right">+18%</TableCell>\n          <TableCell align="right"><Badge variant="glass">On Track</Badge></TableCell>\n        </TableRow>\n        <TableRow>\n          <TableCell truncate>Registry artifact validation pipeline</TableCell>\n          <TableCell align="center">Infra</TableCell>\n          <TableCell align="right">+9%</TableCell>\n          <TableCell align="right"><Badge variant="outline">Monitoring</Badge></TableCell>\n        </TableRow>\n      </TableBody>\n    </Table>\n  )\n}`,
        render: (
          <Table variant="glass" grid>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                <TableHead align="center">Owner</TableHead>
                <TableHead align="right">Velocity</TableHead>
                <TableHead align="right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell truncate>Interactive docs search + semantic indexing</TableCell>
                <TableCell align="center">Core</TableCell>
                <TableCell align="right">+18%</TableCell>
                <TableCell align="right"><Badge variant="glass">On Track</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell truncate>Registry artifact validation pipeline</TableCell>
                <TableCell align="center">Infra</TableCell>
                <TableCell align="right">+9%</TableCell>
                <TableCell align="right"><Badge variant="outline">Monitoring</Badge></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )
      }
    ]
  },

  "data-table": {
    badge: "Primitive / Organism",
    props: [
      { prop: "columns", type: "DataTableColumn<T>[]", description: "Column schema with accessor, sorting, visibility, and custom cell rendering." },
      { prop: "data", type: "T[]", description: "Array of row objects." },
      { prop: "searchable", type: "boolean", defaultValue: "true", description: "Enable built-in text filtering." },
      { prop: "selectable", type: "boolean", defaultValue: "false", description: "Adds row-selection checkboxes." },
      { prop: "pageSize", type: "number", defaultValue: "10", description: "Initial page size." },
      { prop: "pageSizeOptions", type: "number[]", defaultValue: "[10, 20, 50]", description: "Page-size choices shown in toolbar." },
      { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "ambient (glinr)", description: "Surface variant. Omit to follow the ambient design style (glinr by default, plain for minimal, glass for glass)." }
    ],
    accessibility: {
      summary: [
        "Built on semantic table primitives for screen reader compatibility.",
        "Sorting controls are keyboard-focusable buttons in header cells.",
        "Selection checkboxes provide explicit labels."
      ],
      keyboard: [
        { key: "Tab", description: "Move across toolbar, headers, and pagination controls." },
        { key: "Enter / Space", description: "Activate sort, selection, and pagination controls." }
      ],
      aria: [
        '`aria-label` for search and selection controls',
        '`role="checkbox"` for selectable rows',
        "Native table semantics from the base table primitive"
      ]
    },
    reducedMotion: {
      description: "Inherits reduced-motion behavior from Table and action/input primitives.",
      affected: ["background-color", "opacity"]
    },
    examples: [
      {
        title: "Full Featured",
        code: `import { Badge, DataTable } from "@glinui/ui"\n\nconst columns = [\n  { id: "project", header: "Project", accessor: "project" },\n  {\n    id: "status",\n    header: "Status",\n    accessor: "status",\n    cell: ({ value }) => <Badge variant={value === "Active" ? "soft" : "outline"}>{String(value)}</Badge>\n  },\n  { id: "mrr", header: "MRR", accessor: "mrr", align: "right" }\n]\n\nconst data = [\n  { id: "p1", project: "Glin UI", status: "Active", mrr: 18400 },\n  { id: "p2", project: "Glin Docs", status: "Monitoring", mrr: 7920 },\n  { id: "p3", project: "Registry", status: "Active", mrr: 12340 },\n  { id: "p4", project: "CLI", status: "Paused", mrr: 2310 }\n]\n\nexport function Demo() {\n  return (\n    <DataTable\n      columns={columns}\n      data={data}\n      selectable\n      striped\n      stickyHeader\n      grid\n      variant="soft"\n      pageSize={3}\n      getRowId={(row) => row.id}\n    />\n  )\n}`,
        render: (
          <DataTable
            columns={[
              { id: "project", header: "Project", accessor: "project" },
              {
                id: "status",
                header: "Status",
                accessor: "status",
                cell: ({ value }) => (
                  <Badge variant={value === "Active" ? "soft" : "outline"}>{String(value)}</Badge>
                )
              },
              { id: "mrr", header: "MRR", accessor: "mrr", align: "right" }
            ]}
            data={[
              { id: "p1", project: "Glin UI", status: "Active", mrr: 18400 },
              { id: "p2", project: "Glin Docs", status: "Monitoring", mrr: 7920 },
              { id: "p3", project: "Registry", status: "Active", mrr: 12340 },
              { id: "p4", project: "CLI", status: "Paused", mrr: 2310 }
            ]}
            selectable
            striped
            stickyHeader
            grid
            variant="soft"
            pageSize={3}
            getRowId={(row) => String(row.id)}
          />
        )
      }
    ]
  },

  toast: {
    badge: "Primitive / Molecule",
    props: [
      {
        title: "Toaster",
        rows: [
          { prop: "variant", type: '"glinr" | "plain" | "solid" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "ambient style (glinr)", description: "Look of every toast: a glinr card by default, with a leading status bar for success, error, warning and info. `plain` is the shadcn card, `glass` is opt-in and needs a backdrop. Legacy `default` follows the ambient style, `matte` maps to `solid`." },
          { prop: "position", type: '"top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center"', defaultValue: "bottom-right", description: "Position of the toast stack." },
          { prop: "expand", type: "boolean", defaultValue: "false", description: "Expand all toasts by default." },
          { prop: "duration", type: "number", defaultValue: "4000", description: "Default auto-dismiss time in ms." },
          { prop: "visibleToasts", type: "number", defaultValue: "3", description: "Max visible toasts at once." },
          { prop: "closeButton", type: "boolean", defaultValue: "false", description: "Show close button on every toast." },
          { prop: "richColors", type: "boolean", defaultValue: "false", description: "Use Sonner rich colors for semantic types." },
          { prop: "theme", type: '"light" | "dark" | "system"', defaultValue: "system", description: "Color scheme." },
          { prop: "hotkey", type: "string[]", defaultValue: '["altKey", "KeyT"]', description: "Keyboard shortcut to focus toasts." },
          { prop: "dir", type: '"ltr" | "rtl" | "auto"', defaultValue: "auto", description: "Text direction." }
        ]
      },
      {
        title: "toast()",
        rows: [
          { prop: "toast(message, opts?)", type: "function", description: "Show a default toast." },
          { prop: "toast.success(message, opts?)", type: "function", description: "Show a success toast with checkmark icon." },
          { prop: "toast.error(message, opts?)", type: "function", description: "Show an error toast with alert icon." },
          { prop: "toast.warning(message, opts?)", type: "function", description: "Show a warning toast with triangle icon." },
          { prop: "toast.info(message, opts?)", type: "function", description: "Show an info toast with info icon." },
          { prop: "toast.loading(message, opts?)", type: "function", description: "Show a loading toast with spinner." },
          { prop: "toast.promise(promise, opts)", type: "function", description: "Auto loading → success / error based on promise outcome." },
          { prop: "toast.custom(jsx)", type: "function", description: "Render custom JSX as a toast." },
          { prop: "toast.dismiss(id?)", type: "function", description: "Dismiss a specific toast or all toasts." }
        ]
      },
      {
        title: "Toast Options",
        rows: [
          { prop: "description", type: "ReactNode", description: "Secondary text below the title." },
          { prop: "duration", type: "number", defaultValue: "4000", description: "Per-toast auto-dismiss time in ms." },
          { prop: "icon", type: "ReactNode", description: "Custom icon override." },
          { prop: "action", type: "{ label: ReactNode; onClick: () => void }", description: "Action button config." },
          { prop: "cancel", type: "{ label: ReactNode; onClick: () => void }", description: "Cancel button config." },
          { prop: "onDismiss", type: "(toast) => void", description: "Callback when toast is dismissed." },
          { prop: "onAutoClose", type: "(toast) => void", description: "Callback when toast auto-closes." },
          { prop: "dismissible", type: "boolean", defaultValue: "true", description: "Allow swipe/click to dismiss." },
          { prop: "className", type: "string", description: "Per-toast class override." }
        ]
      }
    ],
    accessibility: {
      summary: [
        "Built on Sonner with ARIA live region announcements.",
        "Auto-pause on hover for reading time.",
        "Swipe-to-dismiss with configurable directions.",
        "Keyboard accessible with hotkey support."
      ],
      keyboard: [
        { key: "Escape", description: "Dismiss the focused toast." },
        { key: "Alt+T", description: "Focus the toast region (configurable)." }
      ],
      aria: [
        '`role="status"` on toast region',
        "`aria-live` for live announcements",
        '`aria-label` on close and action buttons'
      ]
    },
    reducedMotion: {
      description: "Slide and opacity transitions respect `prefers-reduced-motion`.",
      affected: ["transform", "opacity"]
    },
    examples: [
      {
        title: "Save with undo",
        description: "A Save button triggers a success toast with an Undo action that reverts the change.",
        code: showcaseS2Code.ToastSaveHero,
        render: <ToastSaveHero />
      },
      {
        title: "Stacked variants",
        description: "Fire several toasts in a row: they stack, collapse and can be dismissed with the close button.",
        code: showcaseS2Code.ToastStackHero,
        render: <ToastStackHero />
      },
      {
        title: "Action Button",
        code: `import { Toaster, toast, Button } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <>\n      <Toaster position="bottom-right" />\n      <Button onClick={() => toast("File deleted", {\n        description: "The file has been moved to trash.",\n        action: { label: "Undo", onClick: () => toast.success("Restored") }\n      })}>\n        With action\n      </Button>\n    </>\n  )\n}`,
        render: <ToastActionDemo />
      },
      {
        title: "Promise Toast",
        code: `import { Toaster, toast, Button } from "@glinui/ui"\n\nexport function Demo() {\n  const fetchData = () => new Promise((resolve) => setTimeout(resolve, 2000))\n  return (\n    <>\n      <Toaster position="bottom-right" />\n      <Button onClick={() => toast.promise(fetchData(), {\n        loading: "Generating report...",\n        success: "Report is ready!",\n        error: "Failed to generate report"\n      })}>\n        Promise toast\n      </Button>\n    </>\n  )\n}`,
        render: <ToastPromiseDemo />
      }
    ]
  },

  tree: {
    badge: "Primitive / Molecule",
    props: [
      { prop: "nodes", type: "TreeNode[]", description: "Array of tree data nodes to render." },
      { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "ambient (glinr)", description: "Surface variant. Omit to follow the ambient design style (glinr by default, plain for minimal, glass for glass)." },
      { prop: "tone", type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"', defaultValue: "neutral", description: "Colour tone for the vocabulary variants." },
      { prop: "defaultExpanded", type: "boolean", defaultValue: "true", description: "Expand all folders by default." }
    ],
    accessibility: {
      summary: [
        "Folder nodes are interactive buttons with expand/collapse behavior.",
        "Linked leaf nodes render as anchor elements.",
        "Tree structure is conveyed visually through indentation and icons."
      ],
      keyboard: [
        { key: "Enter / Space", description: "Toggle folder expand/collapse." },
        { key: "Tab", description: "Navigate between interactive nodes." }
      ],
      aria: []
    },
    reducedMotion: {
      description: "Chevron rotation uses CSS transition that respects `prefers-reduced-motion`.",
      affected: ["transform"]
    },
    examples: [
      {
        title: "File Tree",
        description: "Display a project file structure with folders and linked files.",
        code: `import { Tree } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Tree\n      variant="outline"\n      nodes={[\n        {\n          label: "src",\n          children: [\n            {\n              label: "components",\n              children: [\n                { label: "button.tsx", href: "#" },\n                { label: "input.tsx", href: "#" }\n              ]\n            },\n            { label: "index.ts", href: "#" }\n          ]\n        },\n        { label: "package.json", href: "#" }\n      ]}\n    />\n  )\n}`,
        render: (
          <Tree
            variant="outline"
            nodes={[
              {
                label: "src",
                children: [
                  {
                    label: "components",
                    children: [
                      { label: "button.tsx", href: "#" },
                      { label: "input.tsx", href: "#" }
                    ]
                  },
                  { label: "index.ts", href: "#" }
                ]
              },
              { label: "package.json", href: "#" }
            ]}
          />
        )
      },
      {
        title: "Variants",
        description: "Every vocabulary variant on the default tone. Omit variant to follow the ambient design style.",
        code: `import { Tree } from "@glinui/ui"

export function TreeVariantsDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Tree variant="glinr" nodes={[{ label: "src", children: [{ label: "index.ts" }] }, { label: "package.json" }]} />
      <Tree variant="solid" nodes={[{ label: "src", children: [{ label: "index.ts" }] }, { label: "package.json" }]} />
      <Tree variant="plain" nodes={[{ label: "src", children: [{ label: "index.ts" }] }, { label: "package.json" }]} />
      <Tree variant="soft" nodes={[{ label: "src", children: [{ label: "index.ts" }] }, { label: "package.json" }]} />
      <Tree variant="outline" nodes={[{ label: "src", children: [{ label: "index.ts" }] }, { label: "package.json" }]} />
      <Tree variant="ghost" nodes={[{ label: "src", children: [{ label: "index.ts" }] }, { label: "package.json" }]} />
      <Tree variant="gradient" nodes={[{ label: "src", children: [{ label: "index.ts" }] }, { label: "package.json" }]} />
    </div>
  )
}`,
        render: (
          <div className="grid gap-4 md:grid-cols-2">
            <Tree variant="glinr" nodes={[{ label: "src", children: [{ label: "index.ts" }] }, { label: "package.json" }]} />
            <Tree variant="solid" nodes={[{ label: "src", children: [{ label: "index.ts" }] }, { label: "package.json" }]} />
            <Tree variant="plain" nodes={[{ label: "src", children: [{ label: "index.ts" }] }, { label: "package.json" }]} />
            <Tree variant="soft" nodes={[{ label: "src", children: [{ label: "index.ts" }] }, { label: "package.json" }]} />
            <Tree variant="outline" nodes={[{ label: "src", children: [{ label: "index.ts" }] }, { label: "package.json" }]} />
            <Tree variant="ghost" nodes={[{ label: "src", children: [{ label: "index.ts" }] }, { label: "package.json" }]} />
            <Tree variant="gradient" nodes={[{ label: "src", children: [{ label: "index.ts" }] }, { label: "package.json" }]} />
          </div>
        )
      },
      {
        title: "With Badges",
        description: "Use badges to annotate nodes with status or type information.",
        code: `import { Tree } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Tree\n      variant="default"\n      nodes={[\n        {\n          label: "Components",\n          children: [\n            { label: "button.tsx", href: "#" },\n            { label: "button.test.tsx", href: "#", badge: "test", badgeVariant: "success" }\n          ]\n        },\n        {\n          label: "Hooks",\n          children: [\n            { label: "use-liquid-glass.tsx", href: "#", badge: "new", badgeVariant: "warning" }\n          ]\n        }\n      ]}\n    />\n  )\n}`,
        render: (
          <Tree
            variant="default"
            nodes={[
              {
                label: "Components",
                children: [
                  { label: "button.tsx", href: "#" },
                  { label: "button.test.tsx", href: "#", badge: "test", badgeVariant: "success" }
                ]
              },
              {
                label: "Hooks",
                children: [
                  { label: "use-liquid-glass.tsx", href: "#", badge: "new", badgeVariant: "warning" }
                ]
              }
            ]}
          />
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it. Switch the preview stage to Vivid or Photo to see the frosted surface.",
        code: `import { Tree } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Tree\n      variant="glass"\n      nodes={[\n        {\n          label: "Navigation",\n          children: [\n            { label: "Home", href: "#" },\n            { label: "About", href: "#" },\n            { label: "Contact", href: "#" }\n          ]\n        }\n      ]}\n    />\n  )\n}`,
        render: (
          <Tree
            variant="glass"
            nodes={[
              {
                label: "Navigation",
                children: [
                  { label: "Home", href: "#" },
                  { label: "About", href: "#" },
                  { label: "Contact", href: "#" }
                ]
              }
            ]}
          />
        )
      }
    ]
  },

  tooltip: {
    badge: "Primitive / Atom",
    props: [
      { prop: "variant", type: '"glinr" | "plain" | "solid" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "ambient style (glinr)", description: "TooltipContent look. Omit it for a compact high-contrast pill that inverts per theme scope (dark in light, light in dark). `glass` is opt-in and needs a backdrop. Legacy `default` follows the ambient style, `frosted` maps to `glass`." },
      { prop: "sideOffset", type: "number", defaultValue: "6", description: "Distance from trigger in pixels." },
      { prop: "delayDuration", type: "number", defaultValue: "700", description: "Delay before showing (ms)." },
      { prop: "side", type: '"top" | "right" | "bottom" | "left"', description: "Preferred tooltip position." }
    ],
    accessibility: {
      summary: [
        "Built on Radix Tooltip with `role=\"tooltip\"`.",
        "Shows on hover and focus.",
        "TooltipProvider wraps the usage context."
      ],
      keyboard: [
        { key: "Escape", description: "Dismiss the tooltip when focused." }
      ],
      aria: [
        '`role="tooltip"`',
        "`aria-describedby` linking trigger to tooltip content"
      ]
    },
    reducedMotion: {
      description: "Show/hide transitions respect `prefers-reduced-motion`.",
      affected: ["opacity", "transform"]
    },
    examples: [
      {
        title: "Basic",
        code: `import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, Button } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <TooltipProvider delayDuration={100}>\n      <Tooltip>\n        <TooltipTrigger asChild><Button variant="outline">Hover me</Button></TooltipTrigger>\n        <TooltipContent>Contextual help text.</TooltipContent>\n      </Tooltip>\n    </TooltipProvider>\n  )\n}`,
        render: (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild><Button variant="outline">Hover me</Button></TooltipTrigger>
              <TooltipContent>Contextual help text.</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      }
    ]
  }
}
