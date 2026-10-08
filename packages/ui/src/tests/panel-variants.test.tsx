import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  GlinProvider,
  GlassBreadcrumb,
  GlassDock,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  panelSurface,
  resolvePanelVariant,
  type GlinStyle,
  type PanelVariantProp
} from "../index"

function ModalDemo({ variant, style }: { variant?: PanelVariantProp; style?: GlinStyle }) {
  const body = (
    <Modal defaultOpen>
      <ModalTrigger>Open</ModalTrigger>
      <ModalContent variant={variant} data-testid="content">
        <ModalHeader data-testid="header">
          <ModalTitle>Title</ModalTitle>
          <ModalDescription>Text</ModalDescription>
        </ModalHeader>
      </ModalContent>
    </Modal>
  )
  return style ? <GlinProvider defaults={{ style }}>{body}</GlinProvider> : body
}

describe("resolvePanelVariant", () => {
  it("follows the ambient style and lets legacy names map onto the vocabulary", () => {
    expect(resolvePanelVariant(undefined)).toBe("glinr")
    expect(resolvePanelVariant("default", "minimal")).toBe("plain")
    expect(resolvePanelVariant(undefined, "glass")).toBe("glass")
    expect(resolvePanelVariant("solid", "glass")).toBe("solid")
    expect(resolvePanelVariant("frosted")).toBe("glass")
    expect(resolvePanelVariant("liquid")).toBe("glass")
    expect(resolvePanelVariant("matte")).toBe("solid")
  })
})

describe("panelSurface", () => {
  it("builds glinr with a gradient hairline ring and no blur", () => {
    const cls = panelSurface({ variant: "glinr" })
    expect(cls).toContain("var(--ring-img)")
    expect(cls).toContain("var(--elev-3)")
    expect(cls).not.toContain("backdrop-blur")
  })

  it("builds plain as shadcn: border and shadow-md, no ring gradient", () => {
    const cls = panelSurface({ variant: "plain", shape: "dialog" })
    expect(cls).toContain("shadow-md")
    expect(cls).toContain("rounded-lg")
    expect(cls).not.toContain("var(--ring-img)")
  })

  it("keeps glass opt-in with a readable floor and a reduced-transparency fallback", () => {
    const cls = panelSurface({ variant: "glass" })
    expect(cls).toContain("backdrop-blur-xl")
    expect(cls).toContain("var(--surface-1)_88%")
    expect(cls).toContain("prefers-reduced-transparency")
  })

  it("never emits invalid slash opacity or dashes", () => {
    for (const variant of ["glinr", "plain", "solid", "soft", "outline", "ghost", "gradient", "glass"] as const) {
      const cls = panelSurface({ variant })
      expect(cls).not.toMatch(/\]\/\d/)
      expect(cls).not.toMatch(/[–—]/)
    }
  })
})

describe("Modal default resolution", () => {
  it("defaults to glinr with no provider and raises the header strip", () => {
    render(<ModalDemo />)
    expect(screen.getByTestId("content")).toHaveAttribute("data-variant", "glinr")
    expect(screen.getByTestId("content").className).not.toContain("backdrop-blur")
    expect(screen.getByTestId("header").className).toContain("var(--face-0")
  })

  it("follows style=minimal (plain) and style=glass", () => {
    const { unmount } = render(<ModalDemo style="minimal" />)
    expect(screen.getByTestId("content")).toHaveAttribute("data-variant", "plain")
    expect(screen.getByTestId("header").className).not.toContain("var(--face-0")
    unmount()
    render(<ModalDemo style="glass" />)
    expect(screen.getByTestId("content")).toHaveAttribute("data-variant", "glass")
  })

  it("lets an explicit variant win over the ambient style", () => {
    render(<ModalDemo variant="solid" style="glass" />)
    expect(screen.getByTestId("content")).toHaveAttribute("data-variant", "solid")
    expect(screen.getByTestId("content").className).not.toContain("backdrop-blur")
  })

  it("keeps the flat dim scrim without blur", () => {
    render(<ModalDemo />)
    const overlay = document.querySelector("[data-state='open'].fixed.inset-0")
    expect(overlay).not.toBeNull()
    expect(overlay?.className).not.toContain("backdrop-blur")
  })
})

describe("overlay panels default to glinr", () => {
  it("AlertDialog", () => {
    render(
      <AlertDialog defaultOpen>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent data-testid="content">
          <AlertDialogTitle>Sure?</AlertDialogTitle>
          <AlertDialogDescription>Really</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    )
    expect(screen.getByTestId("content")).toHaveAttribute("data-variant", "glinr")
  })

  it("Sheet", () => {
    render(
      <Sheet defaultOpen>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent data-testid="content">
          <SheetTitle>T</SheetTitle>
          <SheetDescription>D</SheetDescription>
        </SheetContent>
      </Sheet>
    )
    expect(screen.getByTestId("content")).toHaveAttribute("data-variant", "glinr")
  })

  it("Popover and HoverCard", () => {
    render(
      <>
        <Popover defaultOpen>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent data-testid="popover">x</PopoverContent>
        </Popover>
        <HoverCard defaultOpen>
          <HoverCardTrigger>Hover</HoverCardTrigger>
          <HoverCardContent data-testid="hover">y</HoverCardContent>
        </HoverCard>
      </>
    )
    expect(screen.getByTestId("popover")).toHaveAttribute("data-variant", "glinr")
    expect(screen.getByTestId("hover")).toHaveAttribute("data-variant", "glinr")
  })

  it("Popover glass is opt-in", () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent variant="glass" data-testid="popover">
          x
        </PopoverContent>
      </Popover>
    )
    expect(screen.getByTestId("popover").className).toContain("backdrop-blur-xl")
  })
})

describe("Tooltip", () => {
  it("is a compact high-contrast pill that inverts per scope, and glass is opt-in", async () => {
    const user = userEvent.setup()
    const { unmount } = render(
      <TooltipProvider delayDuration={0}>
        <Tooltip defaultOpen>
          <TooltipTrigger>Hover</TooltipTrigger>
          <TooltipContent data-testid="tip">Info</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    const cls = screen.getAllByTestId("tip")[0]?.className ?? ""
    expect(cls).toContain("var(--neutral-solid-fg)")
    expect(cls).not.toContain("backdrop-blur")
    unmount()
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip defaultOpen>
          <TooltipTrigger>Hover</TooltipTrigger>
          <TooltipContent variant="glass" data-testid="tip">
            Info
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    expect(screen.getAllByTestId("tip")[0]?.className).toContain("backdrop-blur-xl")
    await user.keyboard("{Escape}")
  })
})

describe("Glass family", () => {
  it("GlassDock and GlassBreadcrumb stay glass by default and accept other variants", () => {
    const items = [{ id: "a", icon: "A", label: "Alpha" }]
    const { rerender } = render(<GlassDock data-testid="dock" items={items} />)
    expect(screen.getByTestId("dock")).toHaveAttribute("data-variant", "glass")
    expect(screen.getByTestId("dock").className).toContain("var(--surface-1)_88%")
    rerender(<GlassDock data-testid="dock" items={items} variant="plain" />)
    expect(screen.getByTestId("dock")).toHaveAttribute("data-variant", "plain")
    expect(screen.getByTestId("dock").className).not.toContain("backdrop-blur")

    const crumbs = [
      { id: "1", label: "Home", href: "/" },
      { id: "2", label: "Docs" }
    ]
    const view = render(<GlassBreadcrumb data-testid="crumb" items={crumbs} />)
    expect(screen.getByTestId("crumb")).toHaveAttribute("data-variant", "glass")
    view.rerender(<GlassBreadcrumb data-testid="crumb" items={crumbs} variant="glinr" />)
    expect(screen.getByTestId("crumb")).toHaveAttribute("data-variant", "glinr")
    expect(screen.getByTestId("crumb").className).not.toContain("backdrop-blur")
  })
})
