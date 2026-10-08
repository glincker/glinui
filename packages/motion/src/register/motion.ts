import { registerEngine } from "../engine"

/** Side-effect module: registers the optional "motion" engine. The library is only fetched when selected. */
registerEngine("motion", () => import("../engines/motion").then((m) => m.motionEngine))
