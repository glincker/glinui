"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { liftHeader } from "../lib/lift"
import { panelSurface, type PanelVariantProp } from "../lib/panel"
import { PanelVariantProvider, useResolvedPanelVariant, usePanelVariant } from "./panel-context"

const alertDialogContentBase =
  "fixed left-1/2 top-1/2 z-50 grid -translate-x-1/2 -translate-y-1/2 gap-4 overflow-hidden p-[var(--modal-pad)] outline-none [--tw-duration:var(--motion-overlay-in)] ease-[var(--ease-out)] data-[state=closed]:[--tw-duration:var(--motion-overlay-out)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:slide-in-from-bottom-2 data-[state=closed]:slide-out-to-bottom-2 motion-reduce:transition-none motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none"

const alertDialogSizeVariants = cva("", {
  variants: {
    size: {
      sm: "w-[min(92vw,28rem)] [--modal-pad:1.25rem]",
      md: "w-[min(92vw,32rem)] [--modal-pad:1.5rem]",
      lg: "w-[min(94vw,38rem)] [--modal-pad:1.75rem]"
    }
  },
  defaultVariants: { size: "md" }
})

const alertDialogActionVariants = cva(
  "inline-flex h-10 min-w-[4.5rem] items-center justify-center rounded-lg border border-transparent px-4 text-sm font-medium transition-[background-color,color,border-color] duration-fast ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-1)] disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--neutral-solid)] text-[color:var(--neutral-solid-fg)] hover:bg-[var(--neutral-solid-hover)] active:bg-[var(--neutral-solid-active)]",
        destructive:
          "bg-[var(--tone-danger)] text-[color:var(--tone-danger-fg)] hover:bg-[color-mix(in_oklab,var(--tone-danger)_88%,white)] active:bg-[color-mix(in_oklab,var(--tone-danger)_88%,black)]",
        glass:
          "border-[color:var(--glass-border)] [border-top-color:var(--glass-refraction-top)] bg-[color-mix(in_oklab,var(--surface-1)_80%,transparent)] text-[var(--color-foreground)] backdrop-blur-lg backdrop-saturate-[180%] hover:bg-[color-mix(in_oklab,var(--surface-1)_90%,transparent)]",
        matte:
          "border-[color:var(--line-soft)] bg-[var(--surface-2)] text-[var(--color-foreground)] hover:bg-[var(--surface-3)]"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

const alertDialogCancelVariants = cva(
  "inline-flex h-10 min-w-[4.5rem] items-center justify-center rounded-lg border px-4 text-sm font-medium text-[var(--color-foreground)] transition-[background-color,color,border-color,box-shadow] duration-150 ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-1)] disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      look: {
        key: "border-transparent [--face:var(--face-3,var(--surface-3))] [background:var(--sheen)_padding-box,linear-gradient(var(--face),var(--face))_padding-box,var(--ring-hot,var(--ring))_border-box] [box-shadow:var(--elev-1)] active:translate-y-px active:[box-shadow:var(--elev-inset)]",
        flat: "border-[color:var(--color-border)] bg-[var(--surface-1)] hover:bg-[var(--surface-2)]"
      }
    },
    defaultVariants: { look: "key" }
  }
)

export const AlertDialog = AlertDialogPrimitive.Root
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger
export const AlertDialogPortal = AlertDialogPrimitive.Portal

export const AlertDialogOverlay = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/45 [--tw-duration:var(--motion-overlay-in)] ease-[var(--ease-out)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=closed]:[--tw-duration:var(--motion-overlay-out)] motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none dark:bg-black/60",
      className
    )}
    {...props}
  />
))

AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

export type AlertDialogContentProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Content
> &
  VariantProps<typeof alertDialogSizeVariants> & {
  /** Surface look. Omit for the ambient design style (glinr by default). `glass` is opt-in and needs a rich backdrop. */
  variant?: PanelVariantProp
  /** Element to portal into. When set, overlay and content use absolute positioning scoped to the nearest positioned ancestor. */
  container?: HTMLElement | null
  }

export const AlertDialogContent = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Content>,
  AlertDialogContentProps
>(({ className, variant, size, container, children, ...props }, ref) => {
  const resolved = useResolvedPanelVariant(variant)
  return (
    <AlertDialogPortal container={container ?? undefined}>
      <AlertDialogOverlay className={container ? "absolute" : undefined} />
      <AlertDialogPrimitive.Content
        ref={ref}
        data-variant={resolved}
        className={cn(
          alertDialogContentBase,
          alertDialogSizeVariants({ size }),
          panelSurface({ variant: resolved, shape: "dialog" }),
          container && "absolute max-w-[92%]",
          className
        )}
        {...props}
      >
        <PanelVariantProvider value={resolved}>{children}</PanelVariantProvider>
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  )
})

AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

export const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const variant = usePanelVariant()
  return (
    <div
      className={cn(
        "flex flex-col gap-2 text-left",
        variant === "glinr" &&
          cn(
            liftHeader(),
            "-mx-[var(--modal-pad)] -mt-[var(--modal-pad)] flex-col items-start justify-start gap-2 px-[var(--modal-pad)] py-4"
          ),
        className
      )}
      {...props}
    />
  )
}

export const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const variant = usePanelVariant()
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        variant === "glinr"
          ? "-mx-[var(--modal-pad)] -mb-[var(--modal-pad)] mt-2 border-t border-[color:var(--line-soft)] px-[var(--modal-pad)] py-3 [background:var(--sheen),var(--face-0,var(--surface-2))] shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06)]"
          : variant === "plain"
            ? "mt-2"
            : "mt-2 border-t border-[color:var(--line-soft)] pt-4",
        className
      )}
      {...props}
    />
  )
}

export const AlertDialogTitle = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold tracking-tight", className)}
    {...props}
  />
))

AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

export const AlertDialogDescription = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm leading-relaxed text-[var(--color-muted)]", className)}
    {...props}
  />
))

AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName

export type AlertDialogActionProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Action
> &
  VariantProps<typeof alertDialogActionVariants>

export const AlertDialogAction = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Action>,
  AlertDialogActionProps
>(({ className, variant, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(alertDialogActionVariants({ variant }), className)}
    {...props}
  />
))

AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

export const AlertDialogCancel = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => {
  const variant = usePanelVariant()
  return (
    <AlertDialogPrimitive.Cancel
      ref={ref}
      className={cn(alertDialogCancelVariants({ look: variant === "plain" ? "flat" : "key" }), className)}
      {...props}
    />
  )
})

AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName
