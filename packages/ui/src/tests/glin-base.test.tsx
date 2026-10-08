import * as React from "react"
import { act, render, screen } from "@testing-library/react"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { beforeEach, describe, expect, it } from "vitest"

import {
  DEFAULT_GLIN_CONFIG,
  GLIN_BASES,
  GlinProvider,
  ThemeScope,
  getGlinConfigScript,
  sanitizeGlinConfig,
  useGlinConfig
} from "../index"

function Probe() {
  const { config, setConfig } = useGlinConfig()
  return (
    <div>
      <span data-testid="base">{config.base}</span>
      <button onClick={() => setConfig({ base: "zinc" })}>zinc</button>
    </div>
  )
}

describe("base color config", () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.removeAttribute("data-glin-base")
  })

  it("defaults to obsidian and lists six bases", () => {
    expect(DEFAULT_GLIN_CONFIG.base).toBe("obsidian")
    expect([...GLIN_BASES]).toEqual(["obsidian", "neutral", "zinc", "slate", "stone", "gray"])
  })

  it("sanitizes unknown bases", () => {
    expect(sanitizeGlinConfig({ base: "zinc" })).toEqual({ base: "zinc" })
    expect(sanitizeGlinConfig({ base: "magenta" })).toEqual({})
  })

  it("writes data-glin-base on the wrapper and updates it", () => {
    const { container } = render(<GlinProvider defaults={{ base: "slate" }}><Probe /></GlinProvider>)
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.getAttribute("data-glin-base")).toBe("slate")
    act(() => screen.getByText("zinc").click())
    expect(wrapper.getAttribute("data-glin-base")).toBe("zinc")
  })

  it("writes to the document element, persists, and restores", () => {
    const first = render(<GlinProvider target="document" storageKey="b"><Probe /></GlinProvider>)
    act(() => screen.getByText("zinc").click())
    expect(document.documentElement.getAttribute("data-glin-base")).toBe("zinc")
    expect(JSON.parse(window.localStorage.getItem("b") ?? "{}").base).toBe("zinc")
    first.unmount()
    expect(document.documentElement.hasAttribute("data-glin-base")).toBe(false)
    render(<GlinProvider target="document" storageKey="b"><Probe /></GlinProvider>)
    expect(document.documentElement.getAttribute("data-glin-base")).toBe("zinc")
  })

  it("ignores an invalid stored base", () => {
    window.localStorage.setItem("b", JSON.stringify({ base: "nope" }))
    render(<GlinProvider target="document" storageKey="b"><Probe /></GlinProvider>)
    expect(screen.getByTestId("base").textContent).toBe("obsidian")
  })

  it("pre-paint script applies a valid base only", () => {
    window.localStorage.setItem("p", JSON.stringify({ base: "stone" }))
    // eslint-disable-next-line no-new-func
    new Function(getGlinConfigScript("p"))()
    expect(document.documentElement.getAttribute("data-glin-base")).toBe("stone")
  })
})

describe("ThemeScope base", () => {
  it("sets data-glin-base only when given", () => {
    const { container } = render(
      <div>
        <ThemeScope theme="dark" base="zinc">a</ThemeScope>
        <ThemeScope theme="light">b</ThemeScope>
      </div>
    )
    const [a, b] = Array.from(container.firstElementChild?.children ?? []) as HTMLElement[]
    expect(a?.getAttribute("data-glin-base")).toBe("zinc")
    expect(a?.getAttribute("data-glin-theme")).toBe("dark")
    expect(b?.hasAttribute("data-glin-base")).toBe(false)
  })
})

describe("bases.css", () => {
  const css = readFileSync(join(__dirname, "../../../tokens/bases.css"), "utf8")
  it("covers every base in both themes with scope selectors", () => {
    for (const id of GLIN_BASES) {
      expect(css).toContain(`[data-glin-base="${id}"][data-glin-base="${id}"]`)
      expect(css).toContain(`.dark[data-glin-base="${id}"][data-glin-base="${id}"]`)
      expect(css).toContain(`[data-glin-theme="dark"] [data-glin-base="${id}"]`)
    }
  })
  it("has no em or en dashes", () => {
    expect(/[–—]/.test(css)).toBe(false)
  })
})
