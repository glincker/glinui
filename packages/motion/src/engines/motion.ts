import { animate, inView } from "motion"
import { createEngine } from "./factory"
import { applyFrame, clearFrame, frameFilter, isMoving } from "./shared"
import type {
  ElementAnimator,
  EngineAdapter,
  EngineCleanup,
  EngineTiming,
  EngineTimelineStep,
  MotionEngine,
  TweenHandle
} from "../engine-types"

type Controls = { stop: () => void }

function transitionFor(timing: EngineTiming, extraDelayMs: number) {
  const delay = (timing.delayMs + extraDelayMs) / 1000
  if (timing.spring) {
    return { type: "spring" as const, ...timing.spring, delay }
  }
  return { duration: timing.durationMs / 1000, delay, ease: timing.bezier ? ([...timing.bezier] as [number, number, number, number]) : ("linear" as const) }
}

const motionAdapter: EngineAdapter = {
  name: "motion",
  capabilities: { spring: true, scrollTrigger: false, timeline: true, splitText: true, runtime: "library" },

  animate(el, from, timing, onComplete): ElementAnimator {
    let controls: Controls | undefined
    const stop = () => {
      controls?.stop()
      controls = undefined
    }
    return {
      reset() {
        stop()
        applyFrame(el, from)
      },
      play(extra) {
        stop()
        const keyframes: Record<string, unknown> = { opacity: [from.opacity, 1] }
        if (isMoving(from)) {
          keyframes.x = [from.x, 0]
          keyframes.y = [from.y, 0]
          keyframes.scale = [from.scale, 1]
        }
        if (from.blur > 0) keyframes.filter = [frameFilter(from), "blur(0px)"]
        const c = animate(el, keyframes, transitionFor(timing, extra))
        controls = c
        c.then(() => {
          if (controls !== c) return
          controls = undefined
          clearFrame(el)
          onComplete?.()
        })
      },
      dispose() {
        stop()
        clearFrame(el)
      }
    }
  },

  tween(from, to, timing, onUpdate, onComplete): TweenHandle {
    let controls: Controls | undefined
    const stop = () => {
      controls?.stop()
      controls = undefined
    }
    return {
      play(extra) {
        stop()
        const t = transitionFor(timing, extra)
        const c = animate(from, to, {
          ...t,
          onUpdate,
          onComplete: () => onComplete?.()
        })
        controls = c
      },
      stop
    }
  },

  observe(target, opts, enter, leave): EngineCleanup {
    return inView(
      target,
      () => {
        enter()
        return () => leave()
      },
      { amount: opts.threshold, margin: opts.rootMargin as `${number}px` }
    )
  }
}

const base = createEngine(motionAdapter)

function timeline(steps: readonly EngineTimelineStep[]): EngineCleanup {
  const cleanups = steps.map((step) => {
    const targets = Array.isArray(step.target) ? step.target : [step.target as HTMLElement]
    return base.stagger(targets as HTMLElement[], {
      ...step.reveal,
      delay: (step.reveal?.delay ?? 0) + (step.at ?? 0),
      immediate: true
    })
  })
  return () => cleanups.forEach((c) => c())
}

/** Engine backed by the `motion` package (springs, interruptible, GPU accelerated). */
export const motionEngine: MotionEngine = { ...base, timeline }
export { motionAdapter }
