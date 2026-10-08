export type MatrixScopeName = "light" | "dark"

/** Column list for a matrix: an empty tone list collapses to one untoned column. */
export function matrixColumns(tones: readonly string[]): ReadonlyArray<string | undefined> {
  return tones.length > 0 ? tones : [undefined]
}

export function matrixCellKey(variant: string, tone: string | undefined): string {
  return `${variant}:${tone ?? "none"}`
}
