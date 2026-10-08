"use client"

import { useState, type ComponentType, type FormEvent } from "react"
import { Moon, Sun, Check, X, WifiHigh, BellRinging, Airplane } from "@phosphor-icons/react"
import { GlassToggle, Switch, cn } from "@glinui/ui"

import { previewBgClasses } from "@/components/docs/preview-backdrops"

type Kind = "switch" | "glass"
type AnySwitch = ComponentType<React.ComponentProps<typeof Switch>>

function pick(kind: Kind): AnySwitch {
  return (kind === "glass" ? GlassToggle : Switch) as AnySwitch
}

const SIZES = ["sm", "md", "lg"] as const

/** Photo stage so glass has something to refract. */
export function PhotoStage({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex w-full items-center justify-center rounded-xl p-4 text-white sm:p-8", previewBgClasses.photo, className)}>
      {children}
    </div>
  )
}

/** Neutral stage for the solid default variant. */
export function PlainStage({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex w-full items-center justify-center rounded-xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-4 text-[var(--color-foreground)] sm:p-8", className)}>
      {children}
    </div>
  )
}

export function StateMatrix({ kind }: { kind: Kind }) {
  const C = pick(kind)
  const rows = [
    { label: "Off", props: {} },
    { label: "On", props: { defaultChecked: true } },
    { label: "Disabled off", props: { disabled: true } },
    { label: "Disabled on", props: { disabled: true, defaultChecked: true } }
  ]
  return (
    <div className="w-full overflow-x-auto">
      <table className="mx-auto text-left text-xs">
        <thead>
          <tr>
            <th className="pe-6 pb-2 font-medium opacity-80">State</th>
            {SIZES.map((s) => (
              <th key={s} className="px-2 pb-2 text-center sm:px-4 font-medium opacity-80">{s}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <td className="pe-6 py-1.5 opacity-90">{r.label}</td>
              {SIZES.map((s) => (
                <td key={s} className="px-2 py-1.5 text-center sm:px-4">
                  <span className="inline-flex"><C aria-label={`${r.label} ${s}`} size={s} {...r.props} /></span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function IconsDemo({ kind }: { kind: Kind }) {
  const C = pick(kind)
  return (
    <div className="flex items-center justify-center gap-6">
      <C aria-label="Theme" size="lg" defaultChecked onIcon={<Moon weight="fill" />} offIcon={<Sun weight="fill" />} />
      <C aria-label="Enabled" size="md" defaultChecked onIcon={<Check weight="bold" />} offIcon={<X weight="bold" />} />
      <C aria-label="Labels" size="lg" showLabels defaultChecked />
    </div>
  )
}

export function RowsDemo({ kind }: { kind: Kind }) {
  const C = pick(kind)
  return (
    <div className="w-full max-w-sm divide-y divide-[var(--line-soft)] rounded-xl border border-[var(--line-soft)] bg-[var(--surface-1)] px-4 text-[var(--color-foreground)]">
      <C fieldClassName="py-3" label="Wi-Fi" description="Join known networks automatically." defaultChecked />
      <C fieldClassName="py-3" label="Notifications" description="Banners, sounds and badges." />
      <C fieldClassName="py-3" label="Airplane mode" description="Turns off all radios." disabled />
    </div>
  )
}

export function LoadingDemo({ kind }: { kind: Kind }) {
  const C = pick(kind)
  const [on, setOn] = useState(false)
  const [busy, setBusy] = useState(false)
  const flip = (next: boolean) => {
    setBusy(true)
    window.setTimeout(() => {
      setOn(next)
      setBusy(false)
    }, 1200)
  }
  return (
    <div className="flex items-center justify-center gap-6">
      <C aria-label="Syncing" loading />
      <C aria-label="Syncing on" loading defaultChecked />
      <C aria-label="Save on toggle" checked={on} loading={busy} onCheckedChange={flip} />
    </div>
  )
}

export function ControlledDemo({ kind }: { kind: Kind }) {
  const C = pick(kind)
  const [on, setOn] = useState(false)
  return (
    <div className="flex flex-col items-center gap-3 text-sm">
      <C aria-label="Controlled" checked={on} onCheckedChange={setOn} />
      <output className="rounded-md bg-neutral-900/80 px-2 py-1 font-mono text-xs text-white">checked: {String(on)}</output>
    </div>
  )
}

export function FormDemo({ kind }: { kind: Kind }) {
  const C = pick(kind)
  const [out, setOut] = useState("(submit the form)")
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    setOut(JSON.stringify(Object.fromEntries(data.entries())))
  }
  return (
    <form onSubmit={submit} className="flex w-full max-w-xs flex-col gap-3">
      <div className="flex items-center justify-between gap-4 text-sm"><span className="inline-flex items-center gap-2"><WifiHigh /> Wi-Fi</span><C aria-label="Wi-Fi" name="wifi" defaultChecked /></div>
      <div className="flex items-center justify-between gap-4 text-sm"><span className="inline-flex items-center gap-2"><BellRinging /> Alerts</span><C aria-label="Alerts" name="alerts" value="yes" /></div>
      <div className="flex items-center justify-between gap-4 text-sm"><span className="inline-flex items-center gap-2"><Airplane /> Airplane</span><C aria-label="Airplane" name="airplane" /></div>
      <button type="submit" className="h-9 rounded-lg bg-[var(--color-accent)] text-sm font-medium text-white">Submit</button>
      <output className="break-all rounded-md bg-neutral-900/80 px-2 py-1 font-mono text-xs">{out}</output>
    </form>
  )
}
