import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr"
import type { Metadata } from "next"
import Link from "next/link"
import type { ComponentType } from "react"

import { CopyLinkButton } from "@/components/blog/copy-link-button"
import { TagList } from "@/components/blog/tag-chip"
import { formatPostDate, getAdjacentPosts, getAllPosts, getPost } from "@/lib/blog"
import { createDocsMetadata } from "@/lib/docs-metadata"
import { ORGANIZATION_NAME, SITE_NAME, createAbsoluteUrl } from "@/lib/seo"

export const dynamicParams = false

type PageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  const base = createDocsMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${slug}`,
    keywords: post.tags,
    imagePath: post.cover ?? `/blog/${slug}/og.png`
  })
  return {
    ...base,
    authors: [{ name: post.author }],
    openGraph: { ...base.openGraph, type: "article", publishedTime: post.date, authors: [post.author], tags: post.tags }
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPost(slug)
  const { newer, older } = getAdjacentPosts(slug)
  const { default: Content } = (await import(`../../../content/blog/${slug}.mdx`)) as { default: ComponentType }
  const url = createAbsoluteUrl(`/blog/${slug}`)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        inLanguage: "en-US",
        keywords: post.tags.join(", "),
        mainEntityOfPage: url,
        url,
        image: createAbsoluteUrl(post.cover ?? `/blog/${slug}/og.png`),
        author: { "@type": "Organization", name: post.author === ORGANIZATION_NAME ? ORGANIZATION_NAME : post.author },
        publisher: { "@type": "Organization", name: ORGANIZATION_NAME, url: createAbsoluteUrl("/") }
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: createAbsoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Blog", item: createAbsoluteUrl("/blog") },
          { "@type": "ListItem", position: 3, name: post.title, item: url }
        ]
      }
    ]
  }

  const navLink =
    "group flex min-h-11 flex-1 flex-col gap-1 rounded-card border border-line-soft bg-surface-1 p-4 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"

  return (
    <article className="space-y-8">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="space-y-4 border-b border-line-soft pb-8">
        <nav aria-label="Breadcrumb">
          <Link href="/blog" className="inline-flex min-h-11 items-center gap-1.5 type-caption text-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]">
            <ArrowLeft className="size-3.5 rtl:rotate-180" aria-hidden="true" />
            All posts
          </Link>
        </nav>
        <h1 className="type-h1 max-w-[24ch] text-balance">{post.title}</h1>
        <p className="type-lead max-w-[60ch]">{post.description}</p>
        <p className="type-caption text-muted">
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          <span aria-hidden="true"> / </span>
          {post.readingMinutes} min read
          <span aria-hidden="true"> / </span>
          {post.author}
        </p>
        <TagList tags={post.tags} />
      </header>

      <div className="space-y-5">
        <Content />
      </div>

      <footer className="space-y-6 border-t border-line-soft pt-6">
        <CopyLinkButton url={url} />
        <nav aria-label="More posts" className="flex flex-col gap-3 sm:flex-row">
          {older ? (
            <Link href={`/blog/${older.slug}`} className={navLink} rel="prev">
              <span className="inline-flex items-center gap-1.5 type-caption text-muted">
                <ArrowLeft className="size-3.5 rtl:rotate-180" aria-hidden="true" />
                Previous
              </span>
              <span className="type-body font-medium">{older.title}</span>
            </Link>
          ) : null}
          {newer ? (
            <Link href={`/blog/${newer.slug}`} className={`${navLink} sm:text-end`} rel="next">
              <span className="inline-flex items-center gap-1.5 type-caption text-muted sm:justify-end">
                Next
                <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden="true" />
              </span>
              <span className="type-body font-medium">{newer.title}</span>
            </Link>
          ) : null}
        </nav>
      </footer>
    </article>
  )
}
