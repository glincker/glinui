import * as React from "react"
import { render, screen } from "@testing-library/react"

import {
  SURFACE_TONES,
  SURFACE_VARIANTS,
  ThemeScope,
  interactiveSurface,
  liftHeader,
  liftPill,
  liftShell,
  liftWell,
  resolveSurfaceVariant,
  resolveVariant,
  surfaceVariants
} from "../src"

describe("surfaceVariants", () => {
  it("defaults to glinr neutral and keeps solid as neutral black and white with depth", () => {
    const cls = surfaceVariants()
    expect(cls).toContain("var(--ring)")
    expect(cls).toContain("[--t-bg:var(--neutral-solid)]")
    expect(cls).toContain("[box-shadow:var(--sh-1)]")
    const solid = surfaceVariants({ variant: "solid" })
    expect(solid).toContain("[--face:var(--t-bg)]")
    expect(solid).toContain("var(--ring-solid)")
  })

  it("plain is flat: no ring, no highlight, small radius, no elevation shadow", () => {
    const plain = surfaceVariants({ variant: "plain" })
    expect(plain).toContain("rounded-md")
    expect(plain).not.toContain("[background:")
    expect(plain).not.toContain("--ring-solid")
    expect(plain).not.toContain("solid-hl")
    expect(plain).not.toContain("[box-shadow:var(--sh-1)]")
    const interactive = interactiveSurface({ variant: "plain" })
    expect(interactive).toContain("color-mix(in_oklab,var(--t-bg)_90%,transparent)")
    expect(interactive).not.toContain("active:scale")
  })

  it("builds every variant x tone without throwing and without invalid opacity steps", () => {
    for (const variant of SURFACE_VARIANTS) {
      for (const tone of SURFACE_TONES) {
        const cls = surfaceVariants({ variant, tone })
        expect(cls.length).toBeGreaterThan(0)
        expect(cls).not.toMatch(/\]\/\d/)
        expect(cls).not.toMatch(/\/24\b/)
        expect(cls).not.toMatch(/[–—]/)
      }
    }
  })

  it("glass reads the readable opacity floor and respects tone text", () => {
    expect(surfaceVariants({ variant: "glass" })).toContain("bg-[var(--glass-readable)]")
    expect(surfaceVariants({ variant: "glass", tone: "danger" })).toContain("text-[color:var(--t-text)]")
  })

  it("outline and ghost carry no default shadow; elevation overrides", () => {
    expect(surfaceVariants({ variant: "outline" })).not.toContain("[box-shadow:var(--sh-1)]")
    expect(surfaceVariants({ variant: "ghost", elevation: "2" })).toContain("[box-shadow:var(--sh-2)]")
    expect(surfaceVariants({ variant: "solid", elevation: "none" })).toContain("shadow-none")
  })

  it("interactiveSurface adds hover, press, focus and disabled behavior", () => {
    const cls = interactiveSurface({ variant: "solid" })
    expect(cls).toContain("hover:[--face:var(--t-bg-hover)]")
    expect(cls).toContain("active:scale-[0.98]")
    expect(cls).toContain("focus-visible:ring-2")
    expect(cls).toContain("disabled:opacity-50")
  })
})

describe("resolveSurfaceVariant", () => {
  it("maps legacy names and passes standard names through", () => {
    expect(resolveSurfaceVariant("default")).toEqual({ variant: "solid" })
    expect(resolveSurfaceVariant("primary")).toEqual({ variant: "solid", tone: "accent" })
    expect(resolveSurfaceVariant("ghost")).toEqual({ variant: "ghost" })
    expect(resolveSurfaceVariant("liquid")).toEqual({ variant: "solid" })
    expect(resolveSurfaceVariant(undefined, "soft")).toEqual({ variant: "soft" })
  })
})

describe("ThemeScope", () => {
  it("sets theme, luminance and surface attributes with no added semantics", () => {
    render(
      <ThemeScope theme="dark" luminance="dim" surface="glass" fill data-testid="scope">
        content
      </ThemeScope>
    )
    const el = screen.getByTestId("scope")
    expect(el.getAttribute("data-glin-theme")).toBe("dark")
    expect(el.getAttribute("data-glass-luminance")).toBe("dim")
    expect(el.getAttribute("data-glin-surface")).toBe("glass")
    expect(el.hasAttribute("data-glin-fill")).toBe(true)
    expect(el.className).toContain("dark")
    expect(el.getAttribute("role")).toBeNull()
  })

  it("inherit adds no theme attribute and asChild renders onto the child", () => {
    render(
      <ThemeScope theme="inherit" asChild>
        <section data-testid="child">x</section>
      </ThemeScope>
    )
    const el = screen.getByTestId("child")
    expect(el.tagName).toBe("SECTION")
    expect(el.hasAttribute("data-glin-theme")).toBe(false)
  })

  it("light scope sets the light attribute", () => {
    render(<ThemeScope theme="light" data-testid="l" />)
    expect(screen.getByTestId("l").getAttribute("data-glin-theme")).toBe("light")
  })
})

describe("resolveVariant (ambient style)", () => {
  it("maps each style to its default and lets explicit variants win", () => {
    expect(resolveVariant(undefined, "glinr")).toBe("glinr")
    expect(resolveVariant(undefined, "minimal")).toBe("plain")
    expect(resolveVariant(undefined, "glass")).toBe("glass")
    expect(resolveVariant("default", "minimal", "control")).toBe("plain")
    expect(resolveVariant("outline", "glass")).toBe("outline")
    expect(resolveVariant("primary", "glinr")).toBe("solid")
    expect(resolveVariant(undefined)).toBe("glinr")
  })
})

describe("lift builders", () => {
  it("shell uses the gradient hairline ring, well is concentric and inset, pills are round", () => {
    expect(liftShell()).toContain("[--ring-img:var(--ring)]")
    expect(liftShell()).toContain("rounded-[var(--lift-r-outer)]")
    expect(liftWell()).toContain("rounded-[var(--lift-r-inner)]")
    expect(liftWell()).toContain("var(--elev-inset)")
    expect(liftHeader()).toContain("border-b")
    expect(liftPill({ kind: "track" })).toContain("rounded-full")
    expect(liftPill({ kind: "key" })).toContain("active:translate-y-px")
  })
})
