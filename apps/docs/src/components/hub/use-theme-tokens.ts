"use client"

import * as React from "react"

export type TokenMap = Record<string, string>
export type ThemeSheets = { light: TokenMap; dark: TokenMap }

function collectCustomProps(style: CSSStyleDeclaration, into: TokenMap) {
  for (let i = 0; i < style.length; i += 1) {
    const prop = style.item(i)
    if (prop.startsWith("--")) into[prop] = style.getPropertyValue(prop).trim()
  }
}

/** Read raw `:root` and `.dark` custom properties from the loaded stylesheets. */
export function readThemeSheets(base = "obsidian"): ThemeSheets {
  const light: TokenMap = {}
  const dark: TokenMap = {}
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList
    try {
      rules = sheet.cssRules
    } catch {
      continue
    }
    for (const rule of Array.from(rules)) {
      if (!(rule instanceof CSSStyleRule)) continue
      if (rule.selectorText === ":root") collectCustomProps(rule.style, light)
      else if (rule.selectorText === ".dark") collectCustomProps(rule.style, dark)
    }
  }
  // Overlay the active base color preset (bases.css) on top of the theme defaults.
  const lightSel = `[data-glin-base="${base}"][data-glin-base="${base}"]`
  const darkSel = `.dark [data-glin-base="${base}"]`
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList
    try {
      rules = sheet.cssRules
    } catch {
      continue
    }
    for (const rule of Array.from(rules)) {
      if (!(rule instanceof CSSStyleRule)) continue
      if (rule.selectorText.startsWith(lightSel)) collectCustomProps(rule.style, light)
      else if (rule.selectorText.startsWith(darkSel)) collectCustomProps(rule.style, dark)
    }
  }
  return { light, dark }
}

function readLive(names: readonly string[]): TokenMap {
  const computed = getComputedStyle(document.documentElement)
  const out: TokenMap = {}
  for (const name of names) out[name] = computed.getPropertyValue(name).trim()
  return out
}

/** Resolve token values for the active theme and re-read whenever the theme class flips. */
export function useThemeTokens(names: readonly string[]) {
  const [live, setLive] = React.useState<TokenMap>({})
  const [sheets, setSheets] = React.useState<ThemeSheets | null>(null)
  const [isDark, setIsDark] = React.useState(false)
  const [base, setBase] = React.useState("obsidian")
  const key = names.join("|")

  React.useEffect(() => {
    const list = key.split("|")
    const update = () => {
      setLive(readLive(list))
      setIsDark(document.documentElement.classList.contains("dark"))
      const next = document.documentElement.getAttribute("data-glin-base") ?? "obsidian"
      setBase(next)
      setSheets(readThemeSheets(next))
    }
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme", "data-glin-base"] })
    return () => observer.disconnect()
  }, [key])

  return { live, sheets, isDark, base }
}

export function declarationBlock(selector: string, map: TokenMap, names: readonly string[]): string {
  const lines = names.filter((n) => map[n]).map((n) => `  ${n}: ${map[n]};`)
  return `${selector} {\n${lines.join("\n")}\n}`
}
