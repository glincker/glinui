import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useState } from "react"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  REGEXP_ONLY_DIGITS_AND_CHARS
} from "../components/input-otp"

function Basic(props: Partial<React.ComponentProps<typeof InputOTP>>) {
  return (
    <InputOTP maxLength={6} {...props}>
      <InputOTPGroup>
        {[0, 1, 2].map((i) => <InputOTPSlot key={i} index={i} />)}
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        {[3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} />)}
      </InputOTPGroup>
    </InputOTP>
  )
}

const slots = (container: HTMLElement) =>
  Array.from(container.querySelectorAll("[data-slot=input-otp-slot]"))

describe("InputOTP", () => {
  it("renders one accessible input and aria-hidden slots", () => {
    const { container } = render(<Basic />)
    const input = screen.getByLabelText("Verification code")
    expect(input).toHaveAttribute("autocomplete", "one-time-code")
    expect(input).toHaveAttribute("inputmode", "numeric")
    expect(input).toHaveAttribute("maxlength", "6")
    expect(slots(container)).toHaveLength(6)
    slots(container).forEach((s) => expect(s).toHaveAttribute("aria-hidden", "true"))
    expect(screen.getByRole("separator")).toBeInTheDocument()
  })

  it("accepts a custom aria-label", () => {
    render(<Basic aria-label="Enter code" />)
    expect(screen.getByLabelText("Enter code")).toBeInTheDocument()
  })

  it("types digits into slots, uncontrolled, and calls onChange and onComplete", async () => {
    const onChange = vi.fn()
    const onComplete = vi.fn()
    const { container } = render(<Basic onChange={onChange} onComplete={onComplete} />)
    const input = screen.getByLabelText("Verification code")
    await userEvent.click(input)
    await userEvent.keyboard("123456")
    expect(slots(container).map((s) => s.textContent)).toEqual(["1", "2", "3", "4", "5", "6"])
    expect(onChange).toHaveBeenLastCalledWith("123456")
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith("123456")
  })

  it("rejects characters that do not match the pattern", async () => {
    const { container } = render(<Basic />)
    await userEvent.click(screen.getByLabelText("Verification code"))
    await userEvent.keyboard("1a2b")
    expect(slots(container).map((s) => s.textContent).join("")).toBe("12")
  })

  it("supports alphanumeric patterns", async () => {
    const { container } = render(<Basic pattern={REGEXP_ONLY_DIGITS_AND_CHARS} />)
    const input = screen.getByLabelText("Verification code")
    expect(input).toHaveAttribute("inputmode", "text")
    await userEvent.click(input)
    await userEvent.keyboard("a1B")
    expect(slots(container).map((s) => s.textContent).join("")).toBe("a1B")
  })

  it("handles paste, truncating to maxLength and rejecting invalid text", async () => {
    const onChange = vi.fn()
    const { container } = render(<Basic onChange={onChange} />)
    const input = screen.getByLabelText("Verification code")
    await userEvent.click(input)
    await userEvent.paste("12345678")
    expect(slots(container).map((s) => s.textContent).join("")).toBe("123456")
    onChange.mockClear()
    fireEvent.change(input, { target: { value: "" } })
    await userEvent.click(input)
    await userEvent.paste("abc")
    expect(onChange).not.toHaveBeenCalledWith("abc")
  })

  it("handles backspace", async () => {
    const { container } = render(<Basic defaultValue="123" />)
    await userEvent.click(screen.getByLabelText("Verification code"))
    await userEvent.keyboard("{Backspace}")
    expect(slots(container).map((s) => s.textContent).join("")).toBe("12")
  })

  it("marks the active slot on focus and clears on blur", async () => {
    const { container } = render(<Basic defaultValue="12" />)
    const input = screen.getByLabelText("Verification code")
    await userEvent.click(input)
    await vi.waitFor(() => expect(slots(container)[2]).toHaveAttribute("data-active", "true"))
    await userEvent.tab()
    expect(slots(container)[2]).toHaveAttribute("data-active", "false")
  })

  it("moves the caret with arrow keys", async () => {
    const { container } = render(<Basic defaultValue="123" />)
    await userEvent.click(screen.getByLabelText("Verification code"))
    await vi.waitFor(() => expect(slots(container)[3]).toHaveAttribute("data-active", "true"))
    await userEvent.keyboard("{ArrowLeft}")
    await vi.waitFor(() => expect(slots(container)[2]).toHaveAttribute("data-active", "true"))
    await userEvent.keyboard("{Home}")
    await vi.waitFor(() => expect(slots(container)[0]).toHaveAttribute("data-active", "true"))
  })

  it("works controlled", async () => {
    function Controlled() {
      const [v, setV] = useState("")
      return (
        <>
          <Basic value={v} onChange={setV} />
          <output data-testid="out">{v}</output>
        </>
      )
    }
    render(<Controlled />)
    await userEvent.click(screen.getByLabelText("Verification code"))
    await userEvent.keyboard("987")
    expect(screen.getByTestId("out")).toHaveTextContent("987")
  })

  it("supports variants, disabled, invalid state and className merge", () => {
    const { container } = render(
      <Basic variant="glass" size="lg" disabled aria-invalid containerClassName="wrap" className="inp" />
    )
    expect(screen.getByLabelText("Verification code")).toBeDisabled()
    expect(screen.getByLabelText("Verification code")).toHaveAttribute("aria-invalid", "true")
    expect(screen.getByLabelText("Verification code").className).toContain("inp")
    expect(container.querySelector("[data-slot=input-otp]")?.className).toContain("wrap")
    const first = slots(container)[0]
    expect(first.className).toContain("backdrop-blur-xl")
    expect(first.className).toContain("h-10")
    expect(first).toHaveAttribute("data-invalid", "true")
  })

  it("throws when a slot is used outside InputOTP", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<InputOTPSlot index={0} />)).toThrow()
    spy.mockRestore()
  })
})
