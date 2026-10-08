import { execFileSync } from "node:child_process"
import { mkdirSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")

/** Compile src/styles/entry.css into `out` (minified, imports inlined). */
export function buildStyles(out = resolve(root, "dist/styles.css")) {
  mkdirSync(dirname(out), { recursive: true })
  const bin = resolve(root, "node_modules/.bin/tailwindcss")
  execFileSync(
    bin,
    ["-c", "tailwind.styles.config.cjs", "-i", "src/styles/entry.css", "-o", out, "--minify"],
    { cwd: root, stdio: "pipe", env: { ...process.env, NODE_ENV: "production" } }
  )
  return out
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(`[styles] wrote ${buildStyles()}`)
}
