"use client"

import * as React from "react"
import { useVirtualizer } from "@tanstack/react-virtual"

import { DEFAULT_VIRTUALIZE_OVER, paddingFor, shouldVirtualize } from "../lib/responsive-table"
import {
  ResponsiveTableView,
  useStacked,
  type ResponsiveTableProps,
  type ResponsiveTableWindow
} from "./responsive-table"

export type VirtualResponsiveTableProps<T> = ResponsiveTableProps<T> & {
  /** Windowing starts when `rows.length` is above this. Defaults to 50. */
  virtualizeOver?: number
  /** Row height estimate in px before rows are measured. Defaults to 56. */
  estimateRowHeight?: number
  /** Lets the page read or drive the scroll position. */
  scrollRef?: React.MutableRefObject<HTMLElement | null>
}

/**
 * VirtualResponsiveTable is `ResponsiveTable` with row windowing for long lists. It lives in its own entry
 * point, `@glinui/ui/responsive-table-virtual`, so `@tanstack/react-virtual` is only bundled when you import it.
 */
export function VirtualResponsiveTable<T>(props: VirtualResponsiveTableProps<T>) {
  const { virtualizeOver = DEFAULT_VIRTUALIZE_OVER, estimateRowHeight = 56, scrollRef, rows, getRowId, ...rest } = props
  const stacked = useStacked(props.stackBelow)
  const ownRef = React.useRef<HTMLElement | null>(null)
  const scrollElementRef = scrollRef ?? ownRef
  const active = shouldVirtualize(rows.length, virtualizeOver)

  const virtualizer = useVirtualizer({
    count: active ? rows.length : 0,
    getScrollElement: () => scrollElementRef.current,
    estimateSize: () => estimateRowHeight,
    overscan: 8,
    getItemKey: (index) => {
      const row = rows[index]
      return row === undefined ? index : getRowId(row)
    }
  })

  const virtualItems = virtualizer.getVirtualItems()
  const win: ResponsiveTableWindow<T> | undefined = active
    ? {
        items: virtualItems.flatMap((item) => {
          const row = rows[item.index]
          return row === undefined ? [] : [{ row, index: item.index }]
        }),
        ...(() => {
          const pad = paddingFor(virtualItems, virtualizer.getTotalSize())
          return { paddingTop: pad.top, paddingBottom: pad.bottom }
        })(),
        totalCount: rows.length,
        measureRow: virtualizer.measureElement,
        scrollToIndex: (index) => virtualizer.scrollToIndex(index, { align: "auto" })
      }
    : undefined

  return (
    <ResponsiveTableView
      {...rest}
      rows={rows}
      getRowId={getRowId}
      stacked={stacked}
      window={win}
      scrollElementRef={scrollElementRef}
    />
  )
}
