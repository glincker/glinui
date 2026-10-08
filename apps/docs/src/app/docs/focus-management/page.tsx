import type { Metadata } from "next"

import { CodeBlock } from "@/components/docs/code-block"
import { Callout } from "@/components/docs-pages-b/callout"
import { Checklist, ChecklistItem } from "@/components/docs-pages-b/checklist-item"
import { DoDont } from "@/components/docs-pages-b/do-dont"
import { KbdTable } from "@/components/docs-pages-b/kbd-table"
import { PageHeader } from "@/components/docs-pages-b/page-header"
import { PageSection } from "@/components/docs-pages-b/page-section"
import { RelatedLinks } from "@/components/docs-pages-b/related-links"
import { createDocsMetadata } from "@/lib/docs-metadata"

const dialogFocusSnippet = `import { useRef } from "react"
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalTrigger
} from "@glinui/ui"

export function DeleteDialog() {
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  return (
    <Modal>
      <ModalTrigger asChild>
        <Button ref={triggerRef} variant="destructive">
          Delete project
        </Button>
      </ModalTrigger>
      <ModalContent
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          triggerRef.current?.focus()
        }}
      >
        <ModalHeader>
          <ModalTitle>Delete project</ModalTitle>
          <ModalDescription>This action cannot be undone.</ModalDescription>
        </ModalHeader>
      </ModalContent>
    </Modal>
  )
}`

const skipLinkSnippet = `<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2"
>
  Skip to content
</a>`

const focusRules = [
  "Keep a visible focus ring on every interactive control.",
  "Restore focus to the trigger after closing a modal, sheet, or popover.",
  "Do not trap keyboard users in non-modal surfaces.",
  "Add a skip link for large docs and dashboard pages."
]

export const metadata: Metadata = createDocsMetadata({
  title: "Focus Management Patterns",
  description:
    "Focus restore, skip link, and keyboard patterns for accessible dialogs, sheets, and long pages, with a keyboard reference table.",
  path: "/docs/focus-management",
  keywords: ["focus management", "keyboard accessibility", "modal focus restore", "skip links"]
})

export default function FocusManagementPage() {
  return (
    <main className="space-y-12">
      <PageHeader
        eyebrow="Keyboard UX"
        title="Focus Management Patterns"
        lead="Keep keyboard and assistive technology navigation predictable across modals, popovers, and long pages."
      />

      <PageSection id="rules" title="Focus rules" description="Check these on every interactive flow.">
        <Checklist>
          {focusRules.map((rule) => (
            <ChecklistItem key={rule}>{rule}</ChecklistItem>
          ))}
        </Checklist>
      </PageSection>

      <PageSection id="keyboard" title="Keyboard reference" description="What users expect from common widgets.">
        <KbdTable
          caption="Expected keyboard behavior"
          rows={[
            { keys: ["Tab"], action: "Move focus to the next interactive element", context: "Everywhere" },
            { keys: ["Shift", "Tab"], action: "Move focus to the previous element", context: "Everywhere" },
            { keys: ["Esc"], action: "Close the overlay and return focus to its trigger", context: "Dialog, sheet, popover" },
            { keys: ["Enter"], action: "Activate the focused button or link", context: "Buttons, links" },
            { keys: ["Space"], action: "Activate a button or toggle a checkbox or switch", context: "Buttons, form controls" },
            { keys: ["Arrow keys"], action: "Move between items", context: "Menus, tabs, radio groups" }
          ]}
        />
      </PageSection>

      <PageSection id="do-dont" title="Do and don't">
        <DoDont
          dos={[
            { text: "Use :focus-visible styles so keyboard users see the ring but mouse clicks do not flash it." },
            { text: "Send focus to the dialog title or first field when a modal opens." }
          ]}
          donts={[
            { text: "Remove the outline without a replacement.", code: "button:focus { outline: none; }" },
            { text: "Use positive tabindex values to reorder focus. Fix the DOM order instead." }
          ]}
        />
      </PageSection>

      <PageSection
        id="modal-focus-restore"
        title="Modal Focus Restore Pattern"
        description="The modal traps focus while open. This pattern returns focus to the trigger on close."
      >
        <CodeBlock language="tsx" code={dialogFocusSnippet} />
      </PageSection>

      <PageSection id="skip-link" title="Skip Link Pattern" description="Let keyboard users jump past repeated navigation.">
        <CodeBlock language="tsx" code={skipLinkSnippet} />
        <Callout variant="tip" title="Target needs an id">
          The link only works if an element with <code>id=&quot;main-content&quot;</code> exists, and ideally{" "}
          <code>tabIndex={"{-1}"}</code> so focus lands there.
        </Callout>
      </PageSection>

      <PageSection id="manual-pass" title="Manual test pass">
        <Checklist>
          <ChecklistItem>Press Tab through the whole page and confirm the focus ring never disappears.</ChecklistItem>
          <ChecklistItem>Open and close each dialog and sheet. Focus returns to the control that opened it.</ChecklistItem>
          <ChecklistItem>Press Esc on each overlay and confirm focus lands somewhere valid.</ChecklistItem>
        </Checklist>
      </PageSection>

      <RelatedLinks
        links={[
          { href: "/docs/forms-accessibility", label: "Forms Accessibility" },
          { href: "/docs/screen-reader-testing", label: "Screen Reader Testing" },
          { href: "/docs/color-contrast", label: "Color Contrast" }
        ]}
      />
    </main>
  )
}
