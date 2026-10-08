/** Tailwind default spacing keys that exist for size-* / h-* / w-* utilities. */
const SPACING = new Set([
  "0", "px", "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "5", "6", "7", "8", "9", "10", "11", "12",
  "14", "16", "20", "24", "28", "32", "36", "40", "44", "48", "52", "56", "60", "64", "72", "80", "96",
  "full", "auto", "min", "max", "fit", "screen"
])

/** Returns size-/h-/w- classes whose value is neither on the spacing scale nor arbitrary/fractional. */
export function findInvalidSizeClasses(classNames: string): string[] {
  const bad: string[] = []
  for (const token of classNames.split(/\s+/)) {
    const base = token.split(":").pop() ?? ""
    const match = /^(?:size|h|w)-(.+)$/.exec(base)
    if (!match) continue
    const value = match[1]
    if (value.startsWith("[") || /^\d+\/\d+$/.test(value)) continue
    if (!SPACING.has(value)) bad.push(token)
  }
  return bad
}
