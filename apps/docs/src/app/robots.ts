import type { MetadataRoute } from "next"

import { SITE_URL, isLocalSiteUrl } from "@/lib/seo"

export const dynamic = "force-static"

export const AI_CRAWLERS = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "Applebot-Extended", "CCBot"]

export default function robots(): MetadataRoute.Robots {
  const isLocal = isLocalSiteUrl(SITE_URL)

  return {
    rules: isLocal
      ? {
          userAgent: "*",
          disallow: "/"
        }
      : [
          {
            userAgent: "*",
            allow: "/",
            disallow: ["/r/", "/api/", "/_next/"]
          }
        ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL
  }
}
