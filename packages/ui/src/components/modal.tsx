"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "@phosphor-icons/react/dist/ssr"

import { cn } from "../lib/cn"
import { liftHeader } from "../lib/lift"
import { panelSurface, type PanelVariantProp } from "../lib/panel"
import { PanelVariantProvider, useResolvedPanelVariant, usePanelVariant } from "./panel-context"

export type ModalProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>

export const Modal = DialogPrimitive.Root
export const ModalTrigger = DialogPrimitive.Trigger
export const ModalClose = DialogPrimitive.Close

export type ModalPortalProps = DialogPrimitive.DialogPortalProps

export const ModalPortal = (props: ModalPortalProps) => (
  <DialogPrimitive.Portal {...props} />
)

const modalContentBase =
  "fixed left-1/2 top-1/2 z-50 grid -translate-x-1/2 -translate-y-1/2 gap-4 overflow-hidden p-[var(--modal-pad)] outline-none [--tw-duration:var(--motion-overlay-in)] ease-[var(--ease-out)] data-[state=closed]:[--tw-duration:var(--motion-overlay-out)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:slide-in-from-bottom-2 data-[state=closed]:slide-out-to-bottom-2 motion-reduce:transition-none motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none"

const modalSizeVariants = cva("", {
  variants: {
    size: {
      sm: "w-[min(92vw,28rem)] [--modal-pad:1.25rem]",
      md: "w-[min(92vw,34rem)] [--modal-pad:1.5rem]",
      lg: "w-[min(94vw,42rem)] [--modal-pad:1.75rem]"
    }
  },
  defaultVariants: { size: "md" }
})

export type ModalOverlayProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>

export const ModalOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  ModalOverlayProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/45 [--tw-duration:var(--motion-overlay-in)] ease-[var(--ease-out)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=closed]:[--tw-duration:var(--motion-overlay-out)] motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none dark:bg-black/60",
      className
    )}
    {...props}
  />
))

ModalOverlay.displayName = "ModalOverlay"

export type ModalContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
  VariantProps<typeof modalSizeVariants> & {
  /**
   * Surface look. Omit for the ambient design style (glinr by default). `glass` is opt-in and
   * needs a colourful or photographic backdrop to read as frosted.
   */
  variant?: PanelVariantProp
  /** Element to portal into. When set, overlay and content use absolute positioning scoped to the nearest positioned ancestor. */
  container?: HTMLElement | null
  }

export const ModalContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  ModalContentProps
>(({ className, children, variant, size, container, ...props }, ref) => {
  const resolved = useResolvedPanelVariant(variant)
  return (
    <ModalPortal container={container ?? undefined}>
      <ModalOverlay className={container ? "absolute" : undefined} />
      <DialogPrimitive.Content
        ref={ref}
        data-variant={resolved}
        className={cn(
          modalContentBase,
          modalSizeVariants({ size }),
          panelSurface({ variant: resolved, shape: "dialog" }),
          container && "absolute max-w-[92%]",
          className
        )}
        {...props}
      >
        <PanelVariantProvider value={resolved}>{children}</PanelVariantProvider>
        <DialogPrimitive.Close className="absolute right-3 top-3 z-[2] inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted)] transition-[background-color,color] duration-150 ease-[var(--ease-out)] hover:bg-[color-mix(in_oklab,var(--color-foreground)_8%,transparent)] hover:text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-1)] [@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:w-11">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </ModalPortal>
  )
})

ModalContent.displayName = "ModalContent"

export type ModalHeaderProps = React.HTMLAttributes<HTMLDivElement>

/** Title block. In the `glinr` look it becomes a raised strip that bleeds to the dialog edges. */
export const ModalHeader = ({ className, ...props }: ModalHeaderProps) => {
  const variant = usePanelVariant()
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 text-left",
        variant === "glinr" &&
          cn(
            liftHeader(),
            "-mx-[var(--modal-pad)] -mt-[var(--modal-pad)] flex-col items-start justify-start gap-1.5 px-[var(--modal-pad)] py-4 pr-14"
          ),
        className
      )}
      {...props}
    />
  )
}

export type ModalFooterProps = React.HTMLAttributes<HTMLDivElement>

/** Action row. In the `glinr` look it is a raised strip on the face-0 tone, elsewhere a hairline-topped row. */
export const ModalFooter = ({ className, ...props }: ModalFooterProps) => {
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

export type ModalTitleProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>

export const ModalTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  ModalTitleProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold tracking-tight", className)} {...props} />
))

ModalTitle.displayName = "ModalTitle"

export type ModalDescriptionProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>

export const ModalDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  ModalDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm leading-relaxed text-[var(--color-muted)]", className)}
    {...props}
  />
))

ModalDescription.displayName = "ModalDescription"
