"use client"

// Showcase demos for the AI category: a complete chat screen (avatars, actions, reasoning, streaming reply,
// attachments, prompt input) and a questionnaire onboarding flow. Code strings mirror the rendered markup.

import * as React from "react"
import { ArrowsClockwise, Paperclip, ThumbsDown, ThumbsUp } from "@phosphor-icons/react"
import {
  Attachment, Badge, Bubble, Heading, Message, MessageAction, MessageActions, MessageAvatar, MessageContent,
  MessageCopyAction, MessageScroller, PromptInput, Questionnaire, StreamingText, Text, Thinking
} from "@glinui/ui"

import type { ComponentExample } from "@/lib/component-docs"

const SHELL = "flex h-[34rem] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] text-left"
const REPLY = "Revenue grew 12% quarter over quarter, driven mostly by the Pro plan. Churn stayed flat at 1.8%, so the gain came from expansion rather than new logos."

function ChatScreen() {
  return (
    <div className={SHELL}>
      <header className="flex items-center justify-between gap-3 border-b border-[var(--line-soft)] px-4 py-3">
        <div className="flex flex-col">
          <Heading level={2} size="sm">Q3 revenue review</Heading>
          <Text size="sm" variant="muted">Glin assistant, 3 sources</Text>
        </div>
        <Badge tone="success" variant="soft">Online</Badge>
      </header>
      <MessageScroller label="Conversation" className="min-h-0 flex-1">
        <Message role="user">
          <MessageAvatar fallback="MK" alt="" />
          <MessageContent>
            <div className="flex flex-col gap-2">
              <span>Summarize how Q3 went compared with Q2.</span>
              <div className="flex flex-wrap gap-2">
                <Attachment name="q3-revenue.csv" size={48210} />
                <Attachment name="board-notes.pdf" size={1203400} />
              </div>
            </div>
          </MessageContent>
        </Message>
        <Message role="assistant">
          <MessageAvatar fallback="G" alt="" />
          <MessageContent
            actions={
              <MessageActions>
                <MessageCopyAction value={REPLY} />
                <MessageAction label="Regenerate"><ArrowsClockwise /></MessageAction>
                <MessageAction label="Good response" pressed><ThumbsUp /></MessageAction>
                <MessageAction label="Bad response"><ThumbsDown /></MessageAction>
              </MessageActions>
            }
          >
            <div className="flex flex-col gap-2">
              <Thinking active={false} doneLabel="Thought for 4 seconds">Compared monthly totals, then split growth into new and expansion revenue.</Thinking>
              <span>{REPLY}</span>
            </div>
          </MessageContent>
        </Message>
        <Message role="user">
          <MessageAvatar fallback="MK" alt="" />
          <MessageContent>Which regions grew fastest?</MessageContent>
        </Message>
        <Message role="assistant">
          <MessageAvatar fallback="G" alt="" />
          <MessageContent>
            <StreamingText text="Europe led with 19% growth, followed by North America at 11%. APAC was flat after the pricing change in August." speed={30} />
          </MessageContent>
        </Message>
        <Message role="assistant">
          <MessageAvatar fallback="G" alt="" />
          <MessageContent><Thinking /></MessageContent>
        </Message>
      </MessageScroller>
      <div className="border-t border-[var(--line-soft)] p-3">
        <PromptInput
          placeholder="Ask a follow up"
          maxLength={500}
          onSubmit={() => undefined}
          actions={<MessageAction label="Attach file"><Paperclip /></MessageAction>}
        />
      </div>
    </div>
  )
}

const chatCode = `import { ArrowsClockwise, Paperclip, ThumbsDown, ThumbsUp } from "@phosphor-icons/react"
import {
  Attachment, Badge, Heading, Message, MessageAction, MessageActions, MessageAvatar, MessageContent,
  MessageCopyAction, MessageScroller, PromptInput, StreamingText, Text, Thinking
} from "@glinui/ui"

const reply = "${REPLY}"

export function ChatScreen() {
  return (
    <div className="${SHELL}">
      <header className="flex items-center justify-between gap-3 border-b border-[var(--line-soft)] px-4 py-3">
        <div className="flex flex-col">
          <Heading level={2} size="sm">Q3 revenue review</Heading>
          <Text size="sm" variant="muted">Glin assistant, 3 sources</Text>
        </div>
        <Badge tone="success" variant="soft">Online</Badge>
      </header>
      <MessageScroller label="Conversation" className="min-h-0 flex-1">
        <Message role="user">
          <MessageAvatar fallback="MK" alt="" />
          <MessageContent>
            <div className="flex flex-col gap-2">
              <span>Summarize how Q3 went compared with Q2.</span>
              <div className="flex flex-wrap gap-2">
                <Attachment name="q3-revenue.csv" size={48210} />
                <Attachment name="board-notes.pdf" size={1203400} />
              </div>
            </div>
          </MessageContent>
        </Message>
        <Message role="assistant">
          <MessageAvatar fallback="G" alt="" />
          <MessageContent
            actions={
              <MessageActions>
                <MessageCopyAction value={reply} />
                <MessageAction label="Regenerate"><ArrowsClockwise /></MessageAction>
                <MessageAction label="Good response" pressed><ThumbsUp /></MessageAction>
                <MessageAction label="Bad response"><ThumbsDown /></MessageAction>
              </MessageActions>
            }
          >
            <div className="flex flex-col gap-2">
              <Thinking active={false} doneLabel="Thought for 4 seconds">Compared monthly totals, then split growth into new and expansion revenue.</Thinking>
              <span>{reply}</span>
            </div>
          </MessageContent>
        </Message>
        <Message role="user">
          <MessageAvatar fallback="MK" alt="" />
          <MessageContent>Which regions grew fastest?</MessageContent>
        </Message>
        <Message role="assistant">
          <MessageAvatar fallback="G" alt="" />
          <MessageContent>
            <StreamingText text="Europe led with 19% growth, followed by North America at 11%. APAC was flat after the pricing change in August." speed={30} />
          </MessageContent>
        </Message>
        <Message role="assistant">
          <MessageAvatar fallback="G" alt="" />
          <MessageContent><Thinking /></MessageContent>
        </Message>
      </MessageScroller>
      <div className="border-t border-[var(--line-soft)] p-3">
        <PromptInput
          placeholder="Ask a follow up"
          maxLength={500}
          onSubmit={(value) => console.log(value)}
          actions={<MessageAction label="Attach file"><Paperclip /></MessageAction>}
        />
      </div>
    </div>
  )
}`

const THREAD = "flex w-full max-w-md flex-col gap-1 rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-4"

function BubbleThread() {
  return (
    <div className={THREAD}>
      <Bubble align="start" grouped>Hi, your order shipped this morning.</Bubble>
      <Bubble align="start" tail>It should arrive by Thursday.</Bubble>
      <Bubble align="end" variant="accent" grouped>Great, can I change the address?</Bubble>
      <Bubble align="end" variant="accent" tail>It is the old one on Pine Street.</Bubble>
      <Bubble align="start" variant="muted" tail>Yes, until it reaches the depot. Sending a link now.</Bubble>
    </div>
  )
}

const bubbleCode = `import { Bubble } from "@glinui/ui"

export function Thread() {
  return (
    <div className="${THREAD}">
      <Bubble align="start" grouped>Hi, your order shipped this morning.</Bubble>
      <Bubble align="start" tail>It should arrive by Thursday.</Bubble>
      <Bubble align="end" variant="accent" grouped>Great, can I change the address?</Bubble>
      <Bubble align="end" variant="accent" tail>It is the old one on Pine Street.</Bubble>
      <Bubble align="start" variant="muted" tail>Yes, until it reaches the depot. Sending a link now.</Bubble>
    </div>
  )
}`

const ATT = "flex w-full max-w-xl flex-col gap-3 rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-4"

function AttachmentTray() {
  return (
    <div className={ATT}>
      <Text variant="eyebrow">Attached to this message</Text>
      <div className="flex flex-wrap gap-2">
        <Attachment name="q3-revenue.csv" size={48210} onRemove={() => undefined} />
        <Attachment name="board-notes.pdf" size={1203400} onRemove={() => undefined} />
        <Attachment name="architecture.png" size={904000} progress={64} />
        <Attachment name="export.zip" size={5400000} tone="danger" />
      </div>
      <PromptInput placeholder="Add a note" onSubmit={() => undefined} />
    </div>
  )
}

const attachmentCode = `import { Attachment, PromptInput, Text } from "@glinui/ui"

export function AttachmentTray() {
  return (
    <div className="${ATT}">
      <Text variant="eyebrow">Attached to this message</Text>
      <div className="flex flex-wrap gap-2">
        <Attachment name="q3-revenue.csv" size={48210} onRemove={() => {}} />
        <Attachment name="board-notes.pdf" size={1203400} onRemove={() => {}} />
        <Attachment name="architecture.png" size={904000} progress={64} />
        <Attachment name="export.zip" size={5400000} tone="danger" />
      </div>
      <PromptInput placeholder="Add a note" onSubmit={(value) => console.log(value)} />
    </div>
  )
}`

const QUESTIONS = [
  {
    id: "goal", title: "What are you building?", description: "We use this to pick starter templates.",
    options: [
      { value: "app", label: "A web app", description: "Dashboards, tools and admin panels" },
      { value: "docs", label: "A docs site", description: "Content first, searchable" },
      { value: "marketing", label: "A marketing site", description: "Landing pages and campaigns" }
    ]
  },
  {
    id: "team", title: "How big is your team?",
    options: [
      { value: "solo", label: "Just me" },
      { value: "small", label: "2 to 10 people" },
      { value: "large", label: "More than 10" }
    ]
  },
  {
    id: "features", title: "Which features do you need first?", type: "multiple" as const,
    options: [
      { value: "auth", label: "Authentication" },
      { value: "billing", label: "Billing" },
      { value: "search", label: "Search" },
      { value: "ai", label: "AI chat" }
    ]
  }
]

function Onboarding() {
  const [done, setDone] = React.useState<Record<string, string[]> | null>(null)
  return (
    <div className="flex w-full max-w-xl flex-col gap-4 text-left">
      <div className="flex flex-col gap-1">
        <Text variant="eyebrow">Step 1 of 2, account setup</Text>
        <Heading level={2} size="md">Tell us about your project</Heading>
      </div>
      <Questionnaire questions={QUESTIONS} onSubmit={setDone} submitLabel="Create workspace" />
      {done ? <Text size="sm" variant="muted" role="status">Saved: {Object.entries(done).map(([key, value]) => `${key}: ${value.join(", ")}`).join("; ")}</Text> : null}
    </div>
  )
}

const onboardingCode = `"use client"

import { useState } from "react"
import { Heading, Questionnaire, Text, type QuestionnaireAnswers } from "@glinui/ui"

const questions = ${JSON.stringify(QUESTIONS, null, 2).replace(/\n/g, "\n")}

export function Onboarding() {
  const [done, setDone] = useState<QuestionnaireAnswers | null>(null)
  return (
    <div className="flex w-full max-w-xl flex-col gap-4 text-left">
      <div className="flex flex-col gap-1">
        <Text variant="eyebrow">Step 1 of 2, account setup</Text>
        <Heading level={2} size="md">Tell us about your project</Heading>
      </div>
      <Questionnaire questions={questions} onSubmit={setDone} submitLabel="Create workspace" />
      {done ? (
        <Text size="sm" variant="muted" role="status">
          Saved: {Object.entries(done).map(([key, value]) => \`\${key}: \${value.join(", ")}\`).join("; ")}
        </Text>
      ) : null}
    </div>
  )
}`

const ex = (title: string, description: string, code: string, render: React.ReactNode): ComponentExample => ({ title, description, code, render })
const chat = (title: string, description: string) => ex(title, description, chatCode, <ChatScreen />)

export const aiExamples: Record<string, ComponentExample[]> = {
  message: [chat("Chat screen", "Avatars, attachments, a finished reply with actions, a streaming reply and a thinking indicator, above a prompt input.")],
  bubble: [ex("Support thread", "Grouped bubbles share a corner; the last one in a run carries the tail.", bubbleCode, <BubbleThread />), chat("Inside a chat screen", "Message wraps Bubble; this is the full screen.")],
  "message-scroller": [chat("Scrolling log", "MessageScroller keeps the log pinned to the newest turn and shows a jump pill when you scroll up.")],
  "prompt-input": [chat("Composer in a chat", "The prompt input docked under the conversation with an attach action."), ex("With attachments", "Attachment chips above the composer, including an upload in progress and a failed file.", attachmentCode, <AttachmentTray />)],
  attachment: [ex("Attachment tray", "Removable files, an upload at 64 percent and a failed file.", attachmentCode, <AttachmentTray />), chat("In a message", "Attachments inside a user message.")],
  thinking: [chat("Reasoning in a reply", "A collapsed reasoning summary on a finished answer and a live indicator at the bottom.")],
  "streaming-text": [chat("Streaming reply", "The fourth turn streams in with a caret; reduced motion shows it instantly.")],
  questionnaire: [ex("Onboarding flow", "Three steps: single choice cards, another single choice and a multiple choice step, with progress and keyboard radio and checkbox semantics.", onboardingCode, <Onboarding />)]
}
