import { renderOgImage } from "@/lib/og-image"

export const dynamic = "force-static"

export function GET() {
  return renderOgImage({ subtitle: "React components, animations, OKLCH colors, design tokens and AI-ready docs. MIT." })
}
