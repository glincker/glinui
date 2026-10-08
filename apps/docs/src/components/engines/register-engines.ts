"use client"

// Opt-in engines for the docs site. The core package only ships the css engine.
//
// Equivalent to `import "@glinui/motion/register/motion"` and `".../gsap"`. It registers
// through the same `@glinui/motion` entry the components use: this app maps that entry to
// source via tsconfig paths, so the dist-based register modules would write to a second,
// separate engine registry. Each library is only fetched when the engine is selected.
import { hasEngine, registerEngine } from "@glinui/motion"

if (!hasEngine("motion")) {
  registerEngine("motion", () => import("@glinui/motion/engines/motion").then((m) => m.motionEngine))
}
if (!hasEngine("gsap")) {
  registerEngine("gsap", () => import("@glinui/motion/engines/gsap").then((m) => m.gsapEngine))
}
