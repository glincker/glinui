/** Code strings for the Engine comparison examples. Plain module so MDX server pages can import it. */
const CODE: Record<string, (engine: string) => string> = {
  typewriter: (e) => `<Typewriter engine="${e}" text="Deploying to production" speed={40} loop />`,
  "number-ticker": (e) => `<NumberTicker engine="${e}" value={12480} />`,
  "blur-fade": (e) => `<BlurFade engine="${e}">\n  <Card className="p-3">Fades in from a blur</Card>\n</BlurFade>`,
  "text-reveal": (e) => `<TextReveal engine="${e}" mode="reveal" immediate text="Words arrive one after another." />`,
  "reveal-text": (e) => `<RevealText engine="${e}" text="Wipe reveal" triggerOnView={false} />`,
  "word-rotate": (e) => `<WordRotate engine="${e}" words={["fast", "calm", "yours"]} duration={1800} />`,
  "hyper-text": (e) => `<HyperText engine="${e}" trigger="mount">Scramble</HyperText>`,
  terminal: (e) => `<Terminal engine="${e}" startOnView={false}>\n  <TypingAnimation>pnpm add @glinui/ui</TypingAnimation>\n  <AnimatedSpan>Done in 2s</AnimatedSpan>\n</Terminal>`,
  "bento-grid": (e) => `<BentoGrid engine="${e}" entrance immediate>\n  <BentoCard name="Sync" description="Realtime edits." />\n  <BentoCard name="Audit" description="Every change." />\n</BentoGrid>`,
}

const ENGINE_IDS = ["css", "motion", "gsap"] as const

export function engineCompareCode(id: string): string {
  const code = CODE[id]
  if (!code) return ""
  return `// Same component, three engines. motion and gsap are opt-in:\n// import "@glinui/motion/register/motion"\n// import "@glinui/motion/register/gsap"\n${ENGINE_IDS.map((e) => code(e)).join("\n\n")}`
}
