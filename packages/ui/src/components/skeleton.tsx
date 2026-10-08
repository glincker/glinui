"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { useControlVariant, type ControlVariant, type ControlVariantProp } from "../lib/control"

const SKELETON_VARIANTS = ["glinr", "solid", "plain", "soft", "outline", "ghost", "glass", "liquid", "matte"] as const satisfies readonly ControlVariant[]

const skeletonVariants = cva(
  "relative isolate overflow-hidden rounded-xl",
  {
    variants: {
      variant: {
        glinr:
          "bg-[var(--surface-well)] [box-shadow:var(--elev-inset),inset_0_0_0_1px_var(--line-soft)]",
        solid: "bg-[var(--surface-3)] shadow-[inset_0_0_0_1px_var(--line-soft)]",
        plain: "rounded-md bg-[color-mix(in_oklab,var(--color-foreground)_10%,transparent)]",
        soft: "bg-[var(--surface-2)]",
        outline:
          "border border-[var(--color-border)] bg-transparent",
        ghost: "bg-[color-mix(in_oklab,var(--color-foreground)_6%,transparent)]",
        glass:
          "border border-[color:var(--glass-border)] [border-top-color:var(--glass-refraction-top)] bg-[var(--glass-readable)] backdrop-blur-xl backdrop-saturate-[180%]",
        liquid:
          "border border-neutral-300/50 [border-top-color:var(--glass-refraction-top)] bg-[radial-gradient(circle_at_16%_12%,rgb(255_255_255_/_0.7),transparent_44%),linear-gradient(168deg,rgb(245_245_248),rgb(232_232_236))] dark:border-white/[0.12] dark:[border-top-color:rgb(255_255_255_/_0.2)] dark:bg-[linear-gradient(168deg,rgb(38_40_46),rgb(28_30_34))]",
        matte:
          "border border-black/[0.06] bg-[linear-gradient(180deg,rgb(244_244_246),rgb(232_232_236))] dark:border-white/[0.1] dark:bg-[linear-gradient(180deg,rgb(40_42_48),rgb(30_32_36))]"
      },
      size: {
        sm: "h-4",
        md: "h-6",
        lg: "h-10"
      }
    },
    defaultVariants: {
      variant: "glinr",
      size: "md"
    }
  }
)

const SHIMMER = "bg-gradient-to-r from-transparent via-[color-mix(in_oklab,var(--color-foreground)_9%,transparent)] to-transparent"

const shimmerClass = "pointer-events-none absolute inset-0 motion-safe:animate-skeleton-shimmer motion-reduce:hidden"

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement> &
  Pick<VariantProps<typeof skeletonVariants>, "size"> & {
    /** Placeholder look. Omit to follow the ambient design style (glinr = inset well). Same vocabulary as Input. */
    variant?: ControlVariantProp
    decorative?: boolean
  }

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, size, decorative = true, ...props }, ref) => {
    const resolved = useControlVariant(variant, SKELETON_VARIANTS)
    return (
      <div
        ref={ref}
        aria-hidden={decorative ? true : undefined}
        data-variant={resolved}
        className={cn(skeletonVariants({ variant: resolved, size }), className)}
        {...props}
      >
        <div className={cn(shimmerClass, SHIMMER)} />
      </div>
    )
  }
)

Skeleton.displayName = "Skeleton"
