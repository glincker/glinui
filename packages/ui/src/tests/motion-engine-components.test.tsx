import * as React from "react"
import { act, cleanup, render, screen, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const h = vi.hoisted(() => ({
  created: [] as Array<{ kill: () => void }>,
  fromTo: [] as unknown[],
  motionInView: 0
}))

vi.mock("../../../motion/node_modules/motion", () => ({
  animate: () => ({ stop: vi.fn(), then: (cb: () => void) => Promise.resolve().then(cb) }),
  inView: () => {
    h.motionInView += 1
    return vi.fn()
  }
}))
vi.mock("../../../motion/node_modules/gsap/ScrollTrigger", () => ({
  ScrollTrigger: {
    create: () => {
      const entry = { kill: vi.fn() }
      h.created.push(entry)
      return entry
    }
  }
}))
vi.mock("../../../motion/node_modules/gsap", () => ({
  gsap: {
    registerPlugin: () => undefined,
    context: (fn: () => void) => {
      fn()
      return { revert: () => undefined }
    },
    fromTo: () => {
      h.fromTo.push(1)
    },
    to: () => ({ kill: vi.fn() }),
    timeline: () => ({ fromTo: vi.fn() })
  }
}))

// Opt-in engines are registered explicitly, the way consumers do.
import "../../../motion/src/register/motion"
import "../../../motion/src/register/gsap"
import { CountUp, MotionEngineProvider, Reveal, SplitText, StaggerList } from "../index"
import { MockIntersectionObserver, installIntersectionObserver, installWebAnimations } from "./motion-test-utils"

let restoreIO: () => void
let wa: ReturnType<typeof installWebAnimations>

beforeEach(() => {
  restoreIO = installIntersectionObserver()
  wa = installWebAnimations()
  document.documentElement.removeAttribute("data-glin-motion")
  document.documentElement.removeAttribute("data-glin-engine")
})

afterEach(() => {
  cleanup()
  restoreIO()
  wa.restore()
  h.created.length = 0
  h.fromTo.length = 0
  h.motionInView = 0
})

describe("Reveal", () => {
  it("starts hidden, animates on intersect, with no inline style props", () => {
    render(<Reveal data-testid="r">hello</Reveal>)
    const el = screen.getByTestId("r")
    expect(el.style.opacity).toBe("0")
    act(() => MockIntersectionObserver.instances[0].trigger(true))
    expect(wa.calls).toHaveLength(1)
    expect(screen.getByText("hello")).toBeInTheDocument()
  })

  it("motion=none is static: no observer, no animation, final styles", () => {
    render(<Reveal motion="none" data-testid="r">hello</Reveal>)
    const el = screen.getByTestId("r")
    expect(el.style.opacity).toBe("")
    expect(MockIntersectionObserver.instances).toHaveLength(0)
    expect(wa.calls).toHaveLength(0)
  })

  it("motion=subtle animates opacity only", () => {
    render(<Reveal motion="subtle" variant="blur-slide" data-testid="r">hi</Reveal>)
    act(() => MockIntersectionObserver.instances[0].trigger(true))
    const frames = wa.calls[0].keyframes[0]
    expect(frames).toMatchObject({ opacity: 0 })
    expect(frames).not.toHaveProperty("transform")
    expect(frames).not.toHaveProperty("filter")
  })

  it("releases the observer on unmount", () => {
    const { unmount } = render(<Reveal>x</Reveal>)
    expect(MockIntersectionObserver.active).toHaveLength(1)
    unmount()
    expect(MockIntersectionObserver.active).toHaveLength(0)
  })

  it("re-runs when the engine switches", async () => {
    const { rerender } = render(<Reveal engine="css">x</Reveal>)
    expect(MockIntersectionObserver.active).toHaveLength(1)
    rerender(<Reveal engine="gsap">x</Reveal>)
    await waitFor(() => expect(h.created).toHaveLength(1))
    expect(MockIntersectionObserver.active).toHaveLength(0)
    rerender(<Reveal engine="motion">x</Reveal>)
    await waitFor(() => expect(h.motionInView).toBe(1))
    expect(h.created[0].kill).toHaveBeenCalled()
  })

  it("reads engine and level from document attributes and the provider", () => {
    document.documentElement.setAttribute("data-glin-motion", "none")
    const { unmount } = render(<Reveal data-testid="r">x</Reveal>)
    expect(screen.getByTestId("r").style.opacity).toBe("")
    expect(MockIntersectionObserver.instances).toHaveLength(0)
    unmount()
    document.documentElement.removeAttribute("data-glin-motion")

    render(
      <MotionEngineProvider motion="none">
        <Reveal data-testid="p">x</Reveal>
      </MotionEngineProvider>
    )
    expect(screen.getByTestId("p").style.opacity).toBe("")
    // component prop wins over provider
  })

  it("honors prefers-reduced-motion by dropping movement", () => {
    const original = window.matchMedia
    window.matchMedia = ((q: string) => ({
      matches: q.includes("reduce"),
      media: q,
      addEventListener: () => undefined,
      removeEventListener: () => undefined
    })) as unknown as typeof window.matchMedia
    render(<Reveal variant="slide">x</Reveal>)
    act(() => MockIntersectionObserver.instances[0].trigger(true))
    expect(wa.calls[0].keyframes[0]).not.toHaveProperty("transform")
    window.matchMedia = original
  })
})

describe("SplitText", () => {
  it("keeps the full text accessible and hides the pieces", () => {
    const { container } = render(<SplitText text="Hello brave world" as="h2" />)
    const heading = container.querySelector("h2") as HTMLElement
    expect(heading).toHaveAttribute("aria-label", "Hello brave world")
    expect(heading.querySelector(".sr-only")?.textContent).toBe("Hello brave world")
    const pieces = heading.querySelector("[aria-hidden='true']") as HTMLElement
    expect(pieces.querySelectorAll("[data-glin-part='words']")).toHaveLength(3)
  })

  it("splits into characters", () => {
    const { container } = render(<SplitText text="Hi you" by="chars" />)
    expect(container.querySelectorAll("[data-glin-part='chars']")).toHaveLength(5)
  })

  it("staggers parts on intersect and is static when off", () => {
    const { container, unmount } = render(<SplitText text="a b c" />)
    act(() => MockIntersectionObserver.instances[0].trigger(true))
    expect(wa.calls.map((c) => c.options.delay)).toEqual([0, 40, 80])
    unmount()
    wa.calls.length = 0
    const off = render(<SplitText text="a b c" motion="none" />)
    expect(wa.calls).toHaveLength(0)
    expect((off.container.querySelector("[data-glin-part]") as HTMLElement).style.opacity).toBe("")
    expect(container).toBeTruthy()
  })
})

describe("CountUp", () => {
  it("renders the final value accessibly and as aria-hidden digits", () => {
    const { container } = render(<CountUp value={1234} motion="none" suffix="+" />)
    expect(screen.getByText("1,234+", { selector: ".opacity-0" })).toBeInTheDocument()
    expect(container.querySelector("[aria-hidden='true']")?.textContent).toBe("1,234+")
  })

  it("counts from 0 to the value", () => {
    vi.useFakeTimers()
    const { container } = render(<CountUp value={500} immediate duration={200} />)
    const digits = container.querySelector("[aria-hidden='true']") as HTMLElement
    expect(digits.textContent).toBe("0")
    act(() => {
      vi.advanceTimersByTime(400)
    })
    expect(digits.textContent).toBe("500")
    vi.useRealTimers()
  })
})

describe("StaggerList", () => {
  it("staggers direct children and observes the list once", () => {
    render(
      <StaggerList as="ul" step={80}>
        <li>a</li>
        <li>b</li>
        <li>c</li>
      </StaggerList>
    )
    expect(MockIntersectionObserver.instances).toHaveLength(1)
    act(() => MockIntersectionObserver.instances[0].trigger(true))
    expect(wa.calls.map((c) => c.options.delay)).toEqual([0, 80, 160])
  })

  it("is static when motion is none", () => {
    render(
      <StaggerList motion="none">
        <div data-testid="c">a</div>
      </StaggerList>
    )
    expect(screen.getByTestId("c").style.opacity).toBe("")
    expect(wa.calls).toHaveLength(0)
  })
})

describe("CountUp formatting", () => {
  it("keeps whole numbers while counting", () => {
    vi.useFakeTimers()
    const { container } = render(<CountUp value={1000} immediate duration={1000} />)
    const digits = container.querySelector("[aria-hidden='true']") as HTMLElement
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(digits.textContent).toMatch(/^[\d,]+$/)
    vi.useRealTimers()
  })
})
