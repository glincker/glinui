"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { useControlVariant, type ControlVariant, type ControlVariantProp } from "../lib/control"
import { Spinner } from "./spinner"
import {
  FILL_CLASS,
  SWITCH_MOTION,
  SWITCH_SIZES,
  THUMB_BG_CLASS,
  switchVariants,
  type SwitchSize
} from "./switch-styles"

export type SwitchProps = Omit<
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
  "onCheckedChange"
> &
  Omit<VariantProps<typeof switchVariants>, "variant"> & {
    /**
     * Track look. Omit to follow the ambient design style (glinr = inset well track with a raised accent fill).
     * Also: solid, plain, soft, outline, ghost, glass (opt-in, liquid fill), liquid, matte, frosted.
     */
    variant?: ControlVariantProp
    /** Controlled checked state. */
    checked?: boolean
    /** Initial checked state for uncontrolled usage. */
    defaultChecked?: boolean
    /** Callback fired when the checked state changes. */
    onCheckedChange?: (checked: boolean) => void
    /** Prevents interaction and applies muted styling. */
    disabled?: boolean
    /** Marks the switch as required within a form. */
    required?: boolean
    /** Form field name submitted with form data. */
    name?: string
    /** Value submitted with the form when checked. */
    value?: string
    /** Track and thumb size: sm 36x20, md 44x24, lg 52x28. */
    size?: SwitchSize
    /** Icon shown inside the thumb when on (sized to the thumb). */
    onIcon?: React.ReactNode
    /** Icon shown inside the thumb when off (sized to the thumb). */
    offIcon?: React.ReactNode
    /** Render "On"/"Off" text inside the track (large size only). */
    showLabels?: boolean
    /** Text for the on state when `showLabels` is set. */
    onLabel?: string
    /** Text for the off state when `showLabels` is set. */
    offLabel?: string
    /** Shows a spinner in the thumb, makes the switch inert and sets aria-busy. */
    loading?: boolean
    /** Field label. Renders a clickable label row. */
    label?: React.ReactNode
    /** Helper text under the label, linked through aria-describedby. */
    description?: React.ReactNode
    /** Class applied to the label row wrapper (only when label or description is set). */
    fieldClassName?: string
    /** Custom checked color (any CSS color). Applied as a CSS custom property, no inline style. */
    activeColor?: string
  }

function useMergedRef<T>(...refs: Array<React.Ref<T> | undefined>) {
  return React.useCallback(
    (node: T | null) => {
      for (const ref of refs) {
        if (typeof ref === "function") ref(node)
        else if (ref) (ref as React.MutableRefObject<T | null>).current = node
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs
  )
}

const SWITCH_VARIANTS = ["glinr", "solid", "plain", "soft", "outline", "ghost", "glass", "liquid", "matte"] as const satisfies readonly ControlVariant[]

export const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(
  (
    {
      className,
      variant,
      size = "md",
      onIcon,
      offIcon,
      showLabels = false,
      onLabel = "On",
      offLabel = "Off",
      loading = false,
      label,
      description,
      fieldClassName,
      activeColor,
      disabled,
      id,
      checked,
      defaultChecked,
      onCheckedChange,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const autoId = React.useId()
    const switchId = id ?? `${autoId}-switch`
    const descId = `${autoId}-desc`
    const localRef = React.useRef<HTMLButtonElement | null>(null)
    const mergedRef = useMergedRef<HTMLButtonElement>(ref, localRef)
    const geometry = SWITCH_SIZES[size]
    const resolved = useControlVariant(variant, SWITCH_VARIANTS)
    const hasFill = resolved === "glass" || resolved === "liquid"

    // Uncontrolled state is mirrored so icons and labels can follow it.
    const [internal, setInternal] = React.useState(defaultChecked ?? false)
    const isOn = checked ?? internal

    React.useEffect(() => {
      const el = localRef.current
      if (!el) return
      if (activeColor) el.style.setProperty("--sw-active", activeColor)
      else el.style.removeProperty("--sw-active")
    }, [activeColor])

    const handleChange = (next: boolean) => {
      if (loading) return
      if (checked === undefined) setInternal(next)
      onCheckedChange?.(next)
    }

    const describedBy = [ariaDescribedBy, description ? descId : undefined].filter(Boolean).join(" ")

    const control = (
      <SwitchPrimitive.Root
        ref={mergedRef}
        id={switchId}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={handleChange}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        aria-describedby={describedBy || undefined}
        data-size={size}
        data-loading={loading ? "true" : undefined}
        data-slot="switch"
        data-variant={resolved}
        className={cn(switchVariants({ variant: resolved }), geometry.track, geometry.hit, className)}
        {...props}
      >
        {hasFill ? (
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
            <span data-slot="switch-fill" className={FILL_CLASS} />
          </span>
        ) : null}
        {showLabels && size === "lg" ? (
          <>
            <span
              aria-hidden="true"
              data-slot="switch-label-on"
              className="pointer-events-none absolute start-2 text-[0.5625rem] font-semibold uppercase leading-none text-[color:var(--sw-on-fg,#ffffff)] opacity-0 transition-opacity duration-200 group-data-[state=checked]:opacity-100"
            >
              {onLabel}
            </span>
            <span
              aria-hidden="true"
              data-slot="switch-label-off"
              className="pointer-events-none absolute end-2 text-[0.5625rem] font-semibold uppercase leading-none text-[var(--color-muted)] transition-opacity duration-200 group-data-[state=checked]:opacity-0"
            >
              {offLabel}
            </span>
          </>
        ) : null}
        <SwitchPrimitive.Thumb
          data-slot="switch-thumb"
          className={cn(
            "pointer-events-none absolute start-0.5 top-1/2 -translate-y-1/2 flex items-center justify-center",
            "translate-x-0 data-[state=checked]:translate-x-[var(--sw-travel)] rtl:data-[state=checked]:-translate-x-[var(--sw-travel)]",
            SWITCH_MOTION,
            geometry.thumb,
            geometry.icon
          )}
        >
          <span aria-hidden="true" data-slot="switch-thumb-bg" className={THUMB_BG_CLASS} />
          <span
            aria-hidden="true"
            className="pointer-events-none relative flex items-center justify-center text-[var(--color-muted)] group-data-[state=checked]:text-[var(--sw-active,var(--color-accent))]"
          >
            {loading ? (
              <Spinner size="sm" variant="current" label="Loading" className={cn("text-[var(--color-accent)]", geometry.spinner)} />
            ) : isOn ? (
              onIcon
            ) : (
              offIcon
            )}
          </span>
        </SwitchPrimitive.Thumb>
      </SwitchPrimitive.Root>
    )

    if (label == null && description == null) return control

    return (
      <div
        data-slot="switch-field"
        className={cn("flex items-start justify-between gap-4", fieldClassName)}
      >
        <div className="flex min-w-0 flex-col gap-0.5">
          {label != null ? (
            <label
              htmlFor={switchId}
              className="cursor-pointer text-sm font-medium leading-5 text-[var(--color-foreground)]"
            >
              {label}
            </label>
          ) : null}
          {description != null ? (
            <p id={descId} className="text-sm leading-5 text-[var(--color-muted)]">
              {description}
            </p>
          ) : null}
        </div>
        {control}
      </div>
    )
  }
)

Switch.displayName = "Switch"
