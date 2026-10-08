"use client"

import * as React from "react"
import { CaretLeft, CaretRight, DotsThree } from "@phosphor-icons/react/dist/ssr"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { PanelVariantProvider, usePanelVariant, useResolvedPanelVariant } from "./panel-context"
import type { PanelVariantProp } from "../lib/panel"
import type { SurfaceVariant } from "../lib/surface"

const paginationVariants = cva("mx-auto flex w-full justify-center")

export type PaginationProps = React.ComponentPropsWithoutRef<"nav"> & {
  /**
   * Look of the page links. Omit for the ambient design style (glinr by default): pill links with a raised
   * current page. `plain` is the shadcn outline look; `glass` is opt-in and needs a rich backdrop.
   */
  variant?: PanelVariantProp
}

export const Pagination = ({ className, variant, ...props }: PaginationProps) => {
  const resolved = useResolvedPanelVariant(variant)
  return (
    <PanelVariantProvider value={resolved}>
      <nav
        role="navigation"
        aria-label="pagination"
        data-variant={resolved}
        className={cn("group/pagination", paginationVariants(), className)}
        {...props}
      />
    </PanelVariantProvider>
  )
}
Pagination.displayName = "Pagination"

export const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentPropsWithoutRef<"ul">>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
  )
)
PaginationContent.displayName = "PaginationContent"

export const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"li">>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn("", className)} {...props} />
)
PaginationItem.displayName = "PaginationItem"

const paginationLinkVariants = cva(
  "inline-flex select-none items-center justify-center gap-1 border border-transparent text-sm font-medium text-[var(--color-foreground)] outline-none transition-[background-color,color,box-shadow] duration-100 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-0)] motion-reduce:transition-none aria-disabled:pointer-events-none aria-disabled:opacity-50",
  {
    variants: {
      size: {
        icon: "size-9",
        sm: "h-8 px-2.5",
        default: "h-9 px-3"
      },
      active: {
        true: "",
        false: "hover:bg-[color-mix(in_oklab,var(--color-foreground)_7%,transparent)] active:bg-[color-mix(in_oklab,var(--color-foreground)_12%,transparent)]"
      }
    },
    defaultVariants: { size: "icon", active: false }
  }
)

const LINK_SHAPE: Record<SurfaceVariant, string> = {
  glinr: "rounded-full",
  gradient: "rounded-full",
  glass: "rounded-lg",
  plain: "rounded-md",
  solid: "rounded-lg",
  soft: "rounded-lg",
  outline: "rounded-lg",
  ghost: "rounded-lg"
}

const RAISED_KEY =
  "[--face:var(--face-3,var(--surface-3))] [background:var(--sheen)_padding-box,linear-gradient(var(--face),var(--face))_padding-box,var(--ring-hot,var(--ring))_border-box] [box-shadow:var(--elev-1)]"

const LINK_ACTIVE: Record<SurfaceVariant, string> = {
  glinr: RAISED_KEY,
  gradient:
    "text-white [background:linear-gradient(180deg,rgb(255_255_255_/_0.16),transparent)_padding-box,linear-gradient(135deg,var(--gradient-from),var(--gradient-to))_padding-box,var(--ring-solid)_border-box] [box-shadow:var(--solid-elev-1)]",
  plain: "border-[color:var(--color-border)] bg-[var(--surface-1)] shadow-sm",
  solid: "bg-[var(--neutral-solid)] text-[color:var(--neutral-solid-fg)] [box-shadow:var(--solid-elev-1)]",
  soft: "bg-[var(--surface-2)] border-[color:var(--line-soft)] [box-shadow:var(--elev-1)]",
  outline: "border-[color:color-mix(in_oklab,var(--color-foreground)_22%,transparent)]",
  ghost: "bg-[color-mix(in_oklab,var(--color-foreground)_9%,transparent)]",
  glass:
    "border-[color:var(--glass-border)] bg-[color-mix(in_oklab,var(--surface-1)_88%,transparent)] backdrop-blur-xl [box-shadow:var(--elev-1)]"
}

export type PaginationLinkProps = React.ComponentPropsWithoutRef<"a"> & {
  isActive?: boolean
  size?: NonNullable<VariantProps<typeof paginationLinkVariants>["size"]>
}

export const PaginationLink = ({ className, isActive, size = "icon", ...props }: PaginationLinkProps) => {
  const variant = usePanelVariant() ?? "glinr"
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-active={isActive ? "true" : undefined}
      className={cn(
        paginationLinkVariants({ size, active: Boolean(isActive) }),
        LINK_SHAPE[variant],
        isActive && LINK_ACTIVE[variant],
        className
      )}
      {...props}
    />
  )
}
PaginationLink.displayName = "PaginationLink"

export const PaginationPrevious = ({ className, children, ...props }: Omit<PaginationLinkProps, "size">) => (
  <PaginationLink aria-label="Go to previous page" size="default" className={cn("ps-2.5", className)} {...props}>
    <CaretLeft className="size-4 rtl:-scale-x-100" />
    {children ?? <span>Previous</span>}
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

export const PaginationNext = ({ className, children, ...props }: Omit<PaginationLinkProps, "size">) => (
  <PaginationLink aria-label="Go to next page" size="default" className={cn("pe-2.5", className)} {...props}>
    {children ?? <span>Next</span>}
    <CaretRight className="size-4 rtl:-scale-x-100" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

export const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    aria-hidden="true"
    className={cn("flex size-9 items-center justify-center text-[var(--color-muted)]", className)}
    {...props}
  >
    <DotsThree className="size-4" weight="bold" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export { paginationLinkVariants }
