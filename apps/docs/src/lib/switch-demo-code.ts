const comp = (k: "switch" | "glass") => (k === "glass" ? "GlassToggle" : "Switch")

/** Code strings kept next to the demos so docs stay in sync. */
export function demoCode(kind: "switch" | "glass") {
  const N = comp(kind)
  return {
    matrix: `import { ${N} } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="grid grid-cols-3 gap-4">\n      {(["sm", "md", "lg"] as const).map((size) => (\n        <div key={size} className="flex flex-col items-center gap-3">\n          <${N} aria-label="Off" size={size} />\n          <${N} aria-label="On" size={size} defaultChecked />\n          <${N} aria-label="Disabled" size={size} disabled />\n          <${N} aria-label="Disabled on" size={size} disabled defaultChecked />\n        </div>\n      ))}\n    </div>\n  )\n}`,
    icons: `import { ${N} } from "@glinui/ui"\nimport { Moon, Sun } from "@phosphor-icons/react"\n\nexport function Demo() {\n  return (\n    <>\n      <${N} aria-label="Theme" size="lg" defaultChecked onIcon={<Moon weight="fill" />} offIcon={<Sun weight="fill" />} />\n      <${N} aria-label="Labels" size="lg" showLabels defaultChecked />\n    </>\n  )\n}`,
    rows: `import { ${N} } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <>\n      <${N} label="Wi-Fi" description="Join known networks automatically." defaultChecked />\n      <${N} label="Notifications" description="Banners, sounds and badges." />\n    </>\n  )\n}`,
    loading: `import { useState } from "react"\nimport { ${N} } from "@glinui/ui"\n\nexport function Demo() {\n  const [on, setOn] = useState(false)\n  const [busy, setBusy] = useState(false)\n  return (\n    <${N}\n      aria-label="Save on toggle"\n      checked={on}\n      loading={busy}\n      onCheckedChange={(next) => {\n        setBusy(true)\n        setTimeout(() => { setOn(next); setBusy(false) }, 1200)\n      }}\n    />\n  )\n}`,
    controlled: `import { useState } from "react"\nimport { ${N} } from "@glinui/ui"\n\nexport function Demo() {\n  const [on, setOn] = useState(false)\n  return (\n    <>\n      <${N} aria-label="Controlled" checked={on} onCheckedChange={setOn} />\n      <output>checked: {String(on)}</output>\n    </>\n  )\n}`,
    form: `import { ${N} } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <form onSubmit={(e) => {\n      e.preventDefault()\n      console.log(Object.fromEntries(new FormData(e.currentTarget)))\n    }}>\n      <${N} aria-label="Wi-Fi" name="wifi" defaultChecked />\n      <${N} aria-label="Alerts" name="alerts" value="yes" />\n      <button type="submit">Submit</button>\n    </form>\n  )\n}`
  }
}
