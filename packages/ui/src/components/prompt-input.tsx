"use client"

import * as React from "react"
import { ArrowUp, Stop } from "@phosphor-icons/react"
import { cva } from "class-variance-authority"

import { cn } from "../lib/cn"
import { useControlVariant, type ControlVariant, type ControlVariantProp } from "../lib/control"

const PROMPT_VARIANTS = ["glinr", "solid", "plain", "soft", "outline", "ghost", "glass"] as const satisfies readonly ControlVariant[]

const promptInputVariants = cva(
  "flex w-full flex-col gap-2 rounded-2xl border p-2.5 transition-[border-color,box-shadow] duration-normal focus-within:ring-2 focus-within:ring-[color:var(--color-accent)] focus-within:ring-offset-2 focus-within:ring-offset-[color:var(--surface-0)] motion-reduce:transition-none",
  {
    variants: {
      variant: {
        glinr:
          "border-transparent [--face:var(--face-1,var(--surface-1))] [--ring-img:var(--ring)] [background:var(--sheen)_padding-box,linear-gradient(var(--face),var(--face))_padding-box,var(--ring-img)_border-box] [box-shadow:var(--elev-2)]",
        solid: "border-[color:var(--color-border)] bg-[var(--surface-3)] [box-shadow:var(--elev-1)]",
        plain:
          "rounded-lg border-[color:var(--color-border)] bg-[var(--surface-1)] shadow-sm focus-within:border-[color:var(--color-foreground)] focus-within:ring-[color:color-mix(in_oklab,var(--color-foreground)_20%,transparent)]",
        soft: "border-transparent bg-[var(--surface-2)] shadow-[inset_0_0_0_1px_var(--line-soft)]",
        outline: "border-[color:color-mix(in_oklab,var(--color-foreground)_30%,transparent)] bg-transparent",
        ghost: "border-transparent bg-transparent hover:bg-[color-mix(in_oklab,var(--color-foreground)_5%,transparent)]",
        glass:
          "border-[color:var(--glass-border)] [border-top-color:var(--glass-refraction-top)] bg-[var(--glass-readable)] bg-clip-padding backdrop-blur-xl backdrop-saturate-[180%] [box-shadow:var(--glass-2-shadow)]"
      }
    },
    defaultVariants: { variant: "glinr" }
  }
)

export interface PromptInputProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "onChange" | "defaultValue"> {
  /** Shell look. Omit to follow the ambient design style (glinr = raised shell). Same vocabulary as Input. */
  variant?: ControlVariantProp
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Called with the trimmed value when the user sends. */
  onSubmit?: (value: string) => void
  /** When set and `loading`, the send button becomes a stop button. */
  onStop?: () => void
  /** A response is streaming: input becomes read-only and send is blocked. */
  loading?: boolean
  disabled?: boolean
  placeholder?: string
  /** Accessible name of the textarea. */
  label?: string
  maxLength?: number
  /** `enter` sends on Enter (Shift+Enter newline). `mod-enter` sends on Cmd/Ctrl+Enter. */
  submitOn?: "enter" | "mod-enter"
  /** Show the keyboard hint and character count. */
  showHint?: boolean
  /** Rendered above the textarea, e.g. a row of `Attachment`. */
  attachments?: React.ReactNode
  /** Rendered at the start of the footer, e.g. attach and model buttons. */
  actions?: React.ReactNode
  sendLabel?: string
  stopLabel?: string
  rows?: number
}

export const PromptInput = React.forwardRef<HTMLTextAreaElement, PromptInputProps>(
  (
    {
      className,
      variant,
      value: valueProp,
      defaultValue = "",
      onValueChange,
      onSubmit,
      onStop,
      loading = false,
      disabled = false,
      placeholder = "Ask anything",
      label = "Message",
      maxLength,
      submitOn = "enter",
      showHint = true,
      attachments,
      actions,
      sendLabel = "Send message",
      stopLabel = "Stop generating",
      rows = 1,
      ...formProps
    },
    forwardedRef
  ) => {
    const resolved = useControlVariant(variant, PROMPT_VARIANTS)
    const [internal, setInternal] = React.useState(defaultValue)
    const controlled = valueProp !== undefined
    const value = controlled ? valueProp : internal
    const innerRef = React.useRef<HTMLTextAreaElement | null>(null)
    const hintId = React.useId()
    const composing = React.useRef(false)

    const setRefs = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        innerRef.current = node
        if (typeof forwardedRef === "function") forwardedRef(node)
        else if (forwardedRef) forwardedRef.current = node
      },
      [forwardedRef]
    )

    // Auto-grow: reset then match content height. CSS max-h clamps it.
    React.useLayoutEffect(() => {
      const el = innerRef.current
      if (!el) return
      el.style.height = "auto"
      el.style.height = `${el.scrollHeight}px`
    }, [value])

    const trimmed = value.trim()
    const canSend = !disabled && !loading && trimmed.length > 0

    const send = () => {
      if (!canSend) return
      onSubmit?.(trimmed)
      if (!controlled) {
        setInternal("")
        onValueChange?.("")
      }
    }

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!controlled) setInternal(event.target.value)
      onValueChange?.(event.target.value)
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key !== "Enter") return
      // IME guard: Enter confirms a composition, it must not send.
      if (composing.current || event.nativeEvent.isComposing || event.keyCode === 229) return
      const mod = event.metaKey || event.ctrlKey
      const shouldSend = submitOn === "mod-enter" ? mod : !event.shiftKey
      if (!shouldSend) return
      event.preventDefault()
      send()
    }

    const modLabel = submitOn === "mod-enter" ? "Cmd/Ctrl+Enter to send" : "Enter to send, Shift+Enter for a new line"
    const nearLimit = maxLength !== undefined && value.length >= maxLength * 0.9
    const showStop = loading && Boolean(onStop)

    return (
      <form
        data-variant={resolved}
        className={cn(promptInputVariants({ variant: resolved }), disabled && "opacity-60", className)}
        onSubmit={(event) => {
          event.preventDefault()
          send()
        }}
        {...formProps}
      >
        {attachments ? <div className="flex flex-wrap gap-2 px-1 pt-1">{attachments}</div> : null}
        <textarea
          ref={setRefs}
          value={value}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          readOnly={loading}
          aria-label={label}
          aria-busy={loading || undefined}
          aria-describedby={showHint ? hintId : undefined}
          placeholder={placeholder}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => {
            composing.current = true
          }}
          onCompositionEnd={() => {
            composing.current = false
          }}
          className="max-h-48 min-h-10 w-full resize-none bg-transparent px-2 py-1.5 text-sm leading-relaxed text-[var(--color-foreground)] placeholder:text-[color:var(--color-muted)] focus-visible:outline-none disabled:cursor-not-allowed read-only:cursor-progress"
        />
        <div className="flex items-center gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-1">{actions}</div>
          {showHint ? (
            <span id={hintId} className="hidden truncate text-xs text-[color:var(--color-muted)] sm:inline">
              {modLabel}
              {maxLength !== undefined ? (
                <span className={cn("ms-2 tabular-nums", nearLimit && "font-medium text-[color:var(--tone-danger-text)]")}>
                  {value.length}/{maxLength}
                </span>
              ) : null}
            </span>
          ) : null}
          {showStop ? (
            <button
              type="button"
              onClick={onStop}
              aria-label={stopLabel}
              className="inline-flex size-9 items-center justify-center rounded-full bg-[var(--color-foreground)] text-[var(--color-background)] transition-opacity duration-normal hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-1)] motion-reduce:transition-none"
            >
              <Stop weight="fill" className="size-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!canSend}
              aria-label={sendLabel}
              className="inline-flex size-9 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-accent-foreground)] transition-[opacity,transform] duration-normal hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-1)] disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
            >
              <ArrowUp weight="bold" className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </form>
    )
  }
)
PromptInput.displayName = "PromptInput"
