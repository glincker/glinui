import type { MetadataRoute } from "next"
import { execFileSync } from "node:child_process"
import { existsSync, statSync } from "node:fs"
import { join } from "node:path"

import { generatedRegistryItems } from "@/lib/generated-registry-metadata"
import { DEFAULT_DOCS_IMPLEMENTATION } from "@/lib/docs-config"
import { getAllPosts } from "@/lib/blog"
import { LEGAL_LAST_UPDATED, SITE_URL } from "@/lib/seo"

export const dynamic = "force-static"

const staticRoutes = [
  { route: "/", file: "src/app/page.tsx", changeFrequency: "weekly", priority: 1 },
  { route: "/docs", file: "src/app/docs/page.tsx", changeFrequency: "weekly", priority: 0.8 },
  { route: "/docs/getting-started", file: "src/app/docs/getting-started/page.tsx", changeFrequency: "monthly", priority: 0.8 },
  { route: "/docs/components", file: "src/app/docs/components/page.tsx", changeFrequency: "weekly", priority: 0.8 },
  { route: "/docs/directory", file: "src/app/docs/directory/page.tsx", changeFrequency: "weekly", priority: 0.8 },
  { route: "/docs/shadcn-alternative", file: "src/app/docs/shadcn-alternative/page.tsx", changeFrequency: "monthly", priority: 0.8 },
  { route: "/docs/magicui-alternative", file: "src/app/docs/magicui-alternative/page.tsx", changeFrequency: "monthly", priority: 0.8 },
  { route: "/docs/radix-ui-components", file: "src/app/docs/radix-ui-components/page.tsx", changeFrequency: "monthly", priority: 0.8 },
  { route: "/docs/glassmorphism-react-components", file: "src/app/docs/glassmorphism-react-components/page.tsx", changeFrequency: "monthly", priority: 0.8 },
  { route: "/docs/accessibility", file: "src/app/docs/accessibility/page.tsx", changeFrequency: "monthly", priority: 0.8 },
  { route: "/docs/forms-accessibility", file: "src/app/docs/forms-accessibility/page.tsx", changeFrequency: "monthly", priority: 0.8 },
  { route: "/docs/forms-recipes", file: "src/app/docs/forms-recipes/page.tsx", changeFrequency: "monthly", priority: 0.8 },
  { route: "/docs/screen-reader-testing", file: "src/app/docs/screen-reader-testing/page.tsx", changeFrequency: "monthly", priority: 0.8 },
  { route: "/docs/focus-management", file: "src/app/docs/focus-management/page.tsx", changeFrequency: "monthly", priority: 0.8 },
  { route: "/docs/color-contrast", file: "src/app/docs/color-contrast/page.tsx", changeFrequency: "monthly", priority: 0.8 },
  { route: "/docs/animations", file: "src/app/docs/animations/page.tsx", changeFrequency: "weekly", priority: 0.8 },
  { route: "/docs/colors", file: "src/app/docs/colors/page.tsx", changeFrequency: "weekly", priority: 0.8 },
  { route: "/docs/tokens", file: "src/app/docs/tokens/page.tsx", changeFrequency: "monthly", priority: 0.8 },
  { route: "/docs/motion", file: "src/app/docs/motion/page.tsx", changeFrequency: "monthly", priority: 0.8 },
  { route: "/docs/engines", file: "src/app/docs/engines/page.tsx", changeFrequency: "weekly", priority: 0.8 },
  { route: "/docs/glass-physics", file: "src/app/docs/glass-physics/page.tsx", changeFrequency: "monthly", priority: 0.8 },
  { route: "/docs/api-metadata", file: "src/app/docs/api-metadata/page.tsx", changeFrequency: "monthly", priority: 0.8 },
  { route: "/docs/ai", file: "src/app/docs/ai/page.tsx", changeFrequency: "monthly", priority: 0.8 },
  { route: "/docs/variants", file: "src/app/docs/variants/page.tsx", changeFrequency: "monthly", priority: 0.8 },
  { route: "/docs/attribution", file: "src/app/docs/attribution/page.tsx", changeFrequency: "monthly", priority: 0.8 },
  { route: "/docs/free-forever", file: "src/app/docs/free-forever/page.tsx", changeFrequency: "monthly", priority: 0.8 }
] as const

/** Date of the latest commit touching the paths, so lastmod reflects content changes and not checkout time. */
function gitDate(paths: string[], fallback: Date) {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", ...paths], { cwd: process.cwd(), encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim()
    return out ? new Date(out) : fallback
  } catch {
    return fallback
  }
}

function resolveLastModified(relativeFilePath: string, fallback: Date) {
  const absolutePath = join(process.cwd(), relativeFilePath)
  if (!existsSync(absolutePath)) {
    return fallback
  }
  return gitDate([relativeFilePath], statSync(absolutePath).mtime)
}

export default function sitemap(): MetadataRoute.Sitemap {
  const buildTime = new Date()
  const urls: MetadataRoute.Sitemap = []
  const seen = new Set<string>()

  for (const { route, file, changeFrequency, priority } of staticRoutes) {
    seen.add(route)
    urls.push({
      url: `${SITE_URL}${route}`,
      lastModified: resolveLastModified(file, buildTime),
      changeFrequency,
      priority
    })
  }

  const componentsDate = gitDate(["../../packages/ui/src/components", "src/app/docs/components"], buildTime)

  for (const item of generatedRegistryItems) {
    const route =
      item.type === "signature"
        ? item.docsPath
        : `/docs/components/${DEFAULT_DOCS_IMPLEMENTATION}/${item.name}`

    if (seen.has(route)) {
      continue
    }

    seen.add(route)
    urls.push({
      url: `${SITE_URL}${route}`,
      lastModified: componentsDate,
      changeFrequency: "weekly",
      priority: 0.7
    })
  }

  for (const route of ["/docs/blocks", "/gallery", "/roadmap", "/changelog"]) {
    if (seen.has(route)) continue
    seen.add(route)
    urls.push({ url: `${SITE_URL}${route}`, lastModified: componentsDate, changeFrequency: "weekly", priority: 0.7 })
  }

  const posts = getAllPosts()
  urls.push({ url: `${SITE_URL}/blog`, lastModified: new Date(posts[0]?.date ?? buildTime), changeFrequency: "weekly", priority: 0.6 })
  for (const post of posts) {
    urls.push({ url: `${SITE_URL}/blog/${post.slug}`, lastModified: new Date(post.date), changeFrequency: "monthly", priority: 0.6 })
  }

  for (const route of ["/privacy", "/terms"]) {
    urls.push({ url: `${SITE_URL}${route}`, lastModified: new Date(LEGAL_LAST_UPDATED), changeFrequency: "yearly", priority: 0.3 })
  }

  return urls
}
