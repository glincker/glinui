"use client"

import { Info } from "@phosphor-icons/react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@glinui/ui"

export function ButtonImplementationSwitcher() {
  return (
    <div className="space-y-3">
      <Tabs defaultValue="radix" className="space-y-2">
        <TabsList
          variant="ghost"
          size="sm"
          className="h-auto gap-1 rounded-full border border-border/60 bg-[var(--glass-2-surface)] p-1"
        >
          <TabsTrigger value="radix" variant="ghost" size="sm" className="rounded-full px-3">
            Radix UI
          </TabsTrigger>
          <TabsTrigger value="base" variant="ghost" size="sm" className="rounded-full px-3">
            Base UI
          </TabsTrigger>
        </TabsList>

        <TabsContent value="radix" variant="ghost" size="sm" className="m-0 border-0 p-0">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Current implementation track. Built on Radix primitives under `@glinui/ui`.
          </p>
        </TabsContent>

        <TabsContent value="base" variant="ghost" size="sm" className="m-0 border-0 p-0">
          <p className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
            <Info className="size-4" />
            Planned track. Base UI parity lands after radix docs parity + registry stability.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
