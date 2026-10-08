"use client"

import * as React from "react"
import { Toaster as SonnerToaster, toast } from "sonner"
import {
  CheckCircle,
  Warning,
  WarningCircle,
  Info,
  CircleNotch,
  X
} from "@phosphor-icons/react"

import { cn } from "../lib/cn"
import { panelSurface, type PanelVariantProp } from "../lib/panel"
import { useResolvedPanelVariant } from "./panel-context"

/* ── Toaster ──────────────────────────────────────────────────────────────── */

type GlinToasterProps = Omit<React.ComponentPropsWithoutRef<typeof SonnerToaster>, "icons"> & {
  /**
   * Surface look for all toasts. Omit for the ambient design style (glinr card by default).
   * `glass` is opt-in and needs a rich backdrop; `matte` is the legacy name for `solid`.
   */
  variant?: PanelVariantProp
}

/** Leading status bar driven by sonner's `data-type` attribute. */
const STATUS_BAR =
  "before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-[1] before:w-[3px] before:bg-[var(--toast-bar,transparent)] data-[type=success]:[--toast-bar:var(--tone-success)] data-[type=error]:[--toast-bar:var(--tone-danger)] data-[type=warning]:[--toast-bar:var(--tone-warning)] data-[type=info]:[--toast-bar:var(--tone-info)]"

const BUTTON_BASE =
  "inline-flex items-center justify-center rounded-lg border border-transparent px-3 py-1.5 text-xs font-medium transition-[background-color,color,border-color] duration-fast ease-standard"

const PARTS = {
  title: "font-medium tracking-tight text-[var(--color-foreground)]",
  description: "text-[var(--color-muted)]",
  actionButton:
    "bg-[var(--neutral-solid)] text-[color:var(--neutral-solid-fg)] hover:bg-[var(--neutral-solid-hover)]",
  cancelButton:
    "bg-[color-mix(in_oklab,var(--color-foreground)_8%,transparent)] text-[var(--color-foreground)] hover:bg-[color-mix(in_oklab,var(--color-foreground)_14%,transparent)]",
  closeButton:
    "text-[var(--color-muted)] hover:text-[var(--color-foreground)] bg-[color-mix(in_oklab,var(--color-foreground)_6%,transparent)]"
}

/* ── Custom icons ─────────────────────────────────────────────────────────── */

const iconClass = "size-[18px] shrink-0"

const customIcons = {
  success: <CheckCircle className={cn(iconClass, "text-[var(--tone-success-text)]")} />,
  info: <Info className={cn(iconClass, "text-[var(--tone-info-text)]")} />,
  warning: <Warning className={cn(iconClass, "text-[var(--tone-warning-text)]")} />,
  error: <WarningCircle className={cn(iconClass, "text-[var(--tone-danger-text)]")} />,
  loading: <CircleNotch className={cn(iconClass, "animate-spin text-[var(--color-muted)]")} />,
  close: <X className="size-3.5" />
}

/* ── Toaster Component ────────────────────────────────────────────────────── */

const Toaster = React.forwardRef<HTMLElement, GlinToasterProps>(
  ({ variant, className, ...props }, ref) => {
    const resolved = useResolvedPanelVariant(variant)

    return (
      <SonnerToaster
        ref={ref}
        className={cn("toaster group", className)}
        icons={customIcons}
        toastOptions={{
          unstyled: true,
          classNames: {
            toast: cn(
              panelSurface({ variant: resolved, shape: "dialog" }),
              "group relative isolate flex w-full items-start gap-3 overflow-hidden p-4 pr-3 [box-shadow:var(--elev-2)] transition-[transform,opacity,box-shadow,border-color,background-color] duration-normal ease-standard data-[mounted=true]:animate-in data-[removed=true]:animate-out data-[swipe=move]:translate-x-[var(--swipe-move-x)] data-[swipe=end]:translate-x-[var(--swipe-end-x)] data-[swipe=cancel]:translate-x-0 motion-reduce:transition-none",
              resolved === "plain" && "rounded-lg shadow-md",
              STATUS_BAR
            ),
            title: cn("text-sm leading-tight", PARTS.title),
            description: cn("text-sm leading-relaxed", PARTS.description),
            actionButton: cn(BUTTON_BASE, PARTS.actionButton),
            cancelButton: cn(BUTTON_BASE, PARTS.cancelButton),
            closeButton: cn(
              "rounded-md border border-transparent p-1 transition-[background-color,color,border-color] duration-fast",
              PARTS.closeButton
            )
          }
        }}
        {...props}
      />
    )
  }
)

Toaster.displayName = "Toaster"

export { Toaster, toast }
export type { GlinToasterProps as ToasterProps }
