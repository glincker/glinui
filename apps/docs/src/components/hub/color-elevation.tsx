"use client"

import { CopyChip } from "@/components/hub/copy-chip"

const levels = [
  { name: "--elev-1", cls: "[box-shadow:var(--elev-1)]", note: "Cards at rest" },
  { name: "--elev-2", cls: "[box-shadow:var(--elev-2)]", note: "Hovered and floating" },
  { name: "--elev-3", cls: "[box-shadow:var(--elev-3)]", note: "Popovers and dialogs" }
]

export function ColorElevation() {
  return (
    <div className="space-y-6">
      <ul className="grid list-none gap-4 p-0 sm:grid-cols-3">
        {levels.map((level) => (
          <li key={level.name} className="space-y-2">
            <div className={`flex h-24 items-center justify-center rounded-xl bg-[var(--surface-1)] text-[13px] text-neutral-600 ring-1 ring-[var(--line-soft)] dark:text-neutral-300 ${level.cls}`}>
              {level.note}
            </div>
            <div className="-mx-1.5 flex flex-col items-start">
              <CopyChip value={level.name} label="variable name" />
              <CopyChip value={level.cls} label="Tailwind usage" />
            </div>
          </li>
        ))}
      </ul>
      <ul className="grid list-none gap-4 p-0 sm:grid-cols-3">
        <li className="space-y-2">
          <div className="rounded-xl bg-[image:var(--ring)] p-px">
            <div className="flex h-16 items-center justify-center rounded-[11px] bg-[var(--surface-1)] text-[13px] text-neutral-600 dark:text-neutral-300">Gradient ring</div>
          </div>
          <div className="-mx-1.5 flex flex-col items-start">
            <CopyChip value="--ring" label="variable name" />
            <CopyChip value="bg-[image:var(--ring)] p-px" label="Tailwind usage" />
          </div>
        </li>
        <li className="space-y-2">
          <div className="flex h-16 flex-col justify-center rounded-xl bg-[var(--surface-1)] px-4 ring-1 ring-[var(--line-soft)]">
            <div className="h-px w-full bg-[image:var(--hairline)]" />
          </div>
          <div className="-mx-1.5 flex flex-col items-start">
            <CopyChip value="--hairline" label="variable name" />
            <CopyChip value="h-px bg-[image:var(--hairline)]" label="Tailwind usage" />
          </div>
        </li>
        <li className="space-y-2">
          <div className="flex h-16 items-center justify-center rounded-xl border border-[var(--line-soft)] bg-[var(--surface-1)] text-[13px] text-neutral-600 dark:text-neutral-300">Soft line</div>
          <div className="-mx-1.5 flex flex-col items-start">
            <CopyChip value="--line-soft" label="variable name" />
            <CopyChip value="border-[var(--line-soft)]" label="Tailwind usage" />
          </div>
        </li>
      </ul>
    </div>
  )
}
