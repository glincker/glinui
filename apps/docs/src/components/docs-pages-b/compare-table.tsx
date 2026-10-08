import { Equals, Minus, Trophy } from "@phosphor-icons/react/dist/ssr"

export type Edge = "glin" | "other" | "even"
export type CompareRow = { feature: string; glin: string; other: string; edge: Edge }

function EdgeLabel({ edge, otherName }: { edge: Edge; otherName: string }) {
  if (edge === "even") {
    return (
      <span className="inline-flex items-center gap-1.5 text-muted">
        <Equals className="size-4" aria-hidden="true" />
        Even
      </span>
    )
  }
  const Icon = edge === "glin" ? Trophy : Minus
  return (
    <span className="inline-flex items-center gap-1.5 font-medium">
      <Icon className="size-4 text-accent" aria-hidden="true" />
      {edge === "glin" ? "Glin UI" : otherName}
    </span>
  )
}

/** Honest feature table. The Edge column states who is ahead on each row. */
export function CompareTable({ otherName, rows }: { otherName: string; rows: CompareRow[] }) {
  return (
    <div className="overflow-x-auto rounded-card border border-line-soft bg-surface-1">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <caption className="sr-only">Feature comparison of Glin UI and {otherName}</caption>
        <thead>
          <tr className="border-b border-line-soft">
            <th scope="col" className="type-eyebrow w-[18%] px-4 py-3 font-medium">Feature</th>
            <th scope="col" className="type-eyebrow w-[32%] px-4 py-3 font-medium">Glin UI</th>
            <th scope="col" className="type-eyebrow w-[32%] px-4 py-3 font-medium">{otherName}</th>
            <th scope="col" className="type-eyebrow w-[18%] px-4 py-3 font-medium">Ahead</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line-soft">
          {rows.map((row) => (
            <tr key={row.feature}>
              <th scope="row" className="px-4 py-3 align-top font-medium">{row.feature}</th>
              <td className="px-4 py-3 align-top text-muted">{row.glin}</td>
              <td className="px-4 py-3 align-top text-muted">{row.other}</td>
              <td className="px-4 py-3 align-top">
                <EdgeLabel edge={row.edge} otherName={otherName} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
