"use client"

import * as React from "react"

// Namespace import: avoids the dev server barrel-export cache for freshly added exports.
import * as Glin from "@glinui/ui"
import type { SurfaceTone, SurfaceVariant } from "@glinui/ui"
import { VariantMatrix } from "@/components/variants/variant-matrix"

const {
  Badge,
  Code,
  Message,
  MessageContent,
  SURFACE_TONES,
  SURFACE_VARIANTS,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} = Glin

const VARIANTS = SURFACE_VARIANTS as readonly string[]
const TONES = SURFACE_TONES as readonly string[]

/** Variant x tone grid for Badge, rendered once per theme scope. */
export function BadgeFamilyMatrix() {
  return (
    <VariantMatrix
      label="Badge variants by tone"
      variants={VARIANTS}
      tones={TONES}
      render={(variant, tone) => (
        <Badge variant={variant as SurfaceVariant} tone={tone as SurfaceTone}>
          {tone ?? variant}
        </Badge>
      )}
    />
  )
}

/** Variant grid for Code (inline and block). */
export function CodeFamilyMatrix() {
  return (
    <VariantMatrix
      label="Code variants"
      variants={[...VARIANTS, "block"]}
      render={(variant) => <Code variant={variant as SurfaceVariant | "block"}>pnpm add @glinui/ui</Code>}
    />
  )
}

/** Variant grid for Message (assistant bubble), one conversation turn per cell. */
export function MessageFamilyMatrix() {
  return (
    <VariantMatrix
      label="Message variants"
      variants={VARIANTS}
      render={(variant) => (
        <Message variant={variant as SurfaceVariant} className="mt-0">
          <MessageContent>Assistant reply</MessageContent>
        </Message>
      )}
    />
  )
}

/** Variant grid for Table with a two row sample. */
export function TableFamilyMatrix() {
  return (
    <VariantMatrix
      label="Table variants"
      variants={VARIANTS}
      render={(variant) => (
        <Table variant={variant as SurfaceVariant} containerClassName="min-w-48">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Glin UI</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Registry</TableCell>
              <TableCell>Paused</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    />
  )
}
