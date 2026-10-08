import { writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { renderCss, renderTs } from "./bases.mjs"

const root = fileURLToPath(new URL("..", import.meta.url))
writeFileSync(`${root}bases.css`, renderCss())
writeFileSync(`${root}src/bases.ts`, renderTs())
console.log("bases.css and src/bases.ts written")
