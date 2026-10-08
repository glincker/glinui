"use client"

import { getStageDefault } from "@/lib/stage-defaults"
import * as React from "react"
import type { ReactNode } from "react"
import { Check, Copy } from "@phosphor-icons/react"

import { cn } from "@glinui/ui"
import { CodeBlock } from "@/components/docs/code-block"
import { StageContainerProvider, STAGE_CONTROLS_ATTR } from "@/components/docs/stage-container"
import { InstallChip } from "@/components/docs/install-chip"
import {
  PLAYBACK_STAGE_CLASSES,
  EngineSwitcher,
  PlaybackBar,
  PlaybackSubtree,
  StagePlaybackProvider
} from "@/components/playback"
import {
  BackgroundSwitcher,
  backdropScope,
  defaultBackdropFor,
  previewBgClasses,
  type PreviewBg
} from "@/components/docs/preview-backdrops"

export { BackgroundSwitcher, previewBgClasses, defaultBackdropFor, backdropScope } from "@/components/docs/preview-backdrops"
export type { PreviewBg } from "@/components/docs/preview-backdrops"

export function useCopy(text: string) {
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    []
  )
  const copy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }, [text])
  return { copied, copy }
}

export function CopyButton({
  text,
  label,
  copiedLabel = "Copied",
  disabled = false,
  className
}: {
  text: string
  label: string
  copiedLabel?: string
  disabled?: boolean
  className?: string
}) {
  const { copied, copy } = useCopy(text)
  const Icon = copied ? Check : Copy
  return (
    <button
      type="button"
      onClick={copy}
      disabled={disabled}
      className={cn(
        "inline-flex h-8 disabled:pointer-events-none disabled:opacity-50 items-center gap-1.5 rounded-lg border border-border/60 bg-[var(--surface-1)] px-2.5 text-[12px] font-medium text-neutral-600 transition-[transform,opacity] duration-150 ease-[var(--ease-out)] hover:text-foreground active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 dark:text-neutral-300",
        className
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  )
}

type FrameTab = "preview" | "code"
const TABS: ReadonlyArray<{ id: FrameTab; label: string }> = [
  { id: "preview", label: "Preview" },
  { id: "code", label: "Code" }
]

export type StageSize = "sm" | "md" | "lg"

const stageMinH: Record<StageSize, string> = {
  sm: "min-h-[240px]",
  md: "min-h-[360px]",
  lg: "min-h-[520px]"
}

export function PreviewFrame({
  code,
  baseId,
  installCommand,
  stage: stageProp,
  componentId,
  badge,
  className,
  children
}: {
  code: string
  baseId: string
  installCommand?: string
  stage?: StageSize
  componentId?: string
  badge?: string
  className?: string
  children: ReactNode
}) {
  const stage: StageSize = stageProp ?? getStageDefault(componentId ?? baseId)?.size ?? "md"
  const [active, setActive] = React.useState<FrameTab>("preview")
  const [bg, setBg] = React.useState<PreviewBg>(() => defaultBackdropFor(componentId ?? baseId, badge))
  const [stageEl, setStageEl] = React.useState<HTMLDivElement | null>(null)
  const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([])

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const index = TABS.findIndex((tab) => tab.id === active)
    let next = index
    if (event.key === "ArrowRight") next = (index + 1) % TABS.length
    else if (event.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = TABS.length - 1
    else return
    event.preventDefault()
    setActive(TABS[next].id)
    tabRefs.current[next]?.focus()
  }

  return (
    <StagePlaybackProvider componentId={componentId} stageEl={stageEl}>
    <div
      {...backdropScope(bg)}
      className={cn(
        "overflow-hidden rounded-2xl border border-border/60 bg-[var(--surface-2)] p-1.5 text-[color:var(--color-foreground)] transition-colors duration-300 motion-reduce:transition-none",
        className
      )}
    >
      <div
        {...{ [STAGE_CONTROLS_ATTR]: "" }}
        className="relative z-10 flex items-center justify-between gap-3 px-1.5 pb-2 pt-0.5 pointer-events-auto"
      >
        <div role="tablist" aria-label="Example views" onKeyDown={onKeyDown} className="flex items-center gap-1">
          {TABS.map((tab, i) => (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              role="tab"
              type="button"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={active === tab.id}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={active === tab.id ? 0 : -1}
              onClick={() => setActive(tab.id)}
              className={cn(
                "h-8 rounded-lg px-3 text-[13px] font-medium transition-colors duration-150 motion-reduce:transition-none",
                active === tab.id
                  ? "bg-black/[0.05] text-foreground dark:bg-white/[0.08]"
                  : "text-muted hover:text-foreground dark:text-neutral-400"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {installCommand ? <InstallChip command={installCommand} className="ml-auto" /> : null}
        {active === "preview" ? <BackgroundSwitcher value={bg} onChange={setBg} /> : null}
        {active === "code" ? <CopyButton text={code} label="Copy code" /> : null}
      </div>

      <div className="overflow-hidden rounded-xl bg-[var(--surface-1)] [box-shadow:var(--elev-1)] ring-1 ring-inset ring-[var(--line-soft)]">
      <div
        role="tabpanel"
        id={`${baseId}-panel-preview`}
        aria-labelledby={`${baseId}-tab-preview`}
        hidden={active !== "preview"}
        ref={setStageEl}
        {...backdropScope(bg)}
        className={cn(
          `relative isolate overflow-hidden flex ${stageMinH[stage]} items-center justify-center px-8 py-12 transition-colors duration-300 motion-reduce:transition-none [&>div:not([role=dialog]):not([role=alertdialog]):not([data-radix-popper-content-wrapper])]:w-full [&>div.flex:not([class*=justify-])]:justify-center [&>div>.flex:not([class*=justify-])]:justify-center`,
          PLAYBACK_STAGE_CLASSES,
          previewBgClasses[bg]
        )}
      >
        <PlaybackBar />
        <EngineSwitcher />
        <StageContainerProvider container={stageEl}>
          <PlaybackSubtree>{children}</PlaybackSubtree>
        </StageContainerProvider>
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-code`}
        aria-labelledby={`${baseId}-tab-code`}
        hidden={active !== "code"}
        tabIndex={0}
        className={stageMinH[stage]}
      >
        {active === "code" ? <CodeBlock code={code} language="tsx" className="rounded-none border-0 shadow-none" /> : null}
      </div>
      </div>
    </div>
    </StagePlaybackProvider>
  )
}
