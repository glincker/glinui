import { SECTION_CLASS, SectionHeading, Surface } from "./surface"
import { FAQ } from "./landing-facts"

const SIBLINGS = [
  { name: "theauth", text: "Source of the violet accent tones used across the tokens." },
  { name: "thesvg", text: "Provides the brand icons behind BrandIcon in this library." },
  { name: "levelrail", text: "A GLINCKER product. Adopting Glin UI there is planned, not shipped." }
]

export function Ecosystem() {
  return (
    <section aria-labelledby="eco-title" className={SECTION_CLASS}>
      <SectionHeading
        id="eco-title"
        eyebrow="Ecosystem"
        title="Built by GLINCKER, alongside its other products."
        lead="Glin UI is the shared design layer for our sibling projects. Some of that work is done, some is still in progress."
      />
      <ul className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-3">
        {SIBLINGS.map((s) => (
          <li key={s.name}>
            <Surface elevation={1} className="h-full space-y-2 p-6">
              <h3 className="type-h3">{s.name}</h3>
              <p className="text-sm text-[var(--color-muted)]">{s.text}</p>
            </Surface>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function Faq() {
  return (
    <section aria-labelledby="faq-title" className={SECTION_CLASS}>
      <SectionHeading id="faq-title" eyebrow="FAQ" title="Questions before you install." />
      <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-2">
        {FAQ.map((item) => (
          <Surface key={item.q} elevation={1} className="space-y-2 p-6">
            <h3 className="type-h3">{item.q}</h3>
            <p className="text-sm text-[var(--color-muted)]">{item.a}</p>
          </Surface>
        ))}
      </div>
    </section>
  )
}
