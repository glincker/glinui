import { vi } from "vitest"

/** Install a matchMedia mock where `matching` lists substrings of queries that match. */
export function mockMedia(matching: string[]): () => void {
  const original = window.matchMedia
  window.matchMedia = ((query: string) => ({
    matches: matching.some((m) => query.includes(m)),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn()
  })) as unknown as typeof window.matchMedia
  return () => {
    window.matchMedia = original
  }
}

/** jsdom lacks PointerEvent; install a MouseEvent based stand in that carries pointerType. */
export function installPointerEvent(): () => void {
  const original = (globalThis as { PointerEvent?: typeof PointerEvent }).PointerEvent
  class FakePointerEvent extends MouseEvent {
    pointerType: string
    constructor(type: string, init: MouseEventInit & { pointerType?: string } = {}) {
      super(type, init)
      this.pointerType = init.pointerType ?? "mouse"
    }
  }
  ;(globalThis as { PointerEvent?: unknown }).PointerEvent = FakePointerEvent
  return () => {
    ;(globalThis as { PointerEvent?: unknown }).PointerEvent = original
  }
}
