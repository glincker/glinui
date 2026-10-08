"use client"

import * as React from "react"

import { TooltipProvider } from "./tooltip"
import { cn } from "../lib/cn"

export const SIDEBAR_DEFAULT_STORAGE_KEY = "glin-sidebar-state"
export const SIDEBAR_KEYBOARD_SHORTCUT = "b"
const MOBILE_QUERY = "(max-width: 767px)"

export type SidebarContextValue = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

export function useSidebar(): SidebarContextValue {
  const ctx = React.useContext(SidebarContext)
  if (!ctx) throw new Error("useSidebar must be used within a SidebarProvider.")
  return ctx
}

function readStored(key: string): boolean | null {
  try {
    const value = window.localStorage.getItem(key)
    if (value === "expanded") return true
    if (value === "collapsed") return false
  } catch {
    // storage unavailable
  }
  return null
}

function writeStored(key: string, open: boolean) {
  try {
    window.localStorage.setItem(key, open ? "expanded" : "collapsed")
  } catch {
    // storage unavailable
  }
}

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState(false)
  React.useEffect(() => {
    if (typeof window.matchMedia !== "function") return
    const mql = window.matchMedia(MOBILE_QUERY)
    const update = () => setIsMobile(mql.matches)
    update()
    mql.addEventListener("change", update)
    return () => mql.removeEventListener("change", update)
  }, [])
  return isMobile
}

export type SidebarProviderProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /** Controlled open state. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** localStorage key used to persist the desktop open state. Pass null to disable. */
  storageKey?: string | null
}

export const SidebarProvider = React.forwardRef<HTMLDivElement, SidebarProviderProps>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange,
      storageKey = SIDEBAR_DEFAULT_STORAGE_KEY,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)
    const [openInternal, setOpenInternal] = React.useState(defaultOpen)
    const controlled = openProp !== undefined
    const open = controlled ? openProp : openInternal

    React.useEffect(() => {
      if (controlled || !storageKey) return
      const stored = readStored(storageKey)
      if (stored !== null) setOpenInternal(stored)
    }, [controlled, storageKey])

    const setOpen = React.useCallback(
      (value: boolean) => {
        if (controlled) onOpenChange?.(value)
        else {
          setOpenInternal(value)
          onOpenChange?.(value)
        }
        if (storageKey) writeStored(storageKey, value)
      },
      [controlled, onOpenChange, storageKey]
    )

    const toggleSidebar = React.useCallback(() => {
      if (isMobile) setOpenMobile((v) => !v)
      else setOpen(!open)
    }, [isMobile, open, setOpen])

    React.useEffect(() => {
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key.toLowerCase() === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
          event.preventDefault()
          toggleSidebar()
        }
      }
      window.addEventListener("keydown", onKeyDown)
      return () => window.removeEventListener("keydown", onKeyDown)
    }, [toggleSidebar])

    const value = React.useMemo<SidebarContextValue>(
      () => ({
        state: open ? "expanded" : "collapsed",
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar
      }),
      [open, setOpen, openMobile, isMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={value}>
        <TooltipProvider delayDuration={0}>
          <div
            ref={ref}
            data-slot="sidebar-wrapper"
            className={cn(
              "group/sidebar-wrapper flex min-h-0 w-full [--sidebar-width:16rem] [--sidebar-width-icon:3.5rem] [--sidebar-width-mobile:18rem]",
              className
            )}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

/** True when the document is laid out right to left. */
export function isDocumentRtl(): boolean {
  return typeof document !== "undefined" && document.documentElement.dir === "rtl"
}
