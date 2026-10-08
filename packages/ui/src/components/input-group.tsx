"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { textControlVariants, useControlVariant, type ControlVariant, type ControlVariantProp } from "../lib/control"
import { Button, type ButtonProps } from "./button"

const inputGroupBase =
  "group/input-group relative flex w-full min-w-0 items-center gap-2 text-sm transition-[background-color,border-color,box-shadow] duration-normal ease-standard motion-reduce:transition-none has-[[data-slot=input-group-control]:focus-visible]:ring-2 has-[[data-slot=input-group-control]:focus-visible]:ring-[color:var(--grp-ring,var(--color-accent))] has-[[data-slot=input-group-control]:focus-visible]:ring-offset-2 has-[[data-slot=input-group-control]:focus-visible]:ring-offset-[color:var(--surface-0)] has-[[data-slot=input-group-control][aria-invalid=true]]:border-[color:var(--tone-danger)] has-[[data-slot=input-group-control][aria-invalid=true]]:[--ring-img:var(--tone-danger)] has-[[data-slot=input-group-control][aria-invalid=true]]:ring-[color:var(--tone-danger)] has-[[data-slot=input-group-control]:disabled]:cursor-not-allowed has-[[data-slot=input-group-control]:disabled]:opacity-50 has-[[data-slot=input-group-control]:disabled]:shadow-none has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-end]]:flex-col has-[>textarea]:h-auto"

const inputGroupSizeVariants = cva("", {
  variants: {
    size: {
      sm: "h-8 px-2.5 text-xs",
      md: "h-9 px-3 text-sm",
      lg: "h-10 px-3.5 text-sm"
    }
  },
  defaultVariants: { size: "md" }
})

const GROUP_VARIANTS = ["glinr", "solid", "plain", "soft", "outline", "ghost", "glass", "liquid", "matte", "filled"] as const satisfies readonly ControlVariant[]

const inputGroupAddonVariants = cva(
  "flex cursor-text select-none items-center justify-center gap-2 text-sm font-medium text-[color:var(--color-muted)] [&>svg]:pointer-events-none [&>svg]:size-4 group-data-[disabled=true]/input-group:opacity-50",
  {
    variants: {
      align: {
        "inline-start": "order-first",
        "inline-end": "order-last",
        "block-start": "order-first w-full justify-start pt-2.5",
        "block-end": "order-last w-full justify-start pb-2.5"
      }
    },
    defaultVariants: {
      align: "inline-start"
    }
  }
)

export type InputGroupProps = React.HTMLAttributes<HTMLDivElement> &
  Pick<VariantProps<typeof inputGroupSizeVariants>, "size"> & {
    /**
     * Surface look, shared with Input. Omit to follow the ambient design style (glinr = inset well).
     * The group owns the surface; the control inside stays transparent so radii stay concentric.
     */
    variant?: ControlVariantProp
  }

export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, variant, size, ...props }, ref) => {
    const resolved = useControlVariant(variant, GROUP_VARIANTS)
    return (
      <div
        ref={ref}
        role="group"
        data-slot="input-group"
        data-variant={resolved}
        className={cn(
          textControlVariants({ variant: resolved }),
          inputGroupBase,
          resolved === "plain" && "[--grp-ring:color-mix(in_oklab,var(--color-foreground)_20%,transparent)]",
          inputGroupSizeVariants({ size }),
          className
        )}
        {...props}
      />
    )
  }
)

InputGroup.displayName = "InputGroup"

export type InputGroupAddonProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof inputGroupAddonVariants>

export const InputGroupAddon = React.forwardRef<HTMLDivElement, InputGroupAddonProps>(
  ({ className, align = "inline-start", onClick, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        if ((event.target as HTMLElement).closest("button")) return
        const control = event.currentTarget.parentElement?.querySelector<HTMLElement>(
          "[data-slot=input-group-control]"
        )
        control?.focus()
      }}
      {...props}
    />
  )
)

InputGroupAddon.displayName = "InputGroupAddon"

export type InputGroupButtonProps = Omit<ButtonProps, "size"> & {
  size?: "xs" | "sm"
}

export const InputGroupButton = React.forwardRef<HTMLButtonElement, InputGroupButtonProps>(
  ({ className, type = "button", variant = "ghost", size = "xs", ...props }, ref) => (
    <Button
      ref={ref}
      type={type}
      variant={variant}
      size="sm"
      className={cn(
        "gap-1.5 rounded-md shadow-none [&_svg]:size-3.5",
        size === "xs" ? "h-6 px-2 text-xs" : "h-7 px-2.5 text-xs",
        className
      )}
      {...props}
    />
  )
)

InputGroupButton.displayName = "InputGroupButton"

export const InputGroupText = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "flex items-center gap-2 text-sm text-[var(--color-muted)] [&_svg]:pointer-events-none [&_svg]:size-4",
      className
    )}
    {...props}
  />
))

InputGroupText.displayName = "InputGroupText"

const controlClass =
  "w-full min-w-0 flex-1 bg-transparent text-inherit outline-none placeholder:text-[color:var(--color-muted)] disabled:cursor-not-allowed"

export const InputGroupInput = React.forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">
>(({ className, type = "text", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    data-slot="input-group-control"
    className={cn(controlClass, "h-full", className)}
    {...props}
  />
))

InputGroupInput.displayName = "InputGroupInput"

export const InputGroupTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, rows = 3, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={rows}
    data-slot="input-group-control"
    className={cn(controlClass, "resize-none py-2.5", className)}
    {...props}
  />
))

InputGroupTextarea.displayName = "InputGroupTextarea"
