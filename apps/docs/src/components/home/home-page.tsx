import { AiDocs } from "./ai-docs"
import { CompareTable } from "./compare-table"
import { CtaBand } from "./cta-band"
import { GalleryTeaser } from "./gallery-teaser"
import { HomeHero } from "./home-hero"
import { Pillars } from "./pillars"
import { StackStrip } from "./stack-strip"
import { TokensSection } from "./tokens-section"

export default function HomePage() {
  return (
    <div className="w-full">
      <HomeHero />
      <StackStrip />
      <Pillars />
      <GalleryTeaser />
      <AiDocs />
      <TokensSection />
      <CompareTable />
      <CtaBand />
    </div>
  )
}
