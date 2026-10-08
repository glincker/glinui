"use client"

import * as React from "react"
import {
  AlertDialogContent,
  DropdownMenuContent,
  HoverCardContent,
  ModalContent,
  PopoverContent,
  SheetContent,
  TooltipContent
} from "@glinui/ui"

import { ignoreStageControls, useStageContainer } from "@/components/docs/stage-container"

/*
 * Docs-only wrappers. Previews portal overlays into the preview stage so the stage
 * backdrop sits behind glass surfaces and the scrim is limited to the stage. The
 * dialogs keep Radix modal behavior (focus trap, Escape); interactions with the stage
 * header controls are exempted from outside-dismiss so the backdrop switcher stays
 * usable. Code shown to users uses the plain components without `container`.
 */

type WithoutContainer<T> = Omit<T, "container">

export const StageModalContent = React.forwardRef<
  React.ComponentRef<typeof ModalContent>,
  WithoutContainer<React.ComponentPropsWithoutRef<typeof ModalContent>>
>(({ onInteractOutside, ...props }, ref) => {
  const container = useStageContainer()
  return (
    <ModalContent
      ref={ref}
      container={container}
      onInteractOutside={(event) => {
        ignoreStageControls(event)
        onInteractOutside?.(event)
      }}
      {...props}
    />
  )
})
StageModalContent.displayName = "StageModalContent"

export const StageSheetContent = React.forwardRef<
  React.ComponentRef<typeof SheetContent>,
  WithoutContainer<React.ComponentPropsWithoutRef<typeof SheetContent>>
>(({ onInteractOutside, ...props }, ref) => {
  const container = useStageContainer()
  return (
    <SheetContent
      ref={ref}
      container={container}
      onInteractOutside={(event) => {
        ignoreStageControls(event)
        onInteractOutside?.(event)
      }}
      {...props}
    />
  )
})
StageSheetContent.displayName = "StageSheetContent"

export const StageAlertDialogContent = React.forwardRef<
  React.ComponentRef<typeof AlertDialogContent>,
  WithoutContainer<React.ComponentPropsWithoutRef<typeof AlertDialogContent>>
>((props, ref) => <AlertDialogContent ref={ref} container={useStageContainer()} {...props} />)
StageAlertDialogContent.displayName = "StageAlertDialogContent"

export const StagePopoverContent = React.forwardRef<
  React.ComponentRef<typeof PopoverContent>,
  WithoutContainer<React.ComponentPropsWithoutRef<typeof PopoverContent>>
>((props, ref) => <PopoverContent ref={ref} container={useStageContainer()} {...props} />)
StagePopoverContent.displayName = "StagePopoverContent"

export const StageDropdownMenuContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuContent>,
  WithoutContainer<React.ComponentPropsWithoutRef<typeof DropdownMenuContent>>
>((props, ref) => <DropdownMenuContent ref={ref} container={useStageContainer()} {...props} />)
StageDropdownMenuContent.displayName = "StageDropdownMenuContent"

export const StageHoverCardContent = React.forwardRef<
  React.ComponentRef<typeof HoverCardContent>,
  WithoutContainer<React.ComponentPropsWithoutRef<typeof HoverCardContent>>
>((props, ref) => <HoverCardContent ref={ref} container={useStageContainer()} {...props} />)
StageHoverCardContent.displayName = "StageHoverCardContent"

export const StageTooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipContent>,
  WithoutContainer<React.ComponentPropsWithoutRef<typeof TooltipContent>>
>((props, ref) => <TooltipContent ref={ref} container={useStageContainer()} {...props} />)
StageTooltipContent.displayName = "StageTooltipContent"
