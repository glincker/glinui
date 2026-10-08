import { CodeBlock } from "@/components/docs/code-block"

const INTERFACE_CODE = `interface MotionEngine {
  readonly name: string
  readonly capabilities: EngineCapabilities
  reveal(el: HTMLElement, opts?: EngineRevealOptions): EngineCleanup
  stagger(els: ArrayLike<HTMLElement>, opts?: EngineStaggerOptions): EngineCleanup
  countTo(el: HTMLElement, from: number, to: number, opts?: EngineCountOptions): EngineCleanup
  splitText?(el: HTMLElement, opts?: EngineSplitOptions): EngineCleanup
  timeline?(steps: readonly EngineTimelineStep[], opts?: EngineTimelineOptions): EngineCleanup
}

type EngineCleanup = () => void // stop, disconnect observers, leave the element visible`

const ADAPTER_CODE = `import { createEngine, registerEngine, type EngineAdapter } from "@glinui/motion"

// 1. Implement three small primitives. createEngine builds reveal, stagger,
//    countTo and splitText on top of them (in-view, delays, cleanup, replay).
const myAdapter: EngineAdapter = {
  name: "my-engine",
  capabilities: { spring: false, scrollTrigger: false, timeline: false, splitText: true, runtime: "library" },

  // Animate one element from \`from\` to its natural state.
  animate(el, from, timing, onComplete) {
    return {
      reset: () => { el.style.opacity = String(from.opacity) },
      play: (extraDelayMs) => myLib.to(el, { opacity: 1, duration: timing.durationMs, delay: timing.delayMs + extraDelayMs, onDone: onComplete }),
      dispose: () => { myLib.kill(el); el.style.removeProperty("opacity") }
    }
  },

  // Tween a number (used by countTo).
  tween(from, to, timing, onUpdate, onComplete) {
    return { play: (extra) => myLib.value(from, to, timing.durationMs, onUpdate, onComplete, extra), stop: () => myLib.stopValue() }
  },

  // Tell us when the target is visible.
  observe(target, { threshold, rootMargin }, enter, leave) {
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? enter() : leave()), { threshold, rootMargin })
    io.observe(target)
    return () => io.disconnect()
  }
}

// 2. Register it. Use a factory so the library is only fetched when selected.
registerEngine("my-engine", () => import("./my-engine").then((m) => createEngine(m.myAdapter)))`

const USE_CODE = `import { MotionEngineProvider, Reveal } from "@glinui/ui"

// Per component
<Reveal engine="my-engine">...</Reveal>

// For a subtree
<MotionEngineProvider engine="my-engine"><App /></MotionEngineProvider>

// Without React state (picked up live)
document.documentElement.setAttribute("data-glin-engine", "my-engine")`

export function AddEngineGuide() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">1. The engine interface</h3>
        <p className="type-body max-w-[68ch] text-muted">
          Every method returns a cleanup. Cleanups must be idempotent and leave the element in its final, visible state,
          which keeps React Strict Mode and engine switching safe. Never touch <code className="type-code">window</code>{" "}
          at import time.
        </p>
        <CodeBlock code={INTERFACE_CODE} language="ts" />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">2. Write an adapter and register it</h3>
        <p className="type-body max-w-[68ch] text-muted">
          Prefer <code className="type-code">createEngine(adapter)</code>: you only provide{" "}
          <code className="type-code">animate</code>, <code className="type-code">tween</code> and{" "}
          <code className="type-code">observe</code>. You can also pass a hand-written{" "}
          <code className="type-code">MotionEngine</code> straight to <code className="type-code">registerEngine</code>.
        </p>
        <CodeBlock code={ADAPTER_CODE} language="ts" filename="my-engine.ts" />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">3. Select it</h3>
        <CodeBlock code={USE_CODE} language="tsx" />
      </div>
    </div>
  )
}
