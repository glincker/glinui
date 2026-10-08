import { resolveStaggerDelay } from "../stagger"
import type {
  ElementAnimator,
  EngineAdapter,
  EngineCleanup,
  EngineCountOptions,
  EngineRevealOptions,
  EngineSplitOptions,
  EngineStaggerOptions,
  MotionEngine
} from "../engine-types"
import {
  DEFAULT_ROOT_MARGIN,
  DEFAULT_THRESHOLD,
  canObserve,
  collectParts,
  createFormatter,
  resolveFromFrame,
  resolveTiming
} from "./shared"

type Group = { animators: ElementAnimator[]; delays: number[]; trigger: HTMLElement | undefined }

function runGroup(
  group: Group,
  adapter: EngineAdapter,
  opts: { once?: boolean; threshold?: number; rootMargin?: string; immediate?: boolean }
): EngineCleanup {
  const { animators, delays, trigger } = group
  animators.forEach((a) => a.reset())
  const playAll = () => animators.forEach((a, i) => a.play(delays[i] ?? 0))
  const resetAll = () => animators.forEach((a) => a.reset())
  let stop: EngineCleanup | undefined

  if (opts.immediate || !trigger || !canObserve()) {
    playAll()
  } else {
    const once = opts.once ?? true
    let entered = false
    stop = adapter.observe(
      trigger,
      { threshold: opts.threshold ?? DEFAULT_THRESHOLD, rootMargin: opts.rootMargin ?? DEFAULT_ROOT_MARGIN },
      () => {
        entered = true
        playAll()
        if (once) {
          stop?.()
          stop = undefined
        }
      },
      () => {
        if (!once) resetAll()
      }
    )
    if (entered && once) {
      stop()
      stop = undefined
    }
  }

  let disposed = false
  return () => {
    if (disposed) return
    disposed = true
    stop?.()
    animators.forEach((a) => a.dispose())
  }
}

/** Build a complete MotionEngine (reveal, stagger, countTo, splitText) from a small adapter. */
export function createEngine(adapter: EngineAdapter): MotionEngine {
  const buildGroup = (
    els: readonly HTMLElement[],
    opts: EngineStaggerOptions,
    trigger: HTMLElement | undefined
  ): Group => {
    const from = resolveFromFrame(opts)
    const timing = resolveTiming(opts)
    const count = els.length
    const delays = els.map((_, i) =>
      resolveStaggerDelay(i, {
        count,
        direction: opts.order ?? "forward",
        stepMs: opts.step ?? 60,
        maxDelayMs: opts.maxDelay ?? 1200
      })
    )
    const last = els.length - 1
    const animators = els.map((el, i) =>
      adapter.animate(el, from, timing, i === last ? opts.onComplete : undefined)
    )
    return { animators, delays, trigger }
  }

  const reveal = (el: HTMLElement, opts: EngineRevealOptions = {}): EngineCleanup => {
    const group = buildGroup([el], opts, el)
    group.delays = [0]
    return runGroup(group, adapter, opts)
  }

  const stagger = (els: ArrayLike<HTMLElement>, opts: EngineStaggerOptions = {}): EngineCleanup => {
    const list = Array.from(els)
    if (list.length === 0) return () => undefined
    const group = buildGroup(list, opts, opts.trigger ?? list[0])
    return runGroup(group, adapter, opts)
  }

  const countTo = (
    el: HTMLElement,
    from: number,
    to: number,
    opts: EngineCountOptions = {}
  ): EngineCleanup => {
    const format = createFormatter(to, opts)
    const timing = resolveTiming(opts)
    const write = (v: number) => {
      el.textContent = format(v)
    }
    let done = false
    const tween = adapter.tween(from, to, timing, write, () => {
      done = true
      write(to)
      opts.onComplete?.()
    })
    const animator: ElementAnimator = {
      reset: () => write(from),
      play: (extra) => tween.play(extra),
      dispose: () => {
        tween.stop()
        if (!done) write(to)
      }
    }
    return runGroup({ animators: [animator], delays: [0], trigger: el }, adapter, opts)
  }

  const splitText = (el: HTMLElement, opts: EngineSplitOptions = {}): EngineCleanup => {
    const { parts, restore } = collectParts(el, opts.by ?? "words")
    const cleanupGroup = stagger(parts, { step: 40, ...opts, trigger: opts.trigger ?? el })
    return () => {
      cleanupGroup()
      restore()
    }
  }

  return {
    name: adapter.name,
    capabilities: adapter.capabilities,
    reveal,
    stagger,
    countTo,
    splitText
  }
}
