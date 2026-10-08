import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { createEngine } from "./factory"
import { applyFrame, clearFrame, frameFilter, isMoving } from "./shared"
import type {
  ElementAnimator,
  EngineAdapter,
  EngineCleanup,
  EngineTimelineStep,
  MotionEngine,
  TweenHandle
} from "../engine-types"

let registered = false

function ensurePlugins(): void {
  if (registered) return
  registered = true
  gsap.registerPlugin(ScrollTrigger)
}

/** Convert an IntersectionObserver threshold to a ScrollTrigger `start` position. */
function startFor(threshold: number, rootMargin: string): string {
  const pct = Math.round((1 - threshold) * 100)
  const px = Number.parseFloat(rootMargin)
  const offset = Number.isFinite(px) && px !== 0 ? ` ${px > 0 ? "-" : "+"}=${Math.abs(px)}` : ""
  return `top ${pct}%${offset}`
}

const gsapAdapter: EngineAdapter = {
  name: "gsap",
  capabilities: { spring: true, scrollTrigger: true, timeline: true, splitText: true, runtime: "library" },

  animate(el, from, timing, onComplete): ElementAnimator {
    ensurePlugins()
    let ctx: gsap.Context | undefined
    const revert = () => {
      ctx?.revert()
      ctx = undefined
    }
    return {
      reset() {
        revert()
        applyFrame(el, from)
      },
      play(extra) {
        revert()
        ctx = gsap.context(() => {
          const fromVars: gsap.TweenVars = { opacity: from.opacity }
          if (isMoving(from)) {
            fromVars.x = from.x
            fromVars.y = from.y
            fromVars.scale = from.scale
          }
          if (from.blur > 0) fromVars.filter = frameFilter(from)
          const toVars: gsap.TweenVars = {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: timing.durationMs / 1000,
            delay: (timing.delayMs + extra) / 1000,
            ease: timing.ease,
            overwrite: "auto",
            onComplete: () => {
              revert()
              clearFrame(el)
              onComplete?.()
            }
          }
          if (from.blur > 0) toVars.filter = "blur(0px)"
          gsap.fromTo(el, fromVars, toVars)
        }, el)
      },
      dispose() {
        revert()
        clearFrame(el)
      }
    }
  },

  tween(from, to, timing, onUpdate, onComplete): TweenHandle {
    ensurePlugins()
    const proxy = { value: from }
    let tween: gsap.core.Tween | undefined
    const stop = () => {
      tween?.kill()
      tween = undefined
    }
    return {
      play(extra) {
        stop()
        proxy.value = from
        tween = gsap.to(proxy, {
          value: to,
          duration: timing.durationMs / 1000,
          delay: (timing.delayMs + extra) / 1000,
          ease: timing.ease,
          onUpdate: () => onUpdate(proxy.value),
          onComplete: () => onComplete?.()
        })
      },
      stop
    }
  },

  observe(target, opts, enter, leave): EngineCleanup {
    ensurePlugins()
    const st = ScrollTrigger.create({
      trigger: target,
      start: startFor(opts.threshold, opts.rootMargin),
      onEnter: enter,
      onEnterBack: enter,
      onLeaveBack: leave,
      onLeave: leave
    })
    return () => st.kill()
  }
}

const base = createEngine(gsapAdapter)

function timeline(steps: readonly EngineTimelineStep[], opts?: { onComplete?: () => void }): EngineCleanup {
  ensurePlugins()
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ onComplete: opts?.onComplete })
    for (const step of steps) {
      const targets = (Array.isArray(step.target) ? step.target : [step.target]) as HTMLElement[]
      const r = step.reveal ?? {}
      const distance = r.distance ?? 12
      tl.fromTo(
        targets,
        { opacity: 0, y: distance },
        { opacity: 1, y: 0, duration: (r.duration ?? 520) / 1000, ease: "power3.out", stagger: 0.06 },
        (step.at ?? 0) / 1000
      )
    }
  })
  return () => {
    ctx.revert()
    for (const step of steps) {
      const targets = (Array.isArray(step.target) ? step.target : [step.target]) as HTMLElement[]
      targets.forEach(clearFrame)
    }
  }
}

/** Engine backed by GSAP core and ScrollTrigger. Plugins register once; cleanup uses ctx.revert(). */
export const gsapEngine: MotionEngine = { ...base, timeline }
export { gsapAdapter }
