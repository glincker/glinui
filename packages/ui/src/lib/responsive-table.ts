/** Column priority: 1 always shows, 2 needs a 42rem container, 3 needs a 56rem container. */
export type ColumnPriority = 1 | 2 | 3

/** Row count above which the virtual table starts windowing. */
export const DEFAULT_VIRTUALIZE_OVER = 50

/** Name of the container the priority classes query. */
export const RESPONSIVE_TABLE_CONTAINER = "rtable"

// Literal strings so Tailwind can see them. Widths are the table container's, not the viewport's.
const PRIORITY_CLASS: Record<ColumnPriority, string> = {
  1: "",
  2: "hidden [@container_rtable_(min-width:42rem)]:table-cell",
  3: "hidden [@container_rtable_(min-width:56rem)]:table-cell"
}

export function priorityClass(priority: ColumnPriority | undefined): string {
  return PRIORITY_CLASS[priority ?? 1]
}

export function shouldVirtualize(count: number, threshold: number = DEFAULT_VIRTUALIZE_OVER): boolean {
  return count > threshold
}

type ColumnLike = {
  id: string
  primary?: boolean
  hideInCard?: boolean
}

/** The first column flagged `primary` wins, otherwise the first column. */
export function splitColumns<C extends ColumnLike>(columns: readonly C[]): { primary: C | undefined; rest: C[] } {
  const primary = columns.find((c) => c.primary) ?? columns[0]
  return { primary, rest: columns.filter((c) => c !== primary) }
}

export function cardFields<C extends ColumnLike>(columns: readonly C[]): C[] {
  return splitColumns(columns).rest.filter((c) => !c.hideInCard)
}

/** Spacer heights that keep the scroll height right while only a window of rows is rendered. */
export function paddingFor(
  items: readonly { start: number; end: number }[],
  total: number
): { top: number; bottom: number } {
  const first = items[0]
  const last = items[items.length - 1]
  if (!first || !last) return { top: 0, bottom: 0 }
  return { top: first.start, bottom: Math.max(0, total - last.end) }
}
