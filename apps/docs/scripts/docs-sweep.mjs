#!/usr/bin/env node
/**
 * Token-cheap docs QA sweep driven by the `agent-browser` CLI.
 * Usage: node scripts/docs-sweep.mjs [--filter s] [--theme light|dark|both] [--viewport desktop|mobile|both]
 *        [--limit N] [--out file.json] [--shots] [--base http://localhost:3002] [--fresh]
 * Resumes from --out (default docs-local/sweep-results.json). Writes docs-local/sweep-report.md.
 * Read-only against the app: only reads pages and writes under docs-local/.
 */
import { spawnSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync, appendFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const docsRoot = join(here, "..")
const repoRoot = join(docsRoot, "..", "..")
const localDir = join(repoRoot, "docs-local")
const SESSION = "sweep"
const PAGE_TIMEOUT_MS = 45_000
const SETTLE_MS = 1500

const args = process.argv.slice(2)
const flag = (n) => args.includes(`--${n}`)
const opt = (n, d) => {
  const i = args.indexOf(`--${n}`)
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : d
}
const filter = opt("filter", "")
const themeOpt = opt("theme", "both")
const vpOpt = opt("viewport", "both")
const limit = Number(opt("limit", "0")) || 0
const base = opt("base", "http://localhost:3002").replace(/\/$/, "")
const outFile = opt("out", join(localDir, "sweep-results.json"))
const reportFile = join(localDir, "sweep-report.md")
const shotsDir = join(localDir, "sweep-shots")
const themes = themeOpt === "both" ? ["light", "dark"] : [themeOpt]
const allVps = { desktop: [1440, 900], mobile: [390, 844] }
const vps = vpOpt === "both" ? ["desktop", "mobile"] : [vpOpt]

// ---------- agent-browser wrapper ----------
function ab(cmdArgs, { input, timeout = PAGE_TIMEOUT_MS } = {}) {
  const r = spawnSync("agent-browser", ["--session", SESSION, ...cmdArgs], {
    input,
    encoding: "utf8",
    timeout,
    maxBuffer: 16 * 1024 * 1024
  })
  if (r.error) throw new Error(`${cmdArgs[0]}: ${r.error.code || r.error.message}`)
  return { code: r.status, out: r.stdout || "", err: r.stderr || "" }
}
function abJson(cmdArgs, opts) {
  const r = ab([...cmdArgs, "--json"], opts)
  let j
  try {
    j = JSON.parse(r.out)
  } catch {
    throw new Error(`${cmdArgs[0]}: bad output ${r.out.slice(0, 80)} ${r.err.slice(0, 80)}`)
  }
  if (!j.success) throw new Error(`${cmdArgs[0]}: ${String(j.error).slice(0, 120)}`)
  return j.data
}

// ---------- URL list ----------
async function loadAnimIds() {
  try {
    const m = await import(pathToFileURL(join(docsRoot, "src/lib/playback-meta.ts")).href)
    const ids = new Set()
    for (const [id, meta] of Object.entries(m.playbackMeta)) if (meta.oneShot || meta.continuous) ids.add(id)
    return ids
  } catch {
    const src = readFileSync(join(docsRoot, "src/lib/playback-meta.ts"), "utf8")
    const ids = new Set()
    for (const mm of src.matchAll(/^\s*"?([\w-]+)"?:\s*(?:engineAware\(|cssOnly\()*(oneShot|continuous)\(/gm)) ids.add(mm[1])
    return ids
  }
}

async function buildUrls() {
  const urls = new Set(["/"])
  // 1) sitemap from the running dev server
  try {
    const r = await fetch(`${base}/sitemap.xml`)
    const xml = await r.text()
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      try {
        urls.add(new URL(m[1]).pathname.replace(/\/$/, "") || "/")
      } catch {}
    }
  } catch {}
  // 2) static routes under src/app/docs
  const walk = (dir, route) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name)
      if (!statSync(p).isDirectory()) continue
      if (/[[(@_]/.test(name)) continue
      const rr = `${route}/${name}`
      if (existsSync(join(p, "page.tsx")) || existsSync(join(p, "page.mdx"))) urls.add(rr)
      walk(p, rr)
    }
  }
  walk(join(docsRoot, "src/app/docs"), "/docs")
  // 3) component ids from lib
  const src = readFileSync(join(docsRoot, "src/lib/primitives.ts"), "utf8")
  const block = (name) => {
    const m = src.match(new RegExp(`export const ${name}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s*as const`))
    return m ? [...m[1].matchAll(/"([\w-]+)"/g)].map((x) => x[1]) : []
  }
  const newSrc = readFileSync(join(docsRoot, "src/lib/new-component-ids.ts"), "utf8")
  const newIds = [...(newSrc.match(/export const newComponentIds\s*=\s*\[([\s\S]*?)\]/)?.[1] ?? "").matchAll(/"([\w-]+)"/g)].map((x) => x[1])
  for (const id of [...block("primitiveComponentIds"), ...newIds]) urls.add(`/docs/components/radix/${id}`)
  for (const id of block("signatureComponentIds")) urls.add(`/docs/components/${id}`)
  for (const u of ["/docs/ai", "/docs/variants", "/docs/animations", "/docs/colors"]) urls.add(u)
  return [...urls].sort()
}

// ---------- in-page checks ----------
const CHECK_SRC = String.raw`
(async (cfg) => {
  const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  const cache = new Map();
  const rgba = (s) => {
    if (cache.has(s)) return cache.get(s);
    cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = s; cx.fillRect(0, 0, 1, 1);
    const d = cx.getImageData(0, 0, 1, 1).data;
    const a = d[3] / 255; const v = a ? [d[0], d[1], d[2], a] : [0, 0, 0, 0];
    cache.set(s, v); return v;
  };
  const lum = (c) => { const f = (x) => { x /= 255; return x <= .03928 ? x / 12.92 : Math.pow((x + .055) / 1.055, 2.4); }; return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]); };
  const sel = (el) => { if (!el || !el.tagName) return '?'; let s = el.tagName.toLowerCase(); if (el.id) return s + '#' + el.id; const c = (el.getAttribute('class') || '').split(/\s+/).filter((x) => x && !/[\[\]:/]/.test(x)).slice(0, 2); return s + (c.length ? '.' + c.join('.') : ''); };
  const vis = (el) => { const r = el.getBoundingClientRect(); if (r.width <= 0 || r.height <= 0) return false; const cs = getComputedStyle(el); return cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const effOpacity = (el, stop) => { let o = 1; for (let e = el; e && e !== stop?.parentElement; e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity); return o; };
  const f = {};
  const note = (k, v) => { (f[k] = f[k] || []).push(v); };

  // next error overlay
  const portal = document.querySelector('nextjs-portal');
  const txt = document.body ? document.body.innerText.slice(0, 20000) : '';
  const inShadow = portal && portal.shadowRoot && portal.shadowRoot.querySelector('[data-nextjs-dialog],[data-nextjs-dialog-overlay],[data-nextjs-toast-errors]');
  if (document.querySelector('[data-nextjs-dialog]') || inShadow || /Application error|Unhandled Runtime Error|This page could not be found|Internal Server Error/.test(txt))
    note('error-overlay', (txt.match(/Application error[^\n]*|Unhandled Runtime Error[^\n]*|This page could not be found|Internal Server Error/) || ['overlay'])[0].slice(0, 60));

  // title + h1
  if (!document.title || !document.title.trim()) note('no-title', 'empty <title>');
  if (!document.querySelector('h1')) note('no-title', 'no <h1>');

  // overflow
  const de = document.documentElement;
  if (de.scrollWidth > de.clientWidth + 1) {
    let best = null, bw = 0;
    for (const el of document.body.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.right <= de.clientWidth + 1 || r.right <= bw) continue;
      let clipped = false;
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o !== 'visible') { clipped = true; break; } }
      const pos = getComputedStyle(el).position;
      if (clipped || pos === 'fixed') continue;
      bw = r.right; best = el;
    }
    note('overflow', 'sw=' + de.scrollWidth + ' cw=' + de.clientWidth + ' ' + (best ? sel(best) + ' right=' + Math.round(bw) : 'unknown'));
  }

  // stages
  const stages = [...document.querySelectorAll('[data-stage-controls]')].map((c) => c.parentElement && c.parentElement.lastElementChild).filter((s, i, a) => s && a.indexOf(s) === i);
  stages.forEach((st, i) => {
    const r = st.getBoundingClientRect();
    if (i === 0 && r.height < 120) note('stage-small', 'h=' + Math.round(r.height));
    const kids = [...st.querySelectorAll('*')].slice(0, 400);
    const sized = kids.filter((e) => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0; });
    if (!sized.length) { note('stage-empty', 'stage#' + i + ' h=' + Math.round(r.height)); return; }
    const shown = sized.filter((e) => getComputedStyle(e).visibility !== 'hidden' && effOpacity(e, st) > 0.02);
    if (!shown.length) note('stage-invisible', 'stage#' + i + ' ' + sized.length + ' sized children, all opacity 0 or hidden');
  });

  // animation (components tagged animated)
  if (cfg.animated && stages[0]) {
    const st = stages[0];
    const live = st.getAnimations ? st.getAnimations({ subtree: true }).length : 0;
    const total = live + (window.__sw ? window.__sw.anims + window.__sw.events + window.__sw.muts : 0);
    if (total === 0) note('no-anim', 'tagged animated, 0 animations/mutations on stage (JS-driven may be false positive)');
  }

  // contrast
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.nodeValue.trim() || !n.parentElement) continue;
    const t = n.parentElement.tagName; if (t === 'SCRIPT' || t === 'STYLE' || t === 'NOSCRIPT') continue;
    if (n.parentElement.closest('nextjs-portal,[aria-hidden="true"]')) continue;
    nodes.push(n);
  }
  const step = Math.max(1, Math.floor(nodes.length / 40)); let sampled = 0, unknown = 0;
  const bad = [];
  for (let i = 0; i < nodes.length && sampled < 40; i += step) {
    const el = nodes[i].parentElement; if (!vis(el)) continue;
    const cs = getComputedStyle(el);
    if (effOpacity(el) < 0.05) continue;
    sampled++;
    // background compositing
    let layers = [], unk = false;
    for (let e = el; e; e = e.parentElement) {
      const s = getComputedStyle(e);
      if (s.backgroundImage !== 'none') { unk = true; break; }
      const c = rgba(s.backgroundColor);
      if (c[3] > 0) { layers.push(c); if (c[3] >= 0.999) break; }
    }
    if (unk) { unknown++; continue; }
    let bg = [255, 255, 255];
    if (!layers.length || layers[layers.length - 1][3] < 0.999) { const dark = de.classList.contains('dark'); bg = dark ? [10, 10, 12] : [255, 255, 255]; }
    for (let k = layers.length - 1; k >= 0; k--) { const c = layers[k]; bg = [c[0] * c[3] + bg[0] * (1 - c[3]), c[1] * c[3] + bg[1] * (1 - c[3]), c[2] * c[3] + bg[2] * (1 - c[3])]; }
    const fg0 = rgba(cs.color); const a = fg0[3] * effOpacity(el);
    const fg = [fg0[0] * a + bg[0] * (1 - a), fg0[1] * a + bg[1] * (1 - a), fg0[2] * a + bg[2] * (1 - a)];
    const L1 = lum(fg), L2 = lum(bg); const ratio = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05);
    const px = parseFloat(cs.fontSize), w = parseInt(cs.fontWeight, 10) || 400;
    const large = px >= 24 || (px >= 18.66 && w >= 700);
    if (ratio < (large ? 3 : 4.5)) bad.push(sel(el) + ' ' + ratio.toFixed(1) + (large ? 'L' : '') + ' "' + nodes[i].nodeValue.trim().slice(0, 18) + '"');
  }
  if (bad.length) note('contrast', bad.length + '/' + sampled + ' ' + bad.slice(0, 3).join('; '));

  // accessible names
  const noName = [];
  for (const el of document.querySelectorAll('button,a[href],[role="button"],[role="link"]')) {
    if (!vis(el) || el.closest('nextjs-portal')) continue;
    let name = (el.getAttribute('aria-label') || '').trim();
    if (!name && el.getAttribute('aria-labelledby')) name = el.getAttribute('aria-labelledby').split(/\s+/).map((id) => (document.getElementById(id) || {}).textContent || '').join('').trim();
    if (!name) name = (el.textContent || '').trim();
    if (!name) name = (el.getAttribute('title') || (el.querySelector('img[alt]') || {}).alt || (el.querySelector('svg title') || {}).textContent || el.value || '').trim();
    if (!name) noName.push(sel(el));
  }
  if (noName.length) note('no-name', noName.length + ' ' + [...new Set(noName)].slice(0, 3).join('; '));

  // images
  const badImg = [];
  for (const im of document.images) {
    if (im.closest('nextjs-portal')) continue;
    if (!im.hasAttribute('alt')) badImg.push('no-alt ' + (im.getAttribute('src') || '').slice(0, 40));
    else if (im.complete && im.naturalWidth === 0 && im.currentSrc) badImg.push('broken ' + im.currentSrc.slice(-40));
  }
  if (badImg.length) note('img', badImg.length + ' ' + badImg.slice(0, 2).join('; '));

  // class compiled away
  const lost = [];
  for (const el of document.querySelectorAll('[class*="[box-shadow:"]')) {
    if (getComputedStyle(el).boxShadow === 'none') lost.push(sel(el));
  }
  if (lost.length) note('box-shadow', lost.length + ' ' + [...new Set(lost)].slice(0, 3).join('; '));

  if (window.__errs && window.__errs.length) note('console', 'window errors: ' + window.__errs.slice(0, 2).join(' | ').slice(0, 140));
  return JSON.stringify({ f, contrastUnknown: unknown });
})
`

const HOOK_SRC = String.raw`
(() => {
  window.__errs = [];
  window.addEventListener('error', (e) => window.__errs.push(String(e.message).slice(0, 100)));
  window.addEventListener('unhandledrejection', (e) => window.__errs.push('rejection ' + String(e.reason).slice(0, 80)));
  const sw = window.__sw = { anims: 0, events: 0, muts: 0 };
  const o = Element.prototype.animate;
  Element.prototype.animate = function () { sw.anims++; return o.apply(this, arguments); };
  document.addEventListener('animationstart', () => sw.events++, true);
  document.addEventListener('transitionstart', () => sw.events++, true);
  const st = [...document.querySelectorAll('[data-stage-controls]')].map((c) => c.parentElement && c.parentElement.lastElementChild)[0];
  if (st) {
    new MutationObserver((m) => { sw.muts += m.length; }).observe(st, { attributes: true, subtree: true, attributeFilter: ['style'] });
    st.scrollIntoView({ block: 'center' });
  }
  return 'ok';
})()
`

const THEME_SRC = (t) =>
  `(async()=>{if(!document.getElementById('sweep-nt')){const st=document.createElement('style');st.id='sweep-nt';st.textContent='*,*::before,*::after{transition:none!important}';document.head.appendChild(st)}const d=document.documentElement;d.classList.toggle('dark',${t === "dark"});d.style.colorScheme='${t}';await new Promise(r=>setTimeout(r,350));return 'ok'})()`

// ---------- per page ----------
const animIds = await loadAnimIds()
const idOf = (u) => u.split("/").pop()
const sleep = (ms) => spawnSync("sleep", [String(ms / 1000)])

function runPage(url, vp) {
  const [w, h] = allVps[vp]
  const out = {}
  ab(["set", "viewport", String(w), String(h)])
  ab(["console", "--clear"])
  const deadline = Date.now() + PAGE_TIMEOUT_MS
  const left = () => Math.max(2000, deadline - Date.now())
  abJson(["open", base + url], { timeout: left() })
  ab(["wait", String(SETTLE_MS)], { timeout: left() })
  const animated = animIds.has(idOf(url)) && /\/docs\/components\//.test(url)
  const aThemes = themes
  abJson(["eval", "--stdin"], { input: HOOK_SRC, timeout: left() })
  if (animated) ab(["wait", "1000"], { timeout: left() })
  aThemes.forEach((t, i) => {
    abJson(["eval", "--stdin"], { input: THEME_SRC(t), timeout: left() })
    const d = abJson(["eval", "--stdin"], { input: `(${CHECK_SRC})({animated:${animated && i === 0}})`, timeout: left() })
    const parsed = JSON.parse(d.result)
    out[t] = parsed
  })
  // console (errors + warnings) attributed to first theme
  try {
    const c = abJson(["console"], { timeout: left() })
    const seen = new Set()
    const msgs = []
    for (const m of c.messages || []) {
      if (m.type !== "error" && m.type !== "warning") continue
      const text = String(m.text).replace(/%c|%s/g, "").replace(/\s+/g, " ").slice(0, 110)
      if (/favicon|Download the React DevTools|\[HMR\]|Fast Refresh/.test(text) || seen.has(text)) continue
      seen.add(text)
      msgs.push(`${m.type[0]}: ${text}`)
    }
    if (msgs.length) {
      const first = out[aThemes[0]]
      first.f.console = [`${msgs.length} ${msgs.slice(0, 2).join(" | ")}`]
    }
    const e = abJson(["errors"], { timeout: left() })
    const pe = (e.errors || []).map((x) => String(x.text ?? x.message ?? x).slice(0, 100))
    if (pe.length) (out[aThemes[0]].f.console = out[aThemes[0]].f.console || []).push("pageerror: " + pe[0])
  } catch {}
  return out
}

function safeRunPage(url, vp) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return runPage(url, vp)
    } catch (e) {
      if (attempt === 1) {
        const r = {}
        for (const t of themes) r[t] = { f: { "load-fail": [String(e.message).slice(0, 100)] }, contrastUnknown: 0 }
        return r
      }
      spawnSync("agent-browser", ["--session", SESSION, "close"], { timeout: 15000 })
    }
  }
}

// ---------- main ----------
mkdirSync(localDir, { recursive: true })
let results = {}
if (existsSync(outFile) && !flag("fresh")) {
  try {
    results = JSON.parse(readFileSync(outFile, "utf8")).results ?? {}
  } catch {}
}
let urls = (await buildUrls()).filter((u) => u.includes(filter))
if (limit) urls = urls.slice(0, limit)
console.log(`sweep: ${urls.length} urls x ${vps.join("+")} x ${themes.join("+")} (resume ${Object.keys(results).length} done)`)
const t0 = Date.now()
let pages = 0
for (const vp of vps) {
  for (const url of urls) {
    if (themes.every((t) => results[`${url}|${vp}|${t}`] && !results[`${url}|${vp}|${t}`].f["load-fail"])) continue
    const r = safeRunPage(url, vp)
    for (const t of themes) results[`${url}|${vp}|${t}`] = r[t]
    pages++
    writeFileSync(outFile, JSON.stringify({ base, results }))
  }
}
const secPerPage = pages ? ((Date.now() - t0) / 1000 / pages).toFixed(1) : "0"

// ---------- report ----------
const wanted = new Set(urls)
const keys = Object.keys(results).filter((k) => {
  const [u, v, t] = k.split("|")
  return wanted.has(u) && vps.includes(v) && themes.includes(t)
})
const byCheck = {}
const failingKeys = new Set()
for (const k of keys) {
  for (const [check, details] of Object.entries(results[k].f)) {
    ;(byCheck[check] = byCheck[check] || []).push({ k, detail: details[0] })
    failingKeys.add(k)
  }
}
const failUrls = new Set([...failingKeys].map((k) => k.split("|")[0]))
const checkNames = ["load-fail", "error-overlay", "overflow", "stage-small", "stage-empty", "stage-invisible", "no-anim", "contrast", "no-name", "img", "box-shadow", "console", "no-title"]
let md = `# Docs sweep report\n\nBase ${base}. ${keys.length} page-states checked (${urls.length} urls), ${failUrls.size} urls with findings. ${new Date().toISOString().slice(0, 16)}Z\n\n| check | states | urls |\n|---|---|---|\n`
for (const c of checkNames) {
  const l = byCheck[c] || []
  md += `| ${c} | ${l.length} | ${new Set(l.map((x) => x.k.split("|")[0])).size} |\n`
}
for (const c of checkNames) {
  const l = byCheck[c]
  if (!l) continue
  md += `\n## ${c}\n\n`
  const grouped = {}
  for (const x of l) {
    const [u, v, t] = x.k.split("|")
    ;(grouped[u] = grouped[u] || []).push(`${v === "desktop" ? "D" : "M"}-${t}`)
    grouped[u].d = grouped[u].d || x.detail
  }
  for (const [u, st] of Object.entries(grouped)) md += `- ${u} [${[...st].join(",")}] ${grouped[u].d}\n`
}
writeFileSync(reportFile, md)

// ---------- screenshots (failing pages only) ----------
if (flag("shots") && failingKeys.size) {
  mkdirSync(shotsDir, { recursive: true })
  const excl = join(repoRoot, ".git", "info", "exclude")
  try {
    const cur = existsSync(excl) ? readFileSync(excl, "utf8") : ""
    if (!cur.includes("docs-local/sweep-shots")) appendFileSync(excl, `${cur.endsWith("\n") || !cur ? "" : "\n"}docs-local/sweep-shots/\ndocs-local/sweep-results.json\n`)
  } catch {}
  const byPage = {}
  for (const k of failingKeys) {
    const [u, v, t] = k.split("|")
    ;(byPage[`${u}|${v}`] = byPage[`${u}|${v}`] || []).push(t)
  }
  for (const [pk, ts] of Object.entries(byPage)) {
    const [u, v] = pk.split("|")
    try {
      ab(["set", "viewport", String(allVps[v][0]), String(allVps[v][1])])
      abJson(["open", base + u])
      ab(["wait", String(SETTLE_MS)])
      for (const t of ts) {
        ab(["eval", "--stdin"], { input: THEME_SRC(t) })
        const name = `${u.replace(/^\/docs\/?/, "").replace(/\W+/g, "_") || "root"}-${v}-${t}.jpg`
        ab(["screenshot", join(shotsDir, name), "--screenshot-format", "jpeg", "--screenshot-quality", "40"])
      }
    } catch (e) {
      console.log(`shot failed ${u}: ${e.message}`)
    }
  }
}
ab(["close"], { timeout: 15000 })

// ---------- summary ----------
console.log(`\nSUMMARY (${pages} pages run, ${secPerPage}s/page, ${keys.length} states)`)
for (const c of checkNames) {
  const l = byCheck[c]
  if (l) console.log(`  ${c.padEnd(16)} ${String(l.length).padStart(4)} states ${String(new Set(l.map((x) => x.k.split("|")[0])).size).padStart(4)} urls`)
}
if (!failingKeys.size) console.log("  all clear")
const seenLine = new Set()
for (const c of checkNames) {
  for (const x of byCheck[c] || []) {
    const [u, v, t] = x.k.split("|")
    const line = `${u} ${v[0]}-${t[0]} ${c}: ${String(x.detail).slice(0, 90)}`
    if (!seenLine.has(line)) {
      seenLine.add(line)
      if (seenLine.size <= 60) console.log(line)
    }
  }
}
if (seenLine.size > 60) console.log(`... ${seenLine.size - 60} more in docs-local/sweep-report.md`)
console.log(`report: docs-local/sweep-report.md`)
