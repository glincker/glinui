import { registerEngine } from "../engine"

/** Side-effect module: registers the optional "gsap" engine. The library is only fetched when selected. */
registerEngine("gsap", () => import("../engines/gsap").then((m) => m.gsapEngine))
