"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { useControlVariant, type ControlVariant, type ControlVariantProp } from "../lib/control"

const SLIDER_VARIANTS = ["glinr", "solid", "plain", "soft", "outline", "ghost", "glass", "liquid"] as const satisfies readonly ControlVariant[]

const sliderVariants = cva(
  "relative flex w-full touch-none select-none items-center data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
  {
    variants: {
      size: {
        sm: "",
        md: "",
        lg: ""
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
)

const trackVariants = cva(
  "relative w-full grow overflow-hidden rounded-full transition-colors duration-fast ease-standard motion-reduce:transition-none",
  {
    variants: {
      variant: {
        glinr:
          "bg-[var(--surface-well)] [box-shadow:var(--elev-inset),inset_0_0_0_1px_color-mix(in_oklab,var(--color-foreground)_12%,transparent)]",
        solid: "bg-[var(--surface-3)] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-foreground)_10%,transparent)]",
        plain: "bg-[color-mix(in_oklab,var(--color-foreground)_14%,transparent)]",
        soft: "bg-[var(--surface-2)] shadow-[inset_0_0_0_1px_var(--line-soft)]",
        outline: "border border-[color:color-mix(in_oklab,var(--color-foreground)_35%,transparent)] bg-transparent",
        ghost: "bg-[color-mix(in_oklab,var(--color-foreground)_12%,transparent)]",
        glass:
          "border border-[color:var(--glass-border)] [border-top-color:var(--glass-refraction-top)] bg-[var(--glass-readable)] backdrop-blur-xl backdrop-saturate-[180%]",
        liquid:
          "border border-white/25 [border-top-color:var(--glass-refraction-top)] bg-[linear-gradient(180deg,rgb(255_255_255_/_0.52),rgb(242_242_242_/_0.32))] shadow-[0_0_0_1px_rgb(255_255_255_/_0.22)_inset] dark:border-white/[0.16] dark:[border-top-color:rgb(255_255_255_/_0.34)] dark:bg-[linear-gradient(180deg,rgb(255_255_255_/_0.12),rgb(255_255_255_/_0.06))]"
      },
      size: {
        sm: "h-1.5",
        md: "h-2",
        lg: "h-3"
      }
    },
    defaultVariants: {
      variant: "glinr",
      size: "md"
    }
  }
)

const rangeVariants = cva("absolute h-full rounded-full", {
  variants: {
    variant: {
      glinr: "bg-[var(--color-accent)] shadow-[inset_0_1px_0_rgb(255_255_255_/_0.3)]",
      solid: "bg-[var(--neutral-solid)]",
      plain: "bg-[var(--neutral-solid)]",
      soft: "bg-[var(--tone-accent)]",
      outline: "bg-[var(--tone-accent)]",
      ghost: "bg-[color-mix(in_oklab,var(--color-foreground)_80%,transparent)]",
      glass: "bg-[var(--tone-accent)] shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.16)]",
      liquid: "bg-[var(--color-accent)] shadow-[0_0_18px_color-mix(in_oklab,var(--color-accent)_35%,transparent)]"
    }
  },
  defaultVariants: {
    variant: "glinr"
  }
})

const thumbVariants = cva(
  "block rounded-full border-2 [box-shadow:var(--elev-1)] transition-[transform,background-color,border-color,box-shadow] duration-fast ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--surface-0)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none",
  {
    variants: {
      variant: {
        glinr:
          "border-transparent [background:linear-gradient(180deg,var(--key-white-top,#ffffff),var(--key-white-bottom,#dcdce1))] shadow-[inset_0_1px_0_#ffffff,0_1px_3px_rgb(0_0_0_/_0.45),0_0_0_1px_color-mix(in_oklab,var(--color-foreground)_28%,transparent)] hover:scale-110 active:scale-100 motion-reduce:hover:scale-100",
        solid:
          "border-[color:var(--neutral-solid)] bg-[var(--surface-1)] hover:scale-105 active:scale-100 motion-reduce:hover:scale-100",
        plain:
          "border-[color:var(--neutral-solid)] bg-[var(--surface-1)] shadow-sm hover:scale-105 active:scale-100 motion-reduce:hover:scale-100 focus-visible:ring-[color:color-mix(in_oklab,var(--color-foreground)_20%,transparent)]",
        soft:
          "border-[color:var(--tone-accent)] bg-[var(--surface-1)] hover:scale-105 active:scale-100 motion-reduce:hover:scale-100",
        outline:
          "border-[color:var(--tone-accent)] bg-[var(--surface-0)] hover:scale-105 active:scale-100 motion-reduce:hover:scale-100",
        ghost:
          "border-transparent bg-[var(--color-foreground)] hover:scale-105 active:scale-100 motion-reduce:hover:scale-100",
        glass:
          "border-[color:var(--tone-accent)] bg-[var(--glass-3-surface)] backdrop-blur-xl backdrop-saturate-[180%] [box-shadow:var(--shadow-glass-sm)] hover:scale-105 active:scale-100 motion-reduce:hover:scale-100",
        liquid:
          "border-[color:var(--color-accent)] bg-[var(--surface-1)] shadow-[0_0_0_2px_color-mix(in_oklab,var(--color-accent)_20%,transparent),0_6px_18px_color-mix(in_oklab,var(--color-accent)_25%,transparent)] hover:scale-110 active:scale-100 motion-reduce:hover:scale-100"
      },
      size: {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6"
      }
    },
    defaultVariants: {
      variant: "glinr",
      size: "md"
    }
  }
)

export type SliderProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> &
  VariantProps<typeof sliderVariants> & {
    /**
     * Surface look. Omit to follow the ambient design style (glinr = inset track, accent range, raised key thumb).
     * Also: solid, plain, soft, outline, ghost, glass (opt-in), liquid.
     */
    variant?: ControlVariantProp
  }

export const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, variant, size, ...props }, ref) => {
  const values = Array.isArray(props.value)
    ? props.value
    : Array.isArray(props.defaultValue)
      ? props.defaultValue
      : [0]
  const thumbCount = Math.max(values.length, 1)
  const resolved = useControlVariant(variant, SLIDER_VARIANTS)

  return (
    <SliderPrimitive.Root
      ref={ref}
      data-variant={resolved}
      className={cn(sliderVariants({ size }), className)}
      {...props}
    >
      <SliderPrimitive.Track className={cn(trackVariants({ variant: resolved, size }))}>
        <SliderPrimitive.Range className={cn(rangeVariants({ variant: resolved }))} />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbCount }).map((_, index) => (
        <SliderPrimitive.Thumb key={index} className={cn(thumbVariants({ variant: resolved, size }))} />
      ))}
    </SliderPrimitive.Root>
  )
})

Slider.displayName = "Slider"
