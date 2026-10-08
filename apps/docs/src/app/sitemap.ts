import type { MetadataRoute } from "next"
import { existsSync, statSync } from "node:fs"
import { join } from "node:path"

import { generatedRegistryItems } from "@/lib/generated-registry-metadata"
import { DEFAULT_DOCS_IMPLEMENTATION } from "@/lib/docs-config"
import { SITE_URL } from "@/lib/seo"

export const dynamic = "force-static"

const staticRoutes = [
  { route: "/", file: "src/app/page.tsx", changeFrequency: "weekly", priority: 1 },
  { route: "/docs", file: "src/app/docs/page.tsx", changeFrequency: "weekly", priority: 0.9 },
  { route: "/docs/getting-started", file: "src/app/docs/getting-started/page.tsx", changeFrequency: "monthly", priority: 0.88 },
  { route: "/docs/components", file: "src/app/docs/components/page.tsx", changeFrequency: "weekly", priority: 0.9 },
  { route: "/docs/directory", file: "src/app/docs/directory/page.tsx", changeFrequency: "weekly", priority: 0.86 },
  { route: "/docs/shadcn-alternative", file: "src/app/docs/shadcn-alternative/page.tsx", changeFrequency: "monthly", priority: 0.85 },
  { route: "/docs/magicui-alternative", file: "src/app/docs/magicui-alternative/page.tsx", changeFrequency: "monthly", priority: 0.84 },
  { route: "/docs/radix-ui-components", file: "src/app/docs/radix-ui-components/page.tsx", changeFrequency: "monthly", priority: 0.84 },
  { route: "/docs/glassmorphism-react-components", file: "src/app/docs/glassmorphism-react-components/page.tsx", changeFrequency: "monthly", priority: 0.84 },
  { route: "/docs/accessibility", file: "src/app/docs/accessibility/page.tsx", changeFrequency: "monthly", priority: 0.82 },
  { route: "/docs/forms-accessibility", file: "src/app/docs/forms-accessibility/page.tsx", changeFrequency: "monthly", priority: 0.82 },
  { route: "/docs/forms-recipes", file: "src/app/docs/forms-recipes/page.tsx", changeFrequency: "monthly", priority: 0.82 },
  { route: "/docs/screen-reader-testing", file: "src/app/docs/screen-reader-testing/page.tsx", changeFrequency: "monthly", priority: 0.8 },
  { route: "/docs/focus-management", file: "src/app/docs/focus-management/page.tsx", changeFrequency: "monthly", priority: 0.8 },
  { route: "/docs/color-contrast", file: "src/app/docs/color-contrast/page.tsx", changeFrequency: "monthly", priority: 0.8 },
  { route: "/docs/animations", file: "src/app/docs/animations/page.tsx", changeFrequency: "weekly", priority: 0.85 },
  { route: "/docs/colors", file: "src/app/docs/colors/page.tsx", changeFrequency: "weekly", priority: 0.85 },
  { route: "/docs/tokens", file: "src/app/docs/tokens/page.tsx", changeFrequency: "monthly", priority: 0.78 },
  { route: "/docs/motion", file: "src/app/docs/motion/page.tsx", changeFrequency: "monthly", priority: 0.78 },
  { route: "/docs/engines", file: "src/app/docs/engines/page.tsx", changeFrequency: "weekly", priority: 0.8 },
  { route: "/docs/glass-physics", file: "src/app/docs/glass-physics/page.tsx", changeFrequency: "monthly", priority: 0.78 },
  { route: "/docs/api-metadata", file: "src/app/docs/api-metadata/page.tsx", changeFrequency: "monthly", priority: 0.78 },
  { route: "/docs/ai", file: "src/app/docs/ai/page.tsx", changeFrequency: "monthly", priority: 0.8 },
  { route: "/docs/variants", file: "src/app/docs/variants/page.tsx", changeFrequency: "monthly", priority: 0.78 },
  { route: "/docs/attribution", file: "src/app/docs/attribution/page.tsx", changeFrequency: "monthly", priority: 0.7 },
  { route: "/docs/free-forever", file: "src/app/docs/free-forever/page.tsx", changeFrequency: "monthly", priority: 0.7 }
] as const

function resolveLastModified(relativeFilePath: string, fallback: Date) {
  const absolutePath = join(process.cwd(), relativeFilePath)
  if (!existsSync(absolutePath)) {
    return fallback
  }
  return statSync(absolutePath).mtime
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

  for (const item of generatedRegistryItems) {
    const route =
      item.type === "signature"
        ? item.docsPath
        : `/docs/components/${DEFAULT_DOCS_IMPLEMENTATION}/${item.name}`

    if (seen.has(route)) {
      continue
    }

    seen.add(route)
    const docsFilePath =
      item.type === "signature" ? join(process.cwd(), `src/app${item.docsPath}/page.mdx`) : null
    const fallbackFilePath = join(process.cwd(), "src/app/docs/components/[implementation]/[component]/page.tsx")
    const lastModified = docsFilePath && existsSync(docsFilePath)
      ? statSync(docsFilePath).mtime
      : existsSync(fallbackFilePath)
        ? statSync(fallbackFilePath).mtime
        : buildTime

    urls.push({
      url: `${SITE_URL}${route}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.75
    })
  }

  return urls
}
