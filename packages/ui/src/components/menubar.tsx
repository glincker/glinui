"use client"

import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Check, CaretRight, Circle } from "@phosphor-icons/react/dist/ssr"
import { cva } from "class-variance-authority"

import { cn } from "../lib/cn"
import { PANEL_ITEM, PANEL_MOTION, PANEL_SEPARATOR, panelSurface, type PanelVariantProp } from "../lib/panel"
import { PanelVariantProvider, useResolvedPanelVariant } from "./panel-context"

type MenubarVariant = PanelVariantProp

const MenubarVariantContext = React.createContext<MenubarVariant | undefined>(undefined)

/** Layout of the bar. The surface look comes from `panelSurface`. */
const menubarVariants = cva("flex h-10 w-fit items-center gap-1 p-1 [box-shadow:var(--elev-1)]")

const menubarContentVariants = cva(`z-50 min-w-48 p-1 text-sm ${PANEL_MOTION}`)

const itemBase = PANEL_ITEM

export type MenubarProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root> & {
  /** Surface look of the bar and its menus. Omit for the ambient design style (glinr by default). */
  variant?: MenubarVariant
}

export const Menubar = React.forwardRef<React.ComponentRef<typeof MenubarPrimitive.Root>, MenubarProps>(
  ({ className, variant, ...props }, ref) => {
    const resolved = useResolvedPanelVariant(variant)
    return (
      <MenubarVariantContext.Provider value={variant}>
        <MenubarPrimitive.Root
          ref={ref}
          data-variant={resolved}
          className={cn(panelSurface({ variant: resolved, shape: "menu" }), menubarVariants(), className)}
          {...props}
        />
      </MenubarVariantContext.Provider>
    )
  }
)
Menubar.displayName = "Menubar"

export const MenubarMenu = (props: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Menu>) => (
  <MenubarPrimitive.Menu {...props} />
)
MenubarMenu.displayName = "MenubarMenu"
export const MenubarGroup = MenubarPrimitive.Group
export const MenubarPortal = MenubarPrimitive.Portal
export const MenubarSub = MenubarPrimitive.Sub
export const MenubarRadioGroup = MenubarPrimitive.RadioGroup

export const MenubarTrigger = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-[var(--panel-item-r,0.5rem)] border border-transparent px-3 py-1.5 text-sm font-medium outline-none transition-colors duration-100 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] data-[highlighted]:[background:var(--panel-item-bg,color-mix(in_oklab,var(--color-foreground)_8%,transparent))] data-[state=open]:[background:var(--panel-item-bg,color-mix(in_oklab,var(--color-foreground)_8%,transparent))] data-[highlighted]:[box-shadow:var(--panel-item-shadow,none)] data-[state=open]:[box-shadow:var(--panel-item-shadow,none)] motion-reduce:transition-none",
      className
    )}
    {...props}
  />
))
MenubarTrigger.displayName = "MenubarTrigger"

export type MenubarContentProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content> & {
  /** Surface look. Defaults to the bar's variant, then the ambient design style. */
  variant?: MenubarVariant
}

export const MenubarContent = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.Content>,
  MenubarContentProps
>(({ className, variant, align = "start", alignOffset = -4, sideOffset = 8, children, ...props }, ref) => {
  const inherited = React.useContext(MenubarVariantContext)
  const resolved = useResolvedPanelVariant(variant ?? inherited)
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        data-variant={resolved}
        className={cn(panelSurface({ variant: resolved, shape: "menu" }), menubarContentVariants(), className)}
        {...props}
      >
        <PanelVariantProvider value={resolved}>{children}</PanelVariantProvider>
      </MenubarPrimitive.Content>
    </MenubarPrimitive.Portal>
  )
})
MenubarContent.displayName = "MenubarContent"

export const MenubarItem = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item ref={ref} className={cn(itemBase, inset && "ps-8", className)} {...props} />
))
MenubarItem.displayName = "MenubarItem"

export const MenubarCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem ref={ref} className={cn(itemBase, "ps-8", className)} checked={checked} {...props}>
    <span className="absolute start-2 flex size-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="size-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = "MenubarCheckboxItem"

export const MenubarRadioItem = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem ref={ref} className={cn(itemBase, "ps-8", className)} {...props}>
    <span className="absolute start-2 flex size-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="size-2.5 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = "MenubarRadioItem"

export const MenubarLabel = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "ps-8", className)}
    {...props}
  />
))
MenubarLabel.displayName = "MenubarLabel"

export const MenubarSeparator = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator ref={ref} className={cn(PANEL_SEPARATOR, className)} {...props} />
))
MenubarSeparator.displayName = "MenubarSeparator"

export const MenubarShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("ms-auto ps-4 font-mono text-xs tracking-widest text-[var(--color-muted)]", className)} {...props} />
)
MenubarShortcut.displayName = "MenubarShortcut"

export const MenubarSubTrigger = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & { inset?: boolean }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(itemBase, "data-[state=open]:[background:var(--panel-item-bg,color-mix(in_oklab,var(--color-foreground)_8%,transparent))]", inset && "ps-8", className)}
    {...props}
  >
    {children}
    <CaretRight className="ms-auto size-4 rtl:-scale-x-100" />
  </MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = "MenubarSubTrigger"

export const MenubarSubContent = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent> & { variant?: MenubarVariant }
>(({ className, variant, children, ...props }, ref) => {
  const inherited = React.useContext(MenubarVariantContext)
  const resolved = useResolvedPanelVariant(variant ?? inherited)
  return (
    <MenubarPrimitive.SubContent
      ref={ref}
      data-variant={resolved}
      className={cn(panelSurface({ variant: resolved, shape: "menu" }), menubarContentVariants(), className)}
      {...props}
    >
      <PanelVariantProvider value={resolved}>{children}</PanelVariantProvider>
    </MenubarPrimitive.SubContent>
  )
})
MenubarSubContent.displayName = "MenubarSubContent"

export { menubarVariants, menubarContentVariants }
