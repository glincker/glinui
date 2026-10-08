import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Input } from "../components/input"
import {
  Field,
  FieldContent,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet
} from "../components/field"

describe("Field", () => {
  it("wires label, description and control via generated ids", () => {
    render(
      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldControl>
          <Input />
        </FieldControl>
        <FieldDescription>We never share it.</FieldDescription>
      </Field>
    )
    const input = screen.getByLabelText("Email")
    expect(input).toHaveAttribute("id")
    const desc = screen.getByText("We never share it.")
    expect(input).toHaveAttribute("aria-describedby", desc.id)
    expect(input).not.toHaveAttribute("aria-invalid")
  })

  it("omits aria-describedby when no description or error exists", () => {
    render(
      <Field>
        <FieldLabel>Name</FieldLabel>
        <FieldControl>
          <Input />
        </FieldControl>
      </Field>
    )
    expect(screen.getByLabelText("Name")).not.toHaveAttribute("aria-describedby")
  })

  it("shows errors with role alert, sets aria-invalid and describes the control", () => {
    render(
      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldControl>
          <Input />
        </FieldControl>
        <FieldDescription>Hint</FieldDescription>
        <FieldError>Email is required</FieldError>
      </Field>
    )
    const input = screen.getByLabelText("Email")
    const alert = screen.getByRole("alert")
    expect(alert).toHaveTextContent("Email is required")
    expect(input).toHaveAttribute("aria-invalid", "true")
    expect(input.getAttribute("aria-describedby")).toContain(alert.id)
    expect(input.getAttribute("aria-describedby")).toContain(screen.getByText("Hint").id)
  })

  it("renders FieldError from an errors array and de-duplicates", () => {
    render(
      <Field invalid>
        <FieldControl>
          <Input aria-label="x" />
        </FieldControl>
        <FieldError errors={[{ message: "Too short" }, { message: "Too short" }, { message: "No digits" }]} />
      </Field>
    )
    expect(screen.getAllByRole("listitem")).toHaveLength(2)
  })

  it("renders nothing for an empty FieldError", () => {
    render(
      <Field>
        <FieldControl>
          <Input aria-label="x" />
        </FieldControl>
        <FieldError errors={[]} />
      </Field>
    )
    expect(screen.queryByRole("alert")).toBeNull()
    expect(screen.getByLabelText("x")).not.toHaveAttribute("aria-invalid")
  })

  it("invalid prop marks the control invalid and the field", () => {
    render(
      <Field invalid data-testid="f">
        <FieldLabel>Name</FieldLabel>
        <FieldControl>
          <Input />
        </FieldControl>
      </Field>
    )
    expect(screen.getByLabelText("Name")).toHaveAttribute("aria-invalid", "true")
    expect(screen.getByTestId("f")).toHaveAttribute("data-invalid", "true")
  })

  it("propagates disabled and keeps the user's own aria-describedby", () => {
    render(
      <Field disabled>
        <FieldLabel>Name</FieldLabel>
        <FieldControl aria-describedby="custom">
          <Input />
        </FieldControl>
        <FieldDescription>Hi</FieldDescription>
      </Field>
    )
    const input = screen.getByLabelText("Name")
    expect(input).toBeDisabled()
    expect(input.getAttribute("aria-describedby")).toMatch(/^custom /)
  })

  it("label click focuses the control", async () => {
    render(
      <Field>
        <FieldLabel>Name</FieldLabel>
        <FieldControl>
          <Input />
        </FieldControl>
      </Field>
    )
    await userEvent.click(screen.getByText("Name"))
    expect(screen.getByLabelText("Name")).toHaveFocus()
  })

  it("supports orientation, className and unique ids per field", () => {
    render(
      <>
        <Field orientation="horizontal" className="mine" data-testid="h">
          <FieldContent>
            <FieldLabel>A</FieldLabel>
          </FieldContent>
          <FieldControl><Input /></FieldControl>
        </Field>
        <Field>
          <FieldLabel>B</FieldLabel>
          <FieldControl><Input /></FieldControl>
        </Field>
      </>
    )
    expect(screen.getByTestId("h").className).toContain("flex-row")
    expect(screen.getByTestId("h").className).toContain("mine")
    expect(screen.getByLabelText("A").id).not.toBe(screen.getByLabelText("B").id)
  })

  it("renders FieldSet with legend, group and separator", () => {
    render(
      <FieldSet>
        <FieldLegend>Profile</FieldLegend>
        <FieldGroup>
          <Field><FieldLabel>One</FieldLabel><FieldControl><Input /></FieldControl></Field>
          <FieldSeparator>or</FieldSeparator>
        </FieldGroup>
      </FieldSet>
    )
    expect(screen.getByRole("group", { name: "Profile" })).toBeInTheDocument()
    expect(screen.getByRole("separator")).toHaveTextContent("or")
  })
})
