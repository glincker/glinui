#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourcePath = path.join(root, 'glinr.tokens.json')
const tokensCssPath = path.join(root, 'glinr.css')
const themeCssPath = path.join(root, 'glinr-theme.css')

const HEADER =
  '/* GLINR design tokens, generated from glinr.tokens.json, do not edit. Run `pnpm --filter @glinui/tokens glinr:build`. */'

function isToken(node) {
  return node !== null && typeof node === 'object' && '$value' in node
}

export function collect(tree) {
  const tokens = []
  for (const [group, groupNode] of Object.entries(tree)) {
    if (group.startsWith('$')) continue
    for (const [key, node] of Object.entries(groupNode)) {
      if (key.startsWith('$')) continue
      if (!isToken(node)) throw new Error(`${group}.${key} is not a token`)
      const ext = node.$extensions?.glinr ?? {}
      tokens.push({
        path: `${group}.${key}`,
        name: `--glinr-${ext.name ?? `${group}-${key}`}`,
        value: node.$value,
        stability: ext.stability,
        tailwind: ext.tailwind,
        description: node.$description,
      })
    }
  }
  return tokens
}

function resolve(value, byPath) {
  const alias = /^\{([^}]+)\}$/.exec(value)
  if (!alias) return value
  const target = byPath.get(alias[1])
  if (!target) throw new Error(`unknown alias ${value}`)
  return `var(${target.name})`
}

export function build(tree) {
  const tokens = collect(tree)
  const byPath = new Map(tokens.map((t) => [t.path, t]))
  const seen = new Set()
  for (const t of tokens) {
    if (seen.has(t.name)) throw new Error(`duplicate token name ${t.name}`)
    seen.add(t.name)
    if (t.stability !== 'stable' && t.stability !== 'experimental') {
      throw new Error(`${t.path} needs stability stable|experimental`)
    }
    if (!t.description) throw new Error(`${t.path} needs a $description`)
  }

  const light = []
  const dark = []
  for (const t of tokens) {
    const modal =
      typeof t.value === 'object' && t.value !== null && 'light' in t.value
    const lightValue = modal ? t.value.light : t.value
    light.push(`  ${t.name}: ${resolve(lightValue, byPath)};`)
    if (modal && t.value.dark !== t.value.light) {
      dark.push(`  ${t.name}: ${resolve(t.value.dark, byPath)};`)
    }
  }

  const tokensCss = `${HEADER}\n\n:root {\n${light.join('\n')}\n}\n\n.dark,\n[data-glin-theme="dark"] {\n${dark.join('\n')}\n}\n`

  const mapped = tokens.filter((t) => t.tailwind)
  const themeCss = `${HEADER}\n\n@theme inline {\n${mapped
    .map((t) => `  --${t.tailwind}: var(${t.name});`)
    .join('\n')}\n}\n`

  return { tokens, tokensCss, themeCss }
}

function main() {
  const tree = JSON.parse(readFileSync(sourcePath, 'utf8'))
  const { tokens, tokensCss, themeCss } = build(tree)
  writeFileSync(tokensCssPath, tokensCss)
  writeFileSync(themeCssPath, themeCss)
  console.log(`glinr tokens: ${tokens.length} tokens written`)
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main()
}
