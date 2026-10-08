#!/usr/bin/env node
/**
 * Tailwind class audit.
 *
 * Silent failures (classes that compile to nothing) make UI look broken
 * without any error. This script finds them.
 *
 * Rules:
 *   unknown-class    token generates no CSS in Tailwind 3 and is not a known custom class
 *   opacity-on-var   `[var(--x)]/80` or `[color-mix(...)]/80` (Tailwind 3 cannot compile it)
 *   invalid-value    cheap detection of invalid CSS values (`var(--x) / 0.5`)
 *   inline-style     `style={{ ... }}` with static values (error) or non-custom-property keys (review)
 *   ambiguous-var-utility  `shadow-[var(--elev-1)]` compiles to `--tw-shadow-color` (no box-shadow), and
 *                    `text-[var(--text-sm)]`, `border-[var(--w)]`, `font-[var(--font-sans)]`,
 *                    `bg-[var(--gradient)]`, `ring-[var(--ring)]` bind to the wrong property.
 *                    Fix: `[box-shadow:var(--x)]`, `text-[length:var(--x)]`, `border-[length:var(--x)]`,
 *                    `font-[family-name:var(--x)]`, `bg-[image:var(--x)]`, or an arbitrary property.
 *
 * Usage:
 *   node scripts/audit-classes.mjs [--docs] [--json] [--no-allowlist] [--dir <path>]...
 */
import { createRequire } from "node:module"
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const require = createRequire(import.meta.url)
const here = path.dirname(fileURLToPath(import.meta.url))
const docsRoot = path.resolve(here, "..")
const repoRoot = path.resolve(docsRoot, "../..")

const ts = require("typescript")
const postcss = require("postcss")
const tailwind = require("tailwindcss")

const CLASS_FN = new Set(["cn", "cva", "clsx", "twMerge", "classNames", "tv"])
const STATIC_MARKERS = new Set([
  "group", "peer", "dark", "light", "rtl", "ltr", "not-prose", "prose", "dock-item", "toaster"
])

/* ---------------------------------------------------------------- files */

function walk(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) {
      if (name === "node_modules" || name === ".next" || name === "__tests__") continue
      walk(full, out)
    } else if (/\.tsx?$/.test(name) && !/\.(test|spec|stories)\.tsx?$/.test(name) && !name.endsWith(".d.ts")) {
      out.push(full)
    }
  }
  return out
}

/* ------------------------------------------------------------ allowlist */

function loadCustomClasses() {
  const files = [
    path.join(repoRoot, "packages/tokens/utilities.css"),
    path.join(repoRoot, "packages/tokens/animations.css"),
    path.join(repoRoot, "packages/tokens/theme.css"),
    path.join(repoRoot, "packages/tokens/preferences.css"),
    path.join(docsRoot, "src/app/globals.css")
  ]
  const set = new Set(STATIC_MARKERS)
  for (const file of files) {
    if (!existsSync(file)) continue
    const root = postcss.parse(readFileSync(file, "utf8"))
    root.walkRules((rule) => {
      for (const m of rule.selector.matchAll(/\.((?:\\.|[\w-])+)/g)) {
        set.add(m[1].replace(/\\(.)/g, "$1"))
      }
    })
  }
  return set
}

function loadAllowlistFile() {
  const file = path.join(here, "class-audit-allowlist.json")
  if (!existsSync(file)) return { files: [], classes: [] }
  const data = JSON.parse(readFileSync(file, "utf8"))
  return { files: data.files ?? [], classes: data.classes ?? [] }
}

/* ------------------------------------------------------------ tokenizer */

/** Split on whitespace outside of [] and () so arbitrary values stay whole. */
export function splitTokens(text) {
  const tokens = []
  let cur = ""
  let square = 0
  let paren = 0
  for (const ch of text) {
    if (ch === "[") square++
    else if (ch === "]") square = Math.max(0, square - 1)
    else if (ch === "(") paren++
    else if (ch === ")") paren = Math.max(0, paren - 1)
    if (/\s/.test(ch) && square === 0 && paren === 0) {
      if (cur) tokens.push(cur)
      cur = ""
    } else {
      cur += ch
    }
  }
  if (cur) tokens.push(cur)
  return tokens
}

const TOKEN_SHAPE = /^[!-]?[\w:[\]/().%,#&>*=_~+'"@^$|\\-]+$/

function looksLikeClassString(text) {
  const tokens = splitTokens(text)
  if (tokens.length === 0) return false
  const classy = tokens.filter((t) => TOKEN_SHAPE.test(t) && /[-:[\]]/.test(t) && !/^[A-Z]/.test(t) && !t.includes("://"))
  return classy.length > 0 && classy.length / tokens.length >= 0.6
}

function isCandidate(token) {
  if (!TOKEN_SHAPE.test(token)) return false
  // bare words with parens outside brackets are CSS values, not classes
  const outside = token.replace(/\[[^\]]*\]/g, "")
  if (/[()]/.test(outside)) return false
  if (/^(aria|data)-[\w-]+$/.test(token) || /^\[[^\]:]*\]$/.test(token) || /^[:^]/.test(token)) return false
  if (token.startsWith("--") || token.includes("://") || token.startsWith("@") || token.startsWith("./")) return false
  return true
}

/* ---------------------------------------------------------- extraction */

function lineOf(sf, node) {
  return sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1
}

const TRANSPARENT = (p) =>
  ts.isConditionalExpression(p) ||
  ts.isParenthesizedExpression(p) ||
  ts.isArrayLiteralExpression(p) ||
  ts.isObjectLiteralExpression(p) ||
  ts.isPropertyAssignment(p) ||
  ts.isSpreadElement(p) ||
  ts.isAsExpression(p) ||
  ts.isTemplateSpan(p) ||
  ts.isTemplateExpression(p) ||
  ts.isJsxExpression(p) ||
  (ts.isBinaryExpression(p) &&
    [ts.SyntaxKind.AmpersandAmpersandToken, ts.SyntaxKind.BarBarToken, ts.SyntaxKind.QuestionQuestionToken].includes(p.operatorToken.kind))

function inClassContext(node) {
  for (let p = node.parent; p; p = p.parent) {
    if (ts.isCallExpression(p)) {
      const callee = p.expression
      const name = ts.isIdentifier(callee) ? callee.text : ts.isPropertyAccessExpression(callee) ? callee.name.text : ""
      return CLASS_FN.has(name)
    }
    if (ts.isJsxAttribute(p)) return /class/i.test(p.name.getText())
    if (!TRANSPARENT(p)) return false
  }
  return false
}

function isVariantMeta(node) {
  // cva `defaultVariants` and non-class keys of `compoundVariants` entries hold option names, not classes
  for (let p = node.parent; p; p = p.parent) {
    if (ts.isPropertyAssignment(p)) {
      const name = p.name.getText().replace(/^["']|["']$/g, "")
      if (name === "defaultVariants") return true
      if (p.parent && ts.isObjectLiteralExpression(p.parent) && ts.isArrayLiteralExpression(p.parent.parent)) {
        const owner = p.parent.parent.parent
        if (owner && ts.isPropertyAssignment(owner) && owner.name.getText() === "compoundVariants") {
          return name !== "class" && name !== "className"
        }
      }
    }
  }
  return false
}

function isIgnorableString(node) {
  const p = node.parent
  if (isVariantMeta(node)) return true
  if (ts.isImportDeclaration(p) || ts.isExportDeclaration(p)) return true
  if (ts.isLiteralTypeNode(p)) return true
  if (ts.isJsxAttribute(p)) return !/class/i.test(p.name.getText())
  if (ts.isPropertyAssignment(p) && p.name === node) {
    // object keys are option names unless they carry a variant or arbitrary syntax (`"data-[x]:y": cond`)
    return !/[:[]/.test(node.text)
  }
  if (ts.isElementAccessExpression(p) || ts.isCaseClause(p)) return true
  // default values, constants and non-class call arguments are plain strings
  if (ts.isBindingElement(p) || ts.isParameter(p)) return true
  if (ts.isVariableDeclaration(p) && /^[A-Z][A-Z0-9_]*$/.test(p.name.getText())) return true
  if (ts.isCallExpression(p) && !inClassContext(node)) return true
  if (ts.isJsxAttribute(p)) return !/class/i.test(p.name.getText())
  if (ts.isBinaryExpression(p) && [ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsEqualsToken].includes(p.operatorToken.kind)) return true
  return false
}

function staticStyleKind(attr) {
  const init = attr.initializer
  if (!init || !ts.isJsxExpression(init) || !init.expression) return { kind: "attr" }
  let expr = init.expression
  while (ts.isAsExpression(expr) || ts.isParenthesizedExpression(expr)) expr = expr.expression
  if (!ts.isObjectLiteralExpression(expr)) return { kind: "dynamic-object" }
  const staticKeys = []
  const reviewKeys = []
  for (const prop of expr.properties) {
    if (!ts.isPropertyAssignment(prop) && !ts.isShorthandPropertyAssignment(prop)) {
      continue
    }
    const key = prop.name.getText().replace(/^["']|["']$/g, "")
    const v = ts.isPropertyAssignment(prop) ? prop.initializer : null
    const isStatic = v && (ts.isStringLiteral(v) || ts.isNumericLiteral(v) || ts.isNoSubstitutionTemplateLiteral(v))
    if (isStatic) staticKeys.push(key)
    else if (!key.startsWith("--")) reviewKeys.push(key)
  }
  return { kind: "object", staticKeys, reviewKeys }
}

export function extractFile(file, root = repoRoot, strict = false) {
  const text = readFileSync(file, "utf8")
  const kind = file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, kind)
  const rel = path.relative(root, file)
  const tokens = []
  const values = []
  const styles = []

  function addString(node, str) {
    if (isIgnorableString(node)) return
    const forced = inClassContext(node)
    if (!forced && (strict || !looksLikeClassString(str))) return
    const line = lineOf(sf, node)
    if (/(?<=[,(])var\(--[\w-]+\)\s+\/\s+[\d.]+/.test(str)) {
      values.push({ file: rel, line, token: str.trim().slice(0, 100), rule: "invalid-value" })
    }
    for (const t of splitTokens(str)) {
      if (isCandidate(t)) tokens.push({ file: rel, line, token: t })
    }
  }

  function visit(node) {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      addString(node, node.text)
    } else if (ts.isTemplateExpression(node)) {
      const parts = [node.head, ...node.templateSpans.map((s) => s.literal)]
      parts.forEach((part) => {
        // pieces adjacent to `${}` may be partial tokens; split on whitespace and drop edge fragments
        const raw = part.text
        const pieces = splitTokens(raw)
        const startsMid = !/^\s/.test(raw) && part !== node.head
        const endsMid = !/\s$/.test(raw) && part !== node.templateSpans[node.templateSpans.length - 1].literal
        pieces.forEach((t, i) => {
          if (i === 0 && startsMid) return
          if (i === pieces.length - 1 && endsMid) return
          if (isCandidate(t) && inClassContext(node)) {
            tokens.push({ file: rel, line: lineOf(sf, node), token: t })
          }
        })
      })
    } else if (ts.isJsxAttribute(node) && node.name.getText() === "style") {
      const info = staticStyleKind(node)
      const line = lineOf(sf, node)
      if (info.kind === "attr") styles.push({ file: rel, line, token: "style=", rule: "inline-style", level: "error" })
      else if (info.kind === "object") {
        if (info.staticKeys.length) {
          styles.push({ file: rel, line, token: `style static: ${info.staticKeys.join(",")}`, rule: "inline-style", level: "error" })
        }
        if (info.reviewKeys.length) {
          styles.push({ file: rel, line, token: `style dynamic: ${info.reviewKeys.join(",")}`, rule: "inline-style", level: "review" })
        }
      } else {
        styles.push({ file: rel, line, token: "style={expr}", rule: "inline-style", level: "review" })
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
  return { tokens, values, styles }
}

/* ------------------------------------------------------------- compile */

async function loadConfig() {
  const mod = await import(pathToFileURL(path.join(docsRoot, "tailwind.config.ts")).href)
  return mod.default
}

function unescapeCss(s) {
  return s
    .replace(/\\([0-9a-fA-F]{1,6}) ?/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/\\(.)/g, "$1")
}

async function generatedClasses(tokens, cssByClass = new Map()) {
  const config = await loadConfig()
  const result = await postcss([
    tailwind({ ...config, content: [{ raw: tokens.join("\n"), extension: "html" }], corePlugins: { preflight: false } })
  ]).process("@tailwind utilities;", { from: undefined })
  const set = new Set()
  result.root.walkRules((rule) => {
    const body = rule.nodes.map((n) => `${n.prop}: ${n.value}`).join("; ")
    for (const m of rule.selector.matchAll(/\.((?:\\[0-9a-fA-F]{1,6} |\\.|[\w-])+)/g)) {
      const name = unescapeCss(m[1])
      set.add(name)
      cssByClass.set(name, `${cssByClass.get(name) ?? ""}${body}; `)
    }
  })
  return set
}

/** Drop variant prefixes and the important flag: `hover:!shadow-[x]` -> `shadow-[x]`. */
export function baseUtility(token) {
  let square = 0
  let paren = 0
  let cut = 0
  for (let i = 0; i < token.length; i++) {
    const ch = token[i]
    if (ch === "[") square++
    else if (ch === "]") square = Math.max(0, square - 1)
    else if (ch === "(") paren++
    else if (ch === ")") paren = Math.max(0, paren - 1)
    else if (ch === ":" && square === 0 && paren === 0) cut = i + 1
  }
  return token.slice(cut).replace(/^!/, "")
}

const ELEVATION_NAME = /--[\w-]*(elev|drop|shadow|sh-|highlight|inset|solid-elev|lift)/i
const GRADIENT_NAME = /--(?:[\w-]*(?:gradient|sheen|img)[\w-]*|ring|ring-hot)\b/
const SIZE_VAR_UTILITIES = [
  { re: /^text-\[var\((--(?:text|font-size|fs|size)(?:-[\w-]+)?)[,)]/, prop: "color", fix: "text-[length:var(--x)]" },
  { re: /^(?:border|ring|outline|divide)(?:-[trblxyse])?-\[var\((--[\w-]*(?:width|-w|thickness)[\w-]*)[,)]/, prop: /(?:^|[; ])(?:border(?:-\w+)*-color|--tw-ring-color|outline-color)/, fix: "border-[length:var(--x)]" },
  { re: /^font-\[var\((--font-(?:sans|serif|mono|display|body|heading|family)[\w-]*)[,)]/, prop: "font-weight", fix: "font-[family-name:var(--x)]" }
]

/**
 * Return a fix hint when `token` compiled to the wrong property, else null.
 * `css` is the declaration body Tailwind generated for the class.
 */
export function ambiguousVarFinding(token, css) {
  const base = baseUtility(token)
  if (/^shadow-\[/.test(base) && css.includes("--tw-shadow-color") && !css.includes("box-shadow:")) {
    if (/^shadow-\[var\(/.test(base) || ELEVATION_NAME.test(base)) return "use [box-shadow:var(--x)]"
  }
  for (const rule of SIZE_VAR_UTILITIES) {
    if (rule.re.test(base)) {
      const hit = rule.prop instanceof RegExp ? rule.prop.test(css) : css.includes(`${rule.prop}:`)
      if (hit) return `use ${rule.fix}`
    }
  }
  const colorUtil = /^(?:ring|border(?:-[trblxyse])?|outline|divide|stroke|fill|decoration|text|ring-offset)-\[var\(/.exec(base)
  if (colorUtil && GRADIENT_NAME.test(base)) return "variable holds a gradient/image, not a color"
  if (/^bg-\[var\(/.test(base) && GRADIENT_NAME.test(base) && css.includes("background-color:")) return "use bg-[image:var(--x)]"
  return null
}

const OPACITY_ON_VAR = /\[(?:var|color-mix|theme|rgb|hsl|oklch|oklab)\(.*\)\]\/(?:\d+|\[)/

/* ----------------------------------------------------------------- run */

export async function runAudit({ dirs, strictDirs = [], root = repoRoot, useAllowlist = true } = {}) {
  const allow = useAllowlist ? loadAllowlistFile() : { files: [], classes: ['tok-k', 'tok-s', 'tok-c', 'tok-f'] }
  const custom = loadCustomClasses()
  for (const c of allow.classes) custom.add(c)
  const skipFiles = new Set(allow.files.map((f) => path.normalize(f)))

  const strictFiles = new Set(strictDirs.flatMap((d) => walk(d)).filter((f) => f.endsWith(".tsx")))
  const files = [...dirs.flatMap((d) => walk(d)), ...strictFiles].filter((f) => !skipFiles.has(path.normalize(path.relative(root, f))))
  const findings = []
  const candidates = []
  for (const file of files) {
    const { tokens, values, styles } = extractFile(file, root, strictFiles.has(file))
    candidates.push(...tokens)
    findings.push(...values, ...styles)
  }

  const unique = [...new Set(candidates.map((c) => c.token))]
  const cssByClass = new Map()
  const generated = await generatedClasses(unique, cssByClass)
  const seen = new Set()
  for (const c of candidates) {
    const key = `${c.file}:${c.line}:${c.token}`
    if (seen.has(key)) continue
    seen.add(key)
    const bare = c.token.replace(/^!/, "")
    if (OPACITY_ON_VAR.test(bare)) {
      findings.push({ ...c, rule: "opacity-on-var" })
      continue
    }
    if (/(?<=[,(])var\(--[\w-]+\)_\/_[\d.]+/.test(bare)) {
      findings.push({ ...c, rule: "invalid-value" })
      continue
    }
    if (generated.has(bare) || generated.has(c.token)) {
      const hint = ambiguousVarFinding(bare, cssByClass.get(bare) ?? cssByClass.get(c.token) ?? "")
      if (hint) findings.push({ ...c, rule: "ambiguous-var-utility", hint })
      continue
    }
    if (custom.has(bare)) continue
    // group/peer named markers
    if (/^(group|peer)\/[\w-]+$/.test(bare)) continue
    findings.push({ ...c, rule: "unknown-class" })
  }
  findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)
  return { findings, files: files.length, tokens: unique.length }
}

function format(findings) {
  return findings
    .map((f) => `${f.file}:${f.line}  [${f.rule}${f.level === "review" ? ":review" : ""}]  ${f.token}${f.hint ? `  (${f.hint})` : ""}`)
    .join("\n")
}

async function main() {
  const args = process.argv.slice(2)
  const json = args.includes("--json")
  const dirs = []
  for (let i = 0; i < args.length; i++) if (args[i] === "--dir") dirs.push(path.resolve(args[++i]))
  if (dirs.length === 0) dirs.push(path.join(repoRoot, "packages/ui/src/components"))
  const strictDirs = args.includes("--docs") ? [path.join(docsRoot, "src")] : []
  const { findings, files, tokens } = await runAudit({ dirs, strictDirs, useAllowlist: !args.includes("--no-allowlist") })
  const errors = findings.filter((f) => f.level !== "review")
  if (json) {
    console.log(JSON.stringify(findings, null, 2))
  } else {
    console.log(format(findings))
    const counts = {}
    for (const f of findings) counts[f.rule + (f.level === "review" ? ":review" : "")] = (counts[f.rule + (f.level === "review" ? ":review" : "")] ?? 0) + 1
    console.error(`\nscanned ${files} files, ${tokens} unique tokens; findings ${JSON.stringify(counts)}`)
  }
  process.exit(errors.length ? 1 : 0)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err)
    process.exit(2)
  })
}
