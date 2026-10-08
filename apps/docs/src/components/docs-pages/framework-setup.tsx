"use client"

import * as React from "react"

import { BrandIcon } from "@/components/brand/brand-icon"
import { CodeBlock } from "@/components/docs/code-block"
import { InstallTabs } from "@/components/docs/install-tabs"
import {
  frameworkSetups,
  installCommand,
  presetCjs,
  presetEsm,
  presetUsage,
  type FrameworkKey
} from "@/components/docs-pages/getting-started-data"

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4">
      <span
        aria-hidden="true"
        className="flex size-8 items-center justify-center rounded-full bg-surface-2 font-mono text-xs font-medium text-muted ring-1 ring-line-soft"
      >
        {n}
      </span>
      <div className="min-w-0 space-y-3 pb-8">
        <h3 className="type-h3 pt-0.5">{title}</h3>
        {children}
      </div>
    </li>
  )
}

/** Framework chooser (tabs) plus the numbered setup steps. Package manager follows the shared preference. */
export function FrameworkSetup() {
  const [active, setActive] = React.useState<FrameworkKey>("next")
  const [format, setFormat] = React.useState<"esm" | "cjs">("esm")
  const setup = frameworkSetups.find((s) => s.key === active) ?? frameworkSetups[0]
  const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([])

  React.useEffect(() => {
    const sync = () => {
      const match = window.location.hash.match(/^#fw-tab-([a-z]+)$/)
      const found = match ? frameworkSetups.find((s) => s.key === match[1]) : undefined
      if (found) setActive(found.key)
    }
    sync()
    window.addEventListener("hashchange", sync)
    return () => window.removeEventListener("hashchange", sync)
  }, [])

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0
    if (!step) return
    event.preventDefault()
    const nextIndex = (index + step + frameworkSetups.length) % frameworkSetups.length
    const next = frameworkSetups[nextIndex]
    if (!next) return
    setActive(next.key)
    tabRefs.current[nextIndex]?.focus()
  }

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        aria-label="Framework"
        className="inline-flex max-w-full gap-0.5 overflow-x-auto rounded-input border border-line-soft bg-surface-well p-0.5"
      >
        {frameworkSetups.map((s, index) => (
          <button
            key={s.key}
            ref={(el) => {
              tabRefs.current[index] = el
            }}
            type="button"
            role="tab"
            id={`fw-tab-${s.key}`}
            aria-selected={s.key === active}
            aria-controls="fw-panel"
            tabIndex={s.key === active ? 0 : -1}
            onClick={() => setActive(s.key)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={
              s.key === active
                ? "inline-flex items-center gap-2 whitespace-nowrap rounded-md bg-surface-1 px-3 py-1.5 text-[13px] font-medium text-foreground shadow-elev-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                : "inline-flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-[13px] font-medium text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand motion-reduce:transition-none"
            }
          >
            <BrandIcon name={s.brand} size={16} variant={s.key === active ? "auto" : "mono"} className={s.key === active ? undefined : "opacity-70"} />
            {s.label}
          </button>
        ))}
      </div>

      <div id="fw-panel" role="tabpanel" aria-labelledby={`fw-tab-${setup.key}`}>
        <p className="type-body mb-6 max-w-[68ch] text-muted">{setup.note}</p>
        <ol className="space-y-0">
          <Step n={1} title="Install">
            <p className="type-body max-w-[68ch] text-muted">
              Skip this if you already have a project. Otherwise create one, then add the packages.
            </p>
            <InstallTabs command={setup.createCommand} />
            <InstallTabs command={installCommand} />
          </Step>

          <Step n={2} title="Import tokens">
            <p className="type-body max-w-[68ch] text-muted">
              Load <code className="type-code">theme.css</code> once. It defines every CSS variable the components and
              the preset read.
            </p>
            <CodeBlock language={setup.tokenLanguage} code={setup.tokenImport} filename={setup.tokenFile} />
          </Step>

          <Step n={3} title="Add the Tailwind preset">
            <p className="type-body max-w-[68ch] text-muted">
              Register <code className="type-code">@glinui/tokens/tailwind-preset</code> so utilities such as{" "}
              <code className="type-code">bg-surface-1</code>, <code className="type-code">shadow-elev-2</code> and{" "}
              <code className="type-code">rounded-card</code> resolve to the tokens.
            </p>
            <div
              role="group"
              aria-label="Config module format"
              className="inline-flex gap-0.5 rounded-input border border-line-soft bg-surface-well p-0.5"
            >
              {(["esm", "cjs"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={format === f}
                  onClick={() => setFormat(f)}
                  className={
                    format === f
                      ? "rounded-md bg-surface-1 px-2.5 py-1 font-mono text-[11px] text-foreground shadow-elev-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                      : "rounded-md px-2.5 py-1 font-mono text-[11px] text-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  }
                >
                  {f === "esm" ? "ESM / TypeScript" : "CommonJS"}
                </button>
              ))}
            </div>
            <CodeBlock language={format === "esm" ? "ts" : "js"} code={format === "esm" ? presetEsm : presetCjs} />
            <CodeBlock language="tsx" code={presetUsage} />
          </Step>

          <Step n={4} title="Use a component">
            <CodeBlock language="tsx" code={setup.usage} filename={setup.usageFile} />
          </Step>

          <Step n={5} title="Copy for AI">
            <p className="type-body max-w-[68ch] text-muted">
              Every component page has a Copy prompt button that gives your editor agent the install command, props and
              a usage example. Animations have prompts too.
            </p>
          </Step>
        </ol>
      </div>
    </div>
  )
}
