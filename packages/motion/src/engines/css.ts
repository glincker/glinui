import { createEngine } from "./factory"
import { applyFrame, clearFrame, frameFilter, frameTransform, isMoving } from "./shared"
import type { EngineAdapter, EngineCleanup, EngineFrame, ElementAnimator, TweenHandle } from "../engine-types"

function keyframesFor(from: EngineFrame): Keyframe[] {
  const a: Keyframe = { opacity: from.opacity }
  const b: Keyframe = { opacity: 1 }
  if (isMoving(from)) {
    a.transform = frameTransform(from)
    b.transform = "translate3d(0px, 0px, 0) scale(1)"
  }
  if (from.blur > 0) {
    a.filter = frameFilter(from)
    b.filter = "blur(0px)"
  }
  return [a, b]
}

const cssAdapter: EngineAdapter = {
  name: "css",
  capabilities: { spring: false, scrollTrigger: false, timeline: false, splitText: true, runtime: "native" },

  animate(el, from, timing, onComplete): ElementAnimator {
    let anim: Animation | undefined
    const cancel = () => {
      if (anim) {
        anim.onfinish = null
        anim.cancel()
        anim = undefined
      }
    }
    return {
      reset() {
        cancel()
        applyFrame(el, from)
      },
      play(extra) {
        cancel()
        if (typeof el.animate !== "function") {
          clearFrame(el)
          onComplete?.()
          return
        }
        anim = el.animate(keyframesFor(from), {
          duration: timing.durationMs,
          delay: timing.delayMs + extra,
          easing: timing.cssEasing,
          fill: "both"
        })
        anim.onfinish = () => {
          clearFrame(el)
          cancel()
          onComplete?.()
        }
      },
      dispose() {
        cancel()
        clearFrame(el)
      }
    }
  },

  tween(from, to, timing, onUpdate, onComplete): TweenHandle {
    let raf = 0
    let timer: ReturnType<typeof setTimeout> | undefined
    const stop = () => {
      if (timer !== undefined) clearTimeout(timer)
      timer = undefined
      if (raf && typeof cancelAnimationFrame === "function") cancelAnimationFrame(raf)
      raf = 0
    }
    return {
      play(extra) {
        stop()
        const run = () => {
          const start = performance.now()
          const tick = (now: number) => {
            const p = timing.durationMs <= 0 ? 1 : Math.min(1, (now - start) / timing.durationMs)
            onUpdate(from + (to - from) * timing.ease(p))
            if (p < 1) raf = requestAnimationFrame(tick)
            else {
              raf = 0
              onComplete?.()
            }
          }
          raf = requestAnimationFrame(tick)
        }
        const wait = timing.delayMs + extra
        if (wait > 0) timer = setTimeout(run, wait)
        else run()
      },
      stop
    }
  },

  observe(target, opts, enter, leave): EngineCleanup {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) enter()
          else leave()
        }
      },
      { threshold: opts.threshold, rootMargin: opts.rootMargin }
    )
    io.observe(target)
    return () => io.disconnect()
  }
}

/** Zero-dependency engine: Web Animations API plus IntersectionObserver. */
export const cssEngine = createEngine(cssAdapter)
export { cssAdapter }
