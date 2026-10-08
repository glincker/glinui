"use client"

import * as React from "react"
import { ArrowDown, ArrowUp, ArrowsDownUp, CaretLeft, CaretRight, Columns } from "@phosphor-icons/react"

import { Button } from "./button"
import { Checkbox } from "./checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "./dropdown-menu"
import { Input } from "./input"
import { Select } from "./select"
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
  type TableProps,
  type TableRowTone
} from "./table"
import { cn } from "../lib/cn"

type SortDirection = "asc" | "desc"

type DataTableAccessor<TData> = keyof TData | ((row: TData) => unknown)

export type DataTableColumn<TData> = {
  id: string
  header: React.ReactNode
  accessor: DataTableAccessor<TData>
  cell?: (context: { row: TData; value: unknown; rowId: string }) => React.ReactNode
  sortable?: boolean
  searchable?: boolean
  canHide?: boolean
  hidden?: boolean
  align?: "left" | "center" | "right"
  className?: string
  headerClassName?: string
}

export type DataTableProps<TData extends Record<string, unknown>> = {
  columns: DataTableColumn<TData>[]
  data: TData[]
  getRowId?: (row: TData, index: number) => string
  rowTone?: (row: TData) => TableRowTone
  onRowClick?: (row: TData) => void
  onSelectionChange?: (rows: TData[]) => void
  searchable?: boolean
  searchPlaceholder?: string
  selectable?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
  emptyMessage?: string
  className?: string
} & Omit<TableProps, "children">

type DataTableRow<TData> = {
  id: string
  data: TData
}

function toComparable(value: unknown): string | number {
  if (typeof value === "number") {
    return value
  }

  if (value instanceof Date) {
    return value.getTime()
  }

  if (typeof value === "boolean") {
    return value ? 1 : 0
  }

  return String(value ?? "").toLowerCase()
}

function resolveColumnValue<TData extends Record<string, unknown>>(
  row: TData,
  accessor: DataTableAccessor<TData>
): unknown {
  if (typeof accessor === "function") {
    return accessor(row)
  }

  return row[accessor]
}

function stringValue(value: unknown): string {
  if (typeof value === "string") {
    return value
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return `${value}`
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (value == null) {
    return ""
  }

  return String(value)
}

export function DataTable<TData extends Record<string, unknown>>({
  columns,
  data,
  getRowId,
  rowTone,
  onRowClick,
  onSelectionChange,
  searchable = true,
  searchPlaceholder = "Search rows...",
  selectable = false,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50],
  emptyMessage = "No results.",
  className,
  ...tableProps
}: DataTableProps<TData>) {
  const [query, setQuery] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [rowsPerPage, setRowsPerPage] = React.useState(pageSize)
  const [selectedRowIds, setSelectedRowIds] = React.useState<Record<string, boolean>>({})
  const [sort, setSort] = React.useState<{ id: string; direction: SortDirection } | null>(null)
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => {
    return Object.fromEntries(columns.map((column) => [column.id, column.hidden !== true]))
  })

  React.useEffect(() => {
    setColumnVisibility((prev) => {
      const next: Record<string, boolean> = {}

      for (const column of columns) {
        if (Object.prototype.hasOwnProperty.call(prev, column.id)) {
          next[column.id] = prev[column.id]
        } else {
          next[column.id] = column.hidden !== true
        }
      }

      return next
    })
  }, [columns])

  const rows = React.useMemo<DataTableRow<TData>[]>(() => {
    return data.map((entry, index) => ({
      id: getRowId ? getRowId(entry, index) : `${index}`,
      data: entry
    }))
  }, [data, getRowId])

  const visibleColumns = React.useMemo(() => {
    return columns.filter((column) => columnVisibility[column.id] !== false)
  }, [columnVisibility, columns])

  const filteredRows = React.useMemo(() => {
    if (!searchable || query.trim().length === 0) {
      return rows
    }

    const searchQuery = query.toLowerCase()

    return rows.filter((row) => {
      return visibleColumns.some((column) => {
        if (column.searchable === false) {
          return false
        }

        const raw = resolveColumnValue(row.data, column.accessor)
        return stringValue(raw).toLowerCase().includes(searchQuery)
      })
    })
  }, [query, rows, searchable, visibleColumns])

  const sortedRows = React.useMemo(() => {
    if (!sort) {
      return filteredRows
    }

    const column = columns.find((item) => item.id === sort.id)
    if (!column || column.sortable === false) {
      return filteredRows
    }

    return [...filteredRows].sort((a, b) => {
      const left = toComparable(resolveColumnValue(a.data, column.accessor))
      const right = toComparable(resolveColumnValue(b.data, column.accessor))

      if (left === right) {
        return 0
      }

      if (left > right) {
        return sort.direction === "asc" ? 1 : -1
      }

      return sort.direction === "asc" ? -1 : 1
    })
  }, [columns, filteredRows, sort])

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / rowsPerPage))

  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  React.useEffect(() => {
    setCurrentPage(1)
  }, [query, rowsPerPage, columnVisibility])

  const start = (currentPage - 1) * rowsPerPage
  const pageRows = sortedRows.slice(start, start + rowsPerPage)

  const pageRowIds = pageRows.map((row) => row.id)
  const selectedCount = Object.values(selectedRowIds).filter(Boolean).length
  const allPageSelected = pageRowIds.length > 0 && pageRowIds.every((id) => selectedRowIds[id])
  const somePageSelected = pageRowIds.some((id) => selectedRowIds[id]) && !allPageSelected

  React.useEffect(() => {
    if (!onSelectionChange) {
      return
    }

    const selectedRows = rows.filter((row) => selectedRowIds[row.id]).map((row) => row.data)
    onSelectionChange(selectedRows)
  }, [onSelectionChange, rows, selectedRowIds])

  function toggleSort(columnId: string, sortable: boolean | undefined) {
    if (sortable === false) {
      return
    }

    setSort((current) => {
      if (!current || current.id !== columnId) {
        return { id: columnId, direction: "asc" }
      }

      return {
        id: columnId,
        direction: current.direction === "asc" ? "desc" : "asc"
      }
    })
  }

  function renderSortIcon(columnId: string, sortable: boolean | undefined) {
    if (sortable === false) {
      return null
    }

    if (sort?.id !== columnId) {
      return <ArrowsDownUp className="h-3.5 w-3.5 opacity-70" aria-hidden />
    }

    return sort.direction === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5" aria-hidden />
    ) : (
      <ArrowDown className="h-3.5 w-3.5" aria-hidden />
    )
  }

  const hidableColumns = columns.filter((column) => column.canHide !== false)

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          {searchable ? (
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label="Search table rows"
              className="w-full sm:max-w-xs"
            />
          ) : null}

          {selectable && selectedCount > 0 ? (
            <p className="text-xs text-[var(--color-muted)]">{selectedCount} selected</p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {hidableColumns.length > 0 ? (
            <DropdownMenu>
              <DropdownMenuTrigger variant="outline" size="sm" className="gap-1.5">
                <Columns className="h-3.5 w-3.5" />
                Columns
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {hidableColumns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={columnVisibility[column.id] !== false}
                    onCheckedChange={(checked) => {
                      setColumnVisibility((prev) => ({
                        ...prev,
                        [column.id]: checked === true
                      }))
                    }}
                  >
                    {typeof column.header === "string" ? column.header : column.id}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}

          <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
            <span>Rows</span>
            <Select
              size="sm"
              value={`${rowsPerPage}`}
              onChange={(event) => setRowsPerPage(Number(event.target.value))}
              options={pageSizeOptions.map((option) => ({ value: `${option}`, label: `${option}` }))}
              className="w-20"
              aria-label="Rows per page"
            />
          </div>
        </div>
      </div>

      <Table {...tableProps}>
        <TableHeader>
          <TableRow>
            {selectable ? (
              <TableHead className="w-10" sticky={tableProps.stickyFirstColumn}>
                <Checkbox
                  aria-label="Select all page rows"
                  checked={allPageSelected ? true : somePageSelected ? "indeterminate" : false}
                  onCheckedChange={(checked) => {
                    setSelectedRowIds((prev) => {
                      const next = { ...prev }

                      for (const rowId of pageRowIds) {
                        next[rowId] = checked === true
                      }

                      return next
                    })
                  }}
                />
              </TableHead>
            ) : null}

            {visibleColumns.map((column) => (
              <TableHead
                key={column.id}
                align={column.align}
                className={column.headerClassName}
                sticky={tableProps.stickyFirstColumn && selectable && column === visibleColumns[0]}
              >
                <button
                  type="button"
                  onClick={() => toggleSort(column.id, column.sortable)}
                  className={cn(
                    "inline-flex items-center gap-1.5",
                    column.sortable !== false && "transition-colors hover:text-[var(--color-foreground)]"
                  )}
                  aria-label={`Sort by ${typeof column.header === "string" ? column.header : column.id}`}
                >
                  <span>{column.header}</span>
                  {renderSortIcon(column.id, column.sortable)}
                </button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {pageRows.length === 0 ? (
            <TableEmpty colSpan={visibleColumns.length + (selectable ? 1 : 0)}>{emptyMessage}</TableEmpty>
          ) : (
            pageRows.map((row) => (
              <TableRow
                key={row.id}
                tone={rowTone ? rowTone(row.data) : "default"}
                data-state={selectedRowIds[row.id] ? "selected" : undefined}
                className={cn(onRowClick && "cursor-pointer")}
                onClick={() => onRowClick?.(row.data)}
              >
                {selectable ? (
                  <TableCell sticky={tableProps.stickyFirstColumn} className="w-10">
                    <Checkbox
                      aria-label={`Select row ${row.id}`}
                      checked={selectedRowIds[row.id] === true}
                      onCheckedChange={(checked) => {
                        setSelectedRowIds((prev) => ({
                          ...prev,
                          [row.id]: checked === true
                        }))
                      }}
                      onClick={(event) => event.stopPropagation()}
                    />
                  </TableCell>
                ) : null}

                {visibleColumns.map((column, index) => {
                  const value = resolveColumnValue(row.data, column.accessor)
                  const content = column.cell
                    ? column.cell({ row: row.data, value, rowId: row.id })
                    : (value as React.ReactNode)

                  return (
                    <TableCell
                      key={`${row.id}-${column.id}`}
                      align={column.align}
                      className={column.className}
                      sticky={tableProps.stickyFirstColumn && !selectable && index === 0}
                    >
                      {content}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-2 text-xs text-[var(--color-muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing {pageRows.length === 0 ? 0 : start + 1}-{Math.min(start + rowsPerPage, sortedRows.length)} of{" "}
          {sortedRows.length}
        </p>

        <div className="flex items-center gap-2">
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage <= 1}
            className="gap-1"
          >
            <CaretLeft className="h-3.5 w-3.5" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage >= totalPages}
            className="gap-1"
          >
            Next
            <CaretRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
