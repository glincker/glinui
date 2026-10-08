import { DEFAULT_GLIN_CONFIG, GLIN_ATTRIBUTES, type GlinConfig } from "@glinui/ui"

/** `surface` is a deprecated alias of `style` and is not exported. */
const KEYS = (Object.keys(DEFAULT_GLIN_CONFIG) as Array<keyof GlinConfig>).filter((key) => key !== "surface")

function changed(config: GlinConfig): Array<keyof GlinConfig> {
  return KEYS.filter((key) => config[key] !== DEFAULT_GLIN_CONFIG[key])
}

function registerImports(config: GlinConfig): string {
  if (config.engine === "css") return ""
  return `import "@glinui/motion/register/${config.engine}"\n`
}

function registerNote(config: GlinConfig): string {
  return config.engine === "css"
    ? 'The css engine is built in. To use another engine, add an opt-in import: import "@glinui/motion/register/motion" or import "@glinui/motion/register/gsap".'
    : `The ${config.engine} engine is opt-in: import "@glinui/motion/register/${config.engine}" once (client side) and install its library. Without it the css engine is used.`
}

export function toReactSnippet(config: GlinConfig): string {
  const diff = changed(config)
  const open =
    diff.length === 0
      ? "<GlinProvider>"
      : `<GlinProvider\n  defaults={{ ${diff.map((key) => `${key}: "${config[key]}"`).join(", ")} }}\n>`
  return `import { GlinProvider } from "@glinui/ui"\nimport "@glinui/tokens/preferences.css"\n${registerImports(config)}\nexport function Providers({ children }: { children: React.ReactNode }) {\n  return (\n    ${open.replace(/\n/g, "\n    ")}\n      {children}\n    </GlinProvider>\n  )\n}\n`
}

export function toCssSnippet(config: GlinConfig): string {
  const attrs = KEYS.map((key) => `${GLIN_ATTRIBUTES[key]}="${config[key]}"`).join(" ")
  return `<!-- 1. Import the preference styles once -->\n@import "@glinui/tokens/preferences.css";\n\n<!-- 2. Set the attributes on <html> (or any wrapper) -->\n<html ${attrs}>\n\n<!-- Engine "${config.engine}": ${registerNote(config)} -->\n\n/* 3. Override any token yourself */\n:root[data-glin-accent="${config.accent}"] {\n  --radius-card: 0.75rem;\n}\n`
}

export function toAiPrompt(config: GlinConfig): string {
  const lines = KEYS.map((key) => `- ${key}: ${config[key]}`).join("\n")
  return `Set up Glin UI preferences in my project.\n\nInstall @glinui/ui and @glinui/tokens, import "@glinui/tokens/preferences.css" after theme.css, and wrap the app in <GlinProvider target="document" storageKey="glin-options" defaults={...}> with these choices:\n${lines}\n\n${registerNote(config)} Register it before any Reveal, SplitText, CountUp or StaggerList mounts.\n\nAlso inject getGlinConfigScript("glin-options") in <head> so the saved choice applies before first paint. Icons use Phosphor, and GlinProvider already feeds weight and size to every Phosphor icon.`
}
