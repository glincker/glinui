import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const h = vi.hoisted(() => ({
  motion: {
    animate: [] as Array<{ target: unknown; keyframes: unknown; options: Record<string, unknown>; stop: () => void }>,
    inView: [] as Array<{ target: Element; onStart: () => (() => void) | void; stop: () => void }>
  },
  gsap: {
    fromTo: [] as Array<{ from: Record<string, unknown>; to: Record<string, unknown> }>,
    created: [] as Array<{ config: Record<string, unknown>; kill: () => void }>,
    reverts: 0,
    registered: 0
  }
}))

vi.mock("../../../motion/node_modules/motion", () => ({
  animate: (target: unknown, keyframes: unknown, options: Record<string, unknown>) => {
    const entry = { target, keyframes, options, stop: vi.fn() }
    h.motion.animate.push(entry)
    return { stop: entry.stop, then: (cb: () => void) => Promise.resolve().then(cb) }
  },
  inView: (target: Element, onStart: () => (() => void) | void) => {
    const entry = { target, onStart, stop: vi.fn() }
    h.motion.inView.push(entry)
    return entry.stop
  }
}))

vi.mock("../../../motion/node_modules/gsap/ScrollTrigger", () => ({
  ScrollTrigger: {
    create: (config: Record<string, unknown>) => {
      const entry = { config, kill: vi.fn() }
      h.gsap.created.push(entry)
      return entry
    }
  }
}))

vi.mock("../../../motion/node_modules/gsap", () => ({
  gsap: {
    registerPlugin: () => {
      h.gsap.registered += 1
    },
    context: (fn: () => void) => {
      fn()
      return {
        revert: () => {
          h.gsap.reverts += 1
        }
      }
    },
    fromTo: (_el: unknown, from: Record<string, unknown>, to: Record<string, unknown>) => {
      h.gsap.fromTo.push({ from, to })
    },
    to: () => ({ kill: vi.fn() }),
    timeline: () => ({ fromTo: vi.fn() })
  }
}))

import { cssEngine } from "@glinui/motion"
import { gsapEngine } from "../../../motion/src/engines/gsap"
import { motionEngine } from "../../../motion/src/engines/motion"
import { MockIntersectionObserver, installIntersectionObserver, installWebAnimations } from "./motion-test-utils"

let restoreIO: () => void
let wa: ReturnType<typeof installWebAnimations>

beforeEach(() => {
  restoreIO = installIntersectionObserver()
  wa = installWebAnimations()
})

afterEach(() => {
  restoreIO()
  wa.restore()
  h.motion.animate.length = 0
  h.motion.inView.length = 0
  h.gsap.fromTo.length = 0
  h.gsap.created.length = 0
  h.gsap.reverts = 0
})

describe("css adapter", () => {
  it("hides, waits for the viewport, animates, and cleans up", () => {
    const el = document.createElement("div")
    const cleanup = cssEngine.reveal(el, { distance: 16, blur: 8, duration: 400 })
    expect(el.style.opacity).toBe("0")
    expect(el.style.transform).toContain("translate3d(0px, 16px")
    expect(wa.calls).toHaveLength(0)

    MockIntersectionObserver.instances[0].trigger(true)
    expect(wa.calls).toHaveLength(1)
    expect(wa.calls[0].options.duration).toBe(400)
    expect(wa.calls[0].keyframes[0]).toMatchObject({ opacity: 0, filter: "blur(8px)" })
    // once: observer released after first entry
    expect(MockIntersectionObserver.instances[0].disconnected).toBe(true)

    cleanup()
    expect(el.style.opacity).toBe("")
    expect(el.style.transform).toBe("")
  })

  it("disconnects the observer on cleanup before entering", () => {
    const el = document.createElement("div")
    const cleanup = cssEngine.reveal(el)
    expect(MockIntersectionObserver.active).toHaveLength(1)
    cleanup()
    expect(MockIntersectionObserver.active).toHaveLength(0)
    expect(el.style.opacity).toBe("")
  })

  it("staggers children with increasing delays from one observer", () => {
    const els = [0, 1, 2].map(() => document.createElement("li"))
    cssEngine.stagger(els, { step: 100, distance: 0 })
    expect(MockIntersectionObserver.instances).toHaveLength(1)
    MockIntersectionObserver.instances[0].trigger(true)
    expect(wa.calls.map((c) => c.options.delay)).toEqual([0, 100, 200])
  })

  it("plays immediately without an observer", () => {
    const el = document.createElement("div")
    cssEngine.reveal(el, { immediate: true })
    expect(MockIntersectionObserver.instances).toHaveLength(0)
    expect(wa.calls).toHaveLength(1)
  })

  it("counts to the final value", () => {
    vi.useFakeTimers()
    const el = document.createElement("span")
    cssEngine.countTo(el, 0, 1000, { immediate: true, duration: 200 })
    expect(el.textContent).toBe("0")
    vi.advanceTimersByTime(400)
    expect(el.textContent).toBe("1,000")
    vi.useRealTimers()
  })
})

describe("motion adapter", () => {
  it("uses inView and animate with a spring, then stops on cleanup", () => {
    const el = document.createElement("div")
    const cleanup = motionEngine.reveal(el, { spring: "snappy", distance: 12 })
    expect(el.style.opacity).toBe("0")
    expect(h.motion.inView).toHaveLength(1)
    h.motion.inView[0].onStart()
    expect(h.motion.animate).toHaveLength(1)
    expect(h.motion.animate[0].options.type).toBe("spring")
    expect(h.motion.animate[0].keyframes).toMatchObject({ opacity: [0, 1], y: [12, 0] })
    cleanup()
    expect(h.motion.animate[0].stop).toHaveBeenCalled()
    expect(h.motion.inView[0].stop).toHaveBeenCalled()
    expect(el.style.opacity).toBe("")
  })
})

describe("gsap adapter", () => {
  it("registers plugins once, uses ScrollTrigger and reverts the context", () => {
    const el = document.createElement("div")
    const cleanup = gsapEngine.reveal(el, { distance: 20, blur: 6 })
    expect(h.gsap.created).toHaveLength(1)
    expect(typeof h.gsap.created[0].config.start).toBe("string")
    ;(h.gsap.created[0].config.onEnter as () => void)()
    expect(h.gsap.fromTo).toHaveLength(1)
    expect(h.gsap.fromTo[0].from).toMatchObject({ opacity: 0, y: 20, filter: "blur(6px)" })
    expect(h.gsap.fromTo[0].to).toMatchObject({ opacity: 1, y: 0 })
    cleanup()
    expect(h.gsap.reverts).toBeGreaterThan(0)
    expect(h.gsap.created[0].kill).toHaveBeenCalled()
    expect(el.style.opacity).toBe("")
  })
})
