import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

import { build, collect } from "../scripts/build-glinr-tokens.mjs"

interface TokenNode {
  $value: string | { light: string; dark: string }
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const read = (file: string) => readFileSync(resolve(root, file), "utf8")
const tree = JSON.parse(read("glinr.tokens.json")) as Record<string, Record<string, unknown>>
const { tokens, tokensCss, themeCss } = build(tree)

function declared(block: string): string[] {
  return [...block.matchAll(/^\s+(--[a-z0-9-]+):/gm)].map((m) => m[1])
}

describe("glinr design tokens", () => {
  it("committed CSS matches the generator output", () => {
    expect(read("glinr.css")).toBe(tokensCss)
    expect(read("glinr-theme.css")).toBe(themeCss)
  })

  it("declares every token in :root", () => {
    const rootBlock = tokensCss.slice(0, tokensCss.indexOf("\n}\n"))
    const names = declared(rootBlock)
    for (const t of tokens) expect(names, t.name).toContain(t.name)
    expect(tokens.length).toBeGreaterThan(0)
  })

  it("has unique names and a description on every token", () => {
    const names = tokens.map((t) => t.name)
    expect(new Set(names).size).toBe(names.length)
    for (const t of tokens) {
      expect(t.name.startsWith("--glinr-"), t.path).toBe(true)
      expect(t.description, t.path).toBeTruthy()
    }
    expect(collect(tree).length).toBe(tokens.length)
  })

  it("only overrides tokens in dark that exist in light", () => {
    const light = new Set(declared(tokensCss.slice(0, tokensCss.indexOf("\n}\n"))))
    const darkStart = tokensCss.indexOf('[data-glin-theme="dark"]')
    const dark = declared(tokensCss.slice(darkStart))
    expect(dark.length).toBeGreaterThan(0)
    for (const name of dark) expect(light.has(name), name).toBe(true)
  })

  it("only maps tailwind names that point at a declared token", () => {
    const light = new Set(declared(tokensCss.slice(0, tokensCss.indexOf("\n}\n"))))
    for (const m of themeCss.matchAll(/--[a-z0-9-]+: var\((--glinr-[a-z0-9-]+)\);/g)) {
      expect(light.has(m[1]), m[1]).toBe(true)
    }
  })

  it("keeps token source values as strings or light/dark pairs", () => {
    for (const group of Object.values(tree)) {
      if (typeof group !== "object") continue
      for (const node of Object.values(group)) {
        if (node === null || typeof node !== "object" || !("$value" in node)) continue
        const v = (node as TokenNode).$value
        expect(typeof v === "string" || (typeof v === "object" && "light" in v && "dark" in v)).toBe(true)
      }
    }
  })
})
