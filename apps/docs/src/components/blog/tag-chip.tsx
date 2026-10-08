export function TagChip({ tag }: { tag: string }) {
  return (
    <li className="rounded-full border border-line-soft bg-surface-2 px-2.5 py-0.5 type-caption text-muted">{tag}</li>
  )
}

export function TagList({ tags, label = "Tags" }: { tags: string[]; label?: string }) {
  if (tags.length === 0) return null
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <TagChip key={tag} tag={tag} />
      ))}
    </ul>
  )
}
