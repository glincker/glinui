import type { ComponentType } from "react"

import {
  AlertBannersDemo,
  AlertDismissDemo,
  AlertLayoutDemo,
  EmptyInboxDemo,
  EmptyLayoutDemo,
  EmptySearchDemo,
  ProgressOnboardingDemo,
  ProgressSizesDemo,
  ProgressUploadDemo,
  SkeletonFeedDemo,
  SkeletonStatesDemo,
  SpinnerButtonsDemo,
  SpinnerSizesDemo,
  StatusDotServicesDemo,
  StatusDotSizesDemo
} from "@/components/demos/s3-feedback"
import {
  AvatarLayoutDemo,
  AvatarSizesDemo,
  AvatarTeamDemo,
  BadgeStatesDemo,
  BadgeToolbarDemo,
  ChipFiltersDemo,
  ChipTagsDemo,
  CounterNavDemo,
  CounterSizesDemo,
  DataTableUsersDemo,
  ItemMediaDemo,
  ItemSettingsDemo,
  KbdCheatSheetDemo,
  KbdInlineDemo,
  TableInvoicesDemo,
  TableLayoutDemo,
  TreeExplorerDemo
} from "@/components/demos/s3-data"
import {
  AccordionFaqDemo,
  AccordionMultipleDemo,
  AspectRatioCardDemo,
  AspectRatioMediaDemo,
  BrowserFrameAppDemo,
  BrowserFrameModesDemo,
  CollapsibleListDemo,
  CollapsibleOrderDemo,
  IconFrameFeaturesDemo,
  ScrollAreaChangelogDemo,
  ScrollAreaGalleryDemo,
  SeparatorLayoutDemo
} from "@/components/demos/s3-layout"
import { s3Code } from "@/lib/s3-code.generated"
import type { ComponentDocMeta, ComponentExample } from "@/lib/component-docs"

type Fresh = { title: string; description: string; demo: ComponentType; key: string }
type Keep = { keep: string; title?: string; description?: string }
type Slot = Fresh | Keep

const fresh = (title: string, description: string, demo: ComponentType, key: string): Fresh => ({ title, description, demo, key })

/**
 * Showcase rebuild for feedback, data display and layout components. Each list is the final order of
 * examples on the page: fresh demos (code is extracted from the demo source) and kept legacy examples.
 */
const plan: Record<string, Slot[]> = {
  alert: [
    fresh("Default", "In-context banners for each tone, with actions where the next step is obvious.", AlertBannersDemo, "AlertBannersDemo"),
    { keep: "Variants" },
    fresh("Dismissible and quiet looks", "A banner you can dismiss, plus the note and flag looks for low-key asides.", AlertDismissDemo, "AlertDismissDemo"),
    fresh("In a layout", "A billing warning above a plan card.", AlertLayoutDemo, "AlertLayoutDemo")
  ],
  progress: [
    fresh("Default", "An upload card with one bar per file and a finished state.", ProgressUploadDemo, "ProgressUploadDemo"),
    fresh("Onboarding steps", "A circular summary, a bar and a checklist share one value.", ProgressOnboardingDemo, "ProgressOnboardingDemo"),
    { keep: "Variants" },
    fresh("Sizes and indeterminate", "Three sizes animate in sync. Use indeterminate when the duration is unknown.", ProgressSizesDemo, "ProgressSizesDemo")
  ],
  skeleton: [
    fresh("Default", "A loading post placeholder next to the content it mirrors, so the layout does not jump.", SkeletonFeedDemo, "SkeletonFeedDemo"),
    { keep: "Variants" },
    fresh("Loading to loaded", "Swap the skeleton for real content and flip aria-busy.", SkeletonStatesDemo, "SkeletonStatesDemo")
  ],
  spinner: [
    fresh("Default", "Inside a button while saving, and as a full-section loader.", SpinnerButtonsDemo, "SpinnerButtonsDemo"),
    { keep: "Variants" },
    fresh("Sizes", "Four sizes and a muted look for quiet surfaces.", SpinnerSizesDemo, "SpinnerSizesDemo")
  ],
  "status-dot": [
    fresh("Default", "A service status list. Pulse marks states that need attention.", StatusDotServicesDemo, "StatusDotServicesDemo"),
    fresh("Sizes and states", "Three sizes and every status.", StatusDotSizesDemo, "StatusDotSizesDemo")
  ],
  empty: [
    fresh("Default", "An inbox zero state with a primary and a secondary action.", EmptyInboxDemo, "EmptyInboxDemo"),
    { keep: "Variants" },
    fresh("No results", "A dashed empty state that offers a way back.", EmptySearchDemo, "EmptySearchDemo"),
    fresh("In a layout", "An empty state inside a card, below its header actions.", EmptyLayoutDemo, "EmptyLayoutDemo")
  ],
  badge: [
    fresh("Default", "A filter toolbar above a list of pull requests with status pills.", BadgeToolbarDemo, "BadgeToolbarDemo"),
    { keep: "Variants" },
    fresh("Sizes, dots and icons", "Sizes, status dots and leading icons.", BadgeStatesDemo, "BadgeStatesDemo")
  ],
  chip: [
    fresh("Default", "Toggleable filter chips. Wrap each chip in a button and set aria-pressed.", ChipFiltersDemo, "ChipFiltersDemo"),
    { keep: "Variants" },
    fresh("Tones and sizes", "Tag chips in every tone, and three sizes.", ChipTagsDemo, "ChipTagsDemo")
  ],
  avatar: [
    fresh("Default", "A team stack with presence dots and a +N overflow.", AvatarTeamDemo, "AvatarTeamDemo"),
    { keep: "Variants" },
    fresh("Sizes and shapes", "Six sizes, three radii, rings and presence.", AvatarSizesDemo, "AvatarSizesDemo"),
    fresh("In a layout", "A members list with roles and presence.", AvatarLayoutDemo, "AvatarLayoutDemo")
  ],
  table: [
    fresh("Default", "An invoices table with a sortable header hint, avatars, status badges and a row actions menu.", TableInvoicesDemo, "TableInvoicesDemo"),
    { keep: "Variants" },
    fresh("In a layout", "A striped compact table inside a card with an export action and pagination.", TableLayoutDemo, "TableLayoutDemo")
  ],
  "data-table": [
    fresh("Default", "A users table with status filters, search, sorting, selection and pagination.", DataTableUsersDemo, "DataTableUsersDemo"),
    { keep: "Full Featured", title: "Grid and sticky header" }
  ],
  tree: [
    fresh("Default", "A file explorer with file icons and change badges.", TreeExplorerDemo, "TreeExplorerDemo"),
    { keep: "Variants" }
  ],
  counter: [
    fresh("Default", "Counts in a mailbox navigation. Values above max show max+.", CounterNavDemo, "CounterNavDemo"),
    { keep: "Variants" },
    fresh("Sizes and badges", "Sizes, and counters on a button and an icon.", CounterSizesDemo, "CounterSizesDemo")
  ],
  kbd: [
    fresh("Default", "A shortcut cheat sheet grouped by task.", KbdCheatSheetDemo, "KbdCheatSheetDemo"),
    { keep: "Variants" },
    fresh("Inline hints", "A search field hint, keys in running text and three sizes.", KbdInlineDemo, "KbdInlineDemo")
  ],
  item: [
    fresh("Default", "A settings list with an action button, switches and a navigation row.", ItemSettingsDemo, "ItemSettingsDemo"),
    { keep: "Variants" },
    fresh("Media list", "Outline items with leading media, trailing actions and a soft warning item.", ItemMediaDemo, "ItemMediaDemo")
  ],
  "scroll-area": [
    fresh("Default", "A long changelog in a fixed height region with a custom scrollbar.", ScrollAreaChangelogDemo, "ScrollAreaChangelogDemo"),
    { keep: "Variants" },
    fresh("Horizontal", "A horizontal strip with its own scrollbar.", ScrollAreaGalleryDemo, "ScrollAreaGalleryDemo")
  ],
  "aspect-ratio": [
    fresh("Default", "Four common ratios.", AspectRatioMediaDemo, "AspectRatioMediaDemo"),
    { keep: "Variants" },
    fresh("In a card", "A 16:9 cover on top of a card.", AspectRatioCardDemo, "AspectRatioCardDemo")
  ],
  collapsible: [
    fresh("Default", "Expandable order details with a summary row that stays visible.", CollapsibleOrderDemo, "CollapsibleOrderDemo"),
    { keep: "Variants" },
    fresh("Show more", "Reveal the rest of a list.", CollapsibleListDemo, "CollapsibleListDemo")
  ],
  separator: [
    fresh("Default", "Vertical dividers in a tab row, labeled and icon dividers, and a receipt total.", SeparatorLayoutDemo, "SeparatorLayoutDemo"),
    { keep: "Variants" }
  ],
  "icon-frame": [
    fresh("Default", "Feature cards led by tinted icon frames.", IconFrameFeaturesDemo, "IconFrameFeaturesDemo"),
    { keep: "Variants" },
    { keep: "Tones" }
  ],
  accordion: [
    fresh("Default", "A billing FAQ with the first answer open.", AccordionFaqDemo, "AccordionFaqDemo"),
    { keep: "Variants" },
    fresh("Multiple open", "Use type multiple with the separated look when readers compare answers.", AccordionMultipleDemo, "AccordionMultipleDemo"),
    { keep: "In a layout" }
  ],
  "browser-frame": [
    fresh("Default", "A billing screen inside a browser window.", BrowserFrameAppDemo, "BrowserFrameAppDemo"),
    { keep: "Variants" },
    fresh("Modes", "A titled window and an address bar window.", BrowserFrameModesDemo, "BrowserFrameModesDemo")
  ]
}

export function applyS3Showcase(docs: Record<string, ComponentDocMeta | undefined>): void {
  for (const [id, slots] of Object.entries(plan)) {
    const meta = docs[id]
    if (!meta) continue
    const examples: ComponentExample[] = []
    for (const slot of slots) {
      if ("keep" in slot) {
        const found = meta.examples.find((example) => example.title === slot.keep)
        if (found) examples.push({ ...found, title: slot.title ?? found.title, description: slot.description ?? found.description })
        continue
      }
      const Demo = slot.demo
      examples.push({ title: slot.title, description: slot.description, code: s3Code[slot.key] ?? "", render: <Demo /> })
    }
    docs[id] = { ...meta, examples }
  }
}
