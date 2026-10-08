"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { resolveControlVariant, type ControlVariant, type ControlVariantProp } from "../lib/control"
import { useGlinStyle } from "./glin-provider"

const PROGRESS_VARIANTS = ["glinr", "solid", "plain", "soft", "outline", "ghost", "glass", "liquid", "matte"] as const satisfies readonly ControlVariant[]

/** Progress adds `gradient` (accent to teal fill) on top of the shared control vocabulary. */
type ProgressLook = (typeof PROGRESS_VARIANTS)[number] | "gradient"

function useProgressLook(variantProp: string | null | undefined): ProgressLook {
  const style = useGlinStyle()
  return variantProp === "gradient" ? "gradient" : resolveControlVariant(variantProp, style, PROGRESS_VARIANTS)
}

const progressVariants = cva("relative w-full overflow-hidden rounded-full", {
  variants: {
    variant: {
      glinr:
        "bg-[var(--surface-well)] [box-shadow:var(--elev-inset),inset_0_0_0_1px_color-mix(in_oklab,var(--color-foreground)_10%,transparent)]",
      gradient:
        "bg-[var(--surface-well)] [box-shadow:var(--elev-inset),inset_0_0_0_1px_color-mix(in_oklab,var(--color-foreground)_10%,transparent)]",
      solid: "bg-[var(--surface-3)] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-foreground)_10%,transparent)]",
      plain: "bg-[color-mix(in_oklab,var(--color-foreground)_15%,transparent)]",
      soft: "bg-[var(--surface-2)] shadow-[inset_0_0_0_1px_var(--line-soft)]",
      outline: "border border-[color:color-mix(in_oklab,var(--color-foreground)_35%,transparent)] bg-transparent",
      ghost: "bg-[color-mix(in_oklab,var(--color-foreground)_10%,transparent)]",
      glass:
        "border border-[color:var(--glass-border)] [border-top-color:var(--glass-refraction-top)] bg-[var(--glass-readable)] backdrop-blur-xl backdrop-saturate-[180%]",
      liquid:
        "border border-white/25 [border-top-color:var(--glass-refraction-top)] bg-[radial-gradient(circle_at_16%_12%,rgb(255_255_255_/_0.8),transparent_44%),linear-gradient(168deg,rgb(255_255_255_/_0.6),rgb(236_236_236_/_0.34))] dark:border-white/[0.14] dark:[border-top-color:rgb(255_255_255_/_0.3)] dark:bg-[linear-gradient(168deg,rgb(255_255_255_/_0.12),rgb(255_255_255_/_0.05))]",
      matte:
        "border border-black/10 bg-[linear-gradient(180deg,rgb(250_250_251),rgb(236_236_238))] dark:border-white/[0.14] dark:bg-[linear-gradient(180deg,rgb(50_55_64_/_0.9),rgb(35_39_47_/_0.9))]"
    },
    size: {
      sm: "h-2",
      md: "h-3",
      lg: "h-4"
    }
  },
  defaultVariants: {
    variant: "glinr",
    size: "md"
  }
})

const indicatorVariants = cva(
  "h-full rounded-full transition-[width] duration-normal ease-standard motion-reduce:transition-none",
  {
    variants: {
      variant: {
        glinr: "bg-[var(--color-accent)] shadow-[inset_0_1px_0_rgb(255_255_255_/_0.3)]",
        gradient: "bg-[linear-gradient(90deg,var(--gradient-from),var(--gradient-to))] shadow-[inset_0_1px_0_rgb(255_255_255_/_0.3)]",
        solid: "bg-[var(--neutral-solid)]",
        plain: "bg-[var(--neutral-solid)]",
        soft: "bg-[var(--tone-accent)]",
        outline: "bg-[var(--tone-accent)]",
        ghost: "bg-[color-mix(in_oklab,var(--color-foreground)_75%,transparent)]",
        glass: "bg-[var(--tone-accent)] shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.16)]",
        liquid:
          "bg-[linear-gradient(90deg,rgb(15_23_42_/_0.92),rgb(30_41_59_/_0.9))] shadow-[0_0_14px_rgb(15_23_42_/_0.26)] dark:bg-[linear-gradient(90deg,rgb(248_250_252_/_0.92),rgb(226_232_240_/_0.82))] dark:shadow-[0_0_16px_rgb(226_232_240_/_0.24)]",
        matte: "bg-neutral-900 dark:bg-neutral-100"
      }
    },
    defaultVariants: {
      variant: "glinr"
    }
  }
)

const indeterminateIndicatorVariants = cva(
  "w-1/2 motion-safe:animate-pulse motion-reduce:animate-none",
  {
    variants: {
      variant: {
        glinr: "opacity-85",
        gradient: "opacity-85",
        solid: "opacity-85",
        plain: "opacity-85",
        soft: "opacity-85",
        outline: "opacity-85",
        ghost: "opacity-85",
        glass: "opacity-90",
        liquid: "opacity-90",
        matte: "opacity-90"
      }
    },
    defaultVariants: {
      variant: "glinr"
    }
  }
)

const progressCircleVariants = cva("relative inline-flex shrink-0 items-center justify-center", {
  variants: {
    size: {
      sm: "h-12 w-12 text-[11px]",
      md: "h-16 w-16 text-xs",
      lg: "h-24 w-24 text-sm"
    }
  },
  defaultVariants: {
    size: "md"
  }
})

const progressCircleTrackVariants = cva("fill-none", {
  variants: {
    variant: {
      glinr: "stroke-[color:var(--surface-3)]",
      gradient: "stroke-[color:var(--surface-3)]",
      solid: "stroke-[color:var(--surface-3)]",
      plain: "stroke-[color:color-mix(in_oklab,var(--color-foreground)_15%,transparent)]",
      soft: "stroke-[color:var(--surface-3)]",
      outline: "stroke-[color:color-mix(in_oklab,var(--color-foreground)_30%,transparent)]",
      ghost: "stroke-[color:color-mix(in_oklab,var(--color-foreground)_12%,transparent)]",
      glass: "stroke-[color:color-mix(in_oklab,var(--color-foreground)_22%,transparent)]",
      liquid: "stroke-neutral-300/85 dark:stroke-white/[0.2]",
      matte: "stroke-neutral-300 dark:stroke-white/[0.16]"
    }
  },
  defaultVariants: {
    variant: "glinr"
  }
})

const progressCircleIndicatorVariants = cva(
  "fill-none transition-[stroke-dashoffset,stroke] duration-normal ease-standard motion-reduce:transition-none",
  {
    variants: {
      variant: {
        glinr: "stroke-[color:var(--color-accent)]",
        gradient: "stroke-[color:var(--gradient-from)]",
        solid: "stroke-[color:var(--neutral-solid)]",
        plain: "stroke-[color:var(--neutral-solid)]",
        soft: "stroke-[color:var(--tone-accent)]",
        outline: "stroke-[color:var(--tone-accent)]",
        ghost: "stroke-[color:color-mix(in_oklab,var(--color-foreground)_75%,transparent)]",
        glass: "stroke-[color:var(--tone-accent)]",
        liquid:
          "stroke-neutral-900 drop-shadow-[0_0_6px_rgb(15_23_42_/_0.25)] dark:stroke-neutral-100 dark:drop-shadow-[0_0_6px_rgb(255_255_255_/_0.18)]",
        matte: "stroke-neutral-900 dark:stroke-neutral-100"
      }
    },
    defaultVariants: {
      variant: "glinr"
    }
  }
)

export type ProgressProps = React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> &
  Pick<VariantProps<typeof progressVariants>, "size"> & {
    /**
     * Look. Omit to follow the ambient design style (glinr = inset track, accent fill).
     * Also: solid, plain, soft, outline, ghost, gradient, glass (opt-in), liquid, matte.
     */
    variant?: ControlVariantProp
    /** Current progress value from 0 to 100. */
    value?: number
    /** Render loading state without aria-valuenow and fixed width indicator. */
    indeterminate?: boolean
  }

export const Progress = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, variant, size, indeterminate = false, ...props }, ref) => {
  const clampedValue = Math.max(0, Math.min(100, value ?? 0))
  const look = useProgressLook(variant)

  return (
    <ProgressPrimitive.Root
      ref={ref}
      data-variant={look}
      className={cn(progressVariants({ variant: look, size }), className)}
      value={indeterminate ? undefined : clampedValue}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          indicatorVariants({ variant: look }),
          indeterminate && indeterminateIndicatorVariants({ variant: look })
        )}
        style={indeterminate ? undefined : { width: `${clampedValue}%` }}
      />
    </ProgressPrimitive.Root>
  )
})

Progress.displayName = "Progress"

export type ProgressCircleProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> &
  VariantProps<typeof progressCircleVariants> & {
    value?: number
    variant?: ControlVariantProp
    strokeWidth?: number
    cap?: "round" | "square" | "butt"
    indeterminate?: boolean
    showValue?: boolean
    formatValue?: (value: number) => React.ReactNode
  }

export const ProgressCircle = React.forwardRef<HTMLDivElement, ProgressCircleProps>(
  (
    {
      className,
      value,
      variant,
      size,
      strokeWidth = 4,
      cap = "round",
      indeterminate = false,
      showValue = true,
      formatValue,
      ...props
    },
    ref
  ) => {
    const look = useProgressLook(variant)
    const clampedValue = Math.max(0, Math.min(100, value ?? 0))
    const normalizedStrokeWidth = Math.max(2, Math.min(10, strokeWidth))
    const viewBoxSize = 44
    const center = viewBoxSize / 2
    const radius = center - normalizedStrokeWidth / 2
    const circumference = 2 * Math.PI * radius
    const dashOffset = indeterminate
      ? circumference * 0.25
      : circumference - (clampedValue / 100) * circumference
    const dashArray = indeterminate ? circumference * 0.7 : circumference

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : clampedValue}
        className={cn(progressCircleVariants({ size }), className)}
        {...props}
      >
        <svg
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className={cn("size-full -rotate-90", indeterminate && "motion-safe:animate-spin")}
          aria-hidden="true"
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={normalizedStrokeWidth}
            className={cn(progressCircleTrackVariants({ variant: look }))}
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={normalizedStrokeWidth}
            strokeLinecap={cap}
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            className={cn(progressCircleIndicatorVariants({ variant: look }))}
          />
        </svg>
        {showValue && !indeterminate ? (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-medium text-[color:var(--color-foreground)]">
            {formatValue ? formatValue(clampedValue) : `${Math.round(clampedValue)}%`}
          </span>
        ) : null}
      </div>
    )
  }
)

ProgressCircle.displayName = "ProgressCircle"

export const CircularProgress = ProgressCircle
