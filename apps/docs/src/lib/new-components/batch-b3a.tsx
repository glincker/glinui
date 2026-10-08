"use client"

import {
  CylinderCarouselAuto,
  CylinderCarouselHero,
  CylinderCarouselLayout,
  CylinderCarouselVariants,
  ImageComparisonHero,
  ImageComparisonLayout,
  ImageComparisonThemes,
  ImageComparisonVariants
} from "./batch-b3-demos"
import type { BatchB3Doc } from "./batch-b3-types"

const SURFACE_VARIANT =
  '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "gradient" | "glass" | "default"'

export const batchB3aDocs: Record<string, BatchB3Doc> = {
  "cylinder-carousel": {
    badge: "Primitive / Molecule",
    notes: [
      "Adapted from Cylinder Carousel by Vengeance UI (MIT). Modified: ReactNode slides instead of image urls, step based rotation (buttons, arrow keys, swipe, autoplay) instead of an endless CSS spin, carousel aria semantics, inert rear slides, token surfaces, RTL and a flat scroll-snap fallback at motion none.",
      "Geometry is computed in JS (the ring radius from card width, gap and count), so it does not rely on the CSS tan() function.",
      "Autoplay is off by default. When on, it pauses on hover and focus, a visible pause button is shown (WCAG 2.2.2) and it never runs under reduced motion."
    ],
    props: [
      { prop: "items", type: "ReactNode[]", description: "Slide content. Any node, no image urls required." },
      { prop: "label", type: "string", defaultValue: "Carousel", description: "Accessible name of the carousel region." },
      { prop: "variant", type: SURFACE_VARIANT, defaultValue: "ambient (glinr)", description: "Surface of each slide frame." },
      { prop: "value / defaultValue / onValueChange", type: "number / number / (index) => void", defaultValue: "0", description: "Controlled or uncontrolled front slide index." },
      { prop: "cardWidth / cardHeight", type: "number", defaultValue: "200 / 280", description: "Slide size in pixels." },
      { prop: "gap", type: "number", defaultValue: "24", description: "Space between neighbouring slides on the ring." },
      { prop: "autoPlay / autoPlayInterval", type: "boolean / number", defaultValue: "false / 3500", description: "Rotate on a timer. Needs motion level full." },
      { prop: "showControls", type: "boolean", defaultValue: "true", description: "Previous, next and (with autoplay) pause buttons." },
      { prop: "getSlideLabel", type: "(index, total) => string", defaultValue: '"n of N"', description: "Accessible name of each slide." }
    ],
    accessibility: {
      summary: [
        "The root is a region with aria-roledescription carousel. Each slide is a group with aria-roledescription slide and a name such as 3 of 6.",
        "Only the front slide is interactive. Rear slides are inert so focus and screen readers never land on content that is turned away.",
        "The viewport is focusable and takes arrow keys. Previous and next are real buttons. Swipe works on touch.",
        "aria-live is off while autoplay is running and polite otherwise. Autoplay pauses on hover and focus and has a pause button."
      ],
      keyboard: [
        { key: "ArrowRight / ArrowLeft", description: "Next or previous slide (reversed in RTL)." },
        { key: "Home / End", description: "First or last slide." },
        { key: "Tab", description: "Moves to the controls and into the front slide." }
      ],
      aria: ['`role="region"` with `aria-roledescription="carousel"`', '`aria-roledescription="slide"` and `aria-label="n of N"` on slides', "`inert` on non-front slides", "`aria-live` off during autoplay"]
    },
    reducedMotion: {
      description: "Autoplay only runs at motion level full, so reduced motion turns it off. Rotation transitions are dropped at subtle. Motion level none renders a flat scroll-snap list with every slide reachable.",
      affected: ["ring rotation transition", "autoplay", "3D ring (flat list at none)"]
    },
    examples: [
      {
        title: "Default",
        description: "Six gradient slides on a ring. Use the buttons, arrow keys or swipe.",
        code: `import { CylinderCarousel } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <CylinderCarousel\n      label="Featured palettes"\n      items={palettes.map((p) => <PaletteTile key={p.id} palette={p} />)}\n    />\n  )\n}`,
        render: <CylinderCarouselHero />
      },
      {
        title: "Variants",
        description: "glinr is the default surface, plain is flat, solid is a neutral tonal face.",
        code: `<CylinderCarousel variant="plain" items={items} cardWidth={140} cardHeight={180} />`,
        render: <CylinderCarouselVariants />
      },
      {
        title: "States",
        description: "Autoplay pauses on hover and focus, and has a pause button.",
        code: `<CylinderCarousel autoPlay autoPlayInterval={2800} items={items} />`,
        render: <CylinderCarouselAuto />
      },
      {
        title: "In a layout",
        description: "A product section with copy beside the ring.",
        code: `<section className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">\n  <Copy />\n  <CylinderCarousel items={items} />\n</section>`,
        render: <CylinderCarouselLayout />
      }
    ]
  },
  "image-comparison": {
    badge: "Primitive / Molecule",
    notes: [
      "Adapted from Image Comparison by Motion Primitives (MIT). Modified: motion/react removed (the split is a CSS clip-path read from one custom property), pointer capture drag, a real slider role with keyboard support, ReactNode layers instead of image tags, vertical orientation, RTL and token surfaces.",
      "The layers are any ReactNode, so you can compare images, screenshots, UI states or whole themes."
    ],
    props: [
      { prop: "before / after", type: "ReactNode", description: "The two layers. Before is shown from the start edge up to the handle." },
      { prop: "beforeLabel / afterLabel", type: "string", defaultValue: "Before / After", description: "Names for the layers and the corner chips." },
      { prop: "showLabels", type: "boolean", defaultValue: "true", description: "Show the corner chips." },
      { prop: "value / defaultValue / onValueChange", type: "number / number / (value) => void", defaultValue: "50", description: "Handle position, percent of the before layer." },
      { prop: "orientation", type: '"horizontal" | "vertical"', defaultValue: "horizontal", description: "Direction of the split." },
      { prop: "step", type: "number", defaultValue: "2", description: "Arrow key step in percent. Shift multiplies by 5." },
      { prop: "hover", type: "boolean", defaultValue: "false", description: "Follow a fine pointer without pressing. Touch still drags." },
      { prop: "label", type: "string", defaultValue: "Comparison position", description: "Accessible name of the slider." },
      { prop: "variant", type: SURFACE_VARIANT, defaultValue: "ambient (glinr)", description: "Frame surface." }
    ],
    accessibility: {
      summary: [
        "The handle is role slider with aria-valuenow, aria-valuetext, aria-orientation and an accessible name.",
        "Everything a pointer can do works from the keyboard: arrows, Page keys, Home and End.",
        "touch-action is pan-y (pan-x when vertical) so a horizontal drag moves the handle while the page still scrolls the other way.",
        "Both layers are named groups, so their content stays readable."
      ],
      keyboard: [
        { key: "ArrowLeft / ArrowRight", description: "Move the handle (reversed in RTL)." },
        { key: "ArrowUp / ArrowDown", description: "Move the handle in vertical mode." },
        { key: "Shift + Arrow, PageUp / PageDown", description: "Move five steps." },
        { key: "Home / End", description: "Jump to 0 or 100." }
      ],
      aria: ['`role="slider"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`', "`aria-valuetext` reads both percentages", "`aria-orientation`"]
    },
    reducedMotion: {
      description: "The short clip-path glide on keyboard moves only runs at motion level full. Dragging is always immediate.",
      affected: ["clip-path transition", "handle position transition"]
    },
    examples: [
      {
        title: "Default",
        description: "Two stylized UI mockups built from our components. Drag or use the arrow keys.",
        code: `import { ImageComparison } from "@glinui/ui"\n\nexport function Demo() {\n  return <ImageComparison before={<OldUi />} after={<NewUi />} />\n}`,
        render: <ImageComparisonHero />
      },
      {
        title: "Variants",
        description: "Vertical split, and hover mode that follows a fine pointer.",
        code: `<ImageComparison orientation="vertical" before={a} after={b} />\n<ImageComparison hover before={a} after={b} />`,
        render: <ImageComparisonVariants />
      },
      {
        title: "States",
        description: "Compare themes or any other pair of states.",
        code: `<ImageComparison beforeLabel="Light" afterLabel="Dark" before={light} after={dark} />`,
        render: <ImageComparisonThemes />
      },
      {
        title: "In a layout",
        description: "A redesign section with a heading above the comparison.",
        code: `<section aria-labelledby="redesign">\n  <h3 id="redesign">See the redesign</h3>\n  <ImageComparison before={a} after={b} />\n</section>`,
        render: <ImageComparisonLayout />
      }
    ]
  }
}
