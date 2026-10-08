import { render, screen } from "@testing-library/react"

import { Select } from "../index"

describe("Select", () => {
  it("renders combobox semantics", () => {
    render(
      <Select
        aria-label="Framework"
        placeholder="Choose framework"
        options={[
          { label: "React", value: "react" },
          { label: "Vue", value: "vue" }
        ]}
      />
    )

    expect(screen.getByRole("combobox", { name: "Framework" })).toBeVisible()
  })

  it("supports placeholder and disabled options", () => {
    render(
      <Select
        aria-label="Status"
        placeholder="Select status"
        options={[
          { label: "Active", value: "active" },
          { label: "Paused", value: "paused", disabled: true }
        ]}
      />
    )

    expect(screen.getByRole("option", { name: "Select status" })).toBeDisabled()
    expect(screen.getByRole("option", { name: "Paused" })).toBeDisabled()
  })

  it("applies liquid variant and size", () => {
    render(
      <Select
        data-testid="select"
        variant="liquid"
        size="lg"
        options={[{ label: "A", value: "a" }]}
      />
    )
    const select = screen.getByTestId("select")
    expect(select.className).toContain("radial-gradient")
    expect(select.className).toContain("h-10")
  })

  it("supports disabled attribute", () => {
    render(
      <Select
        data-testid="disabled-select"
        disabled
        options={[{ label: "A", value: "a" }]}
      />
    )
    expect(screen.getByTestId("disabled-select")).toBeDisabled()
  })
})
