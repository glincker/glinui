import type { ComponentDocExtraMap } from "@/lib/component-docs-extra-types"

/** Content migrated from the retired hand-written primitive MDX pages. */
export const componentDocExtrasA: ComponentDocExtraMap = {
  "accordion": {
    accessibility: [
      "Use concise trigger labels."
    ],
    examples: [
      {
        title: "Frosted Variant",
        description: "Heavier frost with stronger blur and an inner glow. Toggle backgrounds above to compare.",
        code: "import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from \"@glinui/ui\"\n\nexport function AccordionFrostedDemo() {\n  return (\n    <Accordion type=\"single\" collapsible>\n      <AccordionItem value=\"one\" variant=\"frosted\">\n        <AccordionTrigger variant=\"frosted\">Installation</AccordionTrigger>\n        <AccordionContent variant=\"frosted\">Run pnpm add @glinui/ui @glinui/tokens to get started.</AccordionContent>\n      </AccordionItem>\n      <AccordionItem value=\"two\" variant=\"frosted\">\n        <AccordionTrigger variant=\"frosted\">Configuration</AccordionTrigger>\n        <AccordionContent variant=\"frosted\">Import the CSS tokens in your root layout file.</AccordionContent>\n      </AccordionItem>\n      <AccordionItem value=\"three\" variant=\"frosted\">\n        <AccordionTrigger variant=\"frosted\">Usage</AccordionTrigger>\n        <AccordionContent variant=\"frosted\">Import components and apply variant props.</AccordionContent>\n      </AccordionItem>\n    </Accordion>\n  )\n}"
      }
    ]
  },
  "alert": {
    accessibility: [
      "Root component uses `role=\"alert\"` by default.",
      "Prefer one alert per context region to avoid screen reader noise."
    ],
    examples: [
      {
        title: "Surface Styles",
        code: "import { Alert, AlertTitle, AlertDescription } from \"@glinui/ui\"\nimport { Bell } from \"@phosphor-icons/react\"\n\nexport function AlertSurfaceDemo() {\n  return (\n    <div className=\"space-y-3\">\n      <Alert variant=\"default\">\n        <Bell className=\"size-4\" />\n        <AlertTitle>Default Surface</AlertTitle>\n        <AlertDescription>Balanced contrast for standard inline system messaging.</AlertDescription>\n      </Alert>\n      <Alert variant=\"glass\">\n        <Bell className=\"size-4\" />\n        <AlertTitle>Glass Surface</AlertTitle>\n        <AlertDescription>Frosted treatment for elevated cards and overlays.</AlertDescription>\n      </Alert>\n      <Alert variant=\"matte\">\n        <Bell className=\"size-4\" />\n        <AlertTitle>Matte Surface</AlertTitle>\n        <AlertDescription>Dense, low-glare treatment for high-density dashboards.</AlertDescription>\n      </Alert>\n      <Alert variant=\"outline\">\n        <Bell className=\"size-4\" />\n        <AlertTitle>Outline Surface</AlertTitle>\n        <AlertDescription>Low-emphasis bordered message without strong fill.</AlertDescription>\n      </Alert>\n    </div>\n  )\n}"
      },
      {
        title: "Sizes",
        code: "import { Alert, AlertTitle, AlertDescription } from \"@glinui/ui\"\n\nexport function AlertSizeDemo() {\n  return (\n    <div className=\"space-y-3\">\n      <Alert size=\"sm\"><AlertTitle>Small</AlertTitle><AlertDescription>Compact alert.</AlertDescription></Alert>\n      <Alert size=\"md\"><AlertTitle>Medium</AlertTitle><AlertDescription>Standard alert.</AlertDescription></Alert>\n      <Alert size=\"lg\"><AlertTitle>Large</AlertTitle><AlertDescription>Expanded alert.</AlertDescription></Alert>\n    </div>\n  )\n}"
      }
    ]
  },
  "alert-dialog": {
    accessibility: [
      "Uses `role=\"alertdialog\"` semantics through Radix.",
      "Focus is trapped inside the dialog while open.",
      "Keep destructive copy explicit in `AlertDialogTitle` and `AlertDialogDescription`."
    ]
  },
  "avatar": {
    accessibility: [
      "Provide a meaningful `alt` for identity-bearing avatars.",
      "Keep consistent avatar sizes in list/table contexts to reduce visual noise.",
      "Fallback initials ensure content remains identifiable when images fail."
    ],
    reducedMotion: "Transition effects on hover (scale, shadow) respect `prefers-reduced-motion` via the `motion-reduce:transition-none` utility.",
    examples: [
      {
        title: "With Images",
        code: "import { Avatar } from \"@glinui/ui\"\n\nexport function AvatarImagesDemo() {\n  return (\n    <div className=\"flex items-center gap-4\">\n      <Avatar src=\"https://api.dicebear.com/9.x/adventurer/svg?seed=Nova\" alt=\"Nova\" variant=\"default\" />\n      <Avatar src=\"https://api.dicebear.com/9.x/lorelei/svg?seed=Kai\" alt=\"Kai\" variant=\"glass\" />\n      <Avatar src=\"https://api.dicebear.com/9.x/bottts/svg?seed=Glin\" alt=\"Glin\" variant=\"liquid\" />\n      <Avatar src=\"https://api.dicebear.com/9.x/pixel-art/svg?seed=Leo\" alt=\"Leo\" variant=\"matte\" />\n      <Avatar src=\"https://api.dicebear.com/9.x/thumbs/svg?seed=Aria\" alt=\"Aria\" variant=\"glow\" />\n    </div>\n  )\n}"
      },
      {
        title: "Sizes",
        description: "Six sizes from xs (24px) to 2xl (80px).",
        code: "import { Avatar } from \"@glinui/ui\"\n\nexport function AvatarSizeDemo() {\n  return (\n    <div className=\"flex items-end gap-3\">\n      <Avatar size=\"xs\" fallback=\"XS\" alt=\"Extra small\" />\n      <Avatar size=\"sm\" fallback=\"SM\" alt=\"Small\" />\n      <Avatar size=\"md\" fallback=\"MD\" alt=\"Medium\" />\n      <Avatar size=\"lg\" fallback=\"LG\" alt=\"Large\" />\n      <Avatar size=\"xl\" fallback=\"XL\" alt=\"Extra large\" />\n      <Avatar size=\"2xl\" fallback=\"2X\" alt=\"Double extra large\" />\n    </div>\n  )\n}"
      },
      {
        title: "Radius Styles",
        code: "import { Avatar } from \"@glinui/ui\"\n\nexport function AvatarRadiusDemo() {\n  return (\n    <div className=\"flex items-center gap-4\">\n      <Avatar radius=\"full\" fallback=\"FU\" variant=\"glass\" />\n      <Avatar radius=\"lg\" fallback=\"LG\" variant=\"glass\" />\n      <Avatar radius=\"md\" fallback=\"MD\" variant=\"glass\" />\n      <Avatar radius=\"square\" fallback=\"SQ\" variant=\"glass\" />\n    </div>\n  )\n}"
      },
      {
        title: "Status Indicator",
        description: "Show online, offline, busy, or away status with an auto-positioned dot."
      },
      {
        title: "Avatar Group",
        description: "Stack avatars with overlap. Set `max` to cap visible count with a `+N` overflow indicator."
      },
      {
        title: "Glass Variants with Status",
        description: "Combine glass surfaces with status indicators for rich profile displays.",
        code: "import { Avatar } from \"@glinui/ui\"\n\nexport function AvatarGlassStatusDemo() {\n  return (\n    <div className=\"flex items-center gap-4\">\n      <Avatar src=\"...\" alt=\"Nova\" variant=\"glass\" size=\"lg\" status=\"online\" />\n      <Avatar src=\"...\" alt=\"Kai\" variant=\"liquid\" size=\"lg\" status=\"away\" />\n      <Avatar src=\"...\" alt=\"Glin\" variant=\"matte\" size=\"lg\" status=\"busy\" />\n      <Avatar src=\"...\" alt=\"Leo\" variant=\"glow\" size=\"lg\" status=\"offline\" />\n    </div>\n  )\n}"
      },
      {
        title: "Copy-Paste Recipes",
        description: "Drop these Tailwind classes directly into your markup for common avatar patterns."
      },
      {
        title: "Image Error Recovery",
        description: "A broken image source falls back instantly, and if `src` later changes to a valid URL, the image renders again.",
        code: "import { Avatar } from \"@glinui/ui\"\n\nexport function AvatarErrorDemo() {\n  return (\n    <div className=\"flex items-center gap-3\">\n      <Avatar src=\"/broken-src.png\" alt=\"Broken\" fallback=\"BR\" variant=\"matte\" />\n      <Avatar src=\"https://api.dicebear.com/9.x/adventurer/svg?seed=Replaced\" alt=\"Recovered\" variant=\"glass\" />\n    </div>\n  )\n}"
      }
    ]
  },
  "badge": {
    accessibility: [
      "Use badge text that remains understandable out of context.",
      "Do not rely on color-only meaning."
    ],
    reducedMotion: "Badge is static and motion-independent.",
    examples: [
      {
        title: "Variants",
        code: "import { Badge } from \"@glinui/ui\"\n\nexport function BadgeVariantDemo() {\n  return (\n    <div className=\"flex flex-wrap gap-2\">\n      <Badge>Default</Badge>\n      <Badge variant=\"glass\">Glass</Badge>\n      <Badge variant=\"outline\">Outline</Badge>\n      <Badge variant=\"ghost\">Ghost</Badge>\n    </div>\n  )\n}"
      },
      {
        title: "Sizes",
        code: "import { Badge } from \"@glinui/ui\"\n\nexport function BadgeSizeDemo() {\n  return (\n    <div className=\"flex flex-wrap items-center gap-2\">\n      <Badge size=\"sm\">Small</Badge>\n      <Badge size=\"md\">Medium</Badge>\n      <Badge size=\"lg\">Large</Badge>\n    </div>\n  )\n}"
      }
    ]
  },
  "button": {
    examples: [
      {
        title: "Size"
      },
      {
        title: "Variants",
        description: "Toggle backgrounds (top-right) to see how each variant adapts to different surfaces.",
        code: "import { Button } from \"@glinui/ui\"\n\nexport function ButtonVariantDemo() {\n  return (\n    <div className=\"flex flex-wrap items-center gap-2\">\n      <Button>Default</Button>\n      <Button variant=\"glass\">Glass</Button>\n      <Button variant=\"frosted\">Frosted</Button>\n      <Button variant=\"liquid\">Liquid</Button>\n      <Button variant=\"matte\">Matte</Button>\n      <Button variant=\"glow\">Glow</Button>\n      <Button variant=\"outline\">Outline</Button>\n      <Button variant=\"ghost\">Ghost</Button>\n    </div>\n  )\n}"
      },
      {
        title: "With Icon",
        code: "import { ArrowRight } from \"@phosphor-icons/react\"\nimport { Button } from \"@glinui/ui\"\n\nexport function ButtonWithIconDemo() {\n  return (\n    <Button variant=\"liquid\" className=\"gap-2\">\n      Continue\n      <ArrowRight className=\"size-4\" />\n    </Button>\n  )\n}"
      },
      {
        title: "Button Group",
        code: "import { Button } from \"@glinui/ui\"\n\nexport function ButtonGroupDemo() {\n  return (\n    <div className=\"inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/45 p-1\">\n      <Button size=\"sm\" className=\"rounded-full\">Day</Button>\n      <Button size=\"sm\" variant=\"ghost\" className=\"rounded-full\">Week</Button>\n      <Button size=\"sm\" variant=\"ghost\" className=\"rounded-full\">Month</Button>\n    </div>\n  )\n}"
      },
      {
        title: "RTL",
        description: "Use `dir=\"rtl\"` on a layout wrapper to mirror button flow for right-to-left locales.",
        code: "import { Button } from \"@glinui/ui\"\n\nexport function ButtonRtlDemo() {\n  return (\n    <div dir=\"rtl\" className=\"flex justify-center\">\n      <div className=\"flex items-center gap-2\">\n        <Button variant=\"glass\">حفظ</Button>\n        <Button variant=\"outline\">إلغاء</Button>\n      </div>\n    </div>\n  )\n}"
      },
      {
        title: "Internationalized Labels",
        description: "Keep labels outside the component and inject locale strings. Code blocks in docs stay `ltr` for readability. ```tsx import { Button } from \"@glinui/ui\" const copy = { en: { save: \"Save\", cancel: \"Cancel\" }, ar: { save: \"حفظ\", cancel: \"إلغاء\" } } export function SaveActions({ locale = \"en\" }: { locale?: \"en\" | \"ar\" }) { const t = copy[locale] return ( <div dir={locale === \"ar\" ? \"rtl\" : \"ltr\"} className=\"flex gap-2\"> <Button>{t.save}</Button> <Button variant=\"ghost\">{t.cancel}</Button> </div> ) } ```"
      }
    ]
  },
  "card": {
    accessibility: [
      "Card uses semantic section content you provide.",
      "Prefer heading levels that match page hierarchy."
    ],
    reducedMotion: "Card supports reduced-motion fallback for transition-heavy states.",
    examples: [
      {
        title: "Variants",
        description: "Use the background toggle (top-right) to test each variant against different surfaces.",
        code: "import { Card, CardHeader, CardTitle, CardDescription, CardContent } from \"@glinui/ui\"\n\nexport function CardVariantDemo() {\n  return (\n    <div className=\"grid gap-3 md:grid-cols-2\">\n      <Card variant=\"glass\"><CardHeader><CardTitle>Glass</CardTitle></CardHeader><CardContent>Standard translucent surface with subtle refraction.</CardContent></Card>\n      <Card variant=\"frosted\"><CardHeader><CardTitle>Frosted</CardTitle></CardHeader><CardContent>Heavy frost with stronger blur and inner glow.</CardContent></Card>\n      <Card variant=\"liquid\"><CardHeader><CardTitle>Liquid</CardTitle></CardHeader><CardContent>Wet-glass effect with radial highlights.</CardContent></Card>\n      <Card variant=\"matte\"><CardHeader><CardTitle>Matte</CardTitle></CardHeader><CardContent>Solid opaque surface with soft shadow.</CardContent></Card>\n    </div>\n  )\n}"
      },
      {
        title: "Frosted on Vivid Background",
        description: "The frosted variant shines against colorful backgrounds where the blur and inner glow create visible depth.",
        code: "import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from \"@glinui/ui\"\n\nexport function CardFrostedDemo() {\n  return (\n    <Card variant=\"frosted\" className=\"max-w-sm\">\n      <CardHeader>\n        <CardTitle>Analytics</CardTitle>\n        <CardDescription>Real-time dashboard metrics.</CardDescription>\n      </CardHeader>\n      <CardContent>\n        <div className=\"text-3xl font-bold tracking-tight\">12,847</div>\n        <p className=\"text-sm text-neutral-600 dark:text-neutral-300\">+23% from last week</p>\n      </CardContent>\n      <CardFooter className=\"text-xs text-neutral-500\">Updated 2 min ago</CardFooter>\n    </Card>\n  )\n}"
      }
    ]
  },
  "checkbox": {
    accessibility: [
      "Built on `@radix-ui/react-checkbox`, which renders a fully accessible checkbox with keyboard support.",
      "Always pair with a `<label>` via `htmlFor` / `id` or wrap both in a `<label>` element.",
      "The `required` prop sets `aria-required` on the underlying button element.",
      "Space toggles the checkbox; Enter is not handled by default (browser behavior)."
    ],
    reducedMotion: "The check indicator uses a brief scale/fade transition that is suppressed when `prefers-reduced-motion: reduce` is active.",
    examples: [
      {
        title: "Checked by Default",
        code: "import { Checkbox } from \"@glinui/ui\"\n\nexport function CheckboxDefaultCheckedDemo() {\n  return (\n    <div className=\"flex items-center gap-2\">\n      <Checkbox id=\"checked\" defaultChecked />\n      <label htmlFor=\"checked\" className=\"text-sm\">Subscribed to newsletter</label>\n    </div>\n  )\n}"
      },
      {
        title: "Surface Variants",
        code: "import { Checkbox } from \"@glinui/ui\"\n\nexport function CheckboxVariantsDemo() {\n  return (\n    <div className=\"flex flex-wrap items-center gap-3\">\n      <Checkbox variant=\"default\" defaultChecked aria-label=\"Default\" />\n      <Checkbox variant=\"glass\" defaultChecked aria-label=\"Glass\" />\n      <Checkbox variant=\"liquid\" defaultChecked aria-label=\"Liquid\" />\n      <Checkbox variant=\"matte\" defaultChecked aria-label=\"Matte\" />\n      <Checkbox variant=\"outline\" defaultChecked aria-label=\"Outline\" />\n    </div>\n  )\n}"
      },
      {
        title: "With Form Label",
        code: "import { Checkbox } from \"@glinui/ui\"\n\nexport function CheckboxFormLabelDemo() {\n  return (\n    <div className=\"space-y-2\">\n      <div className=\"flex items-center gap-2\">\n        <Checkbox id=\"terms\" required name=\"terms\" />\n        <label htmlFor=\"terms\" className=\"text-sm\">I agree to the terms of service</label>\n      </div>\n      <div className=\"flex items-center gap-2\">\n        <Checkbox id=\"privacy\" name=\"privacy\" />\n        <label htmlFor=\"privacy\" className=\"text-sm\">I agree to the privacy policy</label>\n      </div>\n    </div>\n  )\n}"
      }
    ]
  },
  "chip": {
    accessibility: [
      "Use descriptive text that conveys meaning without relying on color alone.",
      "Pair `tone` with a text label or icon label so screen readers communicate intent.",
      "If the chip is interactive, wrap it in a `<button>` or use an anchor, Chip itself is a display element.",
      "Avoid using Chip as the sole status indicator; supplement with accessible text where needed."
    ],
    reducedMotion: "Chip is a static display primitive with no animation. No reduced-motion considerations apply.",
    examples: [
      {
        title: "Variants",
        description: "The `variant` prop controls the surface treatment, background fill, glass blur, border-only, or transparent ghost.",
        code: "import { Chip } from \"@glinui/ui\"\n\nexport function ChipVariantDemo() {\n  return (\n    <div className=\"flex flex-wrap gap-2\">\n      <Chip variant=\"default\">Default</Chip>\n      <Chip variant=\"glass\">Glass</Chip>\n      <Chip variant=\"outline\">Outline</Chip>\n      <Chip variant=\"ghost\">Ghost</Chip>\n    </div>\n  )\n}"
      },
      {
        title: "Sizes",
        code: "import { Chip } from \"@glinui/ui\"\n\nexport function ChipSizeDemo() {\n  return (\n    <div className=\"flex flex-wrap items-center gap-2\">\n      <Chip size=\"sm\">Small</Chip>\n      <Chip size=\"md\">Medium</Chip>\n      <Chip size=\"lg\">Large</Chip>\n    </div>\n  )\n}"
      },
      {
        title: "With Icons",
        description: "Wrap an icon and text inside `Chip` for labeled status tags. The `rounded-full` shape accommodates inline flex children naturally.",
        code: "import { Chip } from \"@glinui/ui\"\nimport { CheckCircle, Warning, XCircle } from \"@phosphor-icons/react\"\n\nexport function ChipIconDemo() {\n  return (\n    <div className=\"flex flex-wrap gap-2\">\n      <Chip tone=\"success\">\n        <CheckCircle className=\"h-3 w-3\" />\n        Approved\n      </Chip>\n      <Chip tone=\"warning\">\n        <Warning className=\"h-3 w-3\" />\n        Pending\n      </Chip>\n      <Chip tone=\"danger\">\n        <XCircle className=\"h-3 w-3\" />\n        Rejected\n      </Chip>\n    </div>\n  )\n}"
      },
      {
        title: "Combining Variant and Tone",
        description: "Mix any surface `variant` with any semantic `tone` for full compositional flexibility.",
        code: "import { Chip } from \"@glinui/ui\"\n\nexport function ChipComboDemo() {\n  return (\n    <div className=\"flex flex-wrap gap-2\">\n      <Chip variant=\"glass\" tone=\"info\">Glass Info</Chip>\n      <Chip variant=\"outline\" tone=\"success\">Outline Success</Chip>\n      <Chip variant=\"ghost\" tone=\"danger\">Ghost Danger</Chip>\n    </div>\n  )\n}"
      }
    ]
  },
  "code": {
    accessibility: [
      "`Code` renders a native `<code>` element, which assistive technologies announce as a code region.",
      "Screen readers may vocalize code content differently, keep snippets short and purposeful.",
      "Do not use `Code` for decorative styling; only wrap content that is genuinely code or a technical literal.",
      "Ensure sufficient contrast between the code token and the surrounding prose in all variants."
    ],
    reducedMotion: "`Code` is a static inline element with no animation. No reduced-motion considerations apply.",
    examples: [
      {
        title: "Variants",
        description: "The `variant` prop adjusts the surface behind the code token, filled, glass-blurred, border-only, or fully transparent.",
        code: "import { Code } from \"@glinui/ui\"\n\nexport function CodeVariantDemo() {\n  return (\n    <div className=\"flex flex-wrap gap-3\">\n      <Code variant=\"default\">default</Code>\n      <Code variant=\"glass\">glass</Code>\n      <Code variant=\"outline\">outline</Code>\n      <Code variant=\"ghost\">ghost</Code>\n    </div>\n  )\n}"
      },
      {
        title: "Sizes",
        description: "Scale the monospace font with `size`. All three sizes remain optically balanced against body text at the corresponding text scale.",
        code: "import { Code } from \"@glinui/ui\"\n\nexport function CodeSizeDemo() {\n  return (\n    <div className=\"flex flex-wrap items-center gap-3\">\n      <Code size=\"sm\">sm code</Code>\n      <Code size=\"md\">md code</Code>\n      <Code size=\"lg\">lg code</Code>\n    </div>\n  )\n}"
      },
      {
        title: "Inline in Paragraph",
        description: "`Code` is designed to sit inside flowing text without disrupting line height. Drop it directly into a `<p>` element alongside prose.",
        code: "import { Code } from \"@glinui/ui\"\n\nexport function CodeInlineDemo() {\n  return (\n    <p className=\"text-sm leading-relaxed text-neutral-700 dark:text-neutral-300\">\n      Run <Code>pnpm dev</Code> to start the development server, then open{\" \"}\n      <Code>http://localhost:3000</Code> in your browser. Set the{\" \"}\n      <Code>NODE_ENV</Code> environment variable to <Code>production</Code>{\" \"}\n      before deploying.\n    </p>\n  )\n}"
      },
      {
        title: "Glass Variant in Context",
        description: "The `glass` variant pairs well with translucent surfaces like cards or overlays.",
        code: "import { Code } from \"@glinui/ui\"\n\nexport function CodeGlassDemo() {\n  return (\n    <p className=\"text-sm text-neutral-700 dark:text-neutral-300\">\n      Import the hook with{\" \"}\n      <Code variant=\"glass\">import {\"{ useLiquidGlass }\"} from \"@glinui/ui\"</Code>\n      {\" \"}and attach the returned <Code variant=\"glass\">ref</Code> to your element.\n    </p>\n  )\n}"
      }
    ]
  },
  "command": {
    accessibility: [
      "Keyboard navigation and roving focus are provided by `cmdk`.",
      "Do not rely on placeholder text as a label. Provide an explicit `aria-label` or visible label for `CommandInput`.",
      "Keep command groups concise to reduce cognitive load.",
      "`CommandEmpty` provides a visible fallback for screen readers."
    ],
    reducedMotion: "Command interactions are state-based with no transform-heavy animations. Motion respects `prefers-reduced-motion` automatically.",
    examples: [
      {
        title: "With Groups",
        description: "Use `CommandGroup` with a `heading` to visually separate related actions. Add `CommandSeparator` between groups.",
        code: "import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from \"@glinui/ui\"\n\nexport function CommandGroupsDemo() {\n  return (\n    <Command className=\"max-w-md\">\n      <CommandInput aria-label=\"Command search\" placeholder=\"Search...\" />\n      <CommandList>\n        <CommandEmpty>No results found.</CommandEmpty>\n        <CommandGroup heading=\"Files\">\n          <CommandItem>Open file</CommandItem>\n          <CommandItem>New file</CommandItem>\n        </CommandGroup>\n        <CommandSeparator />\n        <CommandGroup heading=\"Workspace\">\n          <CommandItem>Settings</CommandItem>\n          <CommandItem>Extensions</CommandItem>\n        </CommandGroup>\n      </CommandList>\n    </Command>\n  )\n}"
      },
      {
        title: "With Shortcuts",
        description: "Append `CommandShortcut` inside any `CommandItem` to display a keyboard shortcut hint.",
        code: "import { Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandShortcut } from \"@glinui/ui\"\n\nexport function CommandShortcutsDemo() {\n  return (\n    <Command className=\"max-w-md\">\n      <CommandInput aria-label=\"Command search\" placeholder=\"Search...\" />\n      <CommandList>\n        <CommandGroup heading=\"Navigation\">\n          <CommandItem>\n            Profile\n            <CommandShortcut>⌘P</CommandShortcut>\n          </CommandItem>\n          <CommandItem>\n            New Window\n            <CommandShortcut>⌘N</CommandShortcut>\n          </CommandItem>\n          <CommandItem>\n            Settings\n            <CommandShortcut>⌘,</CommandShortcut>\n          </CommandItem>\n        </CommandGroup>\n      </CommandList>\n    </Command>\n  )\n}"
      },
      {
        title: "Empty State",
        description: "`CommandEmpty` renders when the search query returns no matching items.",
        code: "import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from \"@glinui/ui\"\n\nexport function CommandEmptyDemo() {\n  return (\n    <Command className=\"max-w-md\">\n      <CommandInput aria-label=\"Command search\" placeholder=\"Search for something rare...\" />\n      <CommandList>\n        <CommandEmpty>No results found.</CommandEmpty>\n        <CommandGroup heading=\"Items\">\n          <CommandItem>Visible item</CommandItem>\n        </CommandGroup>\n      </CommandList>\n    </Command>\n  )\n}"
      }
    ]
  },
  "counter": {
    accessibility: [
      "`Counter` should be accompanied by a visible label in its surrounding context (e.g., \"Notifications: 12\") so the number is not the sole conveyor of meaning.",
      "When used as a live notification badge, wrap the containing element with `aria-live=\"polite\"` so screen readers announce value changes.",
      "The truncated `max+` format must be interpreted from context, add an `aria-label` to clarify if necessary (e.g., `aria-label=\"More than 99 notifications\"`).",
      "Do not rely on the counter's color alone to communicate urgency; pair with surrounding labels."
    ],
    reducedMotion: "`Counter` is a static numeric display with no animation. No reduced-motion considerations apply.",
    examples: [
      {
        title: "Overflow",
        description: "When `value` exceeds `max` (default `99`), the display collapses to `max+` to prevent layout shift.",
        code: "import { Counter } from \"@glinui/ui\"\n\nexport function CounterOverflowDemo() {\n  return (\n    <div className=\"flex items-center gap-4\">\n      <Counter value={42} />\n      <Counter value={99} />\n      <Counter value={150} />\n      <Counter value={1200} />\n    </div>\n  )\n}"
      },
      {
        title: "Custom Max",
        description: "Override the collapse threshold with `max` to suit different contexts, notification trays, cart counts, or mention lists.",
        code: "import { Counter } from \"@glinui/ui\"\n\nexport function CounterCustomMaxDemo() {\n  return (\n    <div className=\"flex items-center gap-4\">\n      <Counter value={42} max={50} />\n      <Counter value={55} max={50} />\n      <Counter value={9} max={9} />\n      <Counter value={10} max={9} />\n    </div>\n  )\n}"
      },
      {
        title: "Variants",
        code: "import { Counter } from \"@glinui/ui\"\n\nexport function CounterVariantDemo() {\n  return (\n    <div className=\"flex flex-wrap items-center gap-3\">\n      <Counter value={7} variant=\"default\" />\n      <Counter value={7} variant=\"glass\" />\n      <Counter value={7} variant=\"outline\" />\n      <Counter value={7} variant=\"ghost\" />\n    </div>\n  )\n}"
      },
      {
        title: "Sizes",
        code: "import { Counter } from \"@glinui/ui\"\n\nexport function CounterSizeDemo() {\n  return (\n    <div className=\"flex flex-wrap items-center gap-3\">\n      <Counter value={12} size=\"sm\" />\n      <Counter value={12} size=\"md\" />\n      <Counter value={12} size=\"lg\" />\n    </div>\n  )\n}"
      }
    ]
  },
  "data-table": {
    accessibility: [
      "Built on semantic table elements (`table`, `thead`, `tbody`, `th`, and `td`) for screen-reader compatibility.",
      "Keep column names concise and unique so assistive tech announces context clearly."
    ],
    reducedMotion: "DataTable inherits reduced-motion behavior from `Table`, `Input`, `Select`, and `Button`. Hover/focus transitions are non-essential and respect user preference settings.",
    examples: [
      {
        title: "Compact Board With Sticky Header",
        code: "import { DataTable } from \"@glinui/ui\"\n\nexport function DataTableCompactDemo() {\n  return (\n    <DataTable\n      columns={[\n        { id: \"account\", header: \"Account\", accessor: \"account\", sortable: true },\n        { id: \"stage\", header: \"Stage\", accessor: \"stage\", sortable: true },\n        { id: \"owner\", header: \"Owner\", accessor: \"owner\", sortable: true },\n        { id: \"arr\", header: \"ARR\", accessor: \"arr\", sortable: true, align: \"right\" },\n      ]}\n      data={[\n        { id: \"op-4012\", account: \"Northwind\", stage: \"Qualified\", owner: \"Maya\", arr: \"$42,000\" },\n        { id: \"op-4015\", account: \"Stellar Forge\", stage: \"Proposal\", owner: \"Ilya\", arr: \"$18,500\" },\n        { id: \"op-4018\", account: \"Blue Harbor\", stage: \"Won\", owner: \"Rae\", arr: \"$63,200\" },\n        { id: \"op-4021\", account: \"Arcadia Labs\", stage: \"Discovery\", owner: \"Nico\", arr: \"$11,900\" },\n        { id: \"op-4022\", account: \"Halcyon\", stage: \"Qualified\", owner: \"Leah\", arr: \"$27,600\" },\n      ]}\n      getRowId={(row) => row.id}\n      variant=\"matte\"\n      size=\"sm\"\n      stickyHeader\n      containerClassName=\"max-h-72\"\n      pageSize={5}\n      searchable\n    />\n  )\n}"
      },
      {
        title: "Selection + Column Controls",
        description: "Enable `selectable` and hide low-priority columns with `hidden`/`canHide` to keep dense dashboards readable.",
        code: "import { DataTable } from \"@glinui/ui\"\n\nexport function DataTableSelectionDemo() {\n  return (\n    <DataTable\n      columns={[\n        { id: \"account\", header: \"Account\", accessor: \"account\", sortable: true },\n        { id: \"stage\", header: \"Stage\", accessor: \"stage\", sortable: true },\n        { id: \"owner\", header: \"Owner\", accessor: \"owner\", sortable: true, hidden: true, canHide: true },\n        { id: \"arr\", header: \"ARR\", accessor: \"arr\", sortable: true, align: \"right\" },\n      ]}\n      data={[\n        { id: \"op-4012\", account: \"Northwind\", stage: \"Qualified\", owner: \"Maya\", arr: \"$42,000\" },\n        { id: \"op-4015\", account: \"Stellar Forge\", stage: \"Proposal\", owner: \"Ilya\", arr: \"$18,500\" },\n        { id: \"op-4018\", account: \"Blue Harbor\", stage: \"Won\", owner: \"Rae\", arr: \"$63,200\" },\n        { id: \"op-4021\", account: \"Arcadia Labs\", stage: \"Discovery\", owner: \"Nico\", arr: \"$11,900\" },\n      ]}\n      selectable\n      variant=\"outline\"\n      pageSize={4}\n    />\n  )\n}"
      },
      {
        title: "Server Data Pattern",
        description: "For large datasets, fetch and paginate on the server, then pass only the current page to `DataTable`. Use this pattern when your API owns filtering, sorting, and pagination.",
        code: "\"use client\"\n\nimport * as React from \"react\"\nimport { DataTable } from \"@glinui/ui\"\n\nconst columns = [\n  { id: \"account\", header: \"Account\", accessor: \"account\", sortable: true },\n  { id: \"stage\", header: \"Stage\", accessor: \"stage\", sortable: true },\n  { id: \"arr\", header: \"ARR\", accessor: \"arr\", sortable: true, align: \"right\" }\n]\n\nexport function DataTableServerPattern() {\n  const [rows, setRows] = React.useState([])\n  const [query, setQuery] = React.useState(\"\")\n  const [page, setPage] = React.useState(1)\n\n  React.useEffect(() => {\n    const params = new URLSearchParams({ q: query, page: String(page) })\n    fetch(`/api/pipeline?${params.toString()}`)\n      .then((res) => res.json())\n      .then((payload) => setRows(payload.items))\n  }, [query, page])\n\n  return (\n    <DataTable\n      columns={columns}\n      data={rows}\n      searchable={false}\n      pageSize={20}\n      variant=\"glass\"\n      emptyMessage=\"No matching records.\"\n    />\n  )\n}"
      }
    ]
  },
  "dropdown-menu": {
    accessibility: [
      "Supports keyboard navigation, escape, and focus restore."
    ],
    reducedMotion: "Menu open/close should remain readable without animation."
  },
  "heading": {
    accessibility: [
      "Always use headings in a logical, non-skipping order (h1 → h2 → h3) to maintain a coherent document outline for screen readers.",
      "The `level` prop controls the rendered HTML tag, never override this with CSS `display` tricks that break semantics.",
      "Decoupling `level` from `size` lets you meet visual design requirements without compromising heading hierarchy.",
      "Avoid using multiple `level={1}` headings on a single page; pages should have exactly one `<h1>`."
    ],
    reducedMotion: "`Heading` is a static text primitive with no animation. No reduced-motion considerations apply.",
    examples: [
      {
        title: "Variants",
        description: "The `variant` prop applies a surface treatment, useful when a heading needs to sit on a glass card or a transparent overlay.",
        code: "import { Heading } from \"@glinui/ui\"\n\nexport function HeadingVariantDemo() {\n  return (\n    <div className=\"space-y-2\">\n      <Heading variant=\"default\">Default Heading</Heading>\n      <Heading variant=\"glass\">Glass Heading</Heading>\n      <Heading variant=\"outline\">Outline Heading</Heading>\n      <Heading variant=\"ghost\">Ghost Heading</Heading>\n    </div>\n  )\n}"
      },
      {
        title: "Sizes",
        code: "import { Heading } from \"@glinui/ui\"\n\nexport function HeadingSizeDemo() {\n  return (\n    <div className=\"space-y-2\">\n      <Heading size=\"sm\">Small heading</Heading>\n      <Heading size=\"md\">Medium heading</Heading>\n      <Heading size=\"lg\">Large heading</Heading>\n    </div>\n  )\n}"
      },
      {
        title: "Independent Level and Size",
        description: "The key feature of `Heading` is that semantic level and visual size are fully independent. An `h3` can visually appear as large as a page title, and an `h1` can be styled small for compact interfaces, all without breaking document outline order.",
        code: "import { Heading } from \"@glinui/ui\"\n\nexport function HeadingIndependentDemo() {\n  return (\n    <div className=\"space-y-4\">\n      {/* Visually large, semantically an h3 */}\n      <Heading level={3} size=\"lg\">\n        Large h3, section title styled like a hero heading\n      </Heading>\n\n      {/* Visually small, semantically an h1, e.g., page header in a compact layout */}\n      <Heading level={1} size=\"sm\">\n        Small h1, compact page title\n      </Heading>\n\n      {/* h4 at default md size, standard subsection */}\n      <Heading level={4} size=\"md\">\n        Default h4 subsection\n      </Heading>\n    </div>\n  )\n}"
      },
      {
        title: "Full Level Range",
        code: "import { Heading } from \"@glinui/ui\"\n\nexport function HeadingLevelsDemo() {\n  return (\n    <div className=\"space-y-1\">\n      <Heading level={1}>h1, Page title</Heading>\n      <Heading level={2}>h2, Section</Heading>\n      <Heading level={3}>h3, Subsection</Heading>\n      <Heading level={4}>h4, Group</Heading>\n      <Heading level={5}>h5, Detail</Heading>\n      <Heading level={6}>h6, Caption-level</Heading>\n    </div>\n  )\n}"
      }
    ]
  },
  "hover-card": {
    accessibility: [
      "Use concise supplemental content, not primary actions.",
      "Keep the trigger semantic and focusable (`button`, `a`, etc.).",
      "For interactive panels, prefer `Popover`."
    ],
    examples: [
      {
        title: "Delays and Surfaces",
        code: "import { Badge, HoverCard, HoverCardContent, HoverCardTrigger } from \"@glinui/ui\"\n\nexport function HoverCardDelayDemo() {\n  return (\n    <div className=\"flex flex-wrap items-center gap-4\">\n      <HoverCard openDelay={0} closeDelay={150}>\n        <HoverCardTrigger asChild>\n          <button className=\"text-sm font-medium underline decoration-dotted underline-offset-4\">\n            Instant preview\n          </button>\n        </HoverCardTrigger>\n        <HoverCardContent variant=\"glass\" size=\"sm\">\n          <div className=\"space-y-2\">\n            <Badge variant=\"glass\">glass</Badge>\n            <p className=\"text-xs text-neutral-600 dark:text-neutral-300\">Open delay: 0ms</p>\n          </div>\n        </HoverCardContent>\n      </HoverCard>\n      <HoverCard openDelay={500} closeDelay={250}>\n        <HoverCardTrigger asChild>\n          <button className=\"text-sm font-medium underline decoration-dotted underline-offset-4\">\n            Delayed preview\n          </button>\n        </HoverCardTrigger>\n        <HoverCardContent variant=\"outline\" size=\"md\">\n          <p className=\"text-xs text-neutral-600 dark:text-neutral-300\">\n            Opens after 500ms with outline surface.\n          </p>\n        </HoverCardContent>\n      </HoverCard>\n    </div>\n  )\n}"
      }
    ]
  },
  "icon-frame": {
    accessibility: [
      "`IconFrame` is a decorative container. Icons inside it should have `aria-hidden=\"true\"` when accompanied by visible text labels.",
      "When used as a standalone icon button (e.g., wrapped in a `<button>`), provide an `aria-label` on the button element.",
      "Text initials inside `IconFrame` should be supplemented with a surrounding `aria-label` or `title` for screen readers when used as an avatar.",
      "The frame itself carries no interactive semantics, wrap it in a `<button>` or `<a>` when interaction is needed."
    ],
    reducedMotion: "`IconFrame` is a static layout primitive with no animation. No reduced-motion considerations apply.",
    examples: [
      {
        title: "Variants",
        description: "Choose a surface treatment to match the surrounding context, filled for feature highlights, glass for overlay panels, outline for list rows, ghost for minimal layouts.",
        code: "import { IconFrame } from \"@glinui/ui\"\nimport { Sparkle } from \"@phosphor-icons/react\"\n\nexport function IconFrameVariantDemo() {\n  return (\n    <div className=\"flex flex-wrap items-center gap-3\">\n      <IconFrame variant=\"default\">\n        <Sparkle className=\"h-5 w-5\" />\n      </IconFrame>\n      <IconFrame variant=\"glass\">\n        <Sparkle className=\"h-5 w-5\" />\n      </IconFrame>\n      <IconFrame variant=\"outline\">\n        <Sparkle className=\"h-5 w-5\" />\n      </IconFrame>\n      <IconFrame variant=\"ghost\">\n        <Sparkle className=\"h-5 w-5\" />\n      </IconFrame>\n    </div>\n  )\n}"
      },
      {
        title: "Sizes",
        description: "The `size` prop controls fixed square dimensions. All three sizes use `rounded-xl` corners and auto-center children.",
        code: "import { IconFrame } from \"@glinui/ui\"\nimport { Lightning } from \"@phosphor-icons/react\"\n\nexport function IconFrameSizeDemo() {\n  return (\n    <div className=\"flex flex-wrap items-center gap-3\">\n      <IconFrame size=\"sm\">\n        <Lightning className=\"h-3.5 w-3.5\" />\n      </IconFrame>\n      <IconFrame size=\"md\">\n        <Lightning className=\"h-5 w-5\" />\n      </IconFrame>\n      <IconFrame size=\"lg\">\n        <Lightning className=\"h-7 w-7\" />\n      </IconFrame>\n    </div>\n  )\n}"
      },
      {
        title: "With Initials",
        description: "Pass short text children instead of an icon for product logos, user avatars, or app abbreviations.",
        code: "import { IconFrame } from \"@glinui/ui\"\n\nexport function IconFrameInitialsDemo() {\n  return (\n    <div className=\"flex flex-wrap items-center gap-3\">\n      <IconFrame variant=\"default\" size=\"md\">GU</IconFrame>\n      <IconFrame variant=\"glass\" size=\"md\">AB</IconFrame>\n      <IconFrame variant=\"outline\" size=\"md\">JD</IconFrame>\n      <IconFrame variant=\"ghost\" size=\"md\">MK</IconFrame>\n    </div>\n  )\n}"
      },
      {
        title: "Feature List Pattern",
        description: "Combine `IconFrame` with a heading and description to build a feature grid. The consistent square dimensions keep rows optically aligned.",
        code: "import { IconFrame } from \"@glinui/ui\"\nimport { Sparkle, Lightning } from \"@phosphor-icons/react\"\n\nexport function IconFrameFeatureDemo() {\n  return (\n    <div className=\"space-y-4 max-w-sm\">\n      <div className=\"flex items-start gap-3\">\n        <IconFrame variant=\"glass\" size=\"md\">\n          <Sparkle className=\"h-5 w-5\" />\n        </IconFrame>\n        <div>\n          <p className=\"text-sm font-medium\">Liquid Glass</p>\n          <p className=\"text-xs text-neutral-500\">SVG displacement refraction effects.</p>\n        </div>\n      </div>\n      <div className=\"flex items-start gap-3\">\n        <IconFrame variant=\"glass\" size=\"md\">\n          <Lightning className=\"h-5 w-5\" />\n        </IconFrame>\n        <div>\n          <p className=\"text-sm font-medium\">Fast by Default</p>\n          <p className=\"text-xs text-neutral-500\">Zero runtime overhead for static tokens.</p>\n        </div>\n      </div>\n    </div>\n  )\n}"
      }
    ]
  },
  "input": {
    accessibility: [
      "Always associate an `<Input>` with a visible `<label>` or provide an `aria-label`.",
      "Placeholder text is not a label; treat it as a hint only.",
      "The `type` prop maps directly to the native input element, enabling built-in browser behaviors (e.g., `type=\"email\"` triggers mobile keyboards).",
      "Disabled inputs are announced as such by screen readers via the native `disabled` attribute."
    ],
    reducedMotion: "Input does not use animation to communicate state changes; focus and hover styles are purely visual.",
    examples: [
      {
        title: "Sizes",
        code: "import { Input } from \"@glinui/ui\"\n\nexport function InputSizesDemo() {\n  return (\n    <div className=\"space-y-3\">\n      <Input size=\"sm\" aria-label=\"Small input\" placeholder=\"Small input\" />\n      <Input size=\"md\" aria-label=\"Medium input\" placeholder=\"Medium input\" />\n      <Input size=\"lg\" aria-label=\"Large input\" placeholder=\"Large input\" />\n    </div>\n  )\n}"
      },
      {
        title: "Surface Variants",
        code: "import { Input } from \"@glinui/ui\"\n\nexport function InputVariantsDemo() {\n  return (\n    <div className=\"space-y-3\">\n      <Input variant=\"default\" aria-label=\"Default input\" placeholder=\"Default\" />\n      <Input variant=\"glass\" aria-label=\"Glass input\" placeholder=\"Glass\" />\n      <Input variant=\"liquid\" aria-label=\"Liquid input\" placeholder=\"Liquid\" />\n      <Input variant=\"matte\" aria-label=\"Matte input\" placeholder=\"Matte\" />\n      <Input variant=\"outline\" aria-label=\"Outline input\" placeholder=\"Outline\" />\n      <Input variant=\"filled\" aria-label=\"Filled input\" placeholder=\"Filled\" />\n    </div>\n  )\n}"
      },
      {
        title: "Disabled",
        code: "import { Input } from \"@glinui/ui\"\n\nexport function InputDisabledDemo() {\n  return <Input aria-label=\"Disabled input\" disabled placeholder=\"Disabled input\" />\n}"
      },
      {
        title: "With Placeholder",
        code: "import { Input } from \"@glinui/ui\"\n\nexport function InputPlaceholderDemo() {\n  return <Input aria-label=\"Search input\" placeholder=\"Search anything...\" />\n}"
      },
      {
        title: "Password Type",
        code: "import { Input } from \"@glinui/ui\"\n\nexport function InputPasswordDemo() {\n  return <Input aria-label=\"Password input\" type=\"password\" placeholder=\"Enter password...\" />\n}"
      }
    ]
  },
  "kbd": {
    accessibility: [
      "`Kbd` renders a native `<kbd>` element which is recognized by assistive technologies as denoting keyboard input.",
      "Screen readers will announce the content of each `<kbd>` element; use descriptive key names or Unicode symbols that read naturally.",
      "Avoid using `<Kbd>` purely for styling, reserve it for actual keyboard key references."
    ],
    reducedMotion: "`Kbd` is a static element with no animation. It is unaffected by `prefers-reduced-motion`.",
    examples: [
      {
        title: "Shortcuts",
        description: "Combine multiple `Kbd` elements with a `+` separator to represent compound key shortcuts.",
        code: "import { Kbd } from \"@glinui/ui\"\n\nexport function KbdShortcutDemo() {\n  return (\n    <div className=\"flex items-center gap-1\">\n      <Kbd>⌘</Kbd>\n      <span className=\"text-neutral-400\">+</span>\n      <Kbd>K</Kbd>\n    </div>\n  )\n}"
      },
      {
        title: "Variants",
        code: "import { Kbd } from \"@glinui/ui\"\n\nexport function KbdVariantDemo() {\n  return (\n    <div className=\"flex flex-wrap items-center gap-2\">\n      <Kbd variant=\"default\">⌘</Kbd>\n      <Kbd variant=\"glass\">⌘</Kbd>\n      <Kbd variant=\"outline\">⌘</Kbd>\n      <Kbd variant=\"ghost\">⌘</Kbd>\n    </div>\n  )\n}"
      },
      {
        title: "Sizes",
        code: "import { Kbd } from \"@glinui/ui\"\n\nexport function KbdSizeDemo() {\n  return (\n    <div className=\"flex flex-wrap items-center gap-2\">\n      <Kbd size=\"sm\">⌘</Kbd>\n      <Kbd size=\"md\">⌘</Kbd>\n      <Kbd size=\"lg\">⌘</Kbd>\n    </div>\n  )\n}"
      },
      {
        title: "Multi-Key Sequences",
        description: "String full keyboard sequences for step-by-step instructions.",
        code: "import { Kbd } from \"@glinui/ui\"\n\nexport function KbdSequenceDemo() {\n  return (\n    <div className=\"flex items-center gap-1\">\n      <Kbd>⌃</Kbd>\n      <span className=\"text-neutral-400\">+</span>\n      <Kbd>⇧</Kbd>\n      <span className=\"text-neutral-400\">+</span>\n      <Kbd>P</Kbd>\n    </div>\n  )\n}"
      }
    ]
  },
  "label": {
    accessibility: [
      "Always provide `htmlFor` to associate the label with its form control, clicking the label should move focus to the input.",
      "Do not use `Label` as decorative text; prefer `Text` or plain `<span>` elements for non-form contexts.",
      "When marking required fields, include both the visual asterisk and an `aria-required=\"true\"` attribute on the control."
    ],
    reducedMotion: "`Label` is a static element with no animation. It is unaffected by `prefers-reduced-motion`.",
    examples: [
      {
        title: "Variants",
        code: "import { Label } from \"@glinui/ui\"\n\nexport function LabelVariantDemo() {\n  return (\n    <div className=\"flex flex-col gap-2\">\n      <Label variant=\"default\">Default label</Label>\n      <Label variant=\"glass\">Glass label</Label>\n      <Label variant=\"outline\">Outline label</Label>\n      <Label variant=\"ghost\">Ghost label</Label>\n    </div>\n  )\n}"
      },
      {
        title: "Sizes",
        code: "import { Label } from \"@glinui/ui\"\n\nexport function LabelSizeDemo() {\n  return (\n    <div className=\"flex flex-col gap-2\">\n      <Label size=\"sm\">Small label</Label>\n      <Label size=\"md\">Medium label</Label>\n      <Label size=\"lg\">Large label</Label>\n    </div>\n  )\n}"
      },
      {
        title: "With Checkbox",
        code: "import { Label, Checkbox } from \"@glinui/ui\"\n\nexport function LabelCheckboxDemo() {\n  return (\n    <div className=\"flex items-center gap-2\">\n      <Checkbox id=\"terms\" />\n      <Label htmlFor=\"terms\">I agree to the terms and conditions</Label>\n    </div>\n  )\n}"
      },
      {
        title: "Required Pattern",
        description: "Use an asterisk span inside `Label` to signal required fields. Pair with `aria-required` on the control.",
        code: "import { Label, Input } from \"@glinui/ui\"\n\nexport function LabelRequiredDemo() {\n  return (\n    <div className=\"flex flex-col gap-1.5\">\n      <Label htmlFor=\"username\">\n        Username\n        <span className=\"ml-1 text-red-500\" aria-hidden=\"true\">*</span>\n      </Label>\n      <Input id=\"username\" aria-required=\"true\" placeholder=\"johndoe\" />\n    </div>\n  )\n}"
      }
    ]
  }
}
