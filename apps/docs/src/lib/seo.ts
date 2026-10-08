import { allComponentIds } from "@/lib/primitives"

const FALLBACK_SITE_URL = "https://glinui.com"

function normalizeSiteUrl(value?: string) {
  if (!value) return FALLBACK_SITE_URL
  const trimmed = value.trim()
  if (!trimmed) return FALLBACK_SITE_URL
  return trimmed.replace(/\/+$/g, "")
}

export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)
export const SITE_NAME = "Glin UI"
export const SITE_TITLE = "Glin UI: React Components, Animations, Colors and Design Tokens"
/** Component count rounded down to the nearest ten, for copy such as "120+ components". */
export const COMPONENT_COUNT_LABEL = `${Math.floor(allComponentIds.length / 10) * 10}+`
export const SITE_DESCRIPTION =
  `Design modern UI for the modern web: ${COMPONENT_COUNT_LABEL} accessible React components, free animations, OKLCH colors, design tokens and copy-for-AI prompts. Radix, Tailwind, MIT.`
export const SITE_LOCALE = "en_US"
export const ORGANIZATION_NAME = "GLINR STUDIO"
export const ORGANIZATION_HANDLE = "@glincker"
export const ORGANIZATION_GITHUB_URL = "https://github.com/GLINCKER/glinui"
export const DEFAULT_OG_IMAGE_PATH = "/og.png"
export const DEFAULT_KEYWORDS = [
  "react component library",
  "design system for react",
  "animated react components",
  "ai ready ui components",
  "shadcn alternative",
  "next.js ui components",
  "glassmorphism",
  "liquid glass ui",
  "radix ui components",
  "radix ui react components",
  "tailwind css components",
  "typescript design system",
  "accessible ui components",
  "motion design system",
  "frontend ui toolkit",
  "shadcn ui alternative",
  "magic ui alternative",
  "glassmorphism react components",
  "react ui library"
]

export function createAbsoluteUrl(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`
  return `${SITE_URL}${normalized}`
}

export function isLocalSiteUrl(url: string) {
  return /localhost|127\.0\.0\.1/.test(url)
}

/** Shown on /privacy and /terms and used as their sitemap lastmod. Update when the copy changes. */
export const LEGAL_LAST_UPDATED = "2026-10-07"
export const ISSUES_URL = "https://github.com/GLINCKER/glinui/issues"
