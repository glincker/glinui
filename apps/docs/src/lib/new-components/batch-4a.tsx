"use client"

import { MessageFamilyMatrix } from "@/components/variants/family-demos"
import { useState } from "react"
import { ArrowsClockwise, ThumbsDown, ThumbsUp } from "@phosphor-icons/react"
import { Bubble } from "@glinui/ui"
import { Message, MessageAction, MessageActions, MessageAvatar, MessageContent, MessageCopyAction } from "@glinui/ui"
import { MessageScroller } from "@glinui/ui"
import { PromptInput } from "@glinui/ui"
import type { ComponentDocMeta } from "@/lib/component-docs"
import { ChatDemo } from "./batch-4-chat-demo"

function ScrollerDemo() {
  const [count, setCount] = useState(14)
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex h-64 flex-col">
        <MessageScroller label="Demo log">
          {Array.from({ length: count }, (_, i) => (
            <Message key={i} role={i % 2 ? "user" : "assistant"}>
              <MessageContent>Message {i + 1}</MessageContent>
            </Message>
          ))}
        </MessageScroller>
      </div>
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        className="self-start rounded-lg border border-[var(--line-soft)] px-3 py-1.5 text-sm hover:bg-[var(--surface-3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
      >
        Add message
      </button>
    </div>
  )
}

function PromptDemo() {
  const [sent, setSent] = useState<string[]>([])
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <PromptInput onSubmit={(v) => setSent((s) => [...s, v])} placeholder="Type, then press Enter" maxLength={280} />
      {sent.length > 0 ? <p className="text-sm text-[var(--color-muted)]">Last sent: {sent[sent.length - 1]}</p> : null}
    </div>
  )
}

const chatCode = `"use client"

import { useState } from "react"
import { ArrowsClockwise, ThumbsDown, ThumbsUp } from "@phosphor-icons/react"
import {
  Message, MessageAction, MessageActions, MessageAvatar, MessageContent, MessageCopyAction,
  MessageScroller, PromptInput, Thinking
} from "@glinui/ui"

type Item = { id: number; role: "user" | "assistant"; text: string }

export function Chat() {
  const [items, setItems] = useState<Item[]>([{ id: 1, role: "assistant", text: "Hi, I am Glin." }])
  const [loading, setLoading] = useState(false)

  const send = (text: string) => {
    setItems((p) => [...p, { id: Date.now(), role: "user", text }])
    setLoading(true)
    // Call your model here (any provider), then append the reply.
    setTimeout(() => {
      setItems((p) => [...p, { id: Date.now() + 1, role: "assistant", text: "Here is a reply." }])
      setLoading(false)
    }, 1200)
  }

  return (
    <div className="flex h-[30rem] max-w-2xl flex-col gap-3">
      <MessageScroller label="Chat">
        {items.map((m) => (
          <Message key={m.id} role={m.role}>
            <MessageAvatar fallback={m.role === "user" ? "You" : "G"} />
            <MessageContent
              actions={m.role === "assistant" ? (
                <MessageActions>
                  <MessageCopyAction value={m.text} />
                  <MessageAction label="Regenerate"><ArrowsClockwise /></MessageAction>
                  <MessageAction label="Good response"><ThumbsUp /></MessageAction>
                  <MessageAction label="Bad response"><ThumbsDown /></MessageAction>
                </MessageActions>
              ) : null}
            >
              {m.text}
            </MessageContent>
          </Message>
        ))}
        {loading ? <Message><MessageAvatar fallback="G" /><MessageContent><Thinking /></MessageContent></Message> : null}
      </MessageScroller>
      <PromptInput loading={loading} onSubmit={send} onStop={() => setLoading(false)} placeholder="Message Glin" />
    </div>
  )
}`

export const batch4aDocs: Record<string, ComponentDocMeta> = {
  message: {
    badge: "Primitive / Molecule",
    props: [
      {
        title: "Message",
        rows: [
          { prop: "role", type: '"user" | "assistant" | "system"', defaultValue: "assistant", description: "Sender. User messages align to the end with the accent bubble, system messages render as a centered pill." },
          { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "ambient (glinr)", description: "Surface variant. Omit to follow the ambient design style (glinr by default, plain for minimal, glass for glass)." },
          { prop: "grouped", type: "boolean", defaultValue: "false", description: "Consecutive message from the same sender: tight spacing, hidden avatar, squared corners." }
        ]
      },
      {
        title: "MessageContent",
        rows: [
          { prop: "bare", type: "boolean", defaultValue: "false", description: "Render prose without a bubble." },
          { prop: "actions", type: "ReactNode", description: "Slot under the bubble, usually MessageActions." },
          { prop: "variant / tail", type: "BubbleProps", description: "Override the bubble derived from the role." }
        ]
      },
      {
        title: "MessageAction / MessageCopyAction",
        rows: [
          { prop: "label", type: "string", description: "Required accessible name and tooltip (MessageAction)." },
          { prop: "pressed", type: "boolean", description: "Sets aria-pressed for toggles such as thumbs up." },
          { prop: "value", type: "string", description: "Text written to the clipboard (MessageCopyAction)." },
          { prop: "onCopy", type: "(value: string) => void", description: "Fires after a successful copy." }
        ]
      }
    ],
    accessibility: {
      summary: [
        "Pure presentation: roles are conveyed through layout, so place messages inside MessageScroller (role=\"log\").",
        "Action buttons always have an aria-label; toggles expose aria-pressed.",
        "Copy confirmation is announced through a polite status region.",
        "Layout uses logical properties, so it mirrors correctly in RTL."
      ],
      keyboard: [
        { key: "Tab", description: "Move through the actions toolbar buttons." },
        { key: "Enter / Space", description: "Activate the focused action." }
      ],
      aria: ['`role="toolbar"` with `aria-label="Message actions"`', "`aria-pressed` on toggle actions", '`role="status"` copy confirmation']
    },
    reducedMotion: {
      description: "Only opacity and color transitions are used, and they are disabled under reduced motion.",
      affected: ["opacity", "background-color"]
    },
    examples: [
      {
        title: "Roles",
        description: "User, assistant and system messages.",
        code: `import { Message, MessageAvatar, MessageContent } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="w-full max-w-lg">\n      <Message role="system"><MessageContent>Today</MessageContent></Message>\n      <Message role="user">\n        <MessageAvatar fallback="You" />\n        <MessageContent>Can you summarize the design tokens?</MessageContent>\n      </Message>\n      <Message>\n        <MessageAvatar fallback="G" />\n        <MessageContent>Surfaces, lines and elevation are exposed as CSS variables.</MessageContent>\n      </Message>\n    </div>\n  )\n}`,
        render: (
          <div className="w-full max-w-lg">
            <Message role="system"><MessageContent>Today</MessageContent></Message>
            <Message role="user">
              <MessageAvatar fallback="You" />
              <MessageContent>Can you summarize the design tokens?</MessageContent>
            </Message>
            <Message>
              <MessageAvatar fallback="G" />
              <MessageContent>Surfaces, lines and elevation are exposed as CSS variables.</MessageContent>
            </Message>
          </div>
        )
      },
      {
        title: "Variants",
        description: "Every vocabulary variant on the default tone. Omit variant to follow the ambient design style.",
        code: `import { Message, MessageContent } from "@glinui/ui"

export function MessageVariantsDemo() {
  return (
    <div className="grid gap-2 md:grid-cols-2">
      <Message variant="glinr"><MessageContent>glinr bubble</MessageContent></Message>
      <Message variant="solid"><MessageContent>solid bubble</MessageContent></Message>
      <Message variant="plain"><MessageContent>plain bubble</MessageContent></Message>
      <Message variant="soft"><MessageContent>soft bubble</MessageContent></Message>
      <Message variant="outline"><MessageContent>outline bubble</MessageContent></Message>
      <Message variant="ghost"><MessageContent>ghost bubble</MessageContent></Message>
      <Message variant="gradient"><MessageContent>gradient bubble</MessageContent></Message>
    </div>
  )
}`,
        render: (
          <div className="grid gap-2 md:grid-cols-2">
            <Message variant="glinr"><MessageContent>glinr bubble</MessageContent></Message>
            <Message variant="solid"><MessageContent>solid bubble</MessageContent></Message>
            <Message variant="plain"><MessageContent>plain bubble</MessageContent></Message>
            <Message variant="soft"><MessageContent>soft bubble</MessageContent></Message>
            <Message variant="outline"><MessageContent>outline bubble</MessageContent></Message>
            <Message variant="ghost"><MessageContent>ghost bubble</MessageContent></Message>
            <Message variant="gradient"><MessageContent>gradient bubble</MessageContent></Message>
          </div>
        )
      },
      {
        title: "Variants matrix",
        description: "Every variant by tone (where the component has tones), rendered in the light and dark theme scopes.",
        code: `import { SURFACE_VARIANTS } from "@glinui/ui"\n\n// message across the vocabulary\n{SURFACE_VARIANTS.map((variant) => (\n  <Message key={variant} variant={variant}>\n    <MessageContent>Assistant reply</MessageContent>\n  </Message>\n))}`,
        render: <MessageFamilyMatrix />
      },
      {
        title: "Actions",
        description: "Copy, regenerate and feedback actions in the content slot.",
        code: `import { ArrowsClockwise, ThumbsDown, ThumbsUp } from "@phosphor-icons/react"\nimport { Message, MessageAction, MessageActions, MessageAvatar, MessageContent, MessageCopyAction } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Message>\n      <MessageAvatar fallback="G" />\n      <MessageContent\n        actions={\n          <MessageActions>\n            <MessageCopyAction value="Hello from Glin" />\n            <MessageAction label="Regenerate"><ArrowsClockwise /></MessageAction>\n            <MessageAction label="Good response" pressed><ThumbsUp /></MessageAction>\n            <MessageAction label="Bad response"><ThumbsDown /></MessageAction>\n          </MessageActions>\n        }\n      >\n        Hello from Glin\n      </MessageContent>\n    </Message>\n  )\n}`,
        render: (
          <Message>
            <MessageAvatar fallback="G" />
            <MessageContent
              actions={
                <MessageActions>
                  <MessageCopyAction value="Hello from Glin" />
                  <MessageAction label="Regenerate"><ArrowsClockwise /></MessageAction>
                  <MessageAction label="Good response" pressed><ThumbsUp /></MessageAction>
                  <MessageAction label="Bad response"><ThumbsDown /></MessageAction>
                </MessageActions>
              }
            >
              Hello from Glin
            </MessageContent>
          </Message>
        )
      },
      {
        title: "Chat",
        description: "Full composition: scroller, messages, thinking, streaming reply, actions and prompt input. Send a message to try it.",
        code: chatCode,
        render: <ChatDemo />
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it. Switch the preview stage to Vivid or Photo to see the frosted surface.",
        code: `import { Message, MessageAvatar, MessageContent } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="w-full max-w-lg">\n      <Message variant="glass"><MessageAvatar fallback="G" /><MessageContent>First line</MessageContent></Message>\n      <Message variant="glass" grouped><MessageAvatar fallback="G" /><MessageContent>Second line, grouped</MessageContent></Message>\n    </div>\n  )\n}`,
        render: (
          <div className="w-full max-w-lg">
            <Message variant="glass"><MessageAvatar fallback="G" /><MessageContent>First line</MessageContent></Message>
            <Message variant="glass" grouped><MessageAvatar fallback="G" /><MessageContent>Second line, grouped</MessageContent></Message>
          </div>
        )
      }
    ]
  },

  bubble: {
    badge: "Primitive / Molecule",
    props: [
      { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "gradient" | "glass" | "accent" | "muted"', defaultValue: "ambient (glinr)", description: "Surface variant. Omit to follow the ambient design style (glinr by default, plain for minimal, glass for glass)." },
      { prop: "tone", type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"', defaultValue: "neutral", description: "Colour tone for the vocabulary variants." },
      { prop: "align", type: '"start" | "end"', defaultValue: "start", description: "Which side the bubble sits on. Controls tail and group corners." },
      { prop: "tail", type: "boolean", defaultValue: "false", description: "Square the corner nearest the sender." },
      { prop: "grouped", type: "boolean", defaultValue: "false", description: "Tighten the aligned edge for stacked bubbles." }
    ],
    accessibility: {
      summary: [
        "Renders a plain div with no implicit role, so content stays readable inside a log region.",
        "Accent text uses the accent-foreground token for AA contrast in light and dark.",
        "Long words wrap instead of overflowing."
      ]
    },
    reducedMotion: {
      description: "Bubble has no motion of its own."
    },
    examples: [
      {
        title: "Variants",
        code: `import { Bubble } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="flex flex-col items-start gap-2">\n      <Bubble>Default surface</Bubble>\n      <Bubble variant="muted">Muted</Bubble>\n      <Bubble variant="accent">Accent</Bubble>\n      <Bubble variant="soft">Glass</Bubble>\n    </div>\n  )\n}`,
        render: (
          <div className="flex flex-col items-start gap-2">
            <Bubble>Default surface</Bubble>
            <Bubble variant="muted">Muted</Bubble>
            <Bubble variant="accent">Accent</Bubble>
            <Bubble variant="soft">Glass</Bubble>
          </div>
        )
      },
      {
        title: "Variants",
        description: "Every vocabulary variant on the default tone. Omit variant to follow the ambient design style.",
        code: `import { Bubble } from "@glinui/ui"

export function BubbleVariantsDemo() {
  return (
    <div className="flex flex-wrap items-start gap-3">
      <Bubble variant="glinr">glinr</Bubble>
      <Bubble variant="solid">solid</Bubble>
      <Bubble variant="plain">plain</Bubble>
      <Bubble variant="soft">soft</Bubble>
      <Bubble variant="outline">outline</Bubble>
      <Bubble variant="ghost">ghost</Bubble>
      <Bubble variant="gradient">gradient</Bubble>
    </div>
  )
}`,
        render: (
          <div className="flex flex-wrap items-start gap-3">
            <Bubble variant="glinr">glinr</Bubble>
            <Bubble variant="solid">solid</Bubble>
            <Bubble variant="plain">plain</Bubble>
            <Bubble variant="soft">soft</Bubble>
            <Bubble variant="outline">outline</Bubble>
            <Bubble variant="ghost">ghost</Bubble>
            <Bubble variant="gradient">gradient</Bubble>
          </div>
        )
      },
      {
        title: "Tail and grouping",
        code: `import { Bubble } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="flex w-72 flex-col gap-1">\n      <Bubble variant="accent" align="end" grouped className="self-end">Grouped</Bubble>\n      <Bubble variant="accent" align="end" grouped className="self-end">Grouped</Bubble>\n      <Bubble variant="accent" align="end" tail className="self-end">With tail</Bubble>\n      <Bubble tail className="mt-2 self-start">Incoming tail</Bubble>\n    </div>\n  )\n}`,
        render: (
          <div className="flex w-72 flex-col gap-1">
            <Bubble variant="accent" align="end" grouped className="self-end">Grouped</Bubble>
            <Bubble variant="accent" align="end" grouped className="self-end">Grouped</Bubble>
            <Bubble variant="accent" align="end" tail className="self-end">With tail</Bubble>
            <Bubble tail className="mt-2 self-start">Incoming tail</Bubble>
          </div>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it. Switch the preview stage to Vivid or Photo to see the frosted surface.",
        code: `import { Bubble } from "@glinui/ui"

export function BubbleGlassDemo() {
  return (
    <Bubble variant="glass">glass</Bubble>
  )
}`,
        render: (
          <Bubble variant="glass">glass</Bubble>
        )
      }
    ]
  },

  "message-scroller": {
    badge: "Primitive / Organism",
    props: [
      { prop: "threshold", type: "number", defaultValue: "80", description: "Pixels from the bottom that still count as pinned." },
      { prop: "jumpLabel", type: "string", defaultValue: '"Jump to latest"', description: "Text of the pill shown when scrolled up." },
      { prop: "label", type: "string", defaultValue: '"Conversation"', description: "Accessible name of the log region." },
      { prop: "onAtBottomChange", type: "(atBottom: boolean) => void", description: "Fires when the reader leaves or returns to the bottom." }
    ],
    accessibility: {
      summary: [
        "Scroll container is role=\"log\" with aria-live=\"polite\" so new messages are announced without interrupting.",
        "The container is focusable so keyboard users can scroll with arrow keys, Page Up and Page Down.",
        "Autoscroll only follows while the reader is at the bottom, never yanking them away from history.",
        "The jump pill is removed from the tab order and accessibility tree while hidden."
      ],
      keyboard: [
        { key: "Arrow Up / Down", description: "Scroll the focused log." },
        { key: "Page Up / Page Down", description: "Scroll by a page." },
        { key: "Tab then Enter", description: "Activate Jump to latest when visible." }
      ],
      aria: ['`role="log"`', '`aria-live="polite"`', '`aria-relevant="additions"`', "`aria-hidden` on the hidden jump pill"]
    },
    reducedMotion: {
      description: "Smooth scrolling is replaced with an instant jump and the pill transition is disabled.",
      affected: ["scroll-behavior", "opacity", "transform"]
    },
    examples: [
      {
        title: "Stick to bottom",
        description: "Add messages while pinned to follow them. Scroll up to reveal the jump pill.",
        code: `import { useState } from "react"\nimport { Message, MessageContent, MessageScroller } from "@glinui/ui"\n\nexport function Demo() {\n  const [count, setCount] = useState(14)\n  return (\n    <div className="flex w-full max-w-md flex-col gap-3">\n      <div className="flex h-64 flex-col">\n        <MessageScroller label="Demo log">\n          {Array.from({ length: count }, (_, i) => (\n            <Message key={i} role={i % 2 ? "user" : "assistant"}>\n              <MessageContent>Message {i + 1}</MessageContent>\n            </Message>\n          ))}\n        </MessageScroller>\n      </div>\n      <button type="button" onClick={() => setCount((c) => c + 1)}>Add message</button>\n    </div>\n  )\n}`,
        render: <ScrollerDemo />
      }
    ]
  },

  "prompt-input": {
    badge: "Primitive / Organism",
    props: [
      { prop: "value / defaultValue", type: "string", description: "Controlled or uncontrolled text." },
      { prop: "onSubmit", type: "(value: string) => void", description: "Called with the trimmed text on send." },
      { prop: "onStop", type: "() => void", description: "With loading, swaps the send button for a stop button." },
      { prop: "loading", type: "boolean", defaultValue: "false", description: "Read-only field, send blocked, aria-busy set." },
      { prop: "submitOn", type: '"enter" | "mod-enter"', defaultValue: "enter", description: "Enter sends (Shift+Enter newline) or Cmd/Ctrl+Enter sends." },
      { prop: "maxLength", type: "number", description: "Enables the character count hint." },
      { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "glass"', defaultValue: 'ambient (glinr)', description: 'Shell look. Omit to follow the ambient design style (glinr = raised shell). Glass is opt-in.' },
      { prop: "attachments / actions", type: "ReactNode", description: "Slots above the textarea and in the footer." },
      { prop: "label", type: "string", defaultValue: '"Message"', description: "Accessible name of the textarea." }
    ],
    accessibility: {
      summary: [
        "Native textarea with an aria-label and an aria-describedby hint for the send shortcut.",
        "Enter during an IME composition (Japanese, Chinese, Korean) confirms the text and never sends.",
        "While loading the field is read-only (focus is kept) and the stop button replaces send.",
        "Send and stop buttons have explicit labels."
      ],
      keyboard: [
        { key: "Enter", description: "Send (default mode)." },
        { key: "Shift + Enter", description: "Insert a new line." },
        { key: "Cmd/Ctrl + Enter", description: "Send in mod-enter mode." }
      ],
      aria: ["`aria-label` on the textarea", "`aria-describedby` hint", "`aria-busy` while loading"]
    },
    reducedMotion: {
      description: "Focus and button transitions are disabled under reduced motion.",
      affected: ["border-color", "box-shadow", "opacity"]
    },
    examples: [
      {
        title: "Basic",
        code: `import { useState } from "react"\nimport { PromptInput } from "@glinui/ui"\n\nexport function Demo() {\n  const [sent, setSent] = useState<string[]>([])\n  return (\n    <div className="flex w-full max-w-xl flex-col gap-3">\n      <PromptInput onSubmit={(v) => setSent((s) => [...s, v])} placeholder="Type, then press Enter" maxLength={280} />\n      {sent.length > 0 ? <p>Last sent: {sent[sent.length - 1]}</p> : null}\n    </div>\n  )\n}`,
        render: <PromptDemo />
      },
      {
        title: "Variants",
        code: `import { PromptInput } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="flex w-full max-w-xl flex-col gap-3">\n      <PromptInput variant="glinr" placeholder="glinr" showHint={false} />\n      <PromptInput variant="plain" placeholder="plain" showHint={false} />\n      <PromptInput variant="soft" placeholder="soft" showHint={false} />\n      <PromptInput variant="outline" placeholder="outline" showHint={false} />\n    </div>\n  )\n}`,
        render: (
          <div className="flex w-full max-w-xl flex-col gap-3">
            <PromptInput variant="glinr" placeholder="glinr" showHint={false} />
            <PromptInput variant="plain" placeholder="plain" showHint={false} />
            <PromptInput variant="soft" placeholder="soft" showHint={false} />
            <PromptInput variant="outline" placeholder="outline" showHint={false} />
          </div>
        )
      },
      {
        title: "Loading",
        code: `import { PromptInput } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <PromptInput loading onStop={() => {}} defaultValue="Summarize this thread" />\n  )\n}`,
        render: (
          <PromptInput loading onStop={() => {}} defaultValue="Summarize this thread" />
        )
      },
      {
        title: "Cmd/Ctrl + Enter to send",
        code: `import { PromptInput } from "@glinui/ui"\n\nexport function Demo() {\n  return <PromptInput submitOn="mod-enter" placeholder="Enter adds a line" />\n}`,
        render: <div className="w-full max-w-xl"><PromptInput submitOn="mod-enter" placeholder="Enter adds a line" /></div>
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it: pick Photo or Vivid in the stage backdrop switcher.",
        code: `import { PromptInput } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <PromptInput variant="glass" defaultValue="Summarize this thread" />\n  )\n}`,
        render: (
          <PromptInput variant="glass" defaultValue="Summarize this thread" />
        )
      }
    ]
  }
}
