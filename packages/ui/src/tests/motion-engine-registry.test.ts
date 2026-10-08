import { afterEach, describe, expect, it, vi } from "vitest"
import {
  cssEngine,
  getEngine,
  hasEngine,
  listEngines,
  loadEngine,
  registerEngine,
  resolveEngine,
  resolveEngineSync,
  resolveMotionLevel,
  staticEngine,
  unregisterEngine,
  type MotionEngine
} from "@glinui/motion"

function fakeEngine(name: string): MotionEngine & { reveal: ReturnType<typeof vi.fn> } {
  return {
    name,
    capabilities: { spring: false, scrollTrigger: false, timeline: false, splitText: false, runtime: "native" },
    reveal: vi.fn(() => () => undefined),
    stagger: vi.fn(() => () => undefined),
    countTo: vi.fn(() => () => undefined)
  }
}

afterEach(() => {
  unregisterEngine("custom")
  unregisterEngine("broken")
  unregisterEngine("gsap")
  unregisterEngine("motion")
})

describe("engine registry", () => {
  it("ships only css built in; motion and gsap are opt-in", () => {
    expect(listEngines()).toEqual(["css"])
    expect(getEngine("css")).toBe(cssEngine)
    expect(hasEngine("gsap")).toBe(false)
    expect(hasEngine("motion")).toBe(false)
    expect(getEngine("gsap")).toBeUndefined()
  })

  it("level none resolves to the static engine without any registration", async () => {
    expect(await resolveEngine("gsap", { level: "none" })).toBe(staticEngine)
    expect(resolveEngineSync("css", { level: "none" })).toBe(staticEngine)
  })

  it("falls back to css and warns once (dev only) for an unregistered engine", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)
    const first = await resolveEngine("gsap", { level: "full", reducedMotion: false })
    const second = await resolveEngine("gsap", { level: "full", reducedMotion: false })
    expect(first).toBe(cssEngine)
    expect(second).toBe(cssEngine)
    expect(warn).toHaveBeenCalledTimes(1)
    expect(String(warn.mock.calls[0][0])).toContain("@glinui/motion/register/gsap")
    warn.mockRestore()
  })

  it("does not warn in production", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)
    vi.stubEnv("NODE_ENV", "production")
    const resolved = await resolveEngine("never-registered-prod", { level: "full", reducedMotion: false })
    vi.unstubAllEnvs()
    expect(resolved).toBe(cssEngine)
    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })

  it("explicit registration enables the engine", async () => {
    const engine = fakeEngine("gsap")
    registerEngine("gsap", () => engine)
    expect(hasEngine("gsap")).toBe(true)
    expect(await resolveEngine("gsap", { level: "full", reducedMotion: false })).toBe(engine)
  })

  it("registers engines and factories", async () => {
    const engine = fakeEngine("custom")
    registerEngine("custom", engine)
    expect(hasEngine("custom")).toBe(true)
    expect(getEngine("custom")).toBe(engine)

    const factory = vi.fn(async () => engine)
    registerEngine("custom", factory)
    expect(getEngine("custom")).toBeUndefined()
    await loadEngine("custom")
    await loadEngine("custom")
    expect(factory).toHaveBeenCalledTimes(1)
    expect(getEngine("custom")).toBe(engine)
  })

  it("rejects unknown engines", async () => {
    await expect(loadEngine("nope")).rejects.toThrow(/Unknown engine/)
  })

  it("never loads a library for level none", async () => {
    const factory = vi.fn(async () => fakeEngine("custom"))
    registerEngine("custom", factory)
    expect(await resolveEngine("custom", { level: "none" })).toBe(staticEngine)
    expect(resolveEngineSync("custom", { level: "none" })).toBe(staticEngine)
    expect(factory).not.toHaveBeenCalled()
  })

  it("maps levels and reduced motion", () => {
    expect(resolveMotionLevel("full", false)).toBe("full")
    expect(resolveMotionLevel("system", false)).toBe("full")
    expect(resolveMotionLevel("system", true)).toBe("subtle")
    expect(resolveMotionLevel("full", true)).toBe("subtle")
    expect(resolveMotionLevel("none", false)).toBe("none")
    expect(resolveMotionLevel("subtle", false)).toBe("subtle")
  })

  it("subtle strips movement, blur and scale", async () => {
    const engine = fakeEngine("custom")
    registerEngine("custom", engine)
    const resolved = await resolveEngine("custom", { level: "subtle", reducedMotion: false })
    const el = document.createElement("div")
    resolved.reveal(el, { distance: 40, blur: 10, scale: 0.5, direction: "left" })
    expect(engine.reveal).toHaveBeenCalledWith(el, expect.objectContaining({ distance: 0, blur: 0, scale: 1, direction: "none" }))
  })

  it("falls back to css when a factory fails", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)
    registerEngine("broken", () => Promise.reject(new Error("missing peer")))
    const resolved = await resolveEngine("broken", { level: "full", reducedMotion: false })
    expect(resolved).toBe(cssEngine)
    warn.mockRestore()
  })

  it("static engine applies the final state immediately", () => {
    const el = document.createElement("div")
    el.style.opacity = "0"
    el.style.transform = "translateY(10px)"
    const done = vi.fn()
    staticEngine.reveal(el, { onComplete: done })
    expect(el.style.opacity).toBe("")
    expect(el.style.transform).toBe("")
    expect(done).toHaveBeenCalled()
    staticEngine.countTo(el, 0, 1234, {})
    expect(el.textContent).toBe("1,234")
  })
})
