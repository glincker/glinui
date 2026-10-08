"use client"

import * as React from "react"
import { CaretRight, Folder, FolderOpen, FileText } from "@phosphor-icons/react"

import { cn } from "../lib/cn"
import type { SurfaceTone, SurfaceVariant } from "../lib/surface"
import { containerSurface, resolveSurfaceProps } from "../lib/surface-resolve"
import { useGlinStyle } from "./glin-provider"

/* ── Variants ──────────────────────────────────────────────────────────── */

const TREE_BASE = "w-full text-sm"

/* ── Types ─────────────────────────────────────────────────────────────── */

export type TreeNode = {
  /** Display label */
  label: string
  /** Optional href, makes the node a link */
  href?: string
  /** Open link in new tab */
  external?: boolean
  /** Optional badge text shown after the label */
  badge?: string
  /** Badge color variant */
  badgeVariant?: "default" | "success" | "warning" | "info" | "destructive"
  /** Nested children, presence makes this a folder */
  children?: TreeNode[]
  /** Custom icon override */
  icon?: React.ReactNode
}

export type TreeProps = React.HTMLAttributes<HTMLDivElement> & {
    /** Visual variant. Omit for the ambient design style (glinr: lift shell; plain: flat bordered list). */
    variant?: SurfaceVariant | "default" | "raised" | "frosted"
    tone?: SurfaceTone
    /** Extra classes for the tree root wrapper. */
    className?: string
    /** Tree data */
    nodes: TreeNode[]
    /** Expand all folders by default */
    defaultExpanded?: boolean
  }

/* ── TreeNodeItem (recursive) ──────────────────────────────────────────── */

const badgeColors = {
  default: "bg-[var(--surface-3)] text-[var(--color-muted)]",
  success: "bg-[color-mix(in_oklab,var(--tone-success)_14%,var(--surface-1))] text-[color:var(--tone-success-text)]",
  warning: "bg-[color-mix(in_oklab,var(--tone-warning)_14%,var(--surface-1))] text-[color:var(--tone-warning-text)]",
  info: "bg-[color-mix(in_oklab,var(--tone-info)_14%,var(--surface-1))] text-[color:var(--tone-info-text)]",
  destructive: "bg-[color-mix(in_oklab,var(--tone-danger)_14%,var(--surface-1))] text-[color:var(--tone-danger-text)]"
} as const

const rowClassName =
  "flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left transition-colors hover:bg-[var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-accent)] motion-reduce:transition-none"

function TreeNodeItem({
  node,
  depth,
  defaultExpanded
}: {
  node: TreeNode
  depth: number
  defaultExpanded: boolean
}) {
  const isFolder = node.children && node.children.length > 0
  const [expanded, setExpanded] = React.useState(defaultExpanded)

  const content = (
    <>
      {isFolder ? (
        <span className="text-[var(--color-accent)]">
          {expanded ? <FolderOpen className="size-4" /> : <Folder className="size-4" />}
        </span>
      ) : (
        <span className="text-[var(--color-muted)]">
          {node.icon ?? <FileText className="size-3.5" />}
        </span>
      )}
      <span className={cn("truncate", isFolder ? "font-medium text-foreground" : "font-mono text-foreground/85")}>
        {node.label}
      </span>
      {node.badge && (
        <span className={cn("ml-auto shrink-0 rounded-md border border-[color-mix(in_oklab,currentColor_10%,transparent)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider", badgeColors[node.badgeVariant ?? "default"])}>
          {node.badge}
        </span>
      )}
    </>
  )

  if (isFolder) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className={rowClassName}
        >
          <CaretRight className={cn("size-3 shrink-0 text-[var(--color-muted)] transition-transform duration-150 motion-reduce:transition-none", expanded && "rotate-90")} />
          {content}
        </button>
        {expanded && (
          <div className="ml-[1.375rem] border-l border-[var(--line-soft)]">
            {node.children!.map((child, i) => (
              <TreeNodeItem key={`${child.label}-${i}`} node={child} depth={depth + 1} defaultExpanded={defaultExpanded} />
            ))}
          </div>
        )}
      </div>
    )
  }

  const sharedClassName = cn(rowClassName, "pl-8")

  if (node.href) {
    return (
      <a
        href={node.href}
        target={node.external ? "_blank" : undefined}
        rel={node.external ? "noopener noreferrer" : undefined}
        className={sharedClassName}
      >
        {content}
      </a>
    )
  }

  return (
    <div className={sharedClassName}>
      {content}
    </div>
  )
}

/* ── Tree ──────────────────────────────────────────────────────────────── */

export const Tree = React.forwardRef<HTMLDivElement, TreeProps>(
  ({ className, variant, tone, nodes, defaultExpanded = true, ...props }, ref) => {
    const ambient = useGlinStyle()
    const { variant: resolved, tone: aliasTone } = resolveSurfaceProps(variant, ambient, "container")
    return (
      <div
        ref={ref}
        data-variant={resolved}
        className={cn(
          TREE_BASE,
          containerSurface(resolved, { radius: "lg", elevation: "1", tone: tone ?? aliasTone }),
          className
        )}
        {...props}
      >
        <div className="py-1">
          {nodes.map((node, i) => (
            <TreeNodeItem key={`${node.label}-${i}`} node={node} depth={0} defaultExpanded={defaultExpanded} />
          ))}
        </div>
      </div>
    )
  }
)

Tree.displayName = "Tree"

/* ── Utility: build tree from flat file paths ─────────────────────────── */

export function buildFileTree(
  paths: string[],
  options?: {
    /** Base href prefix for leaf nodes */
    hrefPrefix?: string
    /** Custom badge function per file path */
    getBadge?: (path: string) => { badge: string; badgeVariant?: TreeNode["badgeVariant"] } | null
  }
): TreeNode[] {
  const root: TreeNode = { label: "", children: [] }

  for (const filePath of paths) {
    const parts = filePath.split("/")
    let current = root

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      const isLeaf = i === parts.length - 1

      if (isLeaf) {
        const badgeInfo = options?.getBadge?.(filePath)
        current.children!.push({
          label: part,
          href: options?.hrefPrefix ? `${options.hrefPrefix}/${filePath}` : undefined,
          external: !!options?.hrefPrefix,
          ...(badgeInfo ?? {})
        })
      } else {
        let folder = current.children!.find((c) => c.label === part && c.children)
        if (!folder) {
          folder = { label: part, children: [] }
          current.children!.push(folder)
        }
        current = folder
      }
    }
  }

  return root.children!
}
