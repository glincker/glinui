import * as React from "react"

const warned = new Set<string>()

/** Dev-only: icon-only toggles need an accessible name. */
export function warnIfUnlabeled(
  name: string,
  props: {
    children?: React.ReactNode
    "aria-label"?: string
    "aria-labelledby"?: string
    title?: string
  }
): void {
  if (typeof process === "undefined" || process.env.NODE_ENV === "production") return
  if (props["aria-label"] || props["aria-labelledby"] || props.title) return
  const hasText = React.Children.toArray(props.children).some(
    (c) => (typeof c === "string" && c.trim() !== "") || typeof c === "number"
  )
  if (hasText || warned.has(name)) return
  warned.add(name)
  console.warn(`[glinui] ${name} has no text content and no aria-label. Icon-only toggles need an accessible name.`)
}

export function resetToggleWarnings(): void {
  warned.clear()
}
