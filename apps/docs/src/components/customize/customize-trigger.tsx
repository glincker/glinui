"use client"

import * as React from "react"
import { GearSix } from "@phosphor-icons/react"

import { cn, Popover, PopoverContent, PopoverTrigger } from "@glinui/ui"

import { CustomizePanel } from "./customize-panel"

/** Gear button that opens the Customize popover. Used in the docs topbar. */
export function CustomizeTrigger({ className }: { className?: string }) {
  return (
    <Popover>
      <PopoverTrigger
        aria-label="Customize"
        title="Customize"
        className={cn(className, "px-0")}
        variant="ghost"
      >
        <GearSix className="size-4" aria-hidden />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        variant="default"
        collisionPadding={8}
        aria-label="Customize"
        className="w-[min(20rem,calc(100vw-1rem))] max-h-[calc(100dvh-4rem)] overflow-y-auto"
      >
        <h2 className="mb-3 text-sm font-semibold tracking-[-0.01em]">Customize</h2>
        <CustomizePanel />
      </PopoverContent>
    </Popover>
  )
}
