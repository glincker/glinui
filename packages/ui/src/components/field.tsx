"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"

type FieldContextValue = {
  id: string
  descriptionId: string
  errorId: string
  invalid: boolean
  disabled: boolean
  hasDescription: boolean
  hasError: boolean
  setHasDescription: (value: boolean) => void
  setHasError: (value: boolean) => void
}

const FieldContext = React.createContext<FieldContextValue | null>(null)

/** Returns the surrounding Field wiring (ids and state), or null outside a Field. */
export function useField(): FieldContextValue | null {
  return React.useContext(FieldContext)
}

const fieldVariants = cva("group/field flex w-full gap-2 data-[invalid=true]:text-[color:var(--tone-danger-text)]", {
  variants: {
    orientation: {
      vertical: "flex-col [&>*]:w-full",
      horizontal: "flex-row items-center [&>[data-slot=field-label]]:flex-auto has-[>[data-slot=field-content]]:items-start",
      responsive: "flex-col [&>*]:w-full md:flex-row md:items-center md:[&>*]:w-auto md:[&>[data-slot=field-label]]:flex-auto"
    }
  },
  defaultVariants: {
    orientation: "vertical"
  }
})

export type FieldProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof fieldVariants> & {
    /** Marks the field invalid and wires aria-invalid onto its control. */
    invalid?: boolean
    /** Marks the field disabled. */
    disabled?: boolean
  }

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, orientation, invalid = false, disabled = false, children, ...props }, ref) => {
    const id = React.useId()
    const [hasDescription, setHasDescription] = React.useState(false)
    const [hasError, setHasError] = React.useState(false)

    const value = React.useMemo<FieldContextValue>(
      () => ({
        id: `${id}-control`,
        descriptionId: `${id}-description`,
        errorId: `${id}-error`,
        invalid,
        disabled,
        hasDescription,
        hasError,
        setHasDescription,
        setHasError
      }),
      [id, invalid, disabled, hasDescription, hasError]
    )

    return (
      <FieldContext.Provider value={value}>
        <div
          ref={ref}
          role="group"
          data-slot="field"
          data-orientation={orientation ?? "vertical"}
          data-invalid={invalid || hasError ? "true" : undefined}
          data-disabled={disabled ? "true" : undefined}
          className={cn(fieldVariants({ orientation }), disabled && "opacity-60", className)}
          {...props}
        >
          {children}
        </div>
      </FieldContext.Provider>
    )
  }
)

Field.displayName = "Field"

/**
 * Applies the Field id, aria-describedby, aria-invalid and disabled state to its single child.
 * Works with Input, Textarea, InputOTP, InputGroupInput, Select triggers and any element
 * that forwards these props.
 */
export const FieldControl = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ children, "aria-describedby": describedBy, ...props }, ref) => {
    const field = useField()
    const ids = [
      describedBy,
      field?.hasDescription ? field.descriptionId : undefined,
      field?.hasError ? field.errorId : undefined
    ]
      .filter(Boolean)
      .join(" ")
    const invalid = field ? field.invalid || field.hasError : false

    return (
      <Slot
        ref={ref}
        id={field?.id}
        aria-describedby={ids || undefined}
        aria-invalid={invalid ? true : undefined}
        {...(field?.disabled ? { disabled: true } : {})}
        {...props}
      >
        {children}
      </Slot>
    )
  }
)

FieldControl.displayName = "FieldControl"

export type FieldLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>

export const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, htmlFor, ...props }, ref) => {
    const field = useField()

    return (
      <label
        ref={ref}
        data-slot="field-label"
        htmlFor={htmlFor ?? field?.id}
        className={cn(
          "flex w-fit select-none items-center gap-2 text-sm font-medium leading-snug text-[var(--color-foreground)] group-data-[disabled=true]/field:cursor-not-allowed group-data-[invalid=true]/field:text-[color:var(--tone-danger-text)]",
          className
        )}
        {...props}
      />
    )
  }
)

FieldLabel.displayName = "FieldLabel"

export const FieldTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="field-title"
      className={cn("flex w-fit items-center gap-2 text-sm font-medium leading-snug", className)}
      {...props}
    />
  )
)

FieldTitle.displayName = "FieldTitle"

export const FieldContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="field-content"
      className={cn("flex flex-1 flex-col gap-1 leading-snug", className)}
      {...props}
    />
  )
)

FieldContent.displayName = "FieldContent"

export const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, id, ...props }, ref) => {
  const field = useField()
  const setHas = field?.setHasDescription

  React.useEffect(() => {
    setHas?.(true)
    return () => setHas?.(false)
  }, [setHas])

  return (
    <p
      ref={ref}
      id={id ?? field?.descriptionId}
      data-slot="field-description"
      className={cn("text-sm font-normal leading-normal text-[var(--color-muted)]", className)}
      {...props}
    />
  )
})

FieldDescription.displayName = "FieldDescription"

export type FieldErrorProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Error objects (for example from a form library). Messages are de-duplicated. */
  errors?: Array<{ message?: string } | undefined>
}

export const FieldError = React.forwardRef<HTMLDivElement, FieldErrorProps>(
  ({ className, id, errors, children, ...props }, ref) => {
    const field = useField()
    const setHas = field?.setHasError

    const messages = React.useMemo(() => {
      const unique = new Set<string>()
      errors?.forEach((error) => {
        if (error?.message) unique.add(error.message)
      })
      return Array.from(unique)
    }, [errors])

    const content =
      children ??
      (messages.length === 1 ? (
        messages[0]
      ) : messages.length > 1 ? (
        <ul className="ms-4 flex list-disc flex-col gap-1">
          {messages.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      ) : null)
    const hasContent = content !== null && content !== undefined && content !== false

    React.useEffect(() => {
      if (!hasContent) return undefined
      setHas?.(true)
      return () => setHas?.(false)
    }, [hasContent, setHas])

    if (!hasContent) return null

    return (
      <div
        ref={ref}
        role="alert"
        id={id ?? field?.errorId}
        data-slot="field-error"
        className={cn("text-sm font-normal text-[color:var(--tone-danger-text)]", className)}
        {...props}
      >
        {content}
      </div>
    )
  }
)

FieldError.displayName = "FieldError"

export const FieldGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="field-group"
      className={cn("flex w-full flex-col gap-6", className)}
      {...props}
    />
  )
)

FieldGroup.displayName = "FieldGroup"

export const FieldSet = React.forwardRef<
  HTMLFieldSetElement,
  React.FieldsetHTMLAttributes<HTMLFieldSetElement>
>(({ className, ...props }, ref) => (
  <fieldset
    ref={ref}
    data-slot="field-set"
    className={cn("m-0 flex min-w-0 flex-col gap-4 border-0 p-0", className)}
    {...props}
  />
))

FieldSet.displayName = "FieldSet"

export type FieldLegendProps = React.HTMLAttributes<HTMLLegendElement> & {
  variant?: "legend" | "label"
}

export const FieldLegend = React.forwardRef<HTMLLegendElement, FieldLegendProps>(
  ({ className, variant = "legend", ...props }, ref) => (
    <legend
      ref={ref}
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-1 font-semibold text-[var(--color-foreground)]",
        variant === "legend" ? "text-base" : "text-sm font-medium",
        className
      )}
      {...props}
    />
  )
)

FieldLegend.displayName = "FieldLegend"

export const FieldSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    data-slot="field-separator"
    className={cn("relative -my-1 flex h-5 items-center text-sm", className)}
    {...props}
  >
    <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-[var(--line-soft)]" />
    {children ? (
      <span className="relative mx-auto bg-[var(--color-background)] px-2 text-[var(--color-muted)]">
        {children}
      </span>
    ) : null}
  </div>
))

FieldSeparator.displayName = "FieldSeparator"
