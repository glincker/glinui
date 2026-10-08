#!/usr/bin/env node
/**
 * Manual IndexNow ping. Never runs from build or CI.
 *   pnpm --filter @glinui/docs seo:ping                 dry run: prints the URL list and payload
 *   pnpm --filter @glinui/docs seo:ping --send          POST the list to api.indexnow.org
 *   --sitemap <file|url>                                 default: out/sitemap.xml if built, else the live sitemap
 * The key file lives in public/<key>.txt and must contain exactly the key.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs"
import { join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const docsRoot = resolve(fileURLToPath(new URL("..", import.meta.url)))
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://glinui.com").replace(/\/+$/, "")
const args = process.argv.slice(2)
const send = args.includes("--send")
const sitemapArg = args.includes("--sitemap") ? args[args.indexOf("--sitemap") + 1] : null

function findKey() {
  const file = readdirSync(join(docsRoot, "public")).find((name) => /^[0-9a-f]{32}\.txt$/.test(name))
  if (!file) throw new Error("No IndexNow key file (public/<32 hex>.txt) found")
  const key = file.replace(/\.txt$/, "")
  if (readFileSync(join(docsRoot, "public", file), "utf8").trim() !== key) throw new Error(`${file} must contain its own name as the key`)
  return key
}

async function loadSitemap() {
  const source = sitemapArg ?? (existsSync(join(docsRoot, "out", "sitemap.xml")) ? join(docsRoot, "out", "sitemap.xml") : `${SITE_URL}/sitemap.xml`)
  if (/^https?:\/\//.test(source)) {
    const res = await fetch(source)
    if (!res.ok) throw new Error(`Could not fetch ${source}: ${res.status}`)
    return res.text()
  }
  return readFileSync(source, "utf8")
}

const key = findKey()
const xml = await loadSitemap()
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())
if (urlList.length === 0) throw new Error("No <loc> entries found in the sitemap")

const payload = { host: new URL(SITE_URL).host, key, keyLocation: `${SITE_URL}/${key}.txt`, urlList }
console.log(`[seo-ping] ${urlList.length} URLs for ${payload.host}`)

if (!send) {
  console.log(urlList.slice(0, 5).join("\n"), urlList.length > 5 ? `\n... and ${urlList.length - 5} more` : "")
  console.log("[seo-ping] dry run, nothing sent. Pass --send to POST to api.indexnow.org.")
} else {
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload)
  })
  console.log(`[seo-ping] api.indexnow.org responded ${res.status} ${res.statusText}`)
  if (!res.ok && res.status !== 202) process.exitCode = 1
}
