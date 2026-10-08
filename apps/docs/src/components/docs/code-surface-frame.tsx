"use client"

import * as React from "react"
import type { ReactNode } from "react"
import { Check, Copy, Terminal } from "@phosphor-icons/react"

import { cn } from "@glinui/ui"
import { BrandIcon } from "@/components/brand/brand-icon"
import { PACKAGE_MANAGERS, type PackageManager } from "@/lib/npm-commands"

type CodeSurfaceFrameProps = {
  /** Header content. When null/undefined the header is hidden and a hover copy button floats over the code. */
  left?: ReactNode
  copied: boolean
  onCopy: () => void
  copyLabel: string
  copyHint?: string
  className?: string
  contentClassName?: string
  children: ReactNode
}

const copyButtonClass = cn(
  "inline-flex size-8 items-center justify-center rounded-lg text-neutral-500 transition-[opacity,transform,color] duration-150",
  "hover:text-neutral-900 active:scale-95 dark:text-neutral-400 dark:hover:text-neutral-100",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] motion-reduce:transition-none"
)

export function CodeSurfaceFrame({
  left,
  copied,
  onCopy,
  copyLabel,
  copyHint = "Copy",
  className,
  contentClassName,
  children
}: CodeSurfaceFrameProps) {
  const hasHeader = left !== null && left !== undefined
  const Icon = copied ? Check : Copy

  return (
    <div
      dir="ltr"
      className={cn(
        "group relative overflow-hidden rounded-xl border border-[var(--line-soft)] bg-[var(--surface-well)] [box-shadow:var(--elev-1)]",
        className
      )}
    >
      {hasHeader ? (
        <div className="flex items-center justify-between gap-3 border-b border-[var(--line-soft)] bg-[var(--surface-1)] pl-3 pr-2">
          <div className="min-w-0 flex-1">{left}</div>
          <button type="button" onClick={onCopy} className={copyButtonClass} aria-label={copyLabel} title={copyHint}>
            <Icon className="size-4" weight={copied ? "bold" : "regular"} aria-hidden />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onCopy}
          aria-label={copyLabel}
          title={copyHint}
          className={cn(
            copyButtonClass,
            "absolute right-2 top-2 z-10 bg-[var(--surface-1)] opacity-0 [box-shadow:var(--elev-1)]",
            "group-hover:opacity-100 focus-visible:opacity-100",
            copied && "opacity-100"
          )}
        >
          <Icon className="size-4" weight={copied ? "bold" : "regular"} aria-hidden />
        </button>
      )}
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>

      <div className={cn("relative", contentClassName)}>{children}</div>
    </div>
  )
}

/* ---------------------------------------------------------------------------
 * Shared package manager preference (module level store, persisted).
 * ------------------------------------------------------------------------- */

const PM_STORAGE_KEY = "glinui-docs-pm"
const pmListeners = new Set<() => void>()
let currentPm: PackageManager = "pnpm"
let pmHydrated = false

function isPackageManager(value: unknown): value is PackageManager {
  return typeof value === "string" && (PACKAGE_MANAGERS as string[]).includes(value)
}

function hydratePm() {
  if (pmHydrated || typeof window === "undefined") return
  pmHydrated = true
  try {
    const stored = window.localStorage.getItem(PM_STORAGE_KEY)
    if (isPackageManager(stored)) currentPm = stored
  } catch {
    /* storage unavailable */
  }
  window.addEventListener("storage", (event) => {
    if (event.key === PM_STORAGE_KEY && isPackageManager(event.newValue)) {
      currentPm = event.newValue
      pmListeners.forEach((listener) => listener())
    }
  })
}

function subscribePm(listener: () => void) {
  hydratePm()
  pmListeners.add(listener)
  return () => {
    pmListeners.delete(listener)
  }
}

function setStoredPm(next: PackageManager) {
  currentPm = next
  try {
    window.localStorage.setItem(PM_STORAGE_KEY, next)
  } catch {
    /* storage unavailable */
  }
  pmListeners.forEach((listener) => listener())
}

export function usePackageManager(): [PackageManager, (pm: PackageManager) => void] {
  const pm = React.useSyncExternalStore(
    subscribePm,
    () => {
      hydratePm()
      return currentPm
    },
    () => "pnpm" as PackageManager
  )
  return [pm, setStoredPm]
}

/** Terminal glyph + underline tabs for choosing a package manager. */
export function PackageManagerTabs({
  value,
  onChange
}: {
  value: PackageManager
  onChange: (pm: PackageManager) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <Terminal className="size-4 shrink-0 text-neutral-500 dark:text-neutral-400" aria-hidden />
      <div role="tablist" aria-label="Package manager" className="flex items-center gap-1">
        {PACKAGE_MANAGERS.map((pm) => {
          const active = pm === value
          return (
            <button
              key={pm}
              type="button"
              role="tab"
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(pm)}
              onKeyDown={(event) => {
                const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0
                if (!step) return
                event.preventDefault()
                const idx = PACKAGE_MANAGERS.indexOf(value)
                const next = PACKAGE_MANAGERS[(idx + step + PACKAGE_MANAGERS.length) % PACKAGE_MANAGERS.length]
                onChange(next)
                const sibling = event.currentTarget.parentElement?.children[PACKAGE_MANAGERS.indexOf(next)]
                if (sibling instanceof HTMLElement) sibling.focus()
              }}
              className={cn(
                "relative inline-flex items-center gap-1.5 px-2 py-2.5 text-[12px] font-medium transition-colors duration-150 motion-reduce:transition-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:rounded-md",
                active
                  ? "text-neutral-900 dark:text-neutral-50"
                  : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
              )}
            >
              <BrandIcon name={pm} size={14} variant={active ? "auto" : "mono"} className={active ? undefined : "opacity-70"} />
              {pm}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-2 -bottom-px h-0.5 origin-center rounded-full bg-[var(--color-accent)] transition-[transform,opacity] duration-150 motion-reduce:transition-none",
                  active ? "scale-x-100 opacity-100" : "scale-x-50 opacity-0"
                )}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
