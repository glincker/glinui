import { Command } from "commander"
import prompts from "prompts"
import pc from "picocolors"
import fs from "fs-extra"
import path from "path"
import { fetchRegistryItem, fetchRegistryIndex, getLastRegistryErrorMessage } from "../registry/api.js"
import { rewriteImports } from "../utils/rewrite-imports.js"
import { ConfigNotFoundError, createResolver, destinationFor, loadProjectLayout } from "../utils/project.js"
import {
  CN_DEPENDENCIES,
  addPackageDependencies,
  installableDependencies,
  runInstall
} from "../utils/dependencies.js"
import { ensureUtilsFile, exportsCn } from "../utils/ensure-utils.js"
import { NoticeCollector, NO_NOTICES_HELP, NOTICES_FILE_NAME, ensureAttributionHeader, writeNotices } from "../utils/notices.js"

export type AddOptions = {
  components: string[]
  cwd: string
  overwrite?: boolean
  dryRun?: boolean
  install?: boolean
  /** Write THIRD_PARTY_NOTICES.md for adapted components. Defaults to true; `--no-notices` sets false. */
  notices?: boolean
}

export type AddSummary = {
  written: string[]
  skipped: string[]
  missing: string[]
  addedDependencies: string[]
  /** Path of the THIRD_PARTY_NOTICES.md written or updated, when adapted components were added. */
  noticesFile?: string
}

const TOKENS_PACKAGE = "@glinui/tokens"

/** The file that carries the component itself, for example button.tsx for "button". */
function isPrimaryFile(filePath: string, name: string) {
  return new RegExp(`(^|/)${name}\\.tsx?$`).test(filePath)
}

function display(cwd: string, file: string) {
  return path.relative(cwd, file).split(path.sep).join("/")
}

/** Copy registry items into the project, rewriting imports to the project's aliases. */
export async function runAdd(options: AddOptions): Promise<AddSummary> {
  const cwd = path.resolve(options.cwd)
  const dryRun = Boolean(options.dryRun)
  const layout = await loadProjectLayout(cwd)

  const summary: AddSummary = { written: [], skipped: [], missing: [], addedDependencies: [] }
  const dependencies = new Set<string>()
  const versions: Record<string, string> = {}
  const claimed = new Set<string>()
  const visited = new Set<string>()
  const queue = [...options.components]
  const collector = new NoticeCollector()
  let usesUtils = false

  while (queue.length > 0) {
    const name = queue.shift() as string
    if (visited.has(name)) continue
    visited.add(name)

    try {
      const item = await fetchRegistryItem(name)
      if (!item) {
        const reason = getLastRegistryErrorMessage()
        summary.missing.push(name)
        if (reason?.includes("404")) {
          console.log(pc.yellow(`  ⚠ Component "${name}" not found in registry.`))
        } else {
          console.log(pc.yellow(`  ⚠ Component "${name}" unavailable (${reason ?? "unknown registry error"}).`))
        }
        continue
      }

      for (const file of item.files ?? []) {
        const targetPath = destinationFor(layout, file.path)
        if (claimed.has(targetPath)) continue
        claimed.add(targetPath)

        if (await fs.pathExists(targetPath) && !options.overwrite) {
          summary.skipped.push(targetPath)
          console.log(pc.yellow(`  ⚠ ${display(cwd, targetPath)} already exists. Use --overwrite to replace.`))
          continue
        }

        // The attribution header is part of the MIT notice: restore it when a ported file lost it.
        const source =
          item.provenance && isPrimaryFile(file.path, item.name)
            ? ensureAttributionHeader(file.content, item.name, item.provenance)
            : file.content
        const rewritten = rewriteImports(source, file.path, createResolver(layout, targetPath))
        for (const specifier of rewritten.unresolved) {
          console.log(pc.yellow(`  ⚠ ${path.basename(targetPath)}: could not rewrite import "${specifier}".`))
        }
        if (rewritten.targets.some((target) => target.kind === "utils")) usesUtils = true

        if (!dryRun) {
          await fs.ensureDir(path.dirname(targetPath))
          await fs.writeFile(targetPath, rewritten.content, "utf8")
        }
        summary.written.push(targetPath)
        console.log(pc.green(`  ✓ ${pc.bold(display(cwd, targetPath))}`))
      }

      collector.add(item.name, item.provenance)
      if (item.provenance) {
        console.log(pc.dim(`    adapted from ${item.provenance.sourceName} (${item.provenance.spdx})`))
      }

      const itemDependencies = installableDependencies(item.dependencies ?? [])
      for (const dep of itemDependencies) dependencies.add(dep)
      Object.assign(versions, item.dependencyVersions ?? {})
      if (itemDependencies.length) {
        console.log(pc.dim(`    deps: ${itemDependencies.join(", ")}`))
      }

      // Pull in registry items this one imports (for example button-group needs button).
      for (const dependency of item.registryDependencies ?? []) {
        if (!visited.has(dependency)) {
          console.log(pc.dim(`    requires: ${dependency}`))
          queue.push(dependency)
        }
      }
    } catch (error) {
      console.error(pc.red(`  ✗ Failed to add "${name}": ${error instanceof Error ? error.message : error}`))
    }
  }

  if (usesUtils) {
    for (const dep of CN_DEPENDENCIES) dependencies.add(dep)
    if (await ensureUtilsFile(layout.utils.file, dryRun)) {
      summary.written.push(layout.utils.file)
      console.log(pc.green(`  ✓ ${pc.bold(display(cwd, layout.utils.file))} (cn helper)`))
    } else if (!(await exportsCn(layout.utils.file))) {
      console.log(pc.yellow(`  ⚠ ${display(cwd, layout.utils.file)} does not export cn. Components import { cn } from it.`))
    }
  }

  if (summary.written.length > 0) dependencies.add(TOKENS_PACKAGE)

  if (collector.size > 0 && options.notices !== false) {
    const noticesFile = await writeNotices(cwd, collector.entries(), dryRun)
    if (noticesFile) {
      summary.noticesFile = noticesFile
      const names = collector.entries().map((entry) => entry.provenance.sourceName).join(", ")
      console.log(pc.cyan(`  Includes code adapted from ${names}. Notice ${dryRun ? "would be added" : "added"} to ${NOTICES_FILE_NAME}`))
    }
  } else if (collector.size > 0) {
    console.log(pc.yellow(`  ⚠ Skipped ${NOTICES_FILE_NAME} (--no-notices). You remain bound by the MIT notice of adapted components.`))
  }

  summary.addedDependencies = await addPackageDependencies(cwd, [...dependencies], versions, dryRun)
  if (summary.addedDependencies.length > 0) {
    const verb = dryRun ? "Would add" : "Added"
    console.log(pc.cyan(`\n  ${verb} to package.json: ${summary.addedDependencies.join(", ")}`))
    if (!dryRun && options.install) {
      console.log(pc.dim("  Installing dependencies..."))
      if (!runInstall(cwd)) console.log(pc.yellow("  ⚠ Install failed. Run your package manager install manually."))
    } else if (!dryRun) {
      console.log(pc.dim("  Run your package manager install to fetch them (or re-run with --install)."))
    }
  }

  return summary
}

export const addCommand = new Command()
  .name("add")
  .description("Add Glin UI components to your project.")
  .argument("[components...]", "Components to add")
  .option("-y, --yes", "Skip confirmation")
  .option("-o, --overwrite", "Overwrite existing files")
  .option("--dry-run", "Print what would change without writing files or package.json")
  .option("--install", "Run the package manager install after updating package.json")
  .option("--no-notices", NO_NOTICES_HELP)
  .option("--cwd <path>", "Working directory", process.cwd())
  .action(async (components: string[], options: { overwrite?: boolean; dryRun?: boolean; install?: boolean; notices?: boolean; cwd: string }) => {
    const cwd = path.resolve(options.cwd)

    try {
      await loadProjectLayout(cwd)
    } catch (error) {
      if (error instanceof ConfigNotFoundError) {
        console.error(pc.red(`  ${error.message}`))
        process.exit(1)
      }
      throw error
    }

    // If no components specified, show interactive picker
    if (!components.length) {
      const index = await fetchRegistryIndex()
      if (!index) {
        const reason = getLastRegistryErrorMessage()
        console.error(pc.red(`  Failed to fetch component registry${reason ? `: ${reason}` : "."}`))
        process.exit(1)
      }

      const response = await prompts({
        type: "multiselect",
        name: "components",
        message: "Which components would you like to add?",
        choices: index.map((item: { name: string; description?: string }) => ({
          title: item.name,
          description: item.description,
          value: item.name,
        })),
        hint: "Space to select, Enter to confirm",
      })

      components = response.components ?? []
    }

    if (!components.length) {
      console.log(pc.yellow("\n  No components selected.\n"))
      return
    }

    console.log(pc.cyan(`\n  Adding ${components.length} component(s)...\n`))
    await runAdd({ ...options, components })
    console.log(pc.green(`\n  ✓ Done!\n`))
  })
