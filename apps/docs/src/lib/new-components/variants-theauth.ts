/** Code-only extra examples and meta for the theauth parity variants and new components. */

export type VariantsTheauthExample = {
  title: string
  description: string
  code: string
}

export type VariantsTheauthMetaEntry = {
  id: string
  title: string
  description: string
  badge: string
  maturity: "beta"
  files: string[]
  dependencies: string[]
}

export const variantsTheauthMeta: VariantsTheauthMetaEntry[] = [
  {
    id: "copy-button",
    title: "Copy Button",
    description: "Raised pill that copies text, announces the result and resets after 1.6 seconds.",
    badge: "Primitive / Atom",
    maturity: "beta",
    files: ["copy-button.tsx"],
    dependencies: ["@phosphor-icons/react"]
  },
  {
    id: "code-panel",
    title: "Code Panel",
    description: "Raised header bar over an inset code well with tok-k, tok-s, tok-c and tok-f token classes.",
    badge: "Primitive / Molecule",
    maturity: "beta",
    files: ["code-panel.tsx", "card.tsx", "copy-button.tsx"],
    dependencies: ["@phosphor-icons/react"]
  },
  {
    id: "install-command",
    title: "Install Command",
    description: "Package manager tabs, a $ prefixed command and a copy button inside a code panel.",
    badge: "Primitive / Molecule",
    maturity: "beta",
    files: ["install-command.tsx", "code-panel.tsx", "copy-button.tsx", "tabs.tsx", "card.tsx"],
    dependencies: ["@phosphor-icons/react", "@radix-ui/react-tabs"]
  }
]

export const variantsTheauthExtras: Record<string, VariantsTheauthExample[]> = {
  button: [
    {
      title: "Key and key-white",
      description: "Tactile gradient keys. Pressed state moves 1px and scales to 0.98. Use iconNudge for an arrow that slides on hover.",
      code: `import { Button } from "@glinui/ui"\nimport { ArrowRight } from "@phosphor-icons/react"\n\nexport function Demo() {\n  return (\n    <div className="flex flex-wrap gap-3">\n      <Button variant="key" iconNudge>Get started <ArrowRight /></Button>\n      <Button variant="key-white" size="sm">Docs</Button>\n      <Button variant="raised">Raised ring</Button>\n    </div>\n  )\n}`
    }
  ],
  card: [
    {
      title: "Lift surface",
      description: "elevation 1-3, face 0-2 and ring default|hot|brand opt a card into the lift technique. inset renders a recessed well.",
      code: `import { Card } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="grid gap-4 sm:grid-cols-3">\n      <Card elevation={1} face={0}>Elevation 1</Card>\n      <Card elevation={2} face={1} ring="hot">Hot ring</Card>\n      <Card elevation={3} face={2} ring="brand">Brand ring</Card>\n      <Card inset>Inset well</Card>\n    </div>\n  )\n}`
    }
  ],
  badge: [
    {
      title: "Raised badge with status dot",
      description: "raised uses the lift ring. dot adds a glowing status dot, asChild renders a link.",
      code: `import { Badge } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="flex flex-wrap gap-2">\n      <Badge variant="raised" dot dotTone="ok">All systems normal</Badge>\n      <Badge variant="raised" dot dotTone="live" asChild>\n        <a href="/changelog">What is new</a>\n      </Badge>\n    </div>\n  )\n}`
    }
  ],
  text: [
    {
      title: "Eyebrow, marks and lead",
      description: "Mono uppercase eyebrow with an accent dot, inline live and violet marks, and a lead paragraph.",
      code: `import { Heading, Text } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="grid gap-3">\n      <Text variant="eyebrow" dot>Platform</Text>\n      <Heading level={2}>Ship <Text as="span" tone="live">faster</Text> and <Text as="span" tone="violet">safer</Text></Heading>\n      <Text lead>Lead copy sits at 1.1875rem with a 56ch measure.</Text>\n    </div>\n  )\n}`
    }
  ],
  heading: [
    {
      title: "Display, h2 and h3 sizes",
      description: "display is fluid (clamp), weight 300, tracking -0.03em with balanced wrapping.",
      code: `import { Heading } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="grid gap-4">\n      <Heading level={1} size="display">Identity for every agent</Heading>\n      <Heading level={2} size="h2">Section heading</Heading>\n      <Heading level={3} size="h3">Subsection</Heading>\n    </div>\n  )\n}`
    }
  ],
  link: [
    {
      title: "Arrow link",
      description: "Accent link whose arrow moves 3px on hover. The motion is disabled under prefers-reduced-motion.",
      code: `import { Link } from "@glinui/ui"\n\nexport function Demo() {\n  return <Link variant="arrow" href="/docs">Read the docs</Link>\n}`
    }
  ],
  tabs: [
    {
      title: "Keys variant",
      description: "Raised pill track where the selected tab is a white gradient key. Pass variant to list, triggers and content.",
      code: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Tabs defaultValue="a">\n      <TabsList variant="keys" aria-label="Plan">\n        <TabsTrigger variant="keys" value="a">Cloud</TabsTrigger>\n        <TabsTrigger variant="keys" value="b">Self-hosted</TabsTrigger>\n      </TabsList>\n      <TabsContent variant="keys" value="a">Cloud panel</TabsContent>\n      <TabsContent variant="keys" value="b">Self-hosted panel</TabsContent>\n    </Tabs>\n  )\n}`
    }
  ],
  accordion: [
    {
      title: "Lift accordion",
      description: "The list is one lift surface with hairline dividers and a rotating caret. Items inherit the variant from the root.",
      code: `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Accordion type="single" collapsible variant="lift">\n      <AccordionItem value="1">\n        <AccordionTrigger>Is it free?</AccordionTrigger>\n        <AccordionContent>Yes, up to 10k monthly active users.</AccordionContent>\n      </AccordionItem>\n      <AccordionItem value="2">\n        <AccordionTrigger>Can I self-host?</AccordionTrigger>\n        <AccordionContent>Yes.</AccordionContent>\n      </AccordionItem>\n    </Accordion>\n  )\n}`
    },
    {
      title: "Native details fallback (SSR, no JS)",
      description: "Same geometry with plain details and summary for static pages. Swap to the Radix accordion after hydration without layout shift.",
      code: `export function Demo() {\n  return (\n    <div className="overflow-hidden rounded-xl border border-transparent [box-shadow:var(--elev-2)] [background:var(--sheen)_padding-box,linear-gradient(var(--face-0),var(--face-0))_padding-box,var(--ring)_border-box]">\n      <details className="group border-b border-[var(--line-soft)] last:border-b-0">\n        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3.5 text-sm font-medium [&::-webkit-details-marker]:hidden">\n          Is it free?\n          <span className="transition-transform group-open:rotate-180" aria-hidden="true">v</span>\n        </summary>\n        <p className="px-4 pb-4 text-sm text-[var(--color-muted)]">Yes.</p>\n      </details>\n    </div>\n  )\n}`
    }
  ],
  table: [
    {
      title: "Lift table with YesNo cells",
      description: "variant lift turns the overflow wrapper into a lift surface. wide sets a minimum width so it scrolls on small screens.",
      code: `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, YesNo } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Table variant="lift" wide interactive={false}>\n      <TableHeader>\n        <TableRow>\n          <TableHead>Feature</TableHead>\n          <TableHead align="center">Us</TableHead>\n          <TableHead align="center">Them</TableHead>\n        </TableRow>\n      </TableHeader>\n      <TableBody>\n        <TableRow>\n          <TableCell>Self-host</TableCell>\n          <TableCell align="center"><YesNo value /></TableCell>\n          <TableCell align="center"><YesNo value={false} /></TableCell>\n        </TableRow>\n      </TableBody>\n    </Table>\n  )\n}`
    }
  ],
  alert: [
    {
      title: "Note and flag",
      description: "note is a raised callout. flag adds a violet ring and violet title.",
      code: `import { Alert, AlertDescription, AlertTitle } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="grid gap-3">\n      <Alert variant="note"><AlertTitle>Note</AlertTitle><AlertDescription>Keys rotate every 90 days.</AlertDescription></Alert>\n      <Alert variant="flag"><AlertTitle>Self-hosted only</AlertTitle><AlertDescription>Not available on cloud.</AlertDescription></Alert>\n    </div>\n  )\n}`
    }
  ],
  "icon-frame": [
    {
      title: "Raised icon tile",
      description: "Lift surface tile for feature icons.",
      code: `import { IconFrame } from "@glinui/ui"\nimport { ShieldCheck } from "@phosphor-icons/react"\n\nexport function Demo() {\n  return <IconFrame variant="raised" size="lg"><ShieldCheck size={20} /></IconFrame>\n}`
    }
  ],
  separator: [
    {
      title: "Hairline",
      description: "A 1px divider that fades out at both ends, lit from the top.",
      code: `import { Separator } from "@glinui/ui"\n\nexport function Demo() {\n  return <Separator variant="hairline" />\n}`
    }
  ]
}
