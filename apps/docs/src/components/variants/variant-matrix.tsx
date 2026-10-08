import type { ReactNode } from "react"

// Namespace import: avoids the dev server barrel-export cache for freshly added exports.
import * as Glin from "@glinui/ui"
import { matrixCellKey, matrixColumns, type MatrixScopeName } from "@/components/variants/matrix-utils"

const { ThemeScope, cn } = Glin

export type VariantMatrixProps = {
  /** Renders one cell. `tone` is undefined when the tones list is empty. */
  render: (variant: string, tone: string | undefined) => ReactNode
  variants: readonly string[]
  tones?: readonly string[]
  /** Theme scopes to render, side by side. Defaults to light and dark. */
  scopes?: readonly MatrixScopeName[]
  /** Accessible name for each grid, e.g. "Button variants". */
  label: string
  className?: string
}

function Grid({
  render,
  variants,
  tones,
  scope,
  label
}: Required<Pick<VariantMatrixProps, "render" | "variants" | "tones" | "label">> & { scope: MatrixScopeName }) {
  const columns = matrixColumns(tones)
  return (
    <ThemeScope theme={scope} fill className="overflow-x-auto rounded-xl border border-border/60 p-4">
      <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-muted)]">{scope} scope</p>
      <table className="w-full border-separate border-spacing-x-3 border-spacing-y-2 text-left" aria-label={`${label}, ${scope} scope`}>
        <thead>
          <tr>
            <th scope="col" className="w-20 text-[11px] font-medium text-[var(--color-muted)]">
              variant
            </th>
            {columns.map((tone) => (
              <th key={tone ?? "none"} scope="col" className="text-[11px] font-medium text-[var(--color-muted)]">
                {tone ?? "default"}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {variants.map((variant) => (
            <tr key={variant}>
              <th scope="row" className="font-mono text-[11px] font-medium text-[var(--color-muted)]">
                {variant}
              </th>
              {columns.map((tone) => (
                <td key={matrixCellKey(variant, tone)} className="whitespace-nowrap">
                  {render(variant, tone)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </ThemeScope>
  )
}

/** Renders one component across the whole variant x tone grid, once per theme scope. */
export function VariantMatrix({
  render,
  variants,
  tones = [],
  scopes = ["light", "dark"],
  label,
  className
}: VariantMatrixProps) {
  return (
    <div className={cn("grid gap-4 xl:grid-cols-2", scopes.length < 2 && "xl:grid-cols-1", className)} data-variant-matrix={label}>
      {scopes.map((scope) => (
        <Grid key={scope} render={render} variants={variants} tones={tones} scope={scope} label={label} />
      ))}
    </div>
  )
}
