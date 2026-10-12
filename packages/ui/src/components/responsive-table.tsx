"use client"

import * as React from "react"
import { DotsThree } from "@phosphor-icons/react/dist/ssr"

import { cn } from "../lib/cn"
import { cardFields, priorityClass, splitColumns, type ColumnPriority } from "../lib/responsive-table"
import { useMediaQuery } from "../lib/use-media-query"
import { Button } from "./button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, type TableProps } from "./table"

export type { ColumnPriority }

/** Put on a link inside a row so the whole row becomes its click target. */
export const ROW_LINK_OVERLAY = "after:absolute after:inset-0"

export type ResponsiveColumn<T> = {
  id: string
  header: React.ReactNode
  cell: (row: T) => React.ReactNode
  /** 1 always shows, 2 hides below a 42rem table container, 3 below a 56rem one. Defaults to 1. */
  priority?: ColumnPriority
  /** Card title below the stack breakpoint. Defaults to the first column. */
  primary?: boolean
  /** Tailwind width class used by the fixed layout, for example `w-32`. */
  width?: string
  align?: "start" | "end"
  /** Leave this column out of the stacked card. */
  hideInCard?: boolean
  /** Card label when `header` is not a plain string. */
  cardLabel?: string
}

export type ResponsiveTableAction = {
  id: string
  label: string
  icon?: React.ReactNode
  onSelect?: () => void
  tone?: "default" | "destructive"
  disabled?: boolean
  /** Draw a separator above this item. */
  separatorBefore?: boolean
}

export type ResponsiveRowProps = {
  className?: string
  "aria-current"?: "true"
  "data-kind"?: string
}

export type ResponsiveTableLabels = {
  /** Accessible name of the kebab trigger when `actionsLabel` is not given. */
  rowActions: string
  /** Screen reader header of the actions column. */
  actionsColumn: string
  /** Screen reader header of the leading column. */
  leadingColumn: string
}

const DEFAULT_LABELS: ResponsiveTableLabels = {
  rowActions: "Row actions",
  actionsColumn: "Actions",
  leadingColumn: "Select"
}

export type StackBelow = "sm" | "md" | "lg" | "none"

const STACK_QUERY: Record<StackBelow, string> = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  none: "(min-width: 0px)"
}

/** The rendered slice of rows, produced by a windowing engine such as `VirtualResponsiveTable`. */
export type ResponsiveTableWindow<T> = {
  items: readonly { row: T; index: number }[]
  paddingTop: number
  paddingBottom: number
  /** Total row count, announced as `aria-rowcount`. */
  totalCount: number
  /** Passed as `ref` to every rendered row so the engine can measure it. */
  measureRow?: (element: HTMLElement | null) => void
  scrollToIndex?: (index: number) => void
}

export type ResponsiveTableProps<T> = {
  rows: readonly T[]
  columns: readonly ResponsiveColumn<T>[]
  getRowId: (row: T) => string
  ariaLabel: string
  /** Fixed leading cell (logo tile, checkbox), shown beside the title in cards. */
  leading?: { header?: React.ReactNode; cell: (row: T) => React.ReactNode; width?: string }
  /** Row actions collapse into one kebab menu. */
  actions?: (row: T) => ResponsiveTableAction[]
  actionsLabel?: (row: T) => string
  /** Escape hatch for rows whose actions are not a plain menu. */
  renderActions?: (row: T) => React.ReactNode
  onRowClick?: (row: T) => void
  getRowProps?: (row: T) => ResponsiveRowProps
  /** Scrolls this row into view when it changes. */
  focusRowId?: string
  /** Viewport width below which rows stack into cards. Defaults to `md`. */
  stackBelow?: StackBelow
  /** Opt in to sideways scrolling instead of fitting the container. */
  horizontalScroll?: boolean
  /** Tailwind max-height class for the scroll area, used by the virtual table. */
  scrollHeightClass?: string
  /** Surface look of the table wrapper. Omit for the ambient design style. */
  variant?: TableProps["variant"]
  labels?: Partial<ResponsiveTableLabels>
  className?: string
}

export type ResponsiveTableViewProps<T> = ResponsiveTableProps<T> & {
  /** Set by a windowing engine. Without it every row renders. */
  window?: ResponsiveTableWindow<T>
  /** Receives the element that scrolls: the table container, or the card list. */
  scrollElementRef?: React.MutableRefObject<HTMLElement | null>
  /** Which layout to render. Computed by the wrapper so it can re-bind its engine on change. */
  stacked: boolean
}

const INTERACTIVE = "a,button,input,select,textarea,[role=menuitem]"
const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-accent)]"
const CARD_SURFACE = "rounded-xl border border-[color:var(--color-border)] bg-[var(--surface-1)] text-[color:var(--color-foreground)]"
const CONTAINER = "[container-type:inline-size] [container-name:rtable]"

/** Resolves the stacked layout flag for a wrapper. */
export function useStacked(stackBelow: StackBelow | undefined): boolean {
  return !useMediaQuery(STACK_QUERY[stackBelow ?? "md"], true)
}

function RowActions<T>({
  row,
  actions,
  actionsLabel,
  renderActions,
  fallbackLabel
}: Pick<ResponsiveTableProps<T>, "actions" | "actionsLabel" | "renderActions"> & { row: T; fallbackLabel: string }) {
  if (renderActions) return <span className="relative z-10">{renderActions(row)}</span>
  const items = actions?.(row) ?? []
  if (items.length === 0) return null
  return (
    <span className="relative z-10">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={actionsLabel?.(row) ?? fallbackLabel}>
            <DotsThree aria-hidden weight="bold" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {items.map((item) => (
            <React.Fragment key={item.id}>
              {item.separatorBefore ? <DropdownMenuSeparator /> : null}
              <DropdownMenuItem
                disabled={item.disabled}
                onSelect={item.onSelect}
                className={cn("gap-2", item.tone === "destructive" && "text-[color:var(--tone-danger)]")}
              >
                {item.icon}
                {item.label}
              </DropdownMenuItem>
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </span>
  )
}

function activationProps<T>(row: T, onRowClick: ((row: T) => void) | undefined) {
  if (!onRowClick) return {}
  return {
    tabIndex: 0,
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      if ((event.target as HTMLElement).closest(INTERACTIVE)) return
      onRowClick(row)
    },
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.target !== event.currentTarget) return
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        onRowClick(row)
      }
    }
  }
}

function cardLabel<T>(column: ResponsiveColumn<T>): string {
  return column.cardLabel ?? (typeof column.header === "string" ? column.header : "")
}

/**
 * ResponsiveTableView is the render layer shared by `ResponsiveTable` and `VirtualResponsiveTable`.
 * Use it directly only to plug in your own windowing engine through `window`.
 */
export function ResponsiveTableView<T>(props: ResponsiveTableViewProps<T>) {
  const {
    rows,
    columns,
    getRowId,
    ariaLabel,
    leading,
    onRowClick,
    getRowProps,
    focusRowId,
    horizontalScroll = false,
    scrollHeightClass = "max-h-[70vh]",
    variant,
    className,
    window: win,
    scrollElementRef,
    stacked
  } = props
  const labels = { ...DEFAULT_LABELS, ...props.labels }
  const tableRef = React.useRef<HTMLTableElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)
  const hasActions = Boolean(props.actions ?? props.renderActions)
  const windowed = win !== undefined
  const items = win ? win.items : rows.map((row, index) => ({ row, index }))
  const padTop = win?.paddingTop ?? 0
  const padBottom = win?.paddingBottom ?? 0
  const scrollToIndex = win?.scrollToIndex
  const { primary } = splitColumns(columns)
  const fields = cardFields(columns)

  React.useLayoutEffect(() => {
    if (!scrollElementRef) return
    scrollElementRef.current = stacked ? listRef.current : (tableRef.current?.parentElement ?? null)
  })

  React.useEffect(() => {
    if (!focusRowId) return
    const index = rows.findIndex((row) => getRowId(row) === focusRowId)
    if (index < 0) return
    if (scrollToIndex) {
      scrollToIndex(index)
      return
    }
    const root = stacked ? listRef.current : tableRef.current
    root?.querySelector(`[data-row-id="${CSS.escape(focusRowId)}"]`)?.scrollIntoView?.({ block: "nearest" })
    // Fires only when the focused id changes, not on every row update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusRowId])

  const scrolls = windowed || horizontalScroll
  const rowActions = (row: T) =>
    hasActions ? (
      <RowActions
        row={row}
        actions={props.actions}
        actionsLabel={props.actionsLabel}
        renderActions={props.renderActions}
        fallbackLabel={labels.rowActions}
      />
    ) : null

  if (stacked) {
    return (
      <div ref={listRef} className={cn(CARD_SURFACE, scrolls && cn("overflow-auto", scrollHeightClass), className)}>
        <ul aria-label={ariaLabel} className="divide-y divide-[color:var(--color-border)]">
          {padTop > 0 ? <li aria-hidden="true" className="p-0" style={{ height: padTop }} /> : null}
          {items.map(({ row, index }) => {
            const id = getRowId(row)
            const rp = getRowProps?.(row)
            return (
              <li
                key={id}
                data-row-id={id}
                data-index={index}
                ref={win?.measureRow}
                aria-current={rp?.["aria-current"]}
                data-kind={rp?.["data-kind"]}
                className={cn(
                  "relative space-y-2 p-3 transition-colors hover:bg-[var(--surface-2)]",
                  FOCUS_RING,
                  onRowClick && "cursor-pointer",
                  rp?.className
                )}
                {...activationProps(row, onRowClick)}
              >
                <div className="flex items-start gap-3">
                  {leading ? leading.cell(row) : null}
                  <div className="min-w-0 flex-1 text-sm font-medium">{primary?.cell(row)}</div>
                  {rowActions(row)}
                </div>
                {fields.length > 0 ? (
                  <dl className="grid grid-cols-[minmax(5rem,auto)_minmax(0,1fr)] items-center gap-x-3 gap-y-1.5 text-sm">
                    {fields.map((column) => (
                      <div key={column.id} className="contents">
                        <dt className="text-xs text-[var(--color-muted)]">{cardLabel(column)}</dt>
                        <dd className="min-w-0 break-words">{column.cell(row)}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </li>
            )
          })}
          {padBottom > 0 ? <li aria-hidden="true" className="p-0" style={{ height: padBottom }} /> : null}
        </ul>
      </div>
    )
  }

  const colSpan = columns.length + (leading ? 1 : 0) + (hasActions ? 1 : 0)
  return (
    <Table
      ref={tableRef}
      variant={variant}
      stickyHeader
      layout={horizontalScroll ? "auto" : "fixed"}
      wide={horizontalScroll ? "min-w-max" : false}
      aria-label={ariaLabel}
      aria-rowcount={win ? win.totalCount + 1 : undefined}
      containerClassName={cn(CONTAINER, scrolls && scrollHeightClass, className)}
    >
      <TableHeader>
        <TableRow>
          {leading ? (
            <TableHead className={cn("w-10", leading.width)}>
              {leading.header ?? <span className="sr-only">{labels.leadingColumn}</span>}
            </TableHead>
          ) : null}
          {columns.map((column) => (
            <TableHead
              key={column.id}
              className={cn(column.align === "end" && "text-right", column.width, priorityClass(column.priority))}
            >
              {column.header}
            </TableHead>
          ))}
          {hasActions ? (
            <TableHead className="w-12">
              <span className="sr-only">{labels.actionsColumn}</span>
            </TableHead>
          ) : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {padTop > 0 ? (
          <tr aria-hidden="true" style={{ height: padTop }}>
            <td colSpan={colSpan} className="p-0" />
          </tr>
        ) : null}
        {items.map(({ row, index }) => {
          const id = getRowId(row)
          const rp = getRowProps?.(row)
          return (
            <TableRow
              key={id}
              data-row-id={id}
              data-index={index}
              ref={win?.measureRow}
              aria-current={rp?.["aria-current"]}
              data-kind={rp?.["data-kind"]}
              className={cn("relative", FOCUS_RING, onRowClick && "cursor-pointer", rp?.className)}
              {...activationProps(row, onRowClick)}
            >
              {leading ? <TableCell>{leading.cell(row)}</TableCell> : null}
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  className={cn("whitespace-normal", column.align === "end" && "text-right", priorityClass(column.priority))}
                >
                  {column.cell(row)}
                </TableCell>
              ))}
              {hasActions ? <TableCell className="text-right">{rowActions(row)}</TableCell> : null}
            </TableRow>
          )
        })}
        {padBottom > 0 ? (
          <tr aria-hidden="true" style={{ height: padBottom }}>
            <td colSpan={colSpan} className="p-0" />
          </tr>
        ) : null}
      </TableBody>
    </Table>
  )
}

/**
 * ResponsiveTable renders a table with column priorities on wide containers and stacked cards on narrow
 * viewports. It renders every row. Import `VirtualResponsiveTable` from `@glinui/ui/responsive-table-virtual`
 * for long lists.
 */
export function ResponsiveTable<T>(props: ResponsiveTableProps<T>) {
  const stacked = useStacked(props.stackBelow)
  return <ResponsiveTableView {...props} stacked={stacked} />
}
