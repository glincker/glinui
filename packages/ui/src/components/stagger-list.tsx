"use client"

import * as React from "react"
import type { RevealDirection, SpringInput, StaggerDirection } from "@glinui/motion"

import { mergeRefs, useEngineRun } from "./motion-engine"
import { variantToRevealOptions, type EngineControlProps, type RevealVariant } from "./reveal"

export type StaggerListTag = "div" | "ul" | "ol" | "section" | "nav"

export type StaggerListProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> &
  EngineControlProps & {
    as?: StaggerListTag
    variant?: RevealVariant
    direction?: RevealDirection
    distance?: number
    /** Delay between children in ms. Default 60. */
    step?: number
    /** Order the children appear in. Default `forward`. */
    order?: StaggerDirection
    duration?: number
    delay?: number
    spring?: SpringInput
    once?: boolean
    threshold?: number
    immediate?: boolean
    children?: React.ReactNode
  }

/** Reveals each direct child in sequence once the list enters the viewport. */
export const StaggerList = React.forwardRef<HTMLElement, StaggerListProps>(function StaggerList(
  {
    as = "div",
    variant = "slide",
    direction,
    distance,
    step = 60,
    order = "forward",
    duration,
    delay,
    spring,
    once = true,
    threshold,
    immediate = false,
    engine,
    motion,
    children,
    ...props
  },
  forwardedRef
) {
  const innerRef = React.useRef<HTMLElement | null>(null)
  const childCount = React.Children.count(children)

  useEngineRun(
    { engine, motion, hideRef: innerRef },
    (instance) => {
      const el = innerRef.current
      if (!el) return
      const items = Array.from(el.children).filter((c): c is HTMLElement => c instanceof HTMLElement)
      if (items.length === 0) return
      return instance.stagger(items, {
        ...variantToRevealOptions(variant, { direction, distance }),
        step,
        order,
        duration,
        delay,
        spring,
        once,
        threshold,
        immediate,
        trigger: el
      })
    },
    [variant, direction, distance, step, order, duration, delay, spring, once, threshold, immediate, childCount]
  )

  return React.createElement(
    as,
    { ...props, ref: mergeRefs<HTMLElement>(innerRef, forwardedRef), "data-glin-stagger": variant },
    children
  )
})

StaggerList.displayName = "StaggerList"
