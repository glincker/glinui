"use client"

import { Button, ConfirmAction, PageTemplate, ResponsiveTable, type ResponsiveColumn } from "@glinui/ui"
import type { ComponentDocMeta } from "../component-docs"

type Server = { id: string; name: string; region: string; size: string }

const servers: Server[] = [
  { id: "a", name: "api", region: "fra1", size: "2 vCPU" },
  { id: "b", name: "web", region: "iad1", size: "1 vCPU" },
  { id: "c", name: "worker", region: "fra1", size: "4 vCPU" }
]

const serverColumns: ResponsiveColumn<Server>[] = [
  { id: "name", header: "Name", cell: (row) => row.name },
  { id: "region", header: "Region", cell: (row) => row.region, priority: 2 },
  { id: "size", header: "Size", cell: (row) => row.size, priority: 3 }
]

export const batchCDocs: Record<string, ComponentDocMeta> = {
  "responsive-table": {
    badge: "Primitive / Molecule",
    props: [
      {
        title: "ResponsiveTable",
        rows: [
          { prop: "rows", type: "readonly T[]", description: "Rows to render." },
          { prop: "columns", type: "ResponsiveColumn<T>[]", description: "Column definitions: id, header, cell, priority (1, 2 or 3), primary, width, align, hideInCard, cardLabel." },
          { prop: "getRowId", type: "(row: T) => string", description: "Stable key for each row." },
          { prop: "ariaLabel", type: "string", description: "Accessible name of the table or card list." },
          { prop: "leading", type: "{ header?, cell, width? }", description: "Fixed leading cell such as a logo tile or checkbox." },
          { prop: "actions", type: "(row: T) => ResponsiveTableAction[]", description: "Row actions, collapsed into one kebab menu." },
          { prop: "actionsLabel", type: "(row: T) => string", defaultValue: "Row actions", description: "Accessible name of the kebab trigger." },
          { prop: "renderActions", type: "(row: T) => ReactNode", description: "Escape hatch for actions that are not a plain menu." },
          { prop: "onRowClick", type: "(row: T) => void", description: "Makes rows focusable and activates them with Enter or Space." },
          { prop: "getRowProps", type: "(row: T) => ResponsiveRowProps", description: "className, aria-current and data-kind per row." },
          { prop: "focusRowId", type: "string", description: "Scrolls this row into view when the id changes." },
          { prop: "stackBelow", type: '"sm" | "md" | "lg" | "none"', defaultValue: "md", description: "Viewport width below which rows stack into cards." },
          { prop: "horizontalScroll", type: "boolean", defaultValue: "false", description: "Scroll sideways instead of fitting the container." },
          { prop: "scrollHeightClass", type: "string", defaultValue: "max-h-[70vh]", description: "Tailwind max-height class of the scroll area." },
          { prop: "variant", type: "TableProps[\"variant\"]", defaultValue: "ambient", description: "Surface look of the table wrapper." },
          { prop: "labels", type: "Partial<{ rowActions, actionsColumn, leadingColumn }>", description: "Strings for screen reader text. English defaults." }
        ]
      },
      {
        title: "VirtualResponsiveTable (@glinui/ui/responsive-table-virtual)",
        rows: [
          { prop: "virtualizeOver", type: "number", defaultValue: "50", description: "Windowing starts when rows exceed this." },
          { prop: "estimateRowHeight", type: "number", defaultValue: "56", description: "Row height estimate in px before measurement." },
          { prop: "scrollRef", type: "MutableRefObject<HTMLElement | null>", description: "Receives the scrolling element so a page can drive it." }
        ]
      }
    ],
    accessibility: {
      summary: [
        "Wide layouts render a real table with column headers. Narrow layouts render a labelled list with a term and value pair per field.",
        "Rows with `onRowClick` are focusable and keep the visible focus ring. Clicks that start on a link or button inside the row are ignored.",
        "The kebab trigger has an accessible name per row. Set `actionsLabel` so each name says which row it belongs to.",
        "The virtual table announces the full row count with `aria-rowcount`."
      ],
      keyboard: [
        { key: "Tab", description: "Moves focus to the next row or control." },
        { key: "Enter", description: "Activates the focused row or the focused menu item." },
        { key: "Space", description: "Activates the focused row." },
        { key: "Arrow keys", description: "Move through the row action menu." }
      ],
      aria: ["`aria-label` on the table or list", "`aria-rowcount` when windowed", "`aria-current` through `getRowProps`"]
    },
    reducedMotion: {
      description: "The table has no motion of its own. Row hover uses a colour transition only.",
      affected: []
    },
    notes: [
      "Column priorities use CSS container queries on the table container, so a table in a narrow sidebar drops columns even on a wide screen. This needs no Tailwind plugin.",
      "Importing `ResponsiveTable` from `@glinui/ui` never pulls in `@tanstack/react-virtual`. Install it and import `VirtualResponsiveTable` from `@glinui/ui/responsive-table-virtual` for lists longer than a few hundred rows."
    ],
    examples: [
      {
        title: "Column priorities",
        description: "Priority 2 columns appear from a 42rem container, priority 3 from 56rem. Below the md breakpoint rows become cards.",
        code: `import { ResponsiveTable, type ResponsiveColumn } from "@glinui/ui"\n\ntype Server = { id: string; name: string; region: string; size: string }\n\nconst columns: ResponsiveColumn<Server>[] = [\n  { id: "name", header: "Name", cell: (row) => row.name },\n  { id: "region", header: "Region", cell: (row) => row.region, priority: 2 },\n  { id: "size", header: "Size", cell: (row) => row.size, priority: 3 }\n]\n\nexport function Demo({ servers }: { servers: Server[] }) {\n  return <ResponsiveTable rows={servers} columns={columns} getRowId={(row) => row.id} ariaLabel="Servers" />\n}`,
        render: <ResponsiveTable rows={servers} columns={serverColumns} getRowId={(row) => row.id} ariaLabel="Servers" />
      },
      {
        title: "Row actions",
        description: "Actions collapse into one kebab menu per row.",
        code: `import { ResponsiveTable } from "@glinui/ui"\n\nexport function Demo({ servers, columns }) {\n  return (\n    <ResponsiveTable\n      rows={servers}\n      columns={columns}\n      getRowId={(row) => row.id}\n      ariaLabel="Servers"\n      actionsLabel={(row) => \`Actions for \${row.name}\`}\n      actions={(row) => [\n        { id: "restart", label: "Restart", onSelect: () => restart(row.id) },\n        { id: "delete", label: "Delete", tone: "destructive", separatorBefore: true, onSelect: () => remove(row.id) }\n      ]}\n    />\n  )\n}`,
        render: (
          <ResponsiveTable
            rows={servers}
            columns={serverColumns}
            getRowId={(row) => row.id}
            ariaLabel="Servers with actions"
            actionsLabel={(row) => `Actions for ${row.name}`}
            actions={() => [
              { id: "restart", label: "Restart" },
              { id: "delete", label: "Delete", tone: "destructive", separatorBefore: true }
            ]}
          />
        )
      }
    ]
  },
  "page-template": {
    badge: "Primitive / Molecule",
    props: [
      { prop: "title", type: "ReactNode", description: "Page title, rendered as the h1." },
      { prop: "description", type: "ReactNode", description: "Lead text under the title." },
      { prop: "eyebrow", type: "ReactNode", description: "Small mono label above the title." },
      { prop: "logo", type: "ReactNode", description: "A 48px brand tile. Wins over `icon`." },
      { prop: "icon", type: "ReactNode", description: "Icon rendered in a neutral 48px tile." },
      { prop: "status", type: "ReactNode", description: "Status badge beside the title." },
      { prop: "actions", type: "ReactNode", description: "Primary actions, right-aligned from `sm` up." },
      { prop: "helpHref", type: "string", description: "Renders a help link beside the title when set." },
      { prop: "helpLabel", type: "string", defaultValue: "Help", description: "Accessible name of the help link." },
      { prop: "breadcrumb", type: "ReactNode", description: "Breadcrumb trail above the hero." },
      { prop: "tabs", type: "ReactNode", description: "Tab list or link navigation under the hero." },
      { prop: "banners", type: "ReactNode", description: "Page-level banners between the hero and the content." },
      { prop: "width", type: '"default" | "wide" | "full"', defaultValue: "default", description: "Content max width. Reads `--glinr-content-max` and `--glinr-content-max-wide` with 72rem and 90rem fallbacks." },
      { prop: "LinkComponent", type: "ElementType", defaultValue: "a", description: "Component for the help link, for example a router link." }
    ],
    accessibility: {
      summary: [
        "The title is the only h1 on the page.",
        "The icon tile is decorative and hidden from assistive technology.",
        "The help link gets its accessible name from `helpLabel`, pass a translated string."
      ]
    },
    reducedMotion: {
      description: "PageTemplate has no animation.",
      affected: []
    },
    notes: ["Spacing reads `--glinr-page-gap` from `@glinui/tokens` and falls back to 1.5rem when the variable is not defined."],
    examples: [
      {
        title: "Hero with actions",
        code: `import { Button, PageTemplate } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <PageTemplate\n      eyebrow="Infrastructure"\n      title="Servers"\n      description="Machines your apps run on."\n      helpHref="/docs/servers"\n      actions={<Button>Add server</Button>}\n    >\n      <p>Content</p>\n    </PageTemplate>\n  )\n}`,
        render: (
          <PageTemplate
            eyebrow="Infrastructure"
            title="Servers"
            description="Machines your apps run on."
            helpHref="#"
            actions={<Button>Add server</Button>}
          >
            <p className="text-sm">Content</p>
          </PageTemplate>
        )
      }
    ]
  },
  "confirm-action": {
    badge: "Primitive / Molecule",
    props: [
      { prop: "trigger", type: "(open: () => void) => ReactNode", description: "Renders the control that opens the dialog." },
      { prop: "title", type: "ReactNode", description: "Dialog title." },
      { prop: "description", type: "ReactNode", description: "Optional supporting text." },
      { prop: "consequences", type: "[string, ...string[]]", description: "Required. At least one line saying what the action will do." },
      { prop: "confirmLabel", type: "string", defaultValue: "Confirm", description: "Confirm button text." },
      { prop: "cancelLabel", type: "string", defaultValue: "Cancel", description: "Cancel button text." },
      { prop: "pendingLabel", type: "string", description: "Confirm button text while `pending`." },
      { prop: "typedConfirm", type: "string", description: "User must type this exact value to enable confirm." },
      { prop: "typedConfirmLabel", type: "(value: string) => ReactNode", description: "Label of the typed field. Defaults to `Type <value> to confirm`." },
      { prop: "pending", type: "boolean", defaultValue: "false", description: "Disables confirm while the action runs." },
      { prop: "error", type: "string | null", description: "Failure message shown in the dialog." },
      { prop: "tone", type: '"destructive" | "default"', defaultValue: "destructive", description: "Confirm button look." },
      { prop: "onConfirm", type: "(close: () => void) => void", description: "Call `close` once the action succeeded. The dialog stays open until then." },
      { prop: "onOpenChange", type: "(open: boolean) => void", description: "Fires on open and close, for resetting mutation state." },
      { prop: "variant", type: "PanelVariantProp", defaultValue: "ambient", description: "Panel look. Glass stays opt-in." }
    ],
    accessibility: {
      summary: [
        "Built on AlertDialog: role alertdialog, focus is trapped and starts on Cancel so the destructive path is never the default.",
        "The description is linked with aria-describedby.",
        "Pressing Enter in the typed field submits only when the value matches."
      ],
      keyboard: [
        { key: "Escape", description: "Closes the dialog and returns focus to the trigger." },
        { key: "Enter", description: "Confirms from the typed field when the value matches." },
        { key: "Tab", description: "Cycles through the field and the buttons." }
      ],
      aria: ["`role=\"alertdialog\"`", "`aria-describedby` to the description", "`aria-busy` on confirm while pending"]
    },
    reducedMotion: {
      description: "Overlay and content animations collapse to instant transitions under prefers-reduced-motion.",
      affected: ["opacity", "transform"]
    },
    examples: [
      {
        title: "Typed confirmation",
        description: "For irreversible actions. Confirm stays disabled until the name is typed exactly.",
        code: `import { Button, ConfirmAction } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <ConfirmAction\n      trigger={(open) => <Button variant="destructive" onClick={open}>Delete web</Button>}\n      title="Delete web?"\n      consequences={["The container is removed", "Its logs are dropped"]}\n      typedConfirm="web"\n      confirmLabel="Delete web"\n      onConfirm={(close) => {\n        remove().then(close)\n      }}\n    />\n  )\n}`,
        render: (
          <ConfirmAction
            trigger={(open) => (
              <Button variant="destructive" onClick={open}>
                Delete web
              </Button>
            )}
            title="Delete web?"
            consequences={["The container is removed", "Its logs are dropped"]}
            typedConfirm="web"
            confirmLabel="Delete web"
            onConfirm={() => {}}
          />
        )
      }
    ]
  }
}
