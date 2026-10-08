"use client"

import * as React from "react"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
import { Check, CaretRight, Circle } from "@phosphor-icons/react/dist/ssr"
import { cva } from "class-variance-authority"

import { cn } from "../lib/cn"
import { PANEL_ITEM, PANEL_MOTION, PANEL_SEPARATOR, panelSurface, type PanelVariantProp } from "../lib/panel"
import { PanelVariantProvider, useResolvedPanelVariant } from "./panel-context"

type ContextMenuVariant = PanelVariantProp

const ContextMenuVariantContext = React.createContext<ContextMenuVariant | undefined>(undefined)

const contextMenuContentVariants = cva(`z-50 min-w-48 p-1 text-sm ${PANEL_MOTION}`)

const itemBase = PANEL_ITEM

export type ContextMenuProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Root> & {
  /** Surface treatment shared by every floating panel in this menu. */
  variant?: ContextMenuVariant
}

export const ContextMenu = ({ variant, ...props }: ContextMenuProps) => (
  <ContextMenuVariantContext.Provider value={variant}>
    <ContextMenuPrimitive.Root {...props} />
  </ContextMenuVariantContext.Provider>
)
ContextMenu.displayName = "ContextMenu"

export const ContextMenuTrigger = ContextMenuPrimitive.Trigger
export const ContextMenuGroup = ContextMenuPrimitive.Group
export const ContextMenuPortal = ContextMenuPrimitive.Portal
export const ContextMenuSub = ContextMenuPrimitive.Sub
export const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

export type ContextMenuContentProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content> & {
  /** Surface look. Omit for the ambient design style (glinr by default). `glass` is opt-in and needs a rich backdrop. */
  variant?: ContextMenuVariant
}

export const ContextMenuContent = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.Content>,
  ContextMenuContentProps
>(({ className, variant, children, ...props }, ref) => {
  const inherited = React.useContext(ContextMenuVariantContext)
  const resolved = useResolvedPanelVariant(variant ?? inherited)
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        ref={ref}
        data-variant={resolved}
        className={cn(panelSurface({ variant: resolved, shape: "menu" }), contextMenuContentVariants(), className)}
        {...props}
      >
        <PanelVariantProvider value={resolved}>{children}</PanelVariantProvider>
      </ContextMenuPrimitive.Content>
    </ContextMenuPrimitive.Portal>
  )
})
ContextMenuContent.displayName = "ContextMenuContent"

export const ContextMenuItem = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item ref={ref} className={cn(itemBase, inset && "ps-8", className)} {...props} />
))
ContextMenuItem.displayName = "ContextMenuItem"

export const ContextMenuCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem ref={ref} className={cn(itemBase, "ps-8", className)} checked={checked} {...props}>
    <span className="absolute start-2 flex size-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Check className="size-4" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
))
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem"

export const ContextMenuRadioItem = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem ref={ref} className={cn(itemBase, "ps-8", className)} {...props}>
    <span className="absolute start-2 flex size-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Circle className="size-2.5 fill-current" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
))
ContextMenuRadioItem.displayName = "ContextMenuRadioItem"

export const ContextMenuLabel = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "ps-8", className)}
    {...props}
  />
))
ContextMenuLabel.displayName = "ContextMenuLabel"

export const ContextMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator ref={ref} className={cn(PANEL_SEPARATOR, className)} {...props} />
))
ContextMenuSeparator.displayName = "ContextMenuSeparator"

export const ContextMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("ms-auto ps-4 font-mono text-xs tracking-widest text-[var(--color-muted)]", className)} {...props} />
)
ContextMenuShortcut.displayName = "ContextMenuShortcut"

export const ContextMenuSubTrigger = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & { inset?: boolean }
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(itemBase, "data-[state=open]:[background:var(--panel-item-bg,color-mix(in_oklab,var(--color-foreground)_8%,transparent))]", inset && "ps-8", className)}
    {...props}
  >
    {children}
    <CaretRight className="ms-auto size-4 rtl:-scale-x-100" />
  </ContextMenuPrimitive.SubTrigger>
))
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger"

export const ContextMenuSubContent = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent> & { variant?: ContextMenuVariant }
>(({ className, variant, children, ...props }, ref) => {
  const inherited = React.useContext(ContextMenuVariantContext)
  const resolved = useResolvedPanelVariant(variant ?? inherited)
  return (
    <ContextMenuPrimitive.SubContent
      ref={ref}
      data-variant={resolved}
      className={cn(panelSurface({ variant: resolved, shape: "menu" }), contextMenuContentVariants(), className)}
      {...props}
    >
      <PanelVariantProvider value={resolved}>{children}</PanelVariantProvider>
    </ContextMenuPrimitive.SubContent>
  )
})
ContextMenuSubContent.displayName = "ContextMenuSubContent"

export { contextMenuContentVariants }
