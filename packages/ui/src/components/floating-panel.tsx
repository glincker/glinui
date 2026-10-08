"use client"

import * as React from "react"
import { cn } from "../lib/cn"
import { Card, type CardProps } from "./card"

export interface FloatingPanelProps extends Omit<CardProps, "size" | "inset" | "interactive"> {
  /** Enable dragging */
  draggable?: boolean
  /** Initial x position */
  defaultX?: number
  /** Initial y position */
  defaultY?: number
  /** Panel width */
  width?: number | string
  /** Show close button */
  closable?: boolean
  /** Close callback */
  onClose?: () => void
}

export const FloatingPanel = React.forwardRef<HTMLDivElement, FloatingPanelProps>(
  (
    {
      className,
      children,
      draggable = true,
      defaultX = 0,
      defaultY = 0,
      width = 320,
      closable = false,
      onClose,
      style,
      ...props
    },
    ref
  ) => {
    const panelRef = React.useRef<HTMLDivElement | null>(null)
    const [position, setPosition] = React.useState({ x: defaultX, y: defaultY })
    const [isDragging, setIsDragging] = React.useState(false)
    const dragOffset = React.useRef({ x: 0, y: 0 })

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        panelRef.current = node
        if (typeof ref === "function") { ref(node); return }
        if (ref) ref.current = node
      },
      [ref]
    )

    const handlePointerDown = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        if (!draggable) return
        const target = event.target as HTMLElement
        if (target.closest("button, a, input, textarea, select")) return
        const rect = panelRef.current?.getBoundingClientRect()
        if (!rect) return
        dragOffset.current = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        }
        setIsDragging(true)
        event.currentTarget.setPointerCapture(event.pointerId)
      },
      [draggable]
    )

    const handlePointerMove = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging) return
        const parent = panelRef.current?.parentElement
        const parentRect = parent?.getBoundingClientRect()
        if (!parentRect) return
        setPosition({
          x: event.clientX - parentRect.left - dragOffset.current.x,
          y: event.clientY - parentRect.top - dragOffset.current.y,
        })
      },
      [isDragging]
    )

    const handlePointerUp = React.useCallback(() => {
      setIsDragging(false)
    }, [])

    return (
      <Card
        ref={setRefs}
        elevation={3}
        className={cn(
          "absolute z-50 overflow-hidden p-0",
          isDragging ? "cursor-grabbing" : draggable ? "cursor-grab" : "",
          className
        )}
        style={{
          left: position.x,
          top: position.y,
          width,
          ...style,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        {...props}
      >
        {closable && (
          <div className="flex justify-end p-2">
            <button
              type="button"
              aria-label="Close panel"
              className="flex size-6 items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] text-[var(--color-muted)] transition-colors hover:bg-[color-mix(in_oklab,var(--color-foreground)_8%,transparent)] hover:text-foreground"
              onClick={onClose}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M1 1l12 12M13 1L1 13" />
              </svg>
            </button>
          </div>
        )}
        <div className={cn(closable ? "px-4 pb-4" : "p-4")}>
          {children}
        </div>
      </Card>
    )
  }
)

FloatingPanel.displayName = "FloatingPanel"
