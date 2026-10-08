/**
 * Static, per-slug imports from `thesvg` (never the index barrel), so only the marks
 * listed here are bundled. thesvg exposes each icon as an SVG string plus variants.
 */
import b_nextjs from "thesvg/nextjs"
import b_vite from "thesvg/vite"
import b_remix from "thesvg/remix"
import b_react_router from "thesvg/react-router"
import b_astro from "thesvg/astro"
import b_tanstack from "thesvg/tanstack"
import b_react from "thesvg/react"
import b_typescript from "thesvg/typescript"
import b_tailwindcss from "thesvg/tailwindcss"
import b_radix_ui from "thesvg/radix-ui"
import b_shadcn_ui from "thesvg/shadcn-ui"
import b_magic_ui from "thesvg/magic-ui"
import b_npm from "thesvg/npm"
import b_pnpm from "thesvg/pnpm"
import b_yarn from "thesvg/yarn"
import b_bun from "thesvg/bun"
import b_github from "thesvg/github"
import b_vercel from "thesvg/vercel"
import b_cloudflare from "thesvg/cloudflare"
import b_nuxt from "thesvg/nuxt"
import b_motion from "thesvg/motion"
import b_gsap from "thesvg/gsap"
import b_css3 from "thesvg/css3"
import b_claude from "thesvg/claude"
import b_openai from "thesvg/openai"
import b_cursor from "thesvg/cursor"
import b_v0 from "thesvg/v0"
import b_windsurf from "thesvg/windsurf"
import b_github_copilot from "thesvg/github-copilot"
import b_gemini from "thesvg/gemini"
import b_grok from "thesvg/grok"
import b_perplexity from "thesvg/perplexity"
import b_codex from "thesvg/codex"

import type { BrandName } from "./brands"

export type RawBrandModule = {
  svg: string
  variants?: Record<string, string>
}

export const BRAND_MODULES: Record<BrandName, RawBrandModule> = {
  "nextjs": b_nextjs,
  "vite": b_vite,
  "remix": b_remix,
  "react-router": b_react_router,
  "astro": b_astro,
  "tanstack": b_tanstack,
  "react": b_react,
  "typescript": b_typescript,
  "tailwindcss": b_tailwindcss,
  "radix-ui": b_radix_ui,
  "shadcn-ui": b_shadcn_ui,
  "magic-ui": b_magic_ui,
  "npm": b_npm,
  "pnpm": b_pnpm,
  "yarn": b_yarn,
  "bun": b_bun,
  "github": b_github,
  "vercel": b_vercel,
  "cloudflare": b_cloudflare,
  "nuxt": b_nuxt,
  "motion": b_motion,
  "gsap": b_gsap,
  "css3": b_css3,
  "claude": b_claude,
  "openai": b_openai,
  "cursor": b_cursor,
  "v0": b_v0,
  "windsurf": b_windsurf,
  "github-copilot": b_github_copilot,
  "gemini": b_gemini,
  "grok": b_grok,
  "perplexity": b_perplexity,
  "codex": b_codex,
}
