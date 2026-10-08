import type { Metadata } from "next"
import Link from "next/link"

import { PageHeader } from "@/components/docs-pages-b/page-header"
import { TagList } from "@/components/blog/tag-chip"
import { formatPostDate, getAllPosts } from "@/lib/blog"
import { createDocsMetadata } from "@/lib/docs-metadata"
import { SITE_NAME, createAbsoluteUrl } from "@/lib/seo"

const BLOG_DESCRIPTION = "Release notes and design notes from Glin UI, the free and open-source design hub for the modern web."

export const metadata: Metadata = {
  ...createDocsMetadata({
    title: "Blog",
    description: BLOG_DESCRIPTION,
    path: "/blog",
    keywords: ["glin ui blog", "release notes", "design system updates"],
    imagePath: "/blog/og.png"
  }),
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/blog/rss.xml" }
  }
}

export default function BlogIndexPage() {
  const posts = getAllPosts()
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        name: `${SITE_NAME} blog`,
        url: createAbsoluteUrl("/blog"),
        description: BLOG_DESCRIPTION,
        blogPost: posts.map((post) => ({
          "@type": "BlogPosting",
          headline: post.title,
          datePublished: post.date,
          url: createAbsoluteUrl(`/blog/${post.slug}`)
        }))
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: createAbsoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Blog", item: createAbsoluteUrl("/blog") }
        ]
      }
    ]
  }

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        eyebrow="Blog"
        title="Glin UI blog"
        lead="Release notes and design notes. Newest first."
        actions={
          <Link
            href="/blog/rss.xml"
            className="inline-flex min-h-11 items-center rounded-input border border-line-soft px-4 text-sm font-medium hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            RSS feed
          </Link>
        }
      />
      <ul className="grid gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <li key={post.slug} className="relative flex flex-col gap-3 rounded-card border border-line-soft bg-surface-1 p-5 focus-within:ring-2 focus-within:ring-[var(--color-accent)]">
            <p className="type-caption text-muted">
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              <span aria-hidden="true"> / </span>
              {post.readingMinutes} min read
            </p>
            <h2 className="type-h3">
              <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
                {post.title}
              </Link>
            </h2>
            <p className="type-body text-muted">{post.description}</p>
            <TagList tags={post.tags} />
          </li>
        ))}
      </ul>
    </div>
  )
}
