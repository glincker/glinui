import { generatedApiMetadata, type GeneratedApiComponentEntry } from "@/lib/generated-api-metadata"
import type { ComponentId } from "@/lib/primitives"

type PropRow = {
  prop: string
  type?: string
  defaultValue?: string
  description?: string
}

type PropsTableProps = {
  rows?: PropRow[]
  componentId?: ComponentId | string
  propsType?: string
  autoAppendGenerated?: boolean
}

function resolveGeneratedEntry(componentId?: ComponentId | string) {
  if (!componentId) return null
  const apiMap = generatedApiMetadata as Record<string, GeneratedApiComponentEntry>
  return apiMap[componentId] ?? null
}

function resolveGeneratedFields(entry: GeneratedApiComponentEntry | null, propsType?: string) {
  if (!entry) {
    return []
  }

  const targetTypeName = propsType ?? entry.primaryPropsType
  if (targetTypeName) {
    const targetType = entry.propsTypes.find((candidate) => candidate.name === targetTypeName)
    if (targetType) {
      return [...targetType.fields]
    }
  }

  const fallbackType = entry.propsTypes[0]
  return fallbackType ? [...fallbackType.fields] : []
}

export function PropsTable({ rows = [], componentId, propsType, autoAppendGenerated = false }: PropsTableProps) {
  const generatedEntry = resolveGeneratedEntry(componentId)
  const generatedFields = resolveGeneratedFields(generatedEntry, propsType)
  const generatedFieldByName = new Map(generatedFields.map((field) => [field.name, field]))

  const mergedRows = rows.map((row) => {
    const generatedField = generatedFieldByName.get(row.prop)
    return {
      ...row,
      type: generatedField?.type ?? row.type ?? "unknown",
      defaultValue: row.defaultValue ?? generatedField?.defaultValue,
      description: row.description ?? generatedField?.description,
      required: generatedField ? !generatedField.optional : undefined
    }
  })

  if (autoAppendGenerated && generatedFields.length > 0) {
    const existingProps = new Set(mergedRows.map((row) => row.prop))
    for (const field of generatedFields) {
      if (existingProps.has(field.name)) {
        continue
      }

      mergedRows.push({
        prop: field.name,
        type: field.type,
        defaultValue: field.defaultValue,
        description: field.description ?? "Auto-generated from TypeScript source.",
        required: !field.optional
      })
    }
  }

  const hasRequiredColumn = mergedRows.some((row) => row.required !== undefined)

  return (
    <div className="overflow-x-auto rounded-xl border border-border/60">
      <table className="min-w-full border-collapse text-left text-[13px] leading-6 tabular-nums">
        <thead className="bg-black/5 dark:bg-white/5">
          <tr>
            <th scope="col" className="type-eyebrow px-3 py-2.5">Prop</th>
            <th scope="col" className="type-eyebrow px-3 py-2.5">Type</th>
            {hasRequiredColumn ? <th scope="col" className="type-eyebrow px-3 py-2.5">Required</th> : null}
            <th scope="col" className="type-eyebrow px-3 py-2.5">Default</th>
            <th scope="col" className="type-eyebrow px-3 py-2.5">Description</th>
          </tr>
        </thead>
        <tbody>
          {mergedRows.map((row) => (
            <tr key={row.prop} className="border-t border-border/60">
              <td className="px-3 py-2 align-top">
                <code className="font-mono text-[13px] text-foreground">{row.prop}</code>
              </td>
              <td className="px-3 py-2">
                <code className="font-mono text-[12px] text-[var(--color-muted)]">{row.type ?? "-"}</code>
              </td>
              {hasRequiredColumn ? <td className="px-3 py-2">{row.required === undefined ? "-" : row.required ? "Yes" : "No"}</td> : null}
              <td className="px-3 py-2">
                <code className="font-mono text-[12px] text-[var(--color-muted)]">{row.defaultValue ?? "-"}</code>
              </td>
              <td className="px-3 py-2">{row.description ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export type { PropRow }
