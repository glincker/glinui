import type { ComponentDocExtraMap } from "@/lib/component-docs-extra-types"

/** Content migrated from the retired hand-written primitive MDX pages. */
export const componentDocExtrasB: ComponentDocExtraMap = {
  "link": {
    accessibility: [
      "`Link` renders a native `<a>` element, which is keyboard-focusable by default.",
      "A visible focus ring is applied via the design token system, do not suppress it with `outline-none` without a custom focus style.",
      "For external links, always include `rel=\"noopener noreferrer\"` to prevent tab-napping.",
      "If the link text is not self-descriptive (e.g. \"click here\"), add an `aria-label` describing the destination."
    ],
    reducedMotion: "`Link` has no animation and is unaffected by `prefers-reduced-motion`.",
    examples: [
      {
        title: "Variants",
        code: "import { Link } from \"@glinui/ui\"\n\nexport function LinkVariantDemo() {\n  return (\n    <div className=\"flex flex-wrap gap-4\">\n      <Link href=\"#\" variant=\"default\">Default</Link>\n      <Link href=\"#\" variant=\"glass\">Glass</Link>\n      <Link href=\"#\" variant=\"outline\">Outline</Link>\n      <Link href=\"#\" variant=\"ghost\">Ghost</Link>\n    </div>\n  )\n}"
      },
      {
        title: "Without Underline",
        description: "Disable the underline decoration for inline link usage or icon-only anchors.",
        code: "import { Link } from \"@glinui/ui\"\n\nexport function LinkNoUnderlineDemo() {\n  return (\n    <div className=\"flex flex-wrap gap-4\">\n      <Link href=\"#\">With underline</Link>\n      <Link href=\"#\" underline={false}>Without underline</Link>\n    </div>\n  )\n}"
      },
      {
        title: "Sizes",
        code: "import { Link } from \"@glinui/ui\"\n\nexport function LinkSizeDemo() {\n  return (\n    <div className=\"flex flex-wrap items-center gap-4\">\n      <Link href=\"#\" size=\"sm\">Small</Link>\n      <Link href=\"#\" size=\"md\">Medium</Link>\n      <Link href=\"#\" size=\"lg\">Large</Link>\n    </div>\n  )\n}"
      },
      {
        title: "External Link",
        description: "Pass standard anchor attributes like `target` and `rel` for external URLs.",
        code: "import { Link } from \"@glinui/ui\"\n\nexport function LinkExternalDemo() {\n  return (\n    <Link href=\"https://glinui.dev\" target=\"_blank\" rel=\"noopener noreferrer\">\n      Open Glin UI site ↗\n    </Link>\n  )\n}"
      }
    ]
  },
  "modal": {
    accessibility: [
      "Focus is trapped inside the dialog while open.",
      "`Escape` closes the dialog and returns focus to the trigger.",
      "The backdrop overlay blocks interaction with background content."
    ],
    reducedMotion: "The overlay fade and content scale animations respect `prefers-reduced-motion` and collapse to instant transitions.",
    examples: [
      {
        title: "With Form Content",
        description: "Place form fields inside the body area between `ModalHeader` and `ModalFooter`.",
        code: "import { Button, Modal, ModalTrigger, ModalClose, ModalContent, ModalHeader, ModalFooter, ModalTitle, ModalDescription } from \"@glinui/ui\"\n\nexport function ModalFormDemo() {\n  return (\n    <Modal>\n      <ModalTrigger asChild>\n        <Button variant=\"glass\">Edit Details</Button>\n      </ModalTrigger>\n      <ModalContent variant=\"matte\">\n        <ModalHeader>\n          <ModalTitle>Account Settings</ModalTitle>\n          <ModalDescription>Update your display name and email address.</ModalDescription>\n        </ModalHeader>\n        <div className=\"space-y-3 py-1\">\n          <div className=\"space-y-1\">\n            <Label htmlFor=\"modal-name\">Display Name</Label>\n            <Input id=\"modal-name\" variant=\"glass\" placeholder=\"Your name\" />\n          </div>\n          <div className=\"space-y-1\">\n            <Label htmlFor=\"modal-email\">Email</Label>\n            <Input id=\"modal-email\" type=\"email\" variant=\"glass\" placeholder=\"you@example.com\" />\n          </div>\n        </div>\n        <ModalFooter>\n          <ModalClose asChild>\n            <Button variant=\"ghost\">Cancel</Button>\n          </ModalClose>\n          <Button variant=\"liquid\">Save changes</Button>\n        </ModalFooter>\n      </ModalContent>\n    </Modal>\n  )\n}"
      },
      {
        title: "Frosted Variant",
        description: "Use `variant=\"frosted\"` for a heavier frost with stronger blur and inner glow. Great for prominent dialogs.",
        code: "import { Button, Modal, ModalTrigger, ModalClose, ModalContent, ModalHeader, ModalFooter, ModalTitle, ModalDescription } from \"@glinui/ui\"\n\nexport function ModalFrostedDemo() {\n  return (\n    <Modal>\n      <ModalTrigger asChild>\n        <Button variant=\"frosted\">Frosted Modal</Button>\n      </ModalTrigger>\n      <ModalContent variant=\"frosted\">\n        <ModalHeader>\n          <ModalTitle>Frosted Glass</ModalTitle>\n          <ModalDescription>Heavy frost with 40px blur, 200% saturation, and inner glow.</ModalDescription>\n        </ModalHeader>\n        <ModalFooter>\n          <ModalClose asChild>\n            <Button variant=\"ghost\">Close</Button>\n          </ModalClose>\n          <Button variant=\"liquid\">Continue</Button>\n        </ModalFooter>\n      </ModalContent>\n    </Modal>\n  )\n}"
      },
      {
        title: "Confirmation Dialog",
        description: "Use a short `ModalDescription` and a destructive action button for irreversible operations.",
        code: "import { Button, Modal, ModalTrigger, ModalClose, ModalContent, ModalHeader, ModalFooter, ModalTitle, ModalDescription } from \"@glinui/ui\"\n\nexport function ModalConfirmDemo() {\n  return (\n    <Modal>\n      <ModalTrigger asChild>\n        <Button variant=\"matte\">Delete Project</Button>\n      </ModalTrigger>\n      <ModalContent variant=\"glass\" size=\"sm\">\n        <ModalHeader>\n          <ModalTitle>Are you sure?</ModalTitle>\n          <ModalDescription>\n            This action cannot be undone. The project and all its data will be permanently deleted.\n          </ModalDescription>\n        </ModalHeader>\n        <ModalFooter>\n          <ModalClose asChild>\n            <Button variant=\"ghost\">Cancel</Button>\n          </ModalClose>\n          <Button variant=\"liquid\">Delete</Button>\n        </ModalFooter>\n      </ModalContent>\n    </Modal>\n  )\n}"
      }
    ]
  },
  "popover": {
    accessibility: [
      "Keep popover content concise and task-focused."
    ],
    reducedMotion: "Popover remains functional and readable with reduced motion settings.",
    examples: [
      {
        title: "Glass",
        code: "import { Popover, PopoverTrigger, PopoverContent } from \"@glinui/ui\"\n\nexport function PopoverGlassDemo() {\n  return (\n    <Popover>\n      <PopoverTrigger variant=\"glass\">Filter</PopoverTrigger>\n      <PopoverContent variant=\"glass\" className=\"space-y-2\">\n        <p className=\"text-sm\">Filter options</p>\n      </PopoverContent>\n    </Popover>\n  )\n}"
      }
    ]
  },
  "progress": {
    accessibility: [
      "Root uses Radix Progress semantics with `role=\"progressbar\"`.",
      "Circular variant also exposes `role=\"progressbar\"` with proper value attrs.",
      "Provide `aria-label` or external label for non-visual users.",
      "Values are clamped between `0` and `100`."
    ],
    reducedMotion: "Width transitions are disabled when `prefers-reduced-motion` is enabled.",
    examples: [
      {
        title: "Variants",
        code: "import { Progress } from \"@glinui/ui\"\n\nexport function ProgressVariantDemo() {\n  return (\n    <div className=\"space-y-3\">\n      <Progress value={52} />\n      <Progress variant=\"glass\" value={68} />\n      <Progress variant=\"liquid\" value={82} />\n      <Progress variant=\"matte\" value={38} />\n    </div>\n  )\n}"
      },
      {
        title: "Sizes",
        code: "import { Progress } from \"@glinui/ui\"\n\nexport function ProgressSizeDemo() {\n  return (\n    <div className=\"space-y-3\">\n      <Progress size=\"sm\" value={30} />\n      <Progress size=\"md\" value={50} />\n      <Progress size=\"lg\" value={80} />\n    </div>\n  )\n}"
      },
      {
        title: "Circular Progress",
        code: "import { ProgressCircle } from \"@glinui/ui\"\n\nexport function ProgressCircleDemo() {\n  return (\n    <div className=\"flex flex-wrap items-center gap-5\">\n      <ProgressCircle size=\"sm\" value={28} aria-label=\"Small progress\" />\n      <ProgressCircle size=\"md\" variant=\"glass\" value={64} aria-label=\"Glass progress\" />\n      <ProgressCircle size=\"lg\" variant=\"liquid\" value={86} aria-label=\"Liquid progress\" />\n    </div>\n  )\n}"
      }
    ]
  },
  "radio-group": {
    accessibility: [
      "Built on `@radix-ui/react-radio-group`, which follows the [WAI-ARIA Radio Group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/).",
      "Arrow keys move focus and selection between items within the group.",
      "Each `RadioGroupItem` must have a corresponding `<label>` linked via `id` / `htmlFor`.",
      "The group can be given a label via `aria-label` or `aria-labelledby` on `RadioGroup`."
    ],
    reducedMotion: "The fill indicator animation on selection is removed when `prefers-reduced-motion: reduce` is detected.",
    examples: [
      {
        title: "Default Value",
        code: "import { RadioGroup, RadioGroupItem } from \"@glinui/ui\"\n\nexport function RadioGroupDefaultValueDemo() {\n  return (\n    <RadioGroup defaultValue=\"monthly\">\n      <div className=\"flex items-center gap-2\">\n        <RadioGroupItem value=\"monthly\" id=\"monthly\" />\n        <label htmlFor=\"monthly\" className=\"text-sm\">Monthly billing</label>\n      </div>\n      <div className=\"flex items-center gap-2\">\n        <RadioGroupItem value=\"annual\" id=\"annual\" />\n        <label htmlFor=\"annual\" className=\"text-sm\">Annual billing</label>\n      </div>\n    </RadioGroup>\n  )\n}"
      },
      {
        title: "Disabled Item",
        code: "import { RadioGroup, RadioGroupItem } from \"@glinui/ui\"\n\nexport function RadioGroupDisabledItemDemo() {\n  return (\n    <RadioGroup defaultValue=\"light\">\n      <div className=\"flex items-center gap-2\">\n        <RadioGroupItem value=\"light\" id=\"light\" />\n        <label htmlFor=\"light\" className=\"text-sm\">Light</label>\n      </div>\n      <div className=\"flex items-center gap-2\">\n        <RadioGroupItem value=\"dark\" id=\"dark\" />\n        <label htmlFor=\"dark\" className=\"text-sm\">Dark</label>\n      </div>\n      <div className=\"flex items-center gap-2\">\n        <RadioGroupItem value=\"system\" id=\"system\" disabled />\n        <label htmlFor=\"system\" className=\"text-sm text-neutral-400\">System (unavailable)</label>\n      </div>\n    </RadioGroup>\n  )\n}"
      },
      {
        title: "Horizontal",
        code: "import { RadioGroup, RadioGroupItem } from \"@glinui/ui\"\n\nexport function RadioGroupHorizontalDemo() {\n  return (\n    <RadioGroup defaultValue=\"xs\" orientation=\"horizontal\" className=\"flex gap-6\">\n      <div className=\"flex items-center gap-2\">\n        <RadioGroupItem value=\"xs\" id=\"xs\" />\n        <label htmlFor=\"xs\" className=\"text-sm\">XS</label>\n      </div>\n      <div className=\"flex items-center gap-2\">\n        <RadioGroupItem value=\"sm\" id=\"sm-size\" />\n        <label htmlFor=\"sm-size\" className=\"text-sm\">SM</label>\n      </div>\n      <div className=\"flex items-center gap-2\">\n        <RadioGroupItem value=\"md\" id=\"md-size\" />\n        <label htmlFor=\"md-size\" className=\"text-sm\">MD</label>\n      </div>\n      <div className=\"flex items-center gap-2\">\n        <RadioGroupItem value=\"lg\" id=\"lg-size\" />\n        <label htmlFor=\"lg-size\" className=\"text-sm\">LG</label>\n      </div>\n    </RadioGroup>\n  )\n}"
      },
      {
        title: "Item Variants",
        code: "import { RadioGroup, RadioGroupItem } from \"@glinui/ui\"\n\nexport function RadioGroupVariantDemo() {\n  return (\n    <RadioGroup defaultValue=\"glass\" orientation=\"horizontal\" className=\"flex items-center gap-4\">\n      <RadioGroupItem value=\"default\" variant=\"default\" aria-label=\"Default\" />\n      <RadioGroupItem value=\"glass\" variant=\"glass\" aria-label=\"Glass\" />\n      <RadioGroupItem value=\"liquid\" variant=\"liquid\" aria-label=\"Liquid\" />\n      <RadioGroupItem value=\"matte\" variant=\"matte\" aria-label=\"Matte\" />\n      <RadioGroupItem value=\"outline\" variant=\"outline\" aria-label=\"Outline\" />\n    </RadioGroup>\n  )\n}"
      },
      {
        title: "Item Sizes",
        code: "import { RadioGroup, RadioGroupItem } from \"@glinui/ui\"\n\nexport function RadioGroupSizeDemo() {\n  return (\n    <RadioGroup defaultValue=\"md\" orientation=\"horizontal\" className=\"flex items-center gap-4\">\n      <RadioGroupItem value=\"sm\" size=\"sm\" aria-label=\"Small\" />\n      <RadioGroupItem value=\"md\" size=\"md\" aria-label=\"Medium\" />\n      <RadioGroupItem value=\"lg\" size=\"lg\" aria-label=\"Large\" />\n    </RadioGroup>\n  )\n}"
      }
    ]
  },
  "select": {
    accessibility: [
      "Renders a native `<select>` element for maximum browser and assistive technology compatibility.",
      "Pair with a `<label>` using `htmlFor` or provide an `aria-label` when no visible label exists.",
      "Placeholder text should not be used as the sole accessible label.",
      "Disabled individual options use the native `disabled` attribute on `<option>` elements."
    ],
    reducedMotion: "Select does not use custom animations; open/close behavior is controlled by the browser's native dropdown.",
    examples: [
      {
        title: "Surface Variants",
        code: "import { Select } from \"@glinui/ui\"\n\nconst options = [\n  { label: \"Alpha\", value: \"alpha\" },\n  { label: \"Beta\", value: \"beta\" }\n]\n\nexport function SelectVariantsDemo() {\n  return (\n    <div className=\"space-y-3\">\n      <Select variant=\"default\" aria-label=\"Default select\" options={options} placeholder=\"Default\" />\n      <Select variant=\"glass\" aria-label=\"Glass select\" options={options} placeholder=\"Glass\" />\n      <Select variant=\"liquid\" aria-label=\"Liquid select\" options={options} placeholder=\"Liquid\" />\n      <Select variant=\"matte\" aria-label=\"Matte select\" options={options} placeholder=\"Matte\" />\n      <Select variant=\"outline\" aria-label=\"Outline select\" options={options} placeholder=\"Outline\" />\n      <Select variant=\"ghost\" aria-label=\"Ghost select\" options={options} placeholder=\"Ghost\" />\n    </div>\n  )\n}"
      },
      {
        title: "With Placeholder",
        code: "import { Select } from \"@glinui/ui\"\n\nexport function SelectPlaceholderDemo() {\n  return (\n    <Select\n      aria-label=\"Placeholder select\"\n      options={[{ label: \"Option A\", value: \"a\" }, { label: \"Option B\", value: \"b\" }]}\n      placeholder=\"Choose an option...\"\n    />\n  )\n}"
      },
      {
        title: "Disabled Option",
        code: "import { Select } from \"@glinui/ui\"\n\nexport function SelectDisabledOptionDemo() {\n  return (\n    <Select\n      aria-label=\"Status select\"\n      options={[\n        { label: \"Available\", value: \"available\" },\n        { label: \"Unavailable\", value: \"unavailable\", disabled: true },\n        { label: \"Also available\", value: \"also\" }\n      ]}\n      placeholder=\"Select status\"\n    />\n  )\n}"
      },
      {
        title: "Disabled Select",
        code: "import { Select } from \"@glinui/ui\"\n\nexport function SelectDisabledDemo() {\n  return (\n    <Select\n      aria-label=\"Disabled select\"\n      disabled\n      options={[{ label: \"React\", value: \"react\" }]}\n      placeholder=\"Disabled select\"\n    />\n  )\n}"
      }
    ]
  },
  "separator": {
    accessibility: [
      "Use `decorative={false}` for separators that convey structural meaning.",
      "Use `orientation=\"vertical\"` for column-like content splits."
    ],
    reducedMotion: "Separator is a static element and does not use motion.",
    examples: [
      {
        title: "Variants",
        code: "import { Separator } from \"@glinui/ui\"\n\nexport function SeparatorVariantDemo() {\n  return (\n    <div className=\"space-y-4\">\n      <Separator variant=\"default\" />\n      <Separator variant=\"glass\" />\n      <Separator variant=\"outline\" />\n      <Separator variant=\"ghost\" />\n    </div>\n  )\n}"
      },
      {
        title: "Vertical",
        description: "Render inside a flex container with an explicit height to display a vertical divider.",
        code: "import { Separator } from \"@glinui/ui\"\n\nexport function SeparatorVerticalDemo() {\n  return (\n    <div className=\"flex h-8 items-center gap-4\">\n      <span className=\"text-sm\">Left</span>\n      <Separator orientation=\"vertical\" />\n      <span className=\"text-sm\">Right</span>\n    </div>\n  )\n}"
      },
      {
        title: "Sizes",
        code: "import { Separator } from \"@glinui/ui\"\n\nexport function SeparatorSizeDemo() {\n  return (\n    <div className=\"space-y-4\">\n      <Separator size=\"sm\" />\n      <Separator size=\"md\" />\n      <Separator size=\"lg\" />\n    </div>\n  )\n}"
      },
      {
        title: "Decorative vs Semantic",
        description: "By default separators are decorative (`aria-hidden`). Set `decorative={false}` for separators that carry structural meaning for assistive technology.",
        code: "import { Separator } from \"@glinui/ui\"\n\nexport function SeparatorDecorativeDemo() {\n  return (\n    <div className=\"space-y-4\">\n      <div className=\"space-y-2\">\n        <p className=\"text-xs text-neutral-500 dark:text-neutral-400\">decorative (default)</p>\n        <Separator decorative />\n      </div>\n      <div className=\"space-y-2\">\n        <p className=\"text-xs text-neutral-500 dark:text-neutral-400\">semantic</p>\n        <Separator decorative={false} />\n      </div>\n    </div>\n  )\n}"
      }
    ]
  },
  "sheet": {
    accessibility: [
      "Focus is trapped while open and restored on close."
    ],
    examples: [
      {
        title: "Glass Side Sheet",
        code: "import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from \"@glinui/ui\"\n\nexport function SheetGlassDemo() {\n  return (\n    <Sheet>\n      <SheetTrigger variant=\"glass\">Open settings</SheetTrigger>\n      <SheetContent variant=\"glass\" side=\"right\">\n        <SheetHeader>\n          <SheetTitle>Workspace</SheetTitle>\n          <SheetDescription>Manage theme and team defaults.</SheetDescription>\n        </SheetHeader>\n      </SheetContent>\n    </Sheet>\n  )\n}"
      }
    ]
  },
  "skeleton": {
    accessibility: [
      "Decorative placeholders default to `aria-hidden` so screen readers skip them.",
      "Set `decorative={false}` and add `role=\"status\"` with `aria-live=\"polite\"` for semantic loading regions.",
      "Avoid stacking more than 5-6 skeletons without a loading boundary to limit screen reader noise."
    ],
    reducedMotion: "Shimmer animation uses `motion-safe:animate-[...]` / `motion-reduce:hidden`. Under `prefers-reduced-motion`, the shimmer overlay is hidden entirely and the skeleton renders as a static muted shape.",
    examples: [
      {
        title: "Variants",
        description: "Six visual variants to match any surface context.",
        code: "import { Skeleton } from \"@glinui/ui\"\n\nexport function SkeletonVariantDemo() {\n  return (\n    <div className=\"space-y-4\">\n      <div className=\"space-y-1\">\n        <span className=\"text-xs font-medium text-neutral-500 dark:text-neutral-400\">Default</span>\n        <Skeleton variant=\"default\" className=\"h-5 w-64\" />\n      </div>\n      <div className=\"space-y-1\">\n        <span className=\"text-xs font-medium text-neutral-500 dark:text-neutral-400\">Glass</span>\n        <Skeleton variant=\"glass\" className=\"h-5 w-64\" />\n      </div>\n      <div className=\"space-y-1\">\n        <span className=\"text-xs font-medium text-neutral-500 dark:text-neutral-400\">Liquid</span>\n        <Skeleton variant=\"liquid\" className=\"h-5 w-64\" />\n      </div>\n      <div className=\"space-y-1\">\n        <span className=\"text-xs font-medium text-neutral-500 dark:text-neutral-400\">Matte</span>\n        <Skeleton variant=\"matte\" className=\"h-5 w-64\" />\n      </div>\n      <div className=\"space-y-1\">\n        <span className=\"text-xs font-medium text-neutral-500 dark:text-neutral-400\">Outline</span>\n        <Skeleton variant=\"outline\" className=\"h-5 w-64\" />\n      </div>\n      <div className=\"space-y-1\">\n        <span className=\"text-xs font-medium text-neutral-500 dark:text-neutral-400\">Ghost</span>\n        <Skeleton variant=\"ghost\" className=\"h-5 w-64\" />\n      </div>\n    </div>\n  )\n}"
      },
      {
        title: "Sizes",
        code: "import { Skeleton } from \"@glinui/ui\"\n\nexport function SkeletonSizeDemo() {\n  return (\n    <div className=\"space-y-3\">\n      <Skeleton size=\"sm\" className=\"w-40\" />\n      <Skeleton size=\"md\" className=\"w-56\" />\n      <Skeleton size=\"lg\" className=\"w-72\" />\n    </div>\n  )\n}"
      },
      {
        title: "Card Loading",
        description: "Compose multiple skeletons to mirror real card layouts during async fetch.",
        code: "import { Skeleton } from \"@glinui/ui\"\n\nexport function SkeletonCardDemo() {\n  return (\n    <div className=\"max-w-sm rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800\">\n      <Skeleton className=\"h-40 w-full rounded-xl\" />\n      <div className=\"mt-4 space-y-3\">\n        <Skeleton className=\"h-5 w-3/4\" />\n        <Skeleton className=\"h-4 w-full\" />\n        <Skeleton className=\"h-4 w-5/6\" />\n      </div>\n      <div className=\"mt-5 flex items-center gap-3\">\n        <Skeleton className=\"h-9 w-9 rounded-full\" />\n        <div className=\"space-y-2\">\n          <Skeleton className=\"h-3.5 w-24\" />\n          <Skeleton className=\"h-3 w-16\" />\n        </div>\n      </div>\n    </div>\n  )\n}"
      },
      {
        title: "Profile Loading",
        description: "Avatar, name, and bio placeholders for a user profile state.",
        code: "import { Skeleton } from \"@glinui/ui\"\n\nexport function SkeletonProfileDemo() {\n  return (\n    <div className=\"flex items-start gap-4\">\n      <Skeleton className=\"h-16 w-16 shrink-0 rounded-full\" />\n      <div className=\"flex-1 space-y-3 pt-1\">\n        <Skeleton className=\"h-5 w-40\" />\n        <Skeleton className=\"h-3.5 w-56\" />\n        <div className=\"flex gap-4 pt-1\">\n          <Skeleton className=\"h-3 w-20\" />\n          <Skeleton className=\"h-3 w-20\" />\n          <Skeleton className=\"h-3 w-20\" />\n        </div>\n      </div>\n    </div>\n  )\n}"
      },
      {
        title: "Media Grid",
        description: "Image grid placeholder for gallery or feed views.",
        code: "import { Skeleton } from \"@glinui/ui\"\n\nexport function SkeletonMediaGridDemo() {\n  return (\n    <div className=\"grid grid-cols-3 gap-3\">\n      <Skeleton className=\"aspect-square w-full rounded-xl\" />\n      <Skeleton className=\"aspect-square w-full rounded-xl\" />\n      <Skeleton className=\"aspect-square w-full rounded-xl\" />\n      <Skeleton className=\"col-span-2 aspect-video w-full rounded-xl\" />\n      <Skeleton className=\"aspect-square w-full rounded-xl\" />\n    </div>\n  )\n}"
      },
      {
        title: "Glass Card Loading",
        description: "Skeleton on a glass surface for overlay loading states.",
        code: "import { Skeleton } from \"@glinui/ui\"\n\nexport function SkeletonGlassDemo() {\n  return (\n    <div className=\"max-w-sm rounded-2xl border border-white/20 bg-white/30 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5\">\n      <div className=\"flex items-center gap-3\">\n        <Skeleton variant=\"glass\" className=\"h-11 w-11 rounded-full\" />\n        <div className=\"space-y-2 flex-1\">\n          <Skeleton variant=\"glass\" className=\"h-4 w-32\" />\n          <Skeleton variant=\"glass\" className=\"h-3 w-20\" />\n        </div>\n      </div>\n      <div className=\"mt-4 space-y-2.5\">\n        <Skeleton variant=\"glass\" className=\"h-3.5 w-full\" />\n        <Skeleton variant=\"glass\" className=\"h-3.5 w-full\" />\n        <Skeleton variant=\"glass\" className=\"h-3.5 w-3/4\" />\n      </div>\n      <div className=\"mt-4 flex gap-2\">\n        <Skeleton variant=\"glass\" className=\"h-9 w-24 rounded-xl\" />\n        <Skeleton variant=\"glass\" className=\"h-9 w-24 rounded-xl\" />\n      </div>\n    </div>\n  )\n}"
      },
      {
        title: "List Loading",
        description: "Row-based skeleton for table or list views.",
        code: "import { Skeleton } from \"@glinui/ui\"\n\nexport function SkeletonListDemo() {\n  return (\n    <div className=\"max-w-md divide-y divide-neutral-200 dark:divide-neutral-800\">\n      {[1, 2, 3, 4].map((i) => (\n        <div key={i} className=\"flex items-center gap-3 py-3\">\n          <Skeleton className=\"h-10 w-10 shrink-0 rounded-lg\" />\n          <div className=\"flex-1 space-y-2\">\n            <Skeleton className=\"h-4 w-3/5\" />\n            <Skeleton className=\"h-3 w-2/5\" />\n          </div>\n          <Skeleton className=\"h-8 w-16 rounded-lg\" />\n        </div>\n      ))}\n    </div>\n  )\n}"
      }
    ]
  },
  "slider": {
    accessibility: [
      "Thumb includes visible focus ring.",
      "Provide `aria-label` for each slider input."
    ],
    examples: [
      {
        title: "Variants",
        code: "import { Slider } from \"@glinui/ui\"\n\nexport function SliderVariantDemo() {\n  return (\n    <div className=\"space-y-4\">\n      <Slider defaultValue={[20]} aria-label=\"Default slider\" />\n      <Slider variant=\"glass\" defaultValue={[40]} aria-label=\"Glass slider\" />\n      <Slider variant=\"outline\" defaultValue={[58]} aria-label=\"Outline slider\" />\n      <Slider variant=\"ghost\" defaultValue={[72]} aria-label=\"Ghost slider\" />\n      <Slider variant=\"liquid\" defaultValue={[86]} aria-label=\"Liquid slider\" />\n    </div>\n  )\n}"
      }
    ]
  },
  "status-dot": {
    accessibility: [
      "The dot `<span>` is `aria-hidden=\"true\"`, color alone does not convey meaning to assistive technologies.",
      "Always supply a `label` or `children` describing the status in plain text.",
      "When using `StatusDot` inside a live region (e.g. a dashboard that polls for updates), wrap it in `role=\"status\"` with `aria-live=\"polite\"`."
    ],
    reducedMotion: "The `pulse` animation uses `motion-safe:animate-pulse`. Under `prefers-reduced-motion: reduce`, the dot renders as a static colored circle with no animation.",
    examples: [
      {
        title: "Pulse",
        description: "Enable `pulse` to add a `motion-safe:animate-pulse` animation to the dot. Useful for active or live states.",
        code: "import { StatusDot } from \"@glinui/ui\"\n\nexport function StatusDotPulseDemo() {\n  return (\n    <div className=\"flex flex-col gap-2\">\n      <StatusDot status=\"success\" label=\"Live\" pulse />\n      <StatusDot status=\"danger\" label=\"Critical\" pulse />\n    </div>\n  )\n}"
      },
      {
        title: "Sizes",
        code: "import { StatusDot } from \"@glinui/ui\"\n\nexport function StatusDotSizeDemo() {\n  return (\n    <div className=\"flex flex-col gap-2\">\n      <StatusDot status=\"success\" size=\"sm\" label=\"Small\" />\n      <StatusDot status=\"success\" size=\"md\" label=\"Medium\" />\n      <StatusDot status=\"success\" size=\"lg\" label=\"Large\" />\n    </div>\n  )\n}"
      },
      {
        title: "Dot Only",
        description: "Omit the `label` prop to render a standalone colored dot, useful in compact table cells or avatar badges.",
        code: "import { StatusDot } from \"@glinui/ui\"\n\nexport function StatusDotOnlyDemo() {\n  return (\n    <div className=\"flex items-center gap-3\">\n      <StatusDot status=\"neutral\" />\n      <StatusDot status=\"info\" />\n      <StatusDot status=\"success\" />\n      <StatusDot status=\"warning\" />\n      <StatusDot status=\"danger\" />\n    </div>\n  )\n}"
      },
      {
        title: "With Children",
        description: "Pass children instead of the `label` prop when you need richer label content. The `label` prop takes priority if both are provided.",
        code: "import { StatusDot } from \"@glinui/ui\"\n\nexport function StatusDotChildrenDemo() {\n  return (\n    <StatusDot status=\"info\">\n      <span className=\"font-medium\">Syncing</span>{\" \"}\n      <span className=\"text-neutral-400\">,  3 items remaining</span>\n    </StatusDot>\n  )\n}"
      }
    ]
  },
  "switch": {
    accessibility: [
      "Built on `@radix-ui/react-switch` which renders a native `button` with `role=\"switch\"`.",
      "Associates with a visible `label` via `htmlFor` / `id` pairing, or via `aria-label` when no visual label element is present.",
      "Keyboard togglable with `Space` and `Enter`.",
      "`aria-checked` is managed automatically by the primitive."
    ],
    reducedMotion: "The thumb slide transition respects `prefers-reduced-motion` and removes the transform animation when enabled.",
    examples: [
      {
        title: "Default Checked",
        code: "import { Switch } from \"@glinui/ui\"\n\nexport function SwitchDefaultCheckedDemo() {\n  return (\n    <div className=\"flex items-center gap-2\">\n      <Switch id=\"notifications\" defaultChecked />\n      <label htmlFor=\"notifications\" className=\"text-sm\">Enable notifications</label>\n    </div>\n  )\n}"
      },
      {
        title: "With Form Label",
        code: "import { Switch } from \"@glinui/ui\"\n\nexport function SwitchFormDemo() {\n  return (\n    <div className=\"flex items-center justify-between rounded-lg border border-border/60 p-4\">\n      <div className=\"space-y-0.5\">\n        <p className=\"text-sm font-medium\">Marketing emails</p>\n        <p className=\"text-sm text-neutral-500\">Receive emails about new products and features.</p>\n      </div>\n      <Switch id=\"marketing\" aria-label=\"Marketing emails\" />\n    </div>\n  )\n}"
      }
    ]
  },
  "table": {
    accessibility: [
      "Uses semantic table elements (`table`, `thead`, `tbody`, `th`, `td`, `caption`).",
      "Keep column headers descriptive for screen reader table navigation.",
      "Use `TableCaption` to provide context when needed."
    ],
    reducedMotion: "Row hover transitions respect reduced-motion preferences.",
    examples: [
      {
        title: "When to choose Table vs DataTable",
        description: "- Use `Table` for invoices, comparison matrices, read-only reports, and layouts where you control every row and cell. - Use `DataTable` for operational data views where users need filtering, sorting, pagination, and row selection with minimal setup."
      },
      {
        title: "Glass Variant",
        code: "import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableCaption } from \"@glinui/ui\"\n\nexport function TableGlassDemo() {\n  return (\n    <Table variant=\"glass\" grid>\n      <TableCaption>Quarterly metrics</TableCaption>\n      <TableHeader>\n        <TableRow>\n          <TableHead>Metric</TableHead>\n          <TableHead align=\"right\">Value</TableHead>\n        </TableRow>\n      </TableHeader>\n      <TableBody>\n        <TableRow>\n          <TableCell>Conversion</TableCell>\n          <TableCell align=\"right\">7.3%</TableCell>\n        </TableRow>\n      </TableBody>\n    </Table>\n  )\n}"
      }
    ]
  },
  "tabs": {
    accessibility: [
      "Use clear trigger labels for each panel."
    ],
    reducedMotion: "Tabs do not require motion for state communication."
  },
  "text": {
    accessibility: [
      "`Text` renders a `<p>` element, which carries implicit paragraph semantics for screen readers.",
      "Avoid nesting block-level elements inside `<Text>`, use inline elements such as `<strong>` or `<em>` for emphasis within copy.",
      "Color-only meaning (e.g. muted = disabled) must be supplemented with `aria-disabled` or equivalent on the containing control."
    ],
    reducedMotion: "`Text` is a static element with no animation. It is unaffected by `prefers-reduced-motion`.",
    examples: [
      {
        title: "Variants",
        code: "import { Text } from \"@glinui/ui\"\n\nexport function TextVariantDemo() {\n  return (\n    <div className=\"flex flex-col gap-3\">\n      <Text variant=\"default\">Default, primary body copy for main content areas.</Text>\n      <Text variant=\"muted\">Muted, secondary copy, captions, and helper text.</Text>\n      <Text variant=\"ghost\">Ghost, low-emphasis annotations and placeholders.</Text>\n      <Text variant=\"glass\">Glass, highlighted text block with a frosted glass surface.</Text>\n    </div>\n  )\n}"
      },
      {
        title: "Sizes",
        code: "import { Text } from \"@glinui/ui\"\n\nexport function TextSizeDemo() {\n  return (\n    <div className=\"flex flex-col gap-3\">\n      <Text size=\"sm\">Small, footnotes, captions, and compact UI labels.</Text>\n      <Text size=\"md\">Medium, default body copy size for most contexts.</Text>\n      <Text size=\"lg\">Large, lead paragraphs and prominent descriptions.</Text>\n    </div>\n  )\n}"
      },
      {
        title: "Muted Caption",
        description: "Use the `muted` variant for secondary descriptive copy beneath headings or form fields.",
        code: "import { Text } from \"@glinui/ui\"\n\nexport function TextMutedDemo() {\n  return (\n    <div className=\"flex flex-col gap-1\">\n      <p className=\"font-semibold text-base\">Account settings</p>\n      <Text variant=\"muted\" size=\"sm\">\n        Manage your profile, notifications, and connected services.\n      </Text>\n    </div>\n  )\n}"
      },
      {
        title: "Glass Highlight",
        description: "The `glass` variant wraps the text in a frosted-glass surface. Use it to call out important prose blocks, callouts, or feature descriptions.",
        code: "import { Text } from \"@glinui/ui\"\n\nexport function TextGlassDemo() {\n  return (\n    <Text variant=\"glass\" size=\"md\">\n      Glin UI ships with a liquid glass rendering engine built on SVG displacement filters,\n      giving every surface depth and light-reactive refraction out of the box.\n    </Text>\n  )\n}"
      }
    ]
  },
  "textarea": {
    accessibility: [
      "Always pair a `<Textarea>` with a `<label>` using `htmlFor` or supply an `aria-label`.",
      "Placeholder text is not a substitute for labeling.",
      "The `rows` attribute provides a visible size hint; use CSS `min-height` / `max-height` for precise control.",
      "Disabled textareas convey their state through the native `disabled` attribute, readable by all major screen readers."
    ],
    reducedMotion: "Textarea has no built-in animation. Focus ring and border transitions respect the user's `prefers-reduced-motion` setting automatically via Tailwind.",
    examples: [
      {
        title: "With Placeholder",
        code: "import { Textarea } from \"@glinui/ui\"\n\nexport function TextareaPlaceholderDemo() {\n  return <Textarea aria-label=\"Issue details\" placeholder=\"Describe your issue in detail...\" />\n}"
      },
      {
        title: "Surface Variants",
        code: "import { Textarea } from \"@glinui/ui\"\n\nexport function TextareaVariantsDemo() {\n  return (\n    <div className=\"space-y-3\">\n      <Textarea variant=\"default\" aria-label=\"Default textarea\" placeholder=\"Default\" />\n      <Textarea variant=\"glass\" aria-label=\"Glass textarea\" placeholder=\"Glass\" />\n      <Textarea variant=\"liquid\" aria-label=\"Liquid textarea\" placeholder=\"Liquid\" />\n      <Textarea variant=\"matte\" aria-label=\"Matte textarea\" placeholder=\"Matte\" />\n      <Textarea variant=\"outline\" aria-label=\"Outline textarea\" placeholder=\"Outline\" />\n      <Textarea variant=\"filled\" aria-label=\"Filled textarea\" placeholder=\"Filled\" />\n    </div>\n  )\n}"
      },
      {
        title: "Disabled",
        code: "import { Textarea } from \"@glinui/ui\"\n\nexport function TextareaDisabledDemo() {\n  return <Textarea aria-label=\"Disabled textarea\" disabled placeholder=\"Cannot edit this field\" />\n}"
      }
    ]
  },
  "toast": {
    accessibility: [
      "Auto-pause on hover gives users time to read.",
      "Keep toast messages short (under 140 characters) for screen readers."
    ],
    reducedMotion: "Slide and opacity transitions respect `prefers-reduced-motion`. When enabled, toasts fade in without translate animation.",
    examples: [
      {
        title: "Custom Duration",
        description: "Set `duration` per-toast or globally on the `Toaster`. ```tsx // 10 second toast toast(\"Long-running task\", { duration: 10000 }) // Persistent toast (no auto-close) toast(\"Requires action\", { duration: Infinity }) ```"
      },
      {
        title: "Dismiss",
        description: "Dismiss a specific toast by ID or all toasts at once. ```tsx const id = toast(\"Processing...\") // Later... toast.dismiss(id) // dismiss specific toast.dismiss() // dismiss all ```"
      },
      {
        title: "Glass Variant",
        description: "Use `variant=\"glass\"` on the `Toaster` for frosted glass surfaces. ```tsx <Toaster variant=\"glass\" /> ```"
      },
      {
        title: "Matte Variant",
        description: "```tsx <Toaster variant=\"matte\" /> ```"
      },
      {
        title: "Positions",
        description: "Six positions: `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`. ```tsx <Toaster position=\"top-center\" /> ```"
      }
    ]
  },
  "tooltip": {
    accessibility: [
      "Built on Radix Tooltip; the content is linked via `aria-describedby` on the trigger automatically.",
      "Tooltip opens on focus as well as hover, ensuring keyboard users receive the same context hints.",
      "Do not place interactive elements (buttons, links) inside `TooltipContent`, use a Popover for that pattern.",
      "Keep tooltip text to a single short phrase. For longer explanations, prefer an inline description."
    ],
    reducedMotion: "Tooltip fade and scale transitions respect `prefers-reduced-motion`. When enabled, the content appears instantly without animation.",
    examples: [
      {
        title: "Custom Delay",
        description: "Override the open delay per-tooltip by passing `delayDuration` to the `Tooltip` root. A delay of `0` opens instantly.",
        code: "import { Button } from \"@glinui/ui\"\nimport { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from \"@glinui/ui\"\n\nexport function TooltipDelayDemo() {\n  return (\n    <TooltipProvider>\n      <div className=\"flex items-center gap-4\">\n        <Tooltip delayDuration={0}>\n          <TooltipTrigger asChild>\n            <Button variant=\"outline\" size=\"sm\">Instant</Button>\n          </TooltipTrigger>\n          <TooltipContent>\n            <p>Opens immediately (0 ms)</p>\n          </TooltipContent>\n        </Tooltip>\n        <Tooltip delayDuration={700}>\n          <TooltipTrigger asChild>\n            <Button variant=\"outline\" size=\"sm\">Delayed</Button>\n          </TooltipTrigger>\n          <TooltipContent>\n            <p>Opens after 700 ms</p>\n          </TooltipContent>\n        </Tooltip>\n      </div>\n    </TooltipProvider>\n  )\n}"
      },
      {
        title: "Side Positioning",
        description: "Use `side` on `TooltipContent` to anchor the hint above, below, left, or right of the trigger. The tooltip auto-adjusts to avoid viewport clipping.",
        code: "import { Button } from \"@glinui/ui\"\nimport { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from \"@glinui/ui\"\n\nexport function TooltipSideDemo() {\n  return (\n    <TooltipProvider>\n      <div className=\"flex items-center justify-center gap-4\">\n        <Tooltip>\n          <TooltipTrigger asChild>\n            <Button variant=\"outline\" size=\"sm\">Top</Button>\n          </TooltipTrigger>\n          <TooltipContent side=\"top\">\n            <p>Top tooltip</p>\n          </TooltipContent>\n        </Tooltip>\n        <Tooltip>\n          <TooltipTrigger asChild>\n            <Button variant=\"outline\" size=\"sm\">Right</Button>\n          </TooltipTrigger>\n          <TooltipContent side=\"right\">\n            <p>Right tooltip</p>\n          </TooltipContent>\n        </Tooltip>\n        <Tooltip>\n          <TooltipTrigger asChild>\n            <Button variant=\"outline\" size=\"sm\">Bottom</Button>\n          </TooltipTrigger>\n          <TooltipContent side=\"bottom\">\n            <p>Bottom tooltip</p>\n          </TooltipContent>\n        </Tooltip>\n        <Tooltip>\n          <TooltipTrigger asChild>\n            <Button variant=\"outline\" size=\"sm\">Left</Button>\n          </TooltipTrigger>\n          <TooltipContent side=\"left\">\n            <p>Left tooltip</p>\n          </TooltipContent>\n        </Tooltip>\n      </div>\n    </TooltipProvider>\n  )\n}"
      }
    ]
  },
  "tree": {
    accessibility: [
      "The chevron icon provides a clear visual indicator of expanded/collapsed state.",
      "Leaf nodes that have an `href` render as `<a>` elements with proper `rel=\"noopener noreferrer\"` when `external` is set.",
      "Nesting depth is communicated visually through `padding-left` indentation. For screen-reader depth cues, consider wrapping the component in a `<nav>` with an `aria-label`."
    ],
    reducedMotion: "The chevron rotation transition (`duration-150`) is a lightweight CSS transform. It respects `prefers-reduced-motion` via Tailwind's `motion-reduce:transition-none` utility if applied to `spotlightClassName`, and can be suppressed by adding `motion-reduce:transition-none` to the `className` prop.",
    examples: [
      {
        title: "All Variants",
        description: "Four surface variants match the design system, `default`, `glass`, `outline`, and `ghost`.",
        code: "import { Tree } from \"@glinui/ui\"\n\nconst nodes = [\n  { label: \"src\", children: [{ label: \"index.ts\" }, { label: \"App.tsx\" }] },\n  { label: \"package.json\" }\n]\n\nexport function TreeVariantsDemo() {\n  return (\n    <div className=\"grid grid-cols-2 gap-4\">\n      <div>\n        <p className=\"mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-widest\">Default</p>\n        <Tree nodes={nodes} variant=\"default\" />\n      </div>\n      <div>\n        <p className=\"mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-widest\">Glass</p>\n        <Tree nodes={nodes} variant=\"glass\" />\n      </div>\n      <div>\n        <p className=\"mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-widest\">Outline</p>\n        <Tree nodes={nodes} variant=\"outline\" />\n      </div>\n      <div>\n        <p className=\"mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-widest\">Ghost</p>\n        <Tree nodes={nodes} variant=\"ghost\" />\n      </div>\n    </div>\n  )\n}"
      },
      {
        title: "buildFileTree Utility",
        description: "`buildFileTree` converts a flat array of slash-separated file paths into a nested `TreeNode[]` structure. Pass an optional `hrefPrefix` to make leaf nodes into links, or `getBadge` to attach badges based on file path patterns.",
        code: "import { Tree, buildFileTree } from \"@glinui/ui\"\n\nconst paths = [\n  \"src/components/button.tsx\",\n  \"src/components/input.tsx\",\n  \"src/lib/cn.ts\",\n  \"src/lib/utils.ts\",\n  \"src/index.ts\",\n  \"package.json\"\n]\n\nexport function TreeBuildFileTreeDemo() {\n  const nodes = buildFileTree(paths)\n  return <Tree nodes={nodes} className=\"max-w-xs\" />\n}\n\n// With href links and badges:\nexport function TreeBuildFileTreeLinkedDemo() {\n  const nodes = buildFileTree(paths, {\n    hrefPrefix: \"https://github.com/org/repo/blob/main\",\n    getBadge: (path) => {\n      if (path.endsWith(\".tsx\")) return { badge: \"tsx\", badgeVariant: \"info\" }\n      if (path.endsWith(\".ts\"))  return { badge: \"ts\",  badgeVariant: \"default\" }\n      return null\n    }\n  })\n  return <Tree nodes={nodes} className=\"max-w-xs\" />\n}"
      },
      {
        title: "Collapsed by Default",
        description: "Set `defaultExpanded={false}` to render all folders in their collapsed state initially.",
        code: "import { Tree } from \"@glinui/ui\"\n\nconst nodes = [\n  {\n    label: \"src\",\n    children: [\n      { label: \"components\", children: [{ label: \"button.tsx\" }, { label: \"input.tsx\" }] },\n      { label: \"index.ts\" }\n    ]\n  },\n  { label: \"package.json\" }\n]\n\nexport function TreeCollapsedDemo() {\n  return <Tree nodes={nodes} defaultExpanded={false} className=\"max-w-xs\" />\n}"
      }
    ]
  }
}
