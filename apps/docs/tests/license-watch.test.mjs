import assert from "node:assert/strict"
import test from "node:test"
import { loadProvenanceSources } from "../../../packages/registry/scripts/load-registry-source.mjs"
import { runCheck, renderReport, suggestStatus } from "../scripts/check-upstream-licenses.mjs"

const sources = loadProvenanceSources()

test("offline mode verifies the local snapshots only and never calls fetch", async () => {
  const report = await runCheck({
    sources,
    offline: true,
    fetchImpl: () => {
      throw new Error("network used in offline mode")
    }
  })
  assert.equal(report.exitCode, 0)
  assert.equal(report.offline, true)
  assert.ok(report.results.every((r) => r.changes.length === 0))
})

test("offline mode flags a snapshot hash mismatch and suggests nothing destructive", async () => {
  const tampered = { "magic-ui": { ...sources["magic-ui"], licenseSha256: "0".repeat(64) } }
  const report = await runCheck({ sources: tampered, offline: true })
  assert.equal(report.exitCode, 1)
  assert.equal(report.results[0].changes[0].kind, "snapshot-mismatch")
  assert.match(renderReport(report), /CHANGED/)
})

function response(status, body) {
  return { status, ok: status >= 200 && status < 300, text: async () => body, json: async () => body }
}

test("online mode detects an upstream license edit, archiving and renames", async () => {
  const source = sources["magic-ui"]
  const fetchImpl = async (url) => {
    if (url.startsWith("https://raw.githubusercontent.com")) return response(200, "changed license")
    if (url.endsWith("/license")) return response(200, { license: { spdx_id: "NOASSERTION" } })
    return response(200, { archived: true, full_name: "someone/else" })
  }
  const report = await runCheck({ sources: { "magic-ui": source }, fetchImpl })
  const kinds = report.results[0].changes.map((c) => c.kind)
  assert.deepEqual(kinds.sort(), ["license-changed", "license-spdx-changed", "repo-archived", "repo-renamed"].sort())
  assert.equal(report.results[0].suggestedStatus, "relicensed")
  assert.equal(report.exitCode, 1)
})

test("a deleted repository suggests gone, and network failures exit 2 without a verdict", async () => {
  const gone = async (url) => (url.startsWith("https://raw") ? response(404, "") : response(404, null))
  const report = await runCheck({ sources: { "magic-ui": sources["magic-ui"] }, fetchImpl: gone })
  assert.equal(report.results[0].suggestedStatus, "gone")

  const down = async () => {
    throw new Error("offline")
  }
  const failed = await runCheck({ sources: { "magic-ui": sources["magic-ui"] }, fetchImpl: down })
  assert.equal(failed.exitCode, 2)
  assert.equal(failed.changed, false)
})

test("suggestStatus keeps the current status when nothing changed", () => {
  assert.equal(suggestStatus([], "active"), "active")
  assert.equal(suggestStatus([{ kind: "repo-archived" }], "active"), "archived")
})
