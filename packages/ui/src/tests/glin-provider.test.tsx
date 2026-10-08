import * as React from "react"
import { act, render, screen } from "@testing-library/react"
import { IconContext } from "@phosphor-icons/react"
import { readFileSync } from "node:fs"
import { join } from "node:path"

import {
  DEFAULT_GLIN_CONFIG,
  GlinProvider,
  MotionEngineContext,
  getGlinConfigScript,
  useGlinConfig,
  useGlinSurface,
  useGlinStyle
} from "../index"

function Probe() {
  const { config, resolvedMotion, setConfig, reset } = useGlinConfig()
  const surface = useGlinSurface()
  const icon = React.useContext(IconContext)
  return (
    <div>
      <span data-testid="accent">{config.accent}</span>
      <span data-testid="resolved">{resolvedMotion}</span>
      <span data-testid="surface">{surface}</span>
      <span data-testid="icon">{`${String(icon.weight)}:${String(icon.size)}`}</span>
      <button onClick={() => setConfig({ accent: "emerald", surface: "glass", iconWeight: "bold", iconSize: "lg" })}>set</button>
      <button onClick={reset}>reset</button>
    </div>
  )
}

function mockMatchMedia(matches: boolean) {
  const listeners = new Set<(e: MediaQueryListEvent) => void>()
  window.matchMedia = ((query: string) => ({
    matches,
    media: query,
    addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.add(cb),
    removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.delete(cb)
  })) as unknown as typeof window.matchMedia
}

const ATTRS = ["motion", "engine", "surface", "accent", "base", "radius", "icon-weight", "icon-size"].map((a) => `data-glin-${a}`)

describe("GlinProvider", () => {
  beforeEach(() => {
    window.localStorage.clear()
    ATTRS.forEach((a) => document.documentElement.removeAttribute(a))
    mockMatchMedia(false)
  })

  it("applies defaults to its wrapper", () => {
    const { container } = render(<GlinProvider><Probe /></GlinProvider>)
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.getAttribute("data-glin-accent")).toBe(DEFAULT_GLIN_CONFIG.accent)
    expect(wrapper.getAttribute("data-glin-motion")).toBe("system")
    expect(wrapper.getAttribute("data-glin-surface")).toBe("solid")
    expect(wrapper.getAttribute("data-glin-radius")).toBe("default")
    expect(wrapper.getAttribute("data-glin-icon-weight")).toBe("regular")
    expect(wrapper.getAttribute("data-glin-icon-size")).toBe("md")
    expect(document.documentElement.hasAttribute("data-glin-accent")).toBe(false)
  })

  it("defaults engine to css, writes data-glin-engine and feeds MotionEngineContext", () => {
    function EngineProbe() {
      const ctx = React.useContext(MotionEngineContext)
      const { setConfig } = useGlinConfig()
      return (
        <div>
          <span data-testid="engine">{ctx?.engine}</span>
          <span data-testid="level">{ctx?.level}</span>
          <button onClick={() => setConfig({ engine: "gsap", motion: "none" })}>gsap</button>
          <button onClick={() => setConfig({ engine: "nope" as unknown as "css" })}>bad</button>
        </div>
      )
    }
    render(<GlinProvider target="document"><EngineProbe /></GlinProvider>)
    expect(document.documentElement.getAttribute("data-glin-engine")).toBe("css")
    expect(screen.getByTestId("engine").textContent).toBe("css")
    act(() => screen.getByText("gsap").click())
    expect(document.documentElement.getAttribute("data-glin-engine")).toBe("gsap")
    expect(screen.getByTestId("engine").textContent).toBe("gsap")
    expect(screen.getByTestId("level").textContent).toBe("none")
    act(() => screen.getByText("bad").click())
    expect(document.documentElement.getAttribute("data-glin-engine")).toBe("gsap")
  })

  it("restores a persisted engine and rejects invalid stored values", () => {
    window.localStorage.setItem("k", JSON.stringify({ engine: "motion" }))
    render(<GlinProvider target="document" storageKey="k"><Probe /></GlinProvider>)
    expect(document.documentElement.getAttribute("data-glin-engine")).toBe("motion")
    expect(getGlinConfigScript("k")).toContain("data-glin-engine")
  })

  it("applies attributes to the document element and cleans up", () => {
    const { unmount } = render(<GlinProvider target="document" defaults={{ accent: "rose" }}><Probe /></GlinProvider>)
    expect(document.documentElement.getAttribute("data-glin-accent")).toBe("rose")
    unmount()
    expect(document.documentElement.hasAttribute("data-glin-accent")).toBe(false)
  })

  it("updates attributes, surface hook and Phosphor context, then resets", () => {
    render(<GlinProvider target="document"><Probe /></GlinProvider>)
    expect(screen.getByTestId("icon").textContent).toBe("regular:20")
    act(() => screen.getByText("set").click())
    expect(document.documentElement.getAttribute("data-glin-accent")).toBe("emerald")
    expect(document.documentElement.getAttribute("data-glin-icon-weight")).toBe("bold")
    expect(screen.getByTestId("surface").textContent).toBe("glass")
    expect(screen.getByTestId("icon").textContent).toBe("bold:24")
    act(() => screen.getByText("reset").click())
    expect(document.documentElement.getAttribute("data-glin-accent")).toBe("violet")
  })

  it("persists and restores from storage", () => {
    const first = render(<GlinProvider storageKey="k" target="document"><Probe /></GlinProvider>)
    act(() => screen.getByText("set").click())
    expect(JSON.parse(window.localStorage.getItem("k") ?? "{}").accent).toBe("emerald")
    first.unmount()
    render(<GlinProvider storageKey="k" target="document"><Probe /></GlinProvider>)
    expect(screen.getByTestId("accent").textContent).toBe("emerald")
    expect(document.documentElement.getAttribute("data-glin-accent")).toBe("emerald")
  })

  it("ignores invalid stored values and survives broken storage", () => {
    window.localStorage.setItem("k", JSON.stringify({ accent: "pink", radius: "round" }))
    render(<GlinProvider storageKey="k"><Probe /></GlinProvider>)
    expect(screen.getByTestId("accent").textContent).toBe("violet")
    window.localStorage.setItem("k", "{not json")
    expect(() => render(<GlinProvider storageKey="k"><Probe /></GlinProvider>)).not.toThrow()
  })

  it("resolves system motion from prefers-reduced-motion", () => {
    mockMatchMedia(true)
    const { unmount } = render(<GlinProvider><Probe /></GlinProvider>)
    expect(screen.getByTestId("resolved").textContent).toBe("none")
    unmount()
    mockMatchMedia(false)
    render(<GlinProvider><Probe /></GlinProvider>)
    expect(screen.getByTestId("resolved").textContent).toBe("full")
  })

  it("explicit motion ignores the system preference", () => {
    mockMatchMedia(true)
    render(<GlinProvider defaults={{ motion: "subtle" }}><Probe /></GlinProvider>)
    expect(screen.getByTestId("resolved").textContent).toBe("subtle")
  })

  it("getGlinConfigScript applies only valid stored values", () => {
    window.localStorage.setItem("pre", JSON.stringify({ accent: "blue", radius: "bogus" }))
    // eslint-disable-next-line no-new-func
    new Function(getGlinConfigScript("pre"))()
    expect(document.documentElement.getAttribute("data-glin-accent")).toBe("blue")
    expect(document.documentElement.hasAttribute("data-glin-radius")).toBe(false)
  })
})

describe("preferences.css contract", () => {
  const css = readFileSync(join(__dirname, "../../../tokens/preferences.css"), "utf8")
  it("implements every attribute and token", () => {
    for (const a of ["blue", "emerald", "amber", "rose", "neutral"]) expect(css).toContain(`[data-glin-accent="${a}"]`)
    for (const r of ["sharp", "round"]) expect(css).toContain(`[data-glin-radius="${r}"]`)
    for (const m of ["none", "subtle", "system"]) expect(css).toContain(`[data-glin-motion="${m}"]`)
    for (const t of ["--color-accent:", "--color-accent-foreground:", "--color-brand:", "--ring-brand:", "--radius-card:", "--radius-input:", "--glin-surface: glass", "--tw-enter-scale", "--tw-enter-translate-y", "prefers-reduced-motion", "animation: none"]) {
      expect(css).toContain(t)
    }
  })
  it("has no em or en dashes", () => {
    expect(/[\u2013\u2014]/.test(css)).toBe(false)
  })
})

function StyleProbe() {
  return <span data-testid="style-probe">{useGlinStyle()}</span>
}

describe("design style preset", () => {
  it("defaults to glinr without a provider", () => {
    render(<StyleProbe />)
    expect(screen.getByTestId("style-probe").textContent).toBe("glinr")
  })

  it("reads defaults.style and writes data-glin-style", () => {
    const { container } = render(
      <GlinProvider defaults={{ style: "minimal" }}>
        <StyleProbe />
      </GlinProvider>
    )
    expect(screen.getByTestId("style-probe").textContent).toBe("minimal")
    expect(container.querySelector("[data-glin-style='minimal']")).not.toBeNull()
  })

  it("keeps the legacy surface key as an alias", () => {
    render(
      <GlinProvider defaults={{ surface: "glass" }}>
        <StyleProbe />
      </GlinProvider>
    )
    expect(screen.getByTestId("style-probe").textContent).toBe("glass")
    render(
      <GlinProvider defaults={{ surface: "solid" }}>
        <StyleProbe />
      </GlinProvider>
    )
    expect(screen.getAllByTestId("style-probe")[1]?.textContent).toBe("minimal")
  })

  it("preferences.css exposes the three styles", () => {
    const css = readFileSync(join(__dirname, "../../../tokens/preferences.css"), "utf8")
    for (const style of ["glinr", "minimal", "glass"]) expect(css).toContain(`[data-glin-style="${style}"]`)
    expect(css).toContain("--glin-default-variant: plain")
  })
})
