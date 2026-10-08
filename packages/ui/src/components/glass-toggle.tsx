"use client"

import * as React from "react"

import { Switch, type SwitchProps } from "./switch"

export type GlassToggleProps = Omit<SwitchProps, "variant">

/**
 * Frosted switch with a liquid accent fill. A thin preset over `Switch`
 * (variant="glass"), so it shares behavior, sizes, icons, loading, labels and
 * form participation. Pair it with a photo or vivid backdrop to see the glass.
 */
export const GlassToggle = React.forwardRef<HTMLButtonElement, GlassToggleProps>(
  (props, ref) => <Switch ref={ref} variant="glass" {...props} />
)

GlassToggle.displayName = "GlassToggle"
