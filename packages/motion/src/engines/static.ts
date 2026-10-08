import { clearFrame, createFormatter } from "./shared"
import type { MotionEngine } from "../engine-types"

const noop = () => undefined

/**
 * The "animations off" engine. Never animates and never loads a library:
 * every call applies the final state immediately and reports completion.
 */
export const staticEngine: MotionEngine = {
  name: "none",
  capabilities: { spring: false, scrollTrigger: false, timeline: false, splitText: true, runtime: "native" },
  reveal(el, opts) {
    clearFrame(el)
    opts?.onComplete?.()
    return noop
  },
  stagger(els, opts) {
    Array.from(els).forEach(clearFrame)
    opts?.onComplete?.()
    return noop
  },
  countTo(el, _from, to, opts = {}) {
    el.textContent = createFormatter(to, opts)(to)
    opts.onComplete?.()
    return noop
  },
  splitText(el, opts) {
    el.querySelectorAll<HTMLElement>("[data-glin-part]").forEach(clearFrame)
    opts?.onComplete?.()
    return noop
  },
  timeline(steps, opts) {
    for (const step of steps) {
      const targets = Array.isArray(step.target) ? step.target : [step.target as HTMLElement]
      targets.forEach(clearFrame)
    }
    opts?.onComplete?.()
    return noop
  }
}
