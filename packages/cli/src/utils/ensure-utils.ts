import fs from "fs-extra"
import path from "path"

export const CN_SOURCE = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`

/** Create the utils module exporting `cn` when it does not exist. Returns true when written. */
export async function ensureUtilsFile(file: string, dryRun: boolean): Promise<boolean> {
  if (await fs.pathExists(file)) return false
  if (!dryRun) {
    await fs.ensureDir(path.dirname(file))
    await fs.writeFile(file, CN_SOURCE, "utf8")
  }
  return true
}

/** True when an existing utils module appears to export `cn`. */
export async function exportsCn(file: string): Promise<boolean> {
  if (!(await fs.pathExists(file))) return false
  const text = await fs.readFile(file, "utf8")
  return /export\s+(function\s+cn\b|const\s+cn\b|\{[^}]*\bcn\b[^}]*\})/.test(text)
}
