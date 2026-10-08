"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Minus } from "@phosphor-icons/react"

import { cn } from "../lib/cn"
import { useControlVariant, type ControlVariant, type ControlVariantProp } from "../lib/control"

export const REGEXP_ONLY_DIGITS = "^[0-9]+$"
export const REGEXP_ONLY_CHARS = "^[a-zA-Z]+$"
export const REGEXP_ONLY_DIGITS_AND_CHARS = "^[a-zA-Z0-9]+$"

const OTP_VARIANTS = ["glinr", "solid", "plain", "soft", "outline", "ghost", "glass"] as const satisfies readonly ControlVariant[]

const inputOTPSlotVariants = cva(
  "relative flex items-center justify-center border-y border-e font-medium tabular-nums text-[color:var(--color-foreground)] transition-[background-color,border-color,box-shadow] duration-fast ease-standard first:border-s motion-reduce:transition-none",
  {
    variants: {
      variant: {
        glinr:
          "first:rounded-s-xl last:rounded-e-xl border-[color:color-mix(in_oklab,var(--color-foreground)_14%,transparent)] bg-[var(--surface-well)] [box-shadow:var(--elev-inset)] data-[active=true]:z-10 data-[active=true]:border-[color:var(--color-accent)] data-[active=true]:ring-2 data-[active=true]:ring-[color:var(--color-accent)]",
        solid:
          "first:rounded-s-xl last:rounded-e-xl border-[color:var(--color-border)] bg-[var(--surface-3)] data-[active=true]:z-10 data-[active=true]:border-[color:var(--color-accent)] data-[active=true]:ring-2 data-[active=true]:ring-[color:var(--color-accent)]",
        plain:
          "first:rounded-s-md last:rounded-e-md border-[color:var(--color-border)] bg-transparent shadow-sm data-[active=true]:z-10 data-[active=true]:border-[color:var(--color-foreground)] data-[active=true]:ring-2 data-[active=true]:ring-[color:color-mix(in_oklab,var(--color-foreground)_20%,transparent)]",
        soft:
          "first:rounded-s-xl last:rounded-e-xl border-[color:var(--surface-0)] bg-[var(--surface-2)] data-[active=true]:z-10 data-[active=true]:border-[color:var(--color-accent)] data-[active=true]:ring-2 data-[active=true]:ring-[color:var(--color-accent)]",
        outline:
          "first:rounded-s-xl last:rounded-e-xl border-[color:color-mix(in_oklab,var(--color-foreground)_30%,transparent)] bg-transparent data-[active=true]:z-10 data-[active=true]:border-[color:var(--color-accent)] data-[active=true]:ring-2 data-[active=true]:ring-[color:var(--color-accent)]",
        ghost:
          "first:rounded-s-xl last:rounded-e-xl border-[color:color-mix(in_oklab,var(--color-foreground)_12%,transparent)] bg-transparent data-[active=true]:z-10 data-[active=true]:border-[color:var(--color-accent)] data-[active=true]:ring-2 data-[active=true]:ring-[color:var(--color-accent)]",
        glass:
          "first:rounded-s-xl last:rounded-e-xl border-[color:var(--glass-border)] bg-[var(--glass-readable)] backdrop-blur-xl backdrop-saturate-[180%] data-[active=true]:z-10 data-[active=true]:border-[color:var(--color-accent)] data-[active=true]:ring-2 data-[active=true]:ring-[color:var(--color-accent)]"
      },
      size: {
        sm: "h-8 w-8 text-xs",
        md: "h-9 w-9 text-sm",
        lg: "h-10 w-10 text-base"
      }
    },
    defaultVariants: {
      variant: "glinr",
      size: "md"
    }
  }
)

type OTPContextValue = {
  value: string
  maxLength: number
  focused: boolean
  selection: readonly [number, number]
  disabled: boolean
  invalid: boolean
  variant: ControlVariant
  size: VariantProps<typeof inputOTPSlotVariants>["size"]
}

const OTPContext = React.createContext<OTPContextValue | null>(null)

function useOTPContext(): OTPContextValue {
  const ctx = React.useContext(OTPContext)
  if (!ctx) throw new Error("InputOTPSlot must be used within InputOTP")
  return ctx
}

export type InputOTPProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange" | "size" | "maxLength" | "pattern"
> &
  Pick<VariantProps<typeof inputOTPSlotVariants>, "size"> & {
    /** Surface look of the slots. Omit to follow the ambient design style. Same vocabulary as Input. */
    variant?: ControlVariantProp
    /** Number of characters. Required. */
    maxLength: number
    /** Controlled value. */
    value?: string
    /** Initial value for uncontrolled usage. */
    defaultValue?: string
    /** Fires with the new value on every accepted change. */
    onChange?: (value: string) => void
    /** Fires once when the value reaches maxLength. */
    onComplete?: (value: string) => void
    /** Regular expression source the whole value must match, e.g. REGEXP_ONLY_DIGITS. */
    pattern?: string
    /** Class for the outer container. */
    containerClassName?: string
  }

function matches(value: string, pattern: string | undefined): boolean {
  if (value === "" || !pattern) return true
  return new RegExp(pattern).test(value)
}

export const InputOTP = React.forwardRef<HTMLInputElement, InputOTPProps>(
  (
    {
      className,
      containerClassName,
      maxLength,
      value: valueProp,
      defaultValue = "",
      onChange,
      onComplete,
      pattern = REGEXP_ONLY_DIGITS,
      variant: variantProp,
      size,
      disabled = false,
      inputMode,
      autoComplete = "one-time-code",
      children,
      onFocus,
      onBlur,
      onSelect,
      onKeyDown,
      onPaste,
      "aria-label": ariaLabel = "Verification code",
      "aria-invalid": ariaInvalid,
      ...props
    },
    forwardedRef
  ) => {
    const innerRef = React.useRef<HTMLInputElement | null>(null)
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue.slice(0, maxLength))
    const [focused, setFocused] = React.useState(false)
    const [selection, setSelection] = React.useState<readonly [number, number]>([0, 0])
    const isControlled = valueProp !== undefined
    const value = (isControlled ? valueProp : uncontrolled).slice(0, maxLength)

    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        innerRef.current = node
        if (typeof forwardedRef === "function") forwardedRef(node)
        else if (forwardedRef) forwardedRef.current = node
      },
      [forwardedRef]
    )

    const placeCaret = React.useCallback(
      (position: number) => {
        const el = innerRef.current
        if (!el) return
        const clamped = Math.max(0, Math.min(position, maxLength))
        const full = el.value.length >= maxLength
        const start = full ? Math.min(clamped, maxLength - 1) : Math.min(clamped, el.value.length)
        const end = full ? start + 1 : start
        el.setSelectionRange(start, end)
        setSelection([start, end])
      },
      [maxLength]
    )

    // A single pending frame: a stale focus/change placement must never overwrite a newer
    // keyboard navigation, so every placement cancels the one before it.
    const frameRef = React.useRef<number | null>(null)
    const cancelScheduledCaret = React.useCallback(() => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    }, [])
    const scheduleCaret = React.useCallback(
      (position: number) => {
        cancelScheduledCaret()
        frameRef.current = requestAnimationFrame(() => {
          frameRef.current = null
          placeCaret(position)
        })
      },
      [cancelScheduledCaret, placeCaret]
    )
    React.useEffect(() => cancelScheduledCaret, [cancelScheduledCaret])

    const commit = (next: string) => {
      if (next.length > maxLength || !matches(next, pattern)) return false
      if (!isControlled) setUncontrolled(next)
      if (next !== value) {
        onChange?.(next)
        if (next.length === maxLength) onComplete?.(next)
      }
      return true
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const el = event.target
      const next = el.value
      if (!commit(next)) {
        el.value = value
        return
      }
      const caret = el.selectionStart ?? next.length
      scheduleCaret(caret)
    }

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
      onPaste?.(event)
      if (event.defaultPrevented) return
      event.preventDefault()
      const el = event.currentTarget
      const text = event.clipboardData.getData("text").trim()
      const start = el.selectionStart ?? value.length
      const end = el.selectionEnd ?? value.length
      const spliced = (value.slice(0, start) + text + value.slice(end)).slice(0, maxLength)
      if (commit(spliced)) {
        const caret = Math.min(start + text.length, maxLength)
        scheduleCaret(caret)
      }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented) return
      const el = event.currentTarget
      if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "Home" || event.key === "End") {
        cancelScheduledCaret()
      }
      const pos = el.selectionStart ?? 0
      const rtl = getComputedStyle(el).direction === "rtl"
      const left = rtl ? "ArrowRight" : "ArrowLeft"
      const right = rtl ? "ArrowLeft" : "ArrowRight"
      if (event.key === left) {
        event.preventDefault()
        placeCaret(pos - 1)
      } else if (event.key === right) {
        event.preventDefault()
        placeCaret(pos + 1)
      } else if (event.key === "Home") {
        event.preventDefault()
        placeCaret(0)
      } else if (event.key === "End") {
        event.preventDefault()
        placeCaret(maxLength)
      }
    }

    const variant = useControlVariant(variantProp, OTP_VARIANTS)
    const context = React.useMemo<OTPContextValue>(
      () => ({
        value,
        maxLength,
        focused,
        selection,
        disabled,
        invalid: ariaInvalid === true || ariaInvalid === "true",
        variant,
        size
      }),
      [value, maxLength, focused, selection, disabled, ariaInvalid, variant, size]
    )

    return (
      <OTPContext.Provider value={context}>
        <div
          data-slot="input-otp"
          data-disabled={disabled ? "true" : undefined}
          className={cn(
            "relative inline-flex items-center gap-2 has-[:disabled]:opacity-50",
            containerClassName
          )}
        >
          {children}
          <input
            ref={setRefs}
            type="text"
            value={value}
            maxLength={maxLength}
            disabled={disabled}
            inputMode={inputMode ?? (pattern === REGEXP_ONLY_DIGITS ? "numeric" : "text")}
            autoComplete={autoComplete}
            autoCapitalize="off"
            spellCheck={false}
            aria-label={ariaLabel}
            aria-invalid={ariaInvalid}
            data-slot="input-otp-control"
            className={cn(
              "absolute inset-0 h-full w-full cursor-text border-0 bg-transparent p-0 text-transparent opacity-0 caret-transparent outline-none selection:bg-transparent disabled:cursor-not-allowed",
              className
            )}
            onChange={handleChange}
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
            onFocus={(event) => {
              onFocus?.(event)
              setFocused(true)
              const el = event.currentTarget
              const at = el.value.length
              scheduleCaret(at)
            }}
            onBlur={(event) => {
              onBlur?.(event)
              setFocused(false)
            }}
            onSelect={(event) => {
              onSelect?.(event)
              const el = event.currentTarget
              setSelection([el.selectionStart ?? 0, el.selectionEnd ?? 0])
            }}
            {...props}
          />
        </div>
      </OTPContext.Provider>
    )
  }
)

InputOTP.displayName = "InputOTP"

export const InputOTPGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="input-otp-group"
    className={cn("flex items-center", className)}
    {...props}
  />
))

InputOTPGroup.displayName = "InputOTPGroup"

export type InputOTPSlotProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Zero-based position this slot renders. */
  index: number
}

export const InputOTPSlot = React.forwardRef<HTMLDivElement, InputOTPSlotProps>(
  ({ className, index, ...props }, ref) => {
    const ctx = useOTPContext()
    const char = ctx.value[index] ?? ""
    const [start, end] = ctx.selection
    const collapsed = start === end
    const active =
      ctx.focused && !ctx.disabled && (collapsed ? index === start : index >= start && index < end)
    const showCaret = active && collapsed && char === ""

    return (
      <div
        ref={ref}
        aria-hidden="true"
        data-slot="input-otp-slot"
        data-variant={ctx.variant}
        data-active={active ? "true" : "false"}
        data-filled={char ? "true" : "false"}
        data-invalid={ctx.invalid ? "true" : undefined}
        className={cn(
          inputOTPSlotVariants({ variant: ctx.variant as (typeof OTP_VARIANTS)[number], size: ctx.size }),
          ctx.invalid && "border-[color:var(--tone-danger)] data-[active=true]:border-[color:var(--tone-danger)] data-[active=true]:ring-[color:var(--tone-danger)]",
          className
        )}
        {...props}
      >
        {char}
        {showCaret ? (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="h-4 w-px animate-pulse bg-[var(--color-foreground)] motion-reduce:animate-none" />
          </span>
        ) : null}
      </div>
    )
  }
)

InputOTPSlot.displayName = "InputOTPSlot"

export const InputOTPSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    data-slot="input-otp-separator"
    className={cn("flex items-center text-[var(--color-muted)] [&_svg]:size-4", className)}
    {...props}
  >
    <Minus aria-hidden="true" />
  </div>
))

InputOTPSeparator.displayName = "InputOTPSeparator"
