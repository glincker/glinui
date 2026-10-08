"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Check, Minus } from "@phosphor-icons/react/dist/ssr"

import { cn } from "../lib/cn"
import { liftShell, PLAIN_CONTAINER } from "../lib/lift"
import { surfaceVariants, type SurfaceVariant } from "../lib/surface"
import { resolveSurfaceProps } from "../lib/surface-resolve"
import { useGlinStyle } from "./glin-provider"

const tableWrapperBase = "relative w-full overflow-auto"

/**
 * Wrapper looks per variant. Vocabulary variants come from lift.ts and surface.ts;
 * liquid and matte stay table-specific. Literal strings so Tailwind can see them.
 */
const tableWrapperLooks = {
  glinr: liftShell({ radius: "xl", elevation: "2" }),
  plain: PLAIN_CONTAINER,
  solid:
    "rounded-xl border border-[color:var(--color-border)] bg-[var(--surface-1)] text-[color:var(--color-foreground)] [box-shadow:var(--solid-elev-1)]",
  soft: `${surfaceVariants({ variant: "soft", elevation: "none" })} rounded-xl`,
  outline: `${surfaceVariants({ variant: "outline" })} rounded-xl`,
  ghost: `${surfaceVariants({ variant: "ghost" })} rounded-xl`,
  gradient: liftShell({ radius: "xl", elevation: "2" }),
  glass: `${surfaceVariants({ variant: "glass" })} rounded-xl`,
  liquid:
    "rounded-xl border border-[color:var(--glass-border)] [border-top-color:var(--glass-refraction-top)] bg-[radial-gradient(circle_at_16%_10%,color-mix(in_oklab,var(--color-foreground)_8%,transparent),transparent_45%),var(--glass-readable)] text-[color:var(--color-foreground)] backdrop-blur-xl",
  matte:
    "rounded-xl border border-[color:var(--line-soft)] bg-[var(--surface-2)] text-[color:var(--color-foreground)]"
} as const

type TableLook = keyof typeof tableWrapperLooks
const TABLE_EXTRAS = ["liquid", "matte", "lift"] as const

const tableWrapperSize = cva("", {
  variants: {
    size: { sm: "text-xs", md: "text-sm", lg: "text-base" }
  },
  defaultVariants: { size: "md" }
})

/** Header strip look per variant: glinr raises it on face-0 with the sheen, plain stays flat. */
const tableHeaderLooks: Record<TableLook, string> = {
  glinr: "[background:var(--sheen),var(--face-0,var(--surface-2))] shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06)]",
  plain: "",
  solid: "bg-[var(--surface-2)]",
  soft: "bg-[var(--surface-3)]",
  outline: "",
  ghost: "",
  gradient:
    "[background:linear-gradient(135deg,var(--gradient-from),var(--gradient-to))] [&_th]:!text-white",
  glass: "bg-[color-mix(in_oklab,var(--color-foreground)_5%,transparent)]",
  liquid: "bg-[color-mix(in_oklab,var(--color-foreground)_5%,transparent)]",
  matte: "bg-[var(--surface-3)]"
}

const tableHeadCellVariants = cva(
  "align-middle text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)] [&:has([role=checkbox])]:pr-0",
  {
    variants: {
      size: {
        sm: "h-8 px-2",
        md: "h-10 px-3",
        lg: "h-12 px-4"
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
)

const tableCellVariants = cva("align-middle tabular-nums [&:has([role=checkbox])]:pr-0", {
  variants: {
    size: {
      sm: "p-2",
      md: "p-3",
      lg: "p-4"
    }
  },
  defaultVariants: {
    size: "md"
  }
})

const tableAlignmentVariants = cva("", {
  variants: {
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right"
    }
  },
  defaultVariants: {
    align: "left"
  }
})

const tableRowToneVariants = cva("", {
  variants: {
    tone: {
      default: "",
      info: "bg-[color-mix(in_oklab,var(--tone-info)_7%,transparent)]",
      success: "bg-[color-mix(in_oklab,var(--tone-success)_7%,transparent)]",
      warning: "bg-[color-mix(in_oklab,var(--tone-warning)_8%,transparent)]",
      danger: "bg-[color-mix(in_oklab,var(--tone-danger)_8%,transparent)]"
    }
  },
  defaultVariants: {
    tone: "default"
  }
})

type TableContextValue = {
  variant: TableLook
  size: NonNullable<VariantProps<typeof tableWrapperSize>["size"]>
  striped: boolean
  interactive: boolean
  stickyHeader: boolean
  stickyFirstColumn: boolean
  grid: boolean
  noWrap: boolean
  rowDividers: boolean
}

const TableContext = React.createContext<TableContextValue>({
  variant: "glinr",
  size: "md",
  striped: false,
  interactive: true,
  stickyHeader: false,
  stickyFirstColumn: false,
  grid: false,
  noWrap: false,
  rowDividers: true
})

function useTableContext() {
  return React.useContext(TableContext)
}

function getStickySurfaceClass(variant: TableContextValue["variant"]) {
  switch (variant) {
    case "glass":
    case "liquid":
      return "bg-[var(--glass-readable)] backdrop-blur-md"
    case "glinr":
    case "gradient":
      return "bg-[var(--face-0,var(--surface-2))]"
    case "ghost":
    case "outline":
    case "plain":
      return "bg-[var(--color-background)]"
    default:
      return "bg-[var(--surface-2)]"
  }
}

function getFirstStickySurfaceClass(variant: TableContextValue["variant"]) {
  switch (variant) {
    case "glass":
    case "liquid":
      return "first:bg-[var(--glass-readable)] first:backdrop-blur-md"
    case "ghost":
    case "outline":
    case "plain":
      return "first:bg-[var(--color-background)]"
    default:
      return "first:bg-[var(--surface-1)]"
  }
}

export type TableProps = React.HTMLAttributes<HTMLTableElement> &
  {
    /**
     * Visual variant. Omit for the ambient design style (glinr: lift wrapper with a raised header strip;
     * plain: shadcn table). Vocabulary: glinr, solid, plain, soft, outline, ghost, gradient, glass.
     * liquid, matte and the legacy `lift` alias stay supported.
     */
    variant?: SurfaceVariant | "liquid" | "matte" | "lift" | "default" | "raised" | "frosted"
    size?: "sm" | "md" | "lg"
    containerClassName?: string
    striped?: boolean
    interactive?: boolean
    stickyHeader?: boolean
    stickyFirstColumn?: boolean
    grid?: boolean
    noWrap?: boolean
    rowDividers?: boolean
    layout?: "auto" | "fixed"
    /** Force a minimum table width so the wrapper scrolls horizontally on narrow screens. */
    wide?: boolean | string
  }

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      className,
      variant,
      size,
      containerClassName,
      striped = false,
      interactive = true,
      stickyHeader = false,
      stickyFirstColumn = false,
      grid = false,
      noWrap = false,
      rowDividers = true,
      layout = "auto",
      wide = false,
      ...props
    },
    ref
  ) => {
    const ambient = useGlinStyle()
    const { variant: surface, extra } = resolveSurfaceProps(variant, ambient, "container", TABLE_EXTRAS, { lift: "glinr" })
    const resolvedVariant: TableLook = extra && extra !== "lift" ? extra : surface
    const resolvedSize = size ?? "md"

    return (
      <TableContext.Provider
        value={{
          variant: resolvedVariant,
          size: resolvedSize,
          striped,
          interactive,
          stickyHeader,
          stickyFirstColumn,
          grid,
          noWrap,
          rowDividers
        }}
      >
        <div
          data-slot="table-container"
          data-variant={resolvedVariant}
          className={cn(
            tableWrapperBase,
            tableWrapperLooks[resolvedVariant],
            tableWrapperSize({ size: resolvedSize }),
            containerClassName
          )}
        >
          <table
            ref={ref}
            data-slot="table"
            className={cn(
              "w-full caption-bottom",
              layout === "fixed" ? "table-fixed" : "table-auto",
              wide === true && "min-w-[640px]",
              typeof wide === "string" && wide,
              className
            )}
            {...props}
          />
        </div>
      </TableContext.Provider>
    )
  }
)

Table.displayName = "Table"

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => {
  const { stickyHeader, variant, rowDividers } = useTableContext()


  return (
    <thead
      ref={ref}
      data-slot="table-header"
      className={cn(
        rowDividers && "[&_tr]:border-b [&_tr]:border-[var(--color-border)]",
        stickyHeader && "sticky top-0 z-10",
        stickyHeader && getStickySurfaceClass(variant),
        stickyHeader && "shadow-[0_1px_0_var(--color-border)]",
        tableHeaderLooks[variant],
        className
      )}
      {...props}
    />
  )
})

TableHeader.displayName = "TableHeader"

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    data-slot="table-body"
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))

TableBody.displayName = "TableBody"

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => {
  const { variant } = useTableContext()

  return (
    <tfoot
      ref={ref}
      data-slot="table-footer"
      className={cn(
        "border-t border-[var(--color-border)] font-medium [&>tr]:last:border-b-0",
        variant === "glass" || variant === "liquid" ? "bg-[color-mix(in_oklab,var(--color-foreground)_5%,transparent)]" : "bg-[var(--surface-2)]",
        className
      )}
      {...props}
    />
  )
})

TableFooter.displayName = "TableFooter"

export type TableRowTone = NonNullable<VariantProps<typeof tableRowToneVariants>["tone"]>

export type TableRowProps = React.HTMLAttributes<HTMLTableRowElement> & {
  tone?: TableRowTone
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, tone = "default", ...props }, ref) => {
    const { variant, striped, interactive, rowDividers } = useTableContext()

    return (
      <tr
        ref={ref}
        data-slot="table-row"
        className={cn(
          rowDividers ? "border-b border-[var(--line-soft)]" : "border-0",
          "transition-colors duration-fast ease-standard motion-reduce:transition-none",
          "hover:bg-[var(--surface-2)] data-[state=selected]:bg-[color-mix(in_oklch,var(--color-accent)_8%,var(--surface-1))]",
          striped &&
            "even:bg-[color-mix(in_oklab,var(--color-foreground)_4%,transparent)]",
          interactive &&
            "cursor-pointer hover:bg-[color-mix(in_oklab,var(--color-foreground)_6%,transparent)]",
          tableRowToneVariants({ tone }),
          className
        )}
        {...props}
      />
    )
  }
)

TableRow.displayName = "TableRow"

export type TableHeadProps = React.ThHTMLAttributes<HTMLTableCellElement> & {
  align?: "left" | "center" | "right"
  sticky?: boolean
}

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, align = "left", sticky = false, ...props }, ref) => {
    const { size, grid, noWrap, stickyFirstColumn, variant } = useTableContext()

    return (
      <th
        ref={ref}
        data-slot="table-head"
        className={cn(
          tableHeadCellVariants({ size }),
          variant === "plain" && "text-sm font-medium normal-case tracking-normal",
          tableAlignmentVariants({ align }),
          noWrap && "whitespace-nowrap",
          grid && "border-r border-[var(--color-border)] last:border-r-0",
          stickyFirstColumn &&
            "first:sticky first:left-0 first:z-[3] first:shadow-[6px_0_10px_-10px_rgb(0_0_0_/_0.35)]",
          stickyFirstColumn && getFirstStickySurfaceClass(variant),
          sticky && "sticky left-0 z-[4] shadow-[6px_0_10px_-10px_rgb(0_0_0_/_0.35)]",
          sticky && getStickySurfaceClass(variant),
          className
        )}
        {...props}
      />
    )
  }
)

TableHead.displayName = "TableHead"

export type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement> & {
  align?: "left" | "center" | "right"
  truncate?: boolean
  sticky?: boolean
}

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, align = "left", truncate = false, sticky = false, ...props }, ref) => {
    const { size, grid, noWrap, stickyFirstColumn, variant } = useTableContext()

    return (
      <td
        ref={ref}
        data-slot="table-cell"
        className={cn(
          tableCellVariants({ size }),
          tableAlignmentVariants({ align }),
          noWrap && "whitespace-nowrap",
          truncate && "max-w-[18rem] truncate",
          grid && "border-r border-[var(--color-border)] last:border-r-0",
          stickyFirstColumn &&
            "first:sticky first:left-0 first:z-[1] first:shadow-[6px_0_10px_-10px_rgb(0_0_0_/_0.28)]",
          stickyFirstColumn && getFirstStickySurfaceClass(variant),
          sticky && "sticky left-0 z-[2] shadow-[6px_0_10px_-10px_rgb(0_0_0_/_0.28)]",
          sticky && getStickySurfaceClass(variant),
          className
        )}
        {...props}
      />
    )
  }
)

TableCell.displayName = "TableCell"

export const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    data-slot="table-caption"
    className={cn("mt-4 text-sm text-[var(--color-muted)]", className)}
    {...props}
  />
))

TableCaption.displayName = "TableCaption"

export type YesNoProps = React.HTMLAttributes<HTMLSpanElement> & {
  /** True renders a check, false renders a minus. */
  value: boolean
  /** Screen reader text for the yes state. */
  yesLabel?: string
  /** Screen reader text for the no state. */
  noLabel?: string
}

/** Check / minus cell content with screen reader text, for comparison tables. */
export const YesNo = React.forwardRef<HTMLSpanElement, YesNoProps>(
  ({ value, yesLabel = "Yes", noLabel = "No", className, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="yes-no"
      data-value={value ? "yes" : "no"}
      className={cn(
        "inline-flex items-center justify-center",
        value ? "text-[var(--color-signal-ok)]" : "text-[var(--color-subtle,var(--color-muted))]",
        className
      )}
      {...props}
    >
      {value ? <Check aria-hidden="true" weight="bold" className="size-4" /> : <Minus aria-hidden="true" weight="bold" className="size-4" />}
      <span className="sr-only">{value ? yesLabel : noLabel}</span>
    </span>
  )
)

YesNo.displayName = "YesNo"

export function TableEmpty({ colSpan, children }: { colSpan: number; children?: React.ReactNode }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} align="center" className="h-24 text-[var(--color-muted)]">
        {children ?? "No results."}
      </TableCell>
    </TableRow>
  )
}
