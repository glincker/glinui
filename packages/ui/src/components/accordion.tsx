"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { CaretDown } from "@phosphor-icons/react/dist/ssr"

import { cn } from "../lib/cn"
import { resolveVariant, type SurfaceVariant } from "../lib/surface"
import { useGlinStyle } from "./glin-provider"

/**
 * Looks. `glinr` renders the whole list as one lifted shell (gradient hairline ring, hairline dividers, rotating caret),
 * `solid` and `soft` are tonal shells, `plain` is the shadcn list (bottom borders, underline on hover),
 * `outline`, `ghost`, `glass` and `frosted` render each item as its own card. Legacy `lift` is `glinr`,
 * `separated` is a hairline list without a container, `default` follows the ambient style.
 *
 * Items, triggers and content inherit the variant from the root, so they need no variant prop of their own.
 *
 * Native `<details>` SSR / no-JS fallback: for static pages that must work without hydration, render the same look
 * with plain markup and the same classes. Wrap the items in a div carrying the shell classes, make each item a
 * `<details class="group border-b border-[var(--line-soft)] last:border-b-0">`, the trigger a
 * `<summary class="flex cursor-pointer list-none items-center justify-between px-5 py-4 [&::-webkit-details-marker]:hidden">`
 * and give the caret `group-open:rotate-180`. The geometry is identical to the Radix version, so there is no layout shift.
 */
export type AccordionVariant = SurfaceVariant | "default" | "frosted" | "separated" | "lift"

type AccordionLook = "glinr" | "solid" | "soft" | "plain" | "outline" | "ghost" | "glass" | "frosted" | "separated"

function resolveLook(variant: string | null | undefined, ambient: ReturnType<typeof useGlinStyle>): AccordionLook {
  if (variant === "lift" || variant === "gradient") return "glinr"
  if (variant === "frosted" || variant === "separated") return variant
  return resolveVariant(variant, ambient, "container") as AccordionLook
}

const AccordionContext = React.createContext<AccordionLook | null>(null)

const ROOT_LOOK: Record<AccordionLook, string> = {
  glinr:
    "w-full overflow-hidden rounded-[var(--lift-r-outer)] border border-transparent [--face:var(--face-1,var(--surface-1))] [--ring-img:var(--ring)] [background:var(--sheen)_padding-box,linear-gradient(var(--face),var(--face))_padding-box,var(--ring-img)_border-box] [box-shadow:var(--elev-2)]",
  solid:
    "w-full overflow-hidden rounded-xl border border-[var(--color-border)] [background:linear-gradient(180deg,rgb(255_255_255_/_0.05),transparent),var(--surface-2)] [box-shadow:var(--elev-1)]",
  soft: "w-full overflow-hidden rounded-xl border border-[var(--line-soft)] bg-[var(--surface-2)]",
  plain: "w-full",
  separated: "w-full",
  outline: "flex w-full flex-col gap-2",
  ghost: "flex w-full flex-col gap-2",
  glass: "flex w-full flex-col gap-2",
  frosted: "flex w-full flex-col gap-2"
}

const ITEM_LOOK: Record<AccordionLook, string> = {
  glinr: "border-b border-[var(--line-soft)] last:border-b-0",
  solid: "border-b border-[var(--line-soft)] last:border-b-0",
  soft: "border-b border-[var(--line-soft)] last:border-b-0",
  plain: "border-b border-[var(--color-border)] last:border-b-0",
  separated: "border-b border-[var(--line-soft)] last:border-b-0",
  outline: "rounded-xl border border-[var(--color-border)] bg-transparent",
  ghost: "rounded-xl border border-transparent",
  glass:
    "relative rounded-xl border border-[color:var(--glass-border)] [border-top-color:var(--glass-refraction-top)] bg-[var(--glass-readable)] bg-clip-padding [box-shadow:var(--glass-2-shadow)] backdrop-blur-xl backdrop-saturate-[180%]",
  frosted:
    "relative rounded-xl border border-white/25 [border-top-color:var(--glass-refraction-top)] bg-[var(--glass-2-surface)] [box-shadow:0_0_0_1px_rgb(255_255_255_/_0.1)_inset,0_0_16px_rgb(255_255_255_/_0.1)_inset,var(--shadow-glass-sm)] backdrop-blur-[40px] backdrop-saturate-[200%]"
}

const HOVER_WASH = "hover:bg-[color-mix(in_oklab,var(--color-foreground)_4%,transparent)]"

const TRIGGER_LOOK: Record<AccordionLook, string> = {
  glinr: `${HOVER_WASH} focus-visible:ring-inset focus-visible:ring-offset-0 data-[state=open]:[&>svg]:text-[var(--color-foreground)]`,
  solid: `${HOVER_WASH} focus-visible:ring-inset focus-visible:ring-offset-0 data-[state=open]:[&>svg]:text-[var(--color-foreground)]`,
  soft: `${HOVER_WASH} focus-visible:ring-inset focus-visible:ring-offset-0 data-[state=open]:[&>svg]:text-[var(--color-foreground)]`,
  plain: "hover:underline underline-offset-4 focus-visible:rounded-sm",
  separated: "hover:underline decoration-[var(--color-border)] underline-offset-4",
  outline: `rounded-xl ${HOVER_WASH}`,
  ghost: `rounded-xl ${HOVER_WASH}`,
  glass: `rounded-xl ${HOVER_WASH}`,
  frosted: `rounded-xl ${HOVER_WASH}`
}

const TRIGGER_SIZE = {
  sm: "px-3 py-2.5 text-sm",
  md: "px-4 py-3.5 text-sm",
  lg: "px-5 py-4 text-base"
} as const

const PLAIN_TRIGGER_SIZE = {
  sm: "py-3 text-sm",
  md: "py-4 text-sm",
  lg: "py-5 text-base"
} as const

const CONTENT_SIZE = { sm: "text-xs", md: "text-sm", lg: "text-base" } as const

const contentPadding = {
  sm: "px-3 pb-3",
  md: "px-4 pb-4",
  lg: "px-5 pb-5"
} as const

const plainContentPadding = {
  sm: "pb-3",
  md: "pb-4",
  lg: "pb-5"
} as const

type Size = keyof typeof TRIGGER_SIZE

const TRIGGER_BASE =
  "flex w-full items-center justify-between gap-2 font-medium text-[var(--color-foreground)] transition-[color,background-color] duration-normal ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 [&[data-state=open]>svg]:rotate-180"

/** Look for an item, trigger or content: its own `variant` prop wins, otherwise the root's. */
function useLook(variant: AccordionVariant | null | undefined): AccordionLook {
  const inherited = React.useContext(AccordionContext)
  const ambient = useGlinStyle()
  if (variant) return resolveLook(variant, ambient)
  return inherited ?? resolveLook(undefined, ambient)
}

/* Accordion Root ---------------------------------------------------------- */

export type AccordionProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & {
  /** Omitted follows the ambient style (glinr by default). `glass` is opt-in and needs a backdrop. */
  variant?: AccordionVariant
}

export const Accordion = React.forwardRef<React.ComponentRef<typeof AccordionPrimitive.Root>, AccordionProps>(
  ({ className, variant, ...props }, ref) => {
    const look = resolveLook(variant, useGlinStyle())
    return (
      <AccordionContext.Provider value={look}>
        <AccordionPrimitive.Root
          ref={ref}
          data-variant={look}
          className={cn(ROOT_LOOK[look], className)}
          {...props}
        />
      </AccordionContext.Provider>
    )
  }
)

Accordion.displayName = "Accordion"

/* AccordionItem ----------------------------------------------------------- */

export type AccordionItemProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> & {
  variant?: AccordionVariant | null
  size?: Size | null
}

export const AccordionItem = React.forwardRef<React.ComponentRef<typeof AccordionPrimitive.Item>, AccordionItemProps>(
  ({ className, variant, size: _size, ...props }, ref) => {
    const look = useLook(variant)
    return (
      <AccordionPrimitive.Item
        ref={ref}
        className={cn("transition-[background-color,border-color,box-shadow] duration-normal ease-standard", ITEM_LOOK[look], className)}
        {...props}
      />
    )
  }
)

AccordionItem.displayName = "AccordionItem"

/* AccordionTrigger -------------------------------------------------------- */

export type AccordionTriggerProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
  variant?: AccordionVariant | null
  size?: Size | null
}

export const AccordionTrigger = React.forwardRef<React.ComponentRef<typeof AccordionPrimitive.Trigger>, AccordionTriggerProps>(
  ({ className, children, variant, size, ...props }, ref) => {
    const look = useLook(variant)
    const key: Size = size ?? "md"
    return (
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          ref={ref}
          className={cn(TRIGGER_BASE, TRIGGER_LOOK[look], look === "plain" ? PLAIN_TRIGGER_SIZE[key] : TRIGGER_SIZE[key], className)}
          {...props}
        >
          {children}
          <CaretDown aria-hidden="true" className="size-4 shrink-0 text-[var(--color-muted)] transition-transform duration-200 ease-standard motion-reduce:transition-none" />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    )
  }
)

AccordionTrigger.displayName = "AccordionTrigger"

/* AccordionContent -------------------------------------------------------- */

export type AccordionContentProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> & {
  variant?: AccordionVariant | null
  size?: Size | null
  /** Padding size matching the trigger */
  contentSize?: Size
}

export const AccordionContent = React.forwardRef<React.ComponentRef<typeof AccordionPrimitive.Content>, AccordionContentProps>(
  ({ className, children, variant, size, contentSize, ...props }, ref) => {
    const look = useLook(variant)
    const pad = contentSize ?? size ?? "md"
    return (
      <AccordionPrimitive.Content
        ref={ref}
        className={cn(
          "overflow-hidden text-[var(--color-muted)] data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
          CONTENT_SIZE[size ?? "md"],
          className
        )}
        {...props}
      >
        <div className={look === "plain" ? plainContentPadding[pad] : contentPadding[pad]}>{children}</div>
      </AccordionPrimitive.Content>
    )
  }
)

AccordionContent.displayName = "AccordionContent"
