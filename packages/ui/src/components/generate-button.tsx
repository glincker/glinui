"use client"

/**
 * Glin UI Generate Button (generate-button). Adapted from GenerateButton in Vengeance UI
 * (https://github.com/Ashutoshx7/VengeanceUI, src/components/ui/generate-button.tsx),
 * commit 0376d8e37b4a565016cce1064d7b96905c4494ab.
 * Original copyright (c) 2025-2026 Ashutoshx7. Licensed under MIT.
 * Modified for Glin UI: scoped Tailwind instead of an injected style tag, tokens, explicit generating and loading states, aria-busy and live status, variant vocabulary (glinr default), sizes, motion levels.
 * See THIRD_PARTY_NOTICES.md#generate-button.
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Sparkle } from "@phosphor-icons/react/dist/ssr"

import { cn } from "../lib/cn"
import { Button, type ButtonProps } from "./button"
import { ButtonGroupContext } from "./button-group"
import { useGlinStyle } from "./glin-provider"
import { resolveVariant } from "../lib/surface"
import { mergeRefs, useMotionEngine } from "./motion-engine"
import { Spinner } from "./spinner"

const generateButtonVariants = cva(
  "group relative isolate overflow-hidden rounded-full font-semibold [--glin-hue:250] gap-2",
  {
    variants: {
      size: {
        xs: "h-7 px-3 text-xs",
        sm: "h-8 px-3.5 text-xs",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "size-10 p-0 text-sm"
      }
    },
    defaultVariants: { size: "md" }
  }
)

/** Colour of the shining label: must equal the surface's text colour (currentColor is transparent under bg-clip-text). */
const INK_ON_FILL = "[--gen-ink:var(--t-fg)]"
const INK_ON_FACE = "[--gen-ink:var(--t-text)]"
const INK_BY_VARIANT: Record<string, string> = {
  solid: INK_ON_FILL,
  plain: INK_ON_FILL,
  gradient: "[--gen-ink:white]"
}

export type GenerateButtonProps = Omit<ButtonProps, "size" | "iconNudge" | "children"> &
  VariantProps<typeof generateButtonVariants> & {
    /** Idle label. */
    label?: string
    /** Label shown (and announced) while generating. */
    generatingLabel?: string
    /** Controlled generating state. */
    isGenerating?: boolean
    /** Initial generating state when uncontrolled. */
    defaultGenerating?: boolean
    /** Called with the requested next state when the button is activated. */
    onGeneratingChange?: (generating: boolean) => void
    /** Submitting state: spinner, aria-busy and a disabled button (separate from the generating glow). */
    loading?: boolean
    /** Highlight hue, 0 to 360. Defaults to a violet-blue. */
    hue?: number
    /** Icon before the label. Defaults to a sparkle. */
    leadingIcon?: React.ReactNode
    /** Icon after the label. */
    trailingIcon?: React.ReactNode
    /** With `asChild`, pass the element to render, for example an anchor. */
    children?: React.ReactElement
  }

/**
 * AI style call to action with an idle face and a glowing "generating" face.
 * Activating it requests the next state; the label swap is announced politely.
 */
export const GenerateButton = React.forwardRef<HTMLButtonElement, GenerateButtonProps>(
  (
    {
      className,
      variant,
      tone,
      size,
      label = "Generate",
      generatingLabel = "Generating",
      isGenerating,
      defaultGenerating = false,
      onGeneratingChange,
      loading = false,
      hue,
      leadingIcon,
      trailingIcon,
      disabled,
      asChild = false,
      children,
      onClick,
      type,
      ...props
    },
    ref
  ) => {
    const { effectiveLevel } = useMotionEngine()
    const style = useGlinStyle()
    const group = React.useContext(ButtonGroupContext)
    const resolved = resolveVariant(variant ?? group?.variant, style, "signature")
    const inkClass = INK_BY_VARIANT[resolved] ?? INK_ON_FACE
    const animate = effectiveLevel === "full"
    const [inner, setInner] = React.useState(defaultGenerating)
    const generating = isGenerating ?? inner
    const inactive = Boolean(disabled) || loading
    const localRef = React.useRef<HTMLButtonElement | null>(null)

    React.useEffect(() => {
      const node = localRef.current
      if (!node || hue === undefined) return
      node.style.setProperty("--glin-hue", String(Math.round(hue)))
      return () => {
        node.style.removeProperty("--glin-hue")
      }
    }, [hue])

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (event.defaultPrevented || inactive) return
      const next = !generating
      if (isGenerating === undefined) setInner(next)
      onGeneratingChange?.(next)
    }

    const icon = loading ? (
      <Spinner variant="current" size="sm" label="Loading" />
    ) : (
      <span
        aria-hidden="true"
        data-slot="icon"
        className={cn(
          "inline-flex shrink-0 [&_svg]:size-[1.1em]",
          generating && "text-[oklch(0.8_0.15_var(--glin-hue))]",
          generating && animate && "motion-safe:animate-[glin-a4-gen-spark_1.4s_ease-in-out_infinite]"
        )}
      >
        {leadingIcon ?? <Sparkle weight="fill" />}
      </span>
    )

    const shine =
      "bg-[linear-gradient(110deg,var(--gen-ink)_38%,oklch(0.82_0.14_var(--glin-hue))_50%,var(--gen-ink)_62%)] bg-[length:200%_100%] bg-clip-text text-transparent"

    const content = (
      <>
        <span
          aria-hidden="true"
          data-slot="glow"
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-[linear-gradient(0deg,oklch(0.78_0.15_var(--glin-hue)_/_0.55),transparent_70%)] opacity-0 transition-opacity duration-slow ease-standard motion-reduce:transition-none",
            generating && "opacity-100"
          )}
        />
        {icon}
        <span className="grid" data-slot="label">
          <span
            aria-hidden={generating || undefined}
            className={cn("col-start-1 row-start-1 text-center", generating && "invisible")}
          >
            {label}
          </span>
          <span
            aria-hidden={!generating || undefined}
            className={cn(
              "col-start-1 row-start-1 text-center",
              !generating && "invisible",
              generating && animate && cn(shine, "motion-safe:animate-[glin-a4-gen-shine_2.2s_linear_infinite]")
            )}
          >
            {generatingLabel}
          </span>
        </span>
        {trailingIcon ? (
          <span aria-hidden="true" className="inline-flex shrink-0 [&_svg]:size-[1.1em]">
            {trailingIcon}
          </span>
        ) : null}
      </>
    )

    const body =
      asChild && React.isValidElement<{ children?: React.ReactNode }>(children) ? (
        React.cloneElement(children, undefined, content)
      ) : (
        <button type={type ?? "button"}>{content}</button>
      )

    return (
      <>
        <Button
          asChild
          ref={mergeRefs(ref, localRef)}
          variant={variant}
          tone={tone}
          disabled={inactive}
          aria-busy={loading || generating || undefined}
          aria-disabled={inactive || undefined}
          data-generating={generating ? "true" : "false"}
          data-loading={loading ? "true" : undefined}
          onClick={handleClick}
          className={cn(generateButtonVariants({ size }), inkClass, className)}
          {...props}
        >
          {body}
        </Button>
        <span role="status" aria-live="polite" className="sr-only">
          {generating ? generatingLabel : ""}
        </span>
      </>
    )
  }
)

GenerateButton.displayName = "GenerateButton"

export { generateButtonVariants }
