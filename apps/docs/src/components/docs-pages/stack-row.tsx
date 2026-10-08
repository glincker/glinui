import { BrandIcon } from "@/components/brand/brand-icon"
import { BRAND_FOOTNOTE } from "@/components/brand/brands"
import { frameworkSetups } from "@/components/docs-pages/getting-started-data"

/** "Works with your stack": each logo jumps to the matching framework tab (hash `#fw-tab-<key>`). */
export function StackRow() {
  return (
    <section aria-labelledby="works-with-heading" className="space-y-3">
      <h2 id="works-with-heading" className="type-eyebrow">
        Works with your stack
      </h2>
      <ul className="flex flex-wrap gap-2.5">
        {frameworkSetups.map((setup) => (
          <li key={setup.key}>
            <a
              href={`#fw-tab-${setup.key}`}
              className="group/brand flex items-center gap-3 rounded-card border border-line-soft bg-surface-1 py-2.5 pl-3 pr-4 text-sm font-medium shadow-elev-1 transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand motion-reduce:transition-none"
            >
              <BrandIcon name={setup.brand} size={28} />
              {setup.label}
            </a>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted">{BRAND_FOOTNOTE}</p>
    </section>
  )
}
