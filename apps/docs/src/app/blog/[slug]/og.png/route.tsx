import { getAllPosts, getPost } from "@/lib/blog"
import { renderOgImage } from "@/lib/og-image"

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  return renderOgImage({ eyebrow: "Blog", title: post.title, subtitle: post.description })
}
