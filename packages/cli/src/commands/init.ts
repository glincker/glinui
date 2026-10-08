import { Command } from "commander"
import prompts from "prompts"
import pc from "picocolors"
import fs from "fs-extra"
import path from "path"
import { ensureUtilsFile } from "../utils/ensure-utils.js"
import { loadProjectLayout } from "../utils/project.js"
import { DEFAULT_STYLE, REGISTRY_URL } from "../registry/constants.js"

type InitOptions = {
  yes?: boolean
  cwd: string
}

type InitAnswers = {
  style: string
  tailwindCss: string
  components: string
  utils: string
}

function getDefaultAnswers(): InitAnswers {
  return {
    style: DEFAULT_STYLE,
    tailwindCss: "src/app/globals.css",
    components: "src/components/ui",
    utils: "src/lib/utils"
  }
}

export function buildInitConfig(answers: InitAnswers) {
  return {
    $schema: `${REGISTRY_URL}/schema.json`,
    style: answers.style,
    tailwind: {
      css: answers.tailwindCss
    },
    aliases: {
      components: answers.components,
      utils: answers.utils
    }
  }
}

async function resolveAnswers(useDefaults: boolean): Promise<InitAnswers> {
  if (useDefaults) {
    return getDefaultAnswers()
  }

  const defaults = getDefaultAnswers()

  const input = await prompts([
    {
      type: "select",
      name: "style",
      message: "Which style would you like to use?",
      choices: [{ title: "Default (Liquid Glass)", value: "default" }],
      initial: 0
    },
    {
      type: "text",
      name: "tailwindCss",
      message: "Where is your global CSS file?",
      initial: defaults.tailwindCss
    },
    {
      type: "text",
      name: "components",
      message: "Where do you want to install components?",
      initial: defaults.components
    },
    {
      type: "text",
      name: "utils",
      message: "Where is your utils directory?",
      initial: defaults.utils
    }
  ])

  return {
    style: String(input.style ?? defaults.style),
    tailwindCss: String(input.tailwindCss ?? defaults.tailwindCss),
    components: String(input.components ?? defaults.components),
    utils: String(input.utils ?? defaults.utils)
  }
}

export async function runInit(options: InitOptions) {
  const cwd = path.resolve(options.cwd)
  console.log(pc.cyan("\n  Glin UI, Liquid Glass Components\n"))

  const pkgPath = path.join(cwd, "package.json")
  if (!await fs.pathExists(pkgPath)) {
    console.error(pc.red("  No package.json found. Run this command in a project directory."))
    process.exit(1)
  }

  const answers = await resolveAnswers(Boolean(options.yes))

  if (!answers.style) {
    console.log(pc.yellow("\n  Setup cancelled.\n"))
    process.exit(0)
  }

  const configPath = path.join(cwd, "glinui.json")
  const glinuiConfig = buildInitConfig(answers)
  await fs.writeJson(configPath, glinuiConfig, { spaces: 2 })
  console.log(pc.green(`\n  ✓ Config written to ${pc.bold("glinui.json")}`))

  // utils is a module path (src/lib/utils -> src/lib/utils.ts) exporting cn.
  const layout = await loadProjectLayout(cwd)
  if (await ensureUtilsFile(layout.utils.file, false)) {
    console.log(pc.green(`  ✓ Created ${pc.bold(path.relative(cwd, layout.utils.file))}`))
  }

  console.log(pc.cyan("\n  Install dependencies:\n"))
  console.log(pc.dim("    pnpm add @glinui/tokens clsx tailwind-merge class-variance-authority"))
  console.log(pc.dim("    pnpm add -D tailwindcss @tailwindcss/postcss"))

  console.log(pc.green("\n  ✓ Glin UI initialized successfully!"))
  console.log(pc.dim(`\n  Run ${pc.bold("npx glinui add button")} to add your first component.\n`))
}

export function createInitCommand() {
  return new Command()
    .name("init")
    .description("Initialize Glin UI in your project.")
    .option("-y, --yes", "Skip prompts and use defaults")
    .option("--cwd <path>", "Working directory", process.cwd())
    .action(async (options: InitOptions) => {
      await runInit({ yes: options.yes, cwd: options.cwd })
    })
}

export const initCommand = createInitCommand()
