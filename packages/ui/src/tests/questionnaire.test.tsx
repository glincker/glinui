import { fireEvent, render, screen } from "@testing-library/react"
import { vi } from "vitest"

import { Questionnaire, type QuestionnaireQuestion } from "../components/questionnaire"

const questions: QuestionnaireQuestion[] = [
  {
    id: "goal",
    title: "What are you building?",
    options: [
      { value: "app", label: "Web app" },
      { value: "docs", label: "Docs site", description: "Static content" }
    ]
  },
  {
    id: "features",
    title: "Which features?",
    type: "multiple",
    options: [
      { value: "auth", label: "Auth" },
      { value: "billing", label: "Billing" }
    ]
  }
]

describe("Questionnaire", () => {
  it("renders the first step with radio semantics and progress", () => {
    render(<Questionnaire questions={questions} />)
    expect(screen.getByRole("heading", { name: "What are you building?" })).toBeInTheDocument()
    expect(screen.getByRole("radiogroup")).toBeInTheDocument()
    expect(screen.getAllByRole("radio")).toHaveLength(2)
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "Step 1 of 2")
  })

  it("blocks Next until a required answer is chosen", () => {
    render(<Questionnaire questions={questions} />)
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled()
    fireEvent.click(screen.getByRole("radio", { name: /Web app/ }))
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled()
  })

  it("single choice replaces the previous selection", () => {
    render(<Questionnaire questions={questions} />)
    fireEvent.click(screen.getByRole("radio", { name: /Web app/ }))
    fireEvent.click(screen.getByRole("radio", { name: /Docs site/ }))
    expect(screen.getByRole("radio", { name: /Web app/ })).not.toBeChecked()
    expect(screen.getByRole("radio", { name: /Docs site/ })).toBeChecked()
  })

  it("walks through steps, supports Back, and submits all answers", () => {
    const onSubmit = vi.fn()
    const onStepChange = vi.fn()
    render(<Questionnaire questions={questions} onSubmit={onSubmit} onStepChange={onStepChange} submitLabel="Finish" />)
    fireEvent.click(screen.getByRole("radio", { name: /Web app/ }))
    fireEvent.click(screen.getByRole("button", { name: "Next" }))
    expect(onStepChange).toHaveBeenCalledWith(1)
    expect(screen.getByRole("group", { name: "Which features?" })).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Back" }))
    expect(screen.getByRole("radio", { name: /Web app/ })).toBeChecked()
    fireEvent.click(screen.getByRole("button", { name: "Next" }))

    fireEvent.click(screen.getByRole("checkbox", { name: "Auth" }))
    fireEvent.click(screen.getByRole("checkbox", { name: "Billing" }))
    fireEvent.click(screen.getByRole("checkbox", { name: "Auth" }))
    fireEvent.click(screen.getByRole("button", { name: "Finish" }))
    expect(onSubmit).toHaveBeenCalledWith({ goal: ["app"], features: ["billing"] })
  })

  it("allows skipping optional questions and disables Back on step one", () => {
    const onSubmit = vi.fn()
    render(<Questionnaire questions={[{ ...questions[1], required: false }]} onSubmit={onSubmit} />)
    expect(screen.getByRole("button", { name: "Back" })).toBeDisabled()
    fireEvent.click(screen.getByRole("button", { name: "Submit" }))
    expect(onSubmit).toHaveBeenCalledWith({})
  })

  it("moves focus to the new question heading on step change", () => {
    render(<Questionnaire questions={questions} defaultAnswers={{ goal: ["app"] }} />)
    fireEvent.click(screen.getByRole("button", { name: "Next" }))
    expect(screen.getByRole("heading", { name: "Which features?" })).toHaveFocus()
  })

  it("applies the glass variant", () => {
    const { container } = render(<Questionnaire variant="glass" questions={questions} />)
    expect((container.firstChild as HTMLElement).className).toContain("backdrop-blur")
  })
})
