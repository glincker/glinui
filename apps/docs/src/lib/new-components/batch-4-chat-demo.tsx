"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Paperclip, ThumbsDown, ThumbsUp, ArrowsClockwise } from "@phosphor-icons/react"
import { Message, MessageAction, MessageActions, MessageAvatar, MessageContent, MessageCopyAction } from "@glinui/ui"
import { MessageScroller } from "@glinui/ui"
import { PromptInput } from "@glinui/ui"
import { StreamingText } from "@glinui/ui"
import { Thinking } from "@glinui/ui"

type ChatItem = { id: number; role: "user" | "assistant" | "system"; text: string; streaming?: boolean }

const REPLIES = [
  "Glin UI ships solid token surfaces by default and a glass variant for layered interfaces. Both honor reduced motion.",
  "Sure. Stack the pieces: MessageScroller for the log, Message for each turn, PromptInput at the bottom."
]

/** Full chat composition used by the docs and the scratch page. */
export function ChatDemo({ variant = "default", height = "h-[30rem]" }: { variant?: "default" | "glass"; height?: string }) {
  const [items, setItems] = useState<ChatItem[]>([
    { id: 1, role: "system", text: "Today" },
    { id: 2, role: "assistant", text: "Hi, I am Glin. Ask me anything about the design system." }
  ])
  const [loading, setLoading] = useState(false)
  const [thinking, setThinking] = useState(false)
  const [liked, setLiked] = useState<number | null>(null)
  const nextId = useRef(3)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const reply = useCallback(() => {
    setLoading(true)
    setThinking(true)
    timer.current = setTimeout(() => {
      setThinking(false)
      const text = REPLIES[nextId.current % REPLIES.length]
      setItems((prev) => [...prev, { id: nextId.current++, role: "assistant", text, streaming: true }])
    }, 1200)
  }, [])

  const stop = () => {
    if (timer.current) clearTimeout(timer.current)
    setThinking(false)
    setLoading(false)
    setItems((prev) => prev.map((m) => (m.streaming ? { ...m, streaming: false } : m)))
  }

  const send = (text: string) => {
    setItems((prev) => [...prev, { id: nextId.current++, role: "user", text }])
    reply()
  }

  return (
    <div className={`flex w-full max-w-2xl flex-col gap-3 ${height}`}>
      <MessageScroller label="Chat with Glin" className="rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-2)]">
        {items.map((m) => (
          <Message key={m.id} role={m.role} variant={variant}>
            <MessageAvatar fallback={m.role === "user" ? "You" : "G"} alt="" />
            <MessageContent
              actions={
                m.role === "assistant" && !m.streaming ? (
                  <MessageActions>
                    <MessageCopyAction value={m.text} />
                    <MessageAction label="Regenerate" onClick={reply}><ArrowsClockwise /></MessageAction>
                    <MessageAction label="Good response" pressed={liked === m.id} onClick={() => setLiked(m.id)}><ThumbsUp /></MessageAction>
                    <MessageAction label="Bad response"><ThumbsDown /></MessageAction>
                  </MessageActions>
                ) : null
              }
            >
              {m.streaming ? <StreamingText text={m.text} speed={18} onDone={() => { setLoading(false); setItems((p) => p.map((x) => (x.id === m.id ? { ...x, streaming: false } : x))) }} /> : m.text}
            </MessageContent>
          </Message>
        ))}
        {thinking ? (
          <Message role="assistant" variant={variant}>
            <MessageAvatar fallback="G" alt="" />
            <MessageContent><Thinking /></MessageContent>
          </Message>
        ) : null}
      </MessageScroller>
      <PromptInput
        variant={variant}
        loading={loading}
        onStop={stop}
        onSubmit={send}
        placeholder="Message Glin"
        maxLength={500}
        actions={
          <MessageAction label="Attach file" disabled={loading}>
            <Paperclip />
          </MessageAction>
        }
      />
    </div>
  )
}
