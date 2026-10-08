import type { ComponentExample } from "@/lib/component-docs"
import {
  Button,
  Modal,
  ModalClose,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger
} from "@glinui/ui"
import { StageModalContent } from "@/components/docs/overlay-demos"

const code = `import { Button, Modal, ModalClose, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle, ModalTrigger } from "@glinui/ui"

export function Demo() {
  return (
    <Modal>
      <ModalTrigger asChild><Button variant="outline">Open glass modal</Button></ModalTrigger>
      <ModalContent variant="glass">
        <ModalHeader>
          <ModalTitle>Share workspace</ModalTitle>
          <ModalDescription>The page behind stays visible through the panel.</ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <ModalClose asChild><Button variant="ghost">Cancel</Button></ModalClose>
          <Button>Share</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}`

/** Glass variant of Modal. Pick a backdrop in the stage header to see it refract the content behind. */
export const modalGlassExample: ComponentExample = {
  title: "Glass (opt-in)",
  description: "variant=\"glass\" is opt-in. It blurs and tints whatever sits behind the panel, so it needs a colourful or photographic backdrop: switch the stage backdrop to see it.",
  code,
  render: (
    <Modal>
      <ModalTrigger asChild><Button variant="outline">Open glass modal</Button></ModalTrigger>
      <StageModalContent variant="glass">
        <ModalHeader>
          <ModalTitle>Share workspace</ModalTitle>
          <ModalDescription>The page behind stays visible through the panel.</ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <ModalClose asChild><Button variant="ghost">Cancel</Button></ModalClose>
          <Button>Share</Button>
        </ModalFooter>
      </StageModalContent>
    </Modal>
  )
}
