export type TocItem = {
  href: string
  label: string
  depth: 2 | 3
}

export type TocSection = {
  item: TocItem
  children: TocItem[]
}

export function buildSections(items: TocItem[]): TocSection[] {
  const sections: TocSection[] = []
  for (const item of items) {
    const current = sections[sections.length - 1]
    if (item.depth === 3 && current) {
      current.children.push(item)
    } else {
      sections.push({ item, children: [] })
    }
  }
  return sections
}

export function extractTocItems(selector: string): TocItem[] {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector))
  const result: TocItem[] = []
  for (const node of nodes) {
    if (!node.id) continue
    const label = node.textContent?.replace(/[#$]$/g, "").trim()
    if (!label) continue
    result.push({ href: `#${node.id}`, label, depth: node.tagName === "H3" ? 3 : 2 })
  }
  return result
}
