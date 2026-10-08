export type AiPromptInput = {
  title: string
  id: string
  registryCommand: string
  packageCommand: string
  importPath: string
  exampleCode: string
  /** Optional: public markdown page for this component. */
  markdownUrl?: string
  /** Adapted components: one line crediting the upstream project and license. */
  attribution?: string
}

const TOKEN_NOTES = [
  "Style with CSS variables from @glinui/tokens (for example var(--color-border), var(--color-accent), var(--surface-1)). Do not hardcode colors.",
  "Use Tailwind utility classes only. No inline style attributes.",
  "Use Phosphor icons (@phosphor-icons/react) for any icon.",
  "Animate only transform and opacity, and respect prefers-reduced-motion."
]

const VARIANT_NOTE =
  "Variant vocabulary: solid, soft, outline, ghost, gradient, glass. Prefer these names over inventing new ones."

/** Build a ready-to-paste prompt that asks an AI assistant to use a GLINUI component. */
export function buildAiPrompt(input: AiPromptInput): string {
  const { title, id, registryCommand, packageCommand, importPath, exampleCode } = input
  return [
    `Use the GLINUI ${title} component (id: ${id}) in my project.`,
    "",
    "Install (pick one):",
    `- Registry (copies source into your project): ${registryCommand}`,
    `- Package: ${packageCommand}`,
    "",
    `Import from "${importPath}".`,
    "",
    "Reference example:",
    "```tsx",
    exampleCode.trim(),
    "```",
    "",
    "Guidelines:",
    ...TOKEN_NOTES.map((note) => `- ${note}`),
    `- ${VARIANT_NOTE}`,
    ...(input.attribution ? [`- Attribution: ${input.attribution}`] : []),
    ...(input.markdownUrl ? ["", `Full reference: ${input.markdownUrl}`] : []),
    "",
    "Adapt the example to my use case and keep the accessibility behavior intact."
  ].join("\n")
}

/** Build a Markdown summary of a component page for copying. */
export function buildComponentMarkdown(
  input: AiPromptInput & { description: string }
): string {
  const { title, description, registryCommand, packageCommand, importPath, exampleCode } = input
  return [
    `# ${title}`,
    "",
    description,
    "",
    "## Installation",
    "",
    "```bash",
    registryCommand,
    "```",
    "",
    "Or install the package:",
    "",
    "```bash",
    packageCommand,
    "```",
    "",
    "## Usage",
    "",
    `Import from \`${importPath}\`.`,
    "",
    "```tsx",
    exampleCode.trim(),
    "```",
    ""
  ].join("\n")
}

export type ShortAiPromptInput = {
  title: string
  id: string
  /** Use buildMarkdownUrl(id, SITE_URL), or pass an override when the site URL is local. */
  markdownUrl: string
}

/** Public markdown URL for a component. */
export function buildMarkdownUrl(id: string, siteUrl: string): string {
  return `${siteUrl.replace(/\/+$/, "")}/md/${id}.md`
}

/**
 * Short prompt for deep links (kept under about 400 characters so URLs stay small).
 * It points the assistant at the public markdown page instead of embedding the docs.
 */
export function buildShortAiPrompt(input: ShortAiPromptInput): string {
  const url = input.markdownUrl
  return `Read ${url} and implement the GLINUI ${input.title} component in my project. Follow GLINUI conventions (tokens from @glinui/tokens, Tailwind only, Phosphor icons, honor reduced motion). Ask me before changing existing files.`
}
