import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Button, FormSection, StickySaveBar } from "../index"

describe("FormSection", () => {
  it("labels the section with its title", () => {
    render(
      <FormSection title="Profile" description="Public details" hint={<a href="/docs">Docs</a>} badge={<span>Beta</span>}>
        <input aria-label="Name" />
      </FormSection>
    )
    const section = screen.getByRole("region", { name: "Profile" })
    expect(section).toBeVisible()
    expect(screen.getByRole("heading", { level: 2, name: "Profile" })).toBeVisible()
    expect(screen.getByText("Public details")).toBeVisible()
    expect(screen.getByRole("link", { name: "Docs" })).toBeVisible()
    expect(screen.getByText("Beta")).toBeVisible()
  })

  it("is two columns at lg and one below", () => {
    render(
      <FormSection title="Layout" data-testid="section">
        <span>Field</span>
      </FormSection>
    )
    expect(screen.getByTestId("section").className).toContain("lg:grid-cols-")
  })

  it("announces an error with role alert", () => {
    render(
      <FormSection title="Webhook" error="Could not reach the endpoint.">
        <span>Field</span>
      </FormSection>
    )
    expect(screen.getByRole("alert")).toHaveTextContent("Could not reach the endpoint.")
  })

  it("supports a custom heading level", () => {
    render(
      <FormSection title="Deep" titleAs="h4">
        <span>Field</span>
      </FormSection>
    )
    expect(screen.getByRole("heading", { level: 4, name: "Deep" })).toBeVisible()
  })
})

describe("StickySaveBar", () => {
  it("renders nothing when clean and idle", () => {
    const { container } = render(<StickySaveBar dirty={false} onSave={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })

  it("shows a labelled region with the default message when dirty", () => {
    render(<StickySaveBar dirty onSave={() => {}} />)
    expect(screen.getByRole("region", { name: "Unsaved changes" })).toBeVisible()
    expect(screen.getByText("You have unsaved changes.")).toBeVisible()
  })

  it("saves and discards from the keyboard", async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    const onReset = vi.fn()
    render(<StickySaveBar dirty onSave={onSave} onReset={onReset} />)

    await user.tab()
    expect(screen.getByRole("button", { name: "Discard" })).toHaveFocus()
    await user.keyboard("{Enter}")
    expect(onReset).toHaveBeenCalledTimes(1)

    await user.tab()
    expect(screen.getByRole("button", { name: "Save changes" })).toHaveFocus()
    await user.keyboard(" ")
    expect(onSave).toHaveBeenCalledTimes(1)
  })

  it("disables actions while saving but keeps the test slot enabled", () => {
    render(
      <StickySaveBar dirty saving onSave={() => {}} onReset={() => {}} testSlot={<Button>Test connection</Button>} />
    )
    expect(screen.getByRole("button", { name: "Saving..." })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Discard" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Test connection" })).toBeEnabled()
  })

  it("accepts translated labels", () => {
    render(
      <StickySaveBar dirty onSave={() => {}} saveLabel="Guardar" unsavedMessage="Cambios sin guardar" label="Cambios" />
    )
    expect(screen.getByRole("region", { name: "Cambios" })).toBeVisible()
    expect(screen.getByText("Cambios sin guardar")).toBeVisible()
    expect(screen.getByRole("button", { name: "Guardar" })).toBeVisible()
  })
})
