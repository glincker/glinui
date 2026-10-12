import { Banner, Button, Display, Eyebrow, FormSection, Input, Lede, StickySaveBar } from "@glinui/ui"

import type { ComponentDocMeta } from "../component-docs"

const TOKEN_NOTE =
  "Display, Eyebrow and Lede read the optional --glinr-font-display, --glinr-display-weight and --glinr-font-eyebrow variables from @glinui/tokens and fall back to the surrounding font."

export const upstreamComponentDocs: Pick<Record<string, ComponentDocMeta>, "banner" | "form-section" | "typography"> = {
  banner: {
    badge: "Primitive / Molecule",
    props: [
      { prop: "variant", type: '"info" | "success" | "warning" | "critical" | "promo"', defaultValue: "info", description: "Meaning and tone. `critical` is announced assertively, the others politely." },
      { prop: "title", type: "ReactNode", description: "Required headline." },
      { prop: "titleAs", type: '"h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span"', defaultValue: "p", description: "Element used for the title. Pick a heading level that fits the page outline." },
      { prop: "eyebrow", type: "ReactNode", description: "Small label above the title." },
      { prop: "icon", type: "ReactNode", description: "Replaces the variant icon." },
      { prop: "action", type: "ReactNode", description: "Right aligned button or link." },
      { prop: "dismissId", type: "string", description: "Stable id. Makes the banner dismissible and keeps it dismissed through the storage adapter." },
      { prop: "onDismiss", type: "() => void", description: "Called after dismissal. Also makes the banner dismissible." },
      { prop: "dismissLabel", type: "string", defaultValue: "Dismiss", description: "Accessible name of the dismiss button. Pass a translated string." },
      { prop: "storage", type: "BannerStorage | null", defaultValue: "localStorage", description: "Adapter with getItem and setItem. Pass null to skip persistence." },
      { prop: "storageKey", type: "string", defaultValue: "glinui.banners.dismissed.v1", description: "Key holding the JSON array of dismissed ids." }
    ],
    accessibility: {
      summary: [
        "info, success, warning and promo render role=status with aria-live=polite. critical renders role=alert with aria-live=assertive.",
        "The variant icon is decorative and hidden from assistive technology. The title carries the meaning.",
        "The dismiss button is a native button with an accessible name, reachable and operable with Tab, Enter and Space.",
        "Dismissal removes the banner from the DOM. Persist it with dismissId so it does not return on the next visit."
      ],
      keyboard: [
        { key: "Tab", description: "Moves focus to the action and then the dismiss button." },
        { key: "Enter / Space", description: "Activates the focused button." }
      ],
      aria: ['role="status" or role="alert" by variant', "aria-live matches the role", "aria-label on the dismiss button"]
    },
    reducedMotion: { description: "Static component with no motion.", affected: [] },
    notes: [
      "Colors come from the --tone-* and --surface-* variables in @glinui/tokens. The banner is flat: a hairline border and a tinted face, no gradient, glow or glass."
    ],
    examples: [
      {
        title: "Variants",
        code: `import { Banner } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="space-y-3">\n      <Banner variant="info" title="Scheduled maintenance">Saturday 02:00 to 03:00 UTC.</Banner>\n      <Banner variant="success" title="Deploy finished" />\n      <Banner variant="warning" title="Certificate expires in 5 days" />\n      <Banner variant="critical" title="Database unreachable">Writes are failing.</Banner>\n      <Banner variant="promo" eyebrow="New" title="Previews for every pull request" />\n    </div>\n  )\n}`,
        render: (
          <div className="space-y-3">
            <Banner variant="info" title="Scheduled maintenance">Saturday 02:00 to 03:00 UTC.</Banner>
            <Banner variant="success" title="Deploy finished" />
            <Banner variant="warning" title="Certificate expires in 5 days" />
            <Banner variant="critical" title="Database unreachable">Writes are failing.</Banner>
            <Banner variant="promo" eyebrow="New" title="Previews for every pull request" />
          </div>
        )
      },
      {
        title: "Dismissible with an action",
        description: "A dismissId persists the choice in localStorage. Pass `storage` to use your own adapter, for example a cookie or an account setting.",
        code: `import { Banner, Button } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Banner\n      variant="promo"\n      dismissId="plans-2026"\n      title="Team plans are here"\n      action={<Button size="sm">See plans</Button>}\n    >\n      Invite your team and share environments.\n    </Banner>\n  )\n}`,
        render: (
          <Banner variant="promo" title="Team plans are here" onDismiss={() => {}} action={<Button size="sm">See plans</Button>}>
            Invite your team and share environments.
          </Banner>
        )
      }
    ]
  },

  "form-section": {
    badge: "Primitive / Molecule",
    props: [
      {
        title: "FormSection",
        rows: [
          { prop: "title", type: "ReactNode", description: "Required section heading. Labels the section region." },
          { prop: "titleAs", type: '"h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span"', defaultValue: "h2", description: "Heading element for the title." },
          { prop: "description", type: "ReactNode", description: "Supporting copy in the left column." },
          { prop: "badge", type: "ReactNode", description: "Small element beside the title." },
          { prop: "hint", type: "ReactNode", description: "Secondary note or link under the description." },
          { prop: "error", type: "ReactNode", description: "Section level error, rendered with role=alert under the fields." }
        ]
      },
      {
        title: "StickySaveBar",
        rows: [
          { prop: "dirty", type: "boolean", description: "Required. The bar renders only while dirty or saving." },
          { prop: "saving", type: "boolean", defaultValue: "false", description: "Disables the actions and shows the saving label." },
          { prop: "onSave", type: "() => void", description: "Required. Called by the save button." },
          { prop: "onReset", type: "() => void", description: "Adds a discard button when provided." },
          { prop: "testSlot", type: "ReactNode", description: "Secondary action such as Test connection. Stays enabled while dirty." },
          { prop: "message", type: "ReactNode", description: "Status text. Defaults to unsavedMessage." },
          { prop: "saveLabel / discardLabel / savingLabel", type: "string", defaultValue: "Save changes / Discard / Saving...", description: "Button labels. Pass translated strings." },
          { prop: "unsavedMessage", type: "string", defaultValue: "You have unsaved changes.", description: "Default status text." },
          { prop: "label", type: "string", defaultValue: "Unsaved changes", description: "Accessible name of the region." }
        ]
      }
    ],
    accessibility: {
      summary: [
        "FormSection is a section element labelled by its title, so it appears as a named region.",
        "A section error uses role=alert and is announced when it appears.",
        "StickySaveBar is a labelled region with a polite live status line. Focus order is test slot, discard, save.",
        "Actions are native buttons, so Enter and Space work and disabled states are exposed."
      ],
      keyboard: [
        { key: "Tab", description: "Moves through the test slot, discard and save buttons." },
        { key: "Enter / Space", description: "Activates the focused button." }
      ]
    },
    reducedMotion: { description: "Static components with no motion.", affected: [] },
    examples: [
      {
        title: "Two column section with a save bar",
        description: "The description sits left and the fields right from the lg breakpoint, one column below.",
        code: `import { FormSection, Input, StickySaveBar, Button } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <form>\n      <FormSection title="Webhook" description="Where we send deploy events.">\n        <Input aria-label="Endpoint URL" placeholder="https://example.com/hooks" />\n      </FormSection>\n      <StickySaveBar dirty onSave={() => {}} onReset={() => {}} testSlot={<Button variant="outline" size="sm">Send test</Button>} />\n    </form>\n  )\n}`,
        render: (
          <form>
            <FormSection title="Webhook" description="Where we send deploy events.">
              <Input aria-label="Endpoint URL" placeholder="https://example.com/hooks" />
            </FormSection>
            <StickySaveBar dirty onSave={() => {}} onReset={() => {}} testSlot={<Button variant="outline" size="sm">Send test</Button>} />
          </form>
        )
      }
    ]
  },

  typography: {
    badge: "Primitive / Atom",
    props: [
      {
        title: "Display",
        rows: [
          { prop: "as", type: '"h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span"', defaultValue: "h2", description: "Rendered element." },
          { prop: "size", type: '"lg" | "2xl" | "3xl" | "4xl"', defaultValue: "2xl", description: "Type scale. 3xl and 4xl step up at the sm breakpoint." }
        ]
      },
      { title: "Eyebrow", rows: [{ prop: "dot", type: "boolean", defaultValue: "true", description: "Leading accent dot." }] },
      { title: "Lede", rows: [{ prop: "className", type: "string", description: "Merged onto the paragraph." }] }
    ],
    accessibility: {
      summary: [
        "Display renders a real heading element. Choose `as` to keep a logical outline instead of picking by size.",
        "Eyebrow is a paragraph and its dot is hidden from assistive technology.",
        "Lede is a paragraph in muted foreground. Keep it within the AA contrast the tokens guarantee."
      ]
    },
    reducedMotion: { description: "No motion.", affected: [] },
    notes: [TOKEN_NOTE],
    examples: [
      {
        title: "Heading with eyebrow and lede",
        code: `import { Display, Eyebrow, Lede } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="space-y-2">\n      <Eyebrow>Deployments</Eyebrow>\n      <Display as="h1" size="3xl">Ship from a git push</Display>\n      <Lede>Roll back to the previous release in one click.</Lede>\n    </div>\n  )\n}`,
        render: (
          <div className="space-y-2">
            <Eyebrow>Deployments</Eyebrow>
            <Display as="h1" size="3xl">Ship from a git push</Display>
            <Lede>Roll back to the previous release in one click.</Lede>
          </div>
        )
      }
    ]
  }
}
