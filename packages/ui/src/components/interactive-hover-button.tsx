"use client"

/**
 * Glin UI Interactive Hover Button (interactive-hover-button). Adapted from InteractiveHoverButton in Magic UI
 * (https://github.com/magicuidesign/magicui, apps/www/registry/magicui/interactive-hover-button.tsx),
 * commit cdb348cb4c72a9b54b554d8617801e479fbc8714.
 * Original copyright (c) Magic UI. Licensed under MIT.
 * Modified for Glin UI: clip-path fill instead of a scaled dot, single accessible label, focus and active parity, tokens, RTL, sizes, variant vocabulary (glinr default), loading, motion levels.
 * See THIRD_PARTY_NOTICES.md#interactive-hover-button.
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"

import { cn } from "../lib/cn"
import { Button, type ButtonProps } from "./button"
import { useMotionEngine } from "./motion-engine"
import { Spinner } from "./spinner"

const interactiveHoverButtonVariants = cva(
  "group relative isolate overflow-hidden rounded-full font-semibold [--ihb-x:1.125rem] rtl:[--ihb-x:calc(100%-1.125rem)] ps-8 pe-5",
  {
    variants: {
      size: {
        xs: "h-7 text-xs",
        sm: "h-8 text-xs",
        md: "h-10 text-sm",
        lg: "h-12 text-base",
        icon: "size-10 text-sm"
      }
    },
    defaultVariants: { size: "md" }
  }
)

export type InteractiveHoverButtonProps = Omit<ButtonProps, "iconNudge" | "leadingIcon" | "trailingIcon" | "size"> &
  VariantProps<typeof interactiveHoverButtonVariants> & {
    /** Icon before the label (decorative). */
    leadingIcon?: React.ReactNode
    /** Icon after the label. Defaults to an arrow that mirrors in RTL on the hover face. */
    trailingIcon?: React.ReactNode
    /** Show a spinner, set aria-busy and block interaction. */
    loading?: boolean
  }

const FILL_FULL =
  "[clip-path:circle(0.25rem_at_var(--ihb-x)_50%)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:[clip-path:circle(150%_at_var(--ihb-x)_50%)] group-focus-visible:[clip-path:circle(150%_at_var(--ihb-x)_50%)] group-active:[clip-path:circle(150%_at_var(--ihb-x)_50%)]"

const REST_SLIDE =
  "[@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-3 [@media(hover:hover)_and_(pointer:fine)]:rtl:group-hover:-translate-x-3 group-focus-visible:translate-x-3 rtl:group-focus-visible:-translate-x-3"

const HOVER_SLIDE = "-translate-x-3 rtl:translate-x-3"

const REST_FADE =
  "[@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-0 group-focus-visible:opacity-0 group-active:opacity-0"

const HOVER_FADE =
  "[@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100 group-focus-visible:opacity-100 group-active:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0 group-focus-visible:translate-x-0 group-active:translate-x-0"

/**
 * Pill button with an accent dot that floods the surface on hover, focus or press.
 * Composes `Button` (focus ring, disabled, `asChild`); the hover face is decorative
 * and `aria-hidden`, so the label is announced once.
 */
export const InteractiveHoverButton = React.forwardRef<HTMLButtonElement, InteractiveHoverButtonProps>(
  (
    {
      className,
      variant,
      tone,
      size,
      leadingIcon,
      trailingIcon,
      loading = false,
      disabled,
      asChild = false,
      children,
      type,
      ...props
    },
    ref
  ) => {
    const { effectiveLevel } = useMotionEngine()
    const isStatic = effectiveLevel === "none"
    const slide = effectiveLevel === "full"
    const inactive = Boolean(disabled) || loading

    const label = asChild && React.isValidElement<{ children?: React.ReactNode }>(children) ? children.props.children : children

    const content = (
      <>
        <span
          aria-hidden="true"
          data-slot="fill"
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 bg-[var(--color-accent)] transition-[clip-path] duration-slow ease-standard motion-reduce:transition-none",
            isStatic && "transition-none",
            loading ? "[clip-path:circle(0_at_var(--ihb-x)_50%)]" : FILL_FULL
          )}
        />
        {loading ? (
          <Spinner
            variant="current"
            size="sm"
            label="Loading"
            className="pointer-events-none absolute start-2.5 top-1/2 -translate-y-1/2"
          />
        ) : null}
        <span
          data-slot="rest"
          className={cn(
            "inline-flex items-center justify-center gap-2 transition-[transform,opacity] duration-slow ease-standard motion-reduce:transition-none",
            isStatic && "transition-none",
            !loading && REST_FADE,
            !loading && slide && REST_SLIDE
          )}
        >
          {leadingIcon ? <span aria-hidden="true" className="inline-flex shrink-0 [&_svg]:size-[1.1em]">{leadingIcon}</span> : null}
          <span>{label}</span>
          {trailingIcon ? <span aria-hidden="true" className="inline-flex shrink-0 [&_svg]:size-[1.1em]">{trailingIcon}</span> : null}
        </span>
        {loading ? null : (
          <span
            aria-hidden="true"
            data-slot="hover-face"
            className={cn(
              "pointer-events-none absolute inset-0 flex items-center justify-center gap-2 text-[var(--color-accent-foreground)] opacity-0 transition-[transform,opacity] duration-slow ease-standard motion-reduce:transition-none",
              isStatic && "transition-none",
              slide && HOVER_SLIDE,
              HOVER_FADE
            )}
          >
            {leadingIcon ? <span className="inline-flex shrink-0 [&_svg]:size-[1.1em]">{leadingIcon}</span> : null}
            <span>{label}</span>
            {trailingIcon ?? <ArrowRight weight="bold" className="size-[1.1em] shrink-0 rtl:rotate-180" />}
          </span>
        )}
      </>
    )

    const body = asChild && React.isValidElement<{ children?: React.ReactNode }>(children)
      ? React.cloneElement(children, undefined, content)
      : (
        <button type={type ?? "button"}>{content}</button>
      )

    return (
      <Button
        asChild
        ref={ref}
        variant={variant}
        tone={tone}
        disabled={inactive}
        aria-busy={loading || undefined}
        aria-disabled={inactive || undefined}
        data-loading={loading ? "true" : undefined}
        className={cn(interactiveHoverButtonVariants({ size }), className)}
        {...props}
      >
        {body}
      </Button>
    )
  }
)

InteractiveHoverButton.displayName = "InteractiveHoverButton"

export { interactiveHoverButtonVariants }
