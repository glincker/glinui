/**
 * Single source of truth for footer links. Every external URL below was verified
 * against a sibling repo README, package.json or existing site config.
 * Unverified domains fall back to the verified GitHub repo URL.
 */
/** Icon keys resolved in components/layout/footer-icon.tsx. Brand keys must exist in the thesvg set (brands.ts). */
export type SiteIconKey =
  | "brand:github"
  | "brand:npm"
  | "own:theauth"
  | "own:thesvg"
  | "own:levelrail"
  | "own:glinr"
  | "ph:user"
  | "ph:globe"
  | "ph:discussions"
  | "ph:issues"
export type SiteLink = { href: string; label: string; external?: boolean; icon?: SiteIconKey }
export type SiteLinkGroup = { id: string; title: string; links: readonly SiteLink[] }

export const REPO_URL = "https://github.com/GLINCKER/glinui"

export const CONTRIBUTING_URL = "https://github.com/glincker/glinui/blob/main/CONTRIBUTING.md"

export const productLinks: SiteLinkGroup = {
  id: "product",
  title: "Product",
  links: [
    { href: "/docs/components", label: "Components" },
    { href: "/docs/blocks", label: "Blocks" },
    { href: "/gallery", label: "Gallery" },
    { href: "/docs/animations", label: "Animations" },
    { href: "/docs/colors", label: "Colors" },
    { href: "/docs/tokens", label: "Tokens" },
    { href: "/docs/variants", label: "Variants" },
    { href: "/docs/motion", label: "Motion" },
    { href: "/docs/engines", label: "Engines" }
  ]
}

export const docsLinks: SiteLinkGroup = {
  id: "docs",
  title: "Docs",
  links: [
    { href: "/docs/getting-started", label: "Getting started" },
    { href: "/docs/getting-started#framework-setup", label: "Installation" },
    { href: "/docs/getting-started#registry-workflow", label: "CLI and registry" },
    { href: "/docs/ai", label: "AI-ready docs" },
    { href: "/llms.txt", label: "llms.txt" },
    { href: "/docs/api-metadata", label: "API metadata" },
    { href: "/docs/accessibility", label: "Accessibility" },
    { href: "/docs/color-contrast", label: "Color contrast" }
  ]
}

export const resourceLinks: SiteLinkGroup = {
  id: "resources",
  title: "Resources",
  links: [
    { href: "/blog", label: "Blog" },
    { href: "/roadmap", label: "Roadmap" },
    { href: "/changelog", label: "Changelog" },
    { href: `${REPO_URL}/releases`, label: "Releases", external: true },
    { href: "/docs/attribution", label: "Attribution" },
    { href: "/docs/free-forever", label: "Free forever" },
    { href: "/docs/directory", label: "Directory" },
    { href: "/docs/shadcn-alternative", label: "Glin UI vs shadcn/ui" },
    { href: "/docs/magicui-alternative", label: "Glin UI vs Magic UI" },
    { href: "/docs/radix-ui-components", label: "Radix UI components" }
  ]
}

export const communityLinks: SiteLinkGroup = {
  id: "community",
  title: "Community",
  links: [
    { href: REPO_URL, label: "GitHub", external: true, icon: "brand:github" },
    { href: `${REPO_URL}/discussions`, label: "Discussions", external: true, icon: "ph:discussions" },
    { href: `${REPO_URL}/issues`, label: "Issues", external: true, icon: "ph:issues" },
    { href: CONTRIBUTING_URL, label: "Contributing", external: true },
    { href: "https://www.npmjs.com/package/@glinui/ui", label: "npm", external: true, icon: "brand:npm" }
  ]
}

export const footerGroups: readonly SiteLinkGroup[] = [productLinks, docsLinks, resourceLinks, communityLinks]

export type EcosystemLink = SiteLink & { description: string }

export const ecosystemLinks: readonly EcosystemLink[] = [
  { href: "https://github.com/glincker/theauth", label: "theauth", description: "Auth blocks and tokens", external: true, icon: "own:theauth" },
  { href: "https://thesvg.org", label: "thesvg", description: "Brand icons used by BrandIcon", external: true, icon: "own:thesvg" },
  { href: "https://levelrail.com", label: "levelrail", description: "Product by GLINCKER", external: true, icon: "own:levelrail" },
  { href: "https://glinr.com", label: "GLINR", description: "The GLINR platform", external: true, icon: "own:glinr" },
  { href: "https://github.com/thegdsks", label: "thegdsks", description: "Founder on GitHub", external: true, icon: "ph:user" },
  { href: "https://thegdsks.com", label: "thegdsks.com", description: "Founder site", external: true, icon: "ph:globe" }
]

export const GLINCKER_URL = "https://glincker.com"
export const FREE_FOREVER_HREF = "/docs/free-forever"
export const LICENSE_URL = `${REPO_URL}/blob/main/LICENSE`

export const bottomLinks: readonly SiteLink[] = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/sitemap.xml", label: "Sitemap" },
  { href: "/blog/rss.xml", label: "RSS" },
  { href: "/llms.txt", label: "llms.txt" }
]

export const allFooterLinks: readonly SiteLink[] = [
  ...footerGroups.flatMap((group) => group.links),
  ...ecosystemLinks,
  ...bottomLinks
]
