"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, CaretRight, Circle } from "@phosphor-icons/react/dist/ssr"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { PANEL_ITEM, PANEL_MOTION, PANEL_SEPARATOR, panelSurface, type PanelVariantProp } from "../lib/panel"
import { PanelVariantProvider, usePanelVariant, useResolvedPanelVariant } from "./panel-context"

const dropdownMenuTriggerVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-surface)] text-[var(--color-foreground)] border border-[var(--color-border)]",
        glass: "backdrop-blur-xl backdrop-saturate-[180%] bg-[var(--glass-3-surface)] border border-white/20 [border-top-color:var(--glass-refraction-top)] [box-shadow:0_0_0_1px_rgb(255_255_255_/_0.1)_inset,var(--shadow-glass-sm)] dark:border-white/[0.1] dark:shadow-[0_0_0_1px_rgb(255_255_255_/_0.05)_inset,0_8px_24px_rgb(0_0_0_/_0.35)] text-[var(--color-foreground)]",
        frosted: "backdrop-blur-[40px] backdrop-saturate-[200%] bg-[var(--glass-4-surface)] border border-white/30 [border-top-color:var(--glass-refraction-top)] [box-shadow:0_0_0_1px_rgb(255_255_255_/_0.15)_inset,0_0_16px_rgb(255_255_255_/_0.1)_inset,var(--shadow-glass-md)] dark:border-white/[0.14] dark:shadow-[0_0_0_1px_rgb(255_255_255_/_0.07)_inset,0_0_16px_rgb(255_255_255_/_0.03)_inset,0_8px_24px_rgb(0_0_0_/_0.4)] text-[var(--color-foreground)]",
        outline: "bg-transparent border border-[var(--color-border)] text-[var(--color-foreground)]",
        ghost: "bg-transparent border border-transparent text-[var(--color-foreground)]"
      },
      size: {
        sm: "h-8 px-3",
        md: "h-10 px-4",
        lg: "h-11 px-5"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
)

const dropdownMenuContentVariants = cva(`z-50 min-w-44 p-1 ${PANEL_MOTION}`, {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base"
    }
  },
  defaultVariants: {
    size: "md"
  }
})

const dropdownMenuItemVariants = cva(PANEL_ITEM, {
  variants: {
    /** Accepted for backwards compatibility. Items follow the variant of their panel. */
    variant: {
      default: "",
      glass: "",
      frosted: "",
      outline: "",
      ghost: ""
    },
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "md"
  }
})

export type DropdownMenuProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root>

export const DropdownMenu = DropdownMenuPrimitive.Root

export type DropdownMenuTriggerProps =
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger> &
  VariantProps<typeof dropdownMenuTriggerVariants>

export const DropdownMenuTrigger = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Trigger>,
  DropdownMenuTriggerProps
>(({ className, variant, size, asChild, ...props }, ref) => (
  <DropdownMenuPrimitive.Trigger
    ref={ref}
    asChild={asChild}
    className={cn(asChild ? undefined : dropdownMenuTriggerVariants({ variant, size }), className)}
    {...props}
  />
))

DropdownMenuTrigger.displayName = DropdownMenuPrimitive.Trigger.displayName

export type DropdownMenuContentProps =
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> &
  VariantProps<typeof dropdownMenuContentVariants> & {
  /** Surface look. Omit for the ambient design style (glinr by default). `glass` is opt-in and needs a rich backdrop. */
  variant?: PanelVariantProp
  /** Element to portal into. Defaults to document.body. */
  container?: HTMLElement | null
  }

export const DropdownMenuContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuContentProps
>(({ className, sideOffset = 6, variant, size, container, children, ...props }, ref) => {
  const resolved = useResolvedPanelVariant(variant)
  return (
    <DropdownMenuPrimitive.Portal container={container ?? undefined}>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        data-variant={resolved}
        className={cn(panelSurface({ variant: resolved, shape: "menu" }), dropdownMenuContentVariants({ size }), className)}
        {...props}
      >
        <PanelVariantProvider value={resolved}>{children}</PanelVariantProvider>
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  )
})

DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

export type DropdownMenuItemProps =
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> &
  VariantProps<typeof dropdownMenuItemVariants> & { inset?: boolean }

export const DropdownMenuItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(({ className, inset, variant, size, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(dropdownMenuItemVariants({ variant, size }), inset ? "pl-8" : "", className)}
    {...props}
  />
))

DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

export type DropdownMenuCheckboxItemProps =
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem> &
  VariantProps<typeof dropdownMenuItemVariants>

export const DropdownMenuCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  DropdownMenuCheckboxItemProps
>(({ className, children, checked, variant, size, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(dropdownMenuItemVariants({ variant, size }), "pl-8", className)}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))

DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName

export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

export type DropdownMenuRadioItemProps =
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem> &
  VariantProps<typeof dropdownMenuItemVariants>

export const DropdownMenuRadioItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.RadioItem>,
  DropdownMenuRadioItemProps
>(({ className, children, variant, size, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(dropdownMenuItemVariants({ variant, size }), "pl-8", className)}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2.5 w-2.5 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))

DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

export type DropdownMenuLabelProps =
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> &
  { inset?: boolean }

export const DropdownMenuLabel = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Label>,
  DropdownMenuLabelProps
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props}
  />
))

DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

export type DropdownMenuSeparatorProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Separator
>

export const DropdownMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Separator>,
  DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator ref={ref} className={cn(PANEL_SEPARATOR, className)} {...props} />
))

DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

export type DropdownMenuShortcutProps = React.HTMLAttributes<HTMLSpanElement>

export const DropdownMenuShortcut = ({ className, ...props }: DropdownMenuShortcutProps) => {
  return <span className={cn("ml-auto font-mono text-xs tracking-widest text-[var(--color-muted)]", className)} {...props} />
}

export const DropdownMenuSub = DropdownMenuPrimitive.Sub

export type DropdownMenuSubTriggerProps =
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> &
  VariantProps<typeof dropdownMenuItemVariants> & { inset?: boolean }

export const DropdownMenuSubTrigger = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.SubTrigger>,
  DropdownMenuSubTriggerProps
>(({ className, inset, children, variant, size, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(dropdownMenuItemVariants({ variant, size }), inset && "pl-8", className)}
    {...props}
  >
    {children}
    <CaretRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
))

DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName

export type DropdownMenuSubContentProps =
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent> &
  VariantProps<typeof dropdownMenuContentVariants> & { variant?: PanelVariantProp }

export const DropdownMenuSubContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.SubContent>,
  DropdownMenuSubContentProps
>(({ className, variant, size, children, ...props }, ref) => {
  const inherited = usePanelVariant()
  const resolved = useResolvedPanelVariant(variant ?? inherited)
  return (
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      data-variant={resolved}
      className={cn(panelSurface({ variant: resolved, shape: "menu" }), dropdownMenuContentVariants({ size }), className)}
      {...props}
    >
      <PanelVariantProvider value={resolved}>{children}</PanelVariantProvider>
    </DropdownMenuPrimitive.SubContent>
  )
})

DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName
