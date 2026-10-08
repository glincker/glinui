"use client"

import * as React from "react"
import { Check, Copy } from "@phosphor-icons/react/dist/ssr"

import { cn } from "../lib/cn"
import { Button, type ButtonProps } from "./button"

export type CopyButtonProps = Omit<ButtonProps, "onCopy" | "value" | "children" | "asChild" | "loading"> & {
  /** Static text to copy. */
  value?: string
  /** Lazily resolve the text to copy (wins over `value`). */
  getValue?: () => string
  /** Called after a successful copy with the copied text (analytics hook). */
  onCopy?: (value: string) => void
  /** Idle label. */
  label?: string
  /** Label shown (and announced) after copying. */
  copiedLabel?: string
  /** Milliseconds before returning to the idle state. */
  resetMs?: number
  /** Hide the text label and keep only the icon (label stays as the accessible name). */
  iconOnly?: boolean
}

async function writeToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Fall through to the legacy path (permissions, insecure context).
  }

  try {
    const area = document.createElement("textarea")
    area.value = text
    area.setAttribute("readonly", "")
    area.className = "fixed -top-full left-0 opacity-0"
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand("copy")
    document.body.removeChild(area)
    return ok
  } catch {
    return false
  }
}

/** Pill button that copies text and announces the result politely. Takes the shared Button variants (default: ambient, `glinr`). */
export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      value = "",
      getValue,
      onCopy,
      label = "Copy",
      copiedLabel = "Copied",
      resetMs = 1600,
      iconOnly = false,
      size,
      className,
      onClick,
      type = "button",
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = React.useState(false)
    const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    React.useEffect(
      () => () => {
        if (timer.current) clearTimeout(timer.current)
      },
      []
    )

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (event.defaultPrevented) return

      const text = getValue ? getValue() : value
      const ok = await writeToClipboard(text)
      if (!ok) return

      setCopied(true)
      onCopy?.(text)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), resetMs)
    }

    const Icon = copied ? Check : Copy

    return (
      <Button
        ref={ref}
        type={type}
        size={size ?? (iconOnly ? "icon" : "xs")}
        data-copied={copied ? "true" : "false"}
        aria-label={iconOnly ? (copied ? copiedLabel : label) : undefined}
        onClick={handleClick}
        className={cn(
          "shrink-0 gap-1.5 rounded-full data-[copied=true]:text-[color:var(--color-signal-ok)]",
          iconOnly && "size-7",
          className
        )}
        {...props}
      >
        <Icon aria-hidden="true" weight="bold" className="size-3.5" />
        {iconOnly ? null : <span>{copied ? copiedLabel : label}</span>}
        <span role="status" aria-live="polite" className="sr-only">
          {copied ? copiedLabel : ""}
        </span>
      </Button>
    )
  }
)

CopyButton.displayName = "CopyButton"
