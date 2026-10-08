"use client"

import * as React from "react"
import { FileCode } from "@phosphor-icons/react"
import { Highlight, type Language, type PrismTheme } from "prism-react-renderer"

import { cn } from "@glinui/ui"
import { CodeSurfaceFrame, PackageManagerTabs, usePackageManager } from "@/components/docs/code-surface-frame"
import { buildCommandTabs } from "@/lib/npm-commands"

type CodeBlockProps = {
  code: string
  language?: string
  dir?: "ltr" | "rtl"
  className?: string
  /** Optional file name shown in a header bar. */
  filename?: string
  /** Show line numbers (off by default). */
  showLineNumbers?: boolean
}

const SUPPORTED_LANGUAGES: ReadonlySet<string> = new Set([
  "bash",
  "shell",
  "sh",
  "tsx",
  "ts",
  "jsx",
  "js",
  "json",
  "css",
  "html",
  "md"
])

/**
 * Empty Prism theme: colors come from Tailwind classes (see tokenClass) so
 * no inline styles are emitted and light/dark follow the page theme.
 */
const plainTheme: PrismTheme = { plain: {}, styles: [] }

const TOKEN_CLASSES: ReadonlyArray<readonly [ReadonlyArray<string>, string]> = [
  [["comment", "prolog", "doctype", "cdata"], "italic text-muted dark:text-neutral-400"],
  [["keyword", "operator", "tag"], "text-violet-700 dark:text-violet-300"],
  [["property", "attr-name", "variable"], "text-sky-700 dark:text-sky-300"],
  [["string", "attr-value", "template-string", "regex", "important"], "text-emerald-700 dark:text-emerald-300"],
  [["number", "boolean"], "text-amber-700 dark:text-amber-300"],
  [["function", "class-name", "builtin", "constant"], "text-indigo-700 dark:text-indigo-300"],
  [["punctuation"], "text-muted dark:text-neutral-400"]
]

function tokenClass(types: string[]): string {
  for (const [names, cls] of TOKEN_CLASSES) {
    if (types.some((t) => names.includes(t))) return cls
  }
  return "text-neutral-800 dark:text-neutral-100"
}

export function CodeBlock({
  code,
  language = "tsx",
  dir = "ltr",
  className,
  filename,
  showLineNumbers = false
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)
  const [selectedPm, setSelectedPm] = usePackageManager()

  const commandsByPm = React.useMemo(() => buildCommandTabs(code), [code])
  const activeCode = commandsByPm ? commandsByPm[selectedPm] : code
  const normalizedCode = React.useMemo(() => activeCode.replace(/\n+$/g, ""), [activeCode])
  const normalizedLanguage = normalizeLanguage(commandsByPm ? "bash" : language)

  const onCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(normalizedCode)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }, [normalizedCode])

  const lineNumbers = showLineNumbers && !commandsByPm

  let header: React.ReactNode = null
  if (commandsByPm) {
    header = <PackageManagerTabs value={selectedPm} onChange={setSelectedPm} />
  } else if (filename) {
    header = (
      <div className="flex items-center gap-2 py-2.5 text-[12px] font-medium text-neutral-600 dark:text-neutral-300">
        <FileCode className="size-4 shrink-0 text-muted dark:text-neutral-400" aria-hidden />
        <span className="truncate font-mono">{filename}</span>
      </div>
    )
  }

  return (
    <CodeSurfaceFrame
      className={className}
      copied={copied}
      onCopy={() => void onCopy()}
      copyLabel="Copy code"
      copyHint="Copy code"
      left={header}
    >
      <Highlight code={normalizedCode} language={normalizedLanguage} theme={plainTheme}>
        {({ tokens, getTokenProps }) => (
          <pre
            dir={dir}
            tabIndex={0}
            className="max-h-[580px] overflow-auto px-0 py-3.5 font-mono text-[13px] leading-[1.7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-accent)]"
          >
            <code className="block min-w-full w-max">
              {tokens.map((line, index) => (
                <div key={index} className={cn("px-4", lineNumbers && "grid grid-cols-[2.5rem_1fr]")}>
                  {lineNumbers ? (
                    <span aria-hidden className="select-none pr-3 text-right text-[12px] text-muted dark:text-neutral-600">
                      {index + 1}
                    </span>
                  ) : null}
                  <span>
                    {line.map((token, tokenIndex) => {
                      const { children } = getTokenProps({ token })
                      return (
                        <span key={tokenIndex} className={tokenClass(token.types)}>
                          {children}
                        </span>
                      )
                    })}
                    {line.length === 0 || (line.length === 1 && line[0].empty) ? "\n" : null}
                  </span>
                </div>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
    </CodeSurfaceFrame>
  )
}

function normalizeLanguage(language: string): Language {
  const raw = language.toLowerCase().trim()
  const value = raw === "shell" || raw === "sh" ? "bash" : raw

  if (SUPPORTED_LANGUAGES.has(value)) {
    return value as Language
  }

  return "tsx"
}
