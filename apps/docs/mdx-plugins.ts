type Node = {
  type?: string
  tagName?: string
  value?: string
  properties?: Record<string, unknown>
  children?: Node[]
}

export function rehypeSlugifyHeadings() {
  return (tree: Node) => {
    visit(tree, (node) => {
      if (node.type !== "element") return
      if (node.tagName !== "h1" && node.tagName !== "h2" && node.tagName !== "h3") return

      const text = getTextContent(node).trim()
      if (!text) return

      node.properties = node.properties ?? {}
      if (!node.properties.id) {
        node.properties.id = slugify(text)
      }
    })
  }
}

export function rehypeAutolinkHeadings() {
  return (tree: Node) => {
    visit(tree, (node) => {
      if (node.type !== "element") return
      if (node.tagName !== "h1" && node.tagName !== "h2" && node.tagName !== "h3") return

      const id = node.properties?.id
      if (typeof id !== "string" || !id) return

      const anchorNode: Node = {
        type: "element",
        tagName: "a",
        properties: {
          href: `#${id}`,
          "aria-label": "Link to section",
          className: ["docs-heading-anchor"],
          style: "opacity:0;position:absolute;right:0;top:50%;transform:translateY(-50%);"
        },
        children: [{ type: "text", value: "$" }]
      }

      node.children = [...(node.children ?? []), anchorNode]
    })
  }
}

function visit(node: Node, callback: (node: Node) => void) {
  callback(node)
  if (!node.children) return
  for (const child of node.children) {
    visit(child, callback)
  }
}

function getTextContent(node: Node): string {
  if (typeof node.value === "string") return node.value
  if (!node.children) return ""
  return node.children.map((child) => getTextContent(child)).join("")
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
}

/**
 * Blog posts start with a `---` frontmatter block that lib/blog.ts reads separately. MDX parses it as a
 * thematic break followed by a setext heading, so drop both nodes. Frontmatter values must stay on single lines.
 */
export function remarkStripFrontmatter() {
  return (tree: Node) => {
    const [first, second] = tree.children ?? []
    if (first?.type === "thematicBreak" && second?.type === "heading") {
      tree.children = (tree.children ?? []).slice(2)
    }
  }
}
