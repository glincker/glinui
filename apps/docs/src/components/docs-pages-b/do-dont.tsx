import * as React from "react"
import { Check, X } from "@phosphor-icons/react/dist/ssr"

export type DoDontItem = { text: React.ReactNode; code?: string }

function Column({ kind, items }: { kind: "do" | "dont"; items: DoDontItem[] }) {
  const isDo = kind === "do"
  const Icon = isDo ? Check : X
  return (
    <section
      aria-label={isDo ? "Do" : "Don't"}
      className="space-y-3 rounded-card border border-line-soft bg-surface-1 p-4"
    >
      <h3 className="type-eyebrow flex items-center gap-2">
        <Icon
          className={isDo ? "size-4 text-emerald-700 dark:text-emerald-400" : "size-4 text-rose-700 dark:text-rose-400"}
          weight="bold"
          aria-hidden="true"
        />
        {isDo ? "Do" : "Don't"}
      </h3>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="type-body max-w-[68ch] space-y-2">
            <p>{item.text}</p>
            {item.code ? (
              <pre className="overflow-x-auto rounded-md border border-line-soft bg-surface-well p-3 type-code">
                <code>{item.code}</code>
              </pre>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Two-column flat do and don't cards. */
export function DoDont({ dos, donts }: { dos: DoDontItem[]; donts: DoDontItem[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Column kind="do" items={dos} />
      <Column kind="dont" items={donts} />
    </div>
  )
}
