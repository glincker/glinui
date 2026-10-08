"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { cva } from "class-variance-authority"

import { cn } from "../lib/cn"
import { useControlVariant, type ControlVariant, type ControlVariantProp } from "../lib/control"

export interface RadioGroupProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  /** Controlled selected value. */
  value?: string
  /** Initial selected value for uncontrolled usage. */
  defaultValue?: string
  /** Called when the selected value changes. */
  onValueChange?: (value: string) => void
  /** Layout direction for radio items. */
  orientation?: "horizontal" | "vertical"
  /** Disables all radio items in the group. */
  disabled?: boolean
}

export const RadioGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root ref={ref} className={cn("grid gap-2", className)} {...props} />
})

RadioGroup.displayName = "RadioGroup"

const RADIO_VARIANTS = ["glinr", "solid", "plain", "soft", "outline", "ghost", "glass", "liquid", "matte"] as const satisfies readonly ControlVariant[]

const radioItemVariants = cva(
  "shrink-0 rounded-full border outline-none transition-[background-color,border-color,box-shadow,transform] duration-fast ease-standard focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--surface-0)] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none motion-reduce:transition-none active:scale-95 motion-reduce:active:scale-100 aria-[invalid=true]:border-[color:var(--tone-danger)] aria-[invalid=true]:[--ring-img:var(--tone-danger)] aria-[invalid=true]:focus-visible:ring-[color:var(--tone-danger)]",
  {
    variants: {
      variant: {
        glinr:
          "border-transparent [--well:var(--surface-well)] [--ring-img:var(--ring)] [background:linear-gradient(var(--well),var(--well))_padding-box,var(--ring-img)_border-box] [box-shadow:var(--elev-inset)] hover:[--ring-img:var(--ring-hot,var(--ring))] focus-visible:ring-[color:var(--color-accent)] data-[state=checked]:[--well:var(--color-accent)] data-[state=checked]:[--ring-img:var(--ring-solid)] data-[state=checked]:[box-shadow:var(--solid-elev-1)]",
        solid:
          "border-[color:var(--color-border)] bg-[var(--surface-3)] hover:border-[color:color-mix(in_oklab,var(--color-foreground)_45%,transparent)] focus-visible:ring-[color:var(--color-accent)] data-[state=checked]:border-[color:var(--neutral-solid)] data-[state=checked]:bg-[var(--neutral-solid)] data-[state=checked]:[box-shadow:var(--solid-elev-1)]",
        plain:
          "border-[color:var(--color-border)] bg-transparent shadow-sm hover:border-[color:color-mix(in_oklab,var(--color-foreground)_45%,transparent)] focus-visible:ring-[color:color-mix(in_oklab,var(--color-foreground)_20%,transparent)] data-[state=checked]:border-[color:var(--neutral-solid)]",
        soft:
          "border-transparent bg-[var(--surface-2)] shadow-[inset_0_0_0_1px_var(--line-soft)] hover:bg-[var(--surface-3)] focus-visible:ring-[color:var(--color-accent)] data-[state=checked]:bg-[color-mix(in_oklab,var(--tone-accent)_16%,var(--surface-1))] data-[state=checked]:shadow-[inset_0_0_0_1px_var(--tone-accent)]",
        outline:
          "border-[color:color-mix(in_oklab,var(--color-foreground)_40%,transparent)] bg-transparent hover:border-[color:var(--color-foreground)] focus-visible:ring-[color:var(--color-accent)] data-[state=checked]:border-[color:var(--tone-accent)]",
        ghost:
          "border-[color:color-mix(in_oklab,var(--color-foreground)_25%,transparent)] bg-transparent hover:bg-[color-mix(in_oklab,var(--color-foreground)_7%,transparent)] focus-visible:ring-[color:var(--color-accent)] data-[state=checked]:bg-[color-mix(in_oklab,var(--color-foreground)_12%,transparent)]",
        glass:
          "border-[color:var(--glass-border)] [border-top-color:var(--glass-refraction-top)] bg-[var(--glass-readable)] bg-clip-padding backdrop-blur-xl backdrop-saturate-[180%] hover:border-[color:var(--glass-border-strong)] focus-visible:ring-[color:var(--color-accent)] data-[state=checked]:border-[color:var(--tone-accent)] data-[state=checked]:bg-[var(--tone-accent)]",
        liquid:
          "border-white/[0.24] [border-top-color:var(--glass-refraction-top)] bg-[radial-gradient(circle_at_18%_12%,rgb(255_255_255_/_0.94),transparent_42%),radial-gradient(circle_at_84%_88%,rgb(226_232_240_/_0.58),transparent_58%),linear-gradient(145deg,rgb(255_255_255_/_0.82),rgb(235_241_246_/_0.55))] shadow-[0_0_0_1px_rgb(255_255_255_/_0.24)_inset,0_10px_18px_-12px_rgb(15_23_42_/_0.26)] focus-visible:ring-[color:var(--color-accent)] dark:border-white/[0.15] dark:bg-[linear-gradient(145deg,rgb(255_255_255_/_0.13),rgb(255_255_255_/_0.05))]",
        matte:
          "border-black/[0.12] bg-[linear-gradient(180deg,rgb(249_250_251),rgb(237_239_242))] shadow-[0_1px_0_rgb(255_255_255_/_0.88)_inset,0_6px_14px_-12px_rgb(15_23_42_/_0.24)] focus-visible:ring-[color:var(--color-accent)] dark:border-white/[0.14] dark:bg-[linear-gradient(180deg,rgb(49_54_63_/_0.92),rgb(34_38_46_/_0.92))]"
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

const radioIndicatorVariants = cva(
  "relative flex h-full w-full items-center justify-center [--tw-duration:var(--motion-micro)] ease-[var(--ease-out)] data-[state=checked]:animate-in data-[state=checked]:zoom-in-50 data-[state=checked]:fade-in-0 after:block after:rounded-full",
  {
    variants: {
      variant: {
        glinr: "after:bg-[var(--color-accent-foreground)]",
        solid: "after:bg-[var(--neutral-solid-fg)]",
        plain: "after:bg-[var(--neutral-solid)]",
        soft: "after:bg-[var(--tone-accent)]",
        outline: "after:bg-[var(--tone-accent)]",
        ghost: "after:bg-[var(--color-foreground)]",
        glass: "after:bg-[var(--tone-accent-fg)]",
        liquid: "after:bg-neutral-900 dark:after:bg-white",
        matte: "after:bg-neutral-900 dark:after:bg-white"
      },
      size: {
        sm: "after:h-2 after:w-2",
        md: "after:h-2.5 after:w-2.5",
        lg: "after:h-3 after:w-3"
      }
    },
    defaultVariants: {
      variant: "glinr",
      size: "md"
    }
  }
)

export interface RadioGroupItemProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  /**
   * Surface treatment for the radio item shell. Omit to follow the ambient design style.
   * Also: solid, plain, soft, outline, ghost, glass (opt-in), liquid, matte, frosted.
   */
  variant?: ControlVariantProp
  /** Size of the radio control. */
  size?: "sm" | "md" | "lg"
  /** Value submitted by this radio item when selected. */
  value: string
  /** Disables this radio item. */
  disabled?: boolean
}

export const RadioGroupItem = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, variant, size = "md", ...props }, ref) => {
  const resolved = useControlVariant(variant, RADIO_VARIANTS)
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      data-variant={resolved}
      className={cn(radioItemVariants({ variant: resolved, size }), className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className={cn(radioIndicatorVariants({ variant: resolved, size }))} />
    </RadioGroupPrimitive.Item>
  )
})

RadioGroupItem.displayName = "RadioGroupItem"
