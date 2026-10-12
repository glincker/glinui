import { CodeBlock } from "@/components/docs/code-block"
import { DocSection } from "@/components/docs-pages/page-header"

const typeRoles = [
  ["Display", "--glinr-font-display", "Light weight via --glinr-display-weight, tight leading and tracking."],
  ["Eyebrow", "--glinr-font-eyebrow", "Mono, uppercase, 12px, --glinr-type-tracking-eyebrow."],
  ["Lede", "--glinr-font-body", "--glinr-type-size-lg in the muted foreground."],
  ["Numbers", "--glinr-font-eyebrow or body", "Apply --glinr-type-numeric-features so digits align in tables and meters."]
] as const

const elevation = [
  ["--glinr-elev-header", "Sticky header once content scrolls under it."],
  ["--glinr-elev-card", "Resting cards and panels."],
  ["--glinr-elev-popover", "Menus, selects and popovers."],
  ["--glinr-elev-dialog", "Modal dialogs and sheets."]
] as const

const usage = `import "@glinui/tokens/glinr.css"        /* --glinr-* variables, light and dark */
import "@glinui/tokens/glinr-theme.css"  /* Tailwind v4 @theme inline mapping */

/* or read the framework neutral source */
import source from "@glinui/tokens/glinr.tokens.json"`

const addToken = `{
  "space": {
    "5": {
      "$value": "1.25rem",
      "$description": "Gap between a label and its control group.",
      "$extensions": { "glinr": { "stability": "experimental", "tailwind": "spacing-glinr-5" } }
    }
  }
}`

function Table({ head, rows }: { head: readonly string[]; rows: readonly (readonly string[])[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border">
            {head.map((h) => (
              <th key={h} className="px-3 py-2 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-b border-border last:border-b-0">
              {row.map((cell, i) => (
                <td key={cell} className={i === 0 ? "px-3 py-2 font-mono text-xs" : "px-3 py-2"}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function GlinrTokensSection() {
  return (
    <DocSection
      id="glinr"
      title="GLINR design tokens"
      description="A framework neutral token set (61 tokens, light and dark) that ships beside the Glin UI theme. Flat and tokenized by default. Variables are namespaced --glinr-*, so they never collide with the Glin UI theme."
    >
      <div className="space-y-6">
        <CodeBlock language="ts" code={usage} />

        <div className="space-y-2">
          <h3 className="text-base font-medium">Naming rules</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>
              Variables are <code className="type-code">--glinr-&lt;group&gt;-&lt;name&gt;</code>, for example{" "}
              <code className="type-code">--glinr-color-fg</code> or <code className="type-code">--glinr-space-4</code>.
            </li>
            <li>Names that predate the groups are pinned with the glinr name extension. Never rename or remove one; add a token and migrate callers.</li>
            <li>Every token has a description and a stability of stable or experimental.</li>
            <li>A value is plain, a light and dark pair, or an alias such as {"{space.6}"}.</li>
            <li>The tailwind extension emits a utility under the glinr namespace, such as text-glinr-sm or bg-glinr-surface.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-medium">Type roles</h3>
          <Table head={["Role", "Family token", "Notes"]} rows={typeRoles} />
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-medium">Elevation scale</h3>
          <Table head={["Token", "Use"]} rows={elevation} />
          <p className="text-sm">
            Dark mode uses a deeper translucent shadow plus a 1px top highlight. There are no glow or gradient defaults; glass stays an
            opt-in variant.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-medium">Adding a token</h3>
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            <li>
              Add it to <code className="type-code">packages/tokens/glinr.tokens.json</code> with a value, a description and a stability
              (start experimental).
            </li>
            <li>Add the tailwind extension only if a utility is wanted.</li>
            <li>
              Run <code className="type-code">pnpm --filter @glinui/tokens glinr:build</code> and commit the regenerated CSS.
            </li>
          </ol>
          <CodeBlock language="json" code={addToken} />
        </div>

        <p className="text-sm">
          The JSON source has no CSS or Tailwind specifics beyond the optional extension, so any framework or native platform can generate
          its own output from it.
        </p>
      </div>
    </DocSection>
  )
}
