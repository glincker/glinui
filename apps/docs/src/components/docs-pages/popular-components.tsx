import Link from "next/link"

import { Badge, Button, Chip, Progress, Switch } from "@glinui/ui"

type Tile = { id: string; name: string; demo: React.ReactNode }

const tiles: Tile[] = [
  {
    id: "button",
    name: "Button",
    demo: (
      <>
        <Button size="sm" tabIndex={-1}>
          Save
        </Button>
        <Button size="sm" variant="outline" tabIndex={-1}>
          Cancel
        </Button>
      </>
    )
  },
  { id: "badge", name: "Badge", demo: <Badge>New</Badge> },
  { id: "chip", name: "Chip", demo: <Chip>React</Chip> },
  { id: "switch", name: "Switch", demo: <Switch defaultChecked aria-label="Example switch" tabIndex={-1} /> },
  {
    id: "progress",
    name: "Progress",
    demo: (
      <div className="w-24">
        <Progress value={64} aria-label="Example progress" />
      </div>
    )
  }
]

/** Strip of real, rendered components linking to their doc pages. */
export function PopularComponents() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {tiles.map((tile) => (
        <li key={tile.id}>
          <Link
            href={`/docs/components/${tile.id}`}
            className="flex h-full flex-col gap-3 rounded-card border border-line-soft bg-surface-1 p-3 transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand motion-reduce:transition-none"
          >
            <div className="pointer-events-none flex h-16 items-center justify-center gap-2 rounded-input bg-surface-well shadow-elev-inset">
              {tile.demo}
            </div>
            <span className="text-sm font-medium">{tile.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
