"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CaretUpDown, Check } from "@phosphor-icons/react"

import { cn } from "../lib/cn"
import { textControlVariants, useControlVariant, type ControlVariant, type ControlVariantProp } from "../lib/control"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "./command"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { Popover, PopoverContent } from "./popover"

const comboboxSizeVariants = cva("inline-flex items-center justify-between gap-2 text-start", {
  variants: {
    size: {
      sm: "h-8 px-2.5 text-xs",
      md: "h-9 px-3 text-sm",
      lg: "h-10 px-3.5 text-sm"
    }
  },
  defaultVariants: { size: "md" }
})

const COMBOBOX_VARIANTS = ["glinr", "solid", "plain", "soft", "outline", "ghost", "glass", "liquid", "matte", "filled"] as const satisfies readonly ControlVariant[]

export type ComboboxOption = {
  value: string
  label: string
  /** Extra search terms matched by the filter. */
  keywords?: string[]
  disabled?: boolean
}

export type ComboboxProps = Pick<VariantProps<typeof comboboxSizeVariants>, "size"> & {
  /** Trigger look. Omit to follow the ambient design style (glinr = inset well). Same vocabulary as Input. */
  variant?: ControlVariantProp
  options: ComboboxOption[]
  /** Controlled selected value. */
  value?: string
  /** Initial value for uncontrolled usage. */
  defaultValue?: string
  /** Fires when the selection changes. Empty string means cleared. */
  onValueChange?: (value: string) => void
  /** Controlled open state. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Trigger text when nothing is selected. */
  placeholder?: string
  /** Placeholder inside the search input. */
  searchPlaceholder?: string
  /** Message shown when no option matches. */
  emptyText?: string
  /** Allow selecting the active option again to clear it. */
  clearable?: boolean
  disabled?: boolean
  /** Form field name; renders a hidden input with the value. */
  name?: string
  id?: string
  className?: string
  /** Extra class for the popover panel. */
  contentClassName?: string
  "aria-label"?: string
  "aria-labelledby"?: string
  "aria-describedby"?: string
  "aria-invalid"?: boolean | "true" | "false"
}

export const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      options,
      value: valueProp,
      defaultValue = "",
      onValueChange,
      open: openProp,
      onOpenChange,
      placeholder = "Select an option",
      searchPlaceholder = "Search...",
      emptyText = "No results found.",
      clearable = false,
      disabled,
      name,
      id,
      className,
      contentClassName,
      variant,
      size,
      ...aria
    },
    ref
  ) => {
    const listId = React.useId()
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
    const value = valueProp ?? uncontrolledValue
    const open = openProp ?? uncontrolledOpen
    const selected = options.find((option) => option.value === value)

    const setOpen = (next: boolean) => {
      if (openProp === undefined) setUncontrolledOpen(next)
      onOpenChange?.(next)
    }

    const select = (next: string) => {
      const resolved = clearable && next === value ? "" : next
      if (valueProp === undefined) setUncontrolledValue(resolved)
      onValueChange?.(resolved)
      setOpen(false)
    }

    const resolved = useControlVariant(variant, COMBOBOX_VARIANTS)

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <button
            ref={ref}
            id={id}
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-controls={open ? listId : undefined}
            disabled={disabled}
            data-slot="combobox-trigger"
            data-placeholder={selected ? undefined : "true"}
            data-variant={resolved}
            className={cn(textControlVariants({ variant: resolved }), comboboxSizeVariants({ size }), "w-full", className)}
            {...aria}
          >
            <span
              className={cn(
                "min-w-0 flex-1 truncate",
                !selected && "font-normal text-[color:var(--color-muted)]"
              )}
            >
              {selected ? selected.label : placeholder}
            </span>
            <CaretUpDown aria-hidden="true" className="size-4 shrink-0 text-[color:var(--color-muted)]" />
          </button>
        </PopoverPrimitive.Trigger>
        <PopoverContent
          variant={resolved === "glass" ? "glass" : undefined}
          align="start"
          className={cn(
            "w-[var(--radix-popover-trigger-width)] min-w-48 overflow-hidden p-0",
            contentClassName
          )}
        >
          <Command
            variant="ghost"
            size={size ?? "md"}
            className="rounded-none border-0 bg-transparent shadow-none ring-0"
          >
            <CommandInput placeholder={searchPlaceholder} aria-label={searchPlaceholder} />
            <CommandList id={listId}>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    keywords={option.keywords}
                    disabled={option.disabled}
                    onSelect={() => select(option.value)}
                  >
                    <Check
                      aria-hidden="true"
                      className={cn(
                        "transition-opacity duration-fast motion-reduce:transition-none",
                        option.value === value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
        {name ? <input type="hidden" name={name} value={value} /> : null}
      </Popover>
    )
  }
)

Combobox.displayName = "Combobox"
