import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"

export type PostMeta = {
  slug: string
  title: string
  description: string
  /** ISO date, YYYY-MM-DD. */
  date: string
  tags: string[]
  author: string
  cover?: string
  /** Whole minutes, at least 1. */
  readingMinutes: number
}

const BLOG_DIR = join(process.cwd(), "src", "content", "blog")
const WORDS_PER_MINUTE = 220

/** Splits a leading `---` frontmatter block (single-line `key: value` pairs) from the body. */
export function parseFrontmatter(source: string): { data: Record<string, string>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source)
  if (!match) return { data: {}, body: source }
  const data: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const index = line.indexOf(":")
    if (index < 1) continue
    data[line.slice(0, index).trim()] = line.slice(index + 1).trim().replace(/^"(.*)"$/, "$1")
  }
  return { data, body: source.slice(match[0].length) }
}

export function estimateReadingMinutes(body: string) {
  const words = body.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

function toMeta(slug: string, source: string): PostMeta {
  const { data, body } = parseFrontmatter(source)
  for (const key of ["title", "description", "date", "author"]) {
    if (!data[key]) throw new Error(`[blog] ${slug}.mdx is missing frontmatter "${key}"`)
  }
  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    tags: (data.tags ?? "").replace(/^\[|\]$/g, "").split(",").map((tag) => tag.trim()).filter(Boolean),
    author: data.author,
    cover: data.cover || undefined,
    readingMinutes: estimateReadingMinutes(body)
  }
}

/** All posts, newest first. Read at build time, so it works with `output: "export"`. */
export function getAllPosts(): PostMeta[] {
  return readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => toMeta(file.replace(/\.mdx$/, ""), readFileSync(join(BLOG_DIR, file), "utf8")))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)))
}

export function getPost(slug: string): PostMeta {
  const post = getAllPosts().find((item) => item.slug === slug)
  if (!post) throw new Error(`[blog] unknown post: ${slug}`)
  return post
}

export function getAdjacentPosts(slug: string): { newer: PostMeta | null; older: PostMeta | null } {
  const posts = getAllPosts()
  const index = posts.findIndex((post) => post.slug === slug)
  return { newer: index > 0 ? posts[index - 1] : null, older: index >= 0 && index < posts.length - 1 ? posts[index + 1] : null }
}

export function formatPostDate(date: string) {
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`))
}
