import { Command, InvalidArgumentError } from "commander"
import fs from "fs-extra"
import path from "path"
import pc from "picocolors"
import { fetchRegistryItem, getLastRegistryErrorMessage } from "../registry/api.js"
import { rewriteImports } from "../utils/rewrite-imports.js"
import {
  createResolver,
  loadProjectLayout,
  loadProjectLayoutWithDefaults,
  type ProjectLayout
} from "../utils/project.js"

type DiffLine = {
  kind: "context" | "add" | "remove"
  value: string
  leftNumber?: number
  rightNumber?: number
}

type DiffHunk = {
  oldStart: number
  oldLines: number
  newStart: number
  newLines: number
  lines: DiffLine[]
}

function splitLines(value: string) {
  return value.replace(/\r\n/g, "\n").split("\n")
}

export function parseContextValue(value: string) {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new InvalidArgumentError("context must be a non-negative integer")
  }
  return parsed
}

function isChangeLine(line: DiffLine) {
  return line.kind === "add" || line.kind === "remove"
}

export function createLineDiff(before: string, after: string): DiffLine[] {
  const left = splitLines(before)
  const right = splitLines(after)
  const n = left.length
  const m = right.length

  const dp: number[][] = Array.from({ length: n + 1 }, () => Array.from({ length: m + 1 }, () => 0))

  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      if (left[i] === right[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1])
      }
    }
  }

  const lines: DiffLine[] = []
  let i = 0
  let j = 0
  let leftNumber = 1
  let rightNumber = 1

  while (i < n && j < m) {
    if (left[i] === right[j]) {
      lines.push({ kind: "context", value: left[i], leftNumber, rightNumber })
      i += 1
      j += 1
      leftNumber += 1
      rightNumber += 1
      continue
    }

    if (dp[i + 1][j] >= dp[i][j + 1]) {
      lines.push({ kind: "remove", value: left[i], leftNumber })
      i += 1
      leftNumber += 1
      continue
    }

    lines.push({ kind: "add", value: right[j], rightNumber })
    j += 1
    rightNumber += 1
  }

  while (i < n) {
    lines.push({ kind: "remove", value: left[i], leftNumber })
    i += 1
    leftNumber += 1
  }

  while (j < m) {
    lines.push({ kind: "add", value: right[j], rightNumber })
    j += 1
    rightNumber += 1
  }

  return lines
}

export function createHunks(lines: DiffLine[], contextLines: number): DiffHunk[] {
  const hunks: DiffHunk[] = []
  let cursor = 0

  while (cursor < lines.length) {
    while (cursor < lines.length && !isChangeLine(lines[cursor])) {
      cursor += 1
    }

    if (cursor >= lines.length) {
      break
    }

    const hunkStart = Math.max(0, cursor - contextLines)
    let hunkEnd = cursor
    let lastChange = cursor

    while (hunkEnd < lines.length) {
      if (isChangeLine(lines[hunkEnd])) {
        lastChange = hunkEnd
      }

      if (hunkEnd - lastChange > contextLines) {
        break
      }

      hunkEnd += 1
    }

    const segment = lines.slice(hunkStart, hunkEnd)
    const oldStart = segment.find((line) => line.leftNumber !== undefined)?.leftNumber ?? 0
    const newStart = segment.find((line) => line.rightNumber !== undefined)?.rightNumber ?? 0
    const oldLines = segment.reduce((count, line) => count + Number(line.leftNumber !== undefined), 0)
    const newLines = segment.reduce((count, line) => count + Number(line.rightNumber !== undefined), 0)

    hunks.push({
      oldStart,
      oldLines,
      newStart,
      newLines,
      lines: segment
    })

    cursor = hunkEnd
  }

  return hunks
}

async function readLayout(cwd: string): Promise<ProjectLayout> {
  try {
    return await loadProjectLayout(cwd)
  } catch {
    // Diff keeps working without a config by assuming the default layout.
    return loadProjectLayoutWithDefaults(cwd)
  }
}

export function getStats(lines: DiffLine[]) {
  return lines.reduce(
    (stats, line) => {
      if (line.kind === "add") stats.added += 1
      if (line.kind === "remove") stats.removed += 1
      return stats
    },
    { added: 0, removed: 0 }
  )
}

function printDiff(relativeLocalPath: string, component: string, hunks: DiffHunk[], stats: { added: number; removed: number }) {
  console.log("")
  console.log(pc.bold(`diff ${relativeLocalPath} registry/${component}.tsx`))
  console.log(pc.red(`--- ${relativeLocalPath}`))
  console.log(pc.green(`+++ registry/${component}.tsx`))

  for (const hunk of hunks) {
    console.log(pc.cyan(`@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@`))

    for (const line of hunk.lines) {
      if (line.kind === "add") {
        console.log(pc.green(`+${line.value}`))
        continue
      }

      if (line.kind === "remove") {
        console.log(pc.red(`-${line.value}`))
        continue
      }

      console.log(pc.dim(` ${line.value}`))
    }
  }

  console.log(pc.dim(`\n${stats.added} additions, ${stats.removed} deletions\n`))
}

function printJson(payload: object) {
  console.log(JSON.stringify(payload, null, 2))
}

export function createDiffCommand() {
  return new Command()
    .name("diff")
    .description("Show diff between your local component file and the registry source.")
    .argument("<component>", "Component name")
    .option("--cwd <path>", "Working directory", process.cwd())
    .option("-c, --context <lines>", "Number of context lines around changes", parseContextValue, 3)
    .option("--json", "Output diff in JSON format")
    .action(async (component: string, options: { cwd: string; context: number; json?: boolean }) => {
      const cwd = path.resolve(options.cwd)

      const item = await fetchRegistryItem(component)
      if (!item) {
        const reason = getLastRegistryErrorMessage()
        const message = `component \"${component}\" was not found in the registry${reason ? `: ${reason}` : ""}`

        if (options.json) {
          printJson({
            component,
            error: message,
            upToDate: false
          })
        } else {
          console.error(pc.red(`  ${message}.`))
        }
        process.exit(1)
      }

      const sourceFile = item.files.find((file) => path.basename(file.path) === `${component}.tsx`) ?? item.files[0]

      if (!sourceFile?.content) {
        const message = `registry entry for \"${component}\" has no source file content`
        if (options.json) {
          printJson({
            component,
            error: message,
            upToDate: false
          })
        } else {
          console.error(pc.red(`  ${message}.`))
        }
        process.exit(1)
      }

      const layout = await readLayout(cwd)
      const localPath = path.join(layout.components.directory, `${component}.tsx`)
      const registryContent = rewriteImports(sourceFile.content, sourceFile.path, createResolver(layout, localPath)).content

      if (!await fs.pathExists(localPath)) {
        const message = `local file not found: ${path.relative(cwd, localPath)}`
        if (options.json) {
          printJson({
            component,
            error: message,
            upToDate: false
          })
        } else {
          console.error(pc.red(`  ${message}`))
        }
        process.exit(1)
      }

      const localSource = await fs.readFile(localPath, "utf8")
      const relativeLocalPath = path.relative(cwd, localPath)

      if (localSource === registryContent) {
        if (options.json) {
          printJson({
            component,
            localPath: relativeLocalPath,
            registryPath: `registry/${component}.tsx`,
            upToDate: true,
            stats: { added: 0, removed: 0 },
            hunks: []
          })
        } else {
          console.log(pc.green(`\n  ${component}.tsx is up to date with registry.\n`))
        }
        return
      }

      const diffLines = createLineDiff(localSource, registryContent)
      const hunks = createHunks(diffLines, options.context)
      const stats = getStats(diffLines)

      if (options.json) {
        printJson({
          component,
          localPath: relativeLocalPath,
          registryPath: `registry/${component}.tsx`,
          upToDate: false,
          context: options.context,
          stats,
          hunks
        })
        return
      }

      printDiff(relativeLocalPath, component, hunks, stats)
    })
}

export const diffCommand = createDiffCommand()
