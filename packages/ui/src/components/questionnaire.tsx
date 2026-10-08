"use client"

import * as React from "react"
import { ArrowLeft, ArrowRight, Check } from "@phosphor-icons/react"

import { cn } from "../lib/cn"
import type { SurfaceTone, SurfaceVariant } from "../lib/surface"
import { containerSurface, resolveSurfaceProps } from "../lib/surface-resolve"
import { useGlinStyle } from "./glin-provider"

export interface QuestionnaireOption {
  value: string
  label: string
  description?: string
}

export interface QuestionnaireQuestion {
  id: string
  title: string
  description?: string
  /** `single` renders radios, `multiple` renders checkboxes. */
  type?: "single" | "multiple"
  options: QuestionnaireOption[]
  /** Defaults to true: Next stays disabled until something is chosen. */
  required?: boolean
}

export type QuestionnaireAnswers = Record<string, string[]>

const QUESTIONNAIRE_BASE = "flex w-full flex-col gap-4 p-4"

export interface QuestionnaireProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSubmit" | "title"> {
  /** Visual variant. Omit for the ambient design style (glinr by default). Vocabulary: glinr, solid, plain, soft, outline, ghost, gradient, glass. */
  variant?: SurfaceVariant | "default" | "raised" | "frosted"
  tone?: SurfaceTone
  questions: QuestionnaireQuestion[]
  onSubmit?: (answers: QuestionnaireAnswers) => void
  onStepChange?: (index: number) => void
  defaultAnswers?: QuestionnaireAnswers
  submitLabel?: string
}

const buttonBase =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-xl px-3.5 text-sm font-medium transition-[background-color,opacity] duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-1)] disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"

const PROGRESS_WIDTH = ["w-0", "w-1/12", "w-2/12", "w-3/12", "w-4/12", "w-5/12", "w-6/12", "w-7/12", "w-8/12", "w-9/12", "w-10/12", "w-11/12", "w-full"] as const

export const Questionnaire = React.forwardRef<HTMLDivElement, QuestionnaireProps>(
  (
    { className, variant, tone, questions, onSubmit, onStepChange, defaultAnswers, submitLabel = "Submit", ...props },
    ref
  ) => {
    const ambient = useGlinStyle()
    const { variant: resolved, tone: aliasTone } = resolveSurfaceProps(variant, ambient, "container")
    const [step, setStep] = React.useState(0)
    const [answers, setAnswers] = React.useState<QuestionnaireAnswers>(defaultAnswers ?? {})
    const headingRef = React.useRef<HTMLHeadingElement | null>(null)
    const mounted = React.useRef(false)
    const groupName = React.useId()

    const total = questions.length
    const question = questions[step]

    React.useEffect(() => {
      if (!mounted.current) {
        mounted.current = true
        return
      }
      headingRef.current?.focus()
    }, [step])

    if (!question) return null

    const selected = answers[question.id] ?? []
    const multiple = question.type === "multiple"
    const required = question.required ?? true
    const canAdvance = !required || selected.length > 0
    const isLast = step === total - 1
    const pctIndex = Math.round(((step + 1) / total) * 12)

    const choose = (value: string) => {
      setAnswers((prev) => {
        const current = prev[question.id] ?? []
        const next = multiple
          ? current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value]
          : [value]
        return { ...prev, [question.id]: next }
      })
    }

    const go = (index: number) => {
      setStep(index)
      onStepChange?.(index)
    }

    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault()
      if (!canAdvance) return
      if (isLast) onSubmit?.(answers)
      else go(step + 1)
    }

    return (
      <div
        ref={ref}
        data-variant={resolved}
        className={cn(
          QUESTIONNAIRE_BASE,
          containerSurface(resolved, { radius: "2xl", elevation: "1", tone: tone ?? aliasTone }),
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-3">
          <div
            role="progressbar"
            aria-label="Questionnaire progress"
            aria-valuemin={1}
            aria-valuemax={total}
            aria-valuenow={step + 1}
            aria-valuetext={`Step ${step + 1} of ${total}`}
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-3)]"
          >
            <div
              className={cn(
                "h-full rounded-full bg-[var(--color-accent)] transition-[width] duration-slow motion-reduce:transition-none",
                PROGRESS_WIDTH[pctIndex]
              )}
            />
          </div>
          <span className="text-xs tabular-nums text-[var(--color-muted)]" aria-hidden="true">
            {step + 1} / {total}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <fieldset className="m-0 min-w-0 border-0 p-0">
            <legend className="mb-3 w-full">
              <h3
                ref={headingRef}
                tabIndex={-1}
                className="text-base font-semibold leading-snug text-[var(--color-foreground)] focus-visible:outline-none"
              >
                {question.title}
              </h3>
              {question.description ? (
                <p className="mt-1 text-sm font-normal text-[var(--color-muted)]">{question.description}</p>
              ) : null}
            </legend>
            <div
              role={multiple ? undefined : "radiogroup"}
              aria-label={multiple ? undefined : question.title}
              className="grid gap-2 sm:grid-cols-2"
            >
              {question.options.map((option) => {
                const checked = selected.includes(option.value)
                return (
                  <label key={option.value} className="relative block cursor-pointer">
                    <input
                      type={multiple ? "checkbox" : "radio"}
                      name={`${groupName}-${question.id}`}
                      value={option.value}
                      checked={checked}
                      onChange={() => choose(option.value)}
                      className="peer sr-only"
                    />
                    <span className="flex h-full items-start gap-3 rounded-xl border border-[var(--line-soft)] bg-[var(--surface-2)] p-3 transition-[border-color,background-color] duration-normal hover:border-accent/50 peer-checked:border-[var(--color-accent)] peer-checked:bg-accent/10 peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-accent)] motion-reduce:transition-none">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "mt-0.5 flex size-4 shrink-0 items-center justify-center border border-[var(--color-muted)] text-[var(--color-accent-foreground)]",
                          multiple ? "rounded" : "rounded-full",
                          checked && "border-[var(--color-accent)] bg-[var(--color-accent)]"
                        )}
                      >
                        {checked ? <Check weight="bold" className="size-3" /> : null}
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <span className="text-sm font-medium text-[var(--color-foreground)]">{option.label}</span>
                        {option.description ? (
                          <span className="text-xs text-[var(--color-muted)]">{option.description}</span>
                        ) : null}
                      </span>
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => go(step - 1)}
              disabled={step === 0}
              className={cn(buttonBase, "text-[var(--color-foreground)] hover:bg-[var(--surface-3)]")}
            >
              <ArrowLeft weight="bold" className="size-4 rtl:-scale-x-100" aria-hidden="true" />
              Back
            </button>
            <button
              type="submit"
              disabled={!canAdvance}
              className={cn(buttonBase, "bg-[var(--color-accent)] text-[var(--color-accent-foreground)] hover:opacity-90")}
            >
              {isLast ? submitLabel : "Next"}
              {isLast ? null : <ArrowRight weight="bold" className="size-4 rtl:-scale-x-100" aria-hidden="true" />}
            </button>
          </div>
        </form>
      </div>
    )
  }
)
Questionnaire.displayName = "Questionnaire"
