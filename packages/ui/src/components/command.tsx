"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { cva, type VariantProps } from "class-variance-authority"
import { MagnifyingGlass } from "@phosphor-icons/react"

import { cn } from "../lib/cn"
import { PANEL_ITEM_SELECTABLE, PANEL_SEPARATOR, panelSurface, type PanelVariantProp } from "../lib/panel"
import type { SurfaceVariant } from "../lib/surface"
import { useResolvedPanelVariant } from "./panel-context"

/** Layout of the command shell. The surface look comes from `panelSurface`. */
const commandVariants = cva(
  "flex h-full w-full flex-col overflow-hidden transition-[background-color,border-color,box-shadow] duration-fast ease-standard motion-reduce:transition-none",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base"
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
)

type CommandContextValue = {
  variant: SurfaceVariant
  size: NonNullable<VariantProps<typeof commandVariants>["size"]>
}

const CommandContext = React.createContext<CommandContextValue>({
  variant: "glinr",
  size: "md"
})

function useCommandContext() {
  return React.useContext(CommandContext)
}

const commandInputWrapperVariants = cva(
  "flex items-center border-b border-[color:var(--line-soft)] transition-[background-color,border-color] duration-fast ease-standard",
  {
    variants: {
      look: {
        raised:
          "relative z-[1] [background:var(--sheen),var(--face-0,var(--surface-2))] shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06),0_8px_12px_-8px_rgb(0_0_0_/_0.35)]",
        flat: "border-[color:var(--color-border)] bg-transparent focus-within:bg-[color-mix(in_oklab,var(--color-foreground)_3%,transparent)]",
        glass: "bg-[color-mix(in_oklab,var(--surface-1)_60%,transparent)] focus-within:bg-[color-mix(in_oklab,var(--color-foreground)_4%,transparent)]"
      },
      size: {
        sm: "px-2",
        md: "px-3",
        lg: "px-4"
      }
    },
    defaultVariants: {
      look: "raised",
      size: "md"
    }
  }
)

const commandInputVariants = cva(
  "w-full rounded-md bg-transparent outline-none placeholder:text-[var(--color-muted)] disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-8 py-2 text-xs",
        md: "h-10 py-3 text-sm",
        lg: "h-12 py-3 text-base"
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
)

const commandItemVariants = cva(`${PANEL_ITEM_SELECTABLE} px-2.5 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0`, {
  variants: {
    size: {
      sm: "py-1 text-xs",
      md: "py-1.5 text-sm",
      lg: "py-2 text-base"
    }
  },
  defaultVariants: {
    size: "md"
  }
})

function inputLook(variant: SurfaceVariant): "raised" | "flat" | "glass" {
  if (variant === "glinr" || variant === "gradient") return "raised"
  if (variant === "glass") return "glass"
  return "flat"
}

export type CommandProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive> &
  VariantProps<typeof commandVariants> & {
    /**
     * Surface look. Omit for the ambient design style (glinr by default). `glass` is opt-in and
     * needs a rich backdrop to read as frosted.
     */
    variant?: PanelVariantProp
  }

export const Command = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive>,
  CommandProps
>(({ className, variant, size, ...props }, ref) => {
  const resolvedVariant = useResolvedPanelVariant(variant)
  const resolvedSize = size ?? "md"
  const contextValue = React.useMemo(
    () => ({ variant: resolvedVariant, size: resolvedSize }),
    [resolvedVariant, resolvedSize]
  )

  return (
    <CommandContext.Provider value={contextValue}>
      <CommandPrimitive
        ref={ref}
        data-variant={resolvedVariant}
        className={cn(
          panelSurface({ variant: resolvedVariant, shape: "popover" }),
          commandVariants({ size: resolvedSize }),
          className
        )}
        {...props}
      />
    </CommandContext.Provider>
  )
})

Command.displayName = "Command"

export const CommandInput = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => {
  const { size, variant } = useCommandContext()

  return (
    <div className={cn(commandInputWrapperVariants({ size, look: inputLook(variant) }))} cmdk-input-wrapper="">
      <MagnifyingGlass
        className={cn(
          "mr-2 shrink-0 text-[var(--color-muted)]",
          size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"
        )}
      />
      <CommandPrimitive.Input
        ref={ref}
        className={cn(commandInputVariants({ size }), className)}
        {...props}
      />
    </div>
  )
})

CommandInput.displayName = "CommandInput"

export const CommandList = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[320px] overflow-y-auto overflow-x-hidden p-1.5", className)}
    {...props}
  />
))

CommandList.displayName = "CommandList"

export const CommandEmpty = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Empty ref={ref} className={cn("py-8 text-center text-sm", className)} {...props} />
))

CommandEmpty.displayName = "CommandEmpty"

export const CommandGroup = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-[var(--color-foreground)] [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.08em] [&_[cmdk-group-heading]]:text-[var(--color-muted)]",
      className
    )}
    {...props}
  />
))

CommandGroup.displayName = "CommandGroup"

export const CommandSeparator = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn(PANEL_SEPARATOR, className)}
    {...props}
  />
))

CommandSeparator.displayName = "CommandSeparator"

export const CommandItem = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => {
  const { size } = useCommandContext()

  return (
    <CommandPrimitive.Item
      ref={ref}
      className={cn(commandItemVariants({ size }), className)}
      {...props}
    />
  )
})

CommandItem.displayName = "CommandItem"

export const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("ml-auto rounded border border-[var(--line-soft)] bg-[var(--surface-2)] px-1.5 py-0.5 font-mono text-[11px] tracking-[0.04em] text-[var(--color-muted)]", className)} {...props} />
)

CommandShortcut.displayName = "CommandShortcut"
