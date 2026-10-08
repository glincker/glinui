"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { useControlVariant, type ControlVariant, type ControlVariantProp } from "../lib/control"
import { warnIfUnlabeled } from "../lib/warn-unlabeled"

export const toggleVariants = cva(
  "relative inline-flex shrink-0 items-center after:absolute after:inset-x-0 after:content-[''] justify-center gap-2 whitespace-nowrap rounded-xl border font-medium text-[color:var(--color-foreground)] transition-[background-color,border-color,box-shadow,color,opacity] duration-fast ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--surface-0)] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none aria-[invalid=true]:border-[color:var(--tone-danger)] aria-[invalid=true]:[--ring-img:var(--tone-danger)] aria-[invalid=true]:focus-visible:ring-[color:var(--tone-danger)] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 motion-reduce:transition-none",
  {
    variants: {
      variant: {
        glinr:
          "border-transparent [--face:var(--face-2,var(--surface-2))] [--ring-img:var(--ring)] [background:var(--sheen)_padding-box,linear-gradient(var(--face),var(--face))_padding-box,var(--ring-img)_border-box] [box-shadow:var(--elev-1)] hover:[--face:var(--face-3,var(--surface-3))] hover:[--ring-img:var(--ring-hot,var(--ring))] data-[state=on]:[--face:color-mix(in_oklab,var(--tone-accent)_16%,var(--surface-well))] data-[state=on]:[--ring-img:linear-gradient(180deg,color-mix(in_oklab,var(--tone-accent)_60%,transparent),color-mix(in_oklab,var(--tone-accent)_28%,transparent))] data-[state=on]:text-[color:var(--tone-accent-text)] data-[state=on]:[box-shadow:var(--elev-inset)]",
        default:
          "border-transparent [--face:var(--face-2,var(--surface-2))] [--ring-img:var(--ring)] [background:var(--sheen)_padding-box,linear-gradient(var(--face),var(--face))_padding-box,var(--ring-img)_border-box] [box-shadow:var(--elev-1)] hover:[--face:var(--face-3,var(--surface-3))] hover:[--ring-img:var(--ring-hot,var(--ring))] data-[state=on]:[--face:color-mix(in_oklab,var(--tone-accent)_16%,var(--surface-well))] data-[state=on]:[--ring-img:linear-gradient(180deg,color-mix(in_oklab,var(--tone-accent)_60%,transparent),color-mix(in_oklab,var(--tone-accent)_28%,transparent))] data-[state=on]:text-[color:var(--tone-accent-text)] data-[state=on]:[box-shadow:var(--elev-inset)]",
        solid:
          "border-[color:var(--color-border)] bg-[var(--surface-3)] hover:bg-[color-mix(in_oklab,var(--surface-3)_88%,var(--color-foreground))] data-[state=on]:border-[color:var(--neutral-solid)] data-[state=on]:bg-[var(--neutral-solid)] data-[state=on]:text-[color:var(--neutral-solid-fg)] data-[state=on]:[box-shadow:var(--solid-elev-1)]",
        plain:
          "rounded-md border-transparent bg-transparent hover:bg-[var(--surface-2)] data-[state=on]:bg-[var(--surface-3)] data-[state=on]:text-[color:var(--color-foreground)] focus-visible:ring-[color:color-mix(in_oklab,var(--color-foreground)_20%,transparent)]",
        soft:
          "border-transparent bg-[var(--surface-2)] hover:bg-[var(--surface-3)] data-[state=on]:bg-[color-mix(in_oklab,var(--tone-accent)_16%,var(--surface-1))] data-[state=on]:text-[color:var(--tone-accent-text)] data-[state=on]:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--tone-accent)_40%,transparent)]",
        outline:
          "border-[color:color-mix(in_oklab,var(--color-foreground)_30%,transparent)] bg-transparent hover:bg-[color-mix(in_oklab,var(--color-foreground)_7%,transparent)] data-[state=on]:border-[color:var(--tone-accent)] data-[state=on]:bg-[color-mix(in_oklab,var(--tone-accent)_12%,transparent)] data-[state=on]:text-[color:var(--tone-accent-text)]",
        ghost:
          "border-transparent bg-transparent hover:bg-[color-mix(in_oklab,var(--color-foreground)_7%,transparent)] data-[state=on]:bg-[color-mix(in_oklab,var(--color-foreground)_12%,transparent)]",
        glass:
          "border-[color:var(--glass-border)] [border-top-color:var(--glass-refraction-top)] bg-[var(--glass-readable)] bg-clip-padding backdrop-blur-xl backdrop-saturate-[180%] hover:border-[color:var(--glass-border-strong)] data-[state=on]:border-[color:var(--tone-accent)] data-[state=on]:bg-[color-mix(in_oklab,var(--tone-accent)_24%,var(--glass-readable))] data-[state=on]:shadow-[inset_0_1px_3px_rgb(0_0_0_/_0.14)]"
      },
      size: {
        sm: "h-8 min-w-8 px-2.5 text-xs after:-inset-y-1.5",
        md: "h-9 min-w-9 px-3 text-sm after:-inset-y-1",
        lg: "h-10 min-w-10 px-4 text-sm after:-inset-y-0.5"
      }
    },
    defaultVariants: {
      variant: "glinr",
      size: "md"
    }
  }
)

const TOGGLE_VARIANTS = ["glinr", "solid", "plain", "soft", "outline", "ghost", "glass"] as const satisfies readonly ControlVariant[]

/** Resolves a toggle look: explicit name, else the ambient design style. Shared with ToggleGroup. */
export function useToggleVariant(variantProp: string | null | undefined) {
  return useControlVariant(variantProp, TOGGLE_VARIANTS)
}

export type ToggleProps = React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
  Pick<VariantProps<typeof toggleVariants>, "size"> & {
    /**
     * Surface look. Omit to follow the ambient design style (glinr = raised key that presses in when on).
     * Also: solid, plain, soft, outline, ghost, glass (opt-in).
     */
    variant?: ControlVariantProp
  }

export const Toggle = React.forwardRef<
  React.ComponentRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(({ className, variant, size, ...props }, ref) => {
  warnIfUnlabeled("Toggle", props)
  const resolved = useToggleVariant(variant)
  return (
    <TogglePrimitive.Root
      ref={ref}
      data-variant={resolved}
      className={cn(toggleVariants({ variant: resolved, size }), className)}
      {...props}
    />
  )
})

Toggle.displayName = "Toggle"
