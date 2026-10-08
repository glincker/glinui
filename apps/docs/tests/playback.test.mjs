import assert from "node:assert/strict"
import { readdirSync, readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { join } from "node:path"
import test from "node:test"

const require = createRequire(import.meta.url)
const ts = require("typescript")
const root = process.cwd()
const read = (path) => readFileSync(join(root, path), "utf8")

function loadTs(path) {
  const { outputText } = ts.transpileModule(read(path), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
  })
  const module = { exports: {} }
  new Function("exports", "module", outputText)(module.exports, module)
  return module.exports
}

const math = loadTs("src/components/playback/playback-math.ts")
const metaSource = read("src/lib/playback-meta.ts")
const meta = loadTs("src/lib/playback-meta.ts").playbackMeta

function animatedIds() {
  const primitives = read("src/lib/primitives.ts")
  const sig = primitives.match(/export const signatureComponentIds = \[([\s\S]*?)\]/)[1]
  const signature = [...sig.matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1])
  const taxonomy = read("src/lib/taxonomy.ts")
  const extra = taxonomy.match(/ANIMATED_EXTRA[^=]*= new Set\(\[([\s\S]*?)\]\)/)[1]
  return [...new Set([...signature, ...[...extra.matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1])])]
}

test("playbackMeta covers every animated id", () => {
  const ids = animatedIds()
  assert.ok(ids.length > 40)
  const missing = ids.filter((id) => !meta[id])
  assert.deepEqual(missing, [])
})

test("playbackMeta entries are well formed and continuous ones do not loop", () => {
  for (const [id, entry] of Object.entries(meta)) {
    assert.ok(["waapi", "none"].includes(entry.scrub), id)
    assert.equal(typeof entry.durationMs, "number", id)
    if (entry.continuous) assert.equal(entry.loopable, false, `${id} is continuous`)
  }
  for (const id of ["typewriter", "number-ticker", "count-up", "reveal", "blur-fade", "hyper-text", "text-reveal", "split-text", "stagger-list", "terminal"]) {
    assert.equal(meta[id].oneShot, true, id)
  }
  for (const id of ["word-rotate", "marquee", "meteor-shower", "flickering-grid", "shine-border", "border-beam"]) {
    assert.equal(meta[id].oneShot, false, id)
    assert.equal(meta[id].loopable, false, id)
  }
  assert.equal(meta.typewriter.scrub, "none")
  assert.equal(meta["blur-fade"].scrub, "waapi")
})

test("loop period never cuts an animation off", () => {
  assert.equal(math.loopPeriodMs("once", 1000), null)
  assert.equal(math.loopPeriodMs("loop-4", 1000), 4000)
  assert.equal(math.loopPeriodMs("loop-3", 6000), 6000 + math.LOOP_HOLD_MS)
  assert.equal(math.loopPeriodMs("loop-6", 0), 6000)
  assert.equal(math.wallPeriodMs(4000, 2), 2000)
  assert.equal(math.wallPeriodMs(4000, 0.5), 8000)
})

test("scrub and clock math", () => {
  assert.equal(math.fractionToTime(0.5, 2000), 1000)
  assert.equal(math.fractionToTime(3, 2000), 2000)
  assert.equal(math.fractionToTime(-1, 2000), 0)
  assert.equal(math.timeToFraction(500, 0), 0)
  assert.equal(math.timeToFraction(500, 1000), 0.5)
  assert.equal(math.scrubSpanMs([{ endTime: 700, duration: 500 }, { endTime: Infinity, duration: 14000 }]), 14000)
  assert.equal(math.advanceElapsed(100, 100, 2, null), 300)
  assert.equal(math.advanceElapsed(900, 400, 1, 1000), 1000)
  assert.equal(math.shouldRestart(4000, 4000), true)
  assert.equal(math.shouldRestart(3999, 4000), false)
  assert.equal(math.shouldRestart(99999, null), false)
  assert.equal(math.formatReadout(3, 2400), "cycle 3 · 2.4s")
})

const playbackFiles = readdirSync(join(root, "src/components/playback")).filter((f) => /\.(tsx?|mjs)$/.test(f))
const sources = playbackFiles.map((f) => ({ f, text: read(`src/components/playback/${f}`) }))
sources.push({ f: "playback-meta.ts", text: metaSource })

test("playback sources have no inline style attributes, em/en dashes or any", () => {
  for (const { f, text } of sources) {
    assert.ok(!/\bstyle=/.test(text), `${f} has inline style`)
    assert.ok(!/[\u2013\u2014]/.test(text), `${f} has a dash character`)
    assert.ok(!/:\s*any\b|\bas any\b|<any>/.test(text), `${f} uses any`)
    assert.ok(text.split("\n").length < 500, `${f} too long`)
  }
})

test("playback components use Phosphor icons only", () => {
  for (const { f, text } of sources) {
    for (const m of text.matchAll(/import[^;]*from "([^"]+)"/g)) {
      assert.ok(!/lucide|react-icons|heroicons|tabler/.test(m[1]), `${f} imports ${m[1]}`)
    }
  }
  assert.match(read("src/components/playback/playback-bar.tsx"), /@phosphor-icons\/react/)
})

test("reduced motion, motion level and lifecycle handling are present", () => {
  const env = read("src/components/playback/use-motion-environment.ts")
  assert.match(env, /prefers-reduced-motion: reduce/)
  assert.match(env, /data-glin-motion/)
  const ctx = read("src/components/playback/playback-context.tsx")
  assert.match(ctx, /IntersectionObserver/)
  assert.match(ctx, /visibilitychange/)
  assert.match(ctx, /clearInterval/)
  assert.match(ctx, /getAnimations/)
  assert.match(ctx, /data-playback/)
  assert.match(read("src/components/playback/playback-storage.ts"), /glin-docs-playback/)
  assert.match(read("src/components/docs/preview-frame.tsx"), /StagePlaybackProvider/)
})

test("engine-aware flags cover exactly the engine components", () => {
  const aware = Object.keys(meta).filter((id) => meta[id].engineAware).sort()
  assert.deepEqual(aware, [
    "bento-grid",
    "blur-fade",
    "count-up",
    "hyper-text",
    "number-ticker",
    "reveal",
    "reveal-text",
    "split-text",
    "stagger-list",
    "terminal",
    "text-reveal",
    "typewriter",
    "word-rotate"
  ])
  for (const id of ["sparkles-text", "morphing-text", "marquee", "shine-border", "border-beam", "animated-beam", "orbiting-circles", "meteor-shower"]) {
    assert.ok(meta[id].engineNote, `${id} documents why it is css only`)
  }
})

test("minimal pill: bottom-center controls, progress line, engine switcher", () => {
  const bar = read("src/components/playback/playback-bar.tsx")
  assert.match(bar, /bottom-4/)
  assert.ok(!/left-2\.5 top-2\.5/.test(bar), "nothing in the top-left")
  assert.ok(!/formatReadout/.test(bar), "no cycle readout in the UI")
  for (const icon of ["ArrowCounterClockwise", "Pause", "Play", "Repeat", "SlidersHorizontal"]) assert.match(bar, new RegExp(icon))
  assert.match(bar, /aria-pressed/)
  assert.match(bar, /Popover/)
  const progress = read("src/components/playback/playback-progress.tsx")
  assert.match(progress, /scaleX/)
  assert.match(progress, /role=\{scrubbable \? "slider" : "progressbar"\}/)
  assert.match(progress, /ArrowRight/)
  const sw = read("src/components/playback/engine-switcher.tsx")
  assert.match(sw, /register-engines/)
  assert.match(sw, /name="css3"|brand: "css3"/)
  assert.match(sw, /brand: "gsap"/)
  assert.match(sw, /aria-pressed/)
  assert.match(read("src/components/docs/example-block.tsx"), /EngineSwitcher/)
  assert.match(read("src/components/docs/preview-frame.tsx"), /EngineSwitcher/)
})
