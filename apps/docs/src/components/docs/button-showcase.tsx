import { ArrowRight, CircleNotch, Sparkle } from "@phosphor-icons/react/dist/ssr"

import { Button } from "@glinui/ui"

/**
 * Gradient mesh backgrounds give glass/liquid buttons something to
 * blur against, just like Apple demos glass on colourful wallpapers.
 */
const meshBg = [
  // Light: neutral specular reflections.
  "bg-[radial-gradient(ellipse_at_22%_20%,rgb(255_255_255_/_0.9),transparent_55%),radial-gradient(ellipse_at_82%_78%,rgb(241_245_249_/_0.88),transparent_52%),linear-gradient(180deg,rgb(248_250_252),rgb(241_245_249))]",
  // Dark: deep monochrome glass with subtle white caustic highlights.
  "dark:bg-[radial-gradient(ellipse_at_18%_18%,rgb(255_255_255_/_0.08),transparent_54%),radial-gradient(ellipse_at_82%_80%,rgb(255_255_255_/_0.05),transparent_52%),linear-gradient(180deg,rgb(7_10_16_/_0.9),rgb(10_14_22_/_0.74))]"
].join(" ")

const card = `relative overflow-hidden rounded-2xl border border-black/[0.06] p-5 ${meshBg} shadow-[0_10px_24px_-20px_rgb(2_6_23_/_0.35)] dark:border-white/[0.1] dark:[box-shadow:0_0_0_1px_rgb(255_255_255_/_0.05)_inset,var(--shadow-soft)]`

const label = "font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted dark:text-neutral-400"

export function ButtonShowcase() {
  return (
    <div className="space-y-6">
      {/* Variants, hero section */}
      <div className={card}>
        <p className={label}>Variants</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Button>Default</Button>
          <Button variant="glass">Glass</Button>
          <Button variant="liquid">Liquid</Button>
          <Button variant="matte">Matte</Button>
          <Button variant="glow">Glow</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </div>

      {/* States */}
      <div className={card}>
        <p className={label}>States</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button>Default</Button>
          <Button className="ring-2 ring-black/40 ring-offset-2 ring-offset-transparent dark:ring-white/45">
            Focus
          </Button>
          <Button disabled>Disabled</Button>
          <Button variant="glass" className="hover:translate-y-0 motion-reduce:hover:translate-y-0">
            Calm
          </Button>
        </div>
      </div>

      {/* Sizes */}
      <div className={card}>
        <p className={label}>Sizes</p>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <Button size="sm" variant="glass">Small</Button>
          <Button size="md" variant="glass">Medium</Button>
          <Button size="lg" variant="glass">Large</Button>
        </div>
      </div>

      {/* Icon patterns */}
      <div className={card}>
        <p className={label}>With Icons</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button className="gap-2">
            <Sparkle className="size-4" />
            Generate
          </Button>
          <Button variant="liquid" className="gap-2">
            Continue
            <ArrowRight className="size-4" />
          </Button>
          <Button variant="outline" className="gap-2">
            <CircleNotch className="size-4 animate-spin motion-reduce:animate-none" />
            Processing
          </Button>
          <Button variant="glass" className="size-10 px-0" aria-label="Open actions">
            <Sparkle className="size-4" />
          </Button>
        </div>
      </div>

      {/* Compositions */}
      <div className={card}>
        <p className={label}>Compositions</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button className="rounded-full px-5">Pill</Button>
          <Button variant="liquid" className="rounded-2xl px-5">Liquid Pill</Button>
          <Button variant="matte" className="rounded-md">Matte</Button>
          <Button variant="glow" className="rounded-lg px-6">Glow CTA</Button>
        </div>
      </div>
    </div>
  )
}
