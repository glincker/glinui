import { AiDocs } from "./ai-docs"
import { CompareTable } from "./compare-table"
import { CtaBand } from "./cta-band"
import { GalleryTeaser } from "./gallery-teaser"
import { Ecosystem, Faq } from "./ecosystem-faq"
import { HomeHero } from "./home-hero"
import { HowItWorks } from "./how-it-works"
import { LivePlayground } from "./live-playground"
import { Pillars } from "./pillars"
import { StackStrip } from "./stack-strip"
import { TokensSection } from "./tokens-section"

export default function HomePage() {
  return (
    <div className="w-full">
      <HomeHero />
      <LivePlayground />
      <StackStrip />
      <Pillars />
      <GalleryTeaser />
      <HowItWorks />
      <AiDocs />
      <TokensSection />
      <CompareTable />
      <Ecosystem />
      <Faq />
      <CtaBand />
    </div>
  )
}
