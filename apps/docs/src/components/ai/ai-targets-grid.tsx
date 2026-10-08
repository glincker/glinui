import { BrandIcon } from "@/components/brand/brand-icon"
import { AI_TARGETS, aiTargetHint } from "@/lib/ai-targets"

/** Supported tools with logos and how each one receives the prompt. */
export function AiTargetsGrid() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {AI_TARGETS.map((target) => {
        const hint = aiTargetHint(target)
        return (
          <li key={target.id} className="flex items-center gap-3 rounded-card border border-line-soft bg-surface-1 p-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-2">
              {target.brandSlug ? <BrandIcon name={target.brandSlug} size={20} /> : <span aria-hidden="true" className="text-sm">AI</span>}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{target.label}</p>
              <p className="text-xs text-muted">
                <span className="rounded-full border border-line-soft px-2 py-0.5">{hint}</span>
                {target.verified ? null : <span className="ml-2">community link</span>}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
