"use client"

import {
  CircularGalleryAuto,
  CircularGalleryHero,
  CircularGalleryLayout,
  CircularGalleryVariants,
  HighlightGridHero,
  HighlightGridLayout,
  HighlightGridLinks,
  HighlightGridVariants
} from "./batch-b3-demos"
import type { BatchB3Doc } from "./batch-b3-types"

const SURFACE_VARIANT =
  '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "gradient" | "glass" | "default"'

export const batchB3bDocs: Record<string, BatchB3Doc> = {
  "circular-gallery": {
    badge: "Primitive / Molecule",
    notes: [
      "Our own design (clean-room, no upstream code). Tiles sit on a ring seen from the front: the front tile is large and sharp, the others shrink, dim and blur toward the back.",
      "Drag has inertia and eases to the nearest tile. Positions are computed in JS and written as CSS variables from a rAF loop, so a drag causes no React renders.",
      "Compared with CylinderCarousel: the gallery is a continuous, draggable ring with a front caption and click to focus. The carousel is a step based slide show."
    ],
    props: [
      { prop: "items", type: "{ id: string; content: ReactNode; label: string }[]", description: "Tiles. The label names the tile and captions the front one." },
      { prop: "value / defaultValue / onValueChange", type: "number / number / (index) => void", defaultValue: "0", description: "Controlled or uncontrolled front tile index." },
      { prop: "radius", type: "number", defaultValue: "fits the tiles", description: "Ring radius in pixels." },
      { prop: "tilt", type: "number", defaultValue: "8", description: "Camera tilt in degrees." },
      { prop: "tileWidth / tileHeight", type: "number", defaultValue: "150 / 190", description: "Tile size in pixels." },
      { prop: "autoRotate / autoRotateInterval", type: "boolean / number", defaultValue: "false / 3200", description: "Rotate on a timer. Needs motion level full, pauses on hover, focus and drag." },
      { prop: "wheel", type: "boolean", defaultValue: "false", description: "Let the wheel rotate the ring. Off so page scroll is never captured." },
      { prop: "showCaption", type: "boolean", defaultValue: "true", description: "Caption of the front tile." },
      { prop: "variant", type: SURFACE_VARIANT, defaultValue: "ambient (glinr)", description: "Tile surface." }
    ],
    accessibility: {
      summary: [
        "A listbox with option tiles, a roving tabindex and aria-current on the front tile. Back tiles are still focusable and clicking or focusing one brings it forward.",
        "Arrow keys, Home and End move the front tile and focus together.",
        "Drag and wheel are conveniences only, every action has a key and click equivalent.",
        "Auto rotate pauses on hover, focus and drag and is off under reduced motion."
      ],
      keyboard: [
        { key: "ArrowRight / ArrowLeft", description: "Next or previous tile (reversed in RTL)." },
        { key: "Home / End", description: "First or last tile." },
        { key: "Enter / click", description: "Bring a tile to the front." }
      ],
      aria: ['`role="listbox"` and `role="option"` tiles', "`aria-current` and `aria-selected` on the front tile", "`aria-posinset` and `aria-setsize`"]
    },
    reducedMotion: {
      description: "Easing and auto rotate only run at motion level full. Otherwise the ring snaps to the chosen tile instantly.",
      affected: ["rotation easing", "inertia", "auto rotate"]
    },
    examples: [
      {
        title: "Default",
        description: "Six gradient tiles on a ring. Drag, click a back tile or use the arrow keys.",
        code: `import { CircularGallery } from "@glinui/ui"\n\nexport function Demo() {\n  return <CircularGallery label="Collections" items={items} />\n}`,
        render: <CircularGalleryHero />
      },
      {
        title: "Variants",
        description: "glinr, plain and solid tile surfaces.",
        code: `<CircularGallery variant="plain" items={items} tileWidth={110} tileHeight={140} />`,
        render: <CircularGalleryVariants />
      },
      {
        title: "States",
        description: "Auto rotate, paused by hover and focus.",
        code: `<CircularGallery autoRotate autoRotateInterval={2600} items={items} />`,
        render: <CircularGalleryAuto />
      },
      {
        title: "In a layout",
        description: "A centered section under a heading.",
        code: `<section aria-labelledby="collections">\n  <h3 id="collections">Browse collections</h3>\n  <CircularGallery items={items} />\n</section>`,
        render: <CircularGalleryLayout />
      }
    ]
  },
  "highlight-grid": {
    badge: "Primitive / Molecule",
    notes: [
      "Our own design (clean-room, no upstream code). One highlight panel glides between hairline cells instead of every cell animating on its own.",
      "The panel is measured against the grid with physical offsets, so mirrored RTL layouts work. A ResizeObserver keeps it aligned when the grid reflows.",
      "Entering the grid from outside places the panel on the entry cell with no fly-in from a corner."
    ],
    props: [
      { prop: "cells", type: "{ id: string; content?: ReactNode; label?: string; href?: string }[]", description: "Cells. With href the body renders as a link." },
      { prop: "columns", type: "1 | 2 | 3 | 4 | 5 | 6", defaultValue: "3", description: "Columns from the lg breakpoint up. Narrow screens use 1 or 2." },
      { prop: "cellRenderer", type: "(cell, { active, index }) => ReactNode", description: "Custom cell body." },
      { prop: "variant", type: SURFACE_VARIANT, defaultValue: "ambient (glinr)", description: "Highlight look: glinr accent wash, plain neutral wash, glass blurred sheet." }
    ],
    accessibility: {
      summary: [
        "A list of cells with a roving tabindex. Arrow keys, Home and End move focus and the highlight follows.",
        "The panel is aria-hidden and pointer-events-none, so cells and links stay clickable.",
        "Touch: tapping a cell moves the highlight and it stays until you tap elsewhere.",
        "The highlight is never the only indicator, keyboard focus also shows a ring."
      ],
      keyboard: [
        { key: "Arrow keys", description: "Move between cells (left and right reversed in RTL, up and down follow the real column count)." },
        { key: "Home / End", description: "First or last cell." },
        { key: "Enter", description: "Follows the link of a cell with href." }
      ],
      aria: ['`role="list"` with list items', "Decorative panel uses `aria-hidden`"]
    },
    reducedMotion: {
      description: "The glide, resize and fade only run at motion level full. Otherwise the highlight jumps to the new cell.",
      affected: ["panel transform, size and opacity transitions"]
    },
    examples: [
      {
        title: "Default",
        description: "Six feature cells. Hover, tap or tab through them.",
        code: `import { HighlightGrid } from "@glinui/ui"\n\nexport function Demo() {\n  return <HighlightGrid cells={features} cellRenderer={renderFeature} />\n}`,
        render: <HighlightGridHero />
      },
      {
        title: "Variants",
        description: "glinr accent wash, plain neutral wash and glass.",
        code: `<HighlightGrid variant="plain" cells={cells} />`,
        render: <HighlightGridVariants />
      },
      {
        title: "States",
        description: "Link cells with an href, reachable with the keyboard.",
        code: `<HighlightGrid columns={2} cells={cells.map((c) => ({ ...c, href: "#" + c.id }))} />`,
        render: <HighlightGridLinks />
      },
      {
        title: "In a layout",
        description: "A features section under a heading.",
        code: `<section aria-labelledby="why">\n  <h3 id="why">Why teams switch</h3>\n  <HighlightGrid columns={3} cells={cells} />\n</section>`,
        render: <HighlightGridLayout />
      }
    ]
  }
}
