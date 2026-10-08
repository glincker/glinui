"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { CaretDown, SidebarSimple } from "@phosphor-icons/react/dist/ssr"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { panelItemTone, resolvePanelVariant, type PanelVariantProp } from "../lib/panel"
import { useGlinStyle } from "./glin-provider"
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "./sheet"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"
import { isDocumentRtl, useSidebar } from "./sidebar-context"

export { SidebarProvider, useSidebar } from "./sidebar-context"
export type { SidebarProviderProps, SidebarContextValue } from "./sidebar-context"

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-0"

const sidebarPanelVariants = cva(
  "flex h-full w-[var(--sidebar-width)] flex-col border-transparent text-[var(--color-foreground)] group-data-[collapsible=icon]/sidebar:w-[var(--sidebar-width-icon)]",
  {
    variants: {
      variant: {
        glinr:
          "border-[color:var(--line-soft)] [background:var(--sheen),var(--face-1,var(--surface-1))] [box-shadow:var(--elev-1)] [--panel-item-r:9999px]",
        plain: "border-[color:var(--color-border)] bg-[var(--surface-1)]",
        solid: "border-[color:var(--line-soft)] bg-[var(--surface-2)] [box-shadow:var(--solid-elev-1)]",
        soft: "border-[color:var(--line-soft)] bg-[var(--surface-2)]",
        outline: "border-[color:color-mix(in_oklab,var(--color-foreground)_22%,transparent)] bg-transparent",
        ghost: "bg-transparent",
        gradient:
          "border-[color:color-mix(in_oklab,var(--color-accent)_40%,transparent)] [background:var(--sheen),var(--face-1,var(--surface-1))] [box-shadow:var(--elev-1)] [--panel-item-r:9999px]",
        glass:
          "border-[color:var(--glass-border)] bg-[color-mix(in_oklab,var(--surface-1)_84%,transparent)] backdrop-blur-xl backdrop-saturate-[180%]"
      },
      side: {
        start: "border-e",
        end: "border-s"
      }
    },
    defaultVariants: { variant: "glinr", side: "start" }
  }
)

export type SidebarProps = Omit<React.HTMLAttributes<HTMLElement>, "dir"> & {
    /**
     * Surface look. Omit for the ambient design style (glinr by default): a lifted rail with hairline
     * separators and a raised pill for the active item. `glass` is opt-in and needs a rich backdrop.
     */
    variant?: PanelVariantProp
    /** Which inline edge the sidebar docks to. */
    side?: "start" | "end"
    /** How the sidebar collapses on desktop. */
    collapsible?: "offcanvas" | "icon" | "none"
    /** Accessible name for the navigation landmark. */
    label?: string
    /** Class names for the outer docking element (height, position). Defaults to sticky full viewport height. */
    containerClassName?: string
  }

export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  (
    { side = "start", variant, collapsible = "offcanvas", label = "Sidebar", className, containerClassName, children, ...props },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()
    const resolved = resolvePanelVariant(variant, useGlinStyle())
    const rtl = isDocumentRtl()

    if (collapsible !== "none" && isMobile) {
      const physical = (side === "start") !== rtl ? "left" : "right"
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetContent
            side={physical}
            variant={resolved}
            data-slot="sidebar"
            data-mobile="true"
            className="w-[var(--sidebar-width-mobile)] p-0 [--sidebar-width-mobile:18rem]"
          >
            <SheetTitle className="sr-only">{label}</SheetTitle>
            <SheetDescription className="sr-only">Application navigation</SheetDescription>
            <nav
              aria-label={label}
              data-collapsible=""
              data-variant={resolved}
              className={cn("group/sidebar flex h-full w-full flex-col", panelItemTone({ variant: resolved }), className)}
            >
              {children}
            </nav>
          </SheetContent>
        </Sheet>
      )
    }

    const collapsedMode = state === "collapsed" && collapsible !== "none" ? collapsible : ""

    return (
      <div
        data-slot="sidebar"
        data-state={state}
        data-collapsible={collapsedMode}
        data-side={side}
        data-variant={resolved}
        className={cn(
          /* Documented motion exception: width (not transform) animates here so the page layout reflows with the rail. */
        "group/sidebar sticky top-0 h-svh shrink-0 transition-[width,visibility] duration-200 ease-[var(--ease-out)] motion-reduce:transition-none",
          "w-[var(--sidebar-width)] data-[collapsible=icon]:w-[var(--sidebar-width-icon)] data-[collapsible=offcanvas]:invisible data-[collapsible=offcanvas]:w-0 data-[collapsible=offcanvas]:overflow-hidden",
          side === "end" && "order-last",
          containerClassName
        )}
      >
        <nav
          ref={ref}
          aria-label={label}
          className={cn("relative", panelItemTone({ variant: resolved }), sidebarPanelVariants({ variant: resolved, side }), className)}
          {...props}
        >
          {children}
        </nav>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

export const SidebarTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, onClick, children, ...props }, ref) => {
    const { toggleSidebar, isMobile, open, openMobile } = useSidebar()
    return (
      <button
        ref={ref}
        type="button"
        data-slot="sidebar-trigger"
        aria-label="Toggle sidebar"
        aria-expanded={isMobile ? openMobile : open}
        onClick={(event) => {
          onClick?.(event)
          if (!event.defaultPrevented) toggleSidebar()
        }}
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--color-foreground)] motion-reduce:transition-none [&_svg]:size-4 rtl:[&_svg]:-scale-x-100",
          focusRing,
          className
        )}
        {...props}
      >
        {children ?? <SidebarSimple weight="regular" aria-hidden="true" />}
      </button>
    )
  }
)
SidebarTrigger.displayName = "SidebarTrigger"

export const SidebarRail = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { toggleSidebar } = useSidebar()
    return (
      <button
        ref={ref}
        type="button"
        tabIndex={-1}
        aria-label="Toggle sidebar"
        title="Toggle sidebar"
        data-slot="sidebar-rail"
        onClick={toggleSidebar}
        className={cn(
          "absolute inset-y-0 z-20 hidden w-3 cursor-col-resize transition-opacity after:absolute after:inset-y-0 after:start-1/2 after:w-px hover:after:bg-[var(--color-accent)] motion-reduce:transition-none sm:flex",
          "group-data-[side=start]/sidebar:-end-1.5 group-data-[side=end]/sidebar:-start-1.5",
          className
        )}
        {...props}
      />
    )
  }
)
SidebarRail.displayName = "SidebarRail"

export const SidebarInset = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <main
      ref={ref}
      data-slot="sidebar-inset"
      className={cn("relative flex min-w-0 flex-1 flex-col bg-[var(--color-background)]", className)}
      {...props}
    />
  )
)
SidebarInset.displayName = "SidebarInset"

export const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="sidebar-header" className={cn("flex flex-col gap-2 p-2 group-data-[variant=glinr]/sidebar:border-b group-data-[variant=glinr]/sidebar:border-[color:var(--line-soft)]", className)} {...props} />
  )
)
SidebarHeader.displayName = "SidebarHeader"

export const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="sidebar-footer"
      className={cn("flex flex-col gap-2 border-t border-[var(--line-soft)] p-2", className)}
      {...props}
    />
  )
)
SidebarFooter.displayName = "SidebarFooter"

export const SidebarSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      aria-orientation="horizontal"
      data-slot="sidebar-separator"
      className={cn("mx-2 h-px w-auto bg-[var(--line-soft)]", className)}
      {...props}
    />
  )
)
SidebarSeparator.displayName = "SidebarSeparator"

export const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="sidebar-content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden p-2 group-data-[collapsible=icon]/sidebar:overflow-hidden",
        className
      )}
      {...props}
    />
  )
)
SidebarContent.displayName = "SidebarContent"

type GroupContextValue = { collapsible: boolean; open: boolean; toggle: () => void; contentId: string }
const GroupContext = React.createContext<GroupContextValue | null>(null)

export type SidebarGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Let users collapse this group by activating its label. */
  collapsible?: boolean
  /** Initial open state for a collapsible group. */
  defaultOpen?: boolean
}

export const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className, collapsible = false, defaultOpen = true, ...props }, ref) => {
    const [open, setOpen] = React.useState(defaultOpen)
    const contentId = React.useId()
    const value = React.useMemo(
      () => ({ collapsible, open: collapsible ? open : true, toggle: () => setOpen((v) => !v), contentId }),
      [collapsible, open, contentId]
    )
    return (
      <GroupContext.Provider value={value}>
        <div
          ref={ref}
          data-slot="sidebar-group"
          className={cn("relative flex w-full min-w-0 flex-col p-1", className)}
          {...props}
        />
      </GroupContext.Provider>
    )
  }
)
SidebarGroup.displayName = "SidebarGroup"

const groupLabelClasses =
  "flex h-8 w-full shrink-0 items-center rounded-lg px-2 text-xs font-medium uppercase tracking-wide text-[var(--color-muted)] group-data-[variant=glinr]/sidebar:font-mono group-data-[collapsible=icon]/sidebar:hidden"

export const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const group = React.useContext(GroupContext)
    if (group?.collapsible) {
      return (
        <button
          type="button"
          data-slot="sidebar-group-label"
          aria-expanded={group.open}
          aria-controls={group.contentId}
          onClick={group.toggle}
          className={cn(groupLabelClasses, "justify-between transition-colors hover:text-[var(--color-foreground)] motion-reduce:transition-none", focusRing, className)}
        >
          <span>{children}</span>
          <CaretDown
            aria-hidden="true"
            className={cn("size-3 transition-transform duration-150 motion-reduce:transition-none", !group.open && "-rotate-90 rtl:rotate-90")}
          />
        </button>
      )
    }
    return (
      <div ref={ref} data-slot="sidebar-group-label" className={cn(groupLabelClasses, className)} {...props}>
        {children}
      </div>
    )
  }
)
SidebarGroupLabel.displayName = "SidebarGroupLabel"

export const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const group = React.useContext(GroupContext)
    return (
      <div
        ref={ref}
        id={group?.collapsible ? group.contentId : undefined}
        hidden={group ? !group.open : undefined}
        data-slot="sidebar-group-content"
        className={cn("w-full text-sm", className)}
        {...props}
      />
    )
  }
)
SidebarGroupContent.displayName = "SidebarGroupContent"

export const SidebarMenu = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} data-slot="sidebar-menu" className={cn("flex w-full min-w-0 flex-col gap-1 group-data-[collapsible=icon]/sidebar:items-center", className)} {...props} />
  )
)
SidebarMenu.displayName = "SidebarMenu"

export const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} data-slot="sidebar-menu-item" className={cn("group/menu-item relative", className)} {...props} />
  )
)
SidebarMenuItem.displayName = "SidebarMenuItem"

const menuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-[var(--panel-item-r,0.5rem)] border border-transparent text-start text-sm outline-none transition-[background-color,color,box-shadow] duration-150 hover:bg-[color-mix(in_oklab,var(--color-foreground)_7%,transparent)] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 motion-reduce:transition-none data-[active=true]:[background:var(--panel-item-bg,var(--surface-3))] data-[active=true]:[box-shadow:var(--panel-item-shadow,none)] data-[active=true]:font-medium [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 group-data-[collapsible=icon]/sidebar:!size-9 group-data-[collapsible=icon]/sidebar:justify-center group-data-[collapsible=icon]/sidebar:!p-0 group-data-[collapsible=icon]/sidebar:[&>span]:sr-only",
  {
    variants: {
      variant: {
        default: "text-[var(--color-foreground)]",
        outline:
          "border border-[var(--line-soft)] bg-[var(--surface-1)] text-[var(--color-foreground)] [box-shadow:var(--elev-1)] hover:border-[var(--color-border)]"
      },
      size: { sm: "h-7 px-2 text-xs", md: "h-9 px-2.5", lg: "h-11 px-3" }
    },
    defaultVariants: { variant: "default", size: "md" }
  }
)

export type SidebarMenuButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof menuButtonVariants> & {
    asChild?: boolean
    /** Marks the current page. Sets aria-current="page". */
    isActive?: boolean
    /** Tooltip shown only while the sidebar is collapsed to icons. */
    tooltip?: string
  }

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ asChild = false, isActive = false, tooltip, variant, size, className, ...props }, ref) => {
    const { state, isMobile } = useSidebar()
    const Comp = asChild ? Slot : "button"
    const button = (
      <Comp
        ref={ref}
        {...(asChild ? {} : { type: "button" as const })}
        data-slot="sidebar-menu-button"
        data-active={isActive}
        aria-current={isActive ? "page" : undefined}
        className={cn(menuButtonVariants({ variant, size }), focusRing, className)}
        {...props}
      />
    )
    if (!tooltip || state !== "collapsed" || isMobile) return button
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side={isDocumentRtl() ? "left" : "right"}>{tooltip}</TooltipContent>
      </Tooltip>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

export const SidebarMenuBadge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="sidebar-menu-badge"
      className={cn(
        "pointer-events-none absolute end-1 top-1/2 flex h-5 min-w-5 -translate-y-1/2 select-none items-center justify-center rounded-md bg-[var(--surface-3)] px-1 text-xs font-medium tabular-nums group-data-[collapsible=icon]/sidebar:hidden",
        className
      )}
      {...props}
    />
  )
)
SidebarMenuBadge.displayName = "SidebarMenuBadge"
