"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "@phosphor-icons/react/dist/ssr"

import { cn } from "../lib/cn"
import { panelSurface, type PanelVariantProp } from "../lib/panel"
import { useResolvedPanelVariant } from "./panel-context"

export const ToastProvider = ToastPrimitives.Provider

const toastVariants = cva(
  "group pointer-events-auto relative isolate flex w-full items-start justify-between gap-3 overflow-hidden [box-shadow:var(--elev-2)] before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-[1] before:w-[3px] before:bg-[var(--toast-bar,transparent)] transition-[transform,opacity,box-shadow,border-color,background-color] [--tw-duration:var(--motion-overlay-in)] ease-[var(--ease-out)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-bottom-3 data-[state=open]:fade-in-0 data-[state=closed]:[--tw-duration:var(--motion-overlay-out)] data-[state=closed]:fade-out-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] motion-reduce:transition-none motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none",
  {
    variants: {
      /** Status bar on the leading edge. */
      tone: {
        none: "",
        success: "[--toast-bar:var(--tone-success)]",
        warning: "[--toast-bar:var(--tone-warning)]",
        danger: "[--toast-bar:var(--tone-danger)]",
        info: "[--toast-bar:var(--tone-info)]"
      },
      size: {
        sm: "p-3.5 pr-5",
        md: "p-4 pr-6",
        lg: "p-5 pr-7"
      }
    },
    defaultVariants: {
      tone: "none",
      size: "md"
    }
  }
)

type ToastStatus = "success" | "warning" | "destructive" | "info"

const STATUS_TONE: Record<ToastStatus, "success" | "warning" | "danger" | "info"> = {
  success: "success",
  warning: "warning",
  destructive: "danger",
  info: "info"
}

function isToastStatus(value: string | null | undefined): value is ToastStatus {
  return value === "success" || value === "warning" || value === "destructive" || value === "info"
}

export type ToastViewportProps = React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>

export const ToastViewport = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitives.Viewport>,
  ToastViewportProps
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "pointer-events-none fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col gap-2 p-4 sm:bottom-3 sm:right-3 sm:max-w-[440px]",
      className
    )}
    {...props}
  />
))

ToastViewport.displayName = "ToastViewport"

export type ToastProps = React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
  VariantProps<typeof toastVariants> & {
    /**
     * Surface look, or a status (`success`, `warning`, `destructive`, `info`) which keeps the ambient look and
     * adds a status bar. Omit for the ambient design style (glinr by default). `glass` is opt-in.
     */
    variant?: PanelVariantProp | ToastStatus
  }

export const Toast = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitives.Root>,
  ToastProps
>(({ className, variant, tone, size, ...props }, ref) => {
  const status = isToastStatus(variant) ? variant : undefined
  const resolved = useResolvedPanelVariant(status ? undefined : (variant as PanelVariantProp | undefined))
  return (
    <ToastPrimitives.Root
      ref={ref}
      data-variant={resolved}
      className={cn(
        panelSurface({ variant: resolved, shape: "dialog" }),
        toastVariants({ tone: tone ?? (status ? STATUS_TONE[status] : "none"), size }),
        resolved === "plain" && "rounded-lg shadow-md",
        className
      )}
      {...props}
    />
  )
})

Toast.displayName = "Toast"

export type ToastTitleProps = React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>

export const ToastTitle = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitives.Title>,
  ToastTitleProps
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold leading-tight tracking-tight", className)}
    {...props}
  />
))

ToastTitle.displayName = "ToastTitle"

export type ToastDescriptionProps = React.ComponentPropsWithoutRef<
  typeof ToastPrimitives.Description
>

export const ToastDescription = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitives.Description>,
  ToastDescriptionProps
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm leading-relaxed text-[var(--color-muted)]", className)}
    {...props}
  />
))

ToastDescription.displayName = "ToastDescription"

export type ToastCloseProps = React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>

export const ToastClose = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitives.Close>,
  ToastCloseProps
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-muted)] transition-[color,background-color] duration-150 ease-[var(--ease-out)] hover:bg-[color-mix(in_oklab,var(--color-foreground)_8%,transparent)] hover:text-[var(--color-foreground)] [@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:w-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
      className
    )}
    {...props}
  >
    <X className="h-3.5 w-3.5" />
    <span className="sr-only">Close</span>
  </ToastPrimitives.Close>
))

ToastClose.displayName = "ToastClose"
