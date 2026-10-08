"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cva } from "class-variance-authority"
import { Check, Minus } from "@phosphor-icons/react/dist/ssr"

import { cn } from "../lib/cn"
import { useControlVariant, type ControlVariant, type ControlVariantProp } from "../lib/control"

const CHECKBOX_VARIANTS = ["glinr", "solid", "plain", "soft", "outline", "ghost", "glass", "liquid", "matte"] as const satisfies readonly ControlVariant[]

// Checked and indeterminate share one look through the `:is()` arbitrary variant.
const checkboxVariants = cva(
  "peer shrink-0 border outline-none transition-[background-color,border-color,box-shadow,transform] duration-fast ease-standard focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--surface-0)] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none motion-reduce:transition-none active:scale-95 motion-reduce:active:scale-100 aria-[invalid=true]:border-[color:var(--tone-danger)] aria-[invalid=true]:[--ring-img:var(--tone-danger)] aria-[invalid=true]:focus-visible:ring-[color:var(--tone-danger)]",
  {
    variants: {
      variant: {
        glinr:
          "border-transparent [--well:var(--surface-well)] [--ring-img:var(--ring)] [background:linear-gradient(var(--well),var(--well))_padding-box,var(--ring-img)_border-box] [box-shadow:var(--elev-inset)] hover:[--ring-img:var(--ring-hot,var(--ring))] focus-visible:ring-[color:var(--color-accent)] [&:is([data-state=checked],[data-state=indeterminate])]:[--well:var(--color-accent)] [&:is([data-state=checked],[data-state=indeterminate])]:[--ring-img:var(--ring-solid)] [&:is([data-state=checked],[data-state=indeterminate])]:[box-shadow:var(--solid-elev-1)]",
        solid:
          "border-[color:var(--color-border)] bg-[var(--surface-3)] hover:border-[color:color-mix(in_oklab,var(--color-foreground)_45%,transparent)] focus-visible:ring-[color:var(--color-accent)] [&:is([data-state=checked],[data-state=indeterminate])]:border-[color:var(--neutral-solid)] [&:is([data-state=checked],[data-state=indeterminate])]:bg-[var(--neutral-solid)] [&:is([data-state=checked],[data-state=indeterminate])]:[box-shadow:var(--solid-elev-1)]",
        plain:
          "border-[color:var(--color-border)] bg-transparent shadow-sm hover:border-[color:color-mix(in_oklab,var(--color-foreground)_45%,transparent)] focus-visible:ring-[color:color-mix(in_oklab,var(--color-foreground)_20%,transparent)] [&:is([data-state=checked],[data-state=indeterminate])]:border-[color:var(--neutral-solid)] [&:is([data-state=checked],[data-state=indeterminate])]:bg-[var(--neutral-solid)]",
        soft:
          "border-transparent bg-[var(--surface-2)] shadow-[inset_0_0_0_1px_var(--line-soft)] hover:bg-[var(--surface-3)] focus-visible:ring-[color:var(--color-accent)] [&:is([data-state=checked],[data-state=indeterminate])]:bg-[color-mix(in_oklab,var(--tone-accent)_16%,var(--surface-1))] [&:is([data-state=checked],[data-state=indeterminate])]:shadow-[inset_0_0_0_1px_var(--tone-accent)]",
        outline:
          "border-[color:color-mix(in_oklab,var(--color-foreground)_40%,transparent)] bg-transparent hover:border-[color:var(--color-foreground)] focus-visible:ring-[color:var(--color-accent)] [&:is([data-state=checked],[data-state=indeterminate])]:border-[color:var(--tone-accent)]",
        ghost:
          "border-[color:color-mix(in_oklab,var(--color-foreground)_25%,transparent)] bg-transparent hover:bg-[color-mix(in_oklab,var(--color-foreground)_7%,transparent)] focus-visible:ring-[color:var(--color-accent)] [&:is([data-state=checked],[data-state=indeterminate])]:bg-[color-mix(in_oklab,var(--color-foreground)_12%,transparent)]",
        glass:
          "border-[color:var(--glass-border)] [border-top-color:var(--glass-refraction-top)] bg-[var(--glass-readable)] bg-clip-padding backdrop-blur-xl backdrop-saturate-[180%] hover:border-[color:var(--glass-border-strong)] focus-visible:ring-[color:var(--color-accent)] [&:is([data-state=checked],[data-state=indeterminate])]:border-[color:var(--tone-accent)] [&:is([data-state=checked],[data-state=indeterminate])]:bg-[var(--tone-accent)]",
        liquid:
          "border-white/[0.24] [border-top-color:var(--glass-refraction-top)] bg-[radial-gradient(circle_at_18%_12%,rgb(255_255_255_/_0.94),transparent_42%),radial-gradient(circle_at_84%_88%,rgb(226_232_240_/_0.58),transparent_58%),linear-gradient(145deg,rgb(255_255_255_/_0.82),rgb(235_241_246_/_0.55))] shadow-[0_0_0_1px_rgb(255_255_255_/_0.24)_inset,0_10px_18px_-12px_rgb(15_23_42_/_0.26)] focus-visible:ring-[color:var(--color-accent)] data-[state=checked]:border-white/[0.44] data-[state=checked]:bg-neutral-900 data-[state=checked]:[border-top-color:rgb(255_255_255_/_0.92)] dark:border-white/[0.15] dark:bg-[linear-gradient(145deg,rgb(255_255_255_/_0.13),rgb(255_255_255_/_0.05))] dark:data-[state=checked]:border-white/[0.34] dark:data-[state=checked]:bg-white",
        matte:
          "border-black/[0.12] bg-[linear-gradient(180deg,rgb(249_250_251),rgb(237_239_242))] shadow-[0_1px_0_rgb(255_255_255_/_0.88)_inset,0_6px_14px_-12px_rgb(15_23_42_/_0.24)] focus-visible:ring-[color:var(--color-accent)] data-[state=checked]:border-black/65 data-[state=checked]:bg-black dark:border-white/[0.14] dark:bg-[linear-gradient(180deg,rgb(49_54_63_/_0.92),rgb(34_38_46_/_0.92))] dark:data-[state=checked]:border-white/70 dark:data-[state=checked]:bg-white"
      },
      size: {
        sm: "h-4 w-4 rounded-[0.3rem]",
        md: "h-5 w-5 rounded",
        lg: "h-6 w-6 rounded-md"
      }
    },
    defaultVariants: {
      variant: "glinr",
      size: "md"
    }
  }
)

const checkboxIconVariants = cva("", {
  variants: {
    size: {
      sm: "h-3 w-3",
      md: "h-3.5 w-3.5",
      lg: "h-4 w-4"
    }
  },
  defaultVariants: {
    size: "md"
  }
})

const checkboxIndicatorVariants = cva(
  "group flex items-center justify-center [--tw-duration:var(--motion-micro)] ease-[var(--ease-out)] data-[state=checked]:animate-in data-[state=indeterminate]:animate-in data-[state=checked]:zoom-in-50 data-[state=indeterminate]:zoom-in-50 data-[state=checked]:fade-in-0 data-[state=indeterminate]:fade-in-0",
  {
    variants: {
      variant: {
        glinr: "text-[color:var(--color-accent-foreground)]",
        solid: "text-[color:var(--neutral-solid-fg)]",
        plain: "text-[color:var(--neutral-solid-fg)]",
        soft: "text-[color:var(--tone-accent-text)]",
        outline: "text-[color:var(--tone-accent-text)]",
        ghost: "text-[color:var(--color-foreground)]",
        glass: "text-[color:var(--tone-accent-fg)]",
        liquid: "text-white dark:text-neutral-900",
        matte: "text-white dark:text-neutral-900"
      }
    },
    defaultVariants: {
      variant: "glinr"
    }
  }
)

export type CheckboxProps = Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, "children"> & {
  /**
   * Surface look. Omit to follow the ambient design style (glinr = inset well with a raised accent check).
   * Also: solid, plain, soft, outline, ghost, glass (opt-in), liquid, matte, frosted.
   */
  variant?: ControlVariantProp
  size?: "sm" | "md" | "lg"
}

export const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, variant, size, ...props }, ref) => {
  const resolved = useControlVariant(variant, CHECKBOX_VARIANTS)
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      data-variant={resolved}
      className={cn(checkboxVariants({ variant: resolved, size }), className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator className={cn(checkboxIndicatorVariants({ variant: resolved }))}>
        <Check weight="bold" className={cn(checkboxIconVariants({ size }), "group-data-[state=indeterminate]:hidden")} />
        <Minus weight="bold" className={cn(checkboxIconVariants({ size }), "hidden group-data-[state=indeterminate]:block")} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})

Checkbox.displayName = "Checkbox"
