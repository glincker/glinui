"use client"

import * as React from "react"
import { Warning } from "@phosphor-icons/react/dist/ssr"

import { cn } from "../lib/cn"
import type { PanelVariantProp } from "../lib/panel"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "./alert-dialog"
import { Alert, AlertDescription } from "./alert"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"

export type ConfirmActionProps = {
  /** Renders the control that opens the dialog. Call `open` from its click handler. */
  trigger: (open: () => void) => React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  /** Required: every destructive action must say what it will do. */
  consequences: [string, ...string[]]
  confirmLabel?: string
  cancelLabel?: string
  /** Confirm button text while `pending`. */
  pendingLabel?: string
  /** The user must type this exact value before confirm enables. For irreversible actions. */
  typedConfirm?: string
  /** Label of the typed field. Defaults to `Type <value> to confirm`. */
  typedConfirmLabel?: (value: string) => React.ReactNode
  /** Disables confirm and shows `pendingLabel`. */
  pending?: boolean
  /** Failure message shown in the dialog. */
  error?: string | null
  tone?: "destructive" | "default"
  /** Call `close` once the action succeeded. The dialog stays open until then. */
  onConfirm: (close: () => void) => void
  /** Fires on open and close, for resetting mutation state. */
  onOpenChange?: (open: boolean) => void
  /** Panel look. Omit for the ambient design style. */
  variant?: PanelVariantProp
  className?: string
}

/**
 * ConfirmAction guards a destructive action behind a dialog that lists its consequences and, optionally,
 * asks for a typed confirmation. Built on `AlertDialog`: focus starts on Cancel and Escape dismisses.
 */
export function ConfirmAction({
  trigger,
  title,
  description,
  consequences,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  pendingLabel,
  typedConfirm,
  typedConfirmLabel,
  pending = false,
  error,
  tone = "destructive",
  onConfirm,
  onOpenChange,
  variant,
  className
}: ConfirmActionProps) {
  const [open, setOpen] = React.useState(false)
  const [typed, setTyped] = React.useState("")
  const inputId = React.useId()
  const matches = typedConfirm === undefined || typed === typedConfirm
  const canConfirm = matches && !pending

  const change = (next: boolean) => {
    if (!next) setTyped("")
    setOpen(next)
    onOpenChange?.(next)
  }

  const confirm = () => {
    if (!canConfirm) return
    onConfirm(() => change(false))
  }

  return (
    <>
      {trigger(() => change(true))}
      <AlertDialog open={open} onOpenChange={change}>
        <AlertDialogContent
          size="sm"
          variant={variant}
          className={className}
          {...(description ? {} : { "aria-describedby": undefined })}
        >
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              confirm()
            }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>{title}</AlertDialogTitle>
              {description ? <AlertDialogDescription>{description}</AlertDialogDescription> : null}
            </AlertDialogHeader>
            <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--color-muted)]">
              {consequences.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {typedConfirm !== undefined ? (
              <div className="space-y-1.5">
                <Label htmlFor={inputId}>{typedConfirmLabel ? typedConfirmLabel(typedConfirm) : `Type ${typedConfirm} to confirm`}</Label>
                <Input
                  id={inputId}
                  value={typed}
                  autoComplete="off"
                  spellCheck={false}
                  className="font-mono"
                  onChange={(event) => setTyped(event.target.value)}
                />
              </div>
            ) : null}
            {error ? (
              <Alert variant="destructive">
                <Warning aria-hidden />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
            <AlertDialogFooter>
              <AlertDialogCancel type="button">{cancelLabel}</AlertDialogCancel>
              <Button
                type="submit"
                variant={tone === "destructive" ? "destructive" : "default"}
                disabled={!canConfirm}
                aria-busy={pending || undefined}
                className={cn(!canConfirm && "cursor-not-allowed")}
              >
                {pending && pendingLabel ? pendingLabel : confirmLabel}
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
