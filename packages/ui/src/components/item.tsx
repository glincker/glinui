"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import type { SurfaceTone, SurfaceVariant } from "../lib/surface"
import { containerSurface, resolveSurfaceProps } from "../lib/surface-resolve"
import { useGlinStyle } from "./glin-provider"

export const ItemGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="item-group" className={cn("group/item-group flex flex-col", className)} {...props} />
  )
)
ItemGroup.displayName = "ItemGroup"

export const ItemSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      aria-orientation="horizontal"
      data-slot="item-separator"
      className={cn("my-1 h-px w-full bg-[var(--line-soft)]", className)}
      {...props}
    />
  )
)
ItemSeparator.displayName = "ItemSeparator"

const ITEM_BASE =
  "group/item flex flex-wrap items-center text-sm outline-none transition-[background-color,border-color,box-shadow] duration-150 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 motion-reduce:transition-none [a&]:cursor-pointer"

const itemSize = cva("", {
  variants: {
    size: {
      default: "gap-4 p-4",
      sm: "gap-2.5 px-4 py-3"
    }
  },
  defaultVariants: { size: "default" }
})

export type ItemProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * Visual variant. Omit for the ambient design style (glinr: lift shell; plain: shadcn bordered row).
   * Vocabulary: glinr, solid, plain, soft, outline, ghost, gradient, glass. `muted` is an alias of soft.
   */
  variant?: SurfaceVariant | "muted" | "default" | "raised" | "frosted"
  tone?: SurfaceTone
  size?: "default" | "sm"
  /** Render as the child element (e.g. a link) instead of a div. */
  asChild?: boolean
}

export const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, variant, tone, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"
    const ambient = useGlinStyle()
    const { variant: resolved, tone: aliasTone } = resolveSurfaceProps(variant, ambient, "container", [], {
      muted: "soft"
    })
    const lifted = resolved === "glinr" || resolved === "gradient"
    return (
      <Comp
        ref={ref}
        data-slot="item"
        data-variant={resolved}
        data-size={size ?? "default"}
        className={cn(
          ITEM_BASE,
          containerSurface(resolved, { radius: "lg", elevation: "1", tone: tone ?? aliasTone }),
          resolved === "plain" && "shadow-none",
          lifted
            ? "[a&]:hover:[--face:var(--face-2,var(--surface-2))]"
            : "[a&]:hover:bg-[color-mix(in_oklab,var(--color-foreground)_5%,transparent)]",
          itemSize({ size }),
          className
        )}
        {...props}
      />
    )
  }
)
Item.displayName = "Item"

const itemMediaVariants = cva("flex shrink-0 items-center justify-center gap-2 [&_svg]:pointer-events-none", {
  variants: {
    variant: {
      default: "bg-transparent",
      icon: "size-9 rounded-lg border border-[var(--line-soft)] bg-[var(--surface-2)] [&_svg:not([class*='size-'])]:size-4",
      image: "size-10 overflow-hidden rounded-lg [&_img]:size-full [&_img]:object-cover"
    }
  },
  defaultVariants: { variant: "default" }
})

export type ItemMediaProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof itemMediaVariants>

export const ItemMedia = React.forwardRef<HTMLDivElement, ItemMediaProps>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="item-media"
    data-variant={variant ?? "default"}
    className={cn(itemMediaVariants({ variant }), className)}
    {...props}
  />
))
ItemMedia.displayName = "ItemMedia"

export const ItemContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="item-content" className={cn("flex min-w-0 flex-1 flex-col gap-1", className)} {...props} />
  )
)
ItemContent.displayName = "ItemContent"

export const ItemTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="item-title"
      className={cn("flex w-fit items-center gap-2 text-sm font-medium leading-snug", className)}
      {...props}
    />
  )
)
ItemTitle.displayName = "ItemTitle"

export const ItemDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      data-slot="item-description"
      className={cn("line-clamp-2 text-balance text-sm font-normal leading-normal text-[var(--color-muted)]", className)}
      {...props}
    />
  )
)
ItemDescription.displayName = "ItemDescription"

export const ItemActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="item-actions" className={cn("flex items-center gap-2", className)} {...props} />
  )
)
ItemActions.displayName = "ItemActions"

export const ItemHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="item-header"
      className={cn("flex basis-full items-center justify-between gap-2", className)}
      {...props}
    />
  )
)
ItemHeader.displayName = "ItemHeader"

export const ItemFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="item-footer"
      className={cn("flex basis-full items-center justify-between gap-2", className)}
      {...props}
    />
  )
)
ItemFooter.displayName = "ItemFooter"
