import { vi } from "vitest"

type IOCallback = (entries: Array<Pick<IntersectionObserverEntry, "isIntersecting" | "target">>) => void

export class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []
  observed: Element[] = []
  disconnected = false
  constructor(
    public callback: IOCallback,
    public options?: IntersectionObserverInit
  ) {
    MockIntersectionObserver.instances.push(this)
  }
  observe(el: Element) {
    this.observed.push(el)
  }
  unobserve() {}
  disconnect() {
    this.disconnected = true
  }
  trigger(isIntersecting: boolean) {
    this.callback(this.observed.map((target) => ({ isIntersecting, target })))
  }
  static reset() {
    MockIntersectionObserver.instances = []
  }
  static get active() {
    return MockIntersectionObserver.instances.filter((i) => !i.disconnected)
  }
}

export type AnimateCall = { el: Element; keyframes: Keyframe[]; options: KeyframeAnimationOptions }

export function installWebAnimations(): { calls: AnimateCall[]; restore: () => void } {
  const calls: AnimateCall[] = []
  const original = HTMLElement.prototype.animate
  HTMLElement.prototype.animate = function (this: HTMLElement, keyframes: Keyframe[], options: KeyframeAnimationOptions) {
    calls.push({ el: this, keyframes, options })
    const anim = { onfinish: null as null | (() => void), cancel: vi.fn(), finish() { this.onfinish?.() } }
    return anim as unknown as Animation
  } as unknown as typeof HTMLElement.prototype.animate
  return {
    calls,
    restore: () => {
      HTMLElement.prototype.animate = original
    }
  }
}

export function installIntersectionObserver(): () => void {
  MockIntersectionObserver.reset()
  const original = globalThis.IntersectionObserver
  globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver
  return () => {
    globalThis.IntersectionObserver = original
  }
}
