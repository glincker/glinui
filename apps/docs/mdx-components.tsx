import type { MDXComponents } from "mdx/types"
import * as React from "react"

import { cn } from "@glinui/ui"
import { CodeBlock } from "@/components/docs/code-block"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ className, ...props }) => <h1 className={cn("group type-h1 text-foreground", className)} {...props} />,
    h2: ({ className, ...props }) => (
      <h2
        className={cn("group type-section mt-12 scroll-mt-24 border-b border-border/50 pb-2 text-foreground", className)}
        {...props}
      />
    ),
    h3: ({ className, ...props }) => (
      <h3 className={cn("group type-h3 mt-8 scroll-mt-24 text-foreground", className)} {...props} />
    ),
    p: ({ className, ...props }) => (
      <p className={cn("type-body max-w-[68ch] text-[var(--color-muted)]", className)} {...props} />
    ),
    ul: ({ className, ...props }) => (
      <ul className={cn("type-body ml-5 max-w-[68ch] list-disc space-y-2 marker:text-neutral-400", className)} {...props} />
    ),
    ol: ({ className, ...props }) => (
      <ol className={cn("type-body ml-5 max-w-[68ch] list-decimal space-y-2 marker:text-neutral-400", className)} {...props} />
    ),
    li: ({ className, ...props }) => <li className={cn("text-[var(--color-muted)]", className)} {...props} />,
    blockquote: ({ className, ...props }) => (
      <blockquote
        className={cn("type-body max-w-[68ch] border-l-2 border-border pl-4 text-[var(--color-muted)]", className)}
        {...props}
      />
    ),
    code: ({ className, ...props }) => {
      const isBlock = typeof className === "string" && className.includes("language-")

      if (isBlock) {
        return <code className={className} {...props} />
      }

      return (
        <code
          className={cn(
            "rounded-md border border-border/60 bg-black/[0.05] px-1.5 py-0.5 font-mono text-[0.875em] text-foreground dark:bg-white/[0.08]",
            className
          )}
          {...props}
        />
      )
    },
    pre: ({ className, children, ...props }) => {
      if (React.isValidElement(children)) {
        const childProps = children.props as { className?: string; children?: React.ReactNode }
        const languageClass = childProps.className ?? ""
        const language = languageClass.replace("language-", "") || "tsx"
        const rawCode = typeof childProps.children === "string" ? childProps.children : ""

        if (rawCode) {
          return <CodeBlock code={rawCode} language={language} className={className} />
        }
      }

      return (
        <pre
          className={cn("overflow-x-auto rounded-xl border border-border/60 bg-black/15 p-4 type-code", className)}
          {...props}
        >
          {children}
        </pre>
      )
    },
    ...components
  }
}
