"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva } from "class-variance-authority"

import { cn } from "../lib/cn"
import { resolveControlVariant, type ControlVariant, type ControlVariantProp } from "../lib/control"
import { useGlinStyle } from "./glin-provider"

type TabsSize = "sm" | "md" | "lg"

/**
 * Tabs look. Omit to follow the ambient design style (glinr = raised pill keys, minimal = plain muted track).
 * `keys` is the explicit name of the glinr segmented look (kept for backward compatibility).
 */
export type TabsVariant = ControlVariantProp | "keys"

const TABS_ALLOWED = ["glinr", "solid", "plain", "soft", "outline", "ghost", "glass", "underline", "liquid", "matte"] as const satisfies readonly ControlVariant[]

const tabsListVariants = cva(
  "inline-flex items-center rounded-xl border p-1 transition-[background-color,border-color,box-shadow] duration-fast ease-standard motion-reduce:transition-none",
  {
    variants: {
      variant: {
        glinr: "gap-1 rounded-full border-transparent p-[3px] [--face:var(--face-2,var(--surface-2))] [--ring-img:var(--ring)] [background:var(--sheen)_padding-box,linear-gradient(var(--face),var(--face))_padding-box,var(--ring-img)_border-box] [box-shadow:var(--elev-1)]",
        keys: "gap-1 rounded-full border-transparent p-[3px] [--face:var(--face-2,var(--surface-2))] [--ring-img:var(--ring)] [background:var(--sheen)_padding-box,linear-gradient(var(--face),var(--face))_padding-box,var(--ring-img)_border-box] [box-shadow:var(--elev-1)]",
        solid: "gap-1 border-[color:var(--color-border)] bg-[var(--surface-3)] [box-shadow:var(--elev-inset)]",
        plain: "rounded-lg border-transparent bg-[var(--surface-2)] p-[3px]",
        soft: "gap-1 border-transparent bg-transparent p-0",
        outline: "border-[color:var(--color-border)] bg-transparent",
        ghost: "border-transparent bg-transparent",
        underline: "rounded-none border-0 border-b border-[color:var(--color-border)] bg-transparent p-0",
        glass: "border-[color:var(--glass-border)] [border-top-color:var(--glass-refraction-top)] bg-[var(--glass-readable)] bg-clip-padding backdrop-blur-xl backdrop-saturate-[180%]",
        liquid:
          "border-white/25 [border-top-color:var(--glass-refraction-top)] bg-[radial-gradient(circle_at_16%_14%,rgb(255_255_255_/_0.72),transparent_46%),linear-gradient(165deg,rgb(255_255_255_/_0.58),rgb(238_238_238_/_0.32))] dark:border-white/[0.14] dark:[border-top-color:rgb(255_255_255_/_0.32)] dark:bg-[linear-gradient(165deg,rgb(255_255_255_/_0.12),rgb(255_255_255_/_0.05))]",
        matte:
          "border-black/10 bg-[linear-gradient(180deg,rgb(250_250_250),rgb(236_236_238))] dark:border-white/[0.14] dark:bg-[linear-gradient(180deg,rgb(55_60_70_/_0.9),rgb(37_42_50_/_0.9))]"
      },
      size: {
        sm: "h-8 gap-1",
        md: "h-10 gap-1.5",
        lg: "h-11 gap-2"
      }
    },
    defaultVariants: {
      variant: "glinr",
      size: "md"
    }
  }
)

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-[background-color,color,border-color,box-shadow] duration-fast ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--surface-0)] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none",
  {
    variants: {
      variant: {
        glinr: "rounded-full text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)] data-[state=active]:text-[color:var(--key-ink,#000)] data-[state=active]:[background:linear-gradient(180deg,var(--key-white-top,#ffffff),var(--key-white-bottom,#dcdce1))] data-[state=active]:shadow-[inset_0_1px_0_#ffffff,inset_0_-1px_0_rgb(0_0_0_/_0.12),0_1px_2px_rgb(0_0_0_/_0.5)]",
        keys: "rounded-full text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)] data-[state=active]:text-[color:var(--key-ink,#000)] data-[state=active]:[background:linear-gradient(180deg,var(--key-white-top,#ffffff),var(--key-white-bottom,#dcdce1))] data-[state=active]:shadow-[inset_0_1px_0_#ffffff,inset_0_-1px_0_rgb(0_0_0_/_0.12),0_1px_2px_rgb(0_0_0_/_0.5)]",
        solid:
          "text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)] data-[state=active]:bg-[var(--neutral-solid)] data-[state=active]:text-[color:var(--neutral-solid-fg)] data-[state=active]:[box-shadow:var(--solid-elev-1)]",
        plain:
          "rounded-md text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)] data-[state=active]:bg-[var(--surface-1)] data-[state=active]:text-[color:var(--color-foreground)] data-[state=active]:shadow-sm",
        soft:
          "text-[color:var(--color-muted)] hover:bg-[color-mix(in_oklab,var(--color-foreground)_7%,transparent)] hover:text-[color:var(--color-foreground)] data-[state=active]:bg-[color-mix(in_oklab,var(--tone-accent)_14%,var(--surface-1))] data-[state=active]:text-[color:var(--tone-accent-text)]",
        outline:
          "border border-transparent text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)] data-[state=active]:border-[color:color-mix(in_oklab,var(--color-foreground)_30%,transparent)] data-[state=active]:bg-[var(--surface-1)] data-[state=active]:text-[color:var(--color-foreground)]",
        ghost:
          "text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)] data-[state=active]:bg-[color-mix(in_oklab,var(--color-foreground)_9%,transparent)] data-[state=active]:text-[color:var(--color-foreground)]",
        underline:
          "relative rounded-none text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)] data-[state=active]:text-[color:var(--color-foreground)] after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-[var(--color-accent)] after:transition-transform after:duration-normal after:ease-standard data-[state=active]:after:scale-x-100 motion-reduce:after:transition-none",
        glass:
          "text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)] data-[state=active]:bg-[color-mix(in_oklab,var(--color-foreground)_10%,transparent)] data-[state=active]:text-[color:var(--color-foreground)] data-[state=active]:[box-shadow:var(--elev-1)]",
        liquid:
          "text-foreground/80 data-[state=active]:border data-[state=active]:border-white/25 data-[state=active]:bg-[linear-gradient(165deg,rgb(255_255_255_/_0.72),rgb(244_244_244_/_0.36))] data-[state=active]:text-[color:var(--color-foreground)] data-[state=active]:shadow-[0_0_0_1px_rgb(255_255_255_/_0.2)_inset] dark:data-[state=active]:border-white/[0.14] dark:data-[state=active]:bg-[linear-gradient(165deg,rgb(255_255_255_/_0.16),rgb(255_255_255_/_0.06))]",
        matte:
          "text-foreground/80 data-[state=active]:bg-black/[0.06] data-[state=active]:text-[color:var(--color-foreground)] dark:data-[state=active]:bg-white/[0.12]",
      },
      size: {
        sm: "h-6 px-2 text-xs",
        md: "h-8 px-3 text-sm",
        lg: "h-9 px-4 text-base"
      }
    },
    defaultVariants: {
      variant: "glinr",
      size: "md"
    }
  }
)

const tabsContentVariants = cva(
  "mt-2 rounded-xl border text-[color:var(--color-foreground)] [--tw-duration:var(--motion-micro)] ease-[var(--ease-out)] data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--surface-0)]",
  {
    variants: {
      variant: {
        glinr: "border-transparent bg-transparent",
        keys: "mt-3 border-transparent bg-transparent shadow-none",
        solid: "border-transparent bg-transparent",
        plain: "rounded-md border-transparent bg-transparent",
        soft: "border-transparent bg-transparent",
        outline: "border-[color:var(--color-border)] bg-transparent",
        ghost: "border-transparent bg-transparent",
        underline: "rounded-none border-0 bg-transparent",
        glass: "border-[color:var(--glass-border)] [border-top-color:var(--glass-refraction-top)] bg-[var(--glass-readable)] bg-clip-padding backdrop-blur-xl backdrop-saturate-[180%]",
        liquid:
          "border-white/25 [border-top-color:var(--glass-refraction-top)] bg-[radial-gradient(circle_at_16%_14%,rgb(255_255_255_/_0.72),transparent_46%),linear-gradient(165deg,rgb(255_255_255_/_0.58),rgb(238_238_238_/_0.32))] dark:border-white/[0.14] dark:[border-top-color:rgb(255_255_255_/_0.32)] dark:bg-[linear-gradient(165deg,rgb(255_255_255_/_0.12),rgb(255_255_255_/_0.05))]",
        matte:
          "border-black/10 bg-[linear-gradient(180deg,rgb(250_250_250),rgb(236_236_238))] dark:border-white/[0.14] dark:bg-[linear-gradient(180deg,rgb(55_60_70_/_0.9),rgb(37_42_50_/_0.9))]"
      },
      size: {
        sm: "p-2 text-xs",
        md: "p-3 text-sm",
        lg: "p-4 text-base"
      }
    },
    compoundVariants: [{ variant: "keys", class: "p-0" }],
    defaultVariants: {
      variant: "glinr",
      size: "md"
    }
  }
)

type TabsContextValue = { variant?: TabsVariant; size?: TabsSize }

const TabsContext = React.createContext<TabsContextValue>({})

/** Resolves the effective look: explicit prop, then the nearest Tabs or TabsList, then the ambient style. */
function useTabsLook(variantProp: TabsVariant | undefined, sizeProp: TabsSize | undefined) {
  const ctx = React.useContext(TabsContext)
  const style = useGlinStyle()
  const raw = variantProp ?? ctx.variant
  const variant =
    raw === "keys" ? ("keys" as const) : resolveControlVariant(raw, style, TABS_ALLOWED)
  return { variant, size: sizeProp ?? ctx.size ?? "md" }
}

export type TabsProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & {
  /** Default look for every list, trigger and panel inside. Each part can still set its own. */
  variant?: TabsVariant
  /** Default size for every part inside. */
  size?: TabsSize
}

export const Tabs = React.forwardRef<React.ComponentRef<typeof TabsPrimitive.Root>, TabsProps>(
  ({ variant, size, ...props }, ref) => {
    const value = React.useMemo(() => ({ variant, size }), [variant, size])
    return (
      <TabsContext.Provider value={value}>
        <TabsPrimitive.Root ref={ref} {...props} />
      </TabsContext.Provider>
    )
  }
)

Tabs.displayName = "Tabs"

export type TabsListProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
  variant?: TabsVariant
  size?: TabsSize
}

export const TabsList = React.forwardRef<React.ComponentRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, variant, size, ...props }, ref) => {
    const look = useTabsLook(variant, size)
    const value = React.useMemo(() => ({ variant: look.variant, size: look.size }), [look.variant, look.size])
    return (
      <TabsContext.Provider value={value}>
        <TabsPrimitive.List
          ref={ref}
          data-variant={look.variant}
          className={cn(tabsListVariants({ variant: look.variant, size: look.size }), className)}
          {...props}
        />
      </TabsContext.Provider>
    )
  }
)

TabsList.displayName = "TabsList"

export type TabsTriggerProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
  variant?: TabsVariant
  size?: TabsSize
}

export const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant, size, ...props }, ref) => {
  const look = useTabsLook(variant, size)
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(tabsTriggerVariants({ variant: look.variant, size: look.size }), className)}
      {...props}
    />
  )
})

TabsTrigger.displayName = "TabsTrigger"

export type TabsContentProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> & {
  variant?: TabsVariant
  size?: TabsSize
}

export const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, variant, size, ...props }, ref) => {
  const look = useTabsLook(variant, size)
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(tabsContentVariants({ variant: look.variant, size: look.size }), className)}
      {...props}
    />
  )
})

TabsContent.displayName = "TabsContent"
