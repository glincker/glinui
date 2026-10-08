"use client"

import * as React from "react"
import { Check, Copy } from "@phosphor-icons/react"

import { cn } from "../lib/cn"
import { Avatar, type AvatarProps } from "./avatar"
import { Bubble, type BubbleProps, type BubbleVariant } from "./bubble"

export type MessageRole = "user" | "assistant" | "system"

interface MessageContextValue {
  role: MessageRole
  variant: BubbleVariant | undefined
  grouped: boolean
}

const MessageContext = React.createContext<MessageContextValue>({
  role: "assistant",
  variant: undefined,
  grouped: false
})

export interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  role?: MessageRole
  /**
   * Surface treatment passed down to the assistant bubble. Omit for the ambient design style
   * (glinr by default). Vocabulary: glinr, solid, plain, soft, outline, ghost, gradient, glass.
   * User messages stay solid accent unless a bubble sets its own variant.
   */
  variant?: BubbleVariant
  /** Stacked message from the same sender: tighter spacing and corners. */
  grouped?: boolean
}

export const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  ({ className, role = "assistant", variant, grouped = false, ...props }, ref) => {
    const value = React.useMemo(() => ({ role, variant, grouped }), [role, variant, grouped])
    return (
      <MessageContext.Provider value={value}>
        <div
          ref={ref}
          data-role={role}
          data-grouped={grouped || undefined}
          className={cn(
            "group/message flex w-full items-start gap-2.5",
            grouped ? "mt-1" : "mt-4",
            role === "user" && "flex-row-reverse",
            role === "system" && "justify-center",
            className
          )}
          {...props}
        />
      </MessageContext.Provider>
    )
  }
)
Message.displayName = "Message"

export type MessageAvatarProps = AvatarProps

export const MessageAvatar = React.forwardRef<HTMLSpanElement, MessageAvatarProps>(
  ({ className, size = "sm", ...props }, ref) => {
    const { role, grouped } = React.useContext(MessageContext)
    if (role === "system") return null
    return (
      <Avatar
        ref={ref}
        size={size}
        className={cn("shrink-0", grouped && "invisible", className)}
        aria-hidden={grouped ? true : undefined}
        {...props}
      />
    )
  }
)
MessageAvatar.displayName = "MessageAvatar"

export interface MessageContentProps extends Omit<BubbleProps, "align"> {
  /** Render children without a bubble (plain assistant prose). */
  bare?: boolean
  /** Rendered under the bubble, typically `MessageActions`. */
  actions?: React.ReactNode
}

const roleVariant: Partial<Record<MessageRole, BubbleVariant>> = {
  user: "accent",
  system: "muted"
}

export const MessageContent = React.forwardRef<HTMLDivElement, MessageContentProps>(
  ({ className, bare = false, variant, tail, actions, children, ...props }, ref) => {
    const ctx = React.useContext(MessageContext)
    const isUser = ctx.role === "user"
    const isSystem = ctx.role === "system"
    const resolved: BubbleVariant | undefined = variant ?? roleVariant[ctx.role] ?? ctx.variant

    return (
      <div
        className={cn(
          "flex min-w-0 max-w-[min(42rem,85%)] flex-col gap-1",
          isUser ? "items-end" : "items-start",
          isSystem && "items-center"
        )}
      >
        {bare ? (
          <div ref={ref} className={cn("text-sm leading-relaxed text-[var(--color-foreground)]", className)} {...props}>
            {children}
          </div>
        ) : (
          <Bubble
            ref={ref}
            variant={isSystem ? "muted" : resolved}
            align={isUser ? "end" : "start"}
            tail={tail ?? !ctx.grouped}
            grouped={ctx.grouped}
            className={cn(isSystem && "rounded-full px-3 py-1 text-xs text-[var(--color-muted)]", className)}
            {...props}
          >
            {children}
          </Bubble>
        )}
        {actions}
      </div>
    )
  }
)
MessageContent.displayName = "MessageContent"

export const MessageActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="toolbar"
      aria-label="Message actions"
      className={cn(
        "flex items-center gap-0.5 text-[var(--color-muted)] opacity-70 transition-opacity duration-normal focus-within:opacity-100 group-hover/message:opacity-100 motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
)
MessageActions.displayName = "MessageActions"

export interface MessageActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible name, also used as the native tooltip. */
  label: string
  /** Toggle state for stateful actions such as thumbs up. */
  pressed?: boolean
}

export const MessageAction = React.forwardRef<HTMLButtonElement, MessageActionProps>(
  ({ className, label, pressed, type = "button", children, ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-lg text-current transition-[background-color,color] duration-normal hover:bg-[var(--surface-3)] hover:text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50 aria-pressed:text-[var(--color-accent)] motion-reduce:transition-none [&_svg]:size-4",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
)
MessageAction.displayName = "MessageAction"

export interface MessageCopyActionProps extends Omit<MessageActionProps, "label" | "onCopy" | "value"> {
  value: string
  label?: string
  onCopy?: (value: string) => void
  /** How long the success state shows, in ms. */
  resetAfter?: number
}

export const MessageCopyAction = React.forwardRef<HTMLButtonElement, MessageCopyActionProps>(
  ({ value, label = "Copy message", onCopy, resetAfter = 1500, onClick, ...props }, ref) => {
    const [copied, setCopied] = React.useState(false)
    const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    React.useEffect(() => () => {
      if (timer.current) clearTimeout(timer.current)
    }, [])

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (event.defaultPrevented) return
      try {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        onCopy?.(value)
        if (timer.current) clearTimeout(timer.current)
        timer.current = setTimeout(() => setCopied(false), resetAfter)
      } catch {
        setCopied(false)
      }
    }

    return (
      <MessageAction ref={ref} label={copied ? "Copied" : label} onClick={handleClick} {...props}>
        {copied ? <Check weight="bold" aria-hidden="true" /> : <Copy aria-hidden="true" />}
        <span role="status" className="sr-only">
          {copied ? "Copied to clipboard" : ""}
        </span>
      </MessageAction>
    )
  }
)
MessageCopyAction.displayName = "MessageCopyAction"
