"use client"

import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { CaretDown } from "@phosphor-icons/react/dist/ssr"
import { cva } from "class-variance-authority"

import { cn } from "../lib/cn"
import { panelItemTone, panelSurface, type PanelVariantProp } from "../lib/panel"
import { useResolvedPanelVariant } from "./panel-context"

type NavigationMenuVariant = PanelVariantProp

const NavigationMenuVariantContext = React.createContext<NavigationMenuVariant | undefined>(undefined)

/** Layout of the shared viewport. The surface look comes from `panelSurface`. */
const panelVariants = cva("overflow-hidden")

const PANEL_HOVER =
  "hover:[background:var(--panel-item-bg,color-mix(in_oklab,var(--color-foreground)_8%,transparent))] hover:[box-shadow:var(--panel-item-shadow,none)] data-[active]:[background:var(--panel-item-bg,color-mix(in_oklab,var(--color-foreground)_8%,transparent))] data-[active]:[box-shadow:var(--panel-item-shadow,none)]"

export const navigationMenuTriggerStyle = cva(
  `group inline-flex h-9 w-max items-center justify-center rounded-[var(--panel-item-r,0.5rem)] border border-transparent px-3.5 py-2 text-sm font-medium text-[var(--color-foreground)] outline-none transition-[background-color,box-shadow,color] duration-100 ${PANEL_HOVER} focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] data-[state=open]:[background:var(--panel-item-bg,color-mix(in_oklab,var(--color-foreground)_8%,transparent))] data-[state=open]:[box-shadow:var(--panel-item-shadow,none)] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none`
)

export type NavigationMenuProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root> & {
  /** Surface look of the viewport panel and trigger pills. Omit for the ambient design style (glinr by default). */
  variant?: NavigationMenuVariant
  /** Render content in a shared animated viewport (default) or inline per item. */
  viewport?: boolean
}

export const NavigationMenu = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Root>,
  NavigationMenuProps
>(({ className, children, variant, viewport = true, ...props }, ref) => {
  const resolved = useResolvedPanelVariant(variant)
  return (
    <NavigationMenuVariantContext.Provider value={variant}>
      <NavigationMenuPrimitive.Root
        ref={ref}
        data-variant={resolved}
        className={cn(
          panelItemTone({ variant: resolved }),
          "relative z-10 flex max-w-max flex-1 items-center justify-center",
          className
        )}
        {...props}
      >
        {children}
        {viewport ? <NavigationMenuViewport /> : null}
      </NavigationMenuPrimitive.Root>
    </NavigationMenuVariantContext.Provider>
  )
})
NavigationMenu.displayName = "NavigationMenu"

export const NavigationMenuList = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn("group flex flex-1 list-none items-center justify-center gap-1", className)}
    {...props}
  />
))
NavigationMenuList.displayName = "NavigationMenuList"

export const NavigationMenuItem = NavigationMenuPrimitive.Item

export const NavigationMenuTrigger = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger ref={ref} className={cn(navigationMenuTriggerStyle(), "gap-1", className)} {...props}>
    {children}
    <CaretDown
      aria-hidden="true"
      className="relative top-px size-3 transition-transform [--tw-duration:var(--motion-overlay-in)] group-data-[state=open]:rotate-180 motion-reduce:transition-none"
    />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = "NavigationMenuTrigger"

export const NavigationMenuContent = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "start-0 top-0 w-full p-2 [--tw-duration:var(--motion-overlay-in)] data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 rtl:data-[motion=from-end]:slide-in-from-left-52 rtl:data-[motion=from-start]:slide-in-from-right-52 rtl:data-[motion=to-end]:slide-out-to-left-52 rtl:data-[motion=to-start]:slide-out-to-right-52 md:absolute md:w-auto motion-reduce:data-[motion^=from-]:animate-none motion-reduce:data-[motion^=to-]:animate-none",
      className
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = "NavigationMenuContent"

export const NavigationMenuLink = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Link>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Link
    ref={ref}
    className={cn(
      `block select-none rounded-[var(--panel-item-r,0.5rem)] border border-transparent p-3 outline-none transition-[background-color,box-shadow] duration-100 ${PANEL_HOVER} focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] motion-reduce:transition-none`,
      className
    )}
    {...props}
  />
))
NavigationMenuLink.displayName = "NavigationMenuLink"

export const NavigationMenuViewport = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport> & { variant?: NavigationMenuVariant }
>(({ className, variant, ...props }, ref) => {
  const inherited = React.useContext(NavigationMenuVariantContext)
  const resolved = useResolvedPanelVariant(variant ?? inherited)
  return (
    <div className="absolute start-0 top-full flex justify-center">
      <NavigationMenuPrimitive.Viewport
        ref={ref}
        data-variant={resolved}
        className={cn(
          panelSurface({ variant: resolved, shape: "menu" }),
          panelVariants(),
          "origin-[top_center] relative mt-2 h-[var(--radix-navigation-menu-viewport-height)] w-full md:w-[var(--radix-navigation-menu-viewport-width)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 [--tw-duration:var(--motion-overlay-in)] motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none",
          className
        )}
        {...props}
      />
    </div>
  )
})
NavigationMenuViewport.displayName = "NavigationMenuViewport"

export const NavigationMenuIndicator = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in motion-reduce:animate-none",
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] size-2 rotate-45 rounded-tl-sm bg-[var(--line-soft)]" />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName = "NavigationMenuIndicator"

export { panelVariants as navigationMenuPanelVariants }
