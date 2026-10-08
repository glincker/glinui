"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "@phosphor-icons/react/dist/ssr"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { liftHeader } from "../lib/lift"
import { panelSurface, type PanelVariantProp } from "../lib/panel"
import { PanelVariantProvider, useResolvedPanelVariant, usePanelVariant } from "./panel-context"

const sheetTriggerVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--surface-1)] text-[var(--color-foreground)] border border-[var(--line-soft)]",
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

const sheetContentVariants = cva(
  "fixed z-50 overflow-y-auto p-6 [--tw-duration:var(--motion-drawer)] ease-drawer data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:[--tw-duration:var(--motion-overlay-out)] data-[state=closed]:[--tw-ease:var(--ease-exit)]",
  {
    variants: {
      size: {
        sm: "",
        md: "",
        lg: ""
      },
      side: {
        top: "inset-x-0 top-0 rounded-b-xl data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
        bottom:
          "inset-x-0 bottom-0 rounded-t-xl data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
        left: "inset-y-0 left-0 h-full rounded-r-xl data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
        right:
          "inset-y-0 right-0 h-full rounded-l-xl data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right"
      }
    },
    compoundVariants: [
      { side: "left", size: "sm", className: "w-72" },
      { side: "left", size: "md", className: "w-96" },
      { side: "left", size: "lg", className: "w-[32rem]" },
      { side: "right", size: "sm", className: "w-72" },
      { side: "right", size: "md", className: "w-96" },
      { side: "right", size: "lg", className: "w-[32rem]" },
      { side: "top", size: "sm", className: "h-56" },
      { side: "top", size: "md", className: "h-72" },
      { side: "top", size: "lg", className: "h-80" },
      { side: "bottom", size: "sm", className: "h-56" },
      { side: "bottom", size: "md", className: "h-72" },
      { side: "bottom", size: "lg", className: "h-80" }
    ],
    defaultVariants: {
      size: "md",
      side: "right"
    }
  }
)

export type SheetProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>

export const Sheet = DialogPrimitive.Root
export const Drawer = Sheet

export type SheetTriggerProps =
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger> &
  VariantProps<typeof sheetTriggerVariants>

export const SheetTrigger = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Trigger>,
  SheetTriggerProps
>(({ className, variant, size, asChild, ...props }, ref) => (
  <DialogPrimitive.Trigger
    ref={ref}
    asChild={asChild}
    className={cn(asChild ? undefined : sheetTriggerVariants({ variant, size }), className)}
    {...props}
  />
))

SheetTrigger.displayName = DialogPrimitive.Trigger.displayName

export const SheetClose = DialogPrimitive.Close

export type SheetPortalProps = DialogPrimitive.DialogPortalProps

export const SheetPortal = (props: SheetPortalProps) => <DialogPrimitive.Portal {...props} />

export type SheetOverlayProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>

export const SheetOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  SheetOverlayProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-40 bg-black/45 [--tw-duration:var(--motion-overlay-in)] ease-[var(--ease-out)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=closed]:[--tw-duration:var(--motion-overlay-out)] dark:bg-black/60",
      className
    )}
    {...props}
  />
))

SheetOverlay.displayName = DialogPrimitive.Overlay.displayName

export type SheetContentProps =
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
  VariantProps<typeof sheetContentVariants> & {
  /** Surface look. Omit for the ambient design style (glinr by default). `glass` is opt-in and needs a rich backdrop. */
  variant?: PanelVariantProp
  /** Element to portal into. When set, overlay and content use absolute positioning scoped to the nearest positioned ancestor. */
  container?: HTMLElement | null
  }

export const SheetContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ className, children, variant, size, side, container, ...props }, ref) => {
  const resolved = useResolvedPanelVariant(variant)
  return (
    <SheetPortal container={container ?? undefined}>
      <SheetOverlay className={container ? "absolute" : undefined} />
      <DialogPrimitive.Content
        ref={ref}
        data-variant={resolved}
        className={cn(
          panelSurface({ variant: resolved, shape: "none" }),
          sheetContentVariants({ size, side }),
          resolved === "plain" && "rounded-none",
          container && "absolute",
          className
        )}
        {...props}
      >
        <PanelVariantProvider value={resolved}>{children}</PanelVariantProvider>
        <DialogPrimitive.Close className="absolute right-4 top-4 z-[2] inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted)] transition-[background-color,color] duration-150 ease-[var(--ease-out)] hover:bg-[color-mix(in_oklab,var(--color-foreground)_8%,transparent)] hover:text-[var(--color-foreground)] [@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:w-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-1)]">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </SheetPortal>
  )
})

SheetContent.displayName = DialogPrimitive.Content.displayName

export type SheetHeaderProps = React.HTMLAttributes<HTMLDivElement>

export const SheetHeader = React.forwardRef<HTMLDivElement, SheetHeaderProps>(
  ({ className, ...props }, ref) => {
    const variant = usePanelVariant()
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col space-y-1.5 text-left",
          variant === "glinr" &&
            cn(liftHeader(), "-mx-6 -mt-6 mb-4 flex-col items-start justify-start px-6 py-4 pr-14"),
          className
        )}
        {...props}
      />
    )
  }
)

SheetHeader.displayName = "SheetHeader"

export type SheetFooterProps = React.HTMLAttributes<HTMLDivElement>

export const SheetFooter = React.forwardRef<HTMLDivElement, SheetFooterProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />
  )
)

SheetFooter.displayName = "SheetFooter"

export type SheetTitleProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>

export const SheetTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  SheetTitleProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
))

SheetTitle.displayName = DialogPrimitive.Title.displayName

export type SheetDescriptionProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>

export const SheetDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  SheetDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-[var(--color-muted)]", className)} {...props} />
))

SheetDescription.displayName = DialogPrimitive.Description.displayName
