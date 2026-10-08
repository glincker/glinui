/**
 * Dependency free SVG sanitizer for third party brand marks. Brand SVGs come from the
 * `thesvg` package at build time, but they are still rendered as raw markup, so every
 * string is normalised here: no scripts, no event handlers, no style attributes, no
 * external references, ids and classes namespaced per mark.
 */

const ATTR_VALUE = String.raw`(?:"[^"]*"|'[^']*'|[^\s>]+)`

function stripAttr(markup: string, name: string): string {
  return markup.replace(new RegExp(String.raw`\s${name}\s*=\s*${ATTR_VALUE}`, "gi"), "")
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/** Removes everything dangerous or non-visual, without touching drawing instructions. */
function stripUnsafe(input: string): string {
  let out = input
    .replace(/<\?[\s\S]*?\?>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<!DOCTYPE[^>]*>/gi, "")
  for (const tag of ["script", "foreignObject", "title", "desc", "metadata", "image", "iframe", "object", "embed", "a", "animate", "set"]) {
    out = out.replace(new RegExp(String.raw`<${tag}\b[^>]*?/>`, "gi"), "")
    out = out.replace(new RegExp(String.raw`<${tag}\b[\s\S]*?</${tag}\s*>`, "gi"), "")
  }
  // Event handlers (onclick, onload, ...), style attributes, roles, external hrefs.
  out = out.replace(new RegExp(String.raw`\son[a-z]+\s*=\s*${ATTR_VALUE}`, "gi"), "")
  out = stripAttr(out, "style")
  out = stripAttr(out, "role")
  out = out.replace(new RegExp(String.raw`\s(?:xlink:)?href\s*=\s*(?!"#|'#)${ATTR_VALUE}`, "gi"), "")
  out = out.replace(/\s[\w:-]+\s*=\s*(?:"[^"]*javascript:[^"]*"|'[^']*javascript:[^']*')/gi, "")
  return out
}

/** Prefixes ids and class names so two different marks never collide on a page. */
function namespace(markup: string, prefix: string): string {
  let out = markup
  const ids = new Set<string>()
  for (const match of out.matchAll(/\sid\s*=\s*"([^"]+)"/g)) ids.add(match[1])
  for (const id of ids) {
    const next = `${prefix}-${id}`
    const esc = escapeRegExp(id)
    out = out
      .replace(new RegExp(String.raw`(\sid\s*=\s*)"${esc}"`, "g"), `$1"${next}"`)
      .replace(new RegExp(String.raw`url\(\s*#${esc}\s*\)`, "g"), `url(#${next})`)
      .replace(new RegExp(String.raw`((?:xlink:)?href\s*=\s*)"#${esc}"`, "g"), `$1"#${next}"`)
  }
  const classes = new Set<string>()
  out = out.replace(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi, (_all, css: string) => {
    let nextCss = css
    for (const match of css.matchAll(/\.([A-Za-z_][\w-]*)/g)) classes.add(match[1])
    for (const name of classes) {
      nextCss = nextCss.replace(new RegExp(String.raw`\.${escapeRegExp(name)}(?![\w-])`, "g"), `.${prefix}-${name}`)
    }
    // Drop @import / url(http...) from embedded CSS.
    nextCss = nextCss.replace(/@import[^;]*;/gi, "").replace(/url\(\s*['"]?(?:https?:|data:|\/\/)[^)]*\)/gi, "none")
    return `<style>${nextCss}</style>`
  })
  for (const name of classes) {
    out = out.replace(/\sclass\s*=\s*"([^"]*)"/g, (_all, value: string) => {
      const mapped = value
        .split(/\s+/)
        .map((token) => (token === name ? `${prefix}-${name}` : token))
        .join(" ")
      return ` class="${mapped}"`
    })
  }
  return out
}

export type SanitizeOptions = {
  /** Unique, css-safe prefix for ids and classes (for example "bi-nextjs-default"). */
  prefix: string
  /** Paint the whole mark with currentColor (used for the mono variant). */
  currentColor?: boolean
}

/** Returns a sanitized `<svg>` string sized by its parent (`size-full`), or "" if unusable. */
export function sanitizeBrandSvg(raw: string, options: SanitizeOptions): string {
  const cleaned = namespace(stripUnsafe(raw), options.prefix).trim()
  const rootMatch = cleaned.match(/<svg\b([^>]*)>/i)
  if (!rootMatch || !cleaned.toLowerCase().endsWith("</svg>")) return ""
  const attrs = rootMatch[1]
  const width = attrs.match(/\swidth\s*=\s*"([\d.]+)(?:px)?"/i)?.[1]
  const height = attrs.match(/\sheight\s*=\s*"([\d.]+)(?:px)?"/i)?.[1]
  const hasViewBox = /\sviewBox\s*=/i.test(attrs)
  let nextAttrs = stripAttr(stripAttr(stripAttr(attrs, "width"), "height"), "class")
  if (!hasViewBox && width && height) nextAttrs += ` viewBox="0 0 ${width} ${height}"`
  if (options.currentColor && !/\sfill\s*=/i.test(nextAttrs)) nextAttrs += ` fill="currentColor"`
  const root = `<svg${nextAttrs} class="block size-full" aria-hidden="true" focusable="false">`
  return cleaned.replace(rootMatch[0], root)
}
