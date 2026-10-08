"use client"

import { useState } from "react"
import { Attachment } from "@glinui/ui"
import { Questionnaire, type QuestionnaireAnswers, type QuestionnaireQuestion } from "@glinui/ui"
import { StreamingText } from "@glinui/ui"
import { Thinking } from "@glinui/ui"
import type { ComponentDocMeta } from "@/lib/component-docs"

const sampleQuestions: QuestionnaireQuestion[] = [
  {
    id: "goal",
    title: "What are you building?",
    description: "Pick one.",
    options: [
      { value: "app", label: "Web app", description: "Dashboards and tools" },
      { value: "docs", label: "Docs site", description: "Content first" },
      { value: "marketing", label: "Marketing page" }
    ]
  },
  {
    id: "features",
    title: "Which features do you need?",
    description: "Select all that apply.",
    type: "multiple",
    options: [
      { value: "auth", label: "Authentication" },
      { value: "billing", label: "Billing" },
      { value: "search", label: "Search" },
      { value: "ai", label: "AI chat" }
    ]
  }
]

function QuestionnaireDemo({ variant }: { variant?: "default" | "glass" }) {
  const [answers, setAnswers] = useState<QuestionnaireAnswers | null>(null)
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <Questionnaire variant={variant} questions={sampleQuestions} onSubmit={setAnswers} />
      {answers ? <pre className="rounded-xl bg-[var(--surface-3)] p-3 text-xs">{JSON.stringify(answers)}</pre> : null}
    </div>
  )
}

function ThinkingDemo() {
  const [active, setActive] = useState(true)
  return (
    <div className="flex flex-col items-start gap-3">
      <Thinking active={active} doneLabel="Thought for 4 seconds">
        Compared the token surfaces, checked contrast in both themes, then picked the solid default.
      </Thinking>
      <button
        type="button"
        onClick={() => setActive((a) => !a)}
        className="rounded-lg border border-[var(--line-soft)] px-3 py-1.5 text-sm hover:bg-[var(--surface-3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
      >
        {active ? "Finish" : "Restart"}
      </button>
    </div>
  )
}

function StreamingDemo() {
  const [run, setRun] = useState(0)
  const [done, setDone] = useState(false)
  return (
    <div className="flex max-w-md flex-col items-start gap-3 text-sm">
      <p key={run} className="min-h-12">
        <StreamingText text="Glin UI streams text one character at a time and shows a caret until it is done." speed={25} onDone={() => setDone(true)} />
      </p>
      <button
        type="button"
        onClick={() => {
          setDone(false)
          setRun((r) => r + 1)
        }}
        className="rounded-lg border border-[var(--line-soft)] px-3 py-1.5 hover:bg-[var(--surface-3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
      >
        Replay
      </button>
      <span className="text-xs text-[var(--color-muted)]">{done ? "onDone fired" : "Streaming..."}</span>
    </div>
  )
}

function AttachmentRow() {
  const [files, setFiles] = useState([
    { name: "design-tokens.json", size: 18432 },
    { name: "mockup.png", size: 2411724 },
    { name: "handoff.pdf", size: 954321 }
  ])
  return (
    <div className="flex flex-wrap gap-2">
      {files.map((f) => (
        <Attachment key={f.name} name={f.name} size={f.size} onRemove={() => setFiles((all) => all.filter((x) => x.name !== f.name))} />
      ))}
      {files.length === 0 ? <span className="text-sm text-[var(--color-muted)]">All removed</span> : null}
    </div>
  )
}

export const batch4bDocs: Record<string, ComponentDocMeta> = {
  attachment: {
    badge: "Primitive / Molecule",
    props: [
      { prop: "name", type: "string", description: "File name. Required." },
      { prop: "size", type: "number", description: "Size in bytes, formatted automatically." },
      { prop: "type", type: "string", description: "MIME type, used with the extension to choose the icon." },
      { prop: "progress", type: "number", description: "0 to 100. Below 100 shows a progress bar." },
      { prop: "previewUrl", type: "string", description: "Image source for thumbnails." },
      { prop: "display", type: '"chip" | "thumbnail"', defaultValue: "chip", description: "Row chip or square image tile." },
      { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "ambient (glinr)", description: "Surface variant. Omit to follow the ambient design style (glinr by default, plain for minimal, glass for glass)." },
      { prop: "tone", type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"', defaultValue: "neutral", description: "Colour tone for the vocabulary variants." },
      { prop: "onRemove", type: "() => void", description: "Renders a remove button labelled with the file name." }
    ],
    accessibility: {
      summary: [
        "Upload progress is exposed as role=\"progressbar\" with aria-valuenow.",
        "The remove button is named \"Remove <file name>\".",
        "Thumbnail images use the file name as alt text; chip icons are decorative."
      ],
      keyboard: [{ key: "Enter / Space", description: "Activate the remove button." }],
      aria: ['`role="progressbar"` with `aria-valuenow`', "`aria-label` on the remove button"]
    },
    reducedMotion: {
      description: "Progress width changes animate only when motion is allowed.",
      affected: ["width", "background-color"]
    },
    examples: [
      {
        title: "Chips",
        description: "Icons follow the file type. Remove a chip to try the callback.",
        code: `import { useState } from "react"\nimport { Attachment } from "@glinui/ui"\n\nexport function Demo() {\n  const [files, setFiles] = useState([\n    { name: "design-tokens.json", size: 18432 },\n    { name: "mockup.png", size: 2411724 },\n    { name: "handoff.pdf", size: 954321 }\n  ])\n  return (\n    <div className="flex flex-wrap gap-2">\n      {files.map((f) => (\n        <Attachment key={f.name} name={f.name} size={f.size} onRemove={() => setFiles((all) => all.filter((x) => x.name !== f.name))} />\n      ))}\n    </div>\n  )\n}`,
        render: <AttachmentRow />
      },
      {
        title: "Variants",
        description: "Every vocabulary variant on the default tone. Omit variant to follow the ambient design style.",
        code: `import { Attachment } from "@glinui/ui"

export function AttachmentVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Attachment variant="glinr" name="glinr.pdf" size={24000} />
      <Attachment variant="solid" name="solid.pdf" size={24000} />
      <Attachment variant="plain" name="plain.pdf" size={24000} />
      <Attachment variant="soft" name="soft.pdf" size={24000} />
      <Attachment variant="outline" name="outline.pdf" size={24000} />
      <Attachment variant="ghost" name="ghost.pdf" size={24000} />
      <Attachment variant="gradient" name="gradient.pdf" size={24000} />
    </div>
  )
}`,
        render: (
          <div className="flex flex-wrap items-center gap-3">
            <Attachment variant="glinr" name="glinr.pdf" size={24000} />
            <Attachment variant="solid" name="solid.pdf" size={24000} />
            <Attachment variant="plain" name="plain.pdf" size={24000} />
            <Attachment variant="soft" name="soft.pdf" size={24000} />
            <Attachment variant="outline" name="outline.pdf" size={24000} />
            <Attachment variant="ghost" name="ghost.pdf" size={24000} />
            <Attachment variant="gradient" name="gradient.pdf" size={24000} />
          </div>
        )
      },
      {
        title: "Uploading and thumbnail",
        code: `import { Attachment } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="flex flex-wrap items-center gap-3">\n      <Attachment name="video.mp4" progress={62} />\n      <Attachment name="photo.png" display="thumbnail" previewUrl="/photo.png" onRemove={() => {}} />\n      <Attachment name="notes.txt" display="thumbnail" progress={30} />\n    </div>\n  )\n}`,
        render: (
          <div className="flex flex-wrap items-center gap-3">
            <Attachment name="video.mp4" progress={62} />
            <Attachment name="photo.png" display="thumbnail" onRemove={() => {}} />
            <Attachment name="notes.txt" display="thumbnail" progress={30} />
          </div>
        )
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it. Switch the preview stage to Vivid or Photo to see the frosted surface.",
        code: `import { Attachment } from "@glinui/ui"

export function AttachmentGlassDemo() {
  return (
    <Attachment variant="glass" name="glass.pdf" size={24000} />
  )
}`,
        render: (
          <Attachment variant="glass" name="glass.pdf" size={24000} />
        )
      }
    ]
  },

  thinking: {
    badge: "Primitive / Molecule",
    props: [
      { prop: "active", type: "boolean", defaultValue: "true", description: "Working state. False shows the done label." },
      { prop: "indicator", type: '"dots" | "shimmer"', defaultValue: "dots", description: "Animated dots or pulsing text." },
      { prop: "label / doneLabel", type: "string", defaultValue: '"Thinking" / "Thought process"', description: "Text for each state." },
      { prop: "children", type: "ReactNode", description: "Reasoning details. Makes the header a disclosure button." },
      { prop: "open / defaultOpen / onOpenChange", type: "boolean / callback", description: "Controlled or uncontrolled disclosure." }
    ],
    accessibility: {
      summary: [
        "Active state without details is a role=\"status\" element so assistive tech announces it.",
        "With details the header is a native button using aria-expanded and aria-controls.",
        "Dots are decorative (aria-hidden); the label carries the meaning."
      ],
      keyboard: [{ key: "Enter / Space", description: "Toggle the reasoning details." }],
      aria: ['`role="status"` while active', "`aria-expanded` and `aria-controls` on the toggle"]
    },
    reducedMotion: {
      description: "Pulse animation is removed under reduced motion. Dots stay visible at reduced opacity.",
      affected: ["opacity", "transform"]
    },
    examples: [
      {
        title: "Indicators",
        code: `import { Thinking } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="flex flex-col items-start gap-3">\n      <Thinking />\n      <Thinking indicator="shimmer" label="Reasoning" />\n      <Thinking active={false} doneLabel="Thought for 4 seconds" />\n    </div>\n  )\n}`,
        render: (
          <div className="flex flex-col items-start gap-3">
            <Thinking />
            <Thinking indicator="shimmer" label="Reasoning" />
            <Thinking active={false} doneLabel="Thought for 4 seconds" />
          </div>
        )
      },
      {
        title: "Collapsible reasoning",
        code: `import { useState } from "react"\nimport { Thinking } from "@glinui/ui"\n\nexport function Demo() {\n  const [active, setActive] = useState(true)\n  return (\n    <div className="flex flex-col items-start gap-3">\n      <Thinking active={active} doneLabel="Thought for 4 seconds">\n        Compared the token surfaces, checked contrast in both themes, then picked the solid default.\n      </Thinking>\n      <button type="button" onClick={() => setActive((a) => !a)}>{active ? "Finish" : "Restart"}</button>\n    </div>\n  )\n}`,
        render: <ThinkingDemo />
      }
    ]
  },

  "streaming-text": {
    badge: "Primitive / Molecule",
    props: [
      { prop: "text", type: "string", description: "Full target text. Extending it keeps streaming from the current position." },
      { prop: "speed", type: "number", defaultValue: "24", description: "Milliseconds per character." },
      { prop: "instant", type: "boolean", defaultValue: "false", description: "Skip the animation." },
      { prop: "caret", type: "boolean", defaultValue: "true", description: "Blinking caret while revealing." },
      { prop: "onDone", type: "() => void", description: "Fires once per completed text." }
    ],
    accessibility: {
      summary: [
        "The full text is present immediately in a visually hidden node, so screen readers do not hear character-by-character noise.",
        "The animated copy and caret are aria-hidden.",
        "Under reduced motion the text renders instantly and onDone still fires."
      ]
    },
    reducedMotion: {
      description: "Reveal is skipped and the caret blink is disabled.",
      affected: ["text reveal", "caret blink"]
    },
    examples: [
      {
        title: "Basic",
        code: `import { StreamingText } from "@glinui/ui"\n\nexport function Demo() {\n  return <StreamingText text="Glin UI streams text one character at a time." speed={25} onDone={() => console.log("done")} />\n}`,
        render: <StreamingDemo />
      },
      {
        title: "Instant",
        code: `import { StreamingText } from "@glinui/ui"\n\nexport function Demo() {\n  return <StreamingText instant text="Rendered at once." />\n}`,
        render: <StreamingText instant text="Rendered at once." />
      }
    ]
  },

  questionnaire: {
    badge: "Primitive / Organism",
    props: [
      { prop: "questions", type: "QuestionnaireQuestion[]", description: "id, title, description, type (single | multiple), options, required." },
      { prop: "onSubmit", type: "(answers: Record<string, string[]>) => void", description: "Called on the last step with every answer." },
      { prop: "onStepChange", type: "(index: number) => void", description: "Fires when Back or Next changes the step." },
      { prop: "defaultAnswers", type: "Record<string, string[]>", description: "Preselected values." },
      { prop: "submitLabel", type: "string", defaultValue: '"Submit"', description: "Label of the final button." },
      { prop: "variant", type: '"glinr" | "solid" | "plain" | "soft" | "outline" | "ghost" | "gradient" | "glass"', defaultValue: "ambient (glinr)", description: "Surface variant. Omit to follow the ambient design style (glinr by default, plain for minimal, glass for glass)." },
      { prop: "tone", type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"', defaultValue: "neutral", description: "Colour tone for the vocabulary variants." }
    ],
    accessibility: {
      summary: [
        "Options are native radio or checkbox inputs inside labels, so arrow keys, Space and screen reader semantics come for free.",
        "Single choice is a radiogroup named by the question; multiple choice is a labelled fieldset.",
        "Progress is a progressbar with aria-valuetext like \"Step 2 of 3\".",
        "Focus moves to the new question heading after Back or Next."
      ],
      keyboard: [
        { key: "Arrow keys", description: "Move between radio options." },
        { key: "Space", description: "Select an option or toggle a checkbox." },
        { key: "Enter", description: "Next, or submit on the last step." }
      ],
      aria: ['`role="radiogroup"` for single choice', '`role="progressbar"` with `aria-valuetext`']
    },
    reducedMotion: {
      description: "Progress and card transitions are disabled under reduced motion.",
      affected: ["width", "border-color", "background-color"]
    },
    examples: [
      {
        title: "Two step flow",
        description: "One single choice and one multiple choice question.",
        code: `import { useState } from "react"\nimport { Questionnaire, type QuestionnaireAnswers } from "@glinui/ui"\n\nconst questions = [\n  {\n    id: "goal",\n    title: "What are you building?",\n    options: [\n      { value: "app", label: "Web app", description: "Dashboards and tools" },\n      { value: "docs", label: "Docs site", description: "Content first" },\n      { value: "marketing", label: "Marketing page" }\n    ]\n  },\n  {\n    id: "features",\n    title: "Which features do you need?",\n    type: "multiple" as const,\n    options: [\n      { value: "auth", label: "Authentication" },\n      { value: "billing", label: "Billing" },\n      { value: "search", label: "Search" },\n      { value: "ai", label: "AI chat" }\n    ]\n  }\n]\n\nexport function Demo() {\n  const [answers, setAnswers] = useState<QuestionnaireAnswers | null>(null)\n  return (\n    <div className="w-full max-w-xl">\n      <Questionnaire questions={questions} onSubmit={setAnswers} />\n      {answers ? <pre>{JSON.stringify(answers)}</pre> : null}\n    </div>\n  )\n}`,
        render: <QuestionnaireDemo />
      },
      {
        title: "Glass (opt-in)",
        description: "Glass is opt-in and needs a backdrop behind it. Switch the preview stage to Vivid or Photo to see the frosted surface.",
        code: `import { Questionnaire } from "@glinui/ui"\n\n// Same questions as above\nexport function Demo() {\n  return <Questionnaire variant="glass" questions={questions} />\n}`,
        render: (
          <QuestionnaireDemo variant="glass" />
        )
      }
    ]
  }
}
