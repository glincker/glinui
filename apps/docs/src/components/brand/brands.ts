/**
 * Registry of brand marks used across the docs. Every slug maps to a module in the
 * `thesvg` package (https://thesvg.org, MIT). Keep this file free of imports so
 * tests can load it directly.
 *
 * Brand marks belong to their owners and are shown for compatibility.
 */

export type BrandName =
  | "nextjs"
  | "vite"
  | "remix"
  | "react-router"
  | "astro"
  | "tanstack"
  | "react"
  | "typescript"
  | "tailwindcss"
  | "radix-ui"
  | "shadcn-ui"
  | "magic-ui"
  | "npm"
  | "pnpm"
  | "yarn"
  | "bun"
  | "github"
  | "vercel"
  | "cloudflare"
  | "nuxt"
  | "motion"
  | "gsap"
  | "css3"
  | "claude"
  | "openai"
  | "cursor"
  | "v0"
  | "windsurf"
  | "github-copilot"
  | "gemini"
  | "grok"
  | "perplexity"
  | "codex"

export type BrandMeta = {
  /** thesvg module slug, imported as `thesvg/<slug>`. */
  slug: BrandName
  label: string
  url: string
  /**
   * The default mark is dark or low contrast on a dark background and thesvg ships no
   * light/dark variants for it. BrandIcon draws a soft light tile behind it in dark mode.
   */
  needsTile?: boolean
}

export const BRANDS: Record<BrandName, BrandMeta> = {
  nextjs: { slug: "nextjs", label: "Next.js", url: "https://nextjs.org", needsTile: true },
  vite: { slug: "vite", label: "Vite", url: "https://vite.dev" },
  remix: { slug: "remix", label: "Remix", url: "https://remix.run" },
  "react-router": { slug: "react-router", label: "React Router", url: "https://reactrouter.com", needsTile: true },
  astro: { slug: "astro", label: "Astro", url: "https://astro.build" },
  tanstack: { slug: "tanstack", label: "TanStack", url: "https://tanstack.com" },
  react: { slug: "react", label: "React", url: "https://react.dev" },
  typescript: { slug: "typescript", label: "TypeScript", url: "https://www.typescriptlang.org" },
  tailwindcss: { slug: "tailwindcss", label: "Tailwind CSS", url: "https://tailwindcss.com" },
  "radix-ui": { slug: "radix-ui", label: "Radix UI", url: "https://www.radix-ui.com" },
  "shadcn-ui": { slug: "shadcn-ui", label: "shadcn/ui", url: "https://ui.shadcn.com" },
  "magic-ui": { slug: "magic-ui", label: "Magic UI", url: "https://magicui.design" },
  npm: { slug: "npm", label: "npm", url: "https://www.npmjs.com" },
  pnpm: { slug: "pnpm", label: "pnpm", url: "https://pnpm.io" },
  yarn: { slug: "yarn", label: "Yarn", url: "https://yarnpkg.com" },
  bun: { slug: "bun", label: "Bun", url: "https://bun.sh" },
  github: { slug: "github", label: "GitHub", url: "https://github.com" },
  vercel: { slug: "vercel", label: "Vercel", url: "https://vercel.com" },
  cloudflare: { slug: "cloudflare", label: "Cloudflare", url: "https://www.cloudflare.com" },
  nuxt: { slug: "nuxt", label: "Nuxt", url: "https://nuxt.com" },
  motion: { slug: "motion", label: "Motion", url: "https://motion.dev" },
  gsap: { slug: "gsap", label: "GSAP", url: "https://gsap.com" },
  css3: { slug: "css3", label: "CSS", url: "https://developer.mozilla.org/docs/Web/CSS" },
  claude: { slug: "claude", label: "Claude", url: "https://claude.ai" },
  openai: { slug: "openai", label: "ChatGPT", url: "https://chatgpt.com" },
  cursor: { slug: "cursor", label: "Cursor", url: "https://cursor.com" },
  v0: { slug: "v0", label: "v0", url: "https://v0.dev" },
  windsurf: { slug: "windsurf", label: "Windsurf", url: "https://windsurf.com" },
  "github-copilot": { slug: "github-copilot", label: "GitHub Copilot", url: "https://github.com/features/copilot" },
  gemini: { slug: "gemini", label: "Gemini", url: "https://gemini.google.com" },
  grok: { slug: "grok", label: "Grok", url: "https://grok.com" },
  perplexity: { slug: "perplexity", label: "Perplexity", url: "https://www.perplexity.ai" },
  codex: { slug: "codex", label: "Codex", url: "https://chatgpt.com/codex" }
}

export const BRAND_NAMES = Object.keys(BRANDS) as BrandName[]

export const BRAND_FOOTNOTE = "Brand marks belong to their owners and are shown for compatibility, via thesvg.org."
