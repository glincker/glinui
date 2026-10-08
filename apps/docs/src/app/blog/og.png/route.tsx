import { renderOgImage } from "@/lib/og-image"

export const dynamic = "force-static"

export function GET() {
  return renderOgImage({ eyebrow: "Blog", title: "Glin UI blog", subtitle: "Release notes and design notes from the Glin UI team." })
}
